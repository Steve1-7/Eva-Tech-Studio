import type { BudgetCurrency } from '@/config/markets'

export type PricingTier = {
  id: 'starter' | 'business' | 'custom'
  name: string
  currency: 'ZAR'
  basePriceZar: number | null
  hoursIncluded: number | null
  deliverables: readonly string[] | null
  revisions: number | null
  supportWindow: string | null
  notIncluded: readonly string[] | null
}

export type ServicePricing = {
  serviceName: string
  tiers: readonly PricingTier[]
}

const tierDefinitions = [
  { id: 'starter', name: 'Starter' },
  { id: 'business', name: 'Business' },
  { id: 'custom', name: 'Custom' },
] as const

function unconfirmedTiers(): readonly PricingTier[] {
  return tierDefinitions.map((tier) => ({
    ...tier,
    currency: 'ZAR',
    // TODO(price): Add only a service-specific price approved for publication.
    basePriceZar: null,
    // TODO(confirm): Confirm hours, deliverables, revision limits, support, and exclusions for each tier.
    hoursIncluded: null,
    deliverables: null,
    revisions: null,
    supportWindow: null,
    notIncluded: null,
  }))
}

export const SERVICE_PRICING = {
  'website-development': { serviceName: 'Website Development', tiers: unconfirmedTiers() },
  'web-applications': { serviceName: 'Web App Development', tiers: unconfirmedTiers() },
  'mobile-app-development': { serviceName: 'Mobile App Development', tiers: unconfirmedTiers() },
  'custom-software': { serviceName: 'Custom Software', tiers: unconfirmedTiers() },
  'ai-chatbots': { serviceName: 'AI Chatbot Development', tiers: unconfirmedTiers() },
  'trading-bots': { serviceName: 'Trading Bot Engineering', tiers: unconfirmedTiers() },
  automation: { serviceName: 'Automation and Integrations', tiers: unconfirmedTiers() },
} satisfies Record<string, ServicePricing>

export type ServicePricingSlug = keyof typeof SERVICE_PRICING
export type PricingCurrency = BudgetCurrency

// TODO(confirm): Set this only after the launch offer's published end date is approved.
export const OFFER_END_DATE: string | null = null
export const OFFER_DISCOUNT_PERCENT = 40

export function isLaunchOfferActive(now = new Date()): boolean {
  if (!OFFER_END_DATE) return false
  const endOfOffer = new Date(`${OFFER_END_DATE}T23:59:59.999Z`)
  return Number.isFinite(endOfOffer.getTime()) && now.getTime() <= endOfOffer.getTime()
}
