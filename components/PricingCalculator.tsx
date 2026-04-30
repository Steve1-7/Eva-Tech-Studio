'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import SectionLabel from './SectionLabel'
import CountUp from './CountUp'
import AIQuoteGenerator from './AIQuoteGenerator'

const SERVICES = [
  { id: 'social', name: 'Social Media Marketing', basePrice: 4675, desc: 'Content creation, posting, community management' },
  { id: 'ads', name: 'Paid Ads Management', basePrice: 6375, desc: 'Campaign setup, optimization, reporting (excl. ad spend)' },
  { id: 'seo', name: 'SEO & Content', basePrice: 3825, desc: 'Technical SEO, content strategy, link building' },
  { id: 'web', name: 'Website Development', basePrice: 8500, desc: 'Custom design, development, optimization (once-off)' },
  { id: 'email', name: 'Email Marketing', basePrice: 2975, desc: 'Campaign design, automation, list management' },
  { id: 'brand', name: 'Branding & Design', basePrice: 6800, desc: 'Logo, brand guidelines, marketing assets (once-off)' },
]

const TIERS = [
  { id: 'starter', name: 'Starter', multiplier: 1, desc: 'Essential package for growing businesses' },
  { id: 'growth', name: 'Growth', multiplier: 1.5, desc: 'Comprehensive solution for scaling' },
  { id: 'enterprise', name: 'Enterprise', multiplier: 2.5, desc: 'Full-service partnership with dedicated team' },
]

export default function PricingCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>(['ads', 'seo'])
  const [selectedTier, setSelectedTier] = useState('growth')
  const [step, setStep] = useState<'services' | 'tier' | 'summary'>('services')

  const pricing = useMemo(() => {
    const baseTotal = selectedServices.reduce((sum, id) => {
      const service = SERVICES.find(s => s.id === id)
      return sum + (service?.basePrice || 0)
    }, 0)

    const tier = TIERS.find(t => t.id === selectedTier)
    const multiplier = tier?.multiplier || 1
    const monthlyTotal = baseTotal * multiplier
    const annualTotal = monthlyTotal * 12 * 0.85 // 15% annual discount

    const breakdown = selectedServices.map(id => {
      const service = SERVICES.find(s => s.id === id)
      return {
        ...service,
        monthlyPrice: (service?.basePrice || 0) * multiplier,
      }
    })

    return { monthlyTotal, annualTotal, breakdown, tier }
  }, [selectedServices, selectedTier])

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleNextStep = () => {
    if (step === 'services' && selectedServices.length > 0) {
      setStep('tier')
    } else if (step === 'tier') {
      setStep('summary')
    }
  }

  const handlePreviousStep = () => {
    if (step === 'tier') {
      setStep('services')
    } else if (step === 'summary') {
      setStep('tier')
    }
  }

  const stepLabels = ['Select Services', 'Choose Tier', 'Review Package']
  const currentStepIndex = step === 'services' ? 0 : step === 'tier' ? 1 : 2

  return (
    <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-[620px] mx-auto mb-14">
          <SectionLabel center>Pricing Calculator</SectionLabel>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
            Build Your Custom Package
          </h2>
          <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
            Select the services you need and choose your tier. Get instant pricing with a detailed breakdown.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-bold transition-all ${
                i <= currentStepIndex
                  ? 'bg-[#C9A96E] text-[#07080F]'
                  : 'bg-[var(--obsidian-4)] text-[#6B6860]'
              }`}>
                {i + 1}
              </div>
              <span className={`text-[0.8rem] font-medium transition-colors ${
                i <= currentStepIndex ? 'text-[#E8E3D8]' : 'text-[#3A3830]'
              }`}>
                {label}
              </span>
              {i < stepLabels.length - 1 && (
                <div className={`w-12 h-px ${
                  i < currentStepIndex ? 'bg-[#C9A96E]' : 'bg-[rgba(232,227,216,0.1)]'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          {step === 'services' && (
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#6B6860' }}>
                Select Services
              </h3>
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`w-full text-left p-5 rounded-[16px] transition-all ${
                    selectedServices.includes(service.id)
                      ? 'border-[rgba(201,169,110,0.3)]'
                      : 'border-[rgba(232,227,216,0.06)] hover:border-[rgba(201,169,110,0.15)]'
                  }`}
                  style={{
                    background: selectedServices.includes(service.id)
                      ? 'linear-gradient(135deg, var(--obsidian-4), var(--obsidian-3))'
                      : 'var(--obsidian-3)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedServices.includes(service.id)
                            ? 'border-[#C9A96E] bg-[#C9A96E]'
                            : 'border-[rgba(232,227,216,0.2)]'
                        }`}>
                          {selectedServices.includes(service.id) && (
                            <span className="text-[#07080F] text-xs">✓</span>
                          )}
                        </div>
                        <span className="font-semibold text-[0.95rem]" style={{ color: '#E8E3D8' }}>
                          {service.name}
                        </span>
                      </div>
                      <p className="text-[0.8rem] ml-8" style={{ color: '#6B6860' }}>{service.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-cormorant text-[1.2rem] font-bold" style={{ color: '#C9A96E' }}>
                        R{(service.basePrice / 1000).toFixed(0)}K
                      </div>
                      <div className="text-[0.68rem]" style={{ color: '#3A3830' }}>/month</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tier Selection */}
          {step === 'tier' && (
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#6B6860' }}>
                Select Tier
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {TIERS.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-6 rounded-[16px] text-left transition-all ${
                      selectedTier === tier.id
                        ? 'border-[rgba(201,169,110,0.3)]'
                        : 'border-[rgba(232,227,216,0.06)]'
                    }`}
                    style={{
                      background: selectedTier === tier.id
                        ? 'linear-gradient(135deg, var(--obsidian-4), var(--obsidian-3))'
                        : 'var(--obsidian-3)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[0.95rem]" style={{ color: '#E8E3D8' }}>
                        {tier.name}
                      </span>
                      <span className="text-[0.75rem] font-bold" style={{ color: '#C9A96E' }}>
                        ×{tier.multiplier}
                      </span>
                    </div>
                    <p className="text-[0.75rem]" style={{ color: '#6B6860' }}>{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {step === 'summary' && (
            <div className="lg:col-span-2">
              <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#6B6860' }}>
                Package Summary
              </h3>
              <div className="rounded-[20px] p-6" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
                <div className="space-y-4">
                  <div>
                    <span className="text-[0.72rem] uppercase tracking-[0.08em] mb-2 block" style={{ color: '#6B6860' }}>Selected Services</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedServices.map(id => {
                        const service = SERVICES.find(s => s.id === id)
                        return (
                          <span
                            key={id}
                            className="px-3 py-1 rounded-full text-[0.75rem]"
                            style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.2)' }}
                          >
                            {service?.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-[0.72rem] uppercase tracking-[0.08em] mb-2 block" style={{ color: '#6B6860' }}>Package Tier</span>
                    <span className="text-[0.9rem] font-medium" style={{ color: '#E8E3D8' }}>
                      {TIERS.find(t => t.id === selectedTier)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Summary (always visible) */}
          <div className="space-y-6">
            <div className="rounded-[20px] p-6" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
              <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#6B6860' }}>
                Monthly Total
              </h3>
              <div className="font-cormorant text-[3rem] font-bold leading-none mb-4 text-shimmer" style={{ color: '#E8E3D8' }}>
                R<CountUp end={pricing.monthlyTotal / 1000} decimals={0} />K
              </div>

              <div className="border-t border-[rgba(232,227,216,0.05)] pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[0.8rem]" style={{ color: '#6B6860' }}>Annual (15% off)</span>
                  <span className="font-cormorant text-[1.4rem] font-bold" style={{ color: '#4A7A64' }}>
                    R<CountUp end={pricing.annualTotal / 1000} decimals={0} />K
                  </span>
                </div>
                <div className="text-[0.68rem]" style={{ color: '#3A3830' }}>
                  Save R{((pricing.monthlyTotal * 12 - pricing.annualTotal) / 1000).toFixed(0)}K/year
                </div>
              </div>

              {/* AI Quote Generator only in summary step */}
              {step === 'summary' && (
                <AIQuoteGenerator services={selectedServices.map(id => SERVICES.find(s => s.id === id)?.name || id)} tier={selectedTier} />
              )}

              {/* Consultation button always visible */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(232,227,216,0.05)' }}>
                <a
                  href="https://wa.me/27676283210?text=Hi, I'm interested in discussing a custom package for my business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-full text-center text-[0.85rem] font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: 'rgba(74,122,100,0.15)', color: '#4A7A64', border: '1px solid rgba(74,122,100,0.3)' }}
                >
                  Request Consultation 💬
                </a>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step !== 'services' && (
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 py-3 rounded-full text-[0.85rem] font-medium transition-all cursor-pointer"
                  style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}
                >
                  ← Back
                </button>
              )}
              {step !== 'summary' && (
                <button
                  onClick={handleNextStep}
                  disabled={step === 'services' && selectedServices.length === 0}
                  className="flex-1 py-3 rounded-full font-semibold text-[0.85rem] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.15)' }}
                >
                  {step === 'services' ? 'Continue →' : 'Review Package →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        {pricing.breakdown.length > 0 && (
          <div className="mt-12">
            <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-6" style={{ color: '#6B6860' }}>
              Package Breakdown
            </h3>
            <div className="rounded-[20px] overflow-hidden" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
              {pricing.breakdown.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-5 ${i !== pricing.breakdown.length - 1 ? 'border-b border-[rgba(232,227,216,0.05)]' : ''}`}
                >
                  <div>
                    <div className="font-semibold text-[0.9rem] mb-1" style={{ color: '#E8E3D8' }}>
                      {item.name} ({pricing.tier?.name})
                    </div>
                    <div className="text-[0.75rem]" style={{ color: '#6B6860' }}>{item.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-cormorant text-[1.3rem] font-bold" style={{ color: '#C9A96E' }}>
                      R{(item.monthlyPrice / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[0.68rem]" style={{ color: '#3A3830' }}>/month</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
