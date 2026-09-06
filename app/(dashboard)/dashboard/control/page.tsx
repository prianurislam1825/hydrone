'use client'

import VirtualJoystick, { type JoystickVector } from '@/components/dashboard/VirtualJoystick'
import { useSensorData } from '@/lib/dashboard/useSensorData'
import { useTheme } from '@/lib/theme/useTheme'
import {
  BatteryMedium, Camera,
  Droplets, Filter, Gauge, Layers,
  Maximize2, Minimize2, Moon,
  Power, Radio,
  Sun,
  Thermometer,
  TriangleAlert,
  WifiOff, Wind
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type ControlMode = 'MANUAL' | 'AUTO'
type NavState    = 'STANDBY' | 'MOVING'

function clamp(v: number) { return Math.min(100, Math.max(0, v)) }
function fmt(v: number | null, d = 1) { return v !== null ? v.toFixed(d) : '--' }

const A = '#00B4D8'

/* ── E-STOP overlay ── */
function EStopOverlay({ onConfirm, onCancel }: { onConfirm(): void; onCancel(): void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-2xl p-6 text-center w-full max-w-xs"
        style={{ background: 'var(--t-surface)', border: '2px solid #EF4444', boxShadow: '0 0 60px rgba(239,68,68,0.4)' }}>
        <TriangleAlert size={32} className="text-[#EF4444] mx-auto mb-3" />
        <div className="text-sm font-black text-[#EF4444] mb-1 tracking-widest">EMERGENCY STOP</div>
        <div className="text-xs mb-4" style={{ color: 'var(--t-muted)' }}>All motors halted immediately.</div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-bold border"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)' }}>CONFIRM</button>
        </div>
      </div>
    </div>
  )
}

/* ── Toast ── */
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-xl text-xs font-semibold shadow-xl pointer-events-none"
      style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderLeft: `3px solid ${A}`, color: 'var(--t-text)', backdropFilter: 'blur(12px)', maxWidth: '90vw', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  )
}

export default function ControlPage() {
  const { values, depth, batteryA, connected } = useSensorData()
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const [mode, setMode]               = useState<ControlMode>('MANUAL')
  const [speed, setSpeed]             = useState(50)
  const [navState, setNavState]       = useState<NavState>('STANDBY')
  const [eStopActive, setEStop]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fullscreen, setFullscreen]   = useState(false)
  const [toast, setToast]             = useState<string | null>(null)
  const [camDots, setCamDots]         = useState('')
  const [filterOn, setFilterOn]       = useState(true)
  const [jsSize, setJsSize]           = useState(84)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Camera dots */
  useEffect(() => {
    const t = setInterval(() => setCamDots(d => d.length >= 3 ? '' : d + '.'), 600)
    return () => clearInterval(t)
  }, [])

  /* Joystick size — JS only for the number, layout is CSS-driven */
  useEffect(() => {
    function update() {
      const isLand = window.innerWidth > window.innerHeight
      setJsSize(isLand ? 80 : 84)
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', () => setTimeout(update, 120))
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }, [])

  const handleNav = useCallback((v: JoystickVector) => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y)
    if (m > 0.08) { setNavState('MOVING'); setSpeed(clamp(Math.round(35 + m * 60))) }
    else setNavState('STANDBY')
  }, [])

  const handleThrottle = useCallback((v: JoystickVector) => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y)
    if (m > 0.05) setSpeed(clamp(Math.round(30 + m * 70)))
  }, [])

  const handleStop = () => {
    setNavState('STANDBY'); setSpeed(0)
    showToast('STOP — All movement halted.')
    setTimeout(() => setSpeed(50), 1500)
  }

  const depthVal = depth ?? 0
  const spdColor = speed > 70 ? '#EF4444' : speed > 40 ? '#F59E0B' : A

  const sensors = [
    { label: 'Temp',  value: fmt(values.temperature, 1), unit: '°C',  color: '#F05A22', icon: <Thermometer size={10} /> },
    { label: 'pH',    value: fmt(values.ph, 2),          unit: 'pH',  color: '#1A56DB', icon: <Droplets    size={10} /> },
    { label: 'TDS',   value: values.tds !== null ? String(Math.round(values.tds)) : '--', unit: 'ppm', color: A, icon: <Layers size={10} /> },
    { label: 'Turb',  value: fmt(values.turbidity, 1),   unit: 'NTU', color: '#F59E0B', icon: <Wind        size={10} /> },
    { label: 'Depth', value: fmt(depth, 1),              unit: 'm',   color: '#22C55E', icon: <Gauge       size={10} /> },
    { label: 'Bat',   value: batteryA !== null ? String(batteryA) : '--', unit: '%', color: '#F59E0B', icon: <BatteryMedium size={10} /> },
  ]

  /* ── Sensor pill (for strip) ── */
  const SensorPill = ({ label, value, unit, color, icon }: typeof sensors[0]) => (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg shrink-0"
      style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
      <span style={{ color }}>{icon}</span>
      <div>
        <div className="text-[7px] uppercase tracking-wide leading-none" style={{ color: 'var(--t-muted)' }}>{label}</div>
        <div className="text-[11px] font-bold font-[family-name:var(--font-jetbrains-mono)] leading-tight" style={{ color: 'var(--t-text)' }}>
          {value}<span className="text-[8px] font-normal ml-0.5" style={{ color: 'var(--t-muted)' }}>{unit}</span>
        </div>
      </div>
    </div>
  )

  /* ── TOP HUD bar — always visible ── */
  const HudBar = () => (
    <div className="shrink-0 border-b" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      {/* ROW 1: Mode + Stop + LIVE */}
      <div className="flex items-center justify-between px-2 py-1.5 gap-2">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black border"
            style={{ background: mode === 'MANUAL' ? `${A}18` : 'rgba(139,92,246,0.12)', borderColor: mode === 'MANUAL' ? `${A}55` : 'rgba(139,92,246,0.4)', color: mode === 'MANUAL' ? A : '#8B5CF6' }}>
            <Radio size={8} />{mode}
          </div>
          <button onClick={() => { setMode(m => m === 'MANUAL' ? 'AUTO' : 'MANUAL'); showToast('Mode changed') }}
            className="px-2 py-1 rounded-lg text-[9px] font-bold border"
            style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}>
            {mode === 'MANUAL' ? 'AUTO' : 'MANUAL'}
          </button>
          <button onClick={handleStop}
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black border active:scale-95"
            style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444' }}>
            <Power size={9} />STOP
          </button>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black border"
            style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />LIVE
          </div>
          {mounted && <button onClick={toggleTheme} className="p-1 rounded-lg theme-toggle" style={{ width: 26, height: 26 }}>{theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}</button>}
          <button onClick={() => setFullscreen(v => !v)} className="p-1 rounded-lg theme-toggle" style={{ width: 26, height: 26 }}>{fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}</button>
        </div>
      </div>
      {/* ROW 2: SPD bar + nav state */}
      <div className="flex items-center gap-2 px-2 pb-1.5">
        <span className="text-[8px] font-bold shrink-0" style={{ color: 'var(--t-muted)' }}>SPD</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${speed}%`, background: `linear-gradient(to right,${A},${spdColor})` }} />
        </div>
        <span className="text-[10px] font-black font-[family-name:var(--font-jetbrains-mono)] w-7 text-right shrink-0" style={{ color: spdColor }}>{speed}%</span>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: navState === 'MOVING' ? '#22C55E' : 'var(--t-border)', boxShadow: navState === 'MOVING' ? '0 0 5px #22C55E' : 'none' }} />
        <span className="text-[8px] font-bold shrink-0" style={{ color: navState === 'MOVING' ? '#22C55E' : 'var(--t-muted)' }}>{navState}</span>
        {!connected && <WifiOff size={10} style={{ color: '#F59E0B' }} />}
      </div>
    </div>
  )

  /* ── Camera feed ── */
  const CameraFeed = () => (
    <div className="relative flex-1 overflow-hidden" style={{ background: 'var(--t-surface-3)', minHeight: 0 }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <Camera size={26} style={{ color: A, opacity: 0.25 }} />
        <div className="text-[10px] font-semibold tracking-widest" style={{ color: `${A}88` }}>ESP32-CAM · LIVE FEED</div>
        <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>
          Connecting camera{camDots}
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: A, animation: `live-pulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.5 }} />
          ))}
        </div>
      </div>
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 3px,${A} 3px,${A} 4px)` }} />
      {/* Corner brackets */}
      {[
        { pos: 'top-2 left-2',    bt: 1.5, bb: 0,   bl: 1.5, br: 0   },
        { pos: 'top-2 right-2',   bt: 1.5, bb: 0,   bl: 0,   br: 1.5 },
        { pos: 'bottom-2 left-2',  bt: 0,  bb: 1.5, bl: 1.5, br: 0   },
        { pos: 'bottom-2 right-2', bt: 0,  bb: 1.5, bl: 0,   br: 1.5 },
      ].map(({ pos, bt, bb, bl, br }, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`}
          style={{ borderColor: `${A}55`, borderStyle: 'solid', borderTopWidth: bt, borderBottomWidth: bb, borderLeftWidth: bl, borderRightWidth: br }} />
      ))}
      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-1 pointer-events-none"
        style={{ background: `linear-gradient(to top, var(--t-surface-3), transparent)` }}>
        {[`ROV-01`, mode, `${depthVal.toFixed(1)}m`].map(t => (
          <span key={t} className="text-[8px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: `${A}55` }}>{t}</span>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {showConfirm && (
        <EStopOverlay
          onConfirm={() => {
            setShowConfirm(false); setEStop(true); setNavState('STANDBY'); setSpeed(0)
            showToast('⚠ E-STOP ACTIVE!')
            setTimeout(() => { setEStop(false); setSpeed(50) }, 5000)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {toast && <Toast msg={toast} />}
      {eStopActive && (
        <div className="fixed top-0 left-0 right-0 z-[150] py-1.5 text-center text-xs font-black text-white"
          style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)', animation: 'live-pulse 0.5s ease-in-out infinite' }}>
          ⚠ E-STOP ACTIVE — ALL MOTORS HALTED
        </div>
      )}

      {/* ROOT — flex-col in portrait, flex-row in landscape (CSS-driven) */}
      <div
        className="flex flex-col landscape:flex-row overflow-hidden select-none"
        style={{ height: '100%', background: 'var(--t-bg)', touchAction: 'none' }}
      >
        {/* ── 1. TOP HUD — always visible ── */}
        <HudBar />

        {/* ── 2. SENSOR STRIP — portrait only (hidden in landscape) ── */}
        <div className="shrink-0 flex overflow-x-auto landscape:hidden border-b"
          style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
          <div className="flex gap-1.5 px-2 py-1.5" style={{ width: 'max-content' }}>
            {sensors.map((s, i) => <SensorPill key={i} {...s} />)}
          </div>
        </div>

        {/* ── 3. MIDDLE FLEX ROW — fills remaining space ── */}
        <div className="flex-1 flex flex-col landscape:flex-row min-h-0">

          {/* LEFT SENSOR SIDEBAR — landscape only ── */}
          <div className="hidden landscape:flex flex-col shrink-0 border-r overflow-y-auto"
            style={{ width: 120, borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
            {/* Mode + Stop header */}
            <div className="shrink-0 flex items-center gap-1 px-2 py-2 border-b"
              style={{ borderColor: 'var(--t-border)' }}>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black border"
                style={{ background: mode === 'MANUAL' ? `${A}18` : 'rgba(139,92,246,0.12)', borderColor: mode === 'MANUAL' ? `${A}55` : 'rgba(139,92,246,0.4)', color: mode === 'MANUAL' ? A : '#8B5CF6' }}>
                <Radio size={7} />{mode}
              </div>
              <button onClick={handleStop}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black border active:scale-95"
                style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444' }}>
                <Power size={7} />STOP
              </button>
            </div>
            {/* Sensor rows */}
            <div className="flex flex-col gap-1 p-1.5 overflow-y-auto flex-1">
              {sensors.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                  style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <div>
                    <div className="text-[7px] uppercase tracking-wide" style={{ color: 'var(--t-muted)' }}>{s.label}</div>
                    <div className="text-[10px] font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>
                      {s.value}<span className="text-[7px] font-normal ml-0.5" style={{ color: 'var(--t-muted)' }}>{s.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Status footer */}
            <div className="shrink-0 border-t p-1.5 flex flex-col gap-1"
              style={{ borderColor: 'var(--t-border)' }}>
              <div className="flex items-center gap-1">
                <span className="text-[7px] font-bold" style={{ color: 'var(--t-muted)' }}>SPD</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${speed}%`, background: `linear-gradient(to right,${A},${spdColor})` }} />
                </div>
                <span className="text-[8px] font-black w-5 text-right font-[family-name:var(--font-jetbrains-mono)]" style={{ color: spdColor }}>{speed}%</span>
              </div>
              <button onClick={() => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ON'}`) }}
                className="flex items-center justify-center gap-1 py-1 rounded-lg border active:scale-95 transition-all text-[8px] font-black"
                style={{ background: filterOn ? `${A}18` : 'var(--t-surface-2)', borderColor: filterOn ? `${A}55` : 'var(--t-border)', color: filterOn ? A : 'var(--t-muted)' }}>
                <Filter size={9} />FILTER {filterOn ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* CAMERA FEED — fills remaining space ── */}
          <CameraFeed />

          {/* RIGHT CONTROLS — landscape only ── */}
          <div className="hidden landscape:flex flex-col shrink-0 items-center justify-between border-l py-2 px-2 gap-2"
            style={{ width: 130, borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
            <VirtualJoystick label="NAVIGASI" size={jsSize} onChange={handleNav} accentColor={A} />
            {/* E-STOP */}
            <button onClick={() => setShowConfirm(true)}
              className="rounded-full flex flex-col items-center justify-center active:scale-90 transition-all"
              style={{
                width: Math.max(56, jsSize * 0.75), height: Math.max(56, jsSize * 0.75),
                background: eStopActive ? 'radial-gradient(circle,#B91C1C,#7F1D1D)' : 'radial-gradient(circle,#EF4444,#B91C1C)',
                boxShadow: '0 0 20px rgba(239,68,68,0.5)', border: '2px solid rgba(255,255,255,0.2)',
              }}>
              <TriangleAlert size={Math.max(14, jsSize * 0.2)} className="text-white mb-0.5" />
              <span className="text-[8px] font-black text-white tracking-widest leading-none">E-STOP</span>
            </button>
            <VirtualJoystick label="THROTTLE" size={jsSize} onChange={handleThrottle} accentColor="#F05A22" />
          </div>
        </div>

        {/* ── 4. BOTTOM CONTROLS — portrait only ── */}
        <div className="shrink-0 landscape:hidden border-t flex items-center justify-between gap-2"
          style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)', padding: '8px 16px' }}>
          {/* Left: Nav joystick only */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <VirtualJoystick label="NAVIGASI" size={jsSize} onChange={handleNav} accentColor={A} />
            {/* Filter only — net is manual */}
            <button
              onClick={() => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ON'}`) }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border active:scale-95 transition-all text-[9px] font-black"
              style={{ background: filterOn ? `${A}18` : 'var(--t-surface-2)', borderColor: filterOn ? `${A}55` : 'var(--t-border)', color: filterOn ? A : 'var(--t-muted)' }}
            >
              <Filter size={10} />
              {filterOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Center: depth bar + E-STOP */}
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0" style={{ maxWidth: 140 }}>
            <div className="w-full flex items-center gap-1">
              <span className="text-[8px] font-bold shrink-0" style={{ color: 'var(--t-muted)' }}>DEPTH</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((depthVal / 10) * 100, 100)}%`, background: 'linear-gradient(to right,#22C55E,#1A56DB)' }} />
              </div>
              <span className="text-[8px] font-bold font-[family-name:var(--font-jetbrains-mono)] text-[#22C55E] shrink-0">{depthVal.toFixed(1)}m</span>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-full flex flex-col items-center justify-center active:scale-90 transition-all relative"
              style={{
                width: jsSize * 0.85, height: jsSize * 0.85,
                minWidth: 60, minHeight: 60,
                background: eStopActive ? 'radial-gradient(circle,#B91C1C,#7F1D1D)' : 'radial-gradient(circle,#EF4444,#B91C1C)',
                boxShadow: '0 0 20px rgba(239,68,68,0.5)',
                border: '2.5px solid rgba(255,255,255,0.2)',
              }}
            >
              <TriangleAlert size={Math.max(16, jsSize * 0.22)} className="text-white mb-0.5" />
              <span className="text-[9px] font-black text-white tracking-widest leading-none">E-STOP</span>
            </button>

            <span className="text-[6px] text-center" style={{ color: 'var(--t-muted)', opacity: 0.5 }}>DEMO · NOT TRANSMITTED</span>
          </div>

          {/* Right: Throttle joystick */}
          <div className="shrink-0">
            <VirtualJoystick label="THROTTLE" size={jsSize} onChange={handleThrottle} accentColor="#F05A22" />
          </div>
        </div>
      </div>
    </>
  )
}
