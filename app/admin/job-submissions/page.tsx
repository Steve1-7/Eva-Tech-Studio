'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import type { ExtractedJobFields } from '@/lib/jobAutomation'

type Submission = {
  id: number
  sender_id: string | null
  raw_content: string
  extracted_fields: ExtractedJobFields
  validation_errors: string[]
  received_at: string
}

export default function JobSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [fields, setFields] = useState<Record<number, ExtractedJobFields>>({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadSubmissions() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/job-submissions', { credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load the inbox.')
      setSubmissions(data.submissions || [])
      setFields(Object.fromEntries((data.submissions || []).map((item: Submission) => [item.id, item.extracted_fields || {}])))
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load the inbox.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadSubmissions() }, [])

  function updateField(id: number, field: keyof ExtractedJobFields, value: string | boolean) {
    setFields(current => ({ ...current, [id]: { ...current[id], [field]: value } }))
  }

  async function submitAction(id: number, action: 'publish' | 'reject') {
    setMessage('')
    try {
      const response = await fetch(`/api/admin/job-submissions/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, fields: fields[id] }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error([data.error, ...(data.validationErrors || [])].filter(Boolean).join(' '))
      setMessage(action === 'publish' ? 'Job published to the careers page.' : 'Submission rejected.')
      await loadSubmissions()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update this submission.')
    }
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-[150px] md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>Admin Dashboard</SectionLabel>
            <h1 className="mt-2 font-cormorant text-[2.5rem] font-semibold" style={{ color: '#E8E3D8' }}>Submission Inbox</h1>
            <p className="mt-2 text-sm" style={{ color: '#8B877F' }}>Review WhatsApp submissions before publishing. Source details remain unverified unless independently checked.</p>
          </div>
          <Link href="/admin/jobs" className="btn-outline px-5 py-3">Manage published jobs</Link>
        </div>

        {message && <p role="status" className="mb-5 text-sm" style={{ color: '#FCA5A5' }}>{message}</p>}
        {loading && <p style={{ color: '#8B877F' }}>Loading submissions...</p>}
        {!loading && submissions.length === 0 && <p style={{ color: '#8B877F' }}>No submissions are waiting for review.</p>}

        <div className="space-y-6">
          {submissions.map(submission => {
            const item = fields[submission.id] || {}
            const validationErrors = submission.validation_errors || []
            return (
              <article key={submission.id} className="rounded-xl p-5" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.08)' }}>
                <div className="mb-4 flex flex-wrap justify-between gap-2 text-xs" style={{ color: '#8B877F' }}>
                  <span>Received {new Date(submission.received_at).toLocaleString()} · Sender {submission.sender_id || 'unknown'}</span>
                  <span>Not employer-verified</span>
                </div>
                <details className="mb-5">
                  <summary className="cursor-pointer text-sm" style={{ color: '#A855F7' }}>Original WhatsApp message</summary>
                  <pre className="mt-3 whitespace-pre-wrap break-words text-sm" style={{ color: '#B8B2A8' }}>{submission.raw_content}</pre>
                </details>
                {validationErrors.length > 0 && (
                  <ul className="mb-4 list-disc pl-5 text-sm" style={{ color: '#FCA5A5' }}>
                    {validationErrors.map(error => <li key={error}>{error}</li>)}
                  </ul>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  {([
                    ['title', 'Job title'],
                    ['company', 'Company'],
                    ['location', 'Location'],
                    ['jobType', 'Employment type'],
                    ['salary', 'Salary'],
                    ['category', 'Category'],
                    ['applyUrl', 'Application URL'],
                    ['sourceUrl', 'Source URL'],
                    ['deadline', 'Deadline (YYYY-MM-DD)'],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>
                      {label}
                      <input
                        value={String(item[key] || '')}
                        onChange={event => updateField(submission.id, key, event.target.value)}
                        className="form-input mt-2"
                      />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm" style={{ color: '#B8B2A8' }}>
                    <input type="checkbox" checked={item.remote === true} onChange={event => updateField(submission.id, 'remote', event.target.checked)} />
                    Remote
                  </label>
                  <label className="text-xs uppercase tracking-wider md:col-span-2" style={{ color: '#8B877F' }}>
                    Description
                    <textarea value={item.description || ''} onChange={event => updateField(submission.id, 'description', event.target.value)} rows={5} className="form-input mt-2 resize-y" />
                  </label>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => void submitAction(submission.id, 'publish')} className="btn-primary px-5 py-3">Validate & publish</button>
                  <button onClick={() => void submitAction(submission.id, 'reject')} className="btn-outline px-5 py-3">Reject</button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
