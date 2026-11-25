'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import BookingLink from '@/components/BookingLink'
import WhatsAppLink from '@/components/WhatsAppLink'

const AmbientSound = dynamic(() => import('@/components/AmbientSound'), { ssr: false })

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/careers', label: 'Careers' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/client-portal', label: 'Client Portal' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500 px-6 md:px-[60px] ${
        scrolled
          ? 'py-4 bg-[#07080F]/90 backdrop-blur-2xl border-b border-[rgba(201,169,110,0.1)] shadow-[0_4px_40px_rgba(0,0,0,0.6)]'
          : 'py-5'
      }`}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo5.webp" alt="Eva-Tech-Studio" className="h-16 w-auto max-w-[200px] object-contain xl:h-24 xl:max-w-[300px]" />
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-[0.78rem] font-medium uppercase tracking-[0.08em] transition-all duration-200 ${
                pathname === l.href
                  ? 'text-[#C9A96E]'
                  : 'text-[#6B6860] hover:text-[#E8E3D8]'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <AmbientSound />
          <BookingLink className="btn-primary text-[0.8rem] px-5 py-2.5">
            Book a Strategy Call
          </BookingLink>
          <WhatsAppLink className="btn-outline text-[0.8rem] px-4 py-2.5">WhatsApp</WhatsAppLink>
        </div>

        {/* Mobile */}
        <div className="xl:hidden">
          <button 
            onClick={() => setMobileOpen(v => !v)} 
            className="relative z-[60] flex flex-col gap-[5px] cursor-pointer p-2 -mr-2" 
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <span className={`block w-6 h-[2px] bg-[#E8E3D8] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[#E8E3D8] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[#E8E3D8] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-[55] flex flex-col items-center justify-start gap-4 overflow-y-auto px-6 py-24 xl:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ background: 'rgba(7, 8, 15, 0.98)', backdropFilter: 'blur(20px)' }}
      >
        {[...links, { href: '/contact', label: 'Contact' }].map((l, i) => (
          <Link 
            key={l.href} 
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className={`font-cormorant text-[2.4rem] font-semibold text-[#E8E3D8] hover:text-[#C9A96E] transition-all duration-300 ${
              mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms' }}
          >
            {l.label}
          </Link>
        ))}
        
        <div className="flex flex-col items-center gap-3 mt-2">
          <BookingLink className="btn-primary px-6 py-3">Book a Strategy Call</BookingLink>
          <WhatsAppLink className="btn-outline px-6 py-3">WhatsApp</WhatsAppLink>
        </div>

        {/* Close button hint */}
        <div className={`absolute bottom-10 text-[0.7rem] transition-opacity duration-500 ${mobileOpen ? 'opacity-40' : 'opacity-0'}`} style={{ color: '#6B6860' }}>
          Tap menu button to close
        </div>
      </div>
    </>
  )
}
