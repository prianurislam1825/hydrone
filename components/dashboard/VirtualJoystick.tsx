'use client'

import { useCallback, useRef, useState } from 'react';

export interface JoystickVector { x: number; y: number }

interface Props {
  label:       string
  size?:       number
  onChange?:   (v: JoystickVector) => void
  accentColor?: string
}

export default function VirtualJoystick({ label, size = 100, onChange, accentColor = '#00B4D8' }: Props) {
  const zoneRef    = useRef<HTMLDivElement>(null)
  const activePtr  = useRef<number | null>(null)
  const [pos, setPos]     = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const radius = size / 2
  const maxR   = radius * 0.62
  const kSize  = size * 0.34

  function clampCircle(dx: number, dy: number) {
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist <= maxR) return { x: dx, y: dy }
    return { x: (dx / dist) * maxR, y: (dy / dist) * maxR }
  }

  function getOffset(clientX: number, clientY: number) {
    const el = zoneRef.current
    if (!el) return { x: 0, y: 0 }
    const r = el.getBoundingClientRect()
    return clampCircle(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2))
  }

  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePtr.current !== null) return
    e.preventDefault()
    e.stopPropagation()
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    activePtr.current = e.pointerId
    setActive(true)
    const p = getOffset(e.clientX, e.clientY)
    setPos(p)
    onChange?.({ x: p.x / maxR, y: p.y / maxR })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxR, onChange])

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePtr.current !== e.pointerId) return
    e.preventDefault()
    const p = getOffset(e.clientX, e.clientY)
    setPos(p)
    onChange?.({ x: p.x / maxR, y: p.y / maxR })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxR, onChange])

  const onUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePtr.current !== e.pointerId) return
    activePtr.current = null
    setActive(false)
    setPos({ x: 0, y: 0 })
    onChange?.({ x: 0, y: 0 })
  }, [onChange])

  const mag   = Math.sqrt(pos.x * pos.x + pos.y * pos.y) / maxR
  const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI)

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        ref={zoneRef}
        style={{
          width:       size, height: size,
          borderRadius: '50%',
          background:  `radial-gradient(circle, ${accentColor}0A 0%, transparent 70%)`,
          border:      `1.5px solid ${accentColor}${active ? '55' : '22'}`,
          boxShadow:   active ? `0 0 18px ${accentColor}22` : 'none',
          position:    'relative',
          cursor:      active ? 'grabbing' : 'grab',
          touchAction: 'none',   /* ← critical: prevents browser scroll taking over */
          userSelect:  'none',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-label={`${label} joystick`}
      >
        {/* Outer ring */}
        <div style={{ position:'absolute', inset:6, borderRadius:'50%', border:`1px solid ${accentColor}12` }} />
        {/* Inner ring */}
        <div style={{ position:'absolute', inset:'30%', borderRadius:'50%', border:`1px solid ${accentColor}18` }} />

        {/* Cross lines */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{ position:'absolute', width:1, height:size*0.6, background:accentColor, opacity:0.12, borderRadius:1 }} />
          <div style={{ position:'absolute', height:1, width:size*0.6, background:accentColor, opacity:0.12, borderRadius:1 }} />
        </div>

        {/* Direction glow when active */}
        {active && mag > 0.1 && (
          <div style={{
            position:'absolute', width:size*0.45, height:size*0.45,
            top:'50%', left:'50%',
            transform:`translate(-50%,-50%) rotate(${angle}deg) translateX(${mag*size*0.18}px)`,
            background:`radial-gradient(circle, ${accentColor}28, transparent 70%)`,
            pointerEvents:'none',
          }} />
        )}

        {/* Knob */}
        <div style={{
          position:  'absolute',
          width:     kSize, height: kSize,
          borderRadius: '50%',
          top:       `calc(50% + ${pos.y}px)`,
          left:      `calc(50% + ${pos.x}px)`,
          transform: 'translate(-50%, -50%)',
          background: active
            ? `radial-gradient(circle at 35% 35%, ${accentColor}, ${accentColor}88)`
            : `radial-gradient(circle at 35% 35%, ${accentColor}cc, ${accentColor}55)`,
          boxShadow: active
            ? `0 0 16px ${accentColor}88, 0 0 32px ${accentColor}44`
            : `0 0 8px ${accentColor}44`,
          transition: active ? 'none' : 'top 0.12s ease, left 0.12s ease',
          pointerEvents: 'none',
        }} />

        {/* Center dot */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:6, height:6, borderRadius:'50%',
          background:`${accentColor}40`,
          border:`1px solid ${accentColor}30`,
          pointerEvents:'none',
        }} />
      </div>

      <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.2em', textTransform:'uppercase', color: active ? accentColor : 'rgba(139,158,199,0.5)', transition:'color 0.2s' }}>
        {label}
      </span>
    </div>
  )
}
