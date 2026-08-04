import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Website Development — Eva Tech Studio',
  description: 'Pixel-perfect, accessible, and high-performance websites for brands and products.',
  openGraph: { title: 'Website Development — Eva Tech Studio', description: 'Pixel-perfect websites', url: canonicalUrl('/services/website-development'), image: ogUrl('Website Development — Eva Tech Studio','Pixel-perfect, accessible, and high-performance websites for brands and products.') }
}

export default function Page() {
  const benefits = [
    'Performance:Blazing-fast, Lighthouse-focused builds',
    'Accessibility:WCAG-aware, inclusive UX',
    'Design:System-driven, responsive designs',
  ]

  const process = [
    'Discovery and IA',
    'Design & prototyping',
    'Implementation & optimization',
  ]

  const pricing = [
    { label: 'Launch', price: '$6k+', desc: 'Business website, CMS, basic SEO' },
    { label: 'Scale', price: '$18k+', desc: 'Optimized, dynamic content, integrations' },
    { label: 'Enterprise', price: 'Custom', desc: 'Headless CMS, multi-site, internationalization' }
  ]

  const faqs = [
    { q: 'Do you build headless sites?', a: 'Yes — we specialize in headless CMS architectures and performant frontends.' },
    { q: 'What CMS do you recommend?', a: 'We choose the right CMS for the product: Sanity, Contentful, Supabase, or custom.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Website Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/website-development') },
    "description": "Pixel-perfect, accessible, and high-performance websites for brands and products.",
  }

  return (
    <>
      <ServiceTemplate
        title="Website Development"
        subtitle="Design-led, performance-first websites"
        intro="We build websites that look premium and perform under real-world traffic and SEO demands."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Request Website Quote"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
