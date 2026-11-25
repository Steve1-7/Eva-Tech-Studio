import ServiceDetail from '@/components/site/ServiceDetail'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Website Development for Growing Businesses',
  description: 'Fast, accessible, and maintainable websites designed and developed by Eva Tech Studio.',
  path: '/services/website-development',
})

export default function WebsiteDevelopmentPage() {
  return <ServiceDetail slug="website-development" />
}
