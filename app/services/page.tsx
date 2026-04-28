import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import StickySplitServices from '@/components/StickySplitServices'

export const metadata: Metadata = { title: 'Services — Eve-Tech-Studio', description: 'Every digital service your brand needs to win.' }

export default function ServicesPage() {
  return (
    <>
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}>
          <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-3" />
        </div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>What We Do</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-5" style={{ color: '#E8E3D8' }}>
            Every Service Your Brand<br />Needs to <span className="text-shimmer italic">Win</span>
          </h1>
          <p className="font-light leading-[1.8] text-[1.05rem] max-w-[580px] mx-auto" style={{ color: '#6B6860' }}>
            Integrated growth systems tailored to where you are, where you're going, and what it takes to get there faster.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--obsidian-2)' }}>
        <StickySplitServices />
      </section>

      <div className="px-6 md:px-[60px] pb-[100px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto rounded-[24px] px-10 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-10"
          style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.15)', boxShadow: '0 0 60px rgba(201,169,110,0.05)' }}>
          <ScrollReveal direction="left">
            <h2 className="font-cormorant text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold max-w-[520px]" style={{ color: '#E8E3D8' }}>
              Not Sure Which Service Is Right?{' '}
              <span className="text-shimmer italic">Let's Figure It Out Together.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <MagneticButton><Link href="/contact" className="btn-primary">Get a Free Audit →</Link></MagneticButton>
          </ScrollReveal>
        </div>
      </div>
    </>
  )
}
