'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  life: number
  maxLife: number
}

interface Props {
  trigger: boolean
  onComplete?: () => void
  duration?: number
  particleCount?: number
}

const COLORS = ['#C9A96E', '#E8C97A', '#4A7A64', '#6BA889', '#E8E3D8']

export default function Confetti({ trigger, onComplete, duration = 3000, particleCount = 150 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const activeRef = useRef(false)

  useEffect(() => {
    if (!trigger) return
    if (activeRef.current) return
    activeRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create particles from center
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      const speed = 5 + Math.random() * 15
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 10,
        life: 1,
        maxLife: 60 + Math.random() * 60,
      })
    }

    let rafId: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3 // gravity
        p.vx *= 0.99 // air resistance
        p.rotation += p.rotationSpeed
        p.life -= 1 / p.maxLife

        if (p.life > 0) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.life
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
          return true
        }
        return false
      })

      if (elapsed < duration && particlesRef.current.length > 0) {
        rafId = requestAnimationFrame(animate)
      } else {
        activeRef.current = false
        particlesRef.current = []
        onComplete?.()
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [trigger, duration, particleCount, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
