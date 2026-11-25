import { defaultMarketCurrency, type MarketCurrencyCode } from '@/config/markets'

type ContactPayload = {
  name?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  service?: string
  budget?: string
  currency?: MarketCurrencyCode
  timeline?: string
  country?: string
  message?: string
  website?: string
}

const inFlight = new Set<string>()

function hashPayload(payload: ContactPayload & { name: string; message: string }) {
  return [payload.email, payload.name, payload.message.slice(0, 200)].join('|')
}

export async function submitContact(payload: ContactPayload) {
  const legacyName = [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim()
  const name = payload.name === undefined ? legacyName || 'Website inquiry' : payload.name.trim()
  const normalized = {
    name,
    email: (payload.email || '').trim(),
    phone: payload.phone?.trim() || '',
    service: payload.service?.trim() || '',
    budget: payload.budget?.trim() || '',
    currency: payload.currency || defaultMarketCurrency,
    timeline: payload.timeline?.trim() || '',
    country: payload.country?.trim() || '',
    message: payload.message?.trim() || '',
    website: payload.website?.trim() || '',
  }

  if (!normalized.name) throw new Error('Name is required')
  if (normalized.name.length > 120) throw new Error('Name must be 120 characters or fewer')
  if (!normalized.email) throw new Error('Email is required')
  if (normalized.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    throw new Error('Please enter a valid email address')
  }
  if (!normalized.message) throw new Error('Message is required')
  if (normalized.message.length > 3000) throw new Error('Message must be 3000 characters or fewer')
  if (normalized.phone.length > 40 || normalized.service.length > 120 || normalized.budget.length > 100 || normalized.timeline.length > 80 || normalized.country.length > 100) {
    throw new Error('One or more optional fields exceed the allowed length')
  }

  const key = hashPayload(normalized)
  if (inFlight.has(key)) throw new Error('Submission already in progress')

  inFlight.add(key)
  try {
    const { apiFetch } = await import('./api')
    const response = await apiFetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    })

    const data = await response.json()
    if (!response.ok || !data?.success) {
      throw new Error(data?.error || data?.message || 'Submission failed')
    }

    return data
  } finally {
    inFlight.delete(key)
  }
}

export default submitContact

export async function submitPackageInquiry(payload: {
  fullName: string
  companyName?: string
  email: string
  phone?: string
  selectedPackage: string
  projectGoals?: string
  budgetRange?: string
  additionalNotes?: string
}) {
  const message = [
    `Company: ${payload.companyName || 'Not provided'}`,
    `Goals: ${payload.projectGoals || 'Not provided'}`,
    `Notes: ${payload.additionalNotes || 'Not provided'}`,
  ].join('\n\n')

  return submitContact({
    name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    service: payload.selectedPackage,
    budget: payload.budgetRange || '',
    currency: defaultMarketCurrency,
    message,
  })
}
