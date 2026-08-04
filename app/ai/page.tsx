import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'

export const metadata: Metadata = {
  title: 'AI Features — Eva-Tech-Studio',
  description: 'Explore Eva-Tech-Studio AI tools for audits, quotes, consulting, and conversational support.',
  keywords: ['AI tools', 'AI consulting', 'AI audit', 'AI quote', 'chatbot', 'digital agency AI'],
  openGraph: {
    title: 'AI Features — Eva-Tech-Studio',
    description: 'Explore Eva-Tech-Studio AI tools for audits, quotes, consulting, and conversational support.',
    type: 'website',
  },
}

const tools = [
  {
    title: 'AI Project Consultant',
    description: 'Generate a tailored project roadmap, investment plan and next steps for your growth initiative.',
    href: '/ai-consultant',
    badge: 'Consult'
  },
  {
    title: 'AI Growth Audit',
    description: 'Run a fast AI-powered audit to uncover growth gaps, quick wins and long-term strategy.',
    href: '/ai-audit',
    badge: 'Audit'
  },
  {
    title: 'AI Quote Generator',
    description: 'Get a personalised digital services quote with pricing, timeline and delivery details.',
    href: '/ai-quote',
    badge: 'Quote'
  },
]

export default function AIHubPage() {
  return (
    <main className="min-h-screen pb-[100px] pt-[180px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="max-w-[1120px] mx-auto">
        <ScrollReveal>
          <SectionLabel>AI Powered</SectionLabel>
          <h1 className="text-[clamp(2.8rem,6vw,4.8rem)] font-semibold mt-4 mb-6" style={{ color: '#E8E3D8' }}>
            Intelligent tools for growth, quoting and strategy.
          </h1>
          <p className="max-w-[720px] text-[1.05rem] leading-[1.8] text-[#B8B2A8]">
            Explore smart AI workflows engineered for ambitious brands: from rapid audits and personalised quotes to project consulting and conversational support.
          </p>
        </ScrollReveal>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <ScrollReveal key={tool.title}>
              <div className="rounded-[24px] p-8 border border-[rgba(232,227,216,0.06)] bg-[var(--obsidian-3)] shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="rounded-full bg-[rgba(201,169,110,0.12)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#C9A96E]">
                    {tool.badge}
                  </span>
                </div>
                <h2 className="text-[1.55rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>{tool.title}</h2>
                <p className="text-[0.95rem] leading-[1.8] text-[#B8B2A8] mb-8">{tool.description}</p>
                <MagneticButton>
                  <Link href={tool.href} className="btn-primary">Open Tool</Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
          ))}
        </section>

        <section className="mt-20 rounded-[32px] border border-[rgba(201,169,110,0.1)] bg-[var(--obsidian-2)] p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-[2rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>AI that supports your growth engine.</h2>
              <p className="text-[1rem] leading-[1.8] text-[#B8B2A8] mb-6">
                Whether you need a fast audit, an investment-ready quote, or a strategic consulting plan, Eva-Tech-Studio uses AI to accelerate decision-making without replacing expert execution.
              </p>
              <div className="space-y-4">
                <p className="text-[0.95rem] leading-[1.8] text-[#B8B2A8]">• Rapid, polished outputs that help you move from idea to action faster.</p>
                <p className="text-[0.95rem] leading-[1.8] text-[#B8B2A8]">• Built for founders and growth leaders who want clarity, not fluff.</p>
                <p className="text-[0.95rem] leading-[1.8] text-[#B8B2A8]">• Every tool is designed to feed real commercial outcomes, not just pretty reports.</p>
              </div>
            </div>
            <div className="rounded-[24px] p-8" style={{ background: 'rgba(201,169,110,0.06)' }}>
              <h3 className="text-[1.2rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>Quick access</h3>
              <ul className="space-y-4 text-[#B8B2A8]">
                <li>✅ AI Project Consultant: tailored business alignment</li>
                <li>✅ AI Growth Audit: fast gap analysis and recommendations</li>
                <li>✅ AI Quote Generator: proposal-ready pricing and scope</li>
                <li>✅ Conversational AI Chatbot: on-demand digital consultancy</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
