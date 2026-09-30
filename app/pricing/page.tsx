import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import PricingGrid from '@/components/PricingGrid'
import OneTimePricingGrid from '@/components/OneTimePricingGrid'

export const metadata: Metadata = {
  title: 'Pricing — Eva-Tech-Studio',
  description: 'Transparent pricing plans for digital marketing services. No hidden fees, no confusing tiers.',
  keywords: ['pricing', 'digital marketing costs', 'agency pricing', 'marketing budget', 'South Africa'],
  openGraph: {
    title: 'Pricing — Eva-Tech-Studio',
    description: 'Transparent pricing plans for digital marketing services.',
  },
}

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
            <Link href="/contact" className="transition-colors hover:text-[#C9A96E]" style={{ color: '#8B6F3A', textDecoration: 'underline' }}>Build a bespoke package.</Link>
          </p>

          <div className="mt-16 rounded-[24px] p-12" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
            <ScrollReveal>
              <div className="text-center mb-10">
                <SectionLabel center>One-Time Projects</SectionLabel>
                <h2 className="font-cormorant text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold mt-2 mb-3" style={{ color: '#E8E3D8' }}>Need a Single Deliverable?</h2>
              </div>
            </ScrollReveal>
            <OneTimePricingGrid />
          </div>
        </div>
      </section>
    </>
  )
}
