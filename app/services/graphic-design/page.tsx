import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl, createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Graphic Design Services',
  description: 'High-quality graphic design for marketing, product, and brand communications.',
  path: '/services/graphic-design',
})


export default function Page() {
  const benefits = [
    'Visual Communication:Clear messaging through design',
    'Marketing Assets:Campaigns, ads, and social content',
    'Product Graphics:Illustrations and iconography',
  ]

  const process = [
    'Brief and concept',
    'Design and iterations',
    'Delivery and production assets',
  ]

  const pricing = [
    { label: 'Assets Pack', price: '$2k+', desc: 'Social and campaign assets' },
    { label: 'Campaign', price: '$8k+', desc: 'Design + production for marketing campaigns' },
    { label: 'Retainer', price: 'Custom', desc: 'Ongoing design support' }
  ]

  const faqs = [
    { q: 'Do you provide source files?', a: 'Yes — we deliver layered source files and production-ready exports.' },
    { q: 'Can you produce illustrations?', a: 'We work with in-house and trusted illustrators for bespoke assets.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Graphic Design",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/graphic-design') },
    "description": "High-quality graphic design for marketing, product, and brand communications.",
  }

  return (
    <>
      <ServiceTemplate
        title="Graphic Design"
  canonicalPath="/services/graphic-design"
        subtitle="Compelling visuals for brands and campaigns"
        intro="From campaign creatives to product assets, we deliver pixel-perfect design that drives engagement."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
