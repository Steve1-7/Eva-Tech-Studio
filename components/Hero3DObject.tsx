'use client'
import { useEffect, useRef, useState } from 'react'

export default function Hero3DObject() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: -20, y: 45 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate rotation based on mouse position relative to center
      const rotateY = ((e.clientX - centerX) / window.innerWidth) * 40 + 45
      const rotateX = ((e.clientY - centerY) / window.innerHeight) * -30 - 20
      
      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-[300px] h-[300px] mx-auto"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icosahedron / Polyhedron Container */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
        }}
      >
        {/* Core sphere */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(232, 201, 122, 0.3), rgba(201, 169, 110, 0.1), transparent)',
            transform: 'translateZ(0)',
            boxShadow: '0 0 80px rgba(201, 169, 110, 0.3), inset 0 0 60px rgba(201, 169, 110, 0.1)',
          }}
        />

        {/* Orbital rings */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: `rgba(201, 169, 110, ${0.2 + i * 0.1})`,
              transform: `
                rotateX(${60 + i * 30}deg) 
                rotateY(${i * 45}deg) 
                rotateZ(${i * 15}deg)
                scale(${1 - i * 0.15})
              `,
              animation: `orbit-${i} ${8 + i * 2}s linear infinite`,
              boxShadow: `0 0 20px rgba(201, 169, 110, ${0.1 + i * 0.05})`,
            }}
          />
        ))}

        {/* Floating nodes/particles */}
        {[
          { x: 50, y: 20, z: 80, delay: 0 },
          { x: 80, y: 50, z: -60, delay: 1 },
          { x: 20, y: 80, z: 40, delay: 2 },
          { x: 70, y: 30, z: -80, delay: 3 },
          { x: 30, y: 70, z: 60, delay: 4 },
          { x: 60, y: 60, z: -40, delay: 1.5 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              background: 'radial-gradient(circle at 30% 30%, var(--gold-bright), var(--gold))',
              boxShadow: '0 0 15px var(--gold), 0 0 30px var(--gold-dim)',
              transform: `translateZ(${pos.z}px) scale(${isHovered ? 1.5 : 1})`,
              animation: `float-node ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${pos.delay}s`,
            }}
          />
        ))}

        {/* Connecting lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            transform: 'translateZ(0)',
            opacity: 0.4,
          }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(201, 169, 110, 0)" />
              <stop offset="50%" stopColor="rgba(201, 169, 110, 0.5)" />
              <stop offset="100%" stopColor="rgba(201, 169, 110, 0)" />
            </linearGradient>
          </defs>
          <line x1="50%" y1="20%" x2="80%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="80%" y1="50%" x2="50%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" begin="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="50%" y1="80%" x2="20%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" begin="1s" repeatCount="indefinite" />
          </line>
          <line x1="20%" y1="50%" x2="50%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Inner geometric shapes */}
        <div
          className="absolute inset-[20%] border-2 border-[rgba(201,169,110,0.3)]"
          style={{
            transform: 'rotateX(45deg) rotateY(45deg) translateZ(20px)',
            animation: 'spin-slow 20s linear infinite',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
        
        <div
          className="absolute inset-[30%] border-2 border-[rgba(201,169,110,0.2)]"
          style={{
            transform: 'rotateX(-30deg) rotateY(60deg) translateZ(-30px)',
            animation: 'spin-slow 15s linear infinite reverse',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
        />

        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(201, 169, 110, 0.05) 70%)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotateX(45deg) rotateY(45deg) translateZ(20px) rotateZ(0deg); }
          to { transform: rotateX(45deg) rotateY(45deg) translateZ(20px) rotateZ(360deg); }
        }
        
        @keyframes orbit-0 {
          from { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg) scale(1); }
          to { transform: rotateX(60deg) rotateY(0deg) rotateZ(360deg) scale(1); }
        }
        
        @keyframes orbit-1 {
          from { transform: rotateX(90deg) rotateY(45deg) rotateZ(0deg) scale(0.85); }
          to { transform: rotateX(90deg) rotateY(45deg) rotateZ(360deg) scale(0.85); }
        }
        
        @keyframes orbit-2 {
          from { transform: rotateX(120deg) rotateY(90deg) rotateZ(0deg) scale(0.7); }
          to { transform: rotateX(120deg) rotateY(90deg) rotateZ(-360deg) scale(0.7); }
        }
        
        @keyframes orbit-3 {
          from { transform: rotateX(150deg) rotateY(135deg) rotateZ(0deg) scale(0.55); }
          to { transform: rotateX(150deg) rotateY(135deg) rotateZ(360deg) scale(0.55); }
        }
        
        @keyframes float-node {
          0%, 100% { transform: translateZ(var(--z, 0)) translateY(0) scale(1); }
          50% { transform: translateZ(var(--z, 0)) translateY(-10px) scale(1.1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
