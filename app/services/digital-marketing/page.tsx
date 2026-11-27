import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl, createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Digital Marketing Services',
  description: 'Full-funnel digital marketing: performance ads, SEO, CRO, and analytics.',
  path: '/services/digital-marketing',
})


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
  canonicalPath="/services/digital-marketing"
        subtitle="Grow traffic, leads, and revenue"
        intro="We design measurable marketing programs that focus on return on ad spend and long-term growth."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
