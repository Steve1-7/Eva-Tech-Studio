"use client"
import { useEffect, useRef, useState } from 'react'

export default function HeroBackground({ src = '/vid/map.mp4', poster }: { src?: string; poster?: string | undefined }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = document.querySelector('section.relative.min-h-screen')
    if (!el) {
      setShouldLoad(true)
      return
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          io.disconnect()
        }
      })
    }, { rootMargin: '200px' })

    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return
    const v = videoRef.current
    if (!v) return

    // Try to play; many browsers allow autoplay if muted
    v.muted = true
    v.playsInline = true
    v.loop = true
    v.preload = 'metadata'

    // Ensure the media element has a source and listen for loadeddata
    try {
      // If sources are not yet picked up by the browser, assign src directly as a fallback
      if (!v.currentSrc) v.src = src
    } catch (err) {
      // ignore
    }

    const onLoaded = () => setLoaded(true)
    v.addEventListener('loadeddata', onLoaded)

    const tryPlay = async () => {
      try {
        await v.play()
        setLoaded(true)
      } catch (e) {
        // Autoplay blocked; keep poster visible
        console.debug('[HeroBackground] autoplay blocked', e)
        setLoaded(true)
      }
    }

    // Respect reduced motion preference: don't auto-load large media
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      tryPlay()
    } else {
      setLoaded(true)
    }

    return () => {
      v.removeEventListener('loadeddata', onLoaded)
    }
  }, [shouldLoad])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover absolute inset-0 z-0"
        {...(poster ? { poster } : {})}
        muted
        playsInline
        autoPlay
        loop
        aria-hidden
      >
        {shouldLoad && (
          <>
            {/* Prefer WebM if available for better compression */}
            <source src={src.endsWith('.mp4') ? src.replace(/\.mp4$/, '.webm') : src.replace(/\.[^/.]+$/, '.webm')} type="video/webm" onError={() => { /* ignore */ }} />
            <source src={src} type="video/mp4" />
          </>
        )}
      </video>
      <div className="hero-video-overlay absolute inset-0 pointer-events-none" />
    </div>
  )
}
