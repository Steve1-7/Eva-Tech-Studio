'use client'

import { useMemo, useState } from 'react'

export interface CareerJob {
  id: number | string
  title: string
  company: string
  location: string | null
  jobType: string | null
  salary: string | null
  description: string | null
  applyUrl: string | null
  remote: boolean
  featured: boolean
  category: string | null
  createdAt?: string
}

export default function CareerListings({ jobs }: { jobs: CareerJob[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [jobType, setJobType] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const categories = useMemo(() => Array.from(new Set(jobs.map(job => job.category).filter((value): value is string => Boolean(value)))).sort(), [jobs])
  const types = useMemo(() => Array.from(new Set(jobs.map(job => job.jobType).filter((value): value is string => Boolean(value)))).sort(), [jobs])
  const filteredJobs = jobs.filter(job => {
    const searchable = `${job.title} ${job.company} ${job.location || ''} ${job.description || ''} ${job.category || ''}`.toLowerCase()
    return searchable.includes(query.trim().toLowerCase())
      && (!category || job.category === category)
      && (!jobType || job.jobType === jobType)
      && (!remoteOnly || job.remote)
  })

  return (
    <section className="border-y px-6 py-10 md:px-[60px]" style={{ background: 'var(--obsidian-2)', borderColor: 'rgba(232,227,216,0.08)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-3 md:grid-cols-2 md:items-end lg:grid-cols-[minmax(240px,1fr)_200px_200px_auto]">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B877F' }}>
            Search roles
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, company, location..." className="form-input mt-2" />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B877F' }}>
            Category
            <select value={category} onChange={event => setCategory(event.target.value)} className="form-input mt-2">
              <option value="">All categories</option>
              {categories.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B877F' }}>
            Work type
            <select value={jobType} onChange={event => setJobType(event.target.value)} className="form-input mt-2">
              <option value="">All work types</option>
              {types.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm" style={{ color: '#B8B2A8' }}>
            <input type="checkbox" checked={remoteOnly} onChange={event => setRemoteOnly(event.target.checked)} />
            Remote only
          </label>
        </div>

        <div className="mb-4 mt-8 flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
          <h2 className="font-syne text-sm font-bold uppercase tracking-wider" style={{ color: '#E8E3D8' }}>Open positions</h2>
          <span className="text-sm" style={{ color: '#8B877F' }}>{filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}</span>
        </div>

        <div className="divide-y" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
          {filteredJobs.map(job => (
            <article key={job.id} className="grid gap-5 py-6 md:grid-cols-[1fr_auto] md:items-center" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {job.featured && <span className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#C9A96E' }}>Featured</span>}
                  {job.category && <span className="text-[0.68rem] uppercase tracking-wider" style={{ color: '#6B9B83' }}>{job.category}</span>}
                </div>
                <h3 className="font-cormorant text-2xl font-semibold" style={{ color: '#E8E3D8' }}>{job.title}</h3>
                <p className="mt-1 text-sm" style={{ color: '#B8B2A8' }}>{job.company} <span aria-hidden="true">·</span> {job.location || (job.remote ? 'Remote' : 'Location not specified')}</p>
                {job.description && <p className="mt-3 max-w-[780px] whitespace-pre-line text-sm leading-6" style={{ color: '#8B877F' }}>{job.description}</p>}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: '#6B6860' }}>
                  {job.jobType && <span>{job.jobType}</span>}
                  {job.salary && <span>{job.salary}</span>}
                  {job.remote && <span>Remote-friendly</span>}
                </div>
              </div>
              {job.applyUrl && <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center whitespace-nowrap px-5 py-3">View & Apply ↗</a>}
            </article>
          ))}
          {filteredJobs.length === 0 && (
            <p className="py-12 text-center text-sm" style={{ color: '#8B877F' }}>
              {jobs.length ? 'No roles match those filters. Try changing your search.' : 'No open positions right now. Follow us on LinkedIn for updates.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}