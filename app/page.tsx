import dynamic from 'next/dynamic'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import CountUp from '@/components/CountUp'
import LiveTicker from '@/components/LiveTicker'
import ROICalculator from '@/components/ROICalculator'
import AIAuditWidget from '@/components/AIAuditWidget'
import MagneticButton from '@/components/MagneticButton'
import TiltCard from '@/components/TiltCard'
import ParallaxLayer from '@/components/ParallaxLayer'
import LiveDashboard from '@/components/LiveDashboard'
import PricingCalculator from '@/components/PricingCalculator'
import CaseStudySlider from '@/components/CaseStudySlider'
import Hero3DObject from '@/components/Hero3DObject'
import WebSocketMetrics from '@/components/WebSocketMetrics'
import ClientPortalPreview from '@/components/ClientPortalPreview'

const ParticleHero = dynamic(() => import('@/components/ParticleHero'), { ssr: false })

const services = [
  { icon: '📱', title: 'Social Media Marketing', desc: 'Scroll-stopping content and social strategies that turn followers into loyal, paying customers.', tags: ['Instagram', 'TikTok', 'LinkedIn', 'X'], featured: false },
  { icon: '🎯', title: 'Paid Ads Management', desc: 'High-performance campaigns engineered for maximum ROAS. Every rand earns its place.', tags: ['Google Ads', 'Meta', 'Programmatic'], featured: true },
  { icon: '🎨', title: 'Branding & Content', desc: 'Visual identities and content ecosystems that build authority and desire at every touchpoint.', tags: ['Brand Design', 'Copywriting', 'Strategy'], featured: false },
  { icon: '💻', title: 'Website Development', desc: 'Blazing-fast, conversion-obsessed websites on Next.js and React that impress and convert.', tags: ['Next.js', 'React', 'Headless'], featured: false },
  { icon: '🛒', title: 'E-commerce', desc: 'Online stores built to sell — optimising every step of the purchase journey for maximum AOV.', tags: ['Shopify', 'WooCommerce', 'Custom'], featured: false },
  { icon: '⚙️', title: 'SEO & Automation', desc: 'Compound organic growth and automated pipelines that work while you sleep.', tags: ['Technical SEO', 'CRM', 'Automation'], featured: false },
]

const steps = [
  { n: '01', title: 'Diagnose', desc: 'Deep-dive audit of your digital presence, funnel, competitors, and untapped growth opportunities.' },
  { n: '02', title: 'Architect', desc: 'A custom growth roadmap prioritised by ROI potential, with clear KPIs for every initiative.' },
  { n: '03', title: 'Execute', desc: 'Our multi-disciplinary team launches, tests, and iterates at speed — moving fast without breaking what works.' },
  { n: '04', title: 'Scale', desc: 'Once we find what converts, we amplify. Winning campaigns get scaled, systems get automated, growth compounds.' },
]

const testimonials = [
  { text: 'Eve-Tech-Studio completely transformed our online presence. Within 90 days, our organic traffic tripled and our cost-per-lead dropped by 60%. They think like growth partners, not service providers.', name: 'Kavya Mehta', role: 'CEO, DripGather', initials: 'KM', featured: false },
  { text: "We scaled from R200K to R1.2M monthly revenue in 8 months. Their paid ads strategy and website rebuild were game-changing. Eve-Tech-Studio doesn't just deliver work — they deliver transformation.", name: 'James Steyn', role: 'Founder, Outpost Outdoors', initials: 'JS', featured: true },
  { text: 'The automation systems they built saved us 20+ hours per week. Our CRM now runs itself, follow-ups happen instantly, and our close rate jumped 35%.', name: 'Amara Langa', role: 'MD, Vertex Financial', initials: 'AL', featured: false },
]

const marqueeItems = ['Social Media Marketing', 'Paid Ads Management', 'Website Development', 'SEO Optimisation', 'E-commerce Development', 'Brand Strategy', 'CRM Integration', 'Business Automation']

export default function Home() {
  return (
    <>
      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center pt-[130px] pb-24 px-6 md:px-[60px] overflow-hidden bg-[#07080F]">
        {/* Aurora background - parallax layer */}
        <ParallaxLayer speed={0.3} className="absolute inset-0">
          <div className="aurora-bg">
            <div className="aurora-orb aurora-orb-1" />
            <div className="aurora-orb aurora-orb-2" />
            <div className="aurora-orb aurora-orb-3" />
          </div>
        </ParallaxLayer>
        {/* Particle canvas - parallax layer */}
        <ParallaxLayer speed={0.5} className="absolute inset-0">
          <ParticleHero />
        </ParallaxLayer>
        {/* Subtle grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(232,227,216,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(232,227,216,0.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-[1200px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <ScrollReveal>
              <div className="inline-flex items-center gap-2.5 border border-[rgba(201,169,110,0.25)] bg-[rgba(201,169,110,0.06)] text-[#C9A96E] px-4 py-2 rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse-dot" />
                Growth-Driven Digital Agency
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1 className="text-[clamp(3rem,6.5vw,6rem)] font-semibold leading-[1.0] mb-6" style={{ color: '#E8E3D8', letterSpacing: '-0.03em' }}>
                Digital<br />
                Solutions{' '}
                <span className="text-shimmer italic font-light">Built</span>
                <br />
                To Scale.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="text-[1.05rem] leading-[1.85] font-light max-w-[480px] mb-7" style={{ color: '#6B6860' }}>
                We architect digital ecosystems that compound your growth — from performance
                marketing to scalable tech infrastructure, Eve-Tech-Studio turns ambition into
                measurable results.
              </p>
              <div className="mb-9">
                <LiveTicker />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="flex flex-wrap gap-4">
                <MagneticButton>
                  <Link href="/contact" className="btn-primary">Book a Strategy Call →</Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/services" className="btn-outline">Explore Services</Link>
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-[rgba(201,169,110,0.1)]">
                {[
                  { end: 3.2, suffix: '×', label: 'Avg. ROI Increase', decimals: 1 },
                  { end: 10, suffix: '+', label: 'Brands Scaled', decimals: 0 },
                  { end: 100, prefix: 'R', suffix: 'K+', label: 'Revenue Generated', decimals: 0 },
                ].map(({ end, suffix, prefix, label, decimals }) => (
                  <div key={label}>
                    <div className="font-cormorant text-[2.8rem] font-bold leading-none tracking-tight text-shimmer">
                      <CountUp end={end} suffix={suffix} prefix={prefix} decimals={decimals} />
                    </div>
                    <div className="text-[0.75rem] mt-1.5 tracking-[0.05em]" style={{ color: '#6B6860' }}>{label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Dashboard cards */}
          <div className="relative h-[500px] hidden md:block">
            {/* 3D Hero Object */}
            <ScrollReveal delay={200}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <Hero3DObject />
              </div>
            </ScrollReveal>
            {/* Main card */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] rounded-[20px] p-7 z-20 card" style={{ background: 'var(--obsidian-3)' }}>
              <div className="w-10 h-10 rounded-[10px] bg-[rgba(74,122,100,0.15)] flex items-center justify-center text-xl mb-4">📈</div>
              <div className="font-syne text-[0.78rem] font-bold mb-1 tracking-[0.06em] uppercase" style={{ color: '#6B6860' }}>Monthly Revenue</div>
              <div className="font-cormorant text-[2.2rem] font-bold" style={{ color: '#6BA889' }}>+127%</div>
              <div className="text-[0.7rem] font-semibold mt-0.5" style={{ color: '#4A7A64' }}>↑ vs last quarter</div>
              <div className="flex items-end gap-1 h-10 mt-4">
                {[30, 45, 40, 60, 70, 65, 85, 100].map((h, i) => (
                  <div key={i} className={`mini-bar ${i > 3 ? 'active' : ''}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* ROAS card */}
            <div className="absolute top-2 right-2 w-[200px] rounded-[20px] p-6 z-30 card">
              <div className="w-9 h-9 rounded-[8px] bg-[rgba(201,169,110,0.12)] flex items-center justify-center text-lg mb-3">🎯</div>
              <div className="font-syne text-[0.72rem] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: '#6B6860' }}>Ads ROAS</div>
              <div className="font-cormorant text-[2rem] font-bold" style={{ color: '#E8E3D8' }}>6.8×</div>
              <div className="h-[3px] rounded-full mt-3 overflow-hidden bg-[#232638]">
                <div className="h-full rounded-full grow-bar" style={{ background: 'var(--gold)' }} />
              </div>
            </div>

            {/* Traffic card */}
            <div className="absolute bottom-20 -left-4 w-[185px] rounded-[20px] p-6 z-30 card">
              <div className="w-9 h-9 rounded-[8px] bg-[rgba(74,122,100,0.15)] flex items-center justify-center text-lg mb-3">🌐</div>
              <div className="font-syne text-[0.72rem] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: '#6B6860' }}>Organic Traffic</div>
              <div className="font-cormorant text-[2rem] font-bold" style={{ color: '#E8E3D8' }}>+340%</div>
            </div>

            {/* Live card */}
            <div className="absolute bottom-4 right-2 w-[210px] rounded-[20px] p-6 z-30 card">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#4A7A64' }}>Live</span>
              </div>
              <div className="font-syne text-[0.72rem] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: '#6B6860' }}>New Leads Today</div>
              <div className="font-cormorant text-[2rem] font-bold" style={{ color: '#E8E3D8' }}>47</div>
            </div>

            {/* Floating badge */}
            <div className="absolute top-[200px] -right-10 btn-primary text-[0.72rem] px-4 py-2 animate-float z-40 pointer-events-none whitespace-nowrap shadow-[0_0_30px_rgba(201,169,110,0.3)]">
              ✨ Free Audit Available
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="marquee-wrapper py-5 border-y border-[rgba(201,169,110,0.1)]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══ VALUE PROP ══ */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <ScrollReveal><SectionLabel>Why Eve-Tech-Studio</SectionLabel></ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-6" style={{ color: '#E8E3D8' }}>
                We Don't Just Run<br />Campaigns. We Build<br />Growth Machines.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="font-light leading-[1.85] mb-10" style={{ color: '#6B6860', fontSize: '1rem' }}>
                Most agencies optimise for vanity metrics. We obsess over the numbers that actually
                move your business — qualified leads, conversion rates, and real revenue growth.
              </p>
            </ScrollReveal>
            <div className="flex flex-col gap-6">
              {[
                { icon: '🔬', title: 'Data-First Approach', desc: 'Every decision is backed by analytics and A/B testing. No guesswork, ever.' },
                { icon: '⚙️', title: 'Scalable Systems', desc: 'Automated pipelines, CRM ecosystems, and compounding SEO that grow with you.' },
                { icon: '🚀', title: 'Full-Funnel Execution', desc: 'From first impression to closed deal — every touchpoint engineered for conversion.' },
              ].map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 80}>
                  <div className="flex gap-4 items-start group">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-xl shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.15)' }}>
                      {p.icon}
                    </div>
                    <div>
                      <strong className="block font-semibold text-[0.95rem] mb-1" style={{ color: '#E8E3D8' }}>{p.title}</strong>
                      <span className="text-[0.85rem]" style={{ color: '#6B6860' }}>{p.desc}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { end: 94, suffix: '%', label: 'Client retention rate', desc: 'Our results keep clients coming back', gold: false },
              { end: 28, suffix: '', label: 'Days avg to first results', desc: 'Fast momentum, long-term impact', gold: true },
              { end: 5.1, suffix: '×', label: 'Average ad ROAS', desc: 'Across all managed accounts', gold: true },
              { end: 150, suffix: '+', label: 'Brands scaled globally', desc: 'B2B, DTC, SaaS & beyond', gold: false },
            ].map((c, i) => (
              <ScrollReveal key={c.label} delay={i * 80}>
                <div className={`rounded-[20px] p-7 card h-full ${c.gold ? 'border-[rgba(201,169,110,0.2)]' : ''}`}
                  style={{ background: c.gold ? 'linear-gradient(135deg, var(--obsidian-4), var(--obsidian-3))' : 'var(--obsidian-3)' }}>
                  <div className={`font-cormorant text-[3rem] font-bold leading-none tracking-tight mb-2 count-up-number ${c.gold ? 'text-shimmer' : ''}`}
                    style={c.gold ? undefined : { color: '#E8E3D8' }}>
                    <CountUp end={c.end} suffix={c.suffix} decimals={c.suffix === '×' ? 1 : 0} />
                  </div>
                  <div className="text-[0.74rem] mb-2" style={{ color: '#6B6860' }}>{c.label}</div>
                  <div className="text-[0.82rem] font-medium" style={{ color: '#B8B2A8' }}>{c.desc}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIVE DASHBOARD ══ */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-12">
              <SectionLabel center>Real-Time Results</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
                Live Campaign Performance
              </h2>
              <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
                See our impact in real-time. These metrics update live as campaigns run across our client portfolio.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <LiveDashboard />
          </ScrollReveal>

          <div className="mt-12">
            <ScrollReveal delay={120}>
              <WebSocketMetrics />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ SERVICES PREVIEW ══ */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-16">
              <SectionLabel center>What We Do</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
                Every Discipline Under One Roof
              </h2>
              <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
                Stop juggling agencies. We are your complete growth partner — from creative strategy to technical execution.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 60}>
                <TiltCard tiltStrength={12} glareOpacity={0.1}>
                  <div className={`rounded-[20px] p-9 h-full transition-all duration-300 cursor-pointer group card ${
                    s.featured
                      ? 'border-[rgba(201,169,110,0.3)]'
                      : 'hover:border-[rgba(201,169,110,0.2)]'
                  }`}
                    style={s.featured ? {
                      background: 'linear-gradient(145deg, var(--obsidian-4), var(--obsidian-3))',
                      boxShadow: '0 0 40px rgba(201,169,110,0.06), inset 0 1px 0 rgba(201,169,110,0.1)',
                    } : { background: 'var(--obsidian-3)' }}>
                    <div className="w-[50px] h-[50px] rounded-[12px] flex items-center justify-center text-[1.3rem] mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: s.featured ? 'rgba(201,169,110,0.12)' : 'var(--obsidian-5)' }}>
                      {s.icon}
                    </div>
                    <h3 className="font-cormorant text-[1.35rem] font-semibold mb-3" style={{ color: '#E8E3D8' }}>{s.title}</h3>
                    <p className="text-[0.85rem] leading-[1.72] mb-5" style={{ color: '#6B6860' }}>{s.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {s.tags.map(t => (
                        <span key={t} className="text-[0.68rem] font-medium px-2.5 py-1 rounded-full"
                          style={{ background: 'var(--obsidian-5)', color: '#6B6860', border: '1px solid rgba(232,227,216,0.06)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.78rem] font-semibold transition-colors duration-200 group-hover:gap-2.5"
                      style={{ color: s.featured ? '#C9A96E' : '#4A7A64' }}>
                      Learn more <span>→</span>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <MagneticButton>
              <Link href="/services" className="btn-outline">View All Services →</Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ══ CASE STUDIES ══ */}
      <CaseStudySlider />

      {/* ══ PROCESS ══ */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-20">
              <SectionLabel center>Our Process</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
                From Discovery to Domination
              </h2>
              <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
                A battle-tested framework that turns insight into action — and action into compounding growth.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden lg:block pointer-events-none absolute top-8 left-[12%] right-[12%] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim), var(--gold-dim), transparent)' }} />

            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 100}>
                <div className="text-center relative z-10 group">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-syne font-extrabold text-[0.88rem] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(201,169,110,0.25)]"
                    style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.2)', color: '#C9A96E' }}>
                    {s.n}
                  </div>
                  <h3 className="font-cormorant text-[1.3rem] font-semibold mb-3" style={{ color: '#E8E3D8' }}>{s.title}</h3>
                  <p className="text-[0.83rem] leading-[1.72]" style={{ color: '#6B6860' }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto mb-16">
              <SectionLabel center>Social Proof</SectionLabel>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
                Results Speak. Our Clients Agree.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 80}>
                <div className={`rounded-[20px] p-9 h-full card ${t.featured ? 'border-[rgba(201,169,110,0.25)]' : ''}`}
                  style={t.featured ? {
                    background: 'linear-gradient(145deg, var(--obsidian-4), var(--obsidian-3))',
                    boxShadow: '0 0 50px rgba(201,169,110,0.07)',
                  } : { background: 'var(--obsidian-3)' }}>
                  <div className="flex gap-0.5 mb-4">
                    {Array(5).fill(0).map((_, i) => <span key={i} className="text-[0.85rem]" style={{ color: '#C9A96E' }}>★</span>)}
                  </div>
                  <div className="font-cormorant text-[3rem] leading-none mb-3" style={{ color: t.featured ? 'rgba(201,169,110,0.3)' : 'rgba(201,169,110,0.2)' }}>"</div>
                  <p className="text-[0.88rem] leading-[1.8] font-light mb-7" style={{ color: t.featured ? '#B8B2A8' : '#6B6860' }}>{t.text}</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-[rgba(232,227,216,0.05)]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.82rem] font-bold flex-shrink-0"
                      style={{ background: t.featured ? 'rgba(201,169,110,0.15)' : 'var(--obsidian-5)', color: '#C9A96E' }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[0.85rem]" style={{ color: '#E8E3D8' }}>{t.name}</div>
                      <div className="text-[0.74rem] mt-0.5" style={{ color: '#6B6860' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Logo cloud */}
          <div className="flex flex-wrap items-center justify-center gap-10 mt-16 pt-10 border-t border-[rgba(232,227,216,0.05)]">
            {['Eva-Tech-Studio', 'DripGathr', 'PromptlyOS', 'OmniCommut', 'Kingsbarber'].map(logo => (
              <span key={logo} className="font-syne text-[0.8rem] font-bold tracking-[0.1em] transition-colors duration-200 cursor-default hover:text-[#C9A96E]"
                style={{ color: '#232638' }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ROI CALCULATOR ══ */}
      <ROICalculator />

      {/* ══ AI AUDIT ══ */}
      <AIAuditWidget />

      {/* ══ PRICING CALCULATOR ══ */}
      <PricingCalculator />

      {/* ══ CLIENT PORTAL PREVIEW ══ */}
      <ClientPortalPreview />

      {/* ══ FINAL CTA ══ */}
      <section className="py-[120px] px-6 md:px-[60px] relative overflow-hidden" style={{ background: 'var(--obsidian-2)' }}>
        <div className="aurora-bg" style={{ opacity: 0.4 }}>
          <div className="aurora-orb aurora-orb-1" style={{ opacity: 0.6 }} />
          <div className="aurora-orb aurora-orb-2" style={{ opacity: 0.4 }} />
        </div>
        <div className="gold-line absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <SectionLabel center>Ready to grow?</SectionLabel>
            <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-semibold mt-4 mb-6" style={{ color: '#E8E3D8' }}>
              Stop Leaving Revenue<br />on the{' '}
              <span className="text-shimmer italic">Table.</span>
            </h2>
            <p className="leading-[1.85] font-light mb-12 text-[1rem]" style={{ color: '#6B6860' }}>
              Every day without a clear growth strategy is a day your competitors pull further ahead.
              Let's build your unfair advantage — starting with a free, no-pressure strategy session.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton><Link href="/contact" className="btn-primary text-[0.9rem] px-8 py-4">Book a Strategy Call →</Link></MagneticButton>
              <MagneticButton><Link href="/contact" className="btn-ghost text-[0.9rem] px-8 py-4">Get a Free Audit</Link></MagneticButton>
            </div>
            <p className="text-[0.73rem] mt-6 tracking-[0.04em]" style={{ color: '#3A3830' }}>
              No commitment required · 30-minute call · Real, actionable insights
            </p>
          </div>
        </ScrollReveal>
        <div className="gold-line absolute bottom-0 left-0 right-0" />
      </section>
    </>
  )
}
