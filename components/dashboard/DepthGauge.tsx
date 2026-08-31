'use client'

import { Waves } from 'lucide-react'

interface DepthGaugeProps {
  depth:     number
  maxDepth?: number
}

export default function DepthGauge({ depth, maxDepth = 10 }: DepthGaugeProps) {
  const pct      = Math.min((depth / maxDepth) * 100, 100)
  const barColor = depth <= 5 ? '#1A56DB' : depth <= 8 ? '#F59E0B' : '#EF4444'

  return (
    <div role="region" aria-label="Depth gauge" className="flex flex-col gap-3 rounded-xl p-4 sm:p-5 transition-all border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(26,86,219,0.5)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--t-border)')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves size={14} className="text-[#1A56DB]" />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Depth</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--t-muted)' }}>0 – {maxDepth} m</span>
      </div>

      <div className="flex items-end gap-2">
        <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold leading-none tabular-nums" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--t-text)' }} aria-live="polite">
          {depth.toFixed(1)}
        </span>
        <span className="text-xs mb-1 font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)' }}>m</span>
      </div>

      <div className="relative flex gap-3 items-stretch h-24">
        <div className="relative w-8 rounded-lg overflow-hidden border shrink-0" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
          <div className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-1000 ease-in-out" style={{ height: `${pct}%`, background: `linear-gradient(to top, ${barColor}cc, ${barColor}44)`, boxShadow: `0 0 8px ${barColor}66` }} />
          <div className="absolute left-0 right-0 h-1 rounded-full opacity-70 transition-all duration-1000" style={{ bottom: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}` }} />
        </div>
        <div className="flex flex-col justify-between text-[10px] font-[family-name:var(--font-jetbrains-mono)] py-0.5 leading-none" style={{ color: 'var(--t-muted)' }}>
          <span>0 m</span>
          <span className="opacity-60">{(maxDepth * 0.25).toFixed(0)} m</span>
          <span className="opacity-60">{(maxDepth * 0.5).toFixed(0)} m</span>
          <span className="opacity-60">{(maxDepth * 0.75).toFixed(0)} m</span>
          <span>{maxDepth} m</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: barColor, boxShadow: `0 0 6px ${barColor}88` }} />
        <span className="text-xs" style={{ color: 'var(--t-muted)' }}>
          {depth <= 3 ? 'Shallow' : depth <= 7 ? 'Mid depth' : 'Deep zone'}
        </span>
      </div>
    </div>
  )
}
