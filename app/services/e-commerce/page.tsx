import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'E-commerce — Eva Tech Studio',
  description: 'E-commerce platforms and integrations: headless commerce, payments, and conversion optimisation.',
  openGraph: { title: 'E-commerce — Eva Tech Studio', description: 'E-commerce development', url: canonicalUrl('/services/e-commerce'), image: ogUrl('E-commerce — Eva Tech Studio','E-commerce platforms and integrations: headless commerce, payments, and conversion optimisation.') }
}

export default function Page() {
  const benefits = [
    'Conversion:Optimised checkout and UX',
    'Payments:Secure and flexible billing',
    'Headless:Composable commerce integrations',
  ]

  const process = [
    'Catalog and UX strategy',
    'Platform build and integrations',
    'Optimisation and growth',
  ]

  const pricing = [
    { label: 'Storefront', price: '$10k+', desc: 'Small to medium storefronts' },
    { label: 'Platform', price: '$40k+', desc: 'Headless commerce with integrations' },
    { label: 'Enterprise', price: 'Custom', desc: 'Omni-channel commerce and scaling' }
  ]

  const faqs = [
    { q: 'Which commerce platforms do you use?', a: 'We use Shopify, BigCommerce, or headless approaches with custom backends.' },
    { q: 'Do you support marketplaces?', a: 'Yes — integrations with marketplaces and channel management are available.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "E-commerce Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/e-commerce') },
    "description": "E-commerce platforms and integrations: headless commerce, payments, and conversion optimisation.",
  }

  return (
    <>
      <ServiceTemplate
        title="E-commerce"
        subtitle="Commerce built for conversion and scale"
        intro="We deliver e-commerce experiences that convert visitors into customers with reliable payment and fulfilment flows."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Build My Store"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
