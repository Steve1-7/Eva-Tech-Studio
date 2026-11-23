export interface PricingPlan {
  id: string
  name: string
  price: number
  description: string
  cta: string
  popular: boolean
  sort_order: number
  billing_period: 'monthly' | 'one-time'
  discount_percent: number
}

export function discountedPrice(price: number, discountPercent = 40): number {
  const safeDiscount = Math.min(100, Math.max(0, discountPercent))
  return Math.round((price * (1 - safeDiscount / 100)) / 50) * 50
}

export function formatRand(price: number): string {
  return `R${price.toLocaleString('en-ZA')}`
}

export const defaultPricingPlans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', price: 5000, description: 'For a focused project or a clearly defined monthly engineering need.', cta: 'Get Started', popular: false, sort_order: 0, billing_period: 'monthly', discount_percent: 40 },
  { id: 'growth', name: 'Business', price: 10000, description: 'For broader work with integrations, data flows, or several user journeys.', cta: 'Start Growing →', popular: true, sort_order: 1, billing_period: 'monthly', discount_percent: 40 },
  { id: 'scale', name: 'Custom', price: 17500, description: 'For complex builds that need staged delivery and ongoing technical support.', cta: "Let's Talk", popular: false, sort_order: 2, billing_period: 'monthly', discount_percent: 40 },
  { id: 'website-build', name: 'Website Build', price: 5000, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 0, billing_period: 'one-time', discount_percent: 40 },
  { id: 'brand-identity', name: 'Brand Identity', price: 6000, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 1, billing_period: 'one-time', discount_percent: 40 },
  { id: 'shopify-store', name: 'Shopify Store', price: 7500, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 2, billing_period: 'one-time', discount_percent: 40 },
  { id: 'crm-setup', name: 'CRM Setup', price: 4250, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 3, billing_period: 'one-time', discount_percent: 40 },
  { id: 'seo-audit', name: 'SEO Audit', price: 2250, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 4, billing_period: 'one-time', discount_percent: 40 },
]