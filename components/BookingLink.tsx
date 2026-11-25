'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

type BookingLinkProps = {
  children: ReactNode
  className?: string
}

export default function BookingLink({ children, className }: BookingLinkProps) {
  const bookingUrl = siteConfig.bookingUrl.trim()

  if (/^https:\/\//i.test(bookingUrl)) {
    return (
      <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={bookingUrl.startsWith('/') ? bookingUrl : '/contact'} className={className}>
      {children}
    </Link>
  )
}
