'use client'

import { useCallback, useRef, useState } from 'react';

export interface JoystickVector { x: number; y: number }

interface VirtualJoystickProps {
  label:        string
  size?:        number
  onChange?:    (v: JoystickVector) => void
  accentColor?: string
}

export default function VirtualJoystick({
  label,
  size       = 100,
  onChange,
  accentColor = '#00B4D8',
}: VirtualJoystickProps) {
  const zoneRef    = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<number | null>(null)   // tracks which pointer owns this joystick
  const [pos, setPos]     = useState<JoystickVector>({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const radius  = size / 2
  const maxR    = radius * 0.62
  const knobSize = size * 0.34

  const clamp = (dx: number, dy: number): JoystickVector => {
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist <= maxR) return { x: dx, y: dy }
    return { x: (dx / dist) * maxR, y: (dy / dist) * maxR }
  }

  const getOffset = (clientX: number, clientY: number): JoystickVector => {
    const zone = zoneRef.current
    if (!zone) return { x: 0, y: 0 }
    const rect = zone.getBoundingClientRect()
    return clamp(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2))
  }

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only claim if not already owned by another pointer
    if (pointerRef.current !== null) return
    e.currentTarget.setPointerCapture(e.pointerId)   // capture to this element
    pointerRef.current = e.pointerId
    setActive(true)
    const p = getOffset(e.clientX, e.clientY)
    setPos(p)
    onChange?.({ x: p.x / maxR, y: p.y / maxR })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxR])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== e.pointerId) return
    const p = getOffset(e.clientX, e.clientY)
    setPos(p)
    onChange?.({ x: p.x / maxR, y: p.y / maxR })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxR])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== e.pointerId) return
    pointerRef.current = null
    setActive(false)
    setPos({ x: 0, y: 0 })
    onChange?.({ x: 0, y: 0 })
  }, [onChange])

  const mag   = Math.sqrt(pos.x * pos.x + pos.y * pos.y) / maxR
  const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI)

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        ref={zoneRef}
        className="relative rounded-full cursor-grab active:cursor-grabbing"
        style={{
          width:       size,
          height:      size,
          background:  `radial-gradient(circle at 50% 50%, ${accentColor}08 0%, ${accentColor}04 60%, transparent 100%)`,
          border:      `1.5px solid ${accentColor}${active ? '55' : '22'}`,
          boxShadow:   active ? `0 0 20px ${accentColor}22, inset 0 0 20px ${accentColor}05` : 'none',
          transition:  'border-color 0.2s, box-shadow 0.2s',
          touchAction: 'none',   // critical — prevents scroll interfering
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label={`${label} joystick`}
        role="slider"
        aria-valuenow={0}
        aria-valuemin={-1}
        aria-valuemax={1}
      >
        {/* Outer ring */}
        <div className="absolute inset-2 rounded-full" style={{ border: `1px solid ${accentColor}12` }} />
        {/* Inner ring */}
        <div className="absolute inset-[30%] rounded-full" style={{ border: `1px solid ${accentColor}18` }} />

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-px rounded-full opacity-15" style={{ height: size * 0.65, background: accentColor }} />
          <div className="absolute h-px rounded-full opacity-15" style={{ width:  size * 0.65, background: accentColor }} />
        </div>

        {/* Direction glow */}
        {active && mag > 0.1 && (
          <div className="absolute rounded-full pointer-events-none"
            style={{
              width:     size * 0.5, height: size * 0.5,
              top: '50%', left: '50%',
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${mag * size * 0.18}px)`,
              background: `radial-gradient(circle, ${accentColor}30, transparent 70%)`,
            }}
          />
        )}

        {/* Knob */}
        <div className="absolute rounded-full pointer-events-none"
          style={{
            width:     knobSize, height: knobSize,
            top:       `calc(50% + ${pos.y}px)`,
            left:      `calc(50% + ${pos.x}px)`,
            transform: 'translate(-50%, -50%)',
            background: active
              ? `radial-gradient(circle at 35% 35%, ${accentColor}, ${accentColor}88)`
              : `radial-gradient(circle at 35% 35%, ${accentColor}cc, ${accentColor}55)`,
            boxShadow: active
              ? `0 0 16px ${accentColor}90, 0 0 32px ${accentColor}40, inset 0 1px 2px rgba(255,255,255,0.3)`
              : `0 0 8px  ${accentColor}50, inset 0 1px 2px rgba(255,255,255,0.2)`,
            transition: active ? 'none' : 'top 0.15s ease, left 0.15s ease',
          }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ background: `${accentColor}40`, border: `1px solid ${accentColor}30` }} />
      </div>

      <span className="text-[10px] font-black tracking-[0.2em] uppercase"
        style={{ color: active ? accentColor : 'rgba(139,158,199,0.5)', transition: 'color 0.2s' }}>
        {label}
      </span>
    </div>
  )
}
