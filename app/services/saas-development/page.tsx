import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'SaaS Development — Eva Tech Studio',
  description: 'End-to-end SaaS product development: multi-tenant architecture, billing, and scale.',
  openGraph: { title: 'SaaS Development — Eva Tech Studio', description: 'SaaS product development', url: canonicalUrl('/services/saas-development'), image: ogUrl('SaaS Development — Eva Tech Studio','End-to-end SaaS product development: multi-tenant architecture, billing, and scale.') }
}

export default function Page() {
  const benefits = [
    'Multi-tenant:Secure multi-tenant architecture',
    'Billing:Integrated subscription & payments',
    'Scale:Built for growth and observability',
  ]

  const process = [
    'Product-market fit and MVP',
    'Platform architecture and build',
    'Iterate, onboard, and scale',
  ]

  const pricing = [
    { label: 'MVP', price: '$30k+', desc: 'Core platform + billing' },
    { label: 'Scale', price: '$80k+', desc: 'Advanced features and compliance' },
    { label: 'Enterprise', price: 'Custom', desc: 'SLA, SSO, custom integrations' }
  ]

  const faqs = [
    { q: 'Do you handle payment integrations?', a: 'Yes — Stripe, Braintree, and custom providers supported.' },
    { q: 'Can you help with GDPR and privacy?', a: 'We design with compliance in mind and can assist with GDPR and international requirements.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "SaaS Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/saas-development') },
    "description": "End-to-end SaaS product development: multi-tenant architecture, billing, and scale.",
  }

  return (
    <>
      <ServiceTemplate
        title="SaaS Development"
        subtitle="Build scalable, subscription-first platforms"
        intro="We build SaaS platforms focused on retention, reliability, and operational excellence."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Talk SaaS"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
