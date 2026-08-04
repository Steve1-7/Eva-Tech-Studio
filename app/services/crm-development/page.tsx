import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'CRM Development — Eva Tech Studio',
  description: 'Custom CRM and integrations tailored to your sales and support workflows.',
  openGraph: { title: 'CRM Development — Eva Tech Studio', description: 'CRM development services', url: canonicalUrl('/services/crm-development'), image: ogUrl('CRM Development — Eva Tech Studio','Custom CRM and integrations tailored to your sales and support workflows.') }
}

export default function Page() {
  const benefits = [
    'Tailored CRM:Match your sales processes',
    'Integrations:Sync with tools and data',
    'Analytics:Track pipeline and KPIs',
  ]

  const process = [
    'Requirements and pipeline design',
    'Build CRM and integrations',
    'Training and handover',
  ]

  const pricing = [
    { label: 'Starter', price: '$8k+', desc: 'Custom CRM for small teams' },
    { label: 'Business', price: '$25k+', desc: 'Integration and automation' },
    { label: 'Enterprise', price: 'Custom', desc: 'Scalable CRM with advanced analytics' }
  ]

  const faqs = [
    { q: 'Can you migrate data?', a: 'Yes — we plan and execute data migrations with validation and rollback plans.' },
    { q: 'Do you support integrations?', a: 'We integrate CRMs to marketing, billing, and support tools.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "CRM Development",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/crm-development') },
    "description": "Custom CRM and integrations tailored to your sales and support workflows.",
  }

  return (
    <>
      <ServiceTemplate
        title="CRM Development"
        subtitle="Custom CRMs that power sales and support"
        intro="We build CRMs designed around your team's workflows, with automation and reporting built-in."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Build My CRM"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
