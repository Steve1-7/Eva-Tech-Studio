import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'UI/UX Design — Eva Tech Studio',
  description: 'Human-centred UI/UX design: research, prototypes, and design systems.',
  openGraph: { title: 'UI/UX Design — Eva Tech Studio', description: 'Human-centred design', url: canonicalUrl('/services/ui-ux-design'), image: ogUrl('UI/UX Design — Eva Tech Studio','Human-centred UI/UX design: research, prototypes, and design systems.') }
}

export default function Page() {
  const benefits = [
    'Research-led:User research and validation',
    'Design Systems:Scalable component libraries',
    'Conversion Focused:UX optimised for conversion',
  ]

  const process = [
    'User research and personas',
    'Wireframes and prototypes',
    'Design system and handoff',
  ]

  const pricing = [
    { label: 'Research Sprint', price: '$6k+', desc: 'User research and prototypes' },
    { label: 'Design System', price: '$15k+', desc: 'Component system and assets' },
    { label: 'Full Product Design', price: 'Custom', desc: 'End-to-end product design services' }
  ]

  const faqs = [
    { q: 'Do you provide design tokens?', a: 'Yes — we deliver design tokens and component libraries ready for developers.' },
    { q: 'What tools do you use?', a: 'Figma for design and interactive prototypes; we provide developer-ready exports.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "UI/UX Design",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/ui-ux-design') },
    "description": "Human-centred UI/UX design: research, prototypes, and design systems.",
  }

  return (
    <>
      <ServiceTemplate
        title="UI/UX Design"
        subtitle="Design that delights and converts"
        intro="We create intuitive experiences grounded in research and refined through user testing."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Start Design" 
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
