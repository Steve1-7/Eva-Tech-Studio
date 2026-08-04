import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Startup MVP Development — Eva Tech Studio',
  description: 'MVPs that validate ideas quickly with product-market fit focus and fast iteration.',
  openGraph: { title: 'Startup MVP Development — Eva Tech Studio', description: 'MVP development', url: canonicalUrl('/services/startup-mvp-development'), image: ogUrl('Startup MVP Development — Eva Tech Studio','MVPs that validate ideas quickly with product-market fit focus and fast iteration.') }
}

export default function Page() {
  const benefits = [
    'Speed:Rapid delivery to test hypotheses',
    'Focus:Core features that validate demand',
    'Guidance:Product and growth advice',
  ]

  const process = [
    'Problem validation and roadmap',
    'MVP build and launch',
    'Iterate with users and metrics',
  ]

  const pricing = [
    { label: 'Sprint', price: '$10k+', desc: 'Fast prototype and test' },
    { label: 'MVP', price: '$30k+', desc: 'Launch-ready MVP' },
    { label: 'Scale', price: 'Custom', desc: 'Product-market scaling' }
  ]

  const faqs = [
    { q: 'Can you help with fundraising materials?', a: 'Yes — we support pitch decks and technical diligence.' },
    { q: 'Do you provide ongoing product support?', a: 'We offer retainers for product iteration and growth engineering.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Startup MVP Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/startup-mvp-development') },
    "description": "MVPs that validate ideas quickly with product-market fit focus and fast iteration.",
  }

  return (
    <>
      <ServiceTemplate
        title="Startup MVP Development"
        subtitle="Validate quickly, iterate faster"
        intro="We help startups build and validate MVPs that attract users and investors."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Build My MVP"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
