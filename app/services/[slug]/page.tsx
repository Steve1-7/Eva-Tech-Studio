import type { Metadata } from 'next'
import ServiceDetail from '@/components/site/ServiceDetail'
import { createPageMetadata } from '@/lib/metadata'

const customServices = {
  'custom-software': {
    title: 'Custom Software for Business Workflows',
    description: 'Purpose-built internal tools and software that fit the way your business actually operates.',
  },
  'trading-bots': {
    title: 'Trading Bot Engineering',
    description: 'Trading-system engineering, simulation, and integrations—with risk controls and clear limits.',
  },
}

type ServiceSlug = keyof typeof customServices

export function generateStaticParams() {
  return Object.keys(customServices).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = customServices[params.slug as ServiceSlug]
  if (!service) return { title: 'Service not found' }
  return createPageMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${params.slug}`,
  })
}

export default function NewServicePage({ params }: { params: { slug: string } }) {
  return <ServiceDetail slug={params.slug} />
}
