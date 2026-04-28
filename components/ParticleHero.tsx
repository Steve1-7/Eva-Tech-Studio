'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  radius: number; opacity: number
}

export default function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0, height = 0
    let mouseX = -9999, mouseY = -9999
    let particles: Particle[] = []
    let rafId: number

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      init()
    }

    const init = () => {
      const count = Math.min(Math.floor((width * height) / 12000), 90)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      }))
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999 }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.4
          p.vy += (dy / dist) * force * 0.4
        }

        // Speed clamp + damping
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 1.5) { p.vx = (p.vx / spd) * 1.5; p.vy = (p.vy / spd) * 1.5 }
        p.vx *= 0.99; p.vy *= 0.99
        p.x += p.vx; p.y += p.vy

        // Wrap
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Draw gold dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,169,110,${p.opacity})`
        ctx.fill()

        // Connect nearby particles with gold lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(201,169,110,${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      })

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
