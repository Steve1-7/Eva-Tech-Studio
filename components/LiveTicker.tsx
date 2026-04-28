'use client'
import { useEffect, useState } from 'react'

const EVENTS = [
  { icon: '🎯', msg: 'DripGather just generated R12K in sales today' },
  { icon: '📈', msg: 'PromptlyOS onboarded 3 new users this week' },
  { icon: '⚡', msg: 'New lead from Google Ads — local SME' },
  { icon: '🛒', msg: 'DripGather AI recommendation engine deployed' },
  { icon: '🎉', msg: 'PromptlyOS career dashboard launched successfully' },
  { icon: '📊', msg: 'Client campaign ROAS hit 2.8× this week' },
  { icon: '🌍', msg: 'Client website ranked #1 on Google for 3 new keywords' },
  { icon: '💬', msg: '12 new leads generated via paid ads in the last 24 hours' },
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
