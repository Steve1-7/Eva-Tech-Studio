import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Mobile App Development — Eva Tech Studio',
  description: 'Native and cross-platform mobile apps designed for performance and delightful UX.',
  openGraph: { title: 'Mobile App Development — Eva Tech Studio', description: 'Mobile app development services', url: canonicalUrl('/services/mobile-app-development'), image: ogUrl('Mobile App Development — Eva Tech Studio','Native and cross-platform mobile apps designed for performance and delightful UX.') }
}

export default function Page() {
  const benefits = [
    'Native Performance:Optimised for platform UX',
    'Cross-Platform:Shared code, native feel',
    'Product Design:Research-led UX and UI',
  ]

  const process = [
    'Discovery and prototyping',
    'Native/Cross-platform development',
    'App Store deployment and analytics',
  ]

  const pricing = [
    { label: 'Prototype', price: '$12k+', desc: 'Clickable prototype and native demo' },
    { label: 'App', price: '$40k+', desc: 'Full app with backend and analytics' },
    { label: 'Enterprise', price: 'Custom', desc: 'White-label, multi-tenant solutions' }
  ]

  const faqs = [
    { q: 'Do you publish to the App Store?', a: 'Yes — we handle builds, signing, and store submissions where required.' },
    { q: 'Which frameworks do you use?', a: 'We use native Swift/Kotlin or React Native / Flutter depending on requirements.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Mobile App Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/mobile-app-development') },
    "description": "Native and cross-platform mobile apps designed for performance and delightful UX.",
  }

  return (
    <>
      <ServiceTemplate
        title="Mobile App Development"
        subtitle="Beautiful, performant mobile experiences"
        intro="We design and build mobile apps that users love, with careful attention to performance and platform conventions."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Request Mobile Quote"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
