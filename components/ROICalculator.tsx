'use client'
import { useState, useMemo } from 'react'
import SectionLabel from './SectionLabel'
import Link from 'next/link'
import CountUp from './CountUp'

const INDUSTRIES = ['E-commerce', 'B2B / SaaS', 'Professional Services', 'Retail', 'Real Estate', 'Healthcare']
const MULTIPLIERS: Record<string, number> = { 'E-commerce': 3.8, 'B2B / SaaS': 3.2, 'Professional Services': 2.9, 'Retail': 3.1, 'Real Estate': 3.5, 'Healthcare': 2.8 }

export default function ROICalculator() {
  const [spend, setSpend] = useState(15000)
  const [revenue, setRevenue] = useState(200000)
  const [industry, setIndustry] = useState('E-commerce')
  const [calculated, setCalculated] = useState(false)

  const results = useMemo(() => {
    const mult = MULTIPLIERS[industry] || 3.2
    const proj = revenue * mult
    const roas = (proj * 0.35) / spend
    const growth = ((proj - revenue) / revenue) * 100
    const months = Math.ceil(spend / (proj * 0.08))
    return { proj, roas, growth, months }
  }, [spend, revenue, industry])

  const fmt = (n: number) => n >= 1000000 ? `R${(n/1000000).toFixed(1)}M` : `R${Math.round(n/1000)}K`

  return (
    <section className="py-[100px] px-6 md:px-[60px] relative overflow-hidden" style={{ background: 'var(--obsidian-3)' }}>
      <div className="aurora-bg" style={{ opacity: 0.25 }}>
        <div className="aurora-orb aurora-orb-1" />
      </div>
      <div className="gold-line absolute top-0 left-0 right-0" />
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel center>ROI Calculator</SectionLabel>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
            See What Growth Actually Looks Like
          </h2>
          <p className="font-light max-w-[500px] mx-auto leading-[1.75]" style={{ color: '#6B6860' }}>
            Plug in your numbers and see your projected revenue growth with Eve-Tech-Studio.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <div className="rounded-[24px] p-8 md:p-10" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
            {/* Monthly Ad Spend */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="text-[0.74rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#6B6860' }}>Monthly Ad Spend</label>
                <span className="font-cormorant text-[1.4rem] font-bold" style={{ color: '#C9A96E' }}>R{spend.toLocaleString()}</span>
              </div>
              <input type="range" min={2000} max={100000} step={1000} value={spend}
                onChange={e => { setSpend(Number(e.target.value)); setCalculated(false) }}
                className="roi-slider w-full" />
              <div className="flex justify-between text-[0.68rem] mt-1.5" style={{ color: '#3A3830' }}><span>R2K</span><span>R100K</span></div>
            </div>

            {/* Revenue */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="text-[0.74rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#6B6860' }}>Current Monthly Revenue</label>
                <span className="font-cormorant text-[1.4rem] font-bold" style={{ color: '#C9A96E' }}>{fmt(revenue)}</span>
              </div>
              <input type="range" min={50000} max={5000000} step={10000} value={revenue}
                onChange={e => { setRevenue(Number(e.target.value)); setCalculated(false) }}
                className="roi-slider w-full" />
              <div className="flex justify-between text-[0.68rem] mt-1.5" style={{ color: '#3A3830' }}><span>R50K</span><span>R5M</span></div>
            </div>

            {/* Industry */}
            <div className="mb-8">
              <label className="block text-[0.74rem] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#6B6860' }}>Industry</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDUSTRIES.map(ind => (
                  <button key={ind} onClick={() => { setIndustry(ind); setCalculated(false) }}
                    className="px-3 py-2 rounded-full text-[0.74rem] font-medium transition-all cursor-pointer"
                    style={industry === ind
                      ? { background: 'var(--gold)', color: 'var(--obsidian)', border: '1px solid var(--gold)' }
                      : { background: 'var(--obsidian-5)', color: '#6B6860', border: '1px solid rgba(232,227,216,0.06)' }}>
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setCalculated(true)}
              className="w-full py-4 rounded-full font-semibold text-[0.88rem] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.2)' }}>
              Calculate My Growth →
            </button>
          </div>

          {/* Results */}
          <div className={`transition-all duration-500 ${calculated ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'}`}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Projected Monthly Revenue', value: fmt(results.proj), gold: true },
                { label: 'Expected Revenue Growth', value: `+${Math.round(results.growth)}%`, gold: true },
                { label: 'Projected Ad ROAS', value: `${results.roas.toFixed(1)}×`, gold: false },
                { label: 'Months to Full ROI', value: `${results.months} mo`, gold: false },
              ].map(r => (
                <div key={r.label} className="rounded-[20px] p-6" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <div className={`font-cormorant font-bold leading-none mb-2 ${r.gold ? 'text-shimmer' : ''}`}
                    style={{ fontSize: r.gold ? '2.4rem' : '2rem', color: r.gold ? undefined : '#E8E3D8' }}>
                    {calculated ? r.value : '—'}
                  </div>
                  <div className="text-[0.72rem] leading-snug" style={{ color: '#6B6860' }}>{r.label}</div>
                </div>
              ))}
            </div>

            {calculated && (
              <div className="rounded-[20px] p-6" style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)' }}>
                <p className="text-[0.85rem] leading-[1.75] mb-4" style={{ color: '#B8B2A8' }}>
                  Based on our {industry} client average of{' '}
                  <strong style={{ color: '#C9A96E' }}>{MULTIPLIERS[industry]}× revenue growth</strong>,
                  you could be generating{' '}
                  <strong style={{ color: '#C9A96E' }}>{fmt(results.proj)}/month</strong>{' '}
                  within 6–12 months.
                </p>
                <Link href="/contact" className="btn-primary text-[0.82rem] px-6 py-3">Claim This Growth →</Link>
              </div>
            )}
            {!calculated && (
              <div className="rounded-[20px] p-6 text-center" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.04)' }}>
                <p className="text-[0.82rem]" style={{ color: '#3A3830' }}>← Adjust the sliders and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="gold-line absolute bottom-0 left-0 right-0" />
    </section>
  )
}
