'use client'
import { useRef } from 'react'
import Link from 'next/link'

const cases = [
  { icon: '💼', bg: 'linear-gradient(135deg,#0D1F3A,#1A3A5C)', tag: 'AI-Powered SaaS', title: 'PromptlyOS', sub: 'Multi-role career tracking dashboard', results: [['4','Role Dashboards'],['AI-Powered','Career Tracking'],['Real-time','Analytics']], link: 'https://promptlyos-seven.vercel.app/' },
  { icon: '🛍️', bg: 'linear-gradient(135deg,#1A0D2E,#3D1A5C)', tag: 'AI E-Commerce', title: 'Drip-Gather', sub: 'Premium AI-powered shopping experience', results: [['AI','Product Discovery'],['Premium','UX Design'],['Smart','Recommendations']], link: 'https://drip-gather.vercel.app/' },
]

export default function HorizontalScrollCases() {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (d: 'left' | 'right') => ref.current?.scrollBy({ left: d === 'right' ? 380 : -380, behavior: 'smooth' })

  return (
    <div className="relative">
      {/* Arrow controls */}
      <div className="flex justify-end gap-3 mb-6 px-6 md:px-[60px]">
        {(['left', 'right'] as const).map(d => (
          <button key={d} onClick={() => scroll(d)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 cursor-pointer hover:scale-110"
            style={{ border: '1px solid rgba(201,169,110,0.2)', color: 'rgba(201,169,110,0.5)', background: 'var(--obsidian-3)' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor='rgba(201,169,110,0.6)'; el.style.color='#C9A96E'; el.style.boxShadow='0 0 20px rgba(201,169,110,0.15)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='rgba(201,169,110,0.2)'; el.style.color='rgba(201,169,110,0.5)'; el.style.boxShadow='none' }}>
            {d === 'left' ? '←' : '→'}
          </button>
        ))}
      </div>

      {/* Scrollable track */}
      <div ref={ref}
        className="flex gap-5 overflow-x-auto pb-6 px-6 md:px-[60px] snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {cases.map(c => (
          <a key={c.title} href={c.link} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 w-[320px] sm:w-[360px] rounded-[24px] overflow-hidden snap-start group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.2)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,227,216,0.06)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
            {/* Thumbnail */}
            <div className="h-[180px] flex items-center justify-center text-[3.5rem] relative overflow-hidden" style={{ background: c.bg }}>
              {c.icon}
              {/* Subtle gold overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.05), transparent)' }} />
              {/* Visit link indicator */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[0.65rem] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ background: 'rgba(201,169,110,0.9)', color: '#07080F' }}>
                  Visit Site ↗
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-7">
              <span className="inline-block text-[0.68rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ background: 'rgba(201,169,110,0.08)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.15)' }}>
                {c.tag}
              </span>
              <h3 className="font-cormorant text-[1.45rem] font-semibold mb-1" style={{ color: '#E8E3D8' }}>{c.title}</h3>
              <p className="text-[0.8rem] mb-6" style={{ color: '#6B6860' }}>{c.sub}</p>
              <div className="flex gap-5 flex-wrap pt-5" style={{ borderTop: '1px solid rgba(232,227,216,0.05)' }}>
                {c.results.map(([num, label]) => (
                  <div key={label}>
                    <div className="font-cormorant text-[1.9rem] font-bold leading-none text-shimmer">{num}</div>
                    <div className="text-[0.7rem] mt-1" style={{ color: '#6B6860' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
