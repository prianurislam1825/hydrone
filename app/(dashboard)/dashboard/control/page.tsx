'use client'

import VirtualJoystick, { type JoystickVector } from '@/components/dashboard/VirtualJoystick'
import { useSensorData } from '@/lib/dashboard/useSensorData'
import { useTheme } from '@/lib/theme/useTheme'
import {
  BatteryMedium, Camera, ChevronLeft, ChevronRight,
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

function clampV(v: number) { return Math.min(100, Math.max(0, v)) }
function fmt(v: number | null, d = 1) { return v !== null ? v.toFixed(d) : '--' }
const A = '#00B4D8'

/* ── E-STOP overlay ─────────────────────────────────── */
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

/* ── Toast ──────────────────────────────────────────── */
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-xl text-xs font-semibold shadow-xl pointer-events-none"
      style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)', borderLeft: `3px solid ${A}`, color: 'var(--t-text)', backdropFilter: 'blur(12px)', maxWidth: '90vw', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  )
}

/* ══ Main ═════════════════════════════════════════════ */
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
  const [sidebarOpen, setSidebarOpen] = useState(false)  // landscape slide panel
  const [isLandscape, setIsLandscape] = useState(false)
  const [jsSize, setJsSize]           = useState(88)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Camera dots */
  useEffect(() => {
    const t = setInterval(() => setCamDots(d => d.length >= 3 ? '' : d + '.'), 600)
    return () => clearInterval(t)
  }, [])

  /* Orientation + joystick size detection via matchMedia — works on all browsers */
  useEffect(() => {
    function update() {
      const land = window.matchMedia('(orientation: landscape)').matches
      setIsLandscape(land)
      const w = window.innerWidth
      const h = window.innerHeight
      if (land) {
        setJsSize(Math.max(72, Math.min(Math.round(h * 0.3), 100)))
      } else {
        setJsSize(Math.max(80, Math.min(Math.round(w * 0.22), 96)))
      }
    }
    update()
    const mql = window.matchMedia('(orientation: landscape)')
    mql.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => { mql.removeEventListener('change', update); window.removeEventListener('resize', update) }
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }, [])

  const handleNav = useCallback((v: JoystickVector) => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y)
    if (m > 0.08) { setNavState('MOVING'); setSpeed(clampV(Math.round(35 + m * 60))) }
    else setNavState('STANDBY')
  }, [])

  const handleThrottle = useCallback((v: JoystickVector) => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y)
    if (m > 0.05) setSpeed(clampV(Math.round(30 + m * 70)))
  }, [])

  const handleStop = () => {
    setNavState('STANDBY'); setSpeed(0)
    showToast('STOP — All movement halted.')
    setTimeout(() => setSpeed(50), 1500)
  }

  const depthVal = depth ?? 0
  const spdColor = speed > 70 ? '#EF4444' : speed > 40 ? '#F59E0B' : A

  const sensors = [
    { label: 'Temp',  value: fmt(values.temperature, 1), unit: '°C',  color: '#F05A22', icon: <Thermometer size={11} /> },
    { label: 'pH',    value: fmt(values.ph, 2),          unit: 'pH',  color: '#1A56DB', icon: <Droplets    size={11} /> },
    { label: 'TDS',   value: values.tds !== null ? String(Math.round(values.tds)) : '--', unit: 'ppm', color: A, icon: <Layers size={11} /> },
    { label: 'Turb',  value: fmt(values.turbidity, 1),   unit: 'NTU', color: '#F59E0B', icon: <Wind        size={11} /> },
    { label: 'Depth', value: fmt(depth, 1),              unit: 'm',   color: '#22C55E', icon: <Gauge       size={11} /> },
    { label: 'Bat',   value: batteryA !== null ? String(batteryA) : '--', unit: '%', color: '#F59E0B', icon: <BatteryMedium size={11} /> },
  ]

  /* ── E-STOP button ── */
  const EStopBtn = ({ size: s }: { size: number }) => (
    <button onClick={() => setShowConfirm(true)}
      style={{ width: s, height: s, borderRadius: '50%', flexShrink: 0,
        background: eStopActive ? 'radial-gradient(circle,#B91C1C,#7F1D1D)' : 'radial-gradient(circle,#EF4444,#B91C1C)',
        boxShadow: '0 0 24px rgba(239,68,68,0.6)', border: '3px solid rgba(255,255,255,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'transform 0.1s' }}
      onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
      onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <TriangleAlert size={Math.max(14, s * 0.22)} color="white" />
      <span style={{ fontSize: 9, fontWeight: 900, color: 'white', letterSpacing: '0.1em', lineHeight: 1 }}>E-STOP</span>
    </button>
  )

  /* ── HUD top bar (shared) ── */
  const HudBar = () => (
    <div style={{ flexShrink: 0, background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border)' }}>
      {/* Row 1: mode + stop + live + theme */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 900,
            background: mode === 'MANUAL' ? `${A}18` : 'rgba(139,92,246,0.12)',
            border: `1px solid ${mode === 'MANUAL' ? `${A}55` : 'rgba(139,92,246,0.4)'}`,
            color: mode === 'MANUAL' ? A : '#8B5CF6' }}>
            <Radio size={8} />{mode}
          </div>
          <button onClick={() => { setMode(m => m === 'MANUAL' ? 'AUTO' : 'MANUAL'); showToast('Mode changed') }}
            style={{ padding: '4px 7px', borderRadius: 7, fontSize: 9, fontWeight: 700, cursor: 'pointer',
              background: 'var(--t-surface-2)', border: '1px solid var(--t-border)', color: 'var(--t-muted)' }}>
            {mode === 'MANUAL' ? 'AUTO' : 'MANUAL'}
          </button>
          <button onClick={handleStop}
            style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 8px', borderRadius: 7, fontSize: 10, fontWeight: 900, cursor: 'pointer',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444' }}>
            <Power size={9} />STOP
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 7px', borderRadius: 99, fontSize: 8, fontWeight: 900,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', animation: 'live-pulse 2s ease-in-out infinite', display: 'inline-block' }} />LIVE
          </div>
          {!connected && <WifiOff size={11} color="#F59E0B" />}
          {mounted && (
            <button onClick={toggleTheme} className="theme-toggle" style={{ width: 26, height: 26 }}>
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          )}
          <button onClick={() => setFullscreen(v => !v)} className="theme-toggle" style={{ width: 26, height: 26 }}>
            {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          {/* Landscape: toggle sidebar */}
          {isLandscape && (
            <button onClick={() => setSidebarOpen(v => !v)} className="theme-toggle" style={{ width: 26, height: 26 }}
              title={sidebarOpen ? 'Hide sensors' : 'Show sensors'}>
              {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
            </button>
          )}
        </div>
      </div>
      {/* Row 2: SPD + nav state */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px 6px' }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--t-muted)', flexShrink: 0 }}>SPD</span>
        <div style={{ flex: 1, height: 5, borderRadius: 99, overflow: 'hidden', background: 'var(--t-bg)', border: '1px solid var(--t-border)' }}>
          <div style={{ height: '100%', width: `${speed}%`, background: `linear-gradient(to right,${A},${spdColor})`, borderRadius: 99, transition: 'width 0.4s' }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 900, color: spdColor, width: 28, textAlign: 'right', fontFamily: 'var(--font-jetbrains-mono)', flexShrink: 0 }}>{speed}%</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: navState === 'MOVING' ? '#22C55E' : 'var(--t-border)', flexShrink: 0 }} />
        <span style={{ fontSize: 8, fontWeight: 700, color: navState === 'MOVING' ? '#22C55E' : 'var(--t-muted)', flexShrink: 0 }}>{navState}</span>
      </div>
    </div>
  )

  /* ── Camera feed ── */
  const CameraFeed = () => (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--t-surface-3)', minHeight: 0, minWidth: 0 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, pointerEvents: 'none' }}>
        <Camera size={28} style={{ color: A, opacity: 0.25 }} />
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: `${A}88` }}>ESP32-CAM · LIVE FEED</div>
        <div style={{ fontSize: 9, color: 'var(--t-muted)', opacity: 0.6, fontFamily: 'var(--font-jetbrains-mono)' }}>
          Connecting camera{camDots}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: A, opacity: 0.5, animation: `live-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
        </div>
      </div>
      {/* Scan lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 3px,${A} 3px,${A} 4px)` }} />
      {/* Corner brackets */}
      {[
        { top: 8, left: 8,   bt: 1.5, bb: 0,   bl: 1.5, br: 0   },
        { top: 8, right: 8,  bt: 1.5, bb: 0,   bl: 0,   br: 1.5 },
        { bottom: 8, left: 8,  bt: 0,  bb: 1.5, bl: 1.5, br: 0   },
        { bottom: 8, right: 8, bt: 0,  bb: 1.5, bl: 0,   br: 1.5 },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', width: 20, height: 20, pointerEvents: 'none',
          ...('top'    in b ? { top:    b.top }    : { bottom: b.bottom }),
          ...('left'   in b ? { left:   b.left }   : { right:  b.right }),
          borderColor: `${A}55`, borderStyle: 'solid',
          borderTopWidth: b.bt, borderBottomWidth: b.bb, borderLeftWidth: b.bl, borderRightWidth: b.br }} />
      ))}
      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between',
        padding: '4px 12px', background: `linear-gradient(to top, var(--t-surface-3), transparent)`, pointerEvents: 'none' }}>
        {[`ROV-01`, mode, `${depthVal.toFixed(1)}m`].map(t => (
          <span key={t} style={{ fontSize: 8, color: `${A}55`, fontFamily: 'var(--font-jetbrains-mono)' }}>{t}</span>
        ))}
      </div>
    </div>
  )

  /* ══ PORTRAIT layout ══════════════════════════════════════════ */
  if (!isLandscape) {
    return (
      <>
        {showConfirm && <EStopOverlay onConfirm={() => { setShowConfirm(false); setEStop(true); setNavState('STANDBY'); setSpeed(0); showToast('⚠ E-STOP ACTIVE!'); setTimeout(() => { setEStop(false); setSpeed(50) }, 5000) }} onCancel={() => setShowConfirm(false)} />}
        {toast && <Toast msg={toast} />}
        {eStopActive && <div className="fixed top-0 left-0 right-0 z-[150] py-1.5 text-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)', animation: 'live-pulse 0.5s ease-in-out infinite' }}>⚠ E-STOP ACTIVE</div>}

        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--t-bg)', overflow: 'hidden', touchAction: 'none' }}>
          <HudBar />

          {/* Sensor strip — horizontal scroll */}
          <div style={{ flexShrink: 0, overflowX: 'auto', background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border)' }}>
            <div style={{ display: 'flex', gap: 6, padding: '6px 10px', width: 'max-content' }}>
              {sensors.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 10, flexShrink: 0, background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 7, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t-muted)', lineHeight: 1 }}>{s.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--t-text)', lineHeight: 1.2 }}>
                      {s.value}<span style={{ fontSize: 8, fontWeight: 400, color: 'var(--t-muted)', marginLeft: 2 }}>{s.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera — fills remaining space */}
          <CameraFeed />

          {/* Bottom controls */}
          <div style={{ flexShrink: 0, background: 'var(--t-surface)', borderTop: '1px solid var(--t-border)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {/* Left: nav + filter */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <VirtualJoystick label="NAVIGASI" size={jsSize} onChange={handleNav} accentColor={A} />
              <button onClick={() => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ON'}`) }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, fontSize: 9, fontWeight: 900, cursor: 'pointer',
                  background: filterOn ? `${A}18` : 'var(--t-surface-2)', border: `1px solid ${filterOn ? `${A}55` : 'var(--t-border)'}`, color: filterOn ? A : 'var(--t-muted)' }}>
                <Filter size={10} />FILTER {filterOn ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Center: depth + E-STOP */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, maxWidth: 140 }}>
              {/* Depth bar */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--t-muted)', flexShrink: 0 }}>DEPTH</span>
                <div style={{ flex: 1, height: 5, borderRadius: 99, overflow: 'hidden', background: 'var(--t-bg)', border: '1px solid var(--t-border)' }}>
                  <div style={{ height: '100%', width: `${Math.min((depthVal / 10) * 100, 100)}%`, background: 'linear-gradient(to right,#22C55E,#1A56DB)', borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#22C55E', flexShrink: 0, fontFamily: 'var(--font-jetbrains-mono)' }}>{depthVal.toFixed(1)}m</span>
              </div>
              <EStopBtn size={Math.max(64, jsSize * 0.85)} />
              <span style={{ fontSize: 7, color: 'var(--t-muted)', opacity: 0.5, textAlign: 'center' }}>DEMO · NOT TRANSMITTED</span>
            </div>

            {/* Right: throttle */}
            <div style={{ flexShrink: 0 }}>
              <VirtualJoystick label="THROTTLE" size={jsSize} onChange={handleThrottle} accentColor="#F05A22" />
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ══ LANDSCAPE layout ═════════════════════════════════════════ */
  return (
    <>
      {showConfirm && <EStopOverlay onConfirm={() => { setShowConfirm(false); setEStop(true); setNavState('STANDBY'); setSpeed(0); showToast('⚠ E-STOP ACTIVE!'); setTimeout(() => { setEStop(false); setSpeed(50) }, 5000) }} onCancel={() => setShowConfirm(false)} />}
      {toast && <Toast msg={toast} />}
      {eStopActive && <div className="fixed top-0 left-0 right-0 z-[150] py-1.5 text-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg,#EF4444,#B91C1C)', animation: 'live-pulse 0.5s ease-in-out infinite' }}>⚠ E-STOP ACTIVE</div>}

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--t-bg)', overflow: 'hidden', touchAction: 'none' }}>
        <HudBar />

        {/* Main row: [sidebar] + camera + [joystick panel] */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* Slide-in sensor sidebar */}
          <div style={{
            width: sidebarOpen ? 130 : 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 0.25s ease',
            borderRight: sidebarOpen ? '1px solid var(--t-border)' : 'none',
            background: 'var(--t-surface)',
          }}>
            <div style={{ width: 130, height: '100%', overflow: 'hidden auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 8px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {sensors.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 7px', borderRadius: 9, background: 'var(--t-surface-2)', border: '1px solid var(--t-border)' }}>
                    <span style={{ color: s.color, flexShrink: 0 }}>{s.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 7, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t-muted)' }}>{s.label}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--t-text)' }}>
                        {s.value}<span style={{ fontSize: 8, fontWeight: 400, color: 'var(--t-muted)', marginLeft: 2 }}>{s.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Filter in sidebar */}
                <button onClick={() => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ON'}`) }}
                  style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '5px', borderRadius: 8, fontSize: 9, fontWeight: 900, cursor: 'pointer',
                    background: filterOn ? `${A}18` : 'var(--t-surface-2)', border: `1px solid ${filterOn ? `${A}55` : 'var(--t-border)'}`, color: filterOn ? A : 'var(--t-muted)' }}>
                  <Filter size={10} />FILTER {filterOn ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Camera — fullscreen center */}
          <CameraFeed />

          {/* Right: dual joystick + E-STOP panel */}
          <div style={{ width: jsSize + 28, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px', background: 'var(--t-surface)', borderLeft: '1px solid var(--t-border)', gap: 6 }}>
            <VirtualJoystick label="NAVIGASI" size={jsSize} onChange={handleNav} accentColor={A} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {/* Depth mini */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: jsSize + 12 }}>
                <span style={{ fontSize: 7, fontWeight: 700, color: 'var(--t-muted)', flexShrink: 0 }}>D</span>
                <div style={{ flex: 1, height: 4, borderRadius: 99, overflow: 'hidden', background: 'var(--t-bg)', border: '1px solid var(--t-border)' }}>
                  <div style={{ height: '100%', width: `${Math.min((depthVal / 10) * 100, 100)}%`, background: 'linear-gradient(to right,#22C55E,#1A56DB)' }} />
                </div>
                <span style={{ fontSize: 7, color: '#22C55E', fontFamily: 'var(--font-jetbrains-mono)', flexShrink: 0 }}>{depthVal.toFixed(1)}m</span>
              </div>
              <EStopBtn size={Math.max(56, jsSize * 0.75)} />
            </div>

            <VirtualJoystick label="THROTTLE" size={jsSize} onChange={handleThrottle} accentColor="#F05A22" />
          </div>
        </div>
      </div>
    </>
  )
}
