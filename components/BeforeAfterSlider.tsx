'use client'
import { useRef, useState } from 'react'

interface Props {
  beforeLabel?: string
  afterLabel?: string
  beforeContent: React.ReactNode
  afterContent: React.ReactNode
  height?: string
}

export default function BeforeAfterSlider({
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeContent,
  afterContent,
  height = '360px',
}: Props) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const getPos = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 50
    return Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    e.preventDefault()
    const move = (ev: MouseEvent) => { if (dragging.current) setPos(getPos(ev.clientX)) }
    const up = () => { dragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setPos(getPos(e.touches[0].clientX))
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-[20px] overflow-hidden select-none"
      style={{ height }}
      onTouchMove={onTouchMove}
    >
      {/* Before layer */}
      <div className="absolute inset-0">{beforeContent}</div>

      {/* After layer — clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {afterContent}
        <div style={{ position: 'absolute', inset: 0, width: '100vw' }}>{afterContent}</div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[0.72rem] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full z-10">
        {beforeLabel}
      </div>
      <div
        className="absolute top-4 text-[0.72rem] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full z-10"
        style={{ background: 'var(--gold)', color: 'var(--obsidian)', left: `calc(${pos}% - 60px)`, opacity: pos > 15 ? 1 : 0, transition: 'opacity 0.2s' }}
      >
        {afterLabel}
      </div>

      {/* Handle */}
      <div
        className="ba-handle"
        style={{ left: `${pos}%` }}
        onMouseDown={onMouseDown}
      >
        <div className="ba-knob">⇔</div>
      </div>
    </div>
  )
}
