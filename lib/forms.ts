type ContactPayload = {
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  service?: string
  budget?: string
  message?: string
}

const inFlight = new Set<string>()

function hashPayload(p: ContactPayload) {
  return [p.email || '', p.firstName || '', p.lastName || '', (p.message || '').slice(0, 200)].join('|')
}

export async function submitContact(payload: ContactPayload) {
  const p: ContactPayload = {
    firstName: payload.firstName?.trim() || '',
    lastName: payload.lastName?.trim() || '',
    email: (payload.email || '').trim(),
    phone: payload.phone?.trim() || '',
    service: payload.service?.trim() || '',
    budget: payload.budget?.trim() || '',
    message: payload.message?.trim() || ''
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
    // Use configurable API base so frontend can target different backends
    const { apiFetch } = await import('./api')
    const res = await apiFetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        service: p.service,
        budget: p.budget,
        message: p.message
      })
    })

    const data = await res.json()
    if (!res.ok && !data.success) {
      throw new Error(data.error || data.message || 'Submission failed')
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
