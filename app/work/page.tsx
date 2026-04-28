import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import HorizontalScrollCases from '@/components/HorizontalScrollCases'
import dynamic from 'next/dynamic'

const BeforeAfterSlider = dynamic(() => import('@/components/BeforeAfterSlider'), { ssr: false })

export const metadata: Metadata = { title: 'Case Studies — Eve-Tech-Studio', description: 'Real campaigns, real results.' }

export default function WorkPage() {
  return (
    <>
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}>
          <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" />
        </div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>Our Work</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-5" style={{ color: '#E8E3D8' }}>
            Case Studies That <span className="text-shimmer italic">Prove</span><br />the Approach
          </h1>
          <p className="font-light leading-[1.8] text-[1.05rem]" style={{ color: '#6B6860' }}>
            Real campaigns. Real results. Every case study is a blueprint showing exactly how we diagnose, execute, and scale growth.
          </p>
        </div>
      </section>

      <section className="py-[80px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] mb-8">
          <ScrollReveal>
            <SectionLabel>All Projects</SectionLabel>
            <h2 className="font-cormorant text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold mt-2" style={{ color: '#E8E3D8' }}>Scroll Through Our Work</h2>
          </ScrollReveal>
        </div>
        <HorizontalScrollCases />
      </section>

      {/* Featured Projects Detail */}
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-3)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[600px] mx-auto mb-14">
              <SectionLabel center>Featured Projects</SectionLabel>
              <h2 className="font-cormorant text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>Live Projects in Production</h2>
              <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>Click any project to visit the live site and explore the full experience.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PromptlyOS */}
            <ScrollReveal>
              <a href="https://promptlyos-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <div className="h-[220px] flex items-center justify-center text-[4rem] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0D1F3A,#1A3A5C)' }}>
                    💼
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.1), transparent)' }} />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[0.7rem] font-medium px-4 py-2 rounded-full" style={{ background: 'var(--gold)', color: '#07080F' }}>
                        Visit Live Site ↗
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="inline-block text-[0.68rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full mb-4"
                      style={{ background: 'rgba(201,169,110,0.08)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.15)' }}>
                      AI-Powered SaaS
                    </span>
                    <h3 className="font-cormorant text-[1.6rem] font-semibold mb-2" style={{ color: '#E8E3D8' }}>PromptlyOS</h3>
                    <p className="text-[0.9rem] mb-6" style={{ color: '#6B6860' }}>AI-powered career tracking dashboard featuring 4 specialized role dashboards: Developer, Freelancer, Manager, and Recruiter. Real-time analytics and intelligent career insights.</p>
                    <div className="flex flex-wrap gap-3">
                      {['Next.js', 'TypeScript', 'AI Integration', 'Multi-role Auth'].map(tag => (
                        <span key={tag} className="text-[0.7rem] px-3 py-1.5 rounded-full" style={{ background: 'rgba(232,227,216,0.05)', color: '#6B6860', border: '1px solid rgba(232,227,216,0.08)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>

            {/* Drip-Gather */}
            <ScrollReveal delay={100}>
              <a href="https://drip-gather.vercel.app/" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <div className="h-[220px] flex items-center justify-center text-[4rem] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1A0D2E,#3D1A5C)' }}>
                    🛍️
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.1), transparent)' }} />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[0.7rem] font-medium px-4 py-2 rounded-full" style={{ background: 'var(--gold)', color: '#07080F' }}>
                        Visit Live Site ↗
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="inline-block text-[0.68rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full mb-4"
                      style={{ background: 'rgba(201,169,110,0.08)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.15)' }}>
                      AI E-Commerce
                    </span>
                    <h3 className="font-cormorant text-[1.6rem] font-semibold mb-2" style={{ color: '#E8E3D8' }}>Drip-Gather</h3>
                    <p className="text-[0.9rem] mb-6" style={{ color: '#6B6860' }}>Premium AI-powered e-commerce platform with intelligent product discovery, personalized recommendations, and a luxury shopping experience.</p>
                    <div className="flex flex-wrap gap-3">
                      {['Next.js', 'Stripe', 'AI Recommendations', 'Premium UX'].map(tag => (
                        <span key={tag} className="text-[0.7rem] px-3 py-1.5 rounded-full" style={{ background: 'rgba(232,227,216,0.05)', color: '#6B6860', border: '1px solid rgba(232,227,216,0.08)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-[100px] px-6 md:px-[60px] relative overflow-hidden" style={{ background: 'var(--obsidian-2)' }}>
        <div className="gold-line absolute top-0 left-0 right-0" />
        <ScrollReveal>
          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5" style={{ color: '#E8E3D8' }}>
              Your Business Could Be the Next <span className="text-shimmer italic">Success Story.</span>
            </h2>
            <p className="font-light leading-[1.8] mb-10" style={{ color: '#6B6860' }}>
              Every case study started with a conversation. Let's talk about what's possible for your business.
            </p>
            <MagneticButton><Link href="/contact" className="btn-primary text-[0.9rem] px-8 py-4">Book a Strategy Call →</Link></MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
