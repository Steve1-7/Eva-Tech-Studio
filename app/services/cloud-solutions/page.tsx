import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl, createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Cloud Architecture and Migration Services',
  description: 'Cloud architecture, migrations, and cost optimisation for resilient applications.',
  path: '/services/cloud-solutions',
})


export default function Page() {
  const benefits = [
    'Resilience:High-availability cloud architectures',
    'Cost Optimisation:Right-sizing and automation',
    'Migration:Seamless cloud migration plans',
  ]

  const process = [
    'Assessment and cloud strategy',
    'Migration and cutover',
    'Optimization and observability',
  ]

  const pricing = [
    { label: 'Assessment', price: '$5k+', desc: 'Cloud readiness and cost analysis' },
    { label: 'Migration', price: '$20k+', desc: 'Application and data migration' },
    { label: 'Platform', price: 'Custom', desc: 'Managed cloud operations' }
  ]

  const faqs = [
    { q: 'Which cloud providers do you work with?', a: 'AWS, GCP, Azure and major managed providers.' },
    { q: 'Do you handle infra as code?', a: 'Yes — Terraform, Pulumi, CloudFormation and CI/CD.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Cloud Solutions",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/cloud-solutions') },
    "description": "Cloud architecture, migrations, and cost optimisation for resilient applications.",
  }

  return (
    <>
      <ServiceTemplate
        title="Cloud Solutions"
  canonicalPath="/services/cloud-solutions"
        subtitle="Cloud architecture and migrations"
        intro="We design cloud platforms for resilience, cost efficiency and operational simplicity."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
