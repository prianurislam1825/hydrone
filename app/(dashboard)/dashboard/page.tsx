'use client'

import DepthChart from '@/components/dashboard/DepthChart'
import { BATTERY_A, BATTERY_B, SENSOR_CONFIGS, useSensorData } from '@/lib/dashboard/useSensorData'
import { useLang } from '@/lib/i18n/context'
import {
  Activity,
  AlertTriangle,
  Anchor,
  BatteryMedium,
  CheckCircle2,
  Droplets,
  Filter,
  Layers,
  RefreshCw,
  Thermometer, Wind,
} from 'lucide-react'
import { useCallback, useState } from 'react'

/* ─── Sensor config for the 5 top cards ─── */
const TOP_CARDS = [
  {
    key:      'ph',
    label:    'pH',
    unit:     'pH',
    icon:     <Droplets    size={20} />,
    color:    '#1A56DB',
    normalMin: 6.5, normalMax: 8.5,
    ranges:   { ok: '6.5–8.5', warn: '5.0–6.5 / 8.5–9.0', danger: '<5.0 / >9.0' },
  },
  {
    key:      'tds',
    label:    'TDS',
    unit:     'ppm',
    icon:     <Layers      size={20} />,
    color:    '#F59E0B',
    normalMin: 0, normalMax: 500,
    ranges:   { ok: '<500 ppm', warn: '500–1000 ppm', danger: '>1000 ppm' },
  },
  {
    key:      'turbidity',
    label:    'Kekeruhan',
    unit:     'NTU',
    icon:     <Wind        size={20} />,
    color:    '#F05A22',
    normalMin: 0, normalMax: 50,
    ranges:   { ok: '<50 NTU', warn: '50–100 NTU', danger: '>100 NTU' },
  },
  {
    key:      'temperature',
    label:    'Suhu',
    unit:     '°C',
    icon:     <Thermometer size={20} />,
    color:    '#22C55E',
    normalMin: 20, normalMax: 32,
    ranges:   { ok: '20–32°C', warn: '15–20 / 32–38°C', danger: '<15 / >38°C' },
  },
  {
    key:      '_depth',
    label:    'Kedalaman',
    unit:     'm',
    icon:     <Activity    size={20} />,
    color:    '#8B5CF6',
    normalMin: 0, normalMax: 10,
    ranges:   { ok: '0–10 m', warn: '—', danger: '>10 m' },
  },
]

/* ─── Status helpers ─── */
type Status = 'normal' | 'warning' | 'danger'

function getStatus(val: number, min: number, max: number): Status {
  if (val < min * 0.9 || val > max * 1.1) return 'danger'
  if (val < min       || val > max)       return 'warning'
  return 'normal'
}

const STATUS_COLOR: Record<Status, string> = {
  normal:  '#22C55E',
  warning: '#F59E0B',
  danger:  '#EF4444',
}
const STATUS_BG: Record<Status, string> = {
  normal:  'rgba(34,197,94,0.08)',
  warning: 'rgba(245,158,11,0.08)',
  danger:  'rgba(239,68,68,0.08)',
}
const STATUS_LABEL: Record<Status, { id: string; badge: string }> = {
  normal:  { id: 'Normal',   badge: 'Aman'      },
  warning: { id: 'Waspada',  badge: 'Meningkat' },
  danger:  { id: 'Bahaya',   badge: 'Tinggi'    },
}

/* ─── Sparkline ─── */
function Sparkline({ data, color, min, max }: { data: number[]; color: string; min: number; max: number }) {
  const W = 100; const H = 24
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 24 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Top sensor card ─── */
function SensorTopCard({ cfg, value, history, unit }: {
  cfg: typeof TOP_CARDS[0]; value: number; history: number[]; unit: string
}) {
  const status  = getStatus(value, cfg.normalMin, cfg.normalMax)
  const sColor  = STATUS_COLOR[status]
  const sBg     = STATUS_BG[status]
  const sLabel  = STATUS_LABEL[status]
  const display = cfg.key === 'tds' ? Math.round(value).toString()
    : cfg.key === '_depth' ? value.toFixed(1)
    : cfg.key === 'ph' ? value.toFixed(2)
    : value.toFixed(1)

  return (
    <div className="rounded-2xl p-4 border flex flex-col gap-2 min-w-0" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ color: cfg.color }}>{cfg.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{cfg.label}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sBg, color: sColor }}>
          {sLabel.badge}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1">
        <span className="font-extrabold tabular-nums leading-none" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: cfg.color }}>
          {display}
        </span>
        <span className="text-xs mb-1" style={{ color: 'var(--t-muted)' }}>{unit}</span>
      </div>

      {/* Sparkline */}
      {history.length > 1 && (
        <Sparkline data={history} color={cfg.color} min={cfg.normalMin * 0.8} max={cfg.normalMax * 1.2} />
      )}

      {/* Status + range */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sColor, boxShadow: `0 0 4px ${sColor}` }} />
          <span className="text-[10px] font-semibold" style={{ color: sColor }}>{sLabel.id}</span>
        </div>
        <span className="text-[10px]" style={{ color: 'var(--t-muted)' }}>Aman: {cfg.ranges.ok}</span>
      </div>
    </div>
  )
}

/* ─── Water quality card ─── */
function WaterQualityCard({ status, values }: { status: Status; values: Record<string,string> }) {
  const sColor = STATUS_COLOR[status]
  const sBg    = STATUS_BG[status]
  const Icon   = status === 'normal' ? CheckCircle2 : AlertTriangle

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--t-surface)', borderColor: sColor + '40' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>Kualitas Air</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: sBg }}>
          <Icon size={22} style={{ color: sColor }} />
        </div>
        <div>
          <div className="font-extrabold text-lg leading-tight" style={{ color: 'var(--t-text)' }}>
            {status === 'normal' ? 'Kondisi Aman' : status === 'warning' ? 'Kondisi Waspada' : 'Kondisi Bahaya'}
          </div>
          <div className="text-xs px-2.5 py-0.5 rounded-full inline-block mt-0.5 font-bold" style={{ background: sBg, color: sColor }}>
            ● {STATUS_LABEL[status].id.toUpperCase()}
          </div>
        </div>
      </div>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 pt-1">
        {Object.entries(values).map(([k, v]) => (
          <span key={k} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
            {k}: {v}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── System panel card ─── */
function SystemPanelCard({ netOpen, filterOn, onNetToggle, onFilterToggle }: {
  netOpen: boolean; filterOn: boolean; onNetToggle: () => void; onFilterToggle: () => void
}) {
  const Toggle = ({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--t-border)' }}>
      <span className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold" style={{ color: active ? '#22C55E' : '#EF4444' }}>
          {active ? 'AKTIF' : 'MATI'}
        </span>
        <button
          onClick={onToggle}
          className="relative rounded-full border transition-all duration-300"
          style={{ width: 40, height: 22, background: active ? '#22C55E' : 'var(--t-bg)', borderColor: active ? '#22C55E' : 'var(--t-border)' }}
        >
          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300" style={{ left: active ? 18 : 2 }} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-0" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--t-muted)' }}>Sistem Pengolahan</div>
      <Toggle label="Jaring (Net)" active={netOpen}  onToggle={onNetToggle} />
      <Toggle label="Filter Aktif" active={filterOn} onToggle={onFilterToggle} />
    </div>
  )
}

/* ─── Battery card ─── */
function BatteryCard() {
  const packs = [
    { label: 'Pack A · Propulsi',  pct: BATTERY_A, volt: '14.8V' },
    { label: 'Pack B · Elektronik', pct: BATTERY_B, volt: '11.1V' },
  ]
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>Baterai</span>
        <BatteryMedium size={14} style={{ color: 'var(--t-muted)' }} />
      </div>
      {packs.map(p => {
        const color = p.pct > 50 ? '#22C55E' : p.pct > 20 ? '#F59E0B' : '#EF4444'
        return (
          <div key={p.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--t-muted)' }}>{p.label}</span>
              <span className="text-sm font-extrabold" style={{ color }}>{p.pct}% <span className="text-[10px] font-normal" style={{ color: 'var(--t-muted)' }}>{p.volt}</span></span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--t-bg)', border: '1px solid var(--t-border)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: `linear-gradient(to right, ${color}88, ${color})` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Sensor chart card ─── */
function SensorChartCard({ histories }: {
  values?: Record<string, number>; histories: Record<string, number[]>; depth?: number
}) {
  const [active, setActive] = useState<string[]>(['ph', 'tds', 'turbidity', 'temperature'])
  const colors: Record<string,string> = { ph:'#1A56DB', tds:'#F59E0B', turbidity:'#F05A22', temperature:'#22C55E' }

  const toggle = (key: string) => setActive(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  )

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-4" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>Grafik Sensor</span>
        <div className="flex gap-2 flex-wrap">
          {SENSOR_CONFIGS.map(cfg => (
            <button
              key={cfg.key}
              onClick={() => toggle(cfg.key)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all"
              style={{
                background:   active.includes(cfg.key) ? colors[cfg.key] + '15' : 'transparent',
                borderColor:  active.includes(cfg.key) ? colors[cfg.key] + '50' : 'var(--t-border)',
                color:        active.includes(cfg.key) ? colors[cfg.key]         : 'var(--t-muted)',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: colors[cfg.key] }} />
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-line sparklines stacked */}
      <div className="relative" style={{ height: 120 }}>
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((r, i) => (
            <line key={i} x1="0" y1={120 * r} x2="400" y2={120 * r}
              stroke="var(--t-border)" strokeWidth="0.5" strokeDasharray="4,4" />
          ))}
          {SENSOR_CONFIGS.map(cfg => {
            if (!active.includes(cfg.key)) return null
            const hist = histories[cfg.key as keyof typeof histories] ?? []
            if (hist.length < 2) return null
            const range = cfg.max - cfg.min || 1
            const pts = hist.map((v, i) => {
              const x = (i / (hist.length - 1)) * 400
              const y = 120 - ((v - cfg.min) / range) * 120
              return `${x.toFixed(1)},${Math.max(2, Math.min(118, y)).toFixed(1)}`
            }).join(' ')
            return (
              <polyline key={cfg.key} points={pts} fill="none"
                stroke={colors[cfg.key]} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { color: '#22C55E', label: `Aman: pH 6.5–8.5` },
          { color: '#F59E0B', label: `Waspada: 5.0–6.5 / 8.5–9.0` },
          { color: '#EF4444', label: `Bahaya: <5.0 / >9.0` },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--t-muted)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══ Main page ══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { values, history, depth, tick } = useSensorData()
  const { lang } = useLang()
  const [netOpen,  setNetOpen]  = useState(false)
  const [filterOn, setFilterOn] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const now = new Date()

  const toggleNet    = useCallback(() => setNetOpen(v => !v),  [])
  const toggleFilter = useCallback(() => setFilterOn(v => !v), [])

  const T = {
    title:   { id: 'Hydrone Monitoring Dashboard',      en: 'Hydrone Monitoring Dashboard' },
    sub:     { id: 'Sistem Monitoring Kualitas Air',     en: 'Water Quality Monitoring System' },
    refresh: { id: 'Segarkan',  en: 'Refresh' },
    net:     { id: 'Jaring',    en: 'Net' },
    filter:  { id: 'Filter',    en: 'Filter' },
    open:    { id: 'TERBUKA',   en: 'OPEN' },
    closed:  { id: 'TERTUTUP',  en: 'CLOSED' },
    active:  { id: 'AKTIF',     en: 'ACTIVE' },
    off:     { id: 'NONAKTIF',  en: 'OFF' },
    temp:    { id: 'Suhu',      en: 'Temp' },
    depth:   { id: 'Kedalaman', en: 'Depth' },
    safe:    { id: 'Kondisi Aman',    en: 'Safe Condition' },
    warn:    { id: 'Kondisi Waspada', en: 'Caution' },
    danger:  { id: 'Kondisi Bahaya',  en: 'Danger' },
  }

  /* Overall water quality = worst of all sensors */
  const statuses = [
    getStatus(values.ph,          6.5, 8.5),
    getStatus(values.tds,         0,   500),
    getStatus(values.turbidity,   0,   50),
    getStatus(values.temperature, 20,  32),
  ]
  const overallStatus: Status = statuses.includes('danger') ? 'danger'
    : statuses.includes('warning') ? 'warning' : 'normal'

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-screen-2xl">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold leading-tight" style={{ color: 'var(--t-text)' }}>
            {T.title[lang]}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>
            {T.sub[lang]} · {now.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
          aria-label="Refresh"
        >
          <RefreshCw size={14} />
          {T.refresh[lang]}
        </button>
      </div>

      {/* ── 5 sensor top cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" key={refreshKey}>
        {TOP_CARDS.map(cfg => {
          const val  = cfg.key === '_depth' ? depth : values[cfg.key as keyof typeof values]
          const hist = cfg.key === '_depth' ? [] : history[cfg.key as keyof typeof history]
          return (
            <SensorTopCard key={cfg.key} cfg={cfg} value={val} history={hist} unit={cfg.unit} />
          )
        })}
      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Left: water quality + depth chart */}
        <div className="flex flex-col gap-4">
          <WaterQualityCard
            status={overallStatus}
            values={{
              'pH':         values.ph.toFixed(2),
              'TDS':        `${Math.round(values.tds)} ppm`,
              'Turbidity':  `${values.turbidity.toFixed(1)} NTU`,
              [T.temp[lang]]:    `${values.temperature.toFixed(1)}°C`,
              [T.depth[lang]]:   `${depth.toFixed(1)} m`,
            }}
          />
          <DepthChart depth={depth} tick={tick} />
        </div>

        {/* Right: system panel + battery */}
        <div className="flex flex-col gap-4">
          <SystemPanelCard
            netOpen={netOpen}   filterOn={filterOn}
            onNetToggle={toggleNet} onFilterToggle={toggleFilter}
          />
          <BatteryCard />

          {/* Net/filter status chips */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 border flex items-center gap-2" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <Anchor size={14} style={{ color: 'var(--t-muted)' }} />
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{T.net[lang]}</div>
                <div className="text-xs font-bold" style={{ color: netOpen ? '#22C55E' : 'var(--t-muted)' }}>
                  {netOpen ? T.open[lang] : T.closed[lang]}
                </div>
              </div>
            </div>
            <div className="rounded-xl p-3 border flex items-center gap-2" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <Filter size={14} className="text-[#1A56DB]" />
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>Filter</div>
                <div className="text-xs font-bold" style={{ color: filterOn ? '#1A56DB' : 'var(--t-muted)' }}>
                  {filterOn ? 'AKTIF' : 'NONAKTIF'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grafik Sensor ── */}
      <SensorChartCard histories={history} />

      {/* Footer */}
      <p className="text-center text-[10px] pb-2" style={{ color: 'var(--t-muted)', opacity: 0.45, fontFamily: 'var(--font-mono)' }}>
        Hydrone · IID INNOPA 2026 · Mock Telemetry
      </p>
    </div>
  )
}
