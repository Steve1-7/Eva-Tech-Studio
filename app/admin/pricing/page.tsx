'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import { defaultPricingPlans, type PricingPlan } from '@/lib/pricing'

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [source, setSource] = useState('')

  const loadPlans = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pricing?admin=true', { credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error('Sign in from the admin dashboard to manage pricing.')
      setPlans(data.plans || defaultPricingPlans)
      setSource(data.source || 'defaults')
      setNotice('')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to load pricing plans.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadPlans() }, [])

  const updatePlan = (index: number, changes: Partial<PricingPlan>) => {
    setPlans(current => current.map((plan, currentIndex) => currentIndex === index ? { ...plan, ...changes } : plan))
  }

  const addPlan = () => {
    setPlans(current => [...current, {
      id: '',
      name: '',
      price: 0,
      description: '',
      cta: 'Get Started',
      popular: false,
      sort_order: current.length,
      billing_period: 'monthly',
    }])
  }

  const savePlan = async (plan: PricingPlan, index: number) => {
    const savingKey = plan.id || `new-${index}`
    setSavingId(savingKey)
    setNotice('')
    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, id: plan.id || plan.name }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save this plan.')
      await loadPlans()
      setNotice(`${data.plan.name} pricing saved.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save this plan.')
    } finally {
      setSavingId(null)
    }
  }

  const deletePlan = async (plan: PricingPlan) => {
    if (!plan.id || !window.confirm(`Delete the ${plan.name} plan?`)) return
    setSavingId(plan.id)
    setNotice('')
    try {
      const response = await fetch(`/api/pricing/${encodeURIComponent(plan.id)}`, { method: 'DELETE', credentials: 'include' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to delete this plan.')
      await loadPlans()
      setNotice(`${plan.name} plan deleted.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to delete this plan.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-[150px] md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>Admin Dashboard</SectionLabel>
            <h1 className="mt-2 font-cormorant text-[2.5rem] font-semibold" style={{ color: '#E8E3D8' }}>Pricing Plans</h1>
            <p className="mt-2 text-sm" style={{ color: '#8B877F' }}>Manage monthly plans and one-time project prices displayed publicly.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="btn-outline px-5 py-3">Admin Dashboard</Link>
            <button onClick={addPlan} className="btn-primary px-5 py-3">Add Plan</button>
          </div>
        </div>

        {source === 'defaults' && !loading && (
          <p className="mb-5 border-l-2 border-[#C9A96E] px-4 py-2 text-sm" style={{ color: '#B8B2A8' }}>
            Showing default prices. Apply the Supabase pricing migration to save changes permanently.
          </p>
        )}
        {notice && <p role="status" className="mb-5 text-sm" style={{ color: notice.includes('Unable') || notice.includes('Sign in') ? '#FCA5A5' : '#9CC6A7' }}>{notice}</p>}

        {loading ? <p style={{ color: '#B8B2A8' }}>Loading pricing plans...</p> : (
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <section key={`${plan.id}-${index}`} className="grid gap-4 rounded-xl p-5 md:grid-cols-2" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.08)' }}>
                <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>
                  Plan name
                  <input value={plan.name} onChange={event => updatePlan(index, { name: event.target.value })} className="form-input mt-2" placeholder="Plan name" />
                </label>
                <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>
                  Price (R)
                  <input type="number" min="0" step="50" value={plan.price} onChange={event => updatePlan(index, { price: Number(event.target.value) })} className="form-input mt-2" />
                </label>
                <label className="text-xs uppercase tracking-wider md:col-span-2" style={{ color: '#8B877F' }}>
                  Description
                  <textarea value={plan.description} onChange={event => updatePlan(index, { description: event.target.value })} className="form-input mt-2 min-h-20 resize-y" placeholder="What this plan is for" />
                </label>
                <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>
                  Button label
                  <input value={plan.cta} onChange={event => updatePlan(index, { cta: event.target.value })} className="form-input mt-2" placeholder="Get Started" />
                </label>
                <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>
                  Display order
                  <input type="number" step="1" value={plan.sort_order} onChange={event => updatePlan(index, { sort_order: Number(event.target.value) })} className="form-input mt-2" />
                </label>
                <label className="text-xs uppercase tracking-wider" style={{ color: '#8B877F' }}>
                  Billing type
                  <select value={plan.billing_period} onChange={event => updatePlan(index, { billing_period: event.target.value as PricingPlan['billing_period'] })} className="form-input mt-2">
                    <option value="monthly">Monthly plan</option>
                    <option value="one-time">One-time project</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 text-sm" style={{ color: '#B8B2A8' }}>
                  <input type="checkbox" checked={plan.popular} onChange={event => updatePlan(index, { popular: event.target.checked })} />
                  Mark as most popular
                </label>
                <div className="flex justify-end gap-3">
                  {plan.id && <button onClick={() => void deletePlan(plan)} disabled={savingId === plan.id} className="btn-outline px-4 py-2">Delete</button>}
                  <button onClick={() => void savePlan(plan, index)} disabled={savingId === (plan.id || `new-${index}`)} className="btn-primary px-5 py-2">
                    {savingId === (plan.id || `new-${index}`) ? 'Saving...' : 'Save Plan'}
                  </button>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}