import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'Cloud Solutions — Eva Tech Studio',
  description: 'Cloud architecture, migrations, and cost optimisation for resilient applications.',
  openGraph: { title: 'Cloud Solutions — Eva Tech Studio', description: 'Cloud solutions', url: canonicalUrl('/services/cloud-solutions'), image: ogUrl('Cloud Solutions — Eva Tech Studio','Cloud architecture, migrations, and cost optimisation for resilient applications.') }
}

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
        subtitle="Cloud architecture and migrations"
        intro="We design cloud platforms for resilience, cost efficiency and operational simplicity."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Plan My Cloud"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
