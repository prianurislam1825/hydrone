'use client'

import { Waves } from 'lucide-react'

interface DepthGaugeProps {
  depth:    number   // current depth in metres
  maxDepth?: number  // scale max (default 10m)
}

export default function DepthGauge({ depth, maxDepth = 10 }: DepthGaugeProps) {
  const pct      = Math.min((depth / maxDepth) * 100, 100)
  const barColor = depth <= 5 ? '#1A56DB' : depth <= 8 ? '#F59E0B' : '#EF4444'

  return (
    <div
      role="region"
      aria-label="Depth gauge"
      className="flex flex-col gap-3 rounded-xl p-4 sm:p-5 bg-[#111827] border border-[#1E2D50] hover:border-[#1A56DB]/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves size={14} className="text-[#1A56DB]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">Depth</span>
        </div>
        <span className="text-xs text-[#8B9EC7]">0 – {maxDepth} m</span>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span
          className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-[#F8FAFF] leading-none tabular-nums"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          aria-live="polite"
        >
          {depth.toFixed(1)}
        </span>
        <span className="text-xs text-[#8B9EC7] mb-1 font-[family-name:var(--font-jetbrains-mono)]">m</span>
      </div>

      {/* Vertical depth bar — simulates water column */}
      <div className="relative flex gap-3 items-stretch h-24">
        {/* Column track */}
        <div className="relative w-8 rounded-lg overflow-hidden bg-[#0D1B3E] border border-[#1E2D50] shrink-0">
          {/* Water fill — grows from bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-1000 ease-in-out"
            style={{
              height:     `${pct}%`,
              background: `linear-gradient(to top, ${barColor}cc, ${barColor}44)`,
              boxShadow:  `0 0 8px ${barColor}66`,
            }}
          />
          {/* Surface shimmer */}
          <div
            className="absolute left-0 right-0 h-1 rounded-full opacity-70 transition-all duration-1000"
            style={{
              bottom:     `${pct}%`,
              background: barColor,
              boxShadow:  `0 0 6px ${barColor}`,
            }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex flex-col justify-between text-[10px] text-[#8B9EC7] font-[family-name:var(--font-jetbrains-mono)] py-0.5 leading-none">
          <span>0 m</span>
          <span className="opacity-60">{(maxDepth * 0.25).toFixed(0)} m</span>
          <span className="opacity-60">{(maxDepth * 0.5).toFixed(0)} m</span>
          <span className="opacity-60">{(maxDepth * 0.75).toFixed(0)} m</span>
          <span>{maxDepth} m</span>
        </div>
      </div>

      {/* Depth zone label */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: barColor, boxShadow: `0 0 6px ${barColor}88` }}
        />
        <span className="text-xs text-[#8B9EC7]">
          {depth <= 3 ? 'Shallow' : depth <= 7 ? 'Mid depth' : 'Deep zone'}
        </span>
      </div>
    </div>
  )
}
