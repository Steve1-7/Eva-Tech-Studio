'use client'
import { useEffect, useState } from 'react'

const EVENTS = [
  { icon: '🎯', msg: 'Outpost Outdoors just generated R48K in sales today' },
  { icon: '📈', msg: 'NovaSpark hit 340% organic traffic growth this month' },
  { icon: '⚡', msg: 'New lead from Google Ads — Vertex Financial' },
  { icon: '🛒', msg: 'Lumis Beauty reached R1M in Shopify revenue' },
  { icon: '🎉', msg: 'Meridian Consulting closed 3 deals via automated nurture sequence' },
  { icon: '📊', msg: 'Drift Labs campaign ROAS hit 7.2× this week' },
  { icon: '🌍', msg: 'Client website ranked #1 on Google for 12 new keywords' },
  { icon: '💬', msg: '47 new leads generated via paid ads in the last 24 hours' },
]

export default function LiveTicker() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIndex(i => (i + 1) % EVENTS.length); setVisible(true) }, 350)
    }, 3800)
    return () => clearInterval(interval)
  }, [])

  const event = EVENTS[index]

  return (
    <div className="inline-flex items-center gap-3 rounded-full px-4 py-2.5 max-w-full"
      style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(201,169,110,0.12)' }}>
      <span className="w-2 h-2 rounded-full shrink-0 animate-pulse-dot" style={{ background: '#4A7A64' }} />
      <div className="flex items-center gap-2 min-w-0 overflow-hidden"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-4px)' }}>
        <span className="text-base shrink-0">{event.icon}</span>
        <span className="text-[0.78rem] font-medium truncate" style={{ color: '#B8B2A8' }}>{event.msg}</span>
      </div>
    </div>
  )
}
