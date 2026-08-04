import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Web Applications — Eva Tech Studio',
  description: 'Robust web applications with secure APIs, scalable backends, and delightful frontends.',
  openGraph: { title: 'Web Applications — Eva Tech Studio', description: 'Robust web applications', url: canonicalUrl('/services/web-applications'), image: ogUrl('Web Applications — Eva Tech Studio','Robust web applications with secure APIs, scalable backends, and delightful frontends.') }
}

export default function Page() {
  const benefits = [
    'Scalability:Cloud-native architectures',
    'Security:Secure-by-design engineering',
    'UX:Product-focused interactions',
  ]

  const process = [
    'Product discovery and backlog',
    'MVP delivery and iteration',
    'Scaling and optimisation',
  ]

  const pricing = [
    { label: 'MVP', price: '$25k+', desc: 'Minimal viable product with core features' },
    { label: 'Product', price: '$60k+', desc: 'Full-featured product and integrations' },
    { label: 'Enterprise', price: 'Custom', desc: 'High-availability, compliance, SSO' }
  ]

  const faqs = [
    { q: 'Do you provide ongoing support?', a: 'Yes — we offer maintenance and support plans tailored to the product.' },
    { q: 'What stack do you use?', a: 'We select the stack that fits the needs: Node, Next.js, Supabase, PostgreSQL, cloud providers.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Web Applications",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/web-applications') },
    "description": "Robust web applications with secure APIs, scalable backends, and delightful frontends.",
  }

  return (
    <>
      <ServiceTemplate
        title="Web Applications"
        subtitle="Engineering scalable web platforms"
        intro="We architect and build secure, maintainable web applications focused on product outcomes and developer experience."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Start Your App Project"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
