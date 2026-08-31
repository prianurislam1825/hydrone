'use client'

import { type SensorConfig, getSensorStatus } from '@/lib/dashboard/useSensorData'
import { Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SensorTileProps {
  config:  SensorConfig
  value:   number
  history: number[]
  tick:    number
}

function Sparkline({ data, min, max }: { data: number[]; min: number; max: number }) {
  const W = 200
  const H = 36
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const lastX = W.toString()
  const areaPoints = `0,${H} ${points} ${lastX},${H}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-9" aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1A56DB" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1A56DB" stopOpacity="0"    />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spark-fill)" />
      <polyline points={points} fill="none" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (() => {
        const lastIdx = data.length - 1
        const lx = (lastIdx / (data.length - 1)) * W
        const lv = data[lastIdx]
        const ly = H - ((lv - min) / range) * H
        return <circle cx={lx.toFixed(1)} cy={ly.toFixed(1)} r="2.5" fill="#1A56DB" />
      })()}
    </svg>
  )
}

const STATUS_COLORS = {
  normal:  { dot: '#22C55E', text: 'text-[#22C55E]', label: 'Normal' },
  warning: { dot: '#F59E0B', text: 'text-[#F59E0B]', label: 'Warning' },
  danger:  { dot: '#EF4444', text: 'text-[#EF4444]', label: 'Out of Range' },
}

export default function SensorTile({ config, value, history, tick }: SensorTileProps) {
  const [pulse, setPulse]     = useState(false)
  const [tooltip, setTooltip] = useState(false)
  const prevTick              = useRef(tick)

  const status  = getSensorStatus(value, config)
  const sc      = STATUS_COLORS[status]
  const display = config.decimals === 0 ? Math.round(value).toString() : value.toFixed(config.decimals)

  useEffect(() => {
    if (tick !== prevTick.current) {
      prevTick.current = tick
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 650)
      return () => clearTimeout(t)
    }
  }, [tick])

  return (
    <div
      role="region"
      aria-label={`${config.label} sensor reading`}
      className={`relative flex flex-col gap-2 rounded-xl p-4 sm:p-5 transition-all duration-300 overflow-hidden group ${pulse ? 'animate-tile-flash' : ''}`}
      style={{
        background:  'var(--t-surface)',
        border:      `1px solid ${pulse ? '#1A56DB' : 'var(--t-border)'}`,
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(26,86,219,0.5)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = pulse ? '#1A56DB' : 'var(--t-border)')}
    >
      {/* Radial glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(26,86,219,0.12) 0%, rgba(240,90,34,0.04) 60%, transparent 100%)' }} />
      {pulse && <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, var(--t-sensor-glow) 0%, transparent 70%)' }} />}

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>{config.label}</span>
        <div className="relative">
          <button
            onMouseEnter={() => setTooltip(true)} onFocus={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)} onBlur={() => setTooltip(false)}
            aria-label={`Info about ${config.label}`}
            className="transition-colors focus:outline-none"
            style={{ color: 'var(--t-border)' }}
            onMouseOver={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--t-muted)')}
            onMouseOut={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--t-border)')}
          >
            <Info size={14} />
          </button>
          {tooltip && (
            <div className="absolute right-0 top-6 z-10 w-44 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none border" style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
              Normal range: <span style={{ color: 'var(--t-text)' }}>{config.normalLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="relative flex items-end gap-2">
        <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold leading-none tabular-nums" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--t-text)' }} aria-live="polite">
          {display}
        </span>
        <span className="text-xs mb-1 font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)' }}>{config.unit}</span>
      </div>

      {/* Sparkline */}
      <div className="relative">
        <Sparkline data={history} min={config.min} max={config.max} />
      </div>

      {/* Status */}
      <div className="relative flex items-center gap-2 pt-0.5">
        <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sc.dot, boxShadow: `0 0 6px ${sc.dot}88` }} />
        <span className={`text-xs font-medium ${sc.text}`}>{sc.label}</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--t-muted)' }}>{config.normalLabel}</span>
      </div>
    </div>
  )
}
