'use client'

import type { ReactNode } from 'react'
import { getWhatsAppHref } from '@/config/site'

type WhatsAppLinkProps = {
  children: ReactNode
  className?: string
  message?: string
}

export default function WhatsAppLink({ children, className, message }: WhatsAppLinkProps) {
  const href = getWhatsAppHref(message)
  if (!href) return null

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
