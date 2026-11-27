'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/site/ThemeToggle'
import { AVAILABILITY_LINE, PRIMARY_CTA_LABEL } from '@/config/site'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Notes' },
  { href: '/tools', label: 'Tools' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className="ets-site-header">
        <div className="ets-topbar">
          <div className="ets-topbar-inner">
            <span><i className="ets-status-dot" /> {AVAILABILITY_LINE}</span>
            <span>Mon–Fri · 8am–6pm SAST</span>
            <span>Johannesburg · Working globally</span>
            <Link href="/contact">Contact <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
      <nav className="ets-nav" aria-label="Main navigation">
        <Link href="/" className="ets-brand" aria-label="Eva Tech Studio home" onClick={() => setMenuOpen(false)}>
          <Image src="/logo5.webp" alt="Eva Tech Studio" width={118} height={40} priority />
        </Link>
        <div id="ets-mobile-menu" className={`ets-nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="ets-mobile-nav-tools">
            <ThemeToggle />
            <Link className="ets-button primary" href="/contact" onClick={() => setMenuOpen(false)}>{PRIMARY_CTA_LABEL}</Link>
          </div>
        </div>
        <div className="ets-nav-actions">
          <ThemeToggle />
          <Link className="ets-button primary" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="ets-mobile-actions">
          <ThemeToggle />
          <button
            type="button"
            className="ets-menu-button"
            aria-expanded={menuOpen}
            aria-controls="ets-mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span />
          </button>
        </div>
      </nav>
    </>
  )
}
