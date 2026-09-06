'use client'

import VirtualJoystick, { type JoystickVector } from '@/components/dashboard/VirtualJoystick'
import { useSensorData } from '@/lib/dashboard/useSensorData'
import { useTheme } from '@/lib/theme/useTheme'
import {
    Activity, Anchor, BatteryMedium, Camera,
    Droplets, Filter, Gauge, Layers,
    Maximize2, Minimize2, Moon,
    Power, Radio,
    Sun,
    Thermometer,
    TriangleAlert, Wifi, WifiOff, Wind,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type ControlMode = 'MANUAL' | 'AUTO'
type NavState    = 'STANDBY' | 'MOVING'
type ConnState   = 'CONNECTED' | 'DISCONNECTED'

function clampSpd(v: number) { return Math.min(100, Math.max(0, v)) }

/* ── Toast ── */
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl text-xs font-semibold shadow-2xl animate-fade-up pointer-events-none"
      style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)', borderLeft: '3px solid #00B4D8', color: 'var(--t-text)', backdropFilter: 'blur(16px)', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  )
}

/* ── E-STOP confirm ── */
function EStopOverlay({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-2xl p-8 text-center max-w-xs w-full mx-4" style={{ background: 'var(--t-surface)', border: '2px solid #EF4444', boxShadow: '0 0 60px rgba(239,68,68,0.4)' }}>
        <div className="w-16 h-16 rounded-full bg-[#EF4444]/20 flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid #EF4444' }}>
          <TriangleAlert size={28} className="text-[#EF4444]" />
        </div>
        <div className="text-lg font-black text-[#EF4444] mb-2 tracking-widest">EMERGENCY STOP</div>
        <div className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--t-muted)' }}>
          All motors will be halted immediately.<br />Hydrone will hover at current position.
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-sm font-bold border transition-all" style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl text-sm font-black text-white active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)', boxShadow: '0 4px 20px rgba(239,68,68,0.5)' }}>
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Sensor pill — compact for horizontal scroll strip ── */
function SensorPill({ icon, label, value, unit, color }: {
  icon: React.ReactNode; label: string; value: string; unit: string; color: string
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
      style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
      <span style={{ color, opacity: 0.85 }}>{icon}</span>
      <div>
        <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{label}</div>
        <div className="font-bold text-xs font-[family-name:var(--font-jetbrains-mono)] leading-tight" style={{ color: 'var(--t-text)' }}>
          {value}<span className="text-[9px] font-normal ml-0.5" style={{ color: 'var(--t-muted)' }}>{unit}</span>
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
    </div>
  )
}

/* ── Sensor row — desktop sidebar ── */
function SensorRow({ icon, label, value, unit, color }: {
  icon: React.ReactNode; label: string; value: string; unit: string; color: string
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
      <span style={{ color, opacity: 0.85 }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{label}</div>
        <div className="font-bold text-sm font-[family-name:var(--font-jetbrains-mono)] leading-tight" style={{ color: 'var(--t-text)' }}>
          {value}<span className="text-[10px] font-normal ml-0.5" style={{ color: 'var(--t-muted)' }}>{unit}</span>
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
    </div>
  )
}

/* ── Format sensor value with null safety ── */
function fmtSensor(v: number | null, decimals: number, fallback = '--') {
  if (v === null) return fallback
  return v.toFixed(decimals)
}

/* ══ Main ══ */
export default function ControlPage() {
  const { values, depth, batteryA }             = useSensorData()
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const [mode, setMode]               = useState<ControlMode>('MANUAL')
  const [speed, setSpeed]             = useState(50)
  const [navState, setNavState]       = useState<NavState>('STANDBY')
  const [conn]                        = useState<ConnState>('CONNECTED')
  const [eStopActive, setEStop]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fullscreen, setFullscreen]   = useState(false)
  const [toast, setToast]             = useState<string | null>(null)
  const [camDots, setCamDots]         = useState('')
  const [netOpen, setNetOpen]         = useState(false)
  const [filterOn, setFilterOn]       = useState(true)
  const toastTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accent = '#00B4D8'

  useEffect(() => {
    const t = setInterval(() => setCamDots(d => d.length >= 3 ? '' : d + '.'), 600)
    return () => clearInterval(t)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const handleNav = useCallback((v: JoystickVector) => {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y)
    if (mag > 0.08) { setNavState('MOVING'); setSpeed(clampSpd(Math.round(35 + mag * 60))) }
    else setNavState('STANDBY')
  }, [])

  const handleThrottle = useCallback((v: JoystickVector) => {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y)
    if (mag > 0.05) setSpeed(clampSpd(Math.round(30 + mag * 70)))
  }, [])

  const handleStop = () => {
    setNavState('STANDBY'); setSpeed(0)
    showToast('STOP — All movement halted.')
    setTimeout(() => setSpeed(50), 1500)
  }

  const spdColor = speed > 70 ? '#EF4444' : speed > 40 ? '#F59E0B' : accent

  const depthVal  = depth  !== null ? depth  : 0
  const battPct   = batteryA !== null ? batteryA : 0

  const sensorData = [
    { icon: <Thermometer size={12} />, label: 'Temp',      value: fmtSensor(values.temperature, 1), unit: '°C',  color: '#F05A22' },
    { icon: <Droplets    size={12} />, label: 'pH',        value: fmtSensor(values.ph, 2),          unit: 'pH',  color: '#1A56DB' },
    { icon: <Layers      size={12} />, label: 'TDS',       value: values.tds !== null ? String(Math.round(values.tds)) : '--', unit: 'ppm', color: accent },
    { icon: <Wind        size={12} />, label: 'Turbidity', value: fmtSensor(values.turbidity, 1),   unit: 'NTU', color: '#F59E0B' },
    { icon: <Gauge       size={12} />, label: 'Pressure',  value: (1 + depthVal * 0.098).toFixed(2), unit: 'bar', color: '#8B5CF6' },
    { icon: <Layers      size={12} />, label: 'Depth',     value: fmtSensor(depth, 1),              unit: 'm',   color: '#22C55E' },
    { icon: <BatteryMedium size={12} />, label: 'Battery', value: batteryA !== null ? String(battPct) : '--', unit: '%', color: '#F59E0B' },
  ]

  return (
    <>
      {showConfirm && (
        <EStopOverlay
          onConfirm={() => { setShowConfirm(false); setEStop(true); setNavState('STANDBY'); setSpeed(0); showToast('⚠ E-STOP ACTIVE — All motors halted!'); setTimeout(() => { setEStop(false); setSpeed(50) }, 5000) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {toast && <Toast msg={toast} />}

      {eStopActive && (
        <div className="fixed top-0 left-0 right-0 z-[150] py-2 text-center text-xs font-black tracking-widest text-white animate-[live-pulse_0.5s_ease-in-out_infinite]"
          style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)' }}>
          ⚠ EMERGENCY STOP ACTIVE — ALL MOTORS HALTED
        </div>
      )}

      <div
        className="relative flex flex-col overflow-hidden select-none"
        style={{
          background: 'var(--t-bg)',
          minHeight: fullscreen ? '100dvh' : 'calc(100dvh - 128px)',
          fontFamily: 'var(--font-sans)',
          touchAction: 'none',
        }}
      >
        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" aria-hidden
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 2px,${accent} 2px,${accent} 3px)`, backgroundSize: '100% 3px' }} />

        {/* ── TOP HUD BAR ── */}
        <div className="relative z-30 flex items-center justify-between px-3 sm:px-5 py-2.5 border-b"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', backdropFilter: 'blur(12px)' }}>

          {/* Left: mode + stop */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black tracking-widest border"
              style={{ background: mode === 'MANUAL' ? `${accent}18` : 'rgba(139,92,246,0.12)', borderColor: mode === 'MANUAL' ? `${accent}55` : 'rgba(139,92,246,0.4)', color: mode === 'MANUAL' ? accent : '#8B5CF6' }}>
              <Radio size={10} />{mode}
            </div>
            <button onClick={() => { setMode(m => m === 'MANUAL' ? 'AUTO' : 'MANUAL'); showToast(`Mode ${mode === 'MANUAL' ? 'AUTO' : 'MANUAL'} — Demo.`) }}
              className="px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all hover:opacity-80"
              style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
              {mode === 'MANUAL' ? 'AUTO' : 'MANUAL'}
            </button>
            <button onClick={handleStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all active:scale-95"
              style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444' }}>
              <Power size={11} /> STOP
            </button>
          </div>

          {/* Center: SPD */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="hidden xs:block text-[9px] font-bold tracking-widest" style={{ color: 'var(--t-muted)' }}>SPD</span>
              <div className="w-20 sm:w-36 h-2 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${speed}%`, background: `linear-gradient(to right,${accent},${spdColor})`, boxShadow: `0 0 8px ${spdColor}66` }} />
              </div>
              <span className="text-xs font-black font-[family-name:var(--font-jetbrains-mono)] min-w-[32px] text-right" style={{ color: spdColor }}>{speed}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: navState === 'MOVING' ? '#22C55E' : 'var(--t-border)', boxShadow: navState === 'MOVING' ? '0 0 6px #22C55E' : 'none' }} />
              <span className="text-[8px] tracking-widest font-bold" style={{ color: navState === 'MOVING' ? '#22C55E' : 'var(--t-muted)' }}>{navState}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold">
              {conn === 'CONNECTED'
                ? <><Wifi size={12} style={{ color: '#22C55E' }} /><span style={{ color: '#22C55E' }}>Connected</span></>
                : <><WifiOff size={12} className="text-[#EF4444]" /><span className="text-[#EF4444]">Disconnected</span></>
              }
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border"
              style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />LIVE
            </div>

            {mounted && (
              <button onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all hover:opacity-80 theme-toggle"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
                <span className="hidden sm:block">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            )}

            <button onClick={() => setFullscreen(v => !v)}
              className="p-1.5 rounded-lg transition-all hover:opacity-70 theme-toggle">
              {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE SENSOR STRIP (portrait only, above camera) ── */}
        <div className="lg:hidden border-b overflow-x-auto" style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
          <div className="flex gap-2 px-3 py-2 w-max">
            {sensorData.map((s, i) => (
              <SensorPill key={i} {...s} />
            ))}
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Desktop sensor panel (lg+) */}
          <div className="hidden lg:flex lg:w-52 xl:w-60 shrink-0 flex-col border-r"
            style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
            <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: 'var(--t-border)' }}>
              <Activity size={12} style={{ color: accent }} />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accent }}>Sensor</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
            </div>

            <div className="flex flex-col gap-2 p-3 overflow-y-auto">
              {sensorData.map((s, i) => (
                <SensorRow key={i} {...s} />
              ))}
            </div>

            {/* System status */}
            <div className="flex flex-col mt-auto border-t" style={{ borderColor: 'var(--t-border)' }}>
              <div className="px-3 pt-2.5 pb-1">
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: `${accent}99` }}>System Status</span>
              </div>
              {[
                { label: 'Connection', val: 'Connected',                 color: '#22C55E' },
                { label: 'Mode',       val: mode,                        color: accent },
                { label: 'Navigation', val: navState,                    color: navState === 'MOVING' ? '#22C55E' : '#F59E0B' },
                { label: 'Net',        val: netOpen ? 'OPEN' : 'CLOSED', color: netOpen ? '#22C55E' : 'var(--t-muted)' },
                { label: 'Filter',     val: filterOn ? 'ACTIVE' : 'OFF', color: filterOn ? accent : 'var(--t-muted)' },
                { label: 'Camera',     val: 'Active',                    color: '#22C55E' },
                { label: 'Battery',    val: 'Normal',                    color: '#22C55E' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 border-b last:border-0" style={{ borderColor: 'var(--t-border)' }}>
                  <span className="text-[10px]" style={{ color: 'var(--t-muted)' }}>{s.label}</span>
                  <span className="text-[10px] font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
              <div className="px-3 py-2 text-[8px] text-center font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.4 }}>
                DEMO MODE · NOT TRANSMITTED
              </div>
            </div>
          </div>

          {/* Camera feed */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ background: 'var(--t-surface-3)', minHeight: 160 }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera size={32} style={{ color: accent, opacity: 0.25 }} className="mb-3" />
              <div className="text-[11px] font-semibold tracking-widest mb-1" style={{ color: `${accent}77` }}>ESP32-CAM · LIVE FEED</div>
              <div className="text-[10px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>
                Connecting camera{camDots}
              </div>
              <div className="flex gap-1.5 mt-3">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: accent, animation: `live-pulse 1.2s ease-in-out ${i*0.2}s infinite`, opacity: 0.5 }} />
                ))}
              </div>
            </div>

            {/* Scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 3px,${accent} 3px,${accent} 4px)` }} />

            {/* HUD brackets */}
            {[['top-3 left-3','border-t-2 border-l-2'],['top-3 right-3','border-t-2 border-r-2'],['bottom-12 left-3','border-b-2 border-l-2'],['bottom-12 right-3','border-b-2 border-r-2']].map(([pos, s], i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 ${s}`} style={{ borderColor: `${accent}55` }} />
            ))}

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: 0.12 }}>
                <circle cx="20" cy="20" r="18" fill="none" stroke={accent} strokeWidth="0.5" />
                <circle cx="20" cy="20" r="2" fill={accent} />
                <line x1="20" y1="0" x2="20" y2="10" stroke={accent} strokeWidth="0.5" />
                <line x1="20" y1="30" x2="20" y2="40" stroke={accent} strokeWidth="0.5" />
                <line x1="0" y1="20" x2="10" y2="20" stroke={accent} strokeWidth="0.5" />
                <line x1="30" y1="20" x2="40" y2="20" stroke={accent} strokeWidth="0.5" />
              </svg>
            </div>

            {/* Info chips */}
            <div className="absolute top-2 right-10 flex gap-1.5 pointer-events-none">
              {['CAM-01','1600×1200'].map(t => (
                <div key={t} className="px-2 py-1 rounded text-[9px] font-bold font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ background: 'var(--t-surface)', border: `1px solid var(--t-border)`, color: accent }}>{t}</div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 pointer-events-none"
              style={{ background: 'linear-gradient(to top, var(--t-surface-3), transparent)' }}>
              {['HYDRONE · ROV-01', `MODE: ${mode}`, `DEPTH: ${depthVal.toFixed(1)}m`].map(t => (
                <span key={t} className="text-[9px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: `${accent}66` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM CONTROLS ── */}
        <div className="relative z-30 border-t" style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-end justify-between px-3 sm:px-8 pb-4 pt-3 gap-2 sm:gap-4">

            {/* Left: nav + net/filter */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <VirtualJoystick label="NAVIGASI" size={80} onChange={handleNav} accentColor={accent} />
              <div className="flex gap-1.5 mt-0.5">
                {[
                  { label: 'JARING', icon: <Anchor size={12} />, active: netOpen,  onToggle: () => { setNetOpen(v => !v);  showToast(`Net ${netOpen ? 'CLOSED' : 'OPEN'} — Servo latch active.`) }, activeColor: '#22C55E' },
                  { label: 'FILTER', icon: <Filter size={12} />, active: filterOn, onToggle: () => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ACTIVE'} — Bilge pump.`) },          activeColor: accent },
                ].map(b => (
                  <button key={b.label} onClick={b.onToggle}
                    className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl border transition-all active:scale-95"
                    style={{ background: b.active ? `${b.activeColor}18` : 'var(--t-surface-2)', borderColor: b.active ? `${b.activeColor}55` : 'var(--t-border)', color: b.active ? b.activeColor : 'var(--t-muted)' }}>
                    {b.icon}
                    <span className="text-[7px] font-black tracking-widest">{b.active ? (b.label === 'JARING' ? 'OPEN' : 'ON') : (b.label === 'JARING' ? 'CLOSED' : 'OFF')}</span>
                    <span className="text-[6px]" style={{ color: 'var(--t-muted)' }}>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center: depth + E-STOP */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-[180px] sm:max-w-[200px]">
              <div className="w-full flex items-center gap-2">
                <span className="text-[9px] tracking-widest font-bold" style={{ color: 'var(--t-muted)' }}>DEPTH</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((depthVal / 10) * 100, 100)}%`, background: 'linear-gradient(to right,#22C55E,#1A56DB)' }} />
                </div>
                <span className="text-[9px] font-bold font-[family-name:var(--font-jetbrains-mono)] text-[#22C55E]">{depthVal.toFixed(1)}m</span>
              </div>

              <button onClick={() => setShowConfirm(true)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-90"
                style={{ background: eStopActive ? 'radial-gradient(circle,#B91C1C,#7F1D1D)' : 'radial-gradient(circle,#EF4444,#B91C1C)', boxShadow: eStopActive ? '0 0 40px rgba(185,28,28,0.9)' : '0 0 24px rgba(239,68,68,0.6)', border: '3px solid rgba(255,255,255,0.2)' }}>
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.4)', animation: 'orange-glow 1.5s ease-in-out infinite' }} />
                <TriangleAlert size={18} className="text-white mb-0.5" />
                <span className="text-[9px] font-black text-white tracking-widest leading-none">E-STOP</span>
              </button>

              <span className="text-[7px] text-center font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.5 }}>
                DEMO · NOT TRANSMITTED
              </span>
            </div>

            {/* Right: throttle */}
            <div className="shrink-0">
              <VirtualJoystick label="THROTTLE" size={80} onChange={handleThrottle} accentColor="#F05A22" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
