 'use client'
import { useState } from 'react'
import Confetti from './Confetti'
import { downloadPDF } from '@/lib/pdf-export'
import { submitContact } from '@/lib/forms'
import { apiFetch } from '@/lib/api'

interface QuoteFormData {
  businessName: string
  industry: string
  description: string
}

interface NegotiationFormData {
  name: string
  email: string
  budget: string
  timeline: string
  message: string
}

export default function AIQuoteGenerator({ 
  services, 
  tier 
}: { 
  services: string[] 
  tier: string 
}) {
  const [step, setStep] = useState<'form'|'loading'|'quote'|'negotiate'|'sending'|'success'>('form')
  const [quoteData, setQuoteData] = useState<QuoteFormData>({
    businessName: '',
    industry: '',
    description: '',
  })
  const [negotiationData, setNegotiationData] = useState<NegotiationFormData>({
    name: '',
    email: '',
    budget: '',
    timeline: '',
    message: '',
  })
  const [quoteResult, setQuoteResult] = useState('')
  const [error, setError] = useState('')
  const [confettiTrigger, setConfettiTrigger] = useState(false)

  const handleGenerateQuote = async () => {
    if (!quoteData.businessName.trim()) {
      setError('Business name is required')
      return
    }
    setStep('loading')
    setError('')
    try {
      const res = await apiFetch('/api/ai-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services,
          tier,
          ...quoteData,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setQuoteResult(data.result)
      setStep('quote')
      setConfettiTrigger(true)
    } catch {
      setError('Unable to generate quote. Please try again or contact us directly.')
      setStep('form')
    }
  }

  const handleDownloadQuote = () => {
    const blob = new Blob([quoteResult], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Eva-Tech-Studio-Scope-${quoteData.businessName.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportQuotePDF = async () => {
    try {
      const businessName = quoteData.businessName.substring(0, 30).replace(/\s+/g, '-')
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `eva-tech-scope-${businessName}-${timestamp}.pdf`

      const response = await apiFetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Project Scope Outline - ${quoteData.businessName}`,
          content: quoteResult,
          filename,
          contentType: 'scope'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[AI-QUOTE] PDF export error:', err)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const handleNegotiate = () => {
    setStep('negotiate')
  }

  const handleSendNegotiation = async () => {
    if (!negotiationData.name.trim() || !negotiationData.email.trim()) {
      setError('Name and email are required')
      return
    }
    setStep('sending')
    setError('')

    try {
      // Ensure the negotiation is emailed to internal recipients
      const serviceNames = Array.isArray(services) ? services.join(', ') : services
      const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)
      const message = `Written quote request from ${negotiationData.name} <${negotiationData.email}>\n\nBusiness: ${quoteData.businessName}\nRequested package: ${tierName}\nServices: ${serviceNames}\nBudget: ${negotiationData.budget || 'Not provided'}\nTimeline: ${negotiationData.timeline || 'Not specified'}\n\nMessage:\n${negotiationData.message || 'No additional message'}\n\n---\nSent via website scope flow`

      await submitContact({
        firstName: negotiationData.name,
        email: negotiationData.email,
        message,
      })

      // Also open WhatsApp for immediate real-time conversation (optional)
      const whatsappMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/27676283210?text=${whatsappMessage}`
      window.open(whatsappUrl, '_blank')

      setStep('success')
    } catch (err: any) {
      console.error('[NEGOTIATE] Error:', err)
      setError(err?.message || 'Unable to send negotiation request. Please try again or contact us directly at sales@eva-tech-studio.com')
      setStep('negotiate')
    }
  }

  if (step === 'form') {
    return (
      <div className="rounded-[20px] p-6" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
        <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#6B6860' }}>
          Business Details
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Business Name *
            </label>
            <input
              type="text"
              placeholder="Your company name"
              value={quoteData.businessName}
              onChange={(e) => setQuoteData({ ...quoteData, businessName: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Industry
            </label>
            <input
              type="text"
              placeholder="e.g. E-commerce, SaaS, Retail"
              value={quoteData.industry}
              onChange={(e) => setQuoteData({ ...quoteData, industry: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Business Description
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about your business and goals..."
              value={quoteData.description}
              onChange={(e) => setQuoteData({ ...quoteData, description: e.target.value })}
              className="form-input resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-[0.82rem]">{error}</p>}
          <button
            onClick={handleGenerateQuote}
            className="w-full py-3 rounded-full font-semibold text-[0.86rem] transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.15)' }}
          >
            Generate Scope Outline
          </button>
        </div>
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div className="rounded-[20px] p-12 text-center" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
        </div>
        <h3 className="font-cormorant text-[1.4rem] font-semibold mb-2" style={{ color: '#E8E3D8' }}>
          Preparing Your Scope Outline...
        </h3>
        <p className="text-[0.82rem]" style={{ color: '#6B6860' }}>
          Drafting a preliminary scope outline — this may take a few moments.
        </p>
      </div>
    )
  }

  if (step === 'quote') {
    const serviceNames = Array.isArray(services) ? services : [services]
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)

    return (
      <>
        <Confetti trigger={confettiTrigger} />

        {/* Quote Summary Card */}
        <div className="rounded-[20px] p-6 mb-4" style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
          <h4 className="text-[0.8rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#C9A96E' }}>Scope Summary</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="block text-[0.7rem] uppercase tracking-[0.08em] mb-1" style={{ color: '#6B6860' }}>Business</span>
              <span className="text-[0.9rem] font-medium" style={{ color: '#E8E3D8' }}>{quoteData.businessName || 'Not specified'}</span>
            </div>
            <div>
              <span className="block text-[0.7rem] uppercase tracking-[0.08em] mb-1" style={{ color: '#6B6860' }}>Package Tier</span>
              <span className="text-[0.9rem] font-medium" style={{ color: '#E8E3D8' }}>{tierName}</span>
            </div>
          </div>
          <div>
            <span className="block text-[0.7rem] uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>Selected Services</span>
            <div className="flex flex-wrap gap-2">
              {serviceNames.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[0.75rem]"
                  style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.2)' }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="rounded-[20px] p-6 mb-4" aria-labelledby="quote-pricing-status" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
          <h4 id="quote-pricing-status" className="text-[0.8rem] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#C9A96E' }}>Pricing status</h4>
          <p className="text-sm leading-6" style={{ color: '#B8B2A8' }}>
            This AI-generated scope outline is not a price quote. Service-specific rates and package details are being confirmed. Request a written proposal after the scope is reviewed.
          </p>
        </section>

        {/* Full AI Quote Result */}
        <div className="rounded-[20px] p-6 mb-4" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
              <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(232,227,216,0.05)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.72rem] font-bold" style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>
              AI
            </div>
            <div>
              <div className="font-semibold text-[0.85rem]" style={{ color: '#E8E3D8' }}>
                Preliminary Scope Outline
              </div>
                  <div className="text-[0.7rem]" style={{ color: '#6B6860' }}>
                    AI-generated; review before use
                  </div>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-[0.85rem] leading-[1.8] font-light" style={{ color: '#B8B2A8' }}>
            {quoteResult}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadQuote}
            className="flex-1 py-3 rounded-full text-[0.85rem] font-medium transition-all cursor-pointer hover:border-[rgba(201,169,110,0.3)]"
            style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}
          >
            📥 Download as Text
          </button>
          <button
            onClick={handleExportQuotePDF}
            className="flex-1 py-3 rounded-full text-[0.85rem] font-medium transition-all cursor-pointer hover:border-[rgba(201,169,110,0.3)]"
            style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}
          >
            📄 Export as PDF
          </button>
          <button
            onClick={handleNegotiate}
            className="flex-1 py-3 rounded-full font-semibold text-[0.85rem] transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.15)' }}
          >
            Request a written quote
          </button>
        </div>
      </>
    )
  }

  if (step === 'negotiate') {
    return (
      <div className="rounded-[20px] p-6" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
        <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#6B6860' }}>
          Written Quote Request
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Your Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={negotiationData.name}
              onChange={(e) => setNegotiationData({ ...negotiationData, name: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Email *
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={negotiationData.email}
              onChange={(e) => setNegotiationData({ ...negotiationData, email: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Budget range (optional)
            </label>
            <input
              type="text"
              placeholder="Not sure yet, or add a range in your currency"
              value={negotiationData.budget}
              onChange={(e) => setNegotiationData({ ...negotiationData, budget: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Requested timeframe
            </label>
            <input
              type="text"
              placeholder="Share your preferred timeframe"
              value={negotiationData.timeline}
              onChange={(e) => setNegotiationData({ ...negotiationData, timeline: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
              Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any specific requirements or concerns..."
              value={negotiationData.message}
              onChange={(e) => setNegotiationData({ ...negotiationData, message: e.target.value })}
              className="form-input resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-[0.82rem]">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setStep('quote')}
              className="flex-1 py-3 rounded-full text-[0.85rem] font-medium transition-all cursor-pointer hover:border-[rgba(201,169,110,0.3)]"
              style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}
            >
              Back
            </button>
            <button
              onClick={handleSendNegotiation}
              className="flex-1 py-3 rounded-full font-semibold text-[0.85rem] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.15)' }}
            >
              Send quote request
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'sending') {
    return (
      <div className="rounded-[20px] p-12 text-center" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(232,227,216,0.06)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
        </div>
        <h3 className="font-cormorant text-[1.4rem] font-semibold mb-2" style={{ color: '#E8E3D8' }}>
          Sending Your Request...
        </h3>
        <p className="text-[0.82rem]" style={{ color: '#6B6860' }}>
          Please wait while we submit your negotiation proposal to our team
        </p>
        <p className="text-[0.75rem] mt-2" style={{ color: '#3A3830' }}>
          An email confirmation will be sent to {negotiationData.email}
        </p>
      </div>
    )
  }

  return null
}
