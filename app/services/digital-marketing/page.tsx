import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Digital Marketing — Eva Tech Studio',
  description: 'Full-funnel digital marketing: performance ads, SEO, CRO, and analytics.',
  openGraph: { title: 'Digital Marketing — Eva Tech Studio', description: 'Digital marketing services', url: canonicalUrl('/services/digital-marketing'), image: ogUrl('Digital Marketing — Eva Tech Studio','Full-funnel digital marketing: performance ads, SEO, CRO, and analytics.') }
}

export default function Page() {
  const benefits = [
    'Performance:ROI focused ad strategies',
    'CRO:Convert visitors into customers',
    'Analytics:Data-driven decision making',
  ]

  const process = [
    'Audit and strategy',
    'Campaign setup and optimisation',
    'Reporting and scaling',
  ]

  const pricing = [
    { label: 'Campaign', price: '$3k+', desc: 'Initial campaign setup and testing' },
    { label: 'Growth', price: '$6k+/mo', desc: 'Ongoing optimisation and reporting' },
    { label: 'Enterprise', price: 'Custom', desc: 'Cross-channel, global campaigns' }
  ]

  const faqs = [
    { q: 'Which channels do you run?', a: 'We run search, social, programmatic, and retargeting strategies.' },
    { q: 'Do you manage ad budgets?', a: 'Yes — we work with your budgets and provide clear reporting and KPIs.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Digital Marketing",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/digital-marketing') },
    "description": "Full-funnel digital marketing: performance ads, SEO, CRO, and analytics.",
  }

  return (
    <>
      <ServiceTemplate
        title="Digital Marketing"
        subtitle="Grow traffic, leads, and revenue"
        intro="We design measurable marketing programs that focus on return on ad spend and long-term growth."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Start Marketing"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
