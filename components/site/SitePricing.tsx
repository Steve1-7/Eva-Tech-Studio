'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { defaultPricingPlans, discountedPrice, formatRand, type PricingPlan } from '@/lib/pricing'
import { services } from '@/lib/siteContent'

const tierNames = ['Starter', 'Business', 'Custom']
const tierDescriptions = [
  'A focused monthly engineering engagement with clearly defined deliverables.',
  'A broader monthly engagement for projects with integrations or multiple workflows.',
  'A custom monthly scope for complex builds and ongoing technical support.',
]

function normalizePricingPlan(value: unknown): PricingPlan | null {
  if (typeof value !== 'object' || value === null) return null
  const plan = value as Record<string, unknown>
  const price = typeof plan.price === 'number'
    ? plan.price
    : typeof plan.price === 'string' && plan.price.trim()
      ? Number(plan.price)
      : NaN
  const sortOrder = typeof plan.sort_order === 'number' ? plan.sort_order : Number(plan.sort_order)
  if (
    typeof plan.name !== 'string'
    || !Number.isFinite(price)
    || (plan.billing_period !== 'monthly' && plan.billing_period !== 'one-time')
  ) return null

  return {
    id: typeof plan.id === 'string' ? plan.id : plan.name,
    name: plan.name,
    price,
    description: typeof plan.description === 'string' ? plan.description : '',
    cta: typeof plan.cta === 'string' ? plan.cta : 'Request a quote',
    popular: plan.popular === true,
    sort_order: Number.isInteger(sortOrder) ? sortOrder : 0,
    billing_period: plan.billing_period,
    discount_percent: typeof plan.discount_percent === 'number'
      ? plan.discount_percent
      : typeof plan.discount_percent === 'string' && plan.discount_percent.trim()
        ? Number(plan.discount_percent)
        : 40,
  }
}

export default function SitePricing({ compact = false }: { compact?: boolean }) {
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPricingPlans)
  const [sourceNotice, setSourceNotice] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/pricing')
      .then(async (response) => {
        if (!response.ok) throw new Error(`Pricing request failed (${response.status})`)
        const payload: unknown = await response.json()
        if (typeof payload !== 'object' || payload === null || !('plans' in payload) || !Array.isArray(payload.plans)) {
          throw new Error('Pricing response was not in the expected format')
        }
        const validPlans = payload.plans
          .map(normalizePricingPlan)
          .filter((plan): plan is PricingPlan => plan !== null)
        if (validPlans.filter((plan) => plan.billing_period === 'monthly').length < 3) {
          throw new Error('Pricing response did not contain three valid monthly tiers')
        }
        const source = 'source' in payload && typeof payload.source === 'string' ? payload.source : 'unknown'
        if (active) {
          setPlans(validPlans)
          setSourceNotice(source === 'defaults'
            ? 'Showing configured default rates. Confirm the production rate card before launch.'
            : '')
        }
      })
      .catch((error: unknown) => {
        console.error('[PRICING] Could not load current rates; showing configured defaults.', error)
        if (active) setSourceNotice('Current rates could not be loaded. The configured default prices are shown; confirm them before launch.')
      })
    return () => { active = false }
  }, [])

  const monthly = plans
    .filter((plan) => plan.billing_period === 'monthly')
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3)
  const oneTime = plans.filter((plan) => plan.billing_period === 'one-time')

  return (
    <div className="space-y-12">
      {compact ? (
        <div className="grid gap-4 md:grid-cols-3">
          {monthly.map((plan, index) => (
            <article className={`ets-price-card ${index === 1 ? 'featured' : ''}`} key={plan.name}>
              <span className="ets-offer-badge">{plan.discount_percent}% off</span>
              <p className="ets-eyebrow">{tierNames[index]}</p>
              <h3>{tierNames[index]}</h3>
              <p className="ets-price-line"><s>Was {formatRand(plan.price)}</s> <span aria-hidden="true">→</span></p>
              <p className="ets-price-now">Now {formatRand(discountedPrice(plan.price, plan.discount_percent))}<small>/mo</small></p>
              <p className="ets-price-description">{tierDescriptions[index]}</p>
              <Link className="ets-text-link" href="/contact">Discuss this tier <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="ets-pricing-table-wrap" role="region" aria-label="Pricing by service, scroll horizontally if needed" tabIndex={0}>
            <table className="ets-pricing-table">
              <caption className="sr-only">Discounted monthly pricing by engineering service</caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  {tierNames.map((name) => <th key={name} scope="col">{name}</th>)}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.title}>
                    <th scope="row">
                      <Link href={service.href}>{service.title}</Link>
                      <small>Monthly engagement</small>
                    </th>
                    {monthly.map((plan, index) => (
                      <td key={plan.name}>
                        <span className="ets-offer-badge">{plan.discount_percent}% off</span>
                        <s>Was {formatRand(plan.price)}</s>
                        <span className="ets-price-arrow" aria-hidden="true">→</span>
                        <strong>Now {formatRand(discountedPrice(plan.price, plan.discount_percent))}<small>/mo</small></strong>
                        <span className="ets-tier-name">{tierNames[index]}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="ets-maintenance-card">
            <div>
              <p className="ets-eyebrow">Ongoing care</p>
              <h3>Monthly maintenance</h3>
              <p>Updates, monitoring, fixes, and agreed improvements. Choose a monthly tier after we review your stack and support needs.</p>
              <div className="ets-maintenance-options">
                {monthly.map((plan, index) => (
                  <div key={plan.name}>
                    <span>{tierNames[index]}</span>
                    <em className="ets-offer-badge">{plan.discount_percent}% off</em>
                    <s>Was {formatRand(plan.price)}/mo</s>
                    <span className="ets-price-arrow" aria-hidden="true">→</span>
                    <strong>Now {formatRand(discountedPrice(plan.price, plan.discount_percent))}/mo</strong>
                  </div>
                ))}
              </div>
            </div>
            <Link className="ets-button secondary" href="/contact">Scope maintenance</Link>
          </section>

          {oneTime.length > 0 && (
            <section>
              <div className="mb-5">
                <p className="ets-eyebrow">One-time items</p>
                <h2 className="ets-subheading">Current fixed-price services</h2>
                <p className="ets-muted">Limited-time launch offer</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {oneTime.map((plan) => (
                  <article className="ets-one-time-card" key={plan.id}>
                    <strong>{plan.name}</strong>
                    <span className="ets-offer-badge">{plan.discount_percent}% off</span>
                    <s>Was {formatRand(plan.price)}</s>
                    <span className="ets-price-arrow" aria-hidden="true">→</span>
                    <b>Now {formatRand(discountedPrice(plan.price, plan.discount_percent))}</b>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      {sourceNotice && <p className="ets-pricing-source-note" role="status">{sourceNotice}</p>}
      <p className="ets-offer-note">Limited-time launch offer. Final scope and pricing are confirmed in a written proposal.</p>
    </div>
  )
}
