export interface PricingPlan {
  id: string
  name: string
  price: number
  description: string
  cta: string
  popular: boolean
  sort_order: number
  billing_period: 'monthly' | 'one-time'
}

export const defaultPricingPlans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', price: 5000, description: 'For businesses ready to establish a strong digital foundation.', cta: 'Get Started', popular: false, sort_order: 0, billing_period: 'monthly' },
  { id: 'growth', name: 'Growth', price: 10000, description: 'For ambitious brands ready to scale fast with integrated, multi-channel growth.', cta: 'Start Growing →', popular: true, sort_order: 1, billing_period: 'monthly' },
  { id: 'scale', name: 'Scale', price: 17500, description: 'Full-service partnership for established brands ready to dominate their market.', cta: "Let's Talk", popular: false, sort_order: 2, billing_period: 'monthly' },
  { id: 'website-build', name: 'Website Build', price: 5000, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 0, billing_period: 'one-time' },
  { id: 'brand-identity', name: 'Brand Identity', price: 6000, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 1, billing_period: 'one-time' },
  { id: 'shopify-store', name: 'Shopify Store', price: 7500, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 2, billing_period: 'one-time' },
  { id: 'crm-setup', name: 'CRM Setup', price: 4250, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 3, billing_period: 'one-time' },
  { id: 'seo-audit', name: 'SEO Audit', price: 2250, description: 'One-time project price.', cta: 'Request a Quote', popular: false, sort_order: 4, billing_period: 'one-time' },
]