'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export default function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: Props) {
  const [value, setValue] = useState(end)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || started || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setValue(0)
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [end, started])

  useEffect(() => {
    if (!started) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches) {
      setValue(end)
      return
    }

    const startTime = performance.now()
    const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 3)
    let animationFrame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Number((easeOut(progress) * end).toFixed(decimals)))
      if (progress < 1) animationFrame = requestAnimationFrame(tick)
      else setValue(end)
    }

    animationFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrame)
  }, [started, end, duration, decimals])

  return (
    <span ref={ref} className={`count-up-number ${className}`}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  )
}
