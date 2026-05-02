import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import CountUp from '@/components/CountUp'

export const metadata: Metadata = { 
  title: 'About Us — Eva-Tech-Studio', 
  description: 'We build growth systems for ambitious brands. Strategy, execution, and measurable results.' 
}

const values = [
  { icon: '🎯', title: 'Outcomes Over Outputs', desc: 'We measure success in revenue and growth, not deliverables checked off a list.' },
  { icon: '🔬', title: 'Radical Transparency', desc: 'Full visibility into what we do, why we do it, and how it performs. No hidden tactics.' },
  { icon: '⚡', title: 'Speed With Intention', desc: 'Fast execution grounded in strategy. Every move is calculated, tested, and optimized.' },
  { icon: '🌱', title: 'Compounding Growth', desc: 'We build systems that generate returns long after launch. Sustainable beats splashy.' },
  { icon: '🤝', title: 'True Partnership', desc: 'We operate as an extension of your team. Your goals become our mission.' },
  { icon: '🚀', title: 'Relentless Improvement', desc: 'Test, learn, adapt, repeat. The digital landscape evolves — so do we.' },
]

const team = [
  { initials: 'EC', name: 'Edward Chirwa', role: 'Founder & Brand Director', focus: 'Brand strategy & positioning' },
  { initials: 'LP', name: 'Lerato Pule', role: 'Head of Paid Media', focus: 'Performance marketing & ROI' },
  { initials: 'SR', name: 'Steve Ronald', role: 'Developer & Strategy Director', focus: 'Tech architecture & growth systems' },
  { initials: 'AZ', name: 'Amara Zulu', role: 'Creative & Brand Lead', focus: 'Visual identity & creative direction' },
]

const differentiators = [
  { title: 'Founder-Led Strategy', desc: 'You work directly with founders who have built and scaled businesses, not account managers reading from playbooks.' },
  { title: 'Systems, Not Shortcuts', desc: 'We build automated growth engines — not one-off campaigns that fizzle when the budget runs dry.' },
  { title: 'Revenue Accountability', desc: 'We tie our work to your bottom line. If it does not drive measurable growth, we pivot or kill it.' },
  { title: 'No Jargon, No Fluff', desc: 'Clear communication, honest reporting, and decisions driven by data — not buzzwords.' },
]

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}>
          <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" />
        </div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>Who We Are</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-6" style={{ color: '#E8E3D8' }}>
            We Built the Agency<br />We <span className="text-shimmer italic">Wished</span> We Had
          </h1>
          <p className="font-light leading-[1.8] text-[1.1rem] max-w-[640px] mx-auto" style={{ color: '#6B6860' }}>
            A growth partner that combines strategic thinking with relentless execution. 
            We turn marketing into a revenue engine — not a cost center.
          </p>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <ScrollReveal><SectionLabel>Our Origin</SectionLabel></ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-semibold mt-1 mb-6" style={{ color: '#E8E3D8' }}>
                Born From<br /><span className="text-shimmer italic">Real</span> Frustration
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <p className="font-light leading-[1.85] mb-5" style={{ color: '#6B6860' }}>
                We were founders tired of agencies that hid behind jargon, delivered bloated reports instead of results, and treated our businesses like invoice numbers.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={220}>
              <p className="font-light leading-[1.85] mb-5" style={{ color: '#6B6860' }}>
                The gap was obvious: no one was building <strong style={{ color: '#E8E3D8' }}>growth systems</strong> — automated, measurable, compounding engines that generate revenue long after launch.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={280}>
              <p className="font-light leading-[1.85] mb-6" style={{ color: '#6B6860' }}>
                So we built it ourselves. A team of strategists, developers, and creatives accountable to one metric: <strong style={{ color: '#E8E3D8' }}>your actual business growth</strong>.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="right">
            <div className="rounded-[24px] p-12 flex flex-col justify-between gap-10 min-h-[360px]"
              style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.15)', boxShadow: '0 0 60px rgba(201,169,110,0.04)' }}>
              <blockquote className="font-cormorant text-[1.85rem] italic leading-[1.4]" style={{ color: '#E8E3D8' }}>
                "We don't chase vanity metrics. We build systems that turn marketing spend into predictable, scalable revenue."
              </blockquote>
              <div className="pt-6" style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
                <p className="font-semibold" style={{ color: '#E8E3D8' }}>The Eva-Tech-Studio Team</p>
                <p className="text-[0.78rem] mt-1" style={{ color: '#6B6860' }}>Johannesburg, South Africa · Est. 2020</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16">
          <ScrollReveal>
            <div className="p-10 rounded-[24px] h-full" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(201,169,110,0.1)' }}>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] mb-4 block" style={{ color: '#C9A96E' }}>Our Mission</span>
              <h3 className="text-[1.8rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>Turn Marketing Into Your Growth Engine</h3>
              <p className="leading-[1.8]" style={{ color: '#6B6860' }}>
                Every day, we help ambitious brands replace scattered tactics with integrated growth systems. 
                Strategy, creative, tech, and media — unified and optimized for one thing: <strong style={{ color: '#E8E3D8' }}>revenue growth</strong>.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="p-10 rounded-[24px] h-full" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(74,122,100,0.2)' }}>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] mb-4 block" style={{ color: '#4A7A64' }}>Our Vision</span>
              <h3 className="text-[1.8rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>Redefine How Brands Scale</h3>
              <p className="leading-[1.8]" style={{ color: '#6B6860' }}>
                We are building the category-defining growth partner for ambitious brands. 
                Where others sell services, we deliver <strong style={{ color: '#E8E3D8' }}>outcomes</strong>. 
                Where others rent attention, we build compounding assets that keep generating returns.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-16">
              <SectionLabel center>Our Process</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2" style={{ color: '#E8E3D8' }}>Strategy → Build → Scale</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Strategy', desc: 'Deep audit, competitive analysis, and growth roadmap' },
              { step: '02', title: 'Build', desc: 'Systems, creatives, and tech infrastructure' },
              { step: '03', title: 'Deploy', desc: 'Launch with precision targeting and full-funnel tracking' },
              { step: '04', title: 'Optimize', desc: 'Iterate based on real performance data' },
              { step: '05', title: 'Scale', desc: 'Systematic expansion of winning channels' },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 80}>
                <div className="p-6 rounded-[16px] h-full" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <span className="text-[2rem] font-bold block mb-3" style={{ color: 'rgba(201,169,110,0.3)' }}>{item.step}</span>
                  <h4 className="font-semibold mb-2" style={{ color: '#E8E3D8' }}>{item.title}</h4>
                  <p className="text-[0.8rem] leading-[1.6]" style={{ color: '#6B6860' }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-3)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-16">
              <SectionLabel center>Differentiators</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2" style={{ color: '#E8E3D8' }}>Why Brands Choose Us</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {differentiators.map((d, i) => (
              <ScrollReveal key={d.title} delay={i * 60}>
                <div className="p-8 rounded-[20px] h-full" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <h4 className="font-cormorant text-[1.4rem] font-semibold mb-3" style={{ color: '#E8E3D8' }}>{d.title}</h4>
                  <p className="text-[0.9rem] leading-[1.7]" style={{ color: '#6B6860' }}>{d.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-16 px-6 md:px-[60px]" style={{ background: 'var(--obsidian-3)', borderTop: '1px solid rgba(201,169,110,0.08)', borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 10, suffix: '+', label: 'Brands Scaled', decimals: 0 },
            { end: 94, suffix: '%', label: 'Client Retention', decimals: 0 },
            { end: 2.5, suffix: 'M+', label: 'Revenue Impact', decimals: 1 },
            { end: 6, suffix: '', label: 'Years in Business', decimals: 0 },
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

      {/* VALUES */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-16">
              <SectionLabel center>What Drives Us</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>Our Values Are Our Operating System</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 60}>
                <div className="p-8 rounded-[20px] transition-all duration-300 h-full group card hover:border-[rgba(201,169,110,0.2)]"
                  style={{ background: 'var(--obsidian-3)' }}>
                  <span className="text-[1.6rem] block mb-4">{v.icon}</span>
                  <h3 className="font-semibold text-[1.05rem] mb-2" style={{ color: '#E8E3D8' }}>{v.title}</h3>
                  <p className="text-[0.82rem] leading-[1.7]" style={{ color: '#6B6860' }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[600px] mx-auto mb-16">
              <SectionLabel center>The Team</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2" style={{ color: '#E8E3D8' }}>Who Drives Your Growth</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 80}>
                <div className="text-center group">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-[1.6rem] font-bold mx-auto mb-4 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(201,169,110,0.2)]"
                    style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                    {m.initials}
                  </div>
                  <h4 className="font-syne text-[0.92rem] font-bold mb-1" style={{ color: '#E8E3D8' }}>{m.name}</h4>
                  <p className="text-[0.76rem] mb-1" style={{ color: '#6B6860' }}>{m.role}</p>
                  <p className="text-[0.7rem]" style={{ color: '#4A7A64' }}>{m.focus}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[100px] px-6 md:px-[60px] relative overflow-hidden" style={{ background: 'var(--obsidian-2)' }}>
        <div className="gold-line absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5" style={{ color: '#E8E3D8' }}>
              Ready to Turn Your Business Into a <span className="text-shimmer italic">Growth System?</span>
            </h2>
            <p className="font-light leading-[1.8] mb-10" style={{ color: '#6B6860' }}>
              Let's build the infrastructure that transforms your marketing from a cost center into a revenue engine. 
              Strategy, execution, and results — all in one partnership.
            </p>
            <MagneticButton><Link href="/contact" className="btn-primary text-[0.9rem] px-8 py-4">Start Your Transformation →</Link></MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
