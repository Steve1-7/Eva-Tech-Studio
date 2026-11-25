'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DEFAULT_BUDGET_CURRENCY,
  formatZarAsCurrency,
  isBudgetCurrency,
  type BudgetCurrency,
} from '@/config/markets'
import { OFFER_DISCOUNT_PERCENT, OFFER_END_DATE, SERVICE_PRICING, isLaunchOfferActive, type ServicePricingSlug } from '@/config/pricing'

const CURRENCY_COOKIE = 'ets-currency'

export default function ServicePrice({ slug, serviceName }: { slug: ServicePricingSlug; serviceName: string }) {
  const [currency, setCurrency] = useState<BudgetCurrency>(DEFAULT_BUDGET_CURRENCY)
  const prices = SERVICE_PRICING[slug].tiers
    .map((tier) => tier.basePriceZar)
    .filter((price): price is number => price !== null)
  const startingPrice = prices.length > 0 ? Math.min(...prices) : null
  const activeOffer = isLaunchOfferActive()
  const currentPrice = startingPrice !== null && activeOffer
    ? Math.round(startingPrice * (1 - OFFER_DISCOUNT_PERCENT / 100))
    : startingPrice
  const offerDateLabel = OFFER_END_DATE
    ? new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${OFFER_END_DATE}T12:00:00Z`))
    : null

  useEffect(() => {
    const savedCurrency = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${CURRENCY_COOKIE}=`))
      ?.split('=')[1]
    if (savedCurrency && isBudgetCurrency(savedCurrency)) setCurrency(savedCurrency)
  }, [])

  return (
    <section className="ets-section ets-home-pricing" aria-labelledby={`price-${slug}`}>
      <div className="ets-container">
        <p className="ets-eyebrow">Pricing</p>
        <h2 id={`price-${slug}`}>{currentPrice === null ? 'Request a quote' : `From ${formatZarAsCurrency(currentPrice, currency)}`}</h2>
        {activeOffer && startingPrice !== null && offerDateLabel && (
          <p className="ets-price-line">
            <s>{formatZarAsCurrency(startingPrice, currency)}</s> · Launch offer ends {offerDateLabel}
          </p>
        )}
        <p>Deliverables, assumptions, and the final price for {serviceName} are confirmed in a written proposal before work begins.</p>
        {/* TODO(price): Add an approved service-specific starting rate to config/pricing.ts. */}
        <Link className="ets-button secondary" href="/contact">Request a quote <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  )
}
