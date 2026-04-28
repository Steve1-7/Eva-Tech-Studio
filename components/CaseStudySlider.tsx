'use client'
import { useState, useRef, useEffect } from 'react'
import SectionLabel from './SectionLabel'
import ScrollReveal from './ScrollReveal'

interface CaseStudy {
  id: string
  client: string
  industry: string
  before: {
    traffic: number
    conversion: number
    revenue: number
  }
  after: {
    traffic: number
    conversion: number
    revenue: number
  }
  description: string
  duration: string
  services: string[]
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'novaspark',
    client: 'NovaSpark E-commerce',
    industry: 'E-commerce',
    before: { traffic: 15000, conversion: 1.2, revenue: 85000 },
    after: { traffic: 51000, conversion: 3.4, revenue: 289000 },
    description: 'Complete digital transformation including website rebuild, SEO strategy, and automated email sequences.',
    duration: '90 days',
    services: ['Web Dev', 'SEO', 'Email Automation'],
  },
  {
    id: 'outpost',
    client: 'Outpost Outdoors',
    industry: 'Retail',
    before: { traffic: 8500, conversion: 0.8, revenue: 45000 },
    after: { traffic: 29750, conversion: 2.6, revenue: 156000 },
    description: 'Multi-channel paid advertising campaign with retargeting and landing page optimization.',
    duration: '8 months',
    services: ['Paid Ads', 'Landing Pages', 'Analytics'],
  },
  {
    id: 'vertex',
    client: 'Vertex Financial',
    industry: 'Financial Services',
    before: { traffic: 3200, conversion: 2.1, revenue: 120000 },
    after: { traffic: 12800, conversion: 5.7, revenue: 465000 },
    description: 'B2B lead generation system with LinkedIn strategy and automated CRM workflows.',
    duration: '6 months',
    services: ['LinkedIn Ads', 'CRM', 'Content Strategy'],
  },
]

function BeforeAfterSlider({ value, onChange, leftLabel, rightLabel }: {
  value: number
  onChange: (val: number) => void
  leftLabel: string
  rightLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (clientX: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100
    onChange(percentage)
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => isDragging && handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => isDragging && handleMove(e.touches[0].clientX)
    const onEnd = () => setIsDragging(false)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchend', onEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchend', onEnd)
    }
  }, [isDragging])

  return (
    <div
      ref={ref}
      className="relative h-2 rounded-full cursor-pointer"
      style={{ background: 'var(--obsidian-5)' }}
      onClick={(e) => handleMove(e.clientX)}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      <div
        className="absolute h-full rounded-full"
        style={{
          width: `${value}%`,
          background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#C9A96E] shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{ left: `calc(${value}% - 12px)` }}
        onMouseDown={(e) => { e.stopPropagation(); setIsDragging(true) }}
        onTouchStart={(e) => { e.stopPropagation(); setIsDragging(true) }}
      >
        <svg className="w-4 h-4 text-[#07080F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </div>
      <div className="flex justify-between mt-4">
        <span className="text-[0.68rem] font-medium" style={{ color: '#6B6860' }}>{leftLabel}</span>
        <span className="text-[0.68rem] font-medium" style={{ color: '#6B6860' }}>{rightLabel}</span>
      </div>
    </div>
  )
}

export default function CaseStudySlider() {
  const [selectedCase, setSelectedCase] = useState(0)
  const [sliderValue, setSliderValue] = useState(50)
  const currentStudy = CASE_STUDIES[selectedCase]

  const interpolate = (before: number, after: number, percentage: number) => {
    return before + (after - before) * (percentage / 100)
  }

  const currentTraffic = Math.round(interpolate(currentStudy.before.traffic, currentStudy.after.traffic, sliderValue))
  const currentConversion = interpolate(currentStudy.before.conversion, currentStudy.after.conversion, sliderValue)
  const currentRevenue = Math.round(interpolate(currentStudy.before.revenue, currentStudy.after.revenue, sliderValue))

  return (
    <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-3)' }}>
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <SectionLabel center>Success Stories</SectionLabel>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
              See the Transformation
            </h2>
            <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
              Drag the slider to see the before and after results from our client campaigns.
            </p>
          </div>
        </ScrollReveal>

        {/* Case Study Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CASE_STUDIES.map((study, index) => (
            <button
              key={study.id}
              onClick={() => { setSelectedCase(index); setSliderValue(50) }}
              className={`px-5 py-3 rounded-full text-[0.8rem] font-medium transition-all ${
                selectedCase === index
                  ? 'bg-[#C9A96E] text-[#07080F]'
                  : 'border border-[rgba(232,227,216,0.1)] hover:border-[rgba(201,169,110,0.3)]'
              }`}
              style={{ color: selectedCase === index ? undefined : '#B8B2A8' }}
            >
              {study.client}
            </button>
          ))}
        </div>

        <ScrollReveal delay={100}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Metrics Display */}
            <div className="rounded-[24px] p-8 md:p-12" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                  {currentStudy.industry}
                </span>
                <span className="text-[0.72rem]" style={{ color: '#6B6860' }}>{currentStudy.duration}</span>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="font-cormorant text-[2rem] font-bold mb-1 text-shimmer" style={{ color: '#E8E3D8' }}>
                    {(currentTraffic / 1000).toFixed(1)}K
                  </div>
                  <div className="text-[0.68rem]" style={{ color: '#6B6860' }}>Monthly Traffic</div>
                </div>
                <div className="text-center">
                  <div className="font-cormorant text-[2rem] font-bold mb-1 text-shimmer" style={{ color: '#E8E3D8' }}>
                    {currentConversion.toFixed(1)}%
                  </div>
                  <div className="text-[0.68rem]" style={{ color: '#6B6860' }}>Conversion Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-cormorant text-[2rem] font-bold mb-1 text-shimmer" style={{ color: '#E8E3D8' }}>
                    R{(currentRevenue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-[0.68rem]" style={{ color: '#6B6860' }}>Monthly Revenue</div>
                </div>
              </div>

              {/* Slider */}
              <BeforeAfterSlider
                value={sliderValue}
                onChange={setSliderValue}
                leftLabel="Before Eve-Tech-Studio"
                rightLabel="After Eve-Tech-Studio"
              />
            </div>

            {/* Case Study Info */}
            <div>
              <h3 className="font-cormorant text-[1.8rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>
                {currentStudy.client}
              </h3>
              <p className="text-[0.9rem] leading-[1.85] mb-6" style={{ color: '#B8B2A8' }}>
                {currentStudy.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {currentStudy.services.map(service => (
                  <span
                    key={service}
                    className="px-3 py-1.5 rounded-full text-[0.7rem] font-medium"
                    style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.2)' }}
                  >
                    {service}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[rgba(232,227,216,0.05)]">
                <div>
                  <div className="font-cormorant text-[1.6rem] font-bold text-emerald-400">
                    +{Math.round((currentStudy.after.traffic / currentStudy.before.traffic - 1) * 100)}%
                  </div>
                  <div className="text-[0.65rem]" style={{ color: '#6B6860' }}>Traffic Growth</div>
                </div>
                <div>
                  <div className="font-cormorant text-[1.6rem] font-bold text-emerald-400">
                    +{Math.round((currentStudy.after.conversion / currentStudy.before.conversion - 1) * 100)}%
                  </div>
                  <div className="text-[0.65rem]" style={{ color: '#6B6860' }}>Conversion Lift</div>
                </div>
                <div>
                  <div className="font-cormorant text-[1.6rem] font-bold text-emerald-400">
                    +{Math.round((currentStudy.after.revenue / currentStudy.before.revenue - 1) * 100)}%
                  </div>
                  <div className="text-[0.65rem]" style={{ color: '#6B6860' }}>Revenue Growth</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
