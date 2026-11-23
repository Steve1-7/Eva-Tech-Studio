'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'

type AutomationEvent = {
  id: number
  event_type: string
  payload: { job_id?: number; submission_id?: number }
  status: string
  attempts: number
  last_error: string | null
  created_at: string
}

type Distribution = {
  id: number
  event_id: number
  job_id: number
  destination: string
  status: string
  attempt_count: number
  error_message: string | null
  created_at: string
}

export default function AutomationPage() {
  const [events, setEvents] = useState<AutomationEvent[]>([])
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [error, setError] = useState('')

  async function load() {
    try {
      const response = await fetch('/api/admin/automation-events', { credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load automation status.')
      setEvents(data.events || [])
      setDistributions(data.distributions || [])
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load automation status.')
    }
  }

  useEffect(() => { void load() }, [])

  async function retry(id: number) {
    setError('')
    try {
      const response = await fetch(`/api/admin/automation-events/${id}/retry`, { method: 'POST', credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to retry the event.')
      await load()
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : 'Unable to retry the event.')
    }
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-[150px] md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>Admin Dashboard</SectionLabel>
            <h1 className="mt-2 font-cormorant text-[2.5rem] font-semibold" style={{ color: '#E8E3D8' }}>Automation Monitor</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/job-submissions" className="btn-outline px-5 py-3">Submission Inbox</Link>
            <Link href="/admin/jobs" className="btn-outline px-5 py-3">Job Listings</Link>
          </div>
        </div>

        {error && <p role="alert" className="mb-5 text-sm" style={{ color: '#FCA5A5' }}>{error}</p>}
        <h2 className="mb-3 font-syne text-sm font-bold uppercase tracking-wider" style={{ color: '#A855F7' }}>Outbox events</h2>
        <div className="mb-10 space-y-3">
          {events.map(event => (
            <article key={event.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg p-4" style={{ background: 'var(--obsidian-3)' }}>
              <div>
                <p className="text-sm" style={{ color: '#E8E3D8' }}>{event.event_type} · {event.status} · {event.attempts} attempts</p>
                <p className="mt-1 text-xs" style={{ color: '#8B877F' }}>{event.last_error || `Created ${new Date(event.created_at).toLocaleString()}`}</p>
              </div>
              {['failed', 'dead'].includes(event.status) && <button onClick={() => void retry(event.id)} className="btn-outline px-4 py-2">Retry</button>}
            </article>
          ))}
          {!events.length && <p className="text-sm" style={{ color: '#8B877F' }}>No automation events recorded.</p>}
        </div>

        <h2 className="mb-3 font-syne text-sm font-bold uppercase tracking-wider" style={{ color: '#A855F7' }}>WhatsApp delivery logs</h2>
        <div className="space-y-3">
          {distributions.map(log => (
            <article key={log.id} className="rounded-lg p-4" style={{ background: 'var(--obsidian-3)' }}>
              <p className="text-sm" style={{ color: '#E8E3D8' }}>Job {log.job_id} · {log.status} · attempt {log.attempt_count}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs" style={{ color: '#8B877F' }}>
                <span>Recipient ending {log.destination.slice(-4)} · {new Date(log.created_at).toLocaleString()}</span>
                {log.status === 'failed' && <button onClick={() => void retry(log.event_id)} className="underline" style={{ color: '#A855F7' }}>Retry failed delivery</button>}
              </div>
              {log.error_message && <p className="mt-1 text-xs" style={{ color: '#FCA5A5' }}>{log.error_message}</p>}
            </article>
          ))}
          {!distributions.length && <p className="text-sm" style={{ color: '#8B877F' }}>No WhatsApp delivery attempts recorded.</p>}
        </div>
      </div>
    </main>
  )
}
