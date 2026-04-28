'use client'
import { useRef, useEffect } from 'react'

interface Props {
  children: React.ReactNode
  speed?: number
  className?: string
}

export default function ParallaxLayer({ children, speed = 0.5, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lastScrollY = window.scrollY

    const update = () => {
      const scrollY = window.scrollY
      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Only animate if element is in/near viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const relativeY = scrollY - lastScrollY
        el.style.transform = `translateY(${relativeY * speed}px)`
      }

      lastScrollY = scrollY
      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
