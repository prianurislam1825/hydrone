'use client'

import { Activity, Gauge, Layers, Navigation } from 'lucide-react'

interface RovStatusPanelProps {
  depth:   number
  heading: number
}

function compassLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8]
}

export default function RovStatusPanel({ depth, heading }: RovStatusPanelProps) {
  const hdg = ((heading % 360) + 360) % 360

  return (
    <div role="region" aria-label="ROV status panel" className="flex flex-col gap-0 rounded-xl overflow-hidden border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b" style={{ borderColor: 'var(--t-border)' }}>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#1A56DB]" />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>ROV Status</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#22C55E]/15 text-[#22C55E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
          ACTIVE
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--t-border)' }}>
        {/* Status */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5" style={{ color: 'var(--t-muted)' }}><Activity size={14} /><span className="text-sm">Status</span></div>
          <span className="text-sm font-semibold text-[#22C55E]">ACTIVE</span>
        </div>
        {/* Mode */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5" style={{ color: 'var(--t-muted)' }}><Layers size={14} /><span className="text-sm">Mode</span></div>
          <span className="text-sm font-semibold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>COLLECTION</span>
        </div>
        {/* Depth */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5" style={{ color: 'var(--t-muted)' }}><Gauge size={14} /><span className="text-sm">Depth</span></div>
          <span className="text-sm font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }} aria-live="polite">{depth.toFixed(1)} m</span>
        </div>
        {/* Heading */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5" style={{ color: 'var(--t-muted)' }}><Navigation size={14} /><span className="text-sm">Heading</span></div>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--t-border)" strokeWidth="1.5" />
              <line x1="10" y1="10" x2={10 + 7 * Math.sin((hdg * Math.PI) / 180)} y2={10 - 7 * Math.cos((hdg * Math.PI) / 180)} stroke="#F05A22" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="10" cy="10" r="1.5" fill="var(--t-text)" />
            </svg>
            <span className="text-sm font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }} aria-live="polite">
              {String(Math.round(hdg)).padStart(3, '0')}° <span className="text-xs" style={{ color: 'var(--t-muted)' }}>{compassLabel(hdg)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
