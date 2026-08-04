import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'AI Development — Eva Tech Studio',
  description: 'End-to-end AI development services: custom models, pipelines, MLOps, and production integrations.',
  openGraph: { title: 'AI Development — Eva Tech Studio', description: 'End-to-end AI development services', url: canonicalUrl('/services/ai-development'), image: ogUrl('AI Development','End-to-end AI development services: custom models, pipelines, MLOps, and production integrations.') }
}

export default function Page() {
  const benefits = [
    'Custom Models:Build tailored ML models for your business',
    'MLOps:Production-ready pipelines and monitoring',
    'Integration:Seamless API & app integration',
  ]

  const process = [
    'Discovery & data assessment',
    'Model prototyping and validation',
    'Productionization and monitoring',
  ]

  const pricing = [
    { label: 'Starter', price: '$8k+', desc: 'Proof of concept & model prototype' },
    { label: 'Growth', price: '$25k+', desc: 'Production model and API' },
    { label: 'Enterprise', price: 'Custom', desc: 'Scale, MLOps, SLA, compliance' }
  ]

  const faqs = [
    { q: 'How long does an AI project take?', a: 'Typical projects range from 6–16 weeks depending on scope.' },
    { q: 'Do you provide models or use third-party APIs?', a: 'We build custom models and can integrate generative APIs where appropriate.' }
  ]

  const caseStudies = [
    { title: 'Gold Coast Mining Review', href: '/work/gold-coast-mining-review' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/ai-development') },
    "description": "End-to-end AI development services: custom models, pipelines, MLOps, and production integrations.",
  }

  return (
    <>
      <ServiceTemplate
        title="AI Development"
        subtitle="Custom AI solutions engineered for production"
        intro="From research to production, we build reliable, explainable AI systems that drive measurable business outcomes."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        caseStudies={caseStudies}
        ctaText="Request AI Estimate"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}

