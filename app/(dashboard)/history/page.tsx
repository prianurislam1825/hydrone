'use client'

import { useMemo, useState } from 'react'
import { Download, ListFilter, Droplets, Thermometer, Wind, FlaskConical, Layers } from 'lucide-react'

// ── Mock history data generator ───────────────────────────────────────
type FilterKey = 'all' | 'today' | 'week' | 'month'

interface HistoryRow {
  id:         number
  timestamp:  Date
  ph:         number
  tds:        number
  turbidity:  number
  temperature:number
  depth:      number
  status:     'NORMAL' | 'WARNING' | 'DANGER'
}

function generateRows(): HistoryRow[] {
  const rows: HistoryRow[] = []
  const now = Date.now()
  for (let i = 0; i < 40; i++) {
    const ts     = new Date(now - i * 2.5 * 60 * 1000) // every 2.5 min
    const ph     = parseFloat((6.8 + Math.random() * 1.0).toFixed(2))
    const tds    = Math.round(150 + Math.random() * 100)
    const turb   = parseFloat((20 + Math.random() * 50).toFixed(1))
    const temp   = parseFloat((25 + Math.random() * 3).toFixed(1))
    const depth  = parseFloat((0.5 + Math.random() * 2.5).toFixed(1))
    const status: HistoryRow['status'] = turb > 60 ? 'DANGER' : turb > 45 ? 'WARNING' : 'NORMAL'
    rows.push({ id: i + 1, timestamp: ts, ph, tds, turbidity: turb, temperature: temp, depth, status })
  }
  return rows
}

const ALL_ROWS = generateRows()

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  NORMAL:  { bg: 'rgba(34,197,94,0.12)',  color: '#22C55E' },
  WARNING: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  DANGER:  { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
}

// ── Export to CSV ─────────────────────────────────────────────────────
function exportCSV(rows: HistoryRow[]) {
  const header = ['No', 'Tanggal', 'Waktu', 'pH', 'TDS (ppm)', 'Turbidity (NTU)', 'Suhu (°C)', 'Kedalaman (m)', 'Status']
  const csvRows = rows.map(r => [
    r.id,
    r.timestamp.toLocaleDateString('id-ID'),
    r.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    r.ph, r.tds, r.turbidity, r.temperature, r.depth, r.status,
  ])
  const csv = [header, ...csvRows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `hydrone-history-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Tiny bar chart for sensor distribution ───────────────────────────
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  const W = 240; const H = 40
  const step = W / (data.length - 1)
  const pts  = data.map((v, i) => `${(i * step).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: H }} aria-hidden>
      <defs>
        <linearGradient id={`hist-fill-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#hist-fill-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',   label: 'Semua' },
  { key: 'today', label: 'Hari ini' },
  { key: 'week',  label: 'Minggu ini' },
  { key: 'month', label: 'Bulan ini' },
]

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = useMemo(() => {
    const now  = Date.now()
    const day  = 86_400_000
    return ALL_ROWS.filter(r => {
      const age = now - r.timestamp.getTime()
      if (filter === 'today') return age < day
      if (filter === 'week')  return age < 7  * day
      if (filter === 'month') return age < 30 * day
      return true
    })
  }, [filter])

  const stats = useMemo(() => ({
    total:   filtered.length,
    warning: filtered.filter(r => r.status !== 'NORMAL').length,
    avgPh:   filtered.length ? (filtered.reduce((s,r) => s + r.ph, 0) / filtered.length).toFixed(2) : '—',
    avgTurb: filtered.length ? (filtered.reduce((s,r) => s + r.turbidity, 0) / filtered.length).toFixed(1) : '—',
  }), [filtered])

  const phData   = filtered.slice(0,20).map(r => r.ph).reverse()
  const turbData = filtered.slice(0,20).map(r => r.turbidity).reverse()

  return (
    <div className="min-h-full" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Riwayat Operasi</h1>
            <p className="text-xs" style={{ color: 'var(--t-muted)' }}>Data sensor dan pembersihan perairan</p>
          </div>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
          >
            <Download size={13} /> Ekspor CSV
          </button>
        </div>

        {/* ── Filter tabs ──────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background:   filter === f.key ? '#1A56DB' : 'var(--t-surface)',
                borderColor:  filter === f.key ? '#1A56DB' : 'var(--t-border)',
                color:        filter === f.key ? '#fff' : 'var(--t-muted)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── 3 Stats cards ────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <ListFilter size={16} className="text-[#1A56DB]" />, value: stats.total,   label: 'Total Data' },
            { icon: <FlaskConical size={16} className="text-[#F05A22]" />, value: stats.avgPh,  label: 'pH Rata-rata' },
            { icon: <Wind size={16} className="text-[#F59E0B]" />, value: stats.warning, label: 'Peringatan' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 border text-center" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="text-xl font-bold" style={{ color: 'var(--t-text)' }}>{s.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--t-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Mini trend charts ─────────────────────────────────── */}
        {filtered.length > 1 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: 'var(--t-muted)' }}>
                <FlaskConical size={10} /> pH Trend
              </div>
              <MiniBarChart data={phData.length ? phData : [7]} color="#1A56DB" />
            </div>
            <div className="rounded-xl p-3 border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: 'var(--t-muted)' }}>
                <Wind size={10} /> Turbidity Trend
              </div>
              <MiniBarChart data={turbData.length ? turbData : [30]} color="#F59E0B" />
            </div>
          </div>
        )}

        {/* ── Data table ───────────────────────────────────────── */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border)' }}>
          {/* Table header */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_72px] px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b" style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
            <span>Waktu</span>
            <span className="flex items-center gap-1"><FlaskConical size={9} />pH</span>
            <span className="flex items-center gap-1"><Droplets size={9} />TDS</span>
            <span className="flex items-center gap-1"><Wind size={9} />Turb.</span>
            <span className="flex items-center gap-1"><Thermometer size={9} />Suhu</span>
            <span className="flex items-center gap-1"><Layers size={9} />Depth</span>
          </div>

          {/* Table rows */}
          <div className="max-h-80 overflow-y-auto" style={{ background: 'var(--t-surface)' }}>
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm" style={{ color: 'var(--t-muted)' }}>Tidak ada data</div>
            ) : filtered.map((row, i) => (
              <div
                key={row.id}
                className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_72px] px-3 py-2.5 border-b text-xs items-center transition-colors"
                style={{
                  borderColor:     'var(--t-border)',
                  background:      i % 2 === 0 ? 'var(--t-surface)' : 'var(--t-bg)',
                  borderLeftWidth: 3,
                  borderLeftColor: STATUS_STYLE[row.status].color,
                  borderLeftStyle: 'solid',
                }}
              >
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px]" style={{ color: 'var(--t-muted)' }}>
                  {row.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: '#1A56DB' }}>{row.ph}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)]" style={{ color: '#F59E0B' }}>{row.tds}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>{row.turbidity}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)]" style={{ color: '#22C55E' }}>{row.temperature}</span>
                <span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: STATUS_STYLE[row.status].bg, color: STATUS_STYLE[row.status].color }}>
                    {row.depth}m
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 text-[10px] border-t" style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
            Menampilkan {filtered.length} entri · Klik Ekspor CSV untuk download ke Excel
          </div>
        </div>

      </div>
    </div>
  )
}
