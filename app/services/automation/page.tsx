import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Automation — Eva Tech Studio',
  description: 'Workflow and process automation to reduce manual work and increase reliability.',
  openGraph: { title: 'Automation — Eva Tech Studio', description: 'Automation services', url: canonicalUrl('/services/automation'), image: ogUrl('Automation — Eva Tech Studio','Workflow and process automation to reduce manual work and increase reliability.') }
}

export default function Page() {
  const benefits = [
    'Efficiency:Automate repetitive work',
    'Integrations:Connect your stack reliably',
    'Observability:Track and alert on workflows',
  ]

  const process = [
    'Process discovery and mapping',
    'Automation design and implementation',
    'Monitoring and iteration',
  ]

  const pricing = [
    { label: 'Workflow', price: '$3k+', desc: 'Single automation flow' },
    { label: 'Platform', price: '$12k+', desc: 'Multiple integrations and monitoring' },
    { label: 'Enterprise', price: 'Custom', desc: 'High-throughput automation and governance' }
  ]

  const faqs = [
    { q: 'Which tools do you integrate?', a: 'CRMs, ticketing, databases, and custom APIs; we provide secure connectors.' },
    { q: 'Do you handle retries and errors?', a: 'Yes — fault-tolerant designs with retries, dead-letter queues and observability.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Automation",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/automation') },
    "description": "Workflow and process automation to reduce manual work and increase reliability.",
  }

  return (
    <>
      <ServiceTemplate
        title="Automation"
        subtitle="Automate repetitive processes with confidence"
        intro="We design resilient automation that reduces operational load and improves reliability."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Automate Now"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
