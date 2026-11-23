import type { Metadata } from 'next'
import ServiceDetail from '@/components/site/ServiceDetail'

export const metadata: Metadata = {
  title: 'Website Development',
  description: 'Fast, accessible, and maintainable websites designed and developed by Eva Tech Studio.',
  alternates: { canonical: '/services/website-development' },
}

export default function WebsiteDevelopmentPage() {
  return <ServiceDetail slug="website-development" />
}
