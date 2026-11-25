export const PRIMARY_CTA_LABEL = 'Get a free scope in 48 hours'
export const SECONDARY_CTA_LABEL = 'View our work'

export const SHOW_PROOF_SECTION = false
export const SHOW_TESTIMONIALS = false

// TODO(content): Set the month when the studio is next available for projects.
export const NEW_PROJECTS_MONTH: string | null = null
export const AVAILABILITY_LINE = NEW_PROJECTS_MONTH
  ? `Taking new projects from ${NEW_PROJECTS_MONTH}`
  : 'Taking new projects · timing available on request'

// TODO(confirm): Add a number here only after confirming it is the studio's WhatsApp number.
export const WHATSAPP_NUMBER: string | null = null

// TODO(content): Supply the verified company registration number before displaying it.
export const COMPANY_REGISTRATION_NUMBER: string | null = null
// TODO(content): Supply the verified registered address before displaying it.
export const REGISTERED_ADDRESS: string | null = null

function getBookingUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_BOOKING_URL?.trim()
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export const BOOKING_URL = getBookingUrl()

export function getWhatsAppHref(pathname: string): string | null {
  const number = WHATSAPP_NUMBER?.replace(/\D/g, '')
  if (!number) return null

  const message = `Hello Eva Tech Studio, I am viewing ${pathname} and would like to discuss a project.`
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
