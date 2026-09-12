'use client'

import { useSensorData } from '@/lib/dashboard/useSensorData'
import { useLang } from '@/lib/i18n/context'
import {
    Activity,
    AlertTriangle,
    Anchor,
    Bell,
    BellOff,
    CheckCircle2,
    Clock,
    Droplets,
    Filter,
    Layers,
    Thermometer,
    Trash2,
    Wifi,
    Wind,
    XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'

/* ── Alert types ─────────────────────────────────────────── */
type Severity = 'danger' | 'warning' | 'info' | 'success'

interface AlertItem {
  id:        number
  timestamp: Date
  severity:  Severity
  category:  { id: string; en: string }
  title:     { id: string; en: string }
  message:   { id: string; en: string }
  icon:      React.ReactNode
  read:      boolean
}

const SEV_META: Record<Severity, { color: string; bg: string; label: { id: string; en: string }; icon: React.ReactNode }> = {
  danger:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  label: { id: 'Bahaya', en: 'Danger' },    icon: <XCircle       size={15} /> },
  warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: { id: 'Waspada', en: 'Warning' },   icon: <AlertTriangle size={15} /> },
  info:    { color: '#1A56DB', bg: 'rgba(26,86,219,0.08)',  label: { id: 'Info', en: 'Info' },      icon: <Bell          size={15} /> },
  success: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)',  label: { id: 'Normal', en: 'Normal' },    icon: <CheckCircle2  size={15} /> },
}

/* ── Mock log generator ─ */
function generateAlerts(): AlertItem[] {
  const now = Date.now()
  const raw: Omit<AlertItem, 'id' | 'timestamp' | 'read'>[] = [
    { severity: 'success', category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'Sistem Online', en: 'System Online' },          message: { id: 'ESP32 + Arduino Mega berhasil terhubung. Semua sensor aktif.', en: 'ESP32 + Arduino Mega connected. All sensors active.' },          icon: <Wifi size={14} /> },
    { severity: 'info',    category: { id: 'Sistem', en: 'System' },  title: { id: 'Sesi Operasi Dimulai', en: 'Operation Session Started' },   message: { id: 'Hydrone ROV deploy ke perairan. Mode: Koleksi.', en: 'Hydrone ROV deployed. Mode: Collection.' },                        icon: <Activity size={14} /> },
    { severity: 'success', category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'pH Normal', en: 'pH Normal' },              message: { id: 'pH stabil di 7.18 — dalam rentang aman (6.5–8.5).', en: 'pH stable at 7.18 — within safe range (6.5–8.5).' },                    icon: <Droplets size={14} /> },
    { severity: 'success', category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'Turbidity Aman', en: 'Turbidity Safe' },         message: { id: 'Turbidity 33 NTU — di bawah batas waspada (50 NTU).', en: 'Turbidity 33 NTU — below warning threshold (50 NTU).' },                  icon: <Wind size={14} /> },
    { severity: 'warning', category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'TDS Meningkat', en: 'TDS Rising' },          message: { id: 'TDS naik ke 385 ppm. Mendekati batas waspada (400 ppm).', en: 'TDS up to 385 ppm. Nearing warning limit (400 ppm).' },              icon: <Layers size={14} /> },
    { severity: 'info',    category: { id: 'Navigasi', en: 'Navigation' }, title: { id: 'ROV Bergerak', en: 'ROV Moving' },           message: { id: 'Thruster aktif. Heading: 047°. Kedalaman: 1.2 m.', en: 'Thruster active. Heading: 047°. Depth: 1.2 m.' },                     icon: <Activity size={14} /> },
    { severity: 'success', category: { id: 'Filter', en: 'Filter' },  title: { id: 'Filter Aktif', en: 'Filter Active' },           message: { id: 'Sistem filtrasi 2-tahap berjalan normal. Stage 1: 20–50 µm, Stage 2: 0.1 µm.', en: '2-stage filtration active. Stage 1: 20–50 µm, Stage 2: 0.1 µm.' }, icon: <Filter size={14} /> },
    { severity: 'warning', category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'Suhu Sedikit Tinggi', en: 'Temp Slightly High' },    message: { id: 'Suhu air 29.8°C — mendekati batas atas (32°C). Pantau.', en: 'Water temp 29.8°C — nearing upper limit (32°C). Monitor.' },               icon: <Thermometer size={14} /> },
    { severity: 'danger',  category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'pH Keluar Rentang', en: 'pH Out of Range' },      message: { id: 'pH turun ke 6.2 — di bawah rentang aman (6.5–8.5). Perlu perhatian.', en: 'pH dropped to 6.2 — below safe range (6.5–8.5). Attention needed.' }, icon: <Droplets size={14} /> },
    { severity: 'success', category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'pH Kembali Normal', en: 'pH Returned to Normal' },      message: { id: 'pH pulih ke 6.78. Kondisi air kembali aman.', en: 'pH recovered to 6.78. Water condition safe again.' },                          icon: <Droplets size={14} /> },
    { severity: 'info',    category: { id: 'Jaring', en: 'Net' },  title: { id: 'Jaring Dibuka', en: 'Net Opened' },          message: { id: 'Operator membuka jaring via servo latch dari dashboard.', en: 'Operator opened net via servo latch from dashboard.' },               icon: <Anchor size={14} /> },
    { severity: 'success', category: { id: 'Jaring', en: 'Net' },  title: { id: 'Sampah Terkumpul', en: 'Debris Collected' },       message: { id: 'Jaring berhasil menangkap sampah makroplastik. Jaring ditutup kembali.', en: 'Net successfully captured macroplastic debris. Net closed.' }, icon: <Anchor size={14} /> },
    { severity: 'warning', category: { id: 'Baterai', en: 'Battery' }, title: { id: 'Pack A 45%', en: 'Pack A 45%' },             message: { id: 'Baterai Pack A (propulsi) tersisa 45%. Pertimbangkan swap dalam 20 menit.', en: 'Battery Pack A (propulsion) at 45%. Consider swap in 20 mins.' }, icon: <Activity size={14} /> },
    { severity: 'info',    category: { id: 'Kamera', en: 'Camera' },  title: { id: 'Kamera Terputus', en: 'Camera Disconnected' },        message: { id: 'ESP32-CAM kehilangan sinyal sementara. Mencoba reconnect.', en: 'ESP32-CAM signal temporarily lost. Reconnecting.' },             icon: <Bell size={14} /> },
    { severity: 'success', category: { id: 'Kamera', en: 'Camera' },  title: { id: 'Kamera Terhubung', en: 'Camera Reconnected' },       message: { id: 'ESP32-CAM berhasil terhubung kembali.', en: 'ESP32-CAM reconnected successfully.' },                                 icon: <Bell size={14} /> },
    { severity: 'danger',  category: { id: 'Sensor', en: 'Sensor' },  title: { id: 'Turbidity Tinggi', en: 'Turbidity High' },       message: { id: 'Turbidity 78 NTU — jauh di atas batas aman (50 NTU). Area tercemar.', en: 'Turbidity 78 NTU — well above safe limit (50 NTU). Polluted area.' }, icon: <Wind size={14} /> },
    { severity: 'info',    category: { id: 'Sistem', en: 'System' },  title: { id: 'Data Dikirim', en: 'Data Sent' },           message: { id: '1.200 titik data sensor berhasil dikirim ke Firebase via tether.', en: '1,200 sensor data points sent to Firebase via tether.' },      icon: <Wifi size={14} /> },
    { severity: 'success', category: { id: 'Sistem', en: 'System' },  title: { id: 'Operasi Selesai', en: 'Operation Completed' },        message: { id: 'Sesi operasi selesai. ROV naik ke permukaan. Data tersimpan di riwayat.', en: 'Operation session done. ROV surfaced. Data saved to history.' }, icon: <CheckCircle2 size={14} /> },
  ]

  return raw.map((item, i) => ({
    ...item,
    id:        i + 1,
    timestamp: new Date(now - (raw.length - i) * 4 * 60 * 1000),
    read:      i < raw.length - 5,
  }))
}

type FilterTab = 'all' | 'unread' | 'danger' | 'warning' | 'info' | 'success'

const FILTER_TABS: { key: FilterTab; label: { id: string; en: string }; color?: string }[] = [
  { key: 'all',     label: { id: 'Semua', en: 'All' } },
  { key: 'unread',  label: { id: 'Belum Dibaca', en: 'Unread' } },
  { key: 'danger',  label: { id: 'Bahaya', en: 'Danger' },    color: '#EF4444' },
  { key: 'warning', label: { id: 'Waspada', en: 'Warning' },   color: '#F59E0B' },
  { key: 'info',    label: { id: 'Info', en: 'Info' },      color: '#1A56DB' },
  { key: 'success', label: { id: 'Normal', en: 'Normal' },    color: '#22C55E' },
]

function fmtTime(d: Date, lang: 'id' | 'en') {
  return d.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(d: Date, lang: 'id' | 'en') {
  return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })
}

export default function AlertsPage() {
  const { values } = useSensorData()
  const { lang }   = useLang()
  const [alerts, setAlerts]  = useState<AlertItem[]>(() => generateAlerts())
  const [tab, setTab]        = useState<FilterTab>('all')
  const [muted, setMuted]    = useState(false)

  /* Live alert: append when sensor out of range */
  const liveAlerts = useMemo(() => {
    const live: AlertItem[] = []
    const now = new Date()
    if (values.ph !== null && (values.ph < 6.5 || values.ph > 8.5))
      live.push({ id: 9001, timestamp: now, severity: 'danger',  category: { id: 'Sensor', en: 'Sensor' }, title: { id: 'pH Keluar Rentang (Live)', en: 'pH Out of Range (Live)' }, message: { id: `pH saat ini ${values.ph.toFixed(2)} — di luar rentang aman.`, en: `Current pH ${values.ph.toFixed(2)} — out of safe range.` }, icon: <Droplets size={14} />, read: false })
    if (values.turbidity !== null && values.turbidity > 50)
      live.push({ id: 9002, timestamp: now, severity: 'warning', category: { id: 'Sensor', en: 'Sensor' }, title: { id: 'Turbidity Tinggi (Live)', en: 'Turbidity High (Live)' }, message: { id: `Turbidity ${values.turbidity.toFixed(1)} NTU — di atas batas aman.`, en: `Turbidity ${values.turbidity.toFixed(1)} NTU — above safe limit.` }, icon: <Wind size={14} />, read: false })
    if (values.tds !== null && values.tds > 400)
      live.push({ id: 9003, timestamp: now, severity: 'warning', category: { id: 'Sensor', en: 'Sensor' }, title: { id: 'TDS Tinggi (Live)', en: 'TDS High (Live)' }, message: { id: `TDS ${Math.round(values.tds)} ppm — mendekati batas bahaya.`, en: `TDS ${Math.round(values.tds)} ppm — nearing warning limit.` }, icon: <Layers size={14} />, read: false })
    return live
  }, [values.ph, values.turbidity, values.tds])

  const combined = useMemo(() => [...liveAlerts, ...alerts], [liveAlerts, alerts])

  const filtered = useMemo(() => combined.filter(a => {
    if (tab === 'unread')  return !a.read
    if (tab === 'danger')  return a.severity === 'danger'
    if (tab === 'warning') return a.severity === 'warning'
    if (tab === 'info')    return a.severity === 'info'
    if (tab === 'success') return a.severity === 'success'
    return true
  }), [combined, tab])

  const unreadCount = combined.filter(a => !a.read).length

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))
  const markRead    = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  const clearAll    = () => setAlerts([])

  const stats = {
    total:   combined.length,
    danger:  combined.filter(a => a.severity === 'danger').length,
    warning: combined.filter(a => a.severity === 'warning').length,
    unread:  unreadCount,
  }

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-screen-xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--t-text)' }}>
            {lang === 'id' ? 'Alert & Log Aktivitas' : 'Alerts & Activity Log'}
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black text-white bg-[#EF4444]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'Log real-time sensor, peringatan sistem, dan aktivitas operasi Hydrone' : 'Real-time sensor logs, system warnings, and Hydrone operation activity'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(v => !v)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold border transition-all"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: muted ? '#EF4444' : 'var(--t-muted)' }}
          >
            {muted ? <BellOff size={13} /> : <Bell size={13} />}
            {muted ? (lang === 'id' ? 'Suara Off' : 'Mute Sound') : (lang === 'id' ? 'Suara On' : 'Unmute Sound')}
          </button>
          <button
            onClick={markAllRead}
            className="h-9 px-3 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
          >
            {lang === 'id' ? 'Tandai Semua Dibaca' : 'Mark All Read'}
          </button>
          <button
            onClick={clearAll}
            className="h-9 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5"
            style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)', color: '#EF4444' }}
          >
            <Trash2 size={13} /> {lang === 'id' ? 'Hapus Semua' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: { id: 'Total Log', en: 'Total Logs' },    value: stats.total,   color: '#1A56DB', bg: 'rgba(26,86,219,0.08)',  icon: <Bell size={14} /> },
          { label: { id: 'Bahaya', en: 'Danger' },        value: stats.danger,  color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  icon: <XCircle size={14} /> },
          { label: { id: 'Waspada', en: 'Warning' },       value: stats.warning, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: <AlertTriangle size={14} /> },
          { label: { id: 'Belum Baca', en: 'Unread' },     value: stats.unread,  color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: <Bell size={14} /> },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 border flex items-center gap-3"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <div className="text-xl font-extrabold leading-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--t-muted)' }}>{s.label[lang]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(f => (
          <button key={f.key} onClick={() => setTab(f.key)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background:  tab === f.key ? (f.color ?? '#1A56DB') : 'var(--t-surface)',
              borderColor: tab === f.key ? (f.color ?? '#1A56DB') : 'var(--t-border)',
              color:       tab === f.key ? '#fff' : 'var(--t-muted)',
            }}>
            {f.label[lang]}
            {f.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black"
                style={{ background: tab === f.key ? 'rgba(255,255,255,0.25)' : '#EF4444', color: '#fff' }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Alert list ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border p-16 flex flex-col items-center gap-3"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
          <CheckCircle2 size={36} style={{ color: '#22C55E', opacity: 0.5 }} />
          <div className="text-sm font-semibold" style={{ color: 'var(--t-muted)' }}>{lang === 'id' ? 'Tidak ada alert untuk filter ini' : 'No alerts for this filter'}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(alert => {
            const sm = SEV_META[alert.severity]
            return (
              <div
                key={alert.id}
                className="rounded-2xl border p-4 flex items-start gap-4 transition-all cursor-pointer group"
                style={{
                  background:  alert.read ? 'var(--t-surface)' : sm.bg,
                  borderColor: alert.read ? 'var(--t-border)'  : sm.color + '40',
                  borderLeft:  `3px solid ${alert.read ? 'var(--t-border)' : sm.color}`,
                  opacity:     alert.read ? 0.75 : 1,
                }}
                onClick={() => markRead(alert.id)}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: sm.bg, border: `1px solid ${sm.color}30` }}>
                  <span style={{ color: sm.color }}>{alert.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: 'var(--t-text)' }}>{alert.title[lang]}</span>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: sm.color, boxShadow: `0 0 4px ${sm.color}` }} />
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>
                      {alert.category[lang]}
                    </span>
                    <span className="ml-auto text-[10px] flex items-center gap-1 shrink-0" style={{ color: 'var(--t-muted)' }}>
                      <Clock size={10} />
                      {fmtDate(alert.timestamp, lang)} {fmtTime(alert.timestamp, lang)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-muted)' }}>{alert.message[lang]}</p>
                </div>

                {/* Severity badge */}
                <div className="flex items-center gap-1 shrink-0 self-start" style={{ color: sm.color }}>
                  {sm.icon}
                  <span className="text-[10px] font-bold hidden sm:block">{sm.label[lang]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tip */}
      <p className="text-xs text-center" style={{ color: 'var(--t-muted)', opacity: 0.5 }}>
        {lang === 'id' ? 'Klik alert untuk menandai sudah dibaca · Alert live diperbarui setiap 2.5 detik' : 'Click alert to mark as read · Live alerts update every 2.5 seconds'}
      </p>
    </div>
  )
}
