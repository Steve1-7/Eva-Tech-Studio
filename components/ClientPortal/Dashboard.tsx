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

function StatCard({ title, value, subtitle }: { title: string, value: string, subtitle?: string }) {
  return (
    <div className="rounded-[14px] p-4" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.04)' }}>
      <div className="text-[0.78rem] mb-1" style={{ color: '#6B6860' }}>{title}</div>
      <div className="font-cormorant text-[1.4rem] font-bold" style={{ color: '#E8E3D8' }}>{value}</div>
      {subtitle && <div className="text-[0.78rem] mt-1" style={{ color: '#4A7A64' }}>{subtitle}</div>}
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

  useEffect(() => {
    let mounted = true

    async function loadMetrics() {
      setLoadingMetrics(true)
      try {
        // Attempt to fetch client_metrics table (date, speed, seo_score, uptime, traffic)
        let q = supabase
          .from('client_metrics')
          .select('date, speed, seo_score, uptime, security_score, traffic')
          .order('date', { ascending: true })
          .limit(100)

        if (userId) {
          q = (q as any).eq('client_id', userId)
        }

        const { data, error } = await q

        if (error) {
          console.warn('[Dashboard] client_metrics fetch error:', error.message || error)
          setMetrics([])
        } else if (mounted) {
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
        } else if (mounted) {
          setPosts(data || [])
        }
      } catch (err) {
        console.error('[Dashboard] posts error', err)
        setPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }

    // Resolve current user (if signed in) and then load data
    const { data: userData } = await supabase.auth.getUser()
    const uid = userData?.user?.id || null
    if (uid) setUserId(uid)

    await loadMetrics()
    await loadPosts()

    // Realtime subscription for client_metrics (scoped by userId when available)
    let channel: any = null
    try {
      const filter = userId ? `client_id=eq.${userId}` : undefined
      channel = supabase.channel('realtime-client_metrics')
      if (filter) {
        channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'client_metrics', filter }, (payload: any) => {
          setMetrics(prev => {
            const next = [...prev.filter((r:any)=>r.date !== payload.new.date), payload.new]
            return next.sort((a:any,b:any)=>new Date(a.date).getTime() - new Date(b.date).getTime())
          })
        }).subscribe()
      } else {
        channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'client_metrics' }, (payload: any) => {
          setMetrics(prev => {
            const next = [...prev.filter((r:any)=>r.date !== payload.new.date), payload.new]
            return next.sort((a:any,b:any)=>new Date(a.date).getTime() - new Date(b.date).getTime())
          })
        }).subscribe()
      }
    } catch (e) {
      console.warn('[Dashboard] realtime subscribe failed', e)
    }

    return () => {
      mounted = false
      if (channel) {
        try { supabase.removeChannel(channel) } catch (e) { /* ignore */ }
      }
    }
  }, [])

  // Convert metrics to chart-friendly series
  const series = metrics.map((m:any) => ({
    date: m.date,
    speed: m.speed || 0,
    traffic: m.traffic || 0,
    seo: m.seo_score || 0,
    uptime: m.uptime || 0,
  }))

  return (
    <div className="space-y-8">
      {/* Performance Dashboard */}
      <div>
        <h3 className="font-semibold mb-4" style={{ color: '#E8E3D8' }}>Website Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <StatCard title="Speed" value={loadingMetrics ? 'Loading…' : (metrics.length ? `${Math.round((speedSeries.reduce((a,b)=>a+b,0)/Math.max(1,speedSeries.length)))} ms` : '—')} subtitle={metrics.length ? 'Average (recent)' : 'No data'} />
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
