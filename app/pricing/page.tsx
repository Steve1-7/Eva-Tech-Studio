import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import CountUp from '@/components/CountUp'

export const metadata: Metadata = { title: 'Pricing — Eva-Tech-Studio', description: 'Transparent pricing plans.' }

const plans = [
  { name: 'Starter', price: 10000, desc: 'For businesses ready to establish a strong digital foundation.', features: ['Social media management (2 platforms)', '12 posts/month with graphics', 'Basic paid ads (up to R5K spend)', 'Monthly performance report', 'Email support within 24 hours', 'Onboarding strategy session'], cta: 'Get Started', popular: false },
  { name: 'Growth', price: 20000, desc: 'For ambitious brands ready to scale fast with integrated, multi-channel growth.', features: ['Full social media management (4 platforms)', '24 posts/month + Stories & Reels', 'Paid ads management (up to R25K spend)', 'SEO optimisation (on-page & technical)', 'Email marketing (2 campaigns/month)', 'Bi-weekly strategy calls', 'CRO & landing page optimisation', 'Priority Slack support'], cta: 'Start Growing →', popular: true },
  { name: 'Scale', price: 35000, desc: 'Full-service partnership for established brands ready to dominate their market.', features: ['Everything in Growth, plus:', 'Dedicated account director', 'Unlimited paid ads management', 'Website development & CRO (ongoing)', 'Full CRM & automation setup', 'Video & photography production', 'Weekly strategy sessions', 'Brand strategy & positioning'], cta: "Let's Talk", popular: false },
]

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
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 80}>
                <div className={`rounded-[24px] p-10 relative h-full flex flex-col card ${p.popular ? 'border-[rgba(201,169,110,0.3)]' : ''}`}
                  style={p.popular ? { background: 'linear-gradient(145deg, var(--obsidian-4), var(--obsidian-3))', boxShadow: '0 0 60px rgba(201,169,110,0.08)' } : { background: 'var(--obsidian-3)' }}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.68rem] font-bold tracking-[0.1em] uppercase px-4 py-1 rounded-full whitespace-nowrap"
                      style={{ background: 'var(--gold)', color: 'var(--obsidian)' }}>
                      Most Popular
                    </div>
                  )}
                  <div className="font-syne text-[0.72rem] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: p.popular ? '#C9A96E' : '#6B6860' }}>{p.name}</div>
                  <div className="font-cormorant font-bold leading-none tracking-tight my-3" style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', color: '#E8E3D8' }}>
                    <sup className="text-[1.3rem] align-super" style={{ color: '#C9A96E' }}>R</sup>
                    <CountUp end={p.price} duration={1500} />
                    <sub className="text-[0.95rem] align-baseline font-dm font-light" style={{ color: '#6B6860' }}>/mo</sub>
                  </div>
                  <p className="text-[0.83rem] leading-[1.65] mb-6" style={{ color: '#6B6860' }}>{p.desc}</p>
                  <div className="h-px mb-6" style={{ background: 'rgba(201,169,110,0.08)' }} />
                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-[0.83rem]" style={{ color: '#B8B2A8' }}>
                        <span className="font-bold text-[0.75rem] mt-0.5 shrink-0" style={{ color: '#C9A96E' }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <MagneticButton className="w-full">
                    <Link href="/contact" className={p.popular ? 'btn-primary w-full justify-center text-center block' : 'btn-outline w-full justify-center text-center block'}>
                      {p.cta}
                    </Link>
                  </MagneticButton>
                </div>
              </ScrollReveal>
            ))}
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
