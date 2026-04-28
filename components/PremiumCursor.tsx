'use client'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export default function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)
  const [magnetic, setMagnetic] = useState(false)
  
  const particlesRef = useRef<Particle[]>([])
  const mxRef = useRef(0)
  const myRef = useRef(0)
  const rxRef = useRef(0)
  const ryRef = useRef(0)
  const targetXRef = useRef(0)
  const targetYRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    const canvas = trailRef.current
    if (!dot || !ring || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let rafId: number
    let lastX = 0
    let lastY = 0
    let speed = 0

    const onMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      
      // Calculate speed for particle emission
      speed = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2)
      lastX = x
      lastY = y

      mxRef.current = x
      myRef.current = y
      dot.style.left = `${x}px`
      dot.style.top = `${y}px`

      // Emit particles based on speed
      if (speed > 5) {
        const count = Math.min(Math.floor(speed / 5), 3)
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            maxLife: 20 + Math.random() * 20,
          })
        }
      }
    }

    const onDown = () => {
      dot.style.transform = 'translate(-50%,-50%) scale(0.6)'
      ring.style.transform = 'translate(-50%,-50%) scale(0.8)'
    }

    const onUp = () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)'
      ring.style.transform = 'translate(-50%,-50%) scale(1)'
    }

    const onEnter = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
      setMagnetic(true)
    }

    const onLeave = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
      setMagnetic(false)
      targetXRef.current = mxRef.current
      targetYRef.current = myRef.current
    }

    // Magnetic snap logic
    const onMagneticMove = (e: Event) => {
      if (!magnetic) return
      const mouseEvent = e as MouseEvent
      const el = mouseEvent.target as HTMLElement
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const strength = 0.3
      targetXRef.current = centerX + (mouseEvent.clientX - centerX) * strength
      targetYRef.current = centerY + (mouseEvent.clientY - centerY) * strength
    }

    const lerp = () => {
      // Smooth ring follow with magnetic effect
      const targetX = magnetic ? targetXRef.current : mxRef.current
      const targetY = magnetic ? targetYRef.current : myRef.current
      
      rxRef.current += (targetX - rxRef.current) * 0.15
      ryRef.current += (targetY - ryRef.current) * 0.15
      
      ring.style.left = `${rxRef.current}px`
      ring.style.top = `${ryRef.current}px`

      // Update particles
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1 / p.maxLife
        p.vx *= 0.95
        p.vy *= 0.95

        if (p.life > 0) {
          const alpha = p.life * 0.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`
          ctx.fill()
          return true
        }
        return false
      })

      rafId = requestAnimationFrame(lerp)
    }
    rafId = requestAnimationFrame(lerp)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    const attach = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('mousemove', onMagneticMove)
      })
    }
    attach()
    const obs = new MutationObserver(attach)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      obs.disconnect()
    }
  }, [magnetic])

  return (
    <>
      <canvas ref={trailRef} className="fixed inset-0 pointer-events-none z-[9996]" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
