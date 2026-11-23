import type { Metadata } from 'next'
import ServiceDetail from '@/components/site/ServiceDetail'

export const metadata: Metadata = {
  title: 'AI Chatbot Development',
  description: 'Useful AI chat experiences with approved knowledge, clear fallbacks, and human escalation.',
  alternates: { canonical: '/services/ai-chatbots' },
}

export default function AiChatbotsPage() {
  return <ServiceDetail slug="ai-chatbots" />
}
