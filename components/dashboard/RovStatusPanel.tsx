'use client'

import { Navigation, Layers, Gauge, Activity } from 'lucide-react'

interface RovStatusPanelProps {
  depth:    number
  heading:  number
}

// Compass label from heading degrees
function compassLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8]
}

export default function RovStatusPanel({ depth, heading }: RovStatusPanelProps) {
  const hdg = ((heading % 360) + 360) % 360

  return (
    <div
      role="region"
      aria-label="ROV status panel"
      className="flex flex-col gap-0 rounded-xl bg-[#111827] border border-[#1E2D50] overflow-hidden"
    >
      {/* ── Title bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#1E2D50]">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#1A56DB]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">ROV Status</span>
        </div>
        {/* Active pill */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#22C55E]/15 text-[#22C55E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
          ACTIVE
        </span>
      </div>

      {/* ── Rows ──────────────────────────────────────── */}
      <div className="divide-y divide-[#1E2D50]">

        {/* Status */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5 text-[#8B9EC7]">
            <Activity size={14} />
            <span className="text-sm">Status</span>
          </div>
          <span className="text-sm font-semibold text-[#22C55E]">ACTIVE</span>
        </div>

        {/* Mode */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5 text-[#8B9EC7]">
            <Layers size={14} />
            <span className="text-sm">Mode</span>
          </div>
          <span className="text-sm font-semibold text-[#F8FAFF] font-[family-name:var(--font-jetbrains-mono)]">
            COLLECTION
          </span>
        </div>

        {/* Depth */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5 text-[#8B9EC7]">
            <Gauge size={14} />
            <span className="text-sm">Depth</span>
          </div>
          <span
            className="text-sm font-bold text-[#F8FAFF] font-[family-name:var(--font-jetbrains-mono)]"
            aria-live="polite"
          >
            {depth.toFixed(1)} m
          </span>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5 text-[#8B9EC7]">
            <Navigation size={14} />
            <span className="text-sm">Heading</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini compass arc */}
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#1E2D50" strokeWidth="1.5" />
              <line
                x1="10" y1="10"
                x2={10 + 7 * Math.sin((hdg * Math.PI) / 180)}
                y2={10 - 7 * Math.cos((hdg * Math.PI) / 180)}
                stroke="#F05A22"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="10" cy="10" r="1.5" fill="#F8FAFF" />
            </svg>
            <span
              className="text-sm font-bold text-[#F8FAFF] font-[family-name:var(--font-jetbrains-mono)]"
              aria-live="polite"
            >
              {String(Math.round(hdg)).padStart(3, '0')}°{' '}
              <span className="text-[#8B9EC7] text-xs">{compassLabel(hdg)}</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
