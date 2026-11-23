'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const targets = document.querySelectorAll<HTMLElement>(
      '.ets-page > .ets-section, .ets-page > .ets-offer-band, .ets-page > .ets-ticker, .ets-page > .ets-quote-marquee, .ets-page > .ets-stack-section, .ets-page > .ets-final-cta',
    )
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('ets-in-view')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })

    targets.forEach((target) => {
      target.classList.add('ets-motion-ready')
      observer.observe(target)
    })

    return () => {
      observer.disconnect()
      targets.forEach((target) => target.classList.remove('ets-motion-ready', 'ets-in-view'))
    }
  }, [pathname])

  return null
}
