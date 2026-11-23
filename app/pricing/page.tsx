import type { Metadata } from 'next'
import Link from 'next/link'
import SitePricing from '@/components/site/SitePricing'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Eva Tech Studio launch pricing for websites, applications, software, chatbots, trading systems, automation, and maintenance.',
  alternates: { canonical: '/pricing' },
}

export default function PricingPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">Limited-time launch offer</p>
          <h1>Clear pricing. <em>Scope agreed first.</em></h1>
          <p className="ets-lede">Launch prices are calculated from our current rates. The three monthly tiers are shared across services; each project is scoped in writing before work starts, so you know what is included.</p>
        </div>
      </section>
      <section className="ets-section ets-home-pricing">
        <div className="ets-container">
          <SitePricing />
          <p className="ets-muted mt-8 text-center">Need a different scope? <Link href="/contact" className="ets-text-link">Request a custom quote <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </div>
  )
}
