'use client'

import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Download,
    Droplets,
    FlaskConical,
    Layers,
    Thermometer,
    Wind,
    XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'

/* â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type FilterKey = 'all' | 'today' | 'week' | 'month'
type RowStatus = 'NORMAL' | 'WARNING' | 'DANGER'

interface HistoryRow {
  id:          number
  timestamp:   Date
  ph:          number
  tds:         number
  turbidity:   number
  temperature: number
  depth:       number
  status:      RowStatus
}

/* â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function generateRows(): HistoryRow[] {
  const rows: HistoryRow[] = []
  const now = Date.now()
  for (let i = 0; i < 60; i++) {
    const ts   = new Date(now - i * 2.5 * 60 * 1000)
    const ph   = parseFloat((6.5 + Math.random() * 2.0).toFixed(2))
    const tds  = Math.round(100 + Math.random() * 280)
    const turb = parseFloat((10 + Math.random() * 80).toFixed(1))
    const temp = parseFloat((24 + Math.random() * 5).toFixed(1))
    const dep  = parseFloat((0.3 + Math.random() * 3.0).toFixed(1))
    const status: RowStatus = turb > 60 || ph < 6.5 || ph > 8.5 ? 'DANGER'
      : turb > 40 || tds > 400 ? 'WARNING' : 'NORMAL'
    rows.push({ id: i + 1, timestamp: ts, ph, tds, turbidity: turb, temperature: temp, depth: dep, status })
  }
  return rows
}

const STATUS_META: Record<RowStatus, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  NORMAL:  { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',  label: 'Normal',   icon: <CheckCircle2 size={12} /> },
  WARNING: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Waspada',  icon: <AlertTriangle size={12} /> },
  DANGER:  { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  label: 'Bahaya',   icon: <XCircle size={12} /> },
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',   label: 'Semua' },
  { key: 'today', label: 'Hari ini' },
  { key: 'week',  label: 'Minggu ini' },
  { key: 'month', label: 'Bulan ini' },
]

/* â”€â”€ CSV export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function exportCSV(rows: HistoryRow[]) {
  const header = ['No', 'Tanggal', 'Waktu', 'pH', 'TDS (ppm)', 'Turbidity (NTU)', 'Suhu (Â°C)', 'Kedalaman (m)', 'Status']
  const body   = rows.map(r => [
    r.id,
    r.timestamp.toLocaleDateString('id-ID'),
    r.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    r.ph, r.tds, r.turbidity, r.temperature, r.depth, r.status,
  ])
  const csv  = [header, ...body].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `hydrone-riwayat-${new Date().toISOString().slice(0,10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

/* â”€â”€ Trend sparkline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function TrendLine({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const max = Math.max(...data, 1); const min = Math.min(...data)
  const range = max - min || 1
  const W = 200; const H = 48
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - ((v - min) / range) * H).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: H }}>
      <defs>
        <linearGradient id={`tl-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#tl-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/* allRows generated client-side only inside component to avoid hydration mismatch */

export default function HistoryPage() {
  // useState init runs only on client â†’ no Date.now() mismatch
  const [allRows]        = useState<HistoryRow[]>(() => generateRows())
  const [filter, setFilter] = useState<FilterKey>('all')
  const [page,   setPage]   = useState(1)
  const PAGE_SIZE = 15

  const filtered = useMemo(() => {
    const now = Date.now(); const day = 86_400_000
    return allRows.filter(r => {
      const age = now - r.timestamp.getTime()
      if (filter === 'today') return age < day
      if (filter === 'week')  return age < 7  * day
      if (filter === 'month') return age < 30 * day
      return true
    })
  }, [filter, allRows])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = useMemo(() => ({
    total:   filtered.length,
    normal:  filtered.filter(r => r.status === 'NORMAL').length,
    warning: filtered.filter(r => r.status === 'WARNING').length,
    danger:  filtered.filter(r => r.status === 'DANGER').length,
    avgPh:   filtered.length ? (filtered.reduce((s,r) => s + r.ph, 0) / filtered.length).toFixed(2) : 'â€”',
    avgTurb: filtered.length ? (filtered.reduce((s,r) => s + r.turbidity, 0) / filtered.length).toFixed(1) : 'â€”',
    avgTemp: filtered.length ? (filtered.reduce((s,r) => s + r.temperature, 0) / filtered.length).toFixed(1) : 'â€”',
  }), [filtered])

  const recentPh   = [...filtered].slice(0,20).reverse().map(r => r.ph)
  const recentTurb = [...filtered].slice(0,20).reverse().map(r => r.turbidity)
  const recentTemp = [...filtered].slice(0,20).reverse().map(r => r.temperature)

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-screen-xl">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: 'var(--t-text)' }}>Riwayat Operasi</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>
            Data sensor dan log pembersihan perairan Hydrone
          </p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
        >
          <Download size={14} /> Ekspor CSV
        </button>
      </div>

      {/* â”€â”€ Filter tabs â”€â”€ */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => { setFilter(f.key); setPage(1) }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background:  filter === f.key ? '#1A56DB' : 'var(--t-surface)',
              borderColor: filter === f.key ? '#1A56DB' : 'var(--t-border)',
              color:       filter === f.key ? '#fff'    : 'var(--t-muted)',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* â”€â”€ Summary stats â”€â”€ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: <Activity size={14} />,       label: 'Total Entri',   value: stats.total,   color: '#1A56DB' },
          { icon: <CheckCircle2 size={14} />,   label: 'Normal',        value: stats.normal,  color: '#22C55E' },
          { icon: <AlertTriangle size={14} />,  label: 'Waspada',       value: stats.warning, color: '#F59E0B' },
          { icon: <XCircle size={14} />,        label: 'Bahaya',        value: stats.danger,  color: '#EF4444' },
          { icon: <FlaskConical size={14} />,   label: 'Rata-rata pH',  value: stats.avgPh,   color: '#1A56DB' },
          { icon: <Thermometer size={14} />,    label: 'Rata-rata Suhu',value: `${stats.avgTemp}Â°C`, color: '#22C55E' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3.5 border text-center" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <div className="flex justify-center mb-1.5" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-lg font-extrabold leading-tight" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--t-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Trend charts â”€â”€ */}
      {filtered.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Tren pH',        data: recentPh,   color: '#1A56DB', icon: <FlaskConical size={12} /> },
            { label: 'Tren Turbidity', data: recentTurb, color: '#F05A22', icon: <Wind         size={12} /> },
            { label: 'Tren Suhu',      data: recentTemp, color: '#22C55E', icon: <Thermometer  size={12} /> },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-4 border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>
                <span style={{ color: c.color }}>{c.icon}</span>
                {c.label}
              </div>
              <TrendLine data={c.data} color={c.color} />
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Data table â”€â”€ */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border)' }}>
        {/* Header */}
        <div
          className="grid px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{
            gridTemplateColumns: '44px 90px 1fr 1fr 1fr 1fr 80px 90px',
            background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)',
          }}
        >
          <span>#</span>
          <span>Waktu</span>
          <span className="flex items-center gap-1"><FlaskConical size={9} />pH</span>
          <span className="flex items-center gap-1"><Droplets size={9} />TDS</span>
          <span className="flex items-center gap-1"><Wind size={9} />Turb.</span>
          <span className="flex items-center gap-1"><Thermometer size={9} />Suhu</span>
          <span className="flex items-center gap-1"><Layers size={9} />Depth</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        <div style={{ background: 'var(--t-surface)' }}>
          {pageRows.length === 0 ? (
            <div className="py-16 text-center text-sm" style={{ color: 'var(--t-muted)' }}>
              Tidak ada data untuk periode ini
            </div>
          ) : pageRows.map((row, i) => {
            const sm = STATUS_META[row.status]
            return (
              <div
                key={row.id}
                className="grid px-5 py-3 border-b last:border-0 text-xs items-center transition-colors hover:bg-[#1A56DB]/[0.02]"
                style={{
                  gridTemplateColumns: '44px 90px 1fr 1fr 1fr 1fr 80px 90px',
                  borderColor: 'var(--t-border)',
                  background:  i % 2 === 0 ? 'var(--t-surface)' : 'var(--t-bg)',
                  borderLeft:  `3px solid ${sm.color}`,
                }}
              >
                <span className="text-[10px] font-mono" style={{ color: 'var(--t-muted)' }}>#{row.id}</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--t-muted)' }}>
                  {row.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-bold font-mono tabular-nums" style={{ color: '#1A56DB' }}>{row.ph}</span>
                <span className="font-mono tabular-nums" style={{ color: '#F59E0B' }}>{row.tds}</span>
                <span className="font-mono tabular-nums" style={{ color: '#F05A22' }}>{row.turbidity}</span>
                <span className="font-mono tabular-nums" style={{ color: '#22C55E' }}>{row.temperature}Â°C</span>
                <span className="font-mono tabular-nums" style={{ color: 'var(--t-text)' }}>{row.depth} m</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: sm.color }}>
                  {sm.icon}{sm.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t"
          style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)' }}>
          <span className="text-[10px]" style={{ color: 'var(--t-muted)' }}>
            {filtered.length} entri Â· halaman {page}/{totalPages || 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-7 px-3 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
              style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
            >â† Prev</button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="h-7 px-3 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
              style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
            >Next â†’</button>
          </div>
        </div>
      </div>
    </div>
  )
}
