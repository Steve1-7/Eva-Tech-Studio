'use client'
import React, { useEffect, useState } from 'react'

export default function AdminAIMonitor() {
  const [metrics, setMetrics] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/admin/ai-monitor')
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Unauthorized or failed')
        }
        const data = await res.json()
        if (mounted) setMetrics(data.metrics)
      } catch (err: any) {
        setError(err.message || 'Failed to load metrics')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-6">Loading AI monitoring...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Monitoring</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total AI Reports</div>
          <div className="text-3xl font-bold">{metrics.totalReports}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">AI Analytics Events</div>
          <div className="text-3xl font-bold">{metrics.aiEventCount}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Recent Consultant Requests</h3>
        <ul className="space-y-2 text-sm">
          {metrics.recentRequests.length === 0 && <li>No recent requests</li>}
          {metrics.recentRequests.map((r: any) => (
            <li key={r.id} className="p-2 border rounded">
              <div className="font-medium">{r.business_name || '—'}</div>
              <div className="text-xs text-gray-500">{r.industry || '—'} • {new Date(r.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Breakdown</h3>
        <pre className="text-xs p-3 bg-gray-50 rounded">{JSON.stringify(metrics.breakdownByType || {}, null, 2)}</pre>
      </div>
    </div>
  )
}
