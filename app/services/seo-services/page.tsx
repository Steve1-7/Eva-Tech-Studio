import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'SEO Services — Eva Tech Studio',
  description: 'Technical and content SEO to improve rankings, traffic, and conversions.',
  openGraph: { title: 'SEO Services — Eva Tech Studio', description: 'SEO services', url: canonicalUrl('/services/seo-services'), image: ogUrl('SEO Services — Eva Tech Studio','Technical and content SEO to improve rankings, traffic, and conversions.') }
}

export default function Page() {
  const benefits = [
    'Technical SEO:Site health, indexing, and performance',
    'Content Strategy:Topical authority and content plans',
    'Local & International:hreflang and local optimisation',
  ]

  const process = [
    'Technical audit and roadmap',
    'Content planning and optimisation',
    'Monitoring, reporting, and iteration',
  ]

  const pricing = [
    { label: 'Audit', price: '$2k+', desc: 'Technical SEO audit and priority list' },
    { label: 'Growth', price: '$5k+/mo', desc: 'Ongoing content and technical optimisation' },
    { label: 'Enterprise', price: 'Custom', desc: 'International SEO and enterprise migrations' }
  ]

  const faqs = [
    { q: 'Why are only two pages indexed?', a: 'Common reasons: noindex meta, robots, or missing sitemaps — we audit search console and server logs.' },
    { q: 'Do you handle migrations?', a: 'Yes — we plan redirects, canonical updates, and preserve SEO value during migrations.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "SEO Services",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/seo-services') },
    "description": "Technical and content SEO to improve rankings, traffic, and conversions.",
  }

  return (
    <>
      <ServiceTemplate
        title="SEO Services"
        subtitle="Rank better, convert more"
        intro="We combine technical SEO, content strategy, and performance engineering to drive sustainable organic growth."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Request SEO Audit"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
