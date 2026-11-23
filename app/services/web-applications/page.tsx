import type { Metadata } from 'next'
import ServiceDetail from '@/components/site/ServiceDetail'

export const metadata: Metadata = {
  title: 'Web App Development',
  description: 'Secure web applications, portals, and dashboards built around real product needs.',
  alternates: { canonical: '/services/web-applications' },
}

export default function WebApplicationsPage() {
  return <ServiceDetail slug="web-applications" />
}
