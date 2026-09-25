'use client'

import DepthChart from '@/components/dashboard/DepthChart'
import { SENSOR_CONFIGS, useSensorData } from '@/lib/dashboard/useSensorData'
import { useLang } from '@/lib/i18n/context'
import {
  Activity,
  AlertTriangle,
  BatteryMedium,
  CheckCircle2,
  Droplets,
  Layers,
  RefreshCw,
  Thermometer,
  WifiOff,
  Wind,
} from 'lucide-react'
import { useCallback, useState } from 'react'

/* ─── Sensor config for the 5 top cards ─── */
const TOP_CARDS = [
  {
    key:      'ph',
    label:    { id: 'pH', en: 'pH' },
    unit:     'pH',
    icon:     <Droplets    size={20} />,
    color:    '#1A56DB',
    normalMin: 6.5, normalMax: 8.5,
    ranges:   { ok: '6.5–8.5', warn: '5.0–6.5 / 8.5–9.0', danger: '<5.0 / >9.0' },
  },
  {
    key:      'tds',
    label:    { id: 'TDS', en: 'TDS' },
    unit:     'ppm',
    icon:     <Layers      size={20} />,
    color:    '#F59E0B',
    normalMin: 0, normalMax: 500,
    ranges:   { ok: '<500 ppm', warn: '500–1000 ppm', danger: '>1000 ppm' },
  },
  {
    key:      'turbidity',
    label:    { id: 'Kekeruhan', en: 'Turbidity' },
    unit:     'NTU',
    icon:     <Wind        size={20} />,
    color:    '#F05A22',
    normalMin: 0, normalMax: 50,
    ranges:   { ok: '<50 NTU', warn: '50–100 NTU', danger: '>100 NTU' },
  },
  {
    key:      'temperature',
    label:    { id: 'Suhu', en: 'Temperature' },
    unit:     '°C',
    icon:     <Thermometer size={20} />,
    color:    '#22C55E',
    normalMin: 20, normalMax: 32,
    ranges:   { ok: '20–32°C', warn: '15–20 / 32–38°C', danger: '<15 / >38°C' },
  },
  {
    key:      '_depth',
    label:    { id: 'Kedalaman', en: 'Depth' },
    unit:     'm',
    icon:     <Activity    size={20} />,
    color:    '#8B5CF6',
    normalMin: 0, normalMax: 10,
    ranges:   { ok: '0–10 m', warn: '—', danger: '>10 m' },
  },
]

/* ─── Status helpers ─── */
type Status = 'normal' | 'warning' | 'danger' | 'offline'

function getStatus(val: number | null, min: number, max: number): Status {
  if (val === null) return 'offline'
  if (val < min * 0.9 || val > max * 1.1) return 'danger'
  if (val < min       || val > max)       return 'warning'
  return 'normal'
}

const STATUS_COLOR: Record<Status, string> = {
  normal:  '#22C55E',
  warning: '#F59E0B',
  danger:  '#EF4444',
  offline: '#6B7280',
}
const STATUS_BG: Record<Status, string> = {
  normal:  'rgba(34,197,94,0.08)',
  warning: 'rgba(245,158,11,0.08)',
  danger:  'rgba(239,68,68,0.08)',
  offline: 'rgba(107,114,128,0.08)',
}
const STATUS_LABEL: Record<Status, { id: { id: string; en: string }; badge: { id: string; en: string } }> = {
  normal:  { id: { id: 'Normal', en: 'Normal' },   badge: { id: 'Aman', en: 'Safe' } },
  warning: { id: { id: 'Waspada', en: 'Caution' },  badge: { id: 'Meningkat', en: 'Elevated' } },
  danger:  { id: { id: 'Bahaya', en: 'Danger' },   badge: { id: 'Tinggi', en: 'High' } },
  offline: { id: { id: 'Offline', en: 'Offline' },  badge: { id: 'Offline', en: 'Offline' } },
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
function SensorTopCard({ cfg, value, history, unit, isRefreshing }: {
  cfg: typeof TOP_CARDS[0]; value: number | null; history: number[]; unit: string; isRefreshing?: boolean
}) {
  const { lang } = useLang()
  const status   = getStatus(value, cfg.normalMin, cfg.normalMax)
  const sColor   = STATUS_COLOR[status]
  const sBg      = STATUS_BG[status]
  const sLabel   = STATUS_LABEL[status]

  let display = '--'
  if (value !== null) {
    if (cfg.key === 'tds')         display = Math.round(value).toString()
    else if (cfg.key === '_depth') display = value.toFixed(1)
    else if (cfg.key === 'ph')     display = value.toFixed(2)
    else                           display = value.toFixed(1)
  }

  return (
    <div className="rounded-2xl p-4 border flex flex-col gap-2 min-w-0" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          <span className="shrink-0" style={{ color: cfg.color }}>{cfg.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider truncate" style={{ color: 'var(--t-muted)' }}>{cfg.label[lang]}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1" style={{ background: sBg, color: sColor }}>
          {sLabel.badge[lang]}
        </span>
      </div>

      {/* Value with refresh blink effect */}
      <div className={`flex items-end gap-1 transition-all duration-300 ${isRefreshing ? 'opacity-20 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
        <span className="font-extrabold tabular-nums leading-none" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: value !== null ? cfg.color : 'var(--t-muted)' }}>
          {display}
        </span>
        {value !== null && (
          <span className="text-xs mb-1" style={{ color: 'var(--t-muted)' }}>{unit}</span>
        )}
      </div>

      {/* Sparkline */}
      {history.length > 1 && (
        <Sparkline data={history} color={cfg.color} min={cfg.normalMin * 0.8} max={cfg.normalMax * 1.2} />
      )}

      {/* Status + range */}
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sColor, boxShadow: value !== null ? `0 0 4px ${sColor}` : 'none' }} />
          <span className="text-[10px] font-semibold" style={{ color: sColor }}>{sLabel.id[lang]}</span>
        </div>
        <span className="text-[10px] truncate" style={{ color: 'var(--t-muted)' }}>{lang === 'id' ? 'Aman: ' : 'Safe: '}{cfg.ranges.ok}</span>
      </div>
    </div>
  )
}

/* ─── Water quality card ─── */
function WaterQualityCard({ status, values, connected }: { status: Status; values: Record<string,string>; connected: boolean }) {
  const { lang } = useLang()
  const sColor   = STATUS_COLOR[status]
  const sBg      = STATUS_BG[status]
  const Icon     = status === 'offline' ? WifiOff : status === 'normal' ? CheckCircle2 : AlertTriangle

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--t-surface)', borderColor: sColor + '40' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>
          {lang === 'id' ? 'Kualitas Air' : 'Water Quality'}
        </span>
        {!connected && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: STATUS_BG.offline, color: STATUS_COLOR.offline }}>
            {lang === 'id' ? 'Sensor Offline' : 'Sensor Offline'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: sBg }}>
          <Icon size={22} style={{ color: sColor }} />
        </div>
        <div>
          <div className="font-extrabold text-lg leading-tight" style={{ color: 'var(--t-text)' }}>
            {status === 'offline'  ? (lang === 'id' ? 'Tidak Ada Data' : 'No Data Available')
              : status === 'normal'  ? (lang === 'id' ? 'Kondisi Aman' : 'Safe Condition')
              : status === 'warning' ? (lang === 'id' ? 'Kondisi Waspada' : 'Caution Condition')
              :                        (lang === 'id' ? 'Kondisi Bahaya' : 'Danger Condition')}
          </div>
          <div className="text-xs px-2.5 py-0.5 rounded-full inline-block mt-0.5 font-bold" style={{ background: sBg, color: sColor }}>
            ● {STATUS_LABEL[status].id[lang].toUpperCase()}
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
  const { lang } = useLang()
  const Toggle = ({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--t-border)' }}>
      <span className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold" style={{ color: active ? '#22C55E' : '#EF4444' }}>
          {active ? (lang === 'id' ? 'AKTIF' : 'ACTIVE') : (lang === 'id' ? 'MATI' : 'OFF')}
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
      <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--t-muted)' }}>
        {lang === 'id' ? 'Sistem Pengolahan' : 'Processing System'}
      </div>
      <Toggle label={lang === 'id' ? 'Jaring (Net)' : 'Net System'} active={netOpen}  onToggle={onNetToggle} />
      <Toggle label={lang === 'id' ? 'Filter Aktif' : 'Active Filter'} active={filterOn} onToggle={onFilterToggle} />
    </div>
  )
}

/* ─── Battery card ─── */
function BatteryCard({ batteryA, batteryB }: { batteryA: number | null; batteryB: number | null }) {
  const { lang } = useLang()
  const packs = [
    { label: lang === 'id' ? 'Pack A · Propulsi' : 'Pack A · Propulsion',   pct: batteryA, volt: '14.8V' },
    { label: lang === 'id' ? 'Pack B · Elektronik' : 'Pack B · Electronics', pct: batteryB, volt: '11.1V' },
  ]
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>
          {lang === 'id' ? 'Baterai' : 'Battery'}
        </span>
        <BatteryMedium size={14} style={{ color: 'var(--t-muted)' }} />
      </div>
      {packs.map(p => {
        const pct = p.pct ?? 0
        const color = pct > 50 ? '#22C55E' : pct > 20 ? '#F59E0B' : '#EF4444'
        return (
          <div key={p.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--t-muted)' }}>{p.label}</span>
              <span className="text-sm font-extrabold" style={{ color: p.pct !== null ? color : 'var(--t-muted)' }}>
                {p.pct !== null ? `${p.pct}%` : '--'}
                {' '}
                <span className="text-[10px] font-normal" style={{ color: 'var(--t-muted)' }}>{p.volt}</span>
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--t-bg)', border: '1px solid var(--t-border)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}88, ${color})` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Sensor chart card ─── */
function SensorChartCard({ histories }: {
  histories: Record<string, number[]>
}) {
  const { lang } = useLang()
  const [active, setActive] = useState<string[]>(['ph', 'tds', 'turbidity', 'temperature'])
  const colors: Record<string,string> = { ph:'#1A56DB', tds:'#F59E0B', turbidity:'#F05A22', temperature:'#22C55E' }

  const toggle = (key: string) => setActive(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  )

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-4" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>
          {lang === 'id' ? 'Grafik Sensor' : 'Sensor Chart'}
        </span>
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
              {typeof cfg.label === 'string' ? cfg.label : cfg.label[lang]}
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
            const range = cfg.normalMax - cfg.normalMin || 1
            const pts = hist.map((v, i) => {
              const x = (i / (hist.length - 1)) * 400
              const y = 120 - ((v - cfg.normalMin) / range) * 120
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
          { color: '#22C55E', label: lang === 'id' ? 'Aman: pH 6.5–8.5' : 'Safe: pH 6.5–8.5' },
          { color: '#F59E0B', label: lang === 'id' ? 'Waspada: 5.0–6.5 / 8.5–9.0' : 'Caution: 5.0–6.5 / 8.5–9.0' },
          { color: '#EF4444', label: lang === 'id' ? 'Bahaya: <5.0 / >9.0' : 'Danger: <5.0 / >9.0' },
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
  const sensorState = useSensorData()
  const { values, history, depth, tick, connected, batteryA, batteryB } = sensorState
  const { lang } = useLang()
  const [netOpen,  setNetOpen]  = useState(false)
  const [filterOn, setFilterOn] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const now = new Date()

  const toggleNet    = useCallback(() => setNetOpen(v => !v),  [])
  const toggleFilter = useCallback(() => setFilterOn(v => !v), [])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setRefreshKey(k => k + 1)
    setTimeout(() => setIsRefreshing(false), 500)
  }, [])

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
    temp:    { id: 'Suhu',      en: 'Temperature' },
    depth:   { id: 'Kedalaman', en: 'Depth' },
    safe:    { id: 'Kondisi Aman',    en: 'Safe Condition' },
    warn:    { id: 'Kondisi Waspada', en: 'Caution' },
    danger:  { id: 'Kondisi Bahaya',  en: 'Danger' },
  }

  /* Overall water quality = worst of all sensors; offline if not connected */
  const statuses: Status[] = connected
    ? [
        getStatus(values.ph,          6.5, 8.5),
        getStatus(values.tds,         0,   500),
        getStatus(values.turbidity,   0,   50),
        getStatus(values.temperature, 20,  32),
      ]
    : ['offline']

  const overallStatus: Status = !connected ? 'offline'
    : statuses.includes('danger')  ? 'danger'
    : statuses.includes('warning') ? 'warning'
    : 'normal'

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-screen-2xl">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold leading-tight" style={{ color: 'var(--t-text)' }}>
            {T.title[lang]}
          </h1>
          <p className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--t-muted)' }}>
            {T.sub[lang]} · {now.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {!connected && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: STATUS_BG.offline, color: STATUS_COLOR.offline }}>
                <WifiOff size={10} /> Offline
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 active:scale-95 disabled:opacity-50"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
          aria-label="Refresh"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#1A56DB]' : ''} />
          {T.refresh[lang]}
        </button>
      </div>

      {/* ── 5 sensor top cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" key={refreshKey}>
        {TOP_CARDS.map(cfg => {
          const val  = cfg.key === '_depth' ? depth : values[cfg.key as keyof typeof values]
          const hist = cfg.key === '_depth' ? [] : history[cfg.key as keyof typeof history]
          return (
            <div key={cfg.key} className={cfg.key === '_depth' ? 'col-span-2 sm:col-span-1' : ''}>
              <SensorTopCard cfg={cfg} value={val} history={hist} unit={cfg.unit} isRefreshing={isRefreshing} />
            </div>
          )
        })}
      </div>

      {/* ── Middle section ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <WaterQualityCard status={overallStatus} values={{
          pH: values.ph !== null ? `${values.ph.toFixed(2)}` : '--',
          TDS: values.tds !== null ? `${Math.round(values.tds)} ppm` : '--',
          [lang === 'id' ? 'Kekeruhan' : 'Turbidity']: values.turbidity !== null ? `${values.turbidity.toFixed(1)} NTU` : '--',
          [lang === 'id' ? 'Suhu' : 'Temp']: values.temperature !== null ? `${values.temperature.toFixed(1)} °C` : '--',
          [lang === 'id' ? 'Kedalaman' : 'Depth']: depth !== null ? `${depth.toFixed(1)} m` : '--',
        }} connected={connected} />
        <SystemPanelCard netOpen={netOpen} filterOn={filterOn} onNetToggle={toggleNet} onFilterToggle={toggleFilter} />
        <BatteryCard batteryA={batteryA} batteryB={batteryB} />
      </div>

      {/* ── Bottom section: chart + depth gauge ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SensorChartCard histories={history} />
        </div>
        <div>
          <DepthChart depth={depth ?? 0} tick={tick} />
        </div>
      </div>

    </div>
  )
}
