'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import Confetti from '@/components/Confetti'
import { submitContact } from '@/lib/forms'
import { defaultMarketCurrency, markets, type MarketCurrencyCode } from '@/config/markets'

type ContactFormState = {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  currency: MarketCurrencyCode
  timeline: string
  country: string
  message: string
  website: string
}

const services = [
  'Social Media Marketing',
  'Paid Ads Management',
  'Website Development',
  'E-commerce Development',
  'SEO Optimisation',
  'Business Automation / CRM',
  'Full Growth Partnership',
  'Other / Not Sure Yet',
]

const timelines = ['Immediately', 'Within 1 month', '1–3 months', '3+ months', 'Not sure yet']

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    currency: defaultMarketCurrency,
    timeline: '',
    country: '',
    message: '',
    website: '',
  })

  const updateForm = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const currencySymbol = markets.find((market) => market.code === form.currency)?.symbol ?? 'R'
  const budgetOptions = [
    `Under ${currencySymbol}10,000/month`,
    `${currencySymbol}10,000–${currencySymbol}25,000/month`,
    `${currencySymbol}25,000–${currencySymbol}50,000/month`,
    `${currencySymbol}50,000+/month`,
    'One-time project',
    'Not sure yet',
  ]

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await submitContact({ ...form, name: form.name, currency: form.currency })
      if (!data?.success) throw new Error(data?.error || data?.message || 'Unable to send your message.')
      setConfettiTrigger(true)
      setSubmitted(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <>
        <Confetti trigger={confettiTrigger} />
        <section className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--obsidian)' }}>
          <div className="text-center max-w-md animate-fade-up">
            <h1 className="font-cormorant text-[2.5rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>Message sent</h1>
            <p className="leading-[1.7] mb-8" style={{ color: '#6B6860' }}>
              Thank you for reaching out. We will review your message and share next steps within 48 hours.
            </p>
            <MagneticButton><Link href="/" className="btn-primary">Back to Home</Link></MagneticButton>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}><div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /></div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>Get In Touch</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-5" style={{ color: '#E8E3D8' }}>
            Let&apos;s Build Your<br /><span className="text-shimmer italic">Growth Engine</span>
          </h1>
          <p className="font-light leading-[1.8] text-[1.05rem]" style={{ color: '#6B6860' }}>
            Share what you are working toward. You can leave the project details open if you are still exploring.
          </p>
        </div>
      </section>

      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          <ScrollReveal direction="left">
            <div>
              <SectionLabel>Contact Details</SectionLabel>
              <h2 className="font-cormorant text-[1.8rem] font-semibold mt-1 mb-5" style={{ color: '#E8E3D8' }}>Talk Through Your Growth Goals</h2>
              <p className="text-[0.9rem] leading-[1.8] mb-8" style={{ color: '#6B6860' }}>
                Send the essentials and we will review your request. If a call is useful, we will coordinate a time and share clear next steps.
              </p>
              {[
                { label: 'General enquiries', value: 'info@eva-tech-studio.com', href: 'mailto:info@eva-tech-studio.com' },
                { label: 'Sales', value: 'sales@eva-tech-studio.com', href: 'mailto:sales@eva-tech-studio.com' },
                { label: 'Support', value: 'support@eva-tech-studio.com', href: 'mailto:support@eva-tech-studio.com' },
                { label: 'Phone', value: '+27 67 628 3210', href: 'tel:+27676283210' },
                { label: 'Location', value: 'Johannesburg, South Africa' },
                { label: 'Hours', value: 'Mon–Fri, 8am–6pm SAST' },
              ].map((detail) => (
                <div key={detail.label} className="flex items-start justify-between gap-4 py-3 border-b border-[rgba(201,169,110,0.08)]">
                  <span className="text-[0.78rem]" style={{ color: '#6B6860' }}>{detail.label}</span>
                  {detail.href ? (
                    <a href={detail.href} className="text-right text-[0.87rem] hover:text-[#C9A96E]" style={{ color: '#B8B2A8' }}>{detail.value}</a>
                  ) : (
                    <span className="text-right text-[0.87rem]" style={{ color: '#B8B2A8' }}>{detail.value}</span>
                  )}
                </div>
              ))}
              <div className="mt-8 p-6 rounded-[16px]" style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.12)' }}>
                <p className="font-semibold text-[0.88rem] mb-3" style={{ color: '#E8E3D8' }}>What happens next?</p>
                <p className="text-[0.82rem] leading-[1.9]" style={{ color: '#6B6860' }}>
                  We review your message, clarify the scope where needed, and send you practical next steps within 48 hours.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="rounded-[24px] p-7 sm:p-10 md:p-12" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
              <h2 className="font-cormorant text-[1.6rem] font-semibold mb-1" style={{ color: '#E8E3D8' }}>Send Us a Message</h2>
              <p className="text-[0.85rem] mb-8" style={{ color: '#6B6860' }}>Name, email, and message are the only required fields.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    autoComplete="off"
                    tabIndex={-1}
                    value={form.website}
                    onChange={(event) => updateForm('website', event.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Name <span aria-hidden="true">*</span></label>
                    <input id="contact-name" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Your name" className="form-input" value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Email <span aria-hidden="true">*</span></label>
                    <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className="form-input" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-phone" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Phone <span className="normal-case font-normal tracking-normal">(optional)</span></label>
                    <input id="contact-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="Your phone number" className="form-input" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-country" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Country <span className="normal-case font-normal tracking-normal">(optional)</span></label>
                    <input id="contact-country" name="country" type="text" maxLength={100} autoComplete="country-name" placeholder="Your country" className="form-input" value={form.country} onChange={(event) => updateForm('country', event.target.value)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-service" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Service <span className="normal-case font-normal tracking-normal">(optional)</span></label>
                    <select id="contact-service" name="service" className="form-input" value={form.service} onChange={(event) => updateForm('service', event.target.value)}>
                      <option value="">Select a service...</option>
                      {services.map((service) => <option key={service} value={service}>{service}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-currency" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Currency</label>
                    <select id="contact-currency" name="currency" className="form-input" value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value as MarketCurrencyCode, budget: '' }))}>
                      {markets.map((market) => <option key={market.code} value={market.code}>{market.code} — {market.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-budget" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Budget <span className="normal-case font-normal tracking-normal">(optional)</span></label>
                    <select id="contact-budget" name="budget" className="form-input" value={form.budget} onChange={(event) => updateForm('budget', event.target.value)}>
                      <option value="">Select a range...</option>
                      {budgetOptions.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-timeline" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Timeline <span className="normal-case font-normal tracking-normal">(optional)</span></label>
                    <select id="contact-timeline" name="timeline" className="form-input" value={form.timeline} onChange={(event) => updateForm('timeline', event.target.value)}>
                      <option value="">Select a timeline...</option>
                      {timelines.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Message <span aria-hidden="true">*</span></label>
                  <textarea id="contact-message" name="message" required minLength={1} maxLength={3000} rows={5} placeholder="What are you hoping to accomplish?" className="form-input resize-y" value={form.message} onChange={(event) => updateForm('message', event.target.value)} />
                </div>

                {error && <p role="alert" className="text-red-400 text-[0.82rem]">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 py-4 text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-[0.72rem] text-center tracking-[0.03em]" style={{ color: '#6B6860' }}>We will respond within 48 hours. No spam.</p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
