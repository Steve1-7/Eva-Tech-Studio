'use client'
import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right'
}

export default function ScrollReveal({ children, delay = 0, className = '', direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const initTransform = direction === 'up'
      ? 'translateY(28px)'
      : direction === 'left'
      ? 'translateX(-28px)'
      : 'translateX(28px)'

    el.style.opacity = '0'
    el.style.transform = initTransform
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`

    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      el.style.opacity = '1'
      el.style.transform = 'translate(0)'
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.disconnect()
          clearTimeout(safetyTimer)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)

    // Safety: force reveal after 4s so content is never permanently hidden
    const safetyTimer = setTimeout(reveal, 4000)

    return () => {
      observer.disconnect()
      clearTimeout(safetyTimer)
    }
  }, [delay, direction])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
