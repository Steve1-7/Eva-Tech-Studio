type ContactPayload = {
  name?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  country?: string
  service?: string
  budget?: string
  timeline?: string
  message?: string
  website?: string
}

const inFlight = new Set<string>()

function hashPayload(p: ContactPayload) {
  return [p.email || '', p.name || '', (p.message || '').slice(0, 200)].join('|')
}

export async function submitContact(payload: ContactPayload) {
  const name = payload.name?.trim() || [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim()
  const p: ContactPayload = {
    name,
    firstName: payload.firstName?.trim() || '',
    lastName: payload.lastName?.trim() || '',
    email: (payload.email || '').trim(),
    phone: payload.phone?.trim() || '',
    country: payload.country?.trim() || '',
    service: payload.service?.trim() || '',
    budget: payload.budget?.trim() || '',
    timeline: payload.timeline?.trim() || '',
    message: payload.message?.trim() || '',
    website: payload.website?.trim() || '',
  }

  if (!name) {
    throw new Error('Name is required')
  }

  if (!p.email) {
    throw new Error('Email is required')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(p.email)) {
    throw new Error('Please enter a valid email address')
  }

  const key = hashPayload(p)
  if (inFlight.has(key)) {
    throw new Error('Submission already in progress')
  }

  inFlight.add(key)
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: p.name,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        country: p.country,
        service: p.service,
        budget: p.budget,
        timeline: p.timeline,
        message: p.message,
        website: p.website,
      }),
      credentials: 'same-origin',
    })

    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.success) {
      const fallbackMessage = res.status === 504
        ? 'Email delivery timed out. Your details are still here; email info@eva-tech-studio.com to make sure we receive them.'
        : 'We could not confirm delivery. Your details are still here; email info@eva-tech-studio.com to make sure we receive them.'
      throw new Error(typeof data?.error === 'string' ? data.error : fallbackMessage)
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
  const [firstName, ...rest] = (payload.fullName || '').trim().split(' ')
  const lastName = rest.join(' ') || ''

  return submitContact({
    firstName,
    lastName,
    email: payload.email,
    phone: payload.phone,
    service: payload.selectedPackage,
    budget: payload.budgetRange || '',
    message: `Company: ${payload.companyName || 'N/A'}\n\nGoals: ${payload.projectGoals || ''}\n\nNotes: ${payload.additionalNotes || ''}`
  })
}
