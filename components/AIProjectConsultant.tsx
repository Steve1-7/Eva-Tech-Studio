'use client'
import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { submitPackageInquiry } from '@/lib/forms'

export default function AIProjectConsultant() {
  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    website: '',
    projectGoals: '',
    targetAudience: '',
    competitors: '',
    requiredFeatures: '',
    budgetRange: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [lead, setLead] = useState({ fullName: '', email: '' })
  const [leadStatus, setLeadStatus] = useState('')

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async () => {
    if (!form.businessName.trim()) {
      setError('Business name is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/ai-project-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to get consultant report')
      } else {
        setResult(data.result)
        // record frontend analytics event
        try {
          fetch('/api/ai-analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType: 'ai_consultant_submit', properties: { businessName: form.businessName } })
          })
        } catch {}
      }
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    // Render structured sections when available
    const sections = result || {}
    const getSection = (key: string) => sections[key] || sections.raw || sections

    const renderContent = (value: any) => {
      if (!value) return null
      if (typeof value === 'string') return <p className="text-sm text-gray-200 whitespace-pre-wrap">{value}</p>
      if (Array.isArray(value)) return (
        <ul className="list-disc list-inside text-sm text-gray-200">{value.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
      )
      if (typeof value === 'object') return (
        <div className="text-sm text-gray-200">
          {Object.entries(value).map(([k, v]: any) => (
            <div key={k} className="mb-2">
              <div className="font-semibold text-[0.9rem] text-gray-300">{k}</div>
              <div>{typeof v === 'string' ? v : JSON.stringify(v)}</div>
            </div>
          ))}
        </div>
      )
      return <pre className="text-sm text-gray-200">{String(value)}</pre>
    }

    const renderInvestmentBreakdown = (value: any) => {
      if (!value) return null
      // If value is an object with line items, render cards
      if (typeof value === 'object' && !Array.isArray(value)) {
        const items = Object.entries(value)
        return (
          <div className="grid md:grid-cols-3 gap-4">
            {items.map(([k, v]: any) => (
              <div key={k} className="p-4 bg-gray-800 rounded border">
                <div className="font-semibold text-gray-200 mb-2">{k}</div>
                <div className="text-sm text-gray-300">{typeof v === 'string' ? v : JSON.stringify(v)}</div>
              </div>
            ))}
          </div>
        )
      }
      return renderContent(value)
    }

    const renderRecommendedPackage = (value: any) => {
      if (!value) return null
      // Expect value to be object or array of packages
      const packages = Array.isArray(value) ? value : value.packages || [value]
      return (
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg: any, idx: number) => {
            const name = pkg.name || pkg.title || `Package ${idx + 1}`
            const monthly = pkg.monthly || pkg.price_monthly || (pkg.price ? pkg.price.monthly : null)
            const annual = pkg.annual || pkg.price_annual || (pkg.price ? pkg.price.annual : null)
            const features = pkg.features || pkg.items || pkg.includes || []
            return (
              <div key={idx} className="p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded border">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-100">{name}</div>
                  {pkg.recommended && <div className="px-2 py-1 bg-yellow-600 text-black rounded text-xs">Recommended</div>}
                </div>
                <div className="mb-3">
                  <div className="text-sm text-gray-300">{pkg.description || pkg.summary || null}</div>
                </div>
                <div className="mb-3">
                  <div className="text-2xl font-bold text-gray-100">{monthly ? `R${Number(monthly).toLocaleString()}` : 'Contact for pricing'}</div>
                  {annual && <div className="text-sm text-gray-400">Annual: R{Number(annual).toLocaleString()}</div>}
                </div>
                <ul className="list-disc list-inside text-sm text-gray-300 mb-3">
                  {features.map((f: any, i: number) => <li key={i}>{f}</li>)}
                </ul>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gold text-black rounded font-semibold">Select</button>
                  <button className="flex-1 py-2 border rounded">Details</button>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">AI Project Consultant — Results</h2>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
          {renderContent(getSection('projectSummary'))}
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Investment Breakdown</h3>
          {renderInvestmentBreakdown(getSection('investmentBreakdown'))}
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Recommended Package</h3>
          {renderRecommendedPackage(getSection('recommendedPackage'))}
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Estimated Timeline</h3>
          {renderContent(getSection('estimatedTimeline'))}
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Project Complexity</h3>
          {renderContent(getSection('projectComplexity'))}
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Next Steps / CTAs</h3>
          {renderContent(getSection('leadCTAs'))}
        </section>

        <div className="mt-6 p-4 border rounded bg-gray-800">
          <h4 className="font-semibold mb-2">Request a Consultation</h4>
          <p className="text-sm text-gray-400 mb-3">Leave your contact and we'll follow up with a formal proposal.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Full name" value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} className="form-input" />
            <input placeholder="Email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className="form-input" />
          </div>
          <div className="mt-3 flex gap-3">
            <button
              className="px-4 py-2 bg-gold rounded font-semibold"
              onClick={async () => {
                setLeadStatus('sending')
                try {
                  await submitPackageInquiry({ fullName: lead.fullName, email: lead.email, selectedPackage: (getSection('recommendedPackage')?.name as string) || 'Custom', projectGoals: form.projectGoals, budgetRange: form.budgetRange })
                  setLeadStatus('sent')
                  // Log analytics event
                  await fetch('/api/ai-analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventType: 'ai_consultant_lead', properties: { businessName: form.businessName, email: lead.email } }) })
                } catch (err: any) {
                  setLeadStatus('error')
                }
              }}
            >{leadStatus === 'sending' ? 'Sending…' : leadStatus === 'sent' ? 'Sent ✓' : 'Request Consultation'}</button>
            <button className="px-4 py-2 border rounded" onClick={() => { setResult(null); setError(''); setLead({ fullName: '', email: '' }); setLeadStatus('') }}>Back</button>
          </div>
          {leadStatus === 'error' && <p className="text-red-400 mt-2">Failed to send. Try again or email sales@eva-tech-studio.com</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">AI Project Consultant</h2>

      <div className="grid gap-3">
        <input placeholder="Business name*" value={form.businessName} onChange={(e) => handleChange('businessName', e.target.value)} className="form-input" />
        <input placeholder="Industry" value={form.industry} onChange={(e) => handleChange('industry', e.target.value)} className="form-input" />
        <input placeholder="Existing website (optional)" value={form.website} onChange={(e) => handleChange('website', e.target.value)} className="form-input" />
        <textarea placeholder="Project goals" value={form.projectGoals} onChange={(e) => handleChange('projectGoals', e.target.value)} className="form-input" rows={3} />
        <textarea placeholder="Target audience" value={form.targetAudience} onChange={(e) => handleChange('targetAudience', e.target.value)} className="form-input" rows={2} />
        <input placeholder="Competitors" value={form.competitors} onChange={(e) => handleChange('competitors', e.target.value)} className="form-input" />
        <textarea placeholder="Required features" value={form.requiredFeatures} onChange={(e) => handleChange('requiredFeatures', e.target.value)} className="form-input" rows={2} />
        <input placeholder="Budget range (e.g. R15,000 - R30,000)" value={form.budgetRange} onChange={(e) => handleChange('budgetRange', e.target.value)} className="form-input" />

        {error && <p className="text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-gold rounded text-black font-semibold">{loading ? 'Generating…' : 'Generate Consultation'}</button>
        </div>
      </div>
    </div>
  )
}
