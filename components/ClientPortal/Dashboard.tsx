"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import apiFetch from '@/lib/api'
import Sidebar from './Sidebar'

function StatCard({ title, value, subtitle }: { title: string, value: string, subtitle?: string }) {
  return (
    <div className="rounded-[14px] p-4" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.04)' }}>
      <div className="text-[0.78rem] mb-1" style={{ color: '#6B6860' }}>{title}</div>
      <div className="font-cormorant text-[1.4rem] font-bold" style={{ color: '#E8E3D8' }}>{value}</div>
      {subtitle && <div className="text-[0.78rem] mt-1" style={{ color: '#4A7A64' }}>{subtitle}</div>}
    </div>
  )
}

function SkeletonCard({ width = '100%', height = 36 }: { width?: string | number, height?: number }) {
  return (
    <div className="rounded-[14px] p-4 animate-pulse" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.02)' }}>
      <div className="mb-2" style={{ height: 12, width: '40%', background: 'rgba(232,227,216,0.03)' }} />
      <div style={{ height, width, background: 'rgba(232,227,216,0.04)' }} />
    </div>
  )
}

function Sparkline({ data, color = '#C9A96E' }: { data: number[], color?: string }) {
  if (!data || data.length === 0) return <div style={{ color: '#6B6860' }}>No data</div>
  const w = 160, h = 40
  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((d - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ClientDashboard() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loadingMetrics, setLoadingMetrics] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Move load functions to component scope so they can be reused (e.g., after edits)
  async function loadMetrics() {
    setLoadingMetrics(true)
    try {
      let q = supabase
        .from('client_metrics')
        .select('date, speed, seo_score, uptime, security_score, traffic')
        .order('date', { ascending: true })
        .limit(100)

      if (userId) q = (q as any).eq('client_id', userId)

      const { data, error } = await q
      if (error) {
        console.warn('[Dashboard] client_metrics fetch error:', error.message || error)
        setMetrics([])
      } else {
        setMetrics(data || [])
      }
    } catch (err) {
      console.error('[Dashboard] metrics error', err)
      setMetrics([])
    } finally {
      setLoadingMetrics(false)
    }
  }

  async function loadPosts() {
    setLoadingPosts(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id,title,date,published')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(10)

      if (error) {
        console.warn('[Dashboard] blog_posts fetch error:', error.message || error)
        setPosts([])
      } else {
        setPosts(data || [])
      }
    } catch (err) {
      console.error('[Dashboard] posts error', err)
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    let mounted = true

    // call the component-scoped loaders

    // Resolve current user (if signed in) and then load data
      // Run async tasks inside an IIFE to allow await usage
      let channel: any = null
      ;(async () => {
        const { data: userData } = await supabase.auth.getUser()
        const uid = userData?.user?.id || null
        if (uid) setUserId(uid)

        // Add sign-out handler available in dashboard header
        // Expose window.logout for quick debug (removed in production)
        try { (window as any).evaLogout = async () => { await supabase.auth.signOut(); window.location.reload() } } catch(e) {}

        await loadMetrics()
        await loadPosts()

        // Realtime subscription for client_metrics (scoped by uid when available)
        try {
          const filter = uid ? `client_id=eq.${uid}` : undefined
          const ch = supabase.channel('realtime-client_metrics')
          if (filter) {
            ch.on('postgres_changes', { event: '*', schema: 'public', table: 'client_metrics', filter }, (payload: any) => {
              setMetrics(prev => {
                const next = [...prev.filter((r: any) => r.date !== payload.new.date), payload.new]
                return next.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              })
            })
          } else {
            ch.on('postgres_changes', { event: '*', schema: 'public', table: 'client_metrics' }, (payload: any) => {
              setMetrics(prev => {
                const next = [...prev.filter((r: any) => r.date !== payload.new.date), payload.new]
                return next.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              })
            })
          }
          channel = ch.subscribe()
        } catch (e) {
          console.warn('[Dashboard] realtime subscribe failed', e)
        }
      })()

      return () => {
        mounted = false
        if (channel) {
          try { supabase.removeChannel(channel) } catch (e) { /* ignore */ }
        }
      }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (e) {
      console.error('[Dashboard] signOut failed', e)
    }
  }

  // Convert metrics to chart-friendly series
  const series = metrics.map((m:any) => ({
    date: m.date,
    speed: m.speed || 0,
    traffic: m.traffic || 0,
    seo: m.seo_score || 0,
    uptime: m.uptime || 0,
  }))

  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  const startEdit = (post: any) => setEditingPost(post)
  const closeEdit = () => setEditingPost(null)

  const saveEdit = async (updated: any) => {
    setSaving(true)
    try {
      const res = await apiFetch(`/api/blog/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      if (res.ok) {
        await loadMetrics()
        await loadPosts()
        closeEdit()
      } else {
        console.error('Edit save failed', await res.text())
        alert('Failed to save post')
      }
    } catch (e) {
      console.error('Save error', e)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-[400px] rounded-[16px] p-0 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6" style={{ background: 'transparent' }}>
      <div className="md:col-span-3 order-2 md:order-1 p-4">
        <Sidebar />
      </div>

      <div className="md:col-span-9 order-1 md:order-2 p-4 rounded-[16px]" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: '#E8E3D8' }}>Dashboard</h3>
          <div>
            <button onClick={handleSignOut} className="btn-ghost">Sign out</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {loadingMetrics ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard title="Traffic" value={String(metrics.reduce((s, m) => s + (m.traffic || 0), 0))} />
              <StatCard title="Speed" value={loadingMetrics ? 'Loading…' : (series.length ? `${Math.round(series.reduce((acc:any, row:any) => acc + (row.speed || 0), 0) / series.length)} ms` : '—')} />
              <StatCard title="Uptime" value={loadingMetrics ? 'Loading…' : (series.length ? `${Math.round((series.reduce((s:any,m:any)=>s+(m.uptime||0),0)/Math.max(1,series.length))*100)/100}%` : '—')} />
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div style={{ minHeight: 180 }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,227,216,0.03)" />
                <XAxis dataKey="date" tick={{ fill: '#6B6860' }} />
                <YAxis tick={{ fill: '#6B6860' }} />
                <Tooltip contentStyle={{ background: '#12141F', border: '1px solid rgba(232,227,216,0.04)' }} />
                <Line type="monotone" dataKey="traffic" stroke="#C9A96E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#E8E3D8' }}>Recent Posts</h4>
            {loadingPosts ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-[rgba(232,227,216,0.03)] rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-[rgba(232,227,216,0.03)] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[rgba(232,227,216,0.03)] rounded animate-pulse" />
              </div>
            ) : (
              <ul>
                {posts.map(p => (
                  <li key={p.id} className="py-2 border-b border-[rgba(232,227,216,0.03)] flex items-center justify-between">
                    <div>
                      <div style={{ color: '#E8E3D8' }}>{p.title}</div>
                      <div className="text-[0.75rem]" style={{ color: '#6B6860' }}>{p.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-outline" onClick={() => startEdit(p)}>Edit</button>
                      <a href={`/blog/${p.id}`} className="btn-primary">View</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={closeEdit} />
          <div className="relative z-10 w-full max-w-2xl rounded-[12px] p-6" style={{ background: 'var(--obsidian-3)' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#E8E3D8' }}>Edit Post</h3>
            <div className="space-y-3">
              <label className="block text-[0.8rem]" style={{ color: '#6B6860' }}>Title</label>
              <input className="form-input w-full" value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} />
              <label className="block text-[0.8rem]" style={{ color: '#6B6860' }}>Excerpt</label>
              <textarea className="form-input w-full" value={editingPost.excerpt} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} />
              <div className="flex gap-3 justify-end mt-4">
                <button className="btn-ghost" onClick={closeEdit}>Cancel</button>
                <button className="btn-primary" onClick={() => saveEdit(editingPost)} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const avgSpeed = series.length ? Math.round(series.reduce((acc:any, row:any) => acc + (row.speed || 0), 0) / series.length) : null

  return (
    <div className="space-y-8">
      {/* Performance Dashboard */}
      <div>
        <h3 className="font-semibold mb-4" style={{ color: '#E8E3D8' }}>Website Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <StatCard title="Speed" value={loadingMetrics ? 'Loading…' : (metrics.length ? `${avgSpeed} ms` : '—')} subtitle={metrics.length ? 'Average (recent)' : 'No data'} />
          </div>
          <div>
            <StatCard title="SEO Score" value={loadingMetrics ? 'Loading…' : (metrics.length ? `${Math.round((metrics.reduce((s,m)=>s+(m.seo_score||0),0)/Math.max(1,metrics.length)))}%` : '—')} subtitle={metrics.length ? 'Aggregate' : 'No data'} />
          </div>
          <div>
            <StatCard title="Uptime" value={loadingMetrics ? 'Loading…' : (metrics.length ? `${Math.round((metrics.reduce((s,m)=>s+(m.uptime||0),0)/Math.max(1,metrics.length))*100)/100}%` : '—')} subtitle={metrics.length ? 'Recent average' : 'No data'} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[12px] p-4" style={{ background: 'var(--obsidian-3)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[0.9rem]" style={{ color: '#E8E3D8' }}>Speed (last points)</div>
            </div>
            {loadingMetrics ? <div style={{ color: '#6B6860' }}>Loading...</div> : (
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={series} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <Line dataKey="speed" stroke="#6BA889" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-[12px] p-4" style={{ background: 'var(--obsidian-3)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[0.9rem]" style={{ color: '#E8E3D8' }}>Traffic (last points)</div>
            </div>
            {loadingMetrics ? <div style={{ color: '#6B6860' }}>Loading...</div> : (
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={series} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <Line dataKey="traffic" stroke="#C9A96E" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Blog Management */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#E8E3D8' }}>Blog Management</h3>
        <div className="space-y-2">
          {loadingPosts ? (
            <div style={{ color: '#6B6860' }}>Loading posts…</div>
          ) : posts.length === 0 ? (
            <div style={{ color: '#6B6860' }}>No published posts yet.</div>
          ) : (
            posts.map((p:any) => (
              <div key={p.id} className="rounded-[12px] p-3 flex items-center justify-between" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.04)' }}>
                <div>
                  <div className="font-semibold" style={{ color: '#E8E3D8' }}>{p.title}</div>
                  <div className="text-[0.85rem]" style={{ color: '#6B6860' }}>{new Date(p.date).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-outline">Edit</button>
                  <button className="btn-primary">View</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Project Status & Support */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#E8E3D8' }}>Project Status</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-[12px] p-4" style={{ background: 'var(--obsidian-3)' }}>
            <div className="text-[0.82rem] mb-2" style={{ color: '#6B6860' }}>Active Services</div>
            <ul className="text-[0.9rem]" style={{ color: '#E8E3D8' }}>
              <li>Paid Ads Management — On track</li>
              <li>SEO — In progress</li>
              <li>Website Optimization — Pending</li>
            </ul>
          </div>
          <div className="rounded-[12px] p-4" style={{ background: 'var(--obsidian-3)' }}>
            <div className="text-[0.82rem] mb-2" style={{ color: '#6B6860' }}>Tasks</div>
            <div className="text-[0.9rem]" style={{ color: '#E8E3D8' }}>Completed: 12 • Pending: 3</div>
          </div>
          <div className="rounded-[12px] p-4" style={{ background: 'var(--obsidian-3)' }}>
            <div className="text-[0.82rem] mb-2" style={{ color: '#6B6860' }}>Delivery Timeline</div>
            <div className="text-[0.9rem]" style={{ color: '#E8E3D8' }}>Next milestone: 25 May 2026</div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2" style={{ color: '#E8E3D8' }}>Live Support</h4>
          <div className="flex gap-3 items-center">
            <a href="https://wa.me/27676283210" target="_blank" rel="noreferrer" className="btn-outline">WhatsApp</a>
            <a href="mailto:support@eva-tech-studio.com" className="btn-primary">Email Support</a>
            <button className="btn-outline">Quick Support Form</button>
          </div>
        </div>
      </div>
    </div>
  )
}
