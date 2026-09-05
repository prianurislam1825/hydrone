'use client'

import { useSensorData } from '@/lib/dashboard/useSensorData'
import {
  Cpu, Wifi, Battery, Thermometer, Droplets,
  Wind, Layers, Activity, Camera, Radio,
  CheckCircle2, AlertTriangle, XCircle,
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
const STATUS_LABEL: Record<DeviceStatus, string> = {
  online:  'Online',
  warning: 'Waspada',
  offline: 'Offline',
}
const StatusIcon = ({ s }: { s: DeviceStatus }) => {
  if (s === 'online')  return <CheckCircle2 size={14} style={{ color: STATUS_COLOR.online }} />
  if (s === 'warning') return <AlertTriangle size={14} style={{ color: STATUS_COLOR.warning }} />
  return <XCircle size={14} style={{ color: STATUS_COLOR.offline }} />
}

interface Device {
  id:       string
  name:     string
  type:     string
  icon:     React.ReactNode
  status:   DeviceStatus
  detail:   string
  lastSeen: string
  firmware: string
}

export default function DevicesPage() {
  const { values, depth } = useSensorData()

  const DEVICES: Device[] = [
    {
      id: 'esp32-main', name: 'ESP32 Main Controller', type: 'Mikrokontroler',
      icon: <Cpu size={20} style={{ color: '#1A56DB' }} />,
      status: 'online', detail: 'Mengirim data setiap 2.5 detik via tether',
      lastSeen: 'Baru saja', firmware: 'v1.2.3',
    },
    {
      id: 'arduino-mega', name: 'Arduino Mega', type: 'Motor Controller',
      icon: <Radio size={20} style={{ color: '#8B5CF6' }} />,
      status: 'online', detail: 'Mengontrol 4 thruster + relay module',
      lastSeen: 'Baru saja', firmware: 'v1.0.1',
    },
    {
      id: 'sensor-ph', name: 'pH Sensor', type: 'Sensor Analog',
      icon: <Droplets size={20} style={{ color: '#1A56DB' }} />,
      status: values.ph >= 6.5 && values.ph <= 8.5 ? 'online' : 'warning',
      detail: `Pembacaan saat ini: ${values.ph.toFixed(2)} pH`,
      lastSeen: 'Baru saja', firmware: '—',
    },
    {
      id: 'sensor-tds', name: 'TDS Sensor', type: 'Sensor Analog',
      icon: <Layers size={20} style={{ color: '#F59E0B' }} />,
      status: values.tds < 500 ? 'online' : 'warning',
      detail: `Pembacaan saat ini: ${Math.round(values.tds)} ppm`,
      lastSeen: 'Baru saja', firmware: '—',
    },
    {
      id: 'sensor-turbidity', name: 'Turbidity Sensor', type: 'Sensor Analog',
      icon: <Wind size={20} style={{ color: '#F05A22' }} />,
      status: values.turbidity < 50 ? 'online' : 'warning',
      detail: `Pembacaan saat ini: ${values.turbidity.toFixed(1)} NTU`,
      lastSeen: 'Baru saja', firmware: '—',
    },
    {
      id: 'sensor-temp', name: 'DS18B20 Temperature', type: 'Sensor OneWire',
      icon: <Thermometer size={20} style={{ color: '#22C55E' }} />,
      status: 'online',
      detail: `Pembacaan saat ini: ${values.temperature.toFixed(1)} °C`,
      lastSeen: 'Baru saja', firmware: '—',
    },
    {
      id: 'sensor-depth', name: 'Depth / Pressure', type: 'Sensor IMU',
      icon: <Activity size={20} style={{ color: '#8B5CF6' }} />,
      status: 'online',
      detail: `Kedalaman saat ini: ${depth.toFixed(1)} m`,
      lastSeen: 'Baru saja', firmware: '—',
    },
    {
      id: 'esp32-cam', name: 'ESP32-CAM', type: 'Kamera',
      icon: <Camera size={20} style={{ color: '#00B4D8' }} />,
      status: 'warning',
      detail: 'Feed kamera dalam mode demo (tidak aktif)',
      lastSeen: '2 menit lalu', firmware: 'v1.0.0',
    },
    {
      id: 'battery-a', name: 'Pack A · Propulsi', type: 'Baterai Li-Ion 4S5P',
      icon: <Battery size={20} style={{ color: '#22C55E' }} />,
      status: 'online',
      detail: '78% · 14.8V nominal · Hot-swappable',
      lastSeen: 'Baru saja', firmware: '—',
    },
    {
      id: 'battery-b', name: 'Pack B · Elektronik', type: 'Baterai Li-Ion 3S2P',
      icon: <Battery size={20} style={{ color: '#22C55E' }} />,
      status: 'online',
      detail: '91% · 11.1V nominal · Hot-swappable',
      lastSeen: 'Baru saja', firmware: '—',
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
        <h1 className="text-xl font-extrabold" style={{ color: 'var(--t-text)' }}>Perangkat</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>Status dan informasi semua komponen Hydrone ROV</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Perangkat', value: DEVICES.length, color: '#1A56DB', bg: 'rgba(26,86,219,0.08)' },
          { label: 'Online',          value: counts.online,  color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
          { label: 'Waspada / Offline', value: counts.warning + counts.offline, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl p-4 border text-center" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color: c.color }}>{c.value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Connection status */}
      <div className="rounded-2xl border p-4 flex items-center gap-3"
        style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
        <Wifi size={16} className="text-[#22C55E] shrink-0" />
        <div>
          <div className="text-sm font-bold text-[#22C55E]">Tether Terhubung</div>
          <div className="text-xs" style={{ color: 'var(--t-muted)' }}>Semua sensor mengirim data via kabel tether 20m · Update setiap 2.5 detik</div>
        </div>
      </div>

      {/* Device list */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--t-border)' }}>
        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_120px_100px] px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
          <span>Perangkat</span>
          <span>Tipe</span>
          <span>Terakhir Aktif</span>
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
                  <div className="text-[10px] truncate" style={{ color: 'var(--t-muted)' }}>{dev.detail}</div>
                  {dev.firmware !== '—' && (
                    <div className="text-[9px] mt-0.5 font-mono" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>FW {dev.firmware}</div>
                  )}
                </div>
              </div>

              {/* Type */}
              <span className="text-xs" style={{ color: 'var(--t-muted)' }}>{dev.type}</span>

              {/* Last seen */}
              <span className="text-xs font-mono" style={{ color: 'var(--t-muted)' }}>{dev.lastSeen}</span>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <StatusIcon s={dev.status} />
                <span className="text-xs font-semibold" style={{ color: STATUS_COLOR[dev.status] }}>
                  {STATUS_LABEL[dev.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
