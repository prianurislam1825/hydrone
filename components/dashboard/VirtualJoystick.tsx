'use client'

import { useCallback, useEffect, useRef, useState } from 'react';

export interface JoystickVector { x: number; y: number }

interface VirtualJoystickProps {
  label:    string
  size?:    number
  onChange?: (v: JoystickVector) => void
}

export default function VirtualJoystick({ label, size = 100, onChange }: VirtualJoystickProps) {
  const zoneRef  = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<JoystickVector>({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const activeRef = useRef(false)
  const radius    = size / 2
  const knobSize  = size * 0.36

  const clampCircle = (dx: number, dy: number, maxR: number): JoystickVector => {
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist <= maxR) return { x: dx, y: dy }
    return { x: (dx / dist) * maxR, y: (dy / dist) * maxR }
  }

  const getOffset = (clientX: number, clientY: number): JoystickVector => {
    const zone = zoneRef.current
    if (!zone) return { x: 0, y: 0 }
    const rect = zone.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    return clampCircle(clientX - cx, clientY - cy, radius * 0.65)
  }

  const start = useCallback((clientX: number, clientY: number) => {
    activeRef.current = true
    setActive(true)
    const p = getOffset(clientX, clientY)
    setPos(p)
    onChange?.({ x: p.x / (radius * 0.65), y: p.y / (radius * 0.65) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius])

  const move = useCallback((clientX: number, clientY: number) => {
    if (!activeRef.current) return
    const p = getOffset(clientX, clientY)
    setPos(p)
    onChange?.({ x: p.x / (radius * 0.65), y: p.y / (radius * 0.65) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius])

  const end = useCallback(() => {
    activeRef.current = false
    setActive(false)
    setPos({ x: 0, y: 0 })
    onChange?.({ x: 0, y: 0 })
  }, [onChange])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY)
    const onMouseUp   = () => end()
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY) }
    const onTouchEnd  = () => end()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)
    }
  }, [move, end])

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        ref={zoneRef}
        className="joystick-zone"
        style={{ width: size, height: size }}
        onMouseDown={e  => start(e.clientX, e.clientY)}
        onTouchStart={e => { e.preventDefault(); start(e.touches[0].clientX, e.touches[0].clientY) }}
        aria-label={`${label} joystick`}
        role="slider"
        aria-valuenow={0}
        aria-valuemin={-1}
        aria-valuemax={1}
      >
        {/* Crosshair rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full border border-[#1A56DB]/15" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
        {/* Center cross lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-px bg-[#1A56DB]/15" style={{ height: size * 0.7 }} />
          <div className="absolute h-px bg-[#1A56DB]/15" style={{ width: size * 0.7 }} />
        </div>
        {/* Knob */}
        <div
          className={`joystick-knob ${active ? 'active' : ''}`}
          style={{
            width:  knobSize,
            height: knobSize,
            left:   `calc(50% + ${pos.x}px)`,
            top:    `calc(50% + ${pos.y}px)`,
          }}
        />
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>
        {label}
      </span>
    </div>
  )
}
