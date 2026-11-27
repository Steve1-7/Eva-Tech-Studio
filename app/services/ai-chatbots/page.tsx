import ServiceDetail from '@/components/site/ServiceDetail'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'AI Chatbot Development for Support',
  description: 'Useful AI chat experiences with approved knowledge, clear fallbacks, and human escalation.',
  path: '/services/ai-chatbots',
})

export default function AiChatbotsPage() {
  return <ServiceDetail slug="ai-chatbots" />
}
