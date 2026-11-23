'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { submitContact } from '@/lib/forms'

const serviceOptions = [
  'Website Development',
  'Web App Development',
  'Mobile and App Development',
  'Custom Software',
  'AI Chatbots',
  'Trading Bots',
  'Automation and Integrations',
  'Not sure yet',
]

const budgetOptions = [
  'Under R5,000',
  'R5,000–R15,000',
  'R15,000–R30,000',
  'R30,000+',
  'Not sure yet',
]

const timelineOptions = ['As soon as possible', 'Within 2–4 weeks', 'Within 1–3 months', 'Flexible']

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    message: '',
    website: '',
  })

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await submitContact(form)
      if (!response?.success) throw new Error(response?.error || 'Your brief could not be sent.')
      setSubmitted(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Your brief could not be sent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ets-contact-card">
      {submitted ? (
        <div className="ets-contact-success" role="status">
          <p className="ets-eyebrow">Brief received</p>
          <h2>Thanks for the context.</h2>
          <p>We’ll review your project details and follow up by email.</p>
          <Link className="ets-text-link" href="/">Back to Eva Tech Studio <span aria-hidden="true">↗</span></Link>
        </div>
      ) : (
        <form className="ets-contact-form" onSubmit={handleSubmit}>
          <div className="ets-contact-fields">
            <label>
              <span>Name</span>
              <input autoComplete="name" name="name" required maxLength={160} value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input autoComplete="email" name="email" type="email" required maxLength={254} value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            </label>
            <label>
              <span>Service</span>
              <select name="service" required value={form.service} onChange={(event) => updateField('service', event.target.value)}>
                <option value="">Choose a service</option>
                {serviceOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Budget</span>
              <select name="budget" required value={form.budget} onChange={(event) => updateField('budget', event.target.value)}>
                <option value="">Choose a range</option>
                {budgetOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Timeline</span>
              <select name="timeline" required value={form.timeline} onChange={(event) => updateField('timeline', event.target.value)}>
                <option value="">Choose a timeline</option>
                {timelineOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Phone <small>Optional</small></span>
              <input autoComplete="tel" name="phone" type="tel" maxLength={50} value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </label>
            <label className="ets-contact-message">
              <span>Tell us what you want to build</span>
              <textarea name="message" rows={6} required maxLength={5000} value={form.message} onChange={(event) => updateField('message', event.target.value)} placeholder="What are you trying to make easier, faster, or possible?" />
            </label>
          </div>
          <div className="ets-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField('website', event.target.value)} />
          </div>
          {error && <p className="ets-form-error" role="alert">{error}</p>}
          <button className="ets-button primary" type="submit" disabled={loading}>
            {loading ? 'Sending brief…' : 'Send project brief'} <span aria-hidden="true">↗</span>
          </button>
          <p className="ets-form-note">Your details are used only to respond to this enquiry. See our <Link href="/privacy">privacy policy</Link>.</p>
        </form>
      )}
    </div>
  )
}
