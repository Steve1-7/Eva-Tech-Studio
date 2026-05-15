import dynamic from 'next/dynamic'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'

const ClientLogin = dynamic(() => import('@/components/ClientPortal/LoginForm'), { ssr: false })
const ClientDashboard = dynamic(() => import('@/components/ClientPortal/Dashboard'), { ssr: false })

export const metadata = {
  title: 'Client Portal — Eva-Tech-Studio',
  description: 'Secure client portal for project status, analytics, and support.'
}

export default function ClientPortalPage() {
  return (
    <>
      <section className="pt-[140px] pb-12 px-6 md:px-[60px] text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <SectionLabel center>Client Portal</SectionLabel>
            <h1 className="text-[clamp(2rem,4vw,3.6rem)] font-semibold mt-4 mb-4" style={{ color: '#E8E3D8' }}>Secure Access For Active Clients</h1>
            <p className="text-[1rem] leading-[1.8] mb-8" style={{ color: '#6B6860' }}>
              Access performance dashboards, manage blog posts, view project status, and contact support — all in one secure place.
            </p>
          </ScrollReveal>

          <div className="max-w-[720px] mx-auto mt-8">
            <ScrollReveal>
              <ClientLogin />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="mb-6 text-center">
              <h2 className="text-[1.35rem] font-semibold" style={{ color: '#E8E3D8' }}>Client Dashboard Preview</h2>
              <p style={{ color: '#6B6860' }} className="mt-2">Once logged in you'll see a modern dashboard with performance, blog management, project status and support tools.</p>
            </div>
          </ScrollReveal>

          <ClientDashboard />
        </div>
      </section>
    </>
  )
}
