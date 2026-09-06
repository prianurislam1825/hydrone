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

function clampSpd(v: number) { return Math.min(100, Math.max(0, v)) }
function fmt(v: number | null, d = 1) { return v !== null ? v.toFixed(d) : '--' }

/* ── Toast ─────────────────────────────────────────────── */
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl animate-fade-up pointer-events-none"
      style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)', borderLeft: '3px solid #00B4D8', color: 'var(--t-text)', backdropFilter: 'blur(16px)', whiteSpace: 'nowrap', maxWidth: '90vw' }}>
      {msg}
    </div>
  )
}

/* ── E-STOP overlay ─────────────────────────────────────── */
function EStopOverlay({ onConfirm, onCancel }: { onConfirm(): void; onCancel(): void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-2xl p-6 text-center max-w-xs w-full" style={{ background: 'var(--t-surface)', border: '2px solid #EF4444', boxShadow: '0 0 60px rgba(239,68,68,0.4)' }}>
        <div className="w-14 h-14 rounded-full bg-[#EF4444]/20 flex items-center justify-center mx-auto mb-3" style={{ border: '2px solid #EF4444' }}>
          <TriangleAlert size={24} className="text-[#EF4444]" />
        </div>
        <div className="text-base font-black text-[#EF4444] mb-1 tracking-widest">EMERGENCY STOP</div>
        <div className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--t-muted)' }}>All motors halted. Hydrone hovers in place.</div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all" style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-black text-white active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)', boxShadow: '0 4px 20px rgba(239,68,68,0.5)' }}>CONFIRM</button>
        </div>
      </div>
    </div>
  )
}

/* ── Sensor pill ─────────────────────────────────────────── */
function Pill({ icon, label, value, unit, color }: { icon: React.ReactNode; label: string; value: string; unit: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shrink-0" style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
      <span style={{ color }}>{icon}</span>
      <div>
        <div className="text-[8px] uppercase tracking-wider leading-none" style={{ color: 'var(--t-muted)' }}>{label}</div>
        <div className="text-xs font-bold font-[family-name:var(--font-jetbrains-mono)] leading-tight" style={{ color: 'var(--t-text)' }}>
          {value}<span className="text-[9px] font-normal ml-0.5" style={{ color: 'var(--t-muted)' }}>{unit}</span>
        </div>
      </div>
    </div>
  )
}

/* ══ Main ══════════════════════════════════════════════════ */
export default function ControlPage() {
  const { values, depth, batteryA, connected } = useSensorData()
  const { theme, toggle: toggleTheme, mounted }  = useTheme()
  const [mode, setMode]               = useState<ControlMode>('MANUAL')
  const [speed, setSpeed]             = useState(50)
  const [navState, setNavState]       = useState<NavState>('STANDBY')
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
    toastTimer.current = setTimeout(() => setToast(null), 2500)
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

  const depthVal = depth ?? 0
  const spdColor = speed > 70 ? '#EF4444' : speed > 40 ? '#F59E0B' : accent

  const pills = [
    { icon: <Thermometer size={11} />, label: 'Temp',   value: fmt(values.temperature, 1), unit: '°C',  color: '#F05A22' },
    { icon: <Droplets    size={11} />, label: 'pH',     value: fmt(values.ph, 2),          unit: 'pH',  color: '#1A56DB' },
    { icon: <Layers      size={11} />, label: 'TDS',    value: values.tds !== null ? String(Math.round(values.tds)) : '--', unit: 'ppm', color: accent },
    { icon: <Wind        size={11} />, label: 'Turb',   value: fmt(values.turbidity, 1),   unit: 'NTU', color: '#F59E0B' },
    { icon: <Gauge       size={11} />, label: 'Press',  value: (1 + depthVal * 0.098).toFixed(2), unit: 'bar', color: '#8B5CF6' },
    { icon: <Layers      size={11} />, label: 'Depth',  value: fmt(depth, 1),              unit: 'm',   color: '#22C55E' },
    { icon: <BatteryMedium size={11} />, label: 'Bat', value: batteryA !== null ? String(batteryA) : '--', unit: '%', color: '#F59E0B' },
  ]

  return (
    <>
      {showConfirm && (
        <EStopOverlay
          onConfirm={() => { setShowConfirm(false); setEStop(true); setNavState('STANDBY'); setSpeed(0); showToast('⚠ E-STOP ACTIVE!'); setTimeout(() => { setEStop(false); setSpeed(50) }, 5000) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {toast && <Toast msg={toast} />}
      {eStopActive && (
        <div className="fixed top-0 left-0 right-0 z-[150] py-1.5 text-center text-xs font-black tracking-widest text-white"
          style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)', animation: 'live-pulse 0.5s ease-in-out infinite' }}>
          ⚠ E-STOP ACTIVE — ALL MOTORS HALTED
        </div>
      )}

      {/*
        LAYOUT STRATEGY:
        - Portrait mobile  : flex-col, sensor strip → camera → controls bottom
        - Landscape mobile : flex-row, sensor panel left (narrow) + camera center + controls right
        - Desktop          : flex-row, sensor panel + camera + controls
      */}
      <div
        className="relative overflow-hidden select-none"
        style={{
          background:  'var(--t-bg)',
          height:      fullscreen ? '100dvh' : 'calc(100dvh - 128px)',
          display:     'flex',
          flexDirection: 'column',
          fontFamily:  'var(--font-sans)',
          touchAction: 'none',
        }}
      >
        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" aria-hidden
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 2px,${accent} 2px,${accent} 3px)`, backgroundSize: '100% 3px' }} />

        {/* ═══ TOP HUD ══════════════════════════════════════════ */}
        <div className="shrink-0 z-30 flex items-center justify-between px-3 py-2 border-b"
          style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>

          {/* Left */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black tracking-widest border"
              style={{ background: mode === 'MANUAL' ? `${accent}18` : 'rgba(139,92,246,0.12)', borderColor: mode === 'MANUAL' ? `${accent}55` : 'rgba(139,92,246,0.4)', color: mode === 'MANUAL' ? accent : '#8B5CF6' }}>
              <Radio size={9} />{mode}
            </div>
            <button onClick={() => { setMode(m => m === 'MANUAL' ? 'AUTO' : 'MANUAL'); showToast(`Mode ${mode === 'MANUAL' ? 'AUTO' : 'MANUAL'}`) }}
              className="px-2 py-1 rounded-lg text-[10px] font-bold border" style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
              {mode === 'MANUAL' ? 'AUTO' : 'MANUAL'}
            </button>
            <button onClick={handleStop}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black border active:scale-95"
              style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444' }}>
              <Power size={10} />STOP
            </button>
          </div>

          {/* Center: SPD */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold hidden xs:block" style={{ color: 'var(--t-muted)' }}>SPD</span>
            <div className="w-16 sm:w-28 h-1.5 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${speed}%`, background: `linear-gradient(to right,${accent},${spdColor})`, boxShadow: `0 0 6px ${spdColor}66` }} />
            </div>
            <span className="text-xs font-black font-[family-name:var(--font-jetbrains-mono)] w-8 text-right" style={{ color: spdColor }}>{speed}%</span>
            <span className="w-1.5 h-1.5 rounded-full ml-1"
              style={{ background: navState === 'MOVING' ? '#22C55E' : 'var(--t-border)', boxShadow: navState === 'MOVING' ? '0 0 5px #22C55E' : 'none' }} />
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold">
              {connected
                ? <><Wifi size={11} style={{ color: '#22C55E' }} /><span style={{ color: '#22C55E' }}>Live</span></>
                : <><WifiOff size={11} className="text-[#F59E0B]" /><span style={{ color: '#F59E0B' }}>Demo</span></>
              }
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border"
              style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />LIVE
            </div>
            {mounted && (
              <button onClick={toggleTheme} className="p-1.5 rounded-lg theme-toggle" title={theme === 'dark' ? 'Light' : 'Dark'}>
                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              </button>
            )}
            <button onClick={() => setFullscreen(v => !v)} className="p-1.5 rounded-lg theme-toggle">
              {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        {/* ═══ SENSOR STRIP — portrait mobile only ══════════════ */}
        <div className="shrink-0 border-b overflow-x-auto landscape:hidden"
          style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
          <div className="flex gap-2 px-3 py-2 w-max">
            {pills.map((p, i) => <Pill key={i} {...p} />)}
          </div>
        </div>

        {/* ═══ MAIN — camera + optional landscape sidebar ════════ */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* Landscape sensor sidebar — shown only in landscape on small screens */}
          <div className="hidden landscape:flex flex-col shrink-0 w-28 sm:w-36 border-r overflow-y-auto"
            style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
            <div className="flex items-center gap-1.5 px-2 py-2 border-b" style={{ borderColor: 'var(--t-border)' }}>
              <Activity size={10} style={{ color: accent }} />
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: accent }}>Sensor</span>
            </div>
            <div className="flex flex-col gap-1.5 p-2">
              {pills.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                  style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
                  <span style={{ color: p.color }}>{p.icon}</span>
                  <div>
                    <div className="text-[7px] uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{p.label}</div>
                    <div className="text-[10px] font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>
                      {p.value}<span className="text-[8px] font-normal ml-0.5" style={{ color: 'var(--t-muted)' }}>{p.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Status rows */}
              <div className="mt-1 border-t pt-1.5" style={{ borderColor: 'var(--t-border)' }}>
                {[
                  { label: 'Mode',   val: mode,    color: accent },
                  { label: 'Nav',    val: navState, color: navState === 'MOVING' ? '#22C55E' : '#F59E0B' },
                  { label: 'Net',    val: netOpen ? 'OPEN' : 'CLOSED', color: netOpen ? '#22C55E' : 'var(--t-muted)' },
                  { label: 'Filter', val: filterOn ? 'ON' : 'OFF',     color: filterOn ? accent : 'var(--t-muted)' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between px-1 py-0.5">
                    <span className="text-[8px]" style={{ color: 'var(--t-muted)' }}>{s.label}</span>
                    <span className="text-[8px] font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Camera feed */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ background: 'var(--t-surface-3)' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Camera size={28} style={{ color: accent, opacity: 0.25 }} />
              <div className="text-[10px] font-semibold tracking-widest" style={{ color: `${accent}77` }}>ESP32-CAM · LIVE FEED</div>
              <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>Connecting camera{camDots}</div>
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: accent, animation: `live-pulse 1.2s ease-in-out ${i*0.2}s infinite`, opacity: 0.5 }} />)}
              </div>
            </div>

            {/* Scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 3px,${accent} 3px,${accent} 4px)` }} />

            {/* HUD brackets */}
            {[['top-2 left-2','border-t border-l'],['top-2 right-2','border-t border-r'],['bottom-2 left-2','border-b border-l'],['bottom-2 right-2','border-b border-r']].map(([pos, s], i) => (
              <div key={i} className={`absolute ${pos} w-5 h-5 ${s}`} style={{ borderColor: `${accent}55`, borderWidth: 1.5 }} />
            ))}

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width="32" height="32" viewBox="0 0 32 32" style={{ opacity: 0.1 }}>
                <circle cx="16" cy="16" r="14" fill="none" stroke={accent} strokeWidth="0.5" />
                <circle cx="16" cy="16" r="1.5" fill={accent} />
                <line x1="16" y1="0" x2="16" y2="8"   stroke={accent} strokeWidth="0.5" />
                <line x1="16" y1="24" x2="16" y2="32" stroke={accent} strokeWidth="0.5" />
                <line x1="0" y1="16" x2="8" y2="16"   stroke={accent} strokeWidth="0.5" />
                <line x1="24" y1="16" x2="32" y2="16" stroke={accent} strokeWidth="0.5" />
              </svg>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-1.5 pointer-events-none"
              style={{ background: 'linear-gradient(to top,var(--t-surface-3),transparent)' }}>
              {[`HYDRONE·ROV`, `${mode}`, `${depthVal.toFixed(1)}m`].map(t => (
                <span key={t} className="text-[8px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: `${accent}55` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM CONTROLS ══════════════════════════════════ */}
        <div className="shrink-0 z-30 border-t" style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
          <div className="flex items-center justify-between px-3 py-2 gap-2">

            {/* LEFT: Joystick Nav + net/filter */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <VirtualJoystick label="NAVIGASI" size={80} onChange={handleNav} accentColor={accent} />
              <div className="flex gap-1.5">
                {[
                  { key: 'net',    label: 'JARING', icon: <Anchor size={11} />, active: netOpen,  color: '#22C55E', toggle: () => { setNetOpen(v => !v); showToast(`Net ${netOpen ? 'CLOSED' : 'OPEN'}`) } },
                  { key: 'filter', label: 'FILTER', icon: <Filter size={11} />, active: filterOn, color: accent,    toggle: () => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ON'}`) } },
                ].map(b => (
                  <button key={b.key} onClick={b.toggle}
                    className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border active:scale-95 transition-all"
                    style={{ background: b.active ? `${b.color}18` : 'var(--t-surface-2)', borderColor: b.active ? `${b.color}55` : 'var(--t-border)', color: b.active ? b.color : 'var(--t-muted)' }}>
                    {b.icon}
                    <span className="text-[7px] font-black">{b.active ? (b.key === 'net' ? 'OPEN' : 'ON') : (b.key === 'net' ? 'CLOSED' : 'OFF')}</span>
                    <span className="text-[6px]" style={{ color: 'var(--t-muted)' }}>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER: Depth bar + E-STOP */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
              {/* Depth */}
              <div className="w-full flex items-center gap-1.5">
                <span className="text-[8px] font-bold shrink-0" style={{ color: 'var(--t-muted)' }}>DEPTH</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((depthVal / 10) * 100, 100)}%`, background: 'linear-gradient(to right,#22C55E,#1A56DB)' }} />
                </div>
                <span className="text-[9px] font-bold font-[family-name:var(--font-jetbrains-mono)] text-[#22C55E] shrink-0">{depthVal.toFixed(1)}m</span>
              </div>

              {/* E-STOP */}
              <button onClick={() => setShowConfirm(true)}
                className="relative rounded-full flex flex-col items-center justify-center active:scale-90 transition-all"
                style={{ width: 72, height: 72, background: eStopActive ? 'radial-gradient(circle,#B91C1C,#7F1D1D)' : 'radial-gradient(circle,#EF4444,#B91C1C)', boxShadow: '0 0 20px rgba(239,68,68,0.55)', border: '2.5px solid rgba(255,255,255,0.2)' }}>
                <TriangleAlert size={18} className="text-white mb-0.5" />
                <span className="text-[9px] font-black text-white tracking-widest leading-none">E-STOP</span>
              </button>

              <span className="text-[7px] text-center" style={{ color: 'var(--t-muted)', opacity: 0.5 }}>DEMO · NOT TRANSMITTED</span>
            </div>

            {/* RIGHT: Throttle joystick */}
            <div className="shrink-0">
              <VirtualJoystick label="THROTTLE" size={80} onChange={handleThrottle} accentColor="#F05A22" />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
