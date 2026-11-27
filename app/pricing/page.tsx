import { createPageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import SitePricing from '@/components/site/SitePricing'
import { BreadcrumbJsonLd } from '@/components/site/JsonLd'

export const metadata = createPageMetadata({
  title: 'Service Pricing and Project Quotes',
  description: 'Explore service-level pricing information and request a written project quote from Eva Tech Studio.',
  path: '/pricing',
})

export default function PricingPage() {
  return (
    <div className="ets-page">
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]} />
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">Service pricing</p>
          <h1>Clear scope. <em>Written quotes.</em></h1>
          <p className="ets-lede">Each service has Starter, Business, and Custom scope options. Prices and package details are published only after they are confirmed; until then, request a quote for your project.</p>
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
