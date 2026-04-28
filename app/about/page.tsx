import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import CountUp from '@/components/CountUp'

export const metadata: Metadata = { title: 'About Us — Eve-Tech-Studio', description: 'Built by founders, for founders.' }

const values = [
  { icon: '🎯', title: 'Outcomes Over Outputs', desc: "We care about results, not reports. Every activity is linked to a measurable business outcome. If it doesn't move the needle, we stop." },
  { icon: '🔬', title: 'Radical Transparency', desc: 'You will always know exactly what we are doing, why, and how it is performing. No smoke, no mirrors — just honest communication.' },
  { icon: '⚡', title: 'Speed With Intention', desc: 'We move fast — but never recklessly. Every decision is grounded in strategy, tested against data, and executed with precision.' },
  { icon: '🌱', title: 'Long-Term Thinking', desc: 'We build for compounding growth. Quick wins are great — but sustainable systems that generate returns for years? That is the real prize.' },
  { icon: '🤝', title: 'True Partnership', desc: 'We treat your business like our own. That means caring deeply, investing fully, and never treating you like just another invoice.' },
  { icon: '🚀', title: 'Relentless Improvement', desc: 'The digital landscape evolves constantly. So do we. We test, learn, and adapt — ensuring you are always ahead.' },
]

const team = [
  { initials: 'EC', name: 'Edward Chirwa', role: 'Founder & Brand Director' },
  { initials: 'LP', name: 'Lerato Pule', role: 'Head of Paid Media' },
  { initials: 'SR', name: 'Steve Ronald', role: 'Developer & Strategy Director' },
  { initials: 'AZ', name: 'Amara Zulu', role: 'Creative & Brand Lead' },
]

export default function AboutPage() {
  return (
    <>
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}>
          <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" />
        </div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>Our Story</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-5" style={{ color: '#E8E3D8' }}>
            We Built the Agency<br />We <span className="text-shimmer italic">Wished</span> We Had
          </h1>
          <p className="font-light leading-[1.8] text-[1.05rem]" style={{ color: '#6B6860' }}>
            Eve-Tech-Studio was born from a simple frustration: too many agencies that over-promise, under-deliver, and hide behind jargon.
          </p>
        </div>
      </section>

      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <ScrollReveal><SectionLabel>Our Origin</SectionLabel></ScrollReveal>
            <ScrollReveal delay={80}><h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-semibold mt-1 mb-6" style={{ color: '#E8E3D8' }}>Built by Founders,<br />for Founders.</h2></ScrollReveal>
            {['We started Eve-Tech-Studio because we were frustrated — as founders ourselves — with agencies that talked big but delivered little. We had seen the damage done by opaque reporting, bloated retainers, and cookie-cutter campaigns that ignored business context.',
              'So we built something different. A team of growth-obsessed strategists, developers, and creatives who hold themselves accountable to one thing: your actual business results.',
              'Today, we work with ambitious brands across South Africa and beyond — from DTC startups to established SMEs ready to scale. Our mandate: more revenue, faster, with systems that keep compounding.'].map((p, i) => (
              <ScrollReveal key={i} delay={160 + i * 60}>
                <p className="font-light leading-[1.85] mb-5" style={{ color: '#6B6860' }}>{p}</p>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={380}>
              <MagneticButton className="mt-4"><Link href="/contact" className="btn-primary">Start a Conversation →</Link></MagneticButton>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="right">
            <div className="rounded-[24px] p-12 flex flex-col justify-between gap-10 min-h-[360px]"
              style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.15)', boxShadow: '0 0 60px rgba(201,169,110,0.04)' }}>
              <blockquote className="font-cormorant text-[1.85rem] italic leading-[1.4]" style={{ color: '#E8E3D8' }}>
                "We don't measure success in deliverables. We measure it in revenue earned, time saved, and businesses transformed."
              </blockquote>
              <div className="pt-6" style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
                <p className="font-semibold" style={{ color: '#E8E3D8' }}>The Eve-Tech-Studio Team</p>
                <p className="text-[0.78rem] mt-1" style={{ color: '#6B6860' }}>Johannesburg, South Africa · Est. 2020</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 px-6 md:px-[60px]" style={{ background: 'var(--obsidian-3)', borderTop: '1px solid rgba(201,169,110,0.08)', borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 10, suffix: '+', label: 'Brands Scaled', decimals: 0 },
            { end: 94, suffix: '%', label: 'Client Retention', decimals: 0 },
            { end: 100, prefix: 'R', suffix: 'K+', label: 'Revenue Generated', decimals: 0 },
            { end: 6, suffix: ' years', label: 'In Business', decimals: 0 },
          ].map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80}>
              <div className="font-cormorant text-[3rem] font-bold leading-none text-shimmer mb-2">
                <CountUp end={s.end} suffix={s.suffix} prefix={s.prefix} decimals={s.decimals} />
              </div>
              <div className="text-[0.78rem] tracking-[0.06em]" style={{ color: '#6B6860' }}>{s.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-16">
              <SectionLabel center>What Drives Us</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>Our Values Are Our Strategy</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 60}>
                <div className="p-9 rounded-[20px] transition-all duration-300 h-full group card hover:border-[rgba(201,169,110,0.2)]"
                  style={{ background: 'var(--obsidian-3)' }}>
                  <span className="text-[1.8rem] block mb-5">{v.icon}</span>
                  <h3 className="font-cormorant text-[1.25rem] font-semibold mb-3" style={{ color: '#E8E3D8' }}>{v.title}</h3>
                  <p className="text-[0.85rem] leading-[1.75]" style={{ color: '#6B6860' }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-3)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[600px] mx-auto mb-16">
              <SectionLabel center>The Team</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2" style={{ color: '#E8E3D8' }}>The People Behind Your Growth</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 80}>
                <div className="text-center group">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-[1.6rem] font-bold mx-auto mb-4 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(201,169,110,0.2)]"
                    style={{ background: 'var(--obsidian-5)', border: '1px solid rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                    {m.initials}
                  </div>
                  <h4 className="font-syne text-[0.92rem] font-bold mb-1" style={{ color: '#E8E3D8' }}>{m.name}</h4>
                  <span className="text-[0.76rem]" style={{ color: '#6B6860' }}>{m.role}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[100px] px-6 md:px-[60px] relative overflow-hidden" style={{ background: 'var(--obsidian-2)' }}>
        <div className="gold-line absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5" style={{ color: '#E8E3D8' }}>
              Ready to Build Something <span className="text-shimmer italic">Remarkable?</span>
            </h2>
            <p className="font-light leading-[1.8] mb-10" style={{ color: '#6B6860' }}>
              Let's talk about your goals, challenges, and how Eve-Tech-Studio can become your most valuable growth partner.
            </p>
            <MagneticButton><Link href="/contact" className="btn-primary text-[0.9rem] px-8 py-4">Start Growing Today →</Link></MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
