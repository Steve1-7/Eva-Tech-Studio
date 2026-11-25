export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  logo?: string
}

export const siteConfig = {
  proofEnabled: false,
  testimonialsEnabled: false,
  availabilityMonth: null as string | null,
  whatsappNumber: '',
  bookingUrl: '',
  legalDetails: {
    legalName: null as string | null,
    registrationNumber: null as string | null,
    vatNumber: null as string | null,
    address: null as string | null,
  },
  testimonials: [] as Testimonial[],
}

export function getWhatsAppHref(message?: string) {
  const number = siteConfig.whatsappNumber.replace(/\D/g, '')
  if (number.length < 8) return null

  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${query}`
}
