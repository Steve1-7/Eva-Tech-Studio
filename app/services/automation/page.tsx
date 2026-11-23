import type { Metadata } from 'next'
import ServiceDetail from '@/components/site/ServiceDetail'

export const metadata: Metadata = {
  title: 'Automation and Integrations',
  description: 'Reliable business workflow automation and software integrations with clear controls.',
  alternates: { canonical: '/services/automation' },
}

export default function AutomationPage() {
  return <ServiceDetail slug="automation" />
}
