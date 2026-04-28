'use client'
import Link from 'next/link'
import { ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

interface ButtonProps {
  variant?: Variant
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export default function Button({ variant = 'primary', href, onClick, children, className = '', fullWidth }: ButtonProps) {
  const cls = `btn-${variant} ${fullWidth ? 'w-full justify-center' : ''} ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button onClick={onClick} className={cls}>{children}</button>
}
