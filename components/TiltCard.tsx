'use client'
import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  tiltStrength?: number
  glareOpacity?: number
}

export default function TiltCard({ 
  children, 
  className = '', 
  tiltStrength = 15,
  glareOpacity = 0.15 
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, left: '50%', top: '50%' })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltStrength
    const rotateY = ((x - centerX) / centerX) * tiltStrength

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    )

    // Glare effect
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    setGlareStyle({
      opacity: glareOpacity,
      left: `${glareX}%`,
      top: `${glareY}%`,
    })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)')
    setGlareStyle({ opacity: 0, left: '50%', top: '50%' })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ transform, transition: 'transform 0.1s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
          opacity: glareStyle.opacity,
          left: glareStyle.left,
          top: glareStyle.top,
          transform: 'translate(-50%, -50%)',
          width: '200%',
          height: '200%',
          transition: 'opacity 0.2s ease, left 0.1s ease, top 0.1s ease',
        }}
      />
      {children}
    </div>
  )
}
