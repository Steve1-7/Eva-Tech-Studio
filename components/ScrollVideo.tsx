'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  poster?: string
  className?: string
}

export default function ScrollVideo({ src, poster, className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    let rafId: number
    let isScrolling = false

    const handleScroll = () => {
      if (isScrolling) return
      isScrolling = true

      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const containerHeight = rect.height

        // Calculate progress based on container position
        const startTrigger = windowHeight
        const endTrigger = -containerHeight
        const currentPosition = rect.top

        // Map position to 0-1 progress
        const rawProgress = (startTrigger - currentPosition) / (startTrigger - endTrigger)
        const clampedProgress = Math.max(0, Math.min(1, rawProgress))

        setProgress(clampedProgress)
        setIsInView(rect.top < windowHeight && rect.bottom > 0)

        // Update video currentTime based on scroll progress
        if (video.duration && !isNaN(video.duration)) {
          const targetTime = clampedProgress * video.duration
          
          // Smooth scrubbing
          const currentTimeDiff = Math.abs(video.currentTime - targetTime)
          if (currentTimeDiff > 0.1) {
            video.currentTime = targetTime
          }
        }

        isScrolling = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{
          filter: isInView ? 'none' : 'blur(10px)',
          transition: 'filter 0.5s ease',
        }}
      />

      {/* Overlay gradient for text readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(7, 8, 15, 0.8) 0%,
            rgba(7, 8, 15, 0.4) 50%,
            rgba(7, 8, 15, 0.8) 100%
          )`,
        }}
      />

      {/* Scroll progress indicator */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-[#C9A96E] transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Playhead indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
      >
        <div className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
        <span className="text-[0.7rem] font-medium" style={{ color: '#B8B2A8' }}>
          Scroll to explore
        </span>
        <span className="text-[0.7rem] font-bold" style={{ color: '#E8E3D8' }}>
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  )
}
