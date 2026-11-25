'use client'

import { usePathname } from 'next/navigation'
import { getWhatsAppHref } from '@/config/site'

export default function FloatingContactActions() {
  const pathname = usePathname() || '/'
  const href = getWhatsAppHref(pathname)

  if (!href) return null

  return (
    <a
      className="ets-floating-contact"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Message Eva Tech Studio on WhatsApp about ${pathname}`}
    >
      <span className="ets-whatsapp-mark" aria-hidden="true">WA</span>
      <span>WhatsApp</span>
    </a>
  )
}
