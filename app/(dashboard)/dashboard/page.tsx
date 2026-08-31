'use client'

import DepthChart from '@/components/dashboard/DepthChart'
import { BATTERY_A, BATTERY_B, SENSOR_CONFIGS, getSensorStatus, useSensorData } from '@/lib/dashboard/useSensorData'
import { Anchor, Filter, RefreshCw, Wifi } from 'lucide-react'
import { useState } from 'react'

// ── Compact sensor card (SteriFlow style) ────────────────────────────
function SensorCard({
  label, value, unit, status, color, sparkMin, sparkMax, history,
}: {
  label: string; value: string; unit: string
  status: 'normal' | 'warning' | 'danger'
  color: string; sparkMin: number; sparkMax: number; history: number[]
}) {
  const statusLabel = status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Out of Range'
  const W = 120; const H = 28
  const range = sparkMax - sparkMin || 1
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W
    const y = H - ((v - sparkMin) / range) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-1.5 border transition-all"
      style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>{label}</span>
      <div className="flex items-end gap-1">
        <span className="font-bold tabular-nums font-[family-name:var(--font-jetbrains-mono)]"
          style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', color }}
          aria-live="polite"
        >{value}</span>
        <span className="text-xs mb-1 font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)' }}>{unit}</span>
      </div>
      {/* Mini sparkline */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 28 }} aria-hidden>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </svg>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
          background: status === 'normal' ? '#22C55E' : status === 'warning' ? '#F59E0B' : '#EF4444'
        }} />
        <span className="text-[10px] font-semibold" style={{
          color: status === 'normal' ? '#22C55E' : status === 'warning' ? '#F59E0B' : '#EF4444'
        }}>{statusLabel}</span>
      </div>
    </div>
  )
}

// ── Battery bar ───────────────────────────────────────────────────────
function BatteryRow({ label, pct, voltage }: { label: string; pct: number; voltage: string }) {
  const color = pct > 50 ? '#22C55E' : pct > 20 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium w-16 shrink-0" style={{ color: 'var(--t-muted)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--t-bg)', border: '1px solid var(--t-border)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}88, ${color})` }} />
      </div>
      <span className="text-xs font-bold font-[family-name:var(--font-jetbrains-mono)] w-10 text-right tabular-nums shrink-0" style={{ color }}>{pct}%</span>
      <span className="text-[10px] w-12 shrink-0" style={{ color: 'var(--t-muted)' }}>{voltage}</span>
    </div>
  )
}

// ── Toggle pill ───────────────────────────────────────────────────────
function TogglePill({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <span className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>{label}</span>
      <button
        onClick={onToggle}
        aria-pressed={active}
        className="relative w-11 rounded-full border transition-all duration-300 shrink-0"
        style={{ height: 24, background: active ? '#1A56DB' : 'var(--t-bg)', borderColor: active ? '#1A56DB' : 'var(--t-border)' }}
      >
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300" style={{ left: active ? 20 : 2 }} />
      </button>
    </div>
  )
}

// ── Sensor colors by key ──────────────────────────────────────────────
const SENSOR_COLORS: Record<string, string> = {
  ph: '#1A56DB', tds: '#F59E0B', turbidity: '#F05A22', temperature: '#22C55E',
}

export default function DashboardPage() {
  const { values, history, depth, heading, tick } = useSensorData()
  const [netOpen,   setNetOpen]   = useState(false)
  const [filterOn,  setFilterOn]  = useState(true)
  const now = new Date()

  return (
    <div className="min-h-full" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">

        {/* ── Header card ──────────────────────────────────────── */}
        <div className="rounded-2xl p-4 border flex items-center justify-between" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
          <div>
            <div className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Hydrone ROV</div>
            <div className="text-xs" style={{ color: 'var(--t-muted)' }}>
              {now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#22C55E' }}>
              <Wifi size={11} />
              TETHERED
            </div>
            <button className="p-2 rounded-xl border transition-all hover:opacity-80" style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* ── ROV Status card ───────────────────────────────────── */}
        <div className="rounded-2xl p-4 border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Status ROV</span>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--t-muted)' }}>Koleksi</span>
          </div>
          <div className="flex items-center justify-between">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm border" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#22C55E' }}>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
              AKTIF
            </div>
            {/* Heading mini compass */}
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
                <circle cx="14" cy="14" r="12" fill="none" stroke="var(--t-border)" strokeWidth="1.5"/>
                <line x1="14" y1="14"
                  x2={14 + 10 * Math.sin((heading * Math.PI) / 180)}
                  y2={14 - 10 * Math.cos((heading * Math.PI) / 180)}
                  stroke="#F05A22" strokeWidth="2" strokeLinecap="round"
                />
                <circle cx="14" cy="14" r="2" fill="var(--t-text)" />
              </svg>
              <div>
                <div className="text-xs font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>
                  {String(Math.round(heading)).padStart(3,'0')}°
                </div>
                <div className="text-[10px]" style={{ color: 'var(--t-muted)' }}>Heading</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sensor tiles 2×2 ──────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Sensor Realtime</span>
            <span className="live-badge text-[10px]"><span className="live-dot" style={{ width: 6, height: 6 }} />LIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SENSOR_CONFIGS.map(cfg => (
              <SensorCard
                key={cfg.key}
                label={cfg.label}
                value={cfg.decimals === 0 ? Math.round(values[cfg.key as keyof typeof values]).toString() : values[cfg.key as keyof typeof values].toFixed(cfg.decimals)}
                unit={cfg.unit}
                status={getSensorStatus(values[cfg.key as keyof typeof values], cfg)}
                color={SENSOR_COLORS[cfg.key] ?? '#1A56DB'}
                sparkMin={cfg.min}
                sparkMax={cfg.max}
                history={history[cfg.key as keyof typeof history]}
              />
            ))}
          </div>
        </div>

        {/* ── Depth chart ───────────────────────────────────────── */}
        <DepthChart depth={depth} tick={tick} />

        {/* ── Battery ───────────────────────────────────────────── */}
        <div className="rounded-2xl p-4 border flex flex-col gap-3" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Baterai</span>
          <BatteryRow label="Pack A" pct={BATTERY_A} voltage="14.8 V" />
          <BatteryRow label="Pack B" pct={BATTERY_B} voltage="11.1 V" />
        </div>

        {/* ── Net & Filter toggles ──────────────────────────────── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--t-muted)' }}>Sistem</span>
          <div className="flex flex-col gap-2">
            <TogglePill label="Jaring (Net)" active={netOpen}  onToggle={() => setNetOpen(v => !v)} />
            <TogglePill label="Filter Aktif" active={filterOn} onToggle={() => setFilterOn(v => !v)} />
          </div>
        </div>

        {/* ── Net / Filter status bar ───────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 border flex items-center gap-2" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <Anchor size={14} style={{ color: 'var(--t-muted)' }} />
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>Jaring</div>
              <div className="text-xs font-bold" style={{ color: netOpen ? '#22C55E' : 'var(--t-muted)' }}>{netOpen ? 'TERBUKA' : 'TERTUTUP'}</div>
            </div>
          </div>
          <div className="rounded-xl p-3 border flex items-center gap-2" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <Filter size={14} className="text-[#1A56DB]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>Filter</div>
              <div className="text-xs font-bold" style={{ color: filterOn ? '#1A56DB' : 'var(--t-muted)' }}>{filterOn ? 'AKTIF' : 'NONAKTIF'}</div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] pb-2 font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.5 }}>
          Hydrone · IID INNOPA 2026 · Mock Telemetry
        </p>
      </div>
    </div>
  )
}
