import ServiceDetail from '@/components/site/ServiceDetail'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Mobile App Development for Teams',
  description: 'Mobile-first and cross-platform applications designed for customers and teams.',
  path: '/services/mobile-app-development',
})

export default function MobileAppDevelopmentPage() {
  return <ServiceDetail slug="mobile-app-development" />
}
