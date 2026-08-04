import dynamic from 'next/dynamic'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'

const PortalWrapper = dynamic(() => import('@/components/ClientPortal/PortalWrapper'), { ssr: false })
const ClientDashboard = dynamic(() => import('@/components/ClientPortal/Dashboard'), { ssr: false })

export const metadata = {
  title: 'Client Portal — Eva-Tech-Studio',
  description: 'Secure client portal for project status, analytics, and support.'
}

export default function ClientPortalPage() {
  return (
    <>
      <section className="min-h-[calc(100vh-110px)] flex items-center pt-[140px] pb-12 px-6 md:px-[60px] text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <SectionLabel center>Client Portal</SectionLabel>
            <h1 className="text-[clamp(2.2rem,4vw,4rem)] font-semibold mt-4 mb-4" style={{ color: '#E8E3D8' }}>Client Portal Under Development</h1>
            <p className="text-[1rem] leading-[1.8] mb-8" style={{ color: '#6B6860' }}>
              We are finalizing the secure client experience with live analytics, campaign reporting, and private project coordination. Request early access and stay first in line for launch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ScrollReveal>
                <a href="/contact" className="btn-primary px-8 py-4">Request Access →</a>
              </ScrollReveal>
              <ScrollReveal delay={50}>
                <a href="/services" className="btn-outline px-8 py-4">See Services</a>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="mb-6 text-center">
              <h2 className="text-[1.35rem] font-semibold" style={{ color: '#E8E3D8' }}>Why the portal matters</h2>
              <p style={{ color: '#6B6860' }} className="mt-2">The client portal will bring campaign performance, content progress, and support into one secure hub for active clients.</p>
            </div>
          </ScrollReveal>

          <ClientDashboard />
        </div>
      </section>
    </>
  )
}
