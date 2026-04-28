'use client'
import { useEffect, useState } from 'react'
import CountUp from './CountUp'

interface Metric {
  label: string
  value: number
  prefix?: string
  suffix?: string
  trend: 'up' | 'down' | 'neutral'
  trendValue?: number
}

const INITIAL_METRICS: Metric[] = [
  { label: 'Revenue Generated', value: 100, prefix: 'R', suffix: 'K+', trend: 'up', trendValue: 12 },
  { label: 'Active Campaigns', value: 8, suffix: '', trend: 'up', trendValue: 8 },
  { label: 'Avg. ROAS', value: 2.8, suffix: '×', trend: 'up', trendValue: 0.4 },
  { label: 'New Leads Today', value: 5, suffix: '', trend: 'up', trendValue: 15 },
]

const RECENT_EVENTS = [
  { time: '2m ago', event: 'DripGather generated R12K in sales', type: 'revenue' },
  { time: '5m ago', event: 'PromptlyOS onboarded 3 new users', type: 'growth' },
  { time: '8m ago', event: 'New lead from Google Ads — local SME', type: 'lead' },
  { time: '12m ago', event: 'DripGather AI recommendation engine deployed', type: 'metric' },
  { time: '15m ago', event: 'PromptlyOS career dashboard ROAS hit 2.8×', type: 'metric' },
]

export default function LiveDashboard() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [events, setEvents] = useState(RECENT_EVENTS)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update a metric
      const randomIndex = Math.floor(Math.random() * metrics.length)
      setMetrics(prev => {
        const newMetrics = [...prev]
        const change = (Math.random() - 0.3) * 2
        newMetrics[randomIndex] = {
          ...newMetrics[randomIndex],
          value: Math.max(0, newMetrics[randomIndex].value + change),
          trendValue: change,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        }
        return newMetrics
      })

      // Occasionally add a new event
      if (Math.random() > 0.7) {
        const newEvents = [
          { time: 'Just now', event: `New campaign milestone reached: ${Math.floor(Math.random() * 100)}%`, type: 'milestone' },
          ...events.slice(0, 4),
        ]
        setEvents(newEvents)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [metrics, events])

  return (
    <div className="rounded-[24px] p-8" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#4A7A64' }}>Live Dashboard</span>
        </div>
        <span className="text-[0.68rem]" style={{ color: '#3A3830' }}>Updating in real-time</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="p-4 rounded-[16px]" style={{ background: 'var(--obsidian-4)' }}>
            <div className="text-[0.68rem] mb-2" style={{ color: '#6B6860' }}>{m.label}</div>
            <div className="font-cormorant text-[1.8rem] font-bold leading-none mb-1" style={{ color: '#E8E3D8' }}>
              {m.prefix}
              <CountUp end={m.value} decimals={m.suffix === '×' ? 1 : 0} />
              {m.suffix}
            </div>
            {m.trendValue !== undefined && (
              <div className={`text-[0.65rem] font-medium ${m.trend === 'up' ? 'text-emerald-400' : m.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'} {Math.abs(m.trendValue).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="border-t border-[rgba(232,227,216,0.05)] pt-4">
        <div className="text-[0.68rem] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: '#3A3830' }}>Recent Activity</div>
        <div className="space-y-2">
          {events.map((e, i) => (
            <div key={i} className="flex items-start gap-3 text-[0.75rem]">
              <span className="shrink-0" style={{ color: '#3A3830' }}>{e.time}</span>
              <span style={{ color: '#B8B2A8' }}>{e.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
