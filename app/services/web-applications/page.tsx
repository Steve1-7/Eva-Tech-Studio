import ServiceDetail from '@/components/site/ServiceDetail'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Web App Development for Business Teams',
  description: 'Secure web applications, portals, and dashboards built around real product needs.',
  path: '/services/web-applications',
})

export default function WebApplicationsPage() {
  return <ServiceDetail slug="web-applications" />
}
