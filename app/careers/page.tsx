import type { Metadata } from 'next'
import SectionLabel from '@/components/SectionLabel'
import CareerListings, { type CareerJob } from '@/components/CareerListings'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Careers — Eva Tech Studio',
  description: 'Explore current roles, remote opportunities, and internships at Eva Tech Studio and partner companies.',
}

export default async function CareersPage() {
  let jobs: CareerJob[] = []

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      jobs = (data || []).map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.job_type,
        salary: job.salary,
        description: job.description,
        applyUrl: job.apply_url,
        remote: job.remote,
        featured: job.featured,
        category: job.category,
        createdAt: job.created_at,
      }))
    } catch (error) {
      console.error('[Careers] Failed to load jobs', error)
    }
  }

  return (
    <main style={{ background: 'var(--obsidian)' }}>
      <section className="px-6 pb-14 pt-[180px] md:px-[60px]">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Careers & Opportunities</SectionLabel>
          <div className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="max-w-[760px] font-cormorant text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[1.05]" style={{ color: '#E8E3D8' }}>
                Find work that moves good ideas forward.
              </h1>
              <p className="mt-5 max-w-[680px] text-base leading-7" style={{ color: '#8B877F' }}>
                Browse opportunities from Eva Tech Studio and our partners. Applications go directly to each employer; we do not collect candidate applications on this site.
              </p>
            </div>
            <a href="https://www.linkedin.com/company/eva-tech-studio" target="_blank" rel="noopener noreferrer" className="btn-outline px-5 py-3 whitespace-nowrap">Follow us on LinkedIn ↗</a>
          </div>
        </div>
      </section>
      <CareerListings jobs={jobs} />
    </main>
  )
}
