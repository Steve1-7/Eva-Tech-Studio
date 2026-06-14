import Link from 'next/link'

export const metadata = {
  title: 'Careers — Eva Tech Studio',
  description: 'Explore careers, remote roles, internships and featured opportunities at Eva Tech Studio and partners.'
}

export default async function Page() {
  // Server-side fetch latest 50 jobs if Supabase is configured
  let jobs: any[] = []

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      jobs = (jobsData || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        jobType: j.job_type,
        salary: j.salary,
        description: j.description,
        applyUrl: j.apply_url,
        remote: j.remote,
        featured: j.featured,
        category: j.category,
        createdAt: j.created_at
      }))
    } catch (err) {
      console.warn('[Careers] Failed to load jobs from Supabase:', err)
      jobs = []
    }
  } else {
    console.warn('[Careers] Supabase not configured; showing no job listings locally.')
  }

  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Careers & Opportunities</h1>
        <p className="text-gray-600 mt-2">Browse curated job listings from Eva Tech Studio and partner employers. Click "Apply Now" to go to the employer's application page — we never store candidate applications.</p>
      </header>

      <section className="mb-8">
        <div className="flex items-center gap-3">
          <input aria-label="Search jobs" placeholder="Search jobs, companies or keywords" className="flex-1 p-3 border rounded" />
          <select className="p-3 border rounded">
            <option value="">All categories</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4">
        {jobs.length === 0 && <p className="text-gray-600">No jobs found yet — check back soon.</p>}

        {jobs.map(job => (
          <article key={job.id} className="p-4 border rounded-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} · {job.location || (job.remote ? 'Remote' : '—')}</p>
              </div>
              <div className="text-right">
                {job.featured && <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Featured</span>}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-700 line-clamp-4">{job.description}</div>

            <div className="mt-4 flex items-center gap-3">
              <a href={job.applyUrl || '#'} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded">Apply Now</a>
              <Link href={`mailto:info@evatech.studio?subject=Job%20Inquiry:%20${encodeURIComponent(job.title)}`} className="text-sm text-gray-600">Contact recruiter</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
