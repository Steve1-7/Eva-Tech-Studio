'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { submitContact } from '@/lib/forms'
import {
  DEFAULT_BUDGET_CURRENCY,
  getBudgetOptionsForCurrency,
  isBudgetCurrency,
  SUPPORTED_CURRENCIES,
  type BudgetCurrency,
} from '@/config/markets'

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

const CURRENCY_COOKIE = 'ets-currency'
const timelineOptions = ['As soon as possible', 'Within 2–4 weeks', 'Within 1–3 months', 'Flexible']

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    service: '',
    budget: '',
    timeline: '',
    message: '',
    website: '',
  })
  const [budgetCurrency, setBudgetCurrency] = useState<BudgetCurrency>(DEFAULT_BUDGET_CURRENCY)
  const budgetOptions = getBudgetOptionsForCurrency(budgetCurrency)

  useEffect(() => {
    const savedCurrency = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${CURRENCY_COOKIE}=`))
      ?.split('=')[1]
    if (savedCurrency && isBudgetCurrency(savedCurrency)) setBudgetCurrency(savedCurrency)
  }, [])

  function handleBudgetCurrencyChange(value: string) {
    if (!isBudgetCurrency(value)) return
    setBudgetCurrency(value)
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CURRENCY_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
    setForm((current) => ({ ...current, budget: '' }))
  }

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
          <p>Your enquiry is with us. We’ll review it and send a clear first scope and next steps within 48 hours.</p>
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
              <span>Service <small>Optional</small></span>
              <select name="service" value={form.service} onChange={(event) => updateField('service', event.target.value)}>
                <option value="">Choose a service</option>
                {serviceOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Budget currency</span>
              <select name="budgetCurrency" value={budgetCurrency} onChange={(event) => handleBudgetCurrencyChange(event.target.value)}>
                {SUPPORTED_CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
              </select>
            </label>
            <label>
              <span>Budget ({budgetCurrency}) <small>Optional</small></span>
              <select name="budget" value={form.budget} onChange={(event) => updateField('budget', event.target.value)}>
                <option value="">Choose a range</option>
                {budgetOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Timeline <small>Optional</small></span>
              <select name="timeline" value={form.timeline} onChange={(event) => updateField('timeline', event.target.value)}>
                <option value="">Choose a timeline</option>
                {timelineOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Phone <small>Optional</small></span>
              <input autoComplete="tel" name="phone" type="tel" maxLength={50} value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </label>
            <label>
              <span>Country <small>Optional</small></span>
              <input autoComplete="country-name" name="country" maxLength={100} value={form.country} onChange={(event) => updateField('country', event.target.value)} />
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
          {error && <p id="contact-form-error" className="ets-form-error" role="alert">{error}</p>}
          <button className="ets-button primary" type="submit" disabled={loading}>
            {loading ? 'Sending brief…' : 'Send project brief'} <span aria-hidden="true">↗</span>
          </button>
          <p className="ets-form-note">Your details are used only to respond to this enquiry. See our <Link href="/privacy">privacy policy</Link>.</p>
        </form>
      )}
    </div>
  )
}
