'use client'
import { useRef, useState } from 'react'

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggle = () => {
    if (!audioRef.current) {
      const audio = new Audio('https://stream.zeno.fm/f3wvbbqmdg8uv')
      audio.loop = true; audio.volume = 0.2
      audioRef.current = audio
    }
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play().catch(() => {}); setPlaying(true) }
  }

  return (
    <button onClick={toggle} title={playing ? 'Pause' : 'Play ambient music'}
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
        <><span>🎵</span><span>Lo-fi</span></>
      )}
    </button>
  )
}
