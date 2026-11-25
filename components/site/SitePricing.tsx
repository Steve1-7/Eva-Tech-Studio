'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { services } from '@/lib/siteContent'
import {
  DEFAULT_BUDGET_CURRENCY,
  formatZarAsCurrency,
  isBudgetCurrency,
  RATES_UPDATED_AT,
  SUPPORTED_CURRENCIES,
  type BudgetCurrency,
} from '@/config/markets'
import {
  OFFER_DISCOUNT_PERCENT,
  OFFER_END_DATE,
  SERVICE_PRICING,
  isLaunchOfferActive,
  type ServicePricingSlug,
} from '@/config/pricing'

const CURRENCY_COOKIE = 'ets-currency'

export default function SitePricing({
  compact = false,
  defaultCurrency = DEFAULT_BUDGET_CURRENCY,
  excludeServiceSlugs = [],
}: {
  compact?: boolean
  defaultCurrency?: BudgetCurrency
  excludeServiceSlugs?: readonly ServicePricingSlug[]
}) {
  const [currency, setCurrency] = useState<BudgetCurrency>(defaultCurrency)
  const activeOffer = isLaunchOfferActive()
  const availableServices = services.filter((service) => {
    const slug = service.href.replace('/services/', '') as ServicePricingSlug
    return !excludeServiceSlugs.includes(slug)
  })
  const shownServices = compact ? availableServices.slice(0, 3) : availableServices

  useEffect(() => {
    const savedCurrency = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${CURRENCY_COOKIE}=`))
      ?.split('=')[1]

    if (savedCurrency && isBudgetCurrency(savedCurrency)) {
      setCurrency(savedCurrency)
      return
    }

    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CURRENCY_COOKIE}=${defaultCurrency}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  }, [defaultCurrency])

  function updateCurrency(value: string) {
    if (!isBudgetCurrency(value)) return
    setCurrency(value)
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CURRENCY_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  }

  const offerDateLabel = OFFER_END_DATE
    ? new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${OFFER_END_DATE}T12:00:00Z`))
    : null

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {!compact && <p className="ets-eyebrow">Currency display</p>}
          <label className="flex flex-col gap-2 text-sm" htmlFor="pricing-currency">
            <span>Show prices in</span>
            <select
              id="pricing-currency"
              className="form-input min-w-40"
              value={currency}
              onChange={(event) => updateCurrency(event.target.value)}
            >
              {SUPPORTED_CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </label>
        </div>
        <p className="ets-muted max-w-xl text-sm">
          Indicative currency conversion. Rates last updated {RATES_UPDATED_AT}; final scope and price are confirmed in a written proposal.
        </p>
      </div>

      <div className="space-y-10">
        {shownServices.map((service) => {
          const slug = service.href.replace('/services/', '') as ServicePricingSlug
          const servicePricing = SERVICE_PRICING[slug]
          if (!servicePricing) return null

          return (
            <section key={service.href} aria-labelledby={`pricing-${slug}`}>
              <div className="mb-4">
                <p className="ets-eyebrow">{service.tag}</p>
                <h3 id={`pricing-${slug}`} className="ets-subheading">{service.title}</h3>
                {!compact && <p className="ets-muted mt-2">{service.description}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {servicePricing.tiers.map((tier) => {
                  const basePrice = tier.basePriceZar
                  const currentPrice = basePrice === null
                    ? null
                    : activeOffer
                      ? Math.round(basePrice * (1 - OFFER_DISCOUNT_PERCENT / 100))
                      : basePrice

                  return (
                    <article className="ets-price-card" key={`${slug}-${tier.id}`}>
                      <p className="ets-eyebrow">{tier.name}</p>
                      {currentPrice === null ? (
                        <p className="ets-price-now">Request a quote</p>
                      ) : (
                        <>
                          {activeOffer && basePrice !== null && (
                            <p className="ets-price-line">
                              <s>{formatZarAsCurrency(basePrice, currency)}</s>
                              {offerDateLabel && <span> · Offer ends {offerDateLabel}</span>}
                            </p>
                          )}
                          <p className="ets-price-now">
                            From {formatZarAsCurrency(currentPrice, currency)}
                          </p>
                        </>
                      )}
                      {tier.hoursIncluded !== null || tier.deliverables?.length || tier.revisions !== null || tier.supportWindow || tier.notIncluded?.length ? (
                        <dl className="ets-price-description space-y-2">
                          {tier.hoursIncluded !== null && <div><dt className="font-semibold">Hours</dt><dd>{tier.hoursIncluded} included</dd></div>}
                          {tier.deliverables?.length ? <div><dt className="font-semibold">Included</dt><dd>{tier.deliverables.join(', ')}</dd></div> : null}
                          {tier.revisions !== null && <div><dt className="font-semibold">Revisions</dt><dd>{tier.revisions}</dd></div>}
                          {tier.supportWindow && <div><dt className="font-semibold">Support</dt><dd>{tier.supportWindow}</dd></div>}
                          {tier.notIncluded?.length ? <div><dt className="font-semibold">Not included</dt><dd>{tier.notIncluded.join(', ')}</dd></div> : null}
                        </dl>
                      ) : (
                        <p className="ets-price-description">Deliverables, hours, revisions, support, and exclusions are agreed in the written scope.</p>
                      )}
                      <Link className="ets-text-link" href="/contact">Request a quote <span aria-hidden="true">↗</span></Link>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {activeOffer && offerDateLabel && (
        <p className="ets-offer-note">
          Launch offer ends {offerDateLabel}. Final scope and price are confirmed in a written proposal.
        </p>
      )}
    </div>
  )
}
