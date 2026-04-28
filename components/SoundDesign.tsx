'use client'
import { useEffect, useRef, useCallback } from 'react'

// Web Audio API synthesized sounds (no external files needed)
export default function SoundDesign() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastScrollY = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isEnabledRef = useRef(false)

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    isEnabledRef.current = true
  }, [])

  // Click sound - short high-pitched ping
  const playClick = useCallback(() => {
    if (!isEnabledRef.current || !audioContextRef.current) return
    
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.05)
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }, [])

  // Hover sound - subtle low whoosh
  const playHover = useCallback(() => {
    if (!isEnabledRef.current || !audioContextRef.current) return
    
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, ctx.currentTime)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.15)
    
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.02)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  }, [])

  // Scroll whoosh - based on scroll velocity
  const playScrollWhoosh = useCallback((velocity: number) => {
    if (!isEnabledRef.current || !audioContextRef.current) return
    if (Math.abs(velocity) < 5) return // Only play on fast scrolls
    
    const ctx = audioContextRef.current
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    
    // Create pink noise
    for (let i = 0; i < noiseBuffer.length; i++) {
      const white = Math.random() * 2 - 1
      output[i] = (lastScrollY.current + (0.02 * white)) / 1.02
      lastScrollY.current = output[i]
      output[i] *= 3.5
    }
    
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    
    source.buffer = noiseBuffer
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200 + Math.min(Math.abs(velocity) * 2, 800), ctx.currentTime)
    filter.Q.setValueAtTime(0.5, ctx.currentTime)
    
    const volume = Math.min(Math.abs(velocity) / 500, 0.03)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    
    source.start(ctx.currentTime)
    source.stop(ctx.currentTime + 0.3)
  }, [])

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      initAudio()
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
    
    window.addEventListener('click', handleFirstInteraction, { once: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true })

    // Click sound on buttons and links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (target instanceof Element && target.closest('button, a, [data-sound="click"]')) {
        playClick()
      }
    }

    // Hover sound on interactive elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as Node
      if (target instanceof Element && target.closest('button, a, .card, [data-sound="hover"]')) {
        playHover()
      }
    }

    // Scroll whoosh
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      const velocity = Math.abs(window.scrollY - lastScrollY.current)
      lastScrollY.current = window.scrollY
      
      playScrollWhoosh(velocity)
      
      scrollTimeoutRef.current = setTimeout(() => {
        lastScrollY.current = window.scrollY
      }, 150)
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [initAudio, playClick, playHover, playScrollWhoosh])

  return null // No visual output
}
