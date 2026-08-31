'use client'

import { useEffect, useState } from 'react'

interface DepthChartProps {
  depth:   number
  tick:    number
  maxPts?: number
}

const MAX_DEPTH = 10
const MAX_PTS   = 40

export default function DepthChart({ depth, tick, maxPts = MAX_PTS }: DepthChartProps) {
  const [history, setHistory] = useState<number[]>(() => Array(maxPts).fill(0))

  useEffect(() => {
    setHistory(prev => [...prev.slice(1), depth])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const W = 400
  const H = 100
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W
    const y = (v / MAX_DEPTH) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const areaPoints = `0,${H} ${pts} ${W},${H}`
  const depthColor = depth <= 3 ? '#1A56DB' : depth <= 7 ? '#F59E0B' : '#EF4444'

  return (
    <div
      className="rounded-xl p-4 border flex flex-col gap-3"
      style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>
          Kedalaman
        </span>
        <div className="flex items-center gap-2">
          <span
            className="font-bold font-[family-name:var(--font-jetbrains-mono)] text-xl tabular-nums"
            style={{ color: depthColor }}
            aria-live="polite"
          >
            {depth.toFixed(1)}
          </span>
          <span className="text-xs" style={{ color: 'var(--t-muted)' }}>m</span>
        </div>
      </div>

      {/* Y-axis labels + chart */}
      <div className="flex gap-2 items-end">
        {/* Y labels */}
        <div className="flex flex-col justify-between text-[9px] font-[family-name:var(--font-jetbrains-mono)] shrink-0" style={{ height: H, color: 'var(--t-muted)' }}>
          <span>0</span>
          <span>{MAX_DEPTH / 2}</span>
          <span>{MAX_DEPTH}</span>
        </div>

        {/* SVG chart — Y grows downward = depth increases downward (natural) */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: H }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="depth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={depthColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={depthColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((r, i) => (
            <line
              key={i}
              x1="0" y1={H * r} x2={W} y2={H * r}
              stroke="var(--t-border)" strokeWidth="0.5" strokeDasharray="4,4"
            />
          ))}
          {/* Area */}
          <polygon points={areaPoints} fill="url(#depth-fill)" />
          {/* Line */}
          <polyline
            points={pts}
            fill="none"
            stroke={depthColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Current point */}
          {history.length > 0 && (() => {
            const li = history.length - 1
            const lx = (li / (history.length - 1)) * W
            const ly = (history[li] / MAX_DEPTH) * H
            return <circle cx={lx} cy={ly} r="3" fill={depthColor} />
          })()}
        </svg>
      </div>

      {/* X-axis label */}
      <div className="flex justify-between text-[9px]" style={{ color: 'var(--t-muted)' }}>
        <span>−{((maxPts * 2.5) / 60).toFixed(0)}m lalu</span>
        <span>Sekarang</span>
      </div>
    </div>
  )
}
