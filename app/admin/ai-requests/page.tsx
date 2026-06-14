'use client'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function Page() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [query, setQuery] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch(`/api/admin/ai-requests?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(query)}`)
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Unauthorized')
          return
        }
        const data = await res.json()
        setRequests(data.requests || [])
        setTotal(data.count || 0)
      } catch (err: any) {
        setError(err?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, pageSize, query])

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-6">AI Consultant Requests (Admin)</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 flex items-center gap-3">
        <input placeholder="Search business or industry" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} className="form-input" />
        <select value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(1) }} className="form-input w-32">
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <div className="text-sm text-gray-600">Showing {requests.length} of {total} results</div>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="p-4 border rounded bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{r.business_name || '—'}</div>
                <div className="text-sm text-gray-600">{r.industry || '—'} · Submitted {new Date(r.submitted_at).toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-500">ID: {r.id}</div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              <div><strong>Website:</strong> {r.website || '—'}</div>
              <div><strong>Goals:</strong> {r.project_goals || '—'}</div>
              <div><strong>Audience:</strong> {r.target_audience || '—'}</div>
              <div><strong>Competitors:</strong> {r.competitors || '—'}</div>
              <div><strong>Required Features:</strong> {r.required_features || '—'}</div>
              <div><strong>Budget:</strong> {r.budget_range || '—'}</div>
            </div>
            <details className="mt-3 bg-white p-3 rounded">
              <summary className="cursor-pointer font-medium">AI Response</summary>
              <pre className="whitespace-pre-wrap text-sm mt-2">{JSON.stringify(r.ai_response, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button className="px-3 py-1 border rounded" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Previous</button>
        <div>Page {page} · {Math.ceil(total / pageSize) || 1}</div>
        <button className="px-3 py-1 border rounded" onClick={() => setPage(page + 1)} disabled={page * pageSize >= total}>Next</button>
      </div>
    </main>
  )
}
