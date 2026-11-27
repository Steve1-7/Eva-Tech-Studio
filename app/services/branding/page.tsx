import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl, createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Brand Identity and Strategy Services',
  description: 'Strategic branding: identity, voice, and visual systems for premium brands.',
  path: '/services/branding',
})


export default function Page() {
  const benefits = [
    'Identity:Memorable brand systems',
    'Voice:Clear messaging and positioning',
    'Assets:Logos, guidelines, and templates',
  ]

  const process = [
    'Strategy and positioning',
    'Identity design and assets',
    'Guidelines and rollout',
  ]

  const pricing = [
    { label: 'Identity', price: '$8k+', desc: 'Logo and visual identity' },
    { label: 'Brand System', price: '$20k+', desc: 'Full brand toolkit and guidelines' },
    { label: 'Enterprise', price: 'Custom', desc: 'Global identity and governance' }
  ]

  const faqs = [
    { q: 'Do you support rebrands?', a: 'Yes — we run brand audits and phased rebrands with stakeholder alignment.' },
    { q: 'Can you produce brand guidelines?', a: 'We deliver comprehensive guidelines and asset libraries for teams.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Branding",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/branding') },
    "description": "Strategic branding: identity, voice, and visual systems for premium brands.",
  }

  return (
    <>
      <ServiceTemplate
        title="Branding"
  canonicalPath="/services/branding"
        subtitle="Build a brand that resonates"
        intro="We craft identities and systems that position ambitious brands for growth and trust."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
