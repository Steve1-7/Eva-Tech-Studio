import type { Metadata } from 'next'
import BookingLink from '@/components/BookingLink'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import PricingGrid from '@/components/PricingGrid'

export const metadata: Metadata = {
  title: 'Pricing — Eva-Tech-Studio',
  description: 'Transparent pricing plans for digital marketing services. No hidden fees, no confusing tiers.',
  keywords: ['pricing', 'digital marketing costs', 'agency pricing', 'marketing budget', 'South Africa'],
  openGraph: {
    title: 'Pricing — Eva-Tech-Studio',
    description: 'Transparent pricing plans for digital marketing services.',
  },
}

const oneTime = [
  { icon: '💻', label: 'Website Build', from: 'From R10,000' },
  { icon: '🎨', label: 'Brand Identity', from: 'From R12,000' },
  { icon: '🛒', label: 'Shopify Store', from: 'From R15,000' },
  { icon: '⚙️', label: 'CRM Setup', from: 'From R8,500' },
  { icon: '🔍', label: 'SEO Audit', from: 'From R4,500' },
]

export default function PricingPage() {
  return (
    <>
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}><div className="aurora-orb aurora-orb-1" /></div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>Investment</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-5" style={{ color: '#E8E3D8' }}>
            Pricing as Clear as Our <span className="text-shimmer italic">Results</span>
          </h1>
          <p className="font-light leading-[1.8] text-[1.05rem]" style={{ color: '#6B6860' }}>No hidden fees, no confusing tiers. Plans designed to deliver serious ROI at every growth stage.</p>
        </div>
      </section>

      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div>
            <PricingGrid />
          </div>

          <p className="text-center text-[0.82rem] mt-8" style={{ color: '#6B6860' }}>
            All plans billed monthly. No lock-in after the initial 3-month onboarding.{' '}
            <BookingLink className="underline underline-offset-4 transition-colors hover:text-[#C9A96E]">Book a Strategy Call</BookingLink>
          </p>

          <div className="mt-16 rounded-[24px] p-12" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
            <ScrollReveal>
              <div className="text-center mb-10">
                <SectionLabel center>One-Time Projects</SectionLabel>
                <h2 className="font-cormorant text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold mt-2 mb-3" style={{ color: '#E8E3D8' }}>Need a Single Deliverable?</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {oneTime.map((o, i) => (
                <ScrollReveal key={o.label} delay={i * 60}>
                  <div className="rounded-[16px] p-6 text-center transition-all duration-300 hover:border-[rgba(201,169,110,0.2)]"
                    style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.05)' }}>
                    <div className="text-[1.8rem] mb-3">{o.icon}</div>
                    <strong className="block text-[0.88rem] font-semibold mb-1" style={{ color: '#E8E3D8' }}>{o.label}</strong>
                    <span className="text-[0.76rem]" style={{ color: '#6B6860' }}>{o.from}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
