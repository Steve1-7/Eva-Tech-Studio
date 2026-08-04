import type { Metadata } from 'next'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import AIQuoteGenerator from '@/components/AIQuoteGenerator'

export const metadata: Metadata = {
  title: 'AI Quote Generator — Eva-Tech-Studio',
  description: 'Create a tailored AI-generated quote for digital services with pricing and timelines.',
  keywords: ['AI quote', 'service quote', 'pricing calculator', 'digital agency quote'],
  openGraph: {
    title: 'AI Quote Generator — Eva-Tech-Studio',
    description: 'Create a tailored AI-generated quote for digital services with pricing and timelines.',
    type: 'website',
  },
}

export default function AIQuotePage() {
  return (
    <main className="min-h-screen pb-[100px] pt-[180px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="max-w-[1040px] mx-auto">
        <ScrollReveal>
          <SectionLabel>AI Quote</SectionLabel>
          <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-semibold mt-4 mb-4" style={{ color: '#E8E3D8' }}>
            Generate a customised AI quote for your next project.
          </h1>
          <p className="max-w-[720px] text-[1rem] leading-[1.8] text-[#B8B2A8] mb-12">
            Quickly get a proposal-style quote with pricing guidance, project scope, and timelines powered by AI.
          </p>
        </ScrollReveal>

        <AIQuoteGenerator services={['Digital Marketing', 'Website Development', 'Automation']} tier="growth" />
      </div>
    </main>
  )
}
