'use client'

import { useSensorData } from '@/lib/dashboard/useSensorData'
import { useLang } from '@/lib/i18n/context'
import {
    Activity,
    AlertTriangle,
    Battery, Camera, CheckCircle2,
    Cpu, Droplets, Layers, Radio, Thermometer,
    Wifi, Wind,
    XCircle,
} from 'lucide-react'

type DeviceStatus = 'online' | 'warning' | 'offline'

const STATUS_COLOR: Record<DeviceStatus, string> = {
  online:  '#22C55E',
  warning: '#F59E0B',
  offline: '#EF4444',
}
const STATUS_BG: Record<DeviceStatus, string> = {
  online:  'rgba(34,197,94,0.1)',
  warning: 'rgba(245,158,11,0.1)',
  offline: 'rgba(239,68,68,0.1)',
}
const STATUS_LABEL: Record<DeviceStatus, { id: string; en: string }> = {
  online:  { id: 'Online', en: 'Online' },
  warning: { id: 'Waspada', en: 'Caution' },
  offline: { id: 'Offline', en: 'Offline' },
}

function StatusIcon({ s }: { s: DeviceStatus }) {
  if (s === 'online')  return <CheckCircle2 size={14} style={{ color: STATUS_COLOR.online }} />
  if (s === 'warning') return <AlertTriangle size={14} style={{ color: STATUS_COLOR.warning }} />
  return <XCircle size={14} style={{ color: STATUS_COLOR.offline }} />
}

interface Device {
  id:       string
  name:     string
  type:     { id: string; en: string }
  icon:     React.ReactNode
  status:   DeviceStatus
  detail:   { id: string; en: string }
  lastSeen: { id: string; en: string }
  firmware: string
}

export default function DevicesPage() {
  const { values, depth } = useSensorData()
  const { lang }           = useLang()

  const fmtPh   = values.ph          !== null ? values.ph.toFixed(2)           : '--'
  const fmtTds  = values.tds         !== null ? String(Math.round(values.tds)) : '--'
  const fmtTurb = values.turbidity   !== null ? values.turbidity.toFixed(1)    : '--'
  const fmtTemp = values.temperature !== null ? values.temperature.toFixed(1)  : '--'
  const fmtDep  = depth              !== null ? depth.toFixed(1)               : '--'

  const phStatus: DeviceStatus   = values.ph !== null ? (values.ph >= 6.5 && values.ph <= 8.5 ? 'online' : 'warning') : 'offline'
  const tdsStatus: DeviceStatus  = values.tds !== null ? (values.tds < 500 ? 'online' : 'warning') : 'offline'
  const turbStatus: DeviceStatus = values.turbidity !== null ? (values.turbidity < 50 ? 'online' : 'warning') : 'offline'

  const DEVICES: Device[] = [
    {
      id: 'esp32-main', name: 'ESP32 Main Controller', type: { id: 'Mikrokontroler', en: 'Microcontroller' },
      icon: <Cpu size={20} style={{ color: '#1A56DB' }} />,
      status: 'online', detail: { id: 'Mengirim data setiap 2.5 detik via tether', en: 'Sending data every 2.5s via tether' },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: 'v1.2.3',
    },
    {
      id: 'arduino-mega', name: 'Arduino Mega', type: { id: 'Kontroler Motor', en: 'Motor Controller' },
      icon: <Radio size={20} style={{ color: '#8B5CF6' }} />,
      status: 'online', detail: { id: 'Mengontrol 4 thruster + modul relay', en: 'Controls 4 thrusters + relay module' },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: 'v1.0.1',
    },
    {
      id: 'sensor-ph', name: 'pH Sensor', type: { id: 'Sensor Analog', en: 'Analog Sensor' },
      icon: <Droplets size={20} style={{ color: '#1A56DB' }} />,
      status: phStatus,
      detail: { id: `Pembacaan saat ini: ${fmtPh} pH`, en: `Current reading: ${fmtPh} pH` },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
    {
      id: 'sensor-tds', name: 'TDS Sensor', type: { id: 'Sensor Analog', en: 'Analog Sensor' },
      icon: <Layers size={20} style={{ color: '#F59E0B' }} />,
      status: tdsStatus,
      detail: { id: `Pembacaan saat ini: ${fmtTds} ppm`, en: `Current reading: ${fmtTds} ppm` },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
    {
      id: 'sensor-turbidity', name: 'Turbidity Sensor', type: { id: 'Sensor Analog', en: 'Analog Sensor' },
      icon: <Wind size={20} style={{ color: '#F05A22' }} />,
      status: turbStatus,
      detail: { id: `Pembacaan saat ini: ${fmtTurb} NTU`, en: `Current reading: ${fmtTurb} NTU` },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
    {
      id: 'sensor-temp', name: 'DS18B20 Temperature', type: { id: 'Sensor OneWire', en: 'OneWire Sensor' },
      icon: <Thermometer size={20} style={{ color: '#22C55E' }} />,
      status: 'online',
      detail: { id: `Pembacaan saat ini: ${fmtTemp} °C`, en: `Current reading: ${fmtTemp} °C` },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
    {
      id: 'sensor-depth', name: 'Depth / Pressure', type: { id: 'Sensor IMU', en: 'IMU Sensor' },
      icon: <Activity size={20} style={{ color: '#8B5CF6' }} />,
      status: 'online',
      detail: { id: `Kedalaman saat ini: ${fmtDep} m`, en: `Current depth: ${fmtDep} m` },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
    {
      id: 'esp32-cam', name: 'ESP32-CAM', type: { id: 'Kamera', en: 'Camera' },
      icon: <Camera size={20} style={{ color: '#00B4D8' }} />,
      status: 'warning',
      detail: { id: 'Feed kamera dalam mode demo (tidak aktif)', en: 'Camera feed in demo mode (inactive)' },
      lastSeen: { id: '2 menit lalu', en: '2 mins ago' }, firmware: 'v1.0.0',
    },
    {
      id: 'battery-a', name: 'Pack A · Propulsi', type: { id: 'Baterai Li-Ion 4S5P', en: 'Li-Ion Battery 4S5P' },
      icon: <Battery size={20} style={{ color: '#22C55E' }} />,
      status: 'online',
      detail: { id: '78% · 14.8V nominal · Hot-swappable', en: '78% · 14.8V nominal · Hot-swappable' },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
    {
      id: 'battery-b', name: 'Pack B · Elektronik', type: { id: 'Baterai Li-Ion 3S2P', en: 'Li-Ion Battery 3S2P' },
      icon: <Battery size={20} style={{ color: '#22C55E' }} />,
      status: 'online',
      detail: { id: '91% · 11.1V nominal · Hot-swappable', en: '91% · 11.1V nominal · Hot-swappable' },
      lastSeen: { id: 'Baru saja', en: 'Just now' }, firmware: '—',
    },
  ]

  const counts = {
    online:  DEVICES.filter(d => d.status === 'online').length,
    warning: DEVICES.filter(d => d.status === 'warning').length,
    offline: DEVICES.filter(d => d.status === 'offline').length,
  }

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-screen-xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: 'var(--t-text)' }}>
          {lang === 'id' ? 'Perangkat' : 'Devices'}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>
          {lang === 'id' ? 'Status dan informasi semua komponen Hydrone ROV' : 'Status and info for all Hydrone ROV components'}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: { id: 'Total Perangkat', en: 'Total Devices' }, value: DEVICES.length, color: '#1A56DB' },
          { label: { id: 'Online', en: 'Online' },                  value: counts.online,  color: '#22C55E' },
          { label: { id: 'Waspada / Offline', en: 'Caution / Offline' }, value: counts.warning + counts.offline, color: '#F59E0B' },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl p-4 border text-center" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color: c.color }}>{c.value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{c.label[lang]}</div>
          </div>
        ))}
      </div>

      {/* Connection status */}
      <div className="rounded-2xl border p-4 flex items-center gap-3"
        style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
        <Wifi size={16} className="text-[#22C55E] shrink-0" />
        <div>
          <div className="text-sm font-bold text-[#22C55E]">{lang === 'id' ? 'Tether Terhubung' : 'Tether Connected'}</div>
          <div className="text-xs" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'Semua sensor mengirim data via kabel tether 20m · Update setiap 2.5 detik' : 'All sensors transmit data via 20m tether cable · Updated every 2.5 seconds'}
          </div>
        </div>
      </div>

      {/* ── MOBILE: card list ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {DEVICES.map(dev => (
          <div key={dev.id} className="rounded-2xl border p-4 flex items-center gap-3"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{ background: STATUS_BG[dev.status], borderColor: STATUS_COLOR[dev.status] + '40' }}>
              {dev.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate" style={{ color: 'var(--t-text)' }}>{dev.name}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--t-muted)' }}>{dev.detail[lang]}</div>
              <div className="text-[9px] mt-0.5" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>{dev.type[lang]}</div>
            </div>

            {/* Status badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-1">
                <StatusIcon s={dev.status} />
                <span className="text-xs font-semibold" style={{ color: STATUS_COLOR[dev.status] }}>
                  {STATUS_LABEL[dev.status][lang]}
                </span>
              </div>
              <span className="text-[9px] font-mono" style={{ color: 'var(--t-muted)' }}>{dev.lastSeen[lang]}</span>
              {dev.firmware !== '—' && (
                <span className="text-[8px] font-mono" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>FW {dev.firmware}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP: table ── */}
      <div className="hidden sm:block rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border)' }}>
        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_120px_100px] px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
          <span>{lang === 'id' ? 'Perangkat' : 'Device'}</span>
          <span>{lang === 'id' ? 'Tipe' : 'Type'}</span>
          <span>{lang === 'id' ? 'Terakhir Aktif' : 'Last Active'}</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        <div style={{ background: 'var(--t-surface)' }}>
          {DEVICES.map((dev, i) => (
            <div
              key={dev.id}
              className="grid grid-cols-[1fr_140px_120px_100px] px-5 py-4 border-b last:border-0 items-center transition-colors hover:bg-[#1A56DB]/[0.02]"
              style={{ borderColor: 'var(--t-border)', background: i % 2 === 0 ? 'var(--t-surface)' : 'var(--t-bg)' }}
            >
              {/* Device name + icon + detail */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: STATUS_BG[dev.status], borderColor: STATUS_COLOR[dev.status] + '30' }}>
                  {dev.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: 'var(--t-text)' }}>{dev.name}</div>
                  <div className="text-[10px] truncate" style={{ color: 'var(--t-muted)' }}>{dev.detail[lang]}</div>
                  {dev.firmware !== '—' && (
                    <div className="text-[9px] mt-0.5 font-mono" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>FW {dev.firmware}</div>
                  )}
                </div>
              </div>

              {/* Type */}
              <span className="text-xs" style={{ color: 'var(--t-muted)' }}>{dev.type[lang]}</span>

              {/* Last seen */}
              <span className="text-xs font-mono" style={{ color: 'var(--t-muted)' }}>{dev.lastSeen[lang]}</span>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <StatusIcon s={dev.status} />
                <span className="text-xs font-semibold" style={{ color: STATUS_COLOR[dev.status] }}>
                  {STATUS_LABEL[dev.status][lang]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
