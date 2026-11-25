import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createPageMetadata } from '@/lib/metadata'
import { BreadcrumbJsonLd } from '@/components/site/JsonLd'

type Props = { params: { slug: string } }

async function getJob(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw error
  if (!data || (data.deadline && data.deadline < new Date().toISOString().slice(0, 10))) return null
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.slug)
  if (!job) return { title: 'Job not found', robots: { index: false, follow: false } }

  return createPageMetadata({
    title: `${job.title} at ${job.company}`,
    description: `${job.title} at ${job.company}${job.location ? ` in ${job.location}` : ''}. View details and apply.`,
    path: `/careers/${encodeURIComponent(job.slug)}`,
    type: 'article',
  })
}

export default async function CareerJobPage({ params }: Props) {
  const job = await getJob(params.slug)
  if (!job) notFound()

  const { data: relatedJobs, error: relatedError } = job.category
    ? await supabase
        .from('jobs')
        .select('slug,title,company,location,deadline')
        .eq('status', 'published')
        .eq('category', job.category)
        .neq('id', job.id)
        .limit(3)
    : { data: [], error: null }
  if (relatedError) throw relatedError
  const currentDate = new Date().toISOString().slice(0, 10)
  const availableRelatedJobs = (relatedJobs || []).filter((related: any) => !related.deadline || related.deadline >= currentDate)

  const employmentTypeMap: Record<string, string> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    contract: 'CONTRACTOR',
    internship: 'INTERN',
    temporary: 'TEMPORARY',
  }
  const employmentType = job.job_type
    ? employmentTypeMap[job.job_type.toLowerCase()]
    : undefined

  const jobPosting = job.title && job.company && job.description && job.apply_url && (job.location || job.remote)
    ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        datePosted: job.created_at,
        validThrough: job.deadline ? `${job.deadline}T23:59:59Z` : undefined,
        employmentType,
        hiringOrganization: { '@type': 'Organization', name: job.company },
        jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
        jobLocation: job.location
          ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location } }
          : undefined,
        directApply: Boolean(job.apply_url),
      }
    : null

  return (
    <main className="min-h-screen px-6 pb-20 pt-[160px] md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }, { name: job.title, path: `/careers/${encodeURIComponent(job.slug)}` }]} />
      {jobPosting && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting).replace(/</g, '\\u003c') }}
        />
      )}
      <article className="mx-auto max-w-[900px]">
        <Link href="/careers" className="text-sm underline" style={{ color: '#C9A96E' }}>← All opportunities</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B9B83' }}>
          {job.category || 'Career opportunity'}
        </p>
        <h1 className="mt-3 font-cormorant text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[1.05]" style={{ color: '#E8E3D8' }}>
          {job.title}
        </h1>
        <p className="mt-4 text-lg" style={{ color: '#B8B2A8' }}>
          {job.company}{job.location ? ` · ${job.location}` : job.remote ? ' · Remote' : ''}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ color: '#8B877F' }}>
          {job.job_type && <span>{job.job_type}</span>}
          {job.salary && <span>{job.salary}</span>}
          {job.deadline && <span>Apply by {job.deadline}</span>}
          {job.remote && <span>Remote-friendly</span>}
        </div>
        <section className="mt-10 whitespace-pre-line border-t pt-8 text-base leading-8" style={{ color: '#B8B2A8', borderColor: 'rgba(232,227,216,0.12)' }}>
          {job.description || 'Contact the employer using the application link for more information.'}
        </section>
        {job.apply_url && (
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 inline-flex px-6 py-3">
            Apply with {job.company} ↗
          </a>
        )}
        <footer className="mt-12 border-t pt-5 text-xs" style={{ color: '#6B6860', borderColor: 'rgba(232,227,216,0.08)' }}>
          {job.source_url && <p>Source: <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="underline">original listing</a></p>}
          <p className="mt-2">
            {job.verification_status === 'verified' ? 'Employer verified' : 'Source not independently verified'}
          </p>
        </footer>
        {availableRelatedJobs.length > 0 && (
          <section className="mt-12 border-t pt-8" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
            <h2 className="font-syne text-sm font-bold uppercase tracking-wider" style={{ color: '#C9A96E' }}>Related opportunities</h2>
            <ul className="mt-4 space-y-3">
              {availableRelatedJobs.map((related: any) => (
                <li key={related.slug}>
                  <Link href={`/careers/${encodeURIComponent(related.slug)}`} className="text-base hover:underline" style={{ color: '#E8E3D8' }}>
                    {related.title} — {related.company}{related.location ? ` · ${related.location}` : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  )
}
