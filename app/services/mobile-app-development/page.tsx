import type { Metadata } from 'next'
import ServiceDetail from '@/components/site/ServiceDetail'

export const metadata: Metadata = {
  title: 'Mobile and App Development',
  description: 'Mobile-first and cross-platform applications designed for customers and teams.',
  alternates: { canonical: '/services/mobile-app-development' },
}

export default function MobileAppDevelopmentPage() {
  return <ServiceDetail slug="mobile-app-development" />
}
