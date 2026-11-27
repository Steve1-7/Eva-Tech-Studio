import { createPageMetadata } from '@/lib/metadata'
import { BreadcrumbJsonLd } from '@/components/site/JsonLd'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import AIAuditWidget from '@/components/AIAuditWidget'

export const metadata = {
  ...createPageMetadata({
    title: 'AI Website and Growth Audit',
    description: 'Generate an AI-powered growth audit for your website, audience, and conversion funnel.',
    path: '/ai-audit',
  }),
  keywords: ['AI audit', 'growth audit', 'digital audit', 'AI tools', 'business audit'],
}

export default function AIAuditPage() {
  return (
    <main className="min-h-screen pb-[100px] pt-[180px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'AI tools', path: '/ai' }, { name: 'Growth Audit', path: '/ai-audit' }]} />
      <div className="max-w-[1040px] mx-auto">
        <ScrollReveal>
          <SectionLabel>AI Audit</SectionLabel>
          <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-semibold mt-4 mb-4" style={{ color: '#E8E3D8' }}>
            Fast, actionable growth audits powered by AI.
          </h1>
          <p className="max-w-[720px] text-[1rem] leading-[1.8] text-[#B8B2A8] mb-12">
            Get a detailed growth audit for your business with specific recommendations for traffic, conversions, automation, and revenue.
          </p>
        </ScrollReveal>

        <AIAuditWidget />
      </div>
    </main>
  )
}
