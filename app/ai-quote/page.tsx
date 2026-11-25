import { createPageMetadata } from '@/lib/metadata'
import { BreadcrumbJsonLd } from '@/components/site/JsonLd'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import AIQuoteGenerator from '@/components/AIQuoteGenerator'

export const metadata = {
  ...createPageMetadata({
    title: 'AI Project Scope Outline',
    description: 'Create a preliminary AI-generated project scope outline without unconfirmed prices or timelines.',
    path: '/ai-quote',
  }),
  keywords: ['AI project scoping', 'project scope outline', 'software discovery'],
}

export default function AIQuotePage() {
  return (
    <main className="min-h-screen pb-[100px] pt-[180px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'AI tools', path: '/ai' }, { name: 'AI Project Scope', path: '/ai-quote' }]} />
      <div className="max-w-[1040px] mx-auto">
        <ScrollReveal>
          <SectionLabel>AI Project Scoping</SectionLabel>
          <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-semibold mt-4 mb-4" style={{ color: '#E8E3D8' }}>
            Create a preliminary scope outline for your project.
          </h1>
          <p className="max-w-[720px] text-[1rem] leading-[1.8] text-[#B8B2A8] mb-12">
            Get a draft scope and discovery questions. It does not include a price or a committed timeline; those are confirmed in a written proposal.
          </p>
        </ScrollReveal>

        <AIQuoteGenerator services={['Digital Marketing', 'Website Development', 'Automation']} tier="growth" />
      </div>
    </main>
  )
}
