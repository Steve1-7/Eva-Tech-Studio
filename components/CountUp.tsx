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
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const startTime = performance.now()
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setValue(parseFloat((easeOut(progress) * end).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(tick)
      else setValue(end)
    }
    requestAnimationFrame(tick)
  }, [started, end, duration, decimals])

  return (
    <span ref={ref} className={`count-up-number ${className}`}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  )
}
