import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'API Development — Eva Tech Studio',
  description: 'API design and engineering: secure, versioned, and well-documented APIs for integrations.',
  openGraph: { title: 'API Development — Eva Tech Studio', description: 'API development services', url: canonicalUrl('/services/api-development'), image: ogUrl('API Development — Eva Tech Studio','API design and engineering: secure, versioned, and well-documented APIs for integrations.') }
}

export default function Page() {
  const benefits = [
    'Security:Authenticated and rate-limited APIs',
    'Documentation:OpenAPI and developer portals',
    'Versioning:Stable upgrade paths for clients',
  ]

  const process = [
    'API design and contracts',
    'Implementation and tests',
    'Docs and developer onboarding',
  ]

  const pricing = [
    { label: 'API Design', price: '$4k+', desc: 'Design and OpenAPI spec' },
    { label: 'Implementation', price: '$12k+', desc: 'Secure API with tests and docs' },
    { label: 'Platform', price: 'Custom', desc: 'Scale and SLA-backed APIs' }
  ]

  const faqs = [
    { q: 'Do you provide SDKs?', a: 'We can generate SDKs and developer tooling for common languages.' },
    { q: 'How do you handle authentication?', a: 'We implement OAuth2, API keys, JWTs, or enterprise SSO depending on requirements.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "API Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/api-development') },
    "description": "API design and engineering: secure, versioned, and well-documented APIs for integrations.",
  }

  return (
    <>
      <ServiceTemplate
        title="API Development"
        subtitle="APIs developers love"
        intro="We design APIs with clear contracts, strong security and excellent developer experience."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Design My API"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
