import React from 'react'
import ServiceTemplate from '@/components/ServiceTemplate'
import { canonicalUrl } from '@/lib/metadata'
import { ogUrl } from '@/lib/og'

export const metadata = {
  title: 'AI Chatbots — Eva Tech Studio',
  description: 'Conversational AI and chatbots built for conversion, support, and automation.',
  openGraph: { title: 'AI Chatbots — Eva Tech Studio', description: 'Conversational AI and chatbots', url: canonicalUrl('/services/ai-chatbots'), image: ogUrl('AI Chatbots','Conversational AI and chatbots built for conversion, support, and automation.') }
}

export default function Page() {
  const benefits = [
    '24/7 Support:Always-on conversational support',
    'Lead Gen:Qualify and capture leads in-chat',
    'Integrations:Connect to CRM, Helpdesk, and APIs',
  ]

  const process = [
    'Conversation design and flows',
    'Prototype and test with users',
    'Deploy and integrate with analytics',
  ]

  const pricing = [
    { label: 'Starter', price: '$4k+', desc: 'Basic chatbot with key flows' },
    { label: 'Business', price: '$12k+', desc: 'Multi-channel bot with integrations' },
    { label: 'Enterprise', price: 'Custom', desc: 'Advanced NLU and custom integrations' }
  ]

  const faqs = [
    { q: 'Which channels do you support?', a: 'We support web chat, WhatsApp, Messenger, and custom SDK integrations.' },
    { q: 'Can the bot hand off to humans?', a: 'Yes — we design seamless human handoffs and escalation flows.' }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Chatbots",
    "provider": { "@type": "Organization", "name": "Eva Tech Studio", "url": canonicalUrl('/services/ai-chatbots') },
    "description": "Conversational AI and chatbots built for conversion, support, and automation.",
  }

  return (
    <>
      <ServiceTemplate
        title="AI Chatbots"
        subtitle="Human-like chatbots that convert"
        intro="Build chat experiences that reduce support load and increase qualified leads with intelligent routing and integrations."
        benefits={benefits}
        process={process}
        pricing={pricing}
        faqs={faqs}
        ctaText="Get a Chatbot Quote"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}

