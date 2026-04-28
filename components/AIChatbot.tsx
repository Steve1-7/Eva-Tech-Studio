'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const KNOWLEDGE_BASE = `
Eve-Tech-Studio is a growth-driven digital agency based in Johannesburg, South Africa.

Services:
- Social Media Marketing (Instagram, TikTok, LinkedIn, X)
- Paid Ads Management (Google Ads, Meta, Programmatic)
- Branding & Content (Brand Design, Copywriting, Strategy)
- Website Development (Next.js, React, Headless CMS)
- E-commerce (Shopify, WooCommerce, Custom)
- SEO & Automation (Technical SEO, CRM, Business Automation)

Pricing:
- Starter packages from R15,000/month
- Growth packages from R25,000/month  
- Enterprise packages from R50,000/month

Results:
- 3.2× average ROI increase
- 94% client retention rate
- 28 days average to first results
- R48M+ revenue generated for clients

Notable clients: NovaSpark E-commerce, Outpost Outdoors, Vertex Financial, Meridian Consulting, Lumis Tech, Drift Labs

Process:
1. Diagnose - Deep-dive audit of digital presence
2. Architect - Custom growth roadmap with KPIs
3. Execute - Launch, test, iterate at speed
4. Scale - Amplify winning campaigns

Free offerings:
- 30-minute strategy call
- AI-powered growth audit
- Custom proposal

Contact: hello@peaceofpie.agency
Phone: +27 (0) 11 123 4567
Location: Johannesburg, South Africa
Hours: Mon-Fri, 8am-6pm SAST
`

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I am Eve-Tech-Studio\'s AI assistant. Ask me about our services, pricing, process, or how we can help grow your business!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    // Service queries
    if (msg.includes('service') || msg.includes('do you') || msg.includes('offer')) {
      return 'We offer comprehensive digital growth services: Social Media Marketing, Paid Ads Management, Branding & Content, Website Development, E-commerce solutions, and SEO & Automation. Each service is tailored to your specific business goals. Which area interests you most?'
    }

    // Pricing queries
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('budget')) {
      return 'Our packages start from R15,000/month for Starter, R25,000/month for Growth, and R50,000+/month for Enterprise. We also offer custom packages based on your specific needs. Would you like a custom quote?'
    }

    // Process queries
    if (msg.includes('process') || msg.includes('how') || msg.includes('work') || msg.includes('start')) {
      return 'Our 4-step process: 1) Diagnose - Deep audit of your digital presence, 2) Architect - Custom growth roadmap, 3) Execute - Launch and iterate campaigns, 4) Scale - Amplify what works. Most clients see results within 28 days.'
    }

    // Results/queries
    if (msg.includes('result') || msg.includes('roi') || msg.includes('success') || msg.includes('achieve')) {
      return 'Our clients see an average 3.2× ROI increase. For example, NovaSpark tripled their organic traffic in 90 days, and Outpost Outdoors scaled from R200K to R1.2M monthly revenue in 8 months. Would you like to see more case studies?'
    }

    // Contact queries
    if (msg.includes('contact') || msg.includes('call') || msg.includes('email') || msg.includes('reach') || msg.includes('book')) {
      return 'You can reach us at hello@peaceofpie.agency or call +27 (0) 11 123 4567. We offer a free 30-minute strategy call where we\'ll audit your digital presence and share a custom growth roadmap. Would you like to book one?'
    }

    // Timeframe queries
    if (msg.includes('time') || msg.includes('how long') || msg.includes('when') || msg.includes('soon')) {
      return 'Most clients see their first measurable results within 28 days. Full campaign optimization typically takes 60-90 days. The timeline depends on your industry, competition, and starting point. Let\'s discuss your specific situation!'
    }

    // Website queries
    if (msg.includes('website') || msg.includes('web') || msg.includes('site')) {
      return 'We build blazing-fast, conversion-obsessed websites using Next.js and React. Our websites are SEO-optimized from day one and designed to convert visitors into customers. Every site includes analytics integration and A/B testing capabilities.'
    }

    // Social media queries
    if (msg.includes('social') || msg.includes('instagram') || msg.includes('facebook') || msg.includes('linkedin') || msg.includes('tiktok')) {
      return 'Our social media services include content creation, community management, and paid advertising across all major platforms. We create scroll-stopping content that turns followers into paying customers, with full performance tracking and optimization.'
    }

    // Default response
    return 'Thanks for your question! To give you the most helpful answer, could you tell me more about what you\'re looking for? For example, are you interested in our services, pricing, process, or would you like to book a free strategy call?'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content)
      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 800)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen ? 'rotate-90' : 'hover:scale-110'
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
          boxShadow: '0 4px 20px rgba(201, 169, 110, 0.4)',
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-[#07080F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[#07080F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] rounded-[24px] overflow-hidden shadow-2xl animate-fade-up"
          style={{
            background: 'var(--obsidian-3)',
            border: '1px solid rgba(201, 169, 110, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 169, 110, 0.1)',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, var(--obsidian-4), var(--obsidian-3))' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201, 169, 110, 0.15)' }}>
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <div className="font-semibold text-[0.9rem]" style={{ color: '#E8E3D8' }}>Eve-Tech-Studio AI</div>
              <div className="flex items-center gap-1.5 text-[0.65rem]" style={{ color: '#4A7A64' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[380px] overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-[16px] text-[0.82rem] leading-[1.6] ${
                    msg.role === 'user'
                      ? 'rounded-br-md'
                      : 'rounded-bl-md'
                  }`}
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, var(--gold), var(--gold-bright))'
                      : 'var(--obsidian-4)',
                    color: msg.role === 'user' ? '#07080F' : '#B8B2A8',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-[16px] rounded-bl-md flex items-center gap-1.5"
                  style={{ background: 'var(--obsidian-4)' }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 py-3 border-t" style={{ borderColor: 'rgba(232, 227, 216, 0.05)' }}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 px-4 py-3 rounded-full text-[0.82rem] outline-none"
                style={{
                  background: 'var(--obsidian-4)',
                  color: '#E8E3D8',
                  border: '1px solid rgba(232, 227, 216, 0.1)',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                style={{
                  background: 'var(--gold)',
                }}
              >
                <svg className="w-5 h-5 text-[#07080F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-2 text-[0.6rem]" style={{ color: '#3A3830' }}>
              AI Assistant • Powered by Eve-Tech-Studio
            </div>
          </form>
        </div>
      )}
    </>
  )
}
