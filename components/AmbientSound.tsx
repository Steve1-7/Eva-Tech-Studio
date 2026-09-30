'use client'
import { useEffect, useRef, useState } from 'react'

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const contextRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepRef = useRef(0)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    void contextRef.current?.close()
  }, [])

  const playStep = (context: AudioContext, step: number) => {
    const melody = [60, null, 64, 67, null, 64, 62, null, 57, null, 60, 64, null, 62, 60, null]
    const time = context.currentTime + 0.03
    const playTone = (midi: number, duration: number, volume: number, type: OscillatorType) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = type
      oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12)
      gain.gain.setValueAtTime(0.0001, time)
      gain.gain.exponentialRampToValueAtTime(volume, time + 0.025)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(time)
      oscillator.stop(time + duration + 0.02)
    }

    const note = melody[step % melody.length]
    if (note !== null) playTone(note, 0.28, 0.055, 'triangle')
    if (step % 4 === 0) playTone([36, 41, 38, 43][Math.floor(step / 4) % 4], 0.5, 0.09, 'sine')
    if (step % 4 === 0) {
      playTone([48, 52, 55, 52][Math.floor(step / 4) % 4], 0.7, 0.025, 'triangle')
    }
  }

  const toggle = async () => {
    try {
      const context = contextRef.current || new window.AudioContext()
      contextRef.current = context
      if (playing) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        await context.suspend()
        setPlaying(false)
        return
      }

      await context.resume()
      setUnavailable(false)
      playStep(context, stepRef.current++)
      timerRef.current = setInterval(() => playStep(context, stepRef.current++), 375)
      setPlaying(true)
    } catch {
      setPlaying(false)
      setUnavailable(true)
    }
  }

  return (
    <button onClick={toggle} title={unavailable ? 'Audio is unavailable in this browser' : playing ? 'Pause lo-fi' : 'Play lo-fi'}
      aria-label={unavailable ? 'Audio unavailable' : playing ? 'Pause lo-fi' : 'Play lo-fi'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.72rem] font-medium transition-all cursor-pointer"
      style={playing
        ? { border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', background: 'rgba(201,169,110,0.06)' }
        : { border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860', background: 'transparent' }}>
      {playing ? (
        <>
          <div className="flex items-center gap-[2px]">
            {[...Array(5)].map((_, i) => <span key={i} className="wave-bar" />)}
          </div>
          <span>Lo-fi</span>
        </>
      ) : (
        <><span>🎵</span><span>{unavailable ? 'Audio unavailable' : 'Lo-fi'}</span></>
      )}
    </button>
  )
}
