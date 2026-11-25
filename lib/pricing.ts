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

export const defaultPricingPlans: PricingPlan[] = []
