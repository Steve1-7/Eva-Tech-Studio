'use client'

import { useEffect, useState } from 'react'
import { defaultPricingPlans, type PricingPlan } from '@/lib/pricing'

const icons: Record<string, string> = {
  'website-build': '💻',
  'brand-identity': '🎨',
  'shopify-store': '🛒',
  'crm-setup': '⚙️',
  'seo-audit': '🔍',
}

export default function OneTimePricingGrid() {
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPricingPlans)

  useEffect(() => {
    fetch('/api/pricing')
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (data?.plans?.length) setPlans(data.plans) })
      .catch(() => {})
  }, [])

  const oneTimePlans = plans.filter(plan => plan.billing_period === 'one-time')

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {oneTimePlans.map((plan, index) => (
        <div key={plan.id} className="rounded-[16px] p-6 text-center transition-all duration-300 hover:border-[rgba(201,169,110,0.2)]" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.05)' }}>
          <div className="mb-3 text-[1.8rem]">{icons[plan.id] || '📦'}</div>
          <strong className="mb-1 block text-[0.88rem] font-semibold" style={{ color: '#E8E3D8' }}>{plan.name}</strong>
          <span className="text-[0.76rem]" style={{ color: '#6B6860' }}>From R{Number(plan.price).toLocaleString('en-ZA')}</span>
        </div>
      ))}
    </div>
  )
}