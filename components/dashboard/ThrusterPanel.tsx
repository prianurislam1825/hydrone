'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

interface Thruster {
  id:    string
  label: string
  sub:   string
  base:  number
  color: string
}

const THRUSTERS: Thruster[] = [
  { id: 'hl', label: 'H-Left',  sub: 'CW',  base: 78, color: '#1A56DB' },
  { id: 'hr', label: 'H-Right', sub: 'CCW', base: 78, color: '#1A56DB' },
  { id: 'vl', label: 'V-Left',  sub: 'PORT',base: 60, color: '#F05A22' },
  { id: 'vr', label: 'V-Right', sub: 'STB', base: 60, color: '#F05A22' },
]

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

interface ThrusterBarProps {
  thruster: Thruster
  power:    number
}

function ThrusterBar({ thruster, power }: ThrusterBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Labels */}
      <div className="w-24 shrink-0">
        <div className="text-xs font-semibold text-[#F8FAFF]">{thruster.label}</div>
        <div className="text-[10px] text-[#8B9EC7]">{thruster.sub}</div>
      </div>

      {/* Bar track */}
      <div className="flex-1 h-2.5 rounded-full bg-[#0D1B3E] border border-[#1E2D50] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width:      `${power}%`,
            background: `linear-gradient(to right, ${thruster.color}88, ${thruster.color})`,
            boxShadow:  `0 0 8px ${thruster.color}66`,
          }}
        />
      </div>

      {/* Value */}
      <span
        className="w-10 text-right text-xs font-bold font-[family-name:var(--font-jetbrains-mono)] text-[#F8FAFF] tabular-nums shrink-0"
        aria-live="polite"
      >
        {Math.round(power)}%
      </span>
    </div>
  )
}

export default function ThrusterPanel() {
  const [powers, setPowers] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    THRUSTERS.forEach(t => { m[t.id] = t.base })
    return m
  })

  // Gently animate thruster power to simulate active use
  useEffect(() => {
    const interval = setInterval(() => {
      setPowers(prev => {
        const next = { ...prev }
        THRUSTERS.forEach(t => {
          const delta = (Math.random() - 0.5) * 8
          next[t.id]  = clamp(prev[t.id] + delta, t.base - 15, t.base + 15)
        })
        return next
      })
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      role="region"
      aria-label="Thruster status"
      className="flex flex-col gap-0 rounded-xl bg-[#111827] border border-[#1E2D50] overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b border-[#1E2D50]">
        <Zap size={14} className="text-[#F05A22]" />
        <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">Thruster Status</span>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3.5 px-4 sm:px-5 py-4">
        {THRUSTERS.map(t => (
          <ThrusterBar key={t.id} thruster={t} power={powers[t.id]} />
        ))}
      </div>
    </div>
  )
}
