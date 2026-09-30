'use client'
import { useEffect, useState } from 'react'
import MagneticButton from '@/components/MagneticButton'
import PricingModal from '@/components/PricingModal'
import { defaultPricingPlans, type PricingPlan } from '@/lib/pricing'

export default function PricingGrid(){
  const [openPackage, setOpenPackage] = useState<string | null>(null)
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPricingPlans)

  useEffect(() => {
    fetch('/api/pricing')
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (data?.plans?.length) setPlans(data.plans) })
      .catch(() => {})
  }, [])

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-5">
        {plans.filter(plan => plan.billing_period === 'monthly').map(p => (
          <div key={p.name} className={`rounded-[24px] p-10 relative h-full flex flex-col card ${p.popular ? 'border-[rgba(201,169,110,0.3)]' : ''}`} style={p.popular ? { background: 'linear-gradient(145deg, var(--obsidian-4), var(--obsidian-3))', boxShadow: '0 0 60px rgba(201,169,110,0.08)' } : { background: 'var(--obsidian-3)' }}>
            {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.68rem] font-bold tracking-[0.1em] uppercase px-4 py-1 rounded-full whitespace-nowrap" style={{ background: 'var(--gold)', color: 'var(--obsidian)' }}>Most Popular</div>}
            <div className="font-syne text-[0.72rem] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: p.popular ? '#C9A96E' : '#6B6860' }}>{p.name}</div>
            <div className="font-cormorant font-bold leading-none tracking-tight my-3" style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', color: '#E8E3D8' }}>
              <sup className="text-[1.3rem] align-super" style={{ color: '#C9A96E' }}>R</sup>
              {p.price}
              <sub className="text-[0.95rem] align-baseline font-dm font-light" style={{ color: '#6B6860' }}>/mo</sub>
            </div>
            <p className="text-[0.83rem] leading-[1.65] mb-6" style={{ color: '#6B6860' }}>{p.description}</p>
            <div className="h-px mb-6" style={{ background: 'rgba(201,169,110,0.08)' }} />
            <div className="flex-1" />
            <MagneticButton className="w-full">
              <button onClick={() => setOpenPackage(p.name)} className={p.popular ? 'btn-primary w-full justify-center text-center block' : 'btn-outline w-full justify-center text-center block'}>
                {p.cta}
              </button>
            </MagneticButton>
          </div>
        ))}
      </div>

      {openPackage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6" style={{ background: 'rgba(7,8,15,0.8)' }}>
          <div className="relative w-full max-w-2xl rounded-[16px] overflow-hidden">
            <div className="p-4" style={{ background: 'var(--obsidian-3)' }}>
              <button className="absolute top-3 right-3 btn-outline" onClick={() => setOpenPackage(null)}>Close</button>
              <PricingModal selectedPackage={openPackage} onClose={() => setOpenPackage(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
