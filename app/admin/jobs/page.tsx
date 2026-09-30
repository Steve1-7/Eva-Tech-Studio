'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import type { CareerJob } from '@/components/CareerListings'

type JobForm = Omit<CareerJob, 'id' | 'createdAt'>

const emptyJob: JobForm = {
  title: '',
  company: '',
  location: '',
  jobType: '',
  salary: '',
  description: '',
  applyUrl: '',
  remote: false,
  featured: false,
  category: '',
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<CareerJob[]>([])
  const [form, setForm] = useState<JobForm>(emptyJob)
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadJobs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/jobs?admin=true&limit=100', { credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Sign in from the admin dashboard to manage jobs.')
      setJobs(data.jobs || [])
      setAuthorized(true)
      setError('')
    } catch (loadError) {
      setAuthorized(false)
      setError(loadError instanceof Error ? loadError.message : 'Unable to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadJobs() }, [])

  const updateForm = (changes: Partial<JobForm>) => setForm(current => ({ ...current, ...changes }))

  const resetForm = () => {
    setForm(emptyJob)
    setEditingId(null)
    setNotice('')
  }

  const editJob = (job: CareerJob) => {
    setEditingId(job.id)
    setForm({
      title: job.title,
      company: job.company,
      location: job.location || '',
      jobType: job.jobType || '',
      salary: job.salary || '',
      description: job.description || '',
      applyUrl: job.applyUrl || '',
      remote: job.remote,
      featured: job.featured,
      category: job.category || '',
    })
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveJob = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch(editingId === null ? '/api/jobs' : `/api/jobs/${editingId}`, {
        method: editingId === null ? 'POST' : 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save this job.')
      resetForm()
      setNotice(editingId === null ? 'Job published.' : 'Job updated.')
      await loadJobs()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this job.')
    } finally {
      setSaving(false)
    }
  }

  const deleteJob = async (job: CareerJob) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return
    setError('')
    setNotice('')
    try {
      const response = await fetch(`/api/jobs/${job.id}`, { method: 'DELETE', credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to delete this job.')
      if (editingId === job.id) resetForm()
      setJobs(current => current.filter(item => item.id !== job.id))
      setNotice('Job deleted.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this job.')
    }
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-[150px] md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>Admin Dashboard</SectionLabel>
            <h1 className="mt-2 font-cormorant text-[2.5rem] font-semibold" style={{ color: '#E8E3D8' }}>Job Listings</h1>
            <p className="mt-2 text-sm" style={{ color: '#8B877F' }}>Create roles, attach application links, and update or remove listings.</p>
          </div>
          <Link href="/admin" className="btn-outline px-5 py-3">Admin Dashboard</Link>
        </div>

        {(error || notice) && <p role="status" className="mb-5 text-sm" style={{ color: error ? '#FCA5A5' : '#9CC6A7' }}>{error || notice}</p>}

        {loading && !authorized && <p style={{ color: '#8B877F' }}>Checking admin access...</p>}
        {!loading && !authorized && <p className="text-sm" style={{ color: '#8B877F' }}>Sign in to manage job listings. <Link href="/admin" className="underline" style={{ color: '#C9A96E' }}>Open the admin dashboard</Link>.</p>}

        {authorized && <>
        <form onSubmit={saveJob} className="mb-10 grid gap-4 rounded-xl p-5 md:grid-cols-2" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.08)' }}>
          <h2 className="font-syne text-sm font-bold uppercase tracking-wider md:col-span-2" style={{ color: '#C9A96E' }}>{editingId === null ? 'Add a job' : 'Edit job'}</h2>
          <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>Job title<input required value={form.title} onChange={event => updateForm({ title: event.target.value })} className="form-input mt-2" /></label>
          <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>Company<input required value={form.company} onChange={event => updateForm({ company: event.target.value })} className="form-input mt-2" /></label>
          <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>Location<input value={form.location || ''} onChange={event => updateForm({ location: event.target.value })} placeholder="Johannesburg, South Africa" className="form-input mt-2" /></label>
          <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>Work type<input value={form.jobType || ''} onChange={event => updateForm({ jobType: event.target.value })} placeholder="Full-time, Contract, Internship" className="form-input mt-2" /></label>
          <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>Salary / compensation<input value={form.salary || ''} onChange={event => updateForm({ salary: event.target.value })} className="form-input mt-2" /></label>
          <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>Category<input value={form.category || ''} onChange={event => updateForm({ category: event.target.value })} placeholder="Engineering, Marketing..." className="form-input mt-2" /></label>
          <label className="text-xs uppercase tracking-wider md:col-span-2" style={{ color: '#8B877F' }}>Description<textarea value={form.description || ''} onChange={event => updateForm({ description: event.target.value })} rows={5} className="form-input mt-2 resize-y" /></label>
          <label className="text-xs uppercase tracking-wider md:col-span-2" style={{ color: '#8B877F' }}>Application link<input type="url" value={form.applyUrl || ''} onChange={event => updateForm({ applyUrl: event.target.value })} placeholder="https://..." className="form-input mt-2" /></label>
          <div className="flex flex-wrap gap-6 md:col-span-2">
            <label className="flex items-center gap-2 text-sm" style={{ color: '#B8B2A8' }}><input type="checkbox" checked={form.remote} onChange={event => updateForm({ remote: event.target.checked })} />Remote-friendly</label>
            <label className="flex items-center gap-2 text-sm" style={{ color: '#B8B2A8' }}><input type="checkbox" checked={form.featured} onChange={event => updateForm({ featured: event.target.checked })} />Feature this role</label>
          </div>
          <div className="flex gap-3 md:col-span-2">
            <button disabled={saving} className="btn-primary px-5 py-3">{saving ? 'Saving...' : editingId === null ? 'Publish Job' : 'Save Changes'}</button>
            {editingId !== null && <button type="button" onClick={resetForm} className="btn-outline px-5 py-3">Cancel</button>}
          </div>
        </form>

        <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
          <h2 className="font-syne text-sm font-bold uppercase tracking-wider" style={{ color: '#E8E3D8' }}>Current listings</h2>
          <span className="text-sm" style={{ color: '#8B877F' }}>{jobs.length} jobs</span>
        </div>
        {loading ? <p style={{ color: '#8B877F' }}>Loading jobs...</p> : (
          <div className="divide-y" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
            {jobs.map(job => (
              <article key={job.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgba(232,227,216,0.08)' }}>
                <div>
                  <h3 className="font-cormorant text-xl font-semibold" style={{ color: '#E8E3D8' }}>{job.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: '#8B877F' }}>{job.company} · {job.location || 'Location not specified'}{job.category ? ` · ${job.category}` : ''}</p>
                  {job.applyUrl && <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block max-w-full truncate text-xs underline" style={{ color: '#6B9B83' }}>{job.applyUrl}</a>}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => editJob(job)} className="btn-outline px-4 py-2">Edit</button>
                  <button onClick={() => void deleteJob(job)} className="btn-outline px-4 py-2">Delete</button>
                </div>
              </article>
            ))}
            {jobs.length === 0 && <p className="py-8 text-sm" style={{ color: '#8B877F' }}>No listings yet. Add a role above to publish it.</p>}
          </div>
        )}
        </>}
      </div>
    </main>
  )
}