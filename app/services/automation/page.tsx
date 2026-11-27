import ServiceDetail from '@/components/site/ServiceDetail'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Workflow Automation for Business',
  description: 'Reliable business workflow automation and software integrations with clear controls.',
  path: '/services/automation',
})

export default function AutomationPage() {
  return <ServiceDetail slug="automation" />
}
