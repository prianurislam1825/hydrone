'use client'

import { useCallback, useRef, useState } from 'react'
import { TriangleAlert, Maximize2, Minimize2 } from 'lucide-react'
import VirtualJoystick, { type JoystickVector } from '@/components/dashboard/VirtualJoystick'
import { useSensorData } from '@/lib/dashboard/useSensorData'

type Mode = 'MANUAL' | 'AUTO'

export default function ControlPage() {
  const [mode, setMode]           = useState<Mode>('MANUAL')
  const [speed, setSpeed]         = useState(50)
  const [fullscreen, setFullscreen] = useState(false)
  const [eStopActive, setEStop]   = useState(false)
  const [toast, setToast]         = useState<string | null>(null)
  const toastTimer                = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { values, depth }         = useSensorData()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const handleNav      = useCallback((v: JoystickVector) => {
    if (Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05) {
      setSpeed(Math.round(40 + Math.sqrt(v.x*v.x + v.y*v.y) * 50))
    }
  }, [])

  const handleThrottle = useCallback((_v: JoystickVector) => {}, [])

  const handleEStop = () => {
    setEStop(true)
    showToast('E-STOP aktif — semua motor dihentikan.')
    setTimeout(() => setEStop(false), 3000)
  }

  return (
    <div
      className="relative flex flex-col"
      style={{
        background: '#050A14',
        minHeight:  fullscreen ? '100dvh' : 'calc(100dvh - 128px)',
      }}
    >
      {/* Toast */}
      {toast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl animate-fade-up pointer-events-none"
          style={{ background: '#1C2A4A', border: '1px solid #1E2D50', borderLeft: '3px solid #F05A22', color: '#F8FAFF', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2.5">
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('MANUAL'); showToast('Mode Manual aktif.') }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
            style={{ background: mode === 'MANUAL' ? 'rgba(26,86,219,0.25)' : 'rgba(255,255,255,0.05)', borderColor: mode === 'MANUAL' ? '#1A56DB' : 'rgba(255,255,255,0.1)', color: mode === 'MANUAL' ? '#1A56DB' : '#8B9EC7' }}
          >
            MANUAL
          </button>
          <button
            onClick={() => { setMode('AUTO'); showToast('Mode Auto aktif — Demo mode.') }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
            style={{ background: mode === 'AUTO' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', borderColor: mode === 'AUTO' ? '#22C55E' : 'rgba(255,255,255,0.1)', color: mode === 'AUTO' ? '#22C55E' : '#8B9EC7' }}
          >
            AUTO
          </button>
          {eStopActive && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EF4444]/25 border border-[#EF4444] text-[#EF4444]">
              ● STOP
            </span>
          )}
        </div>

        {/* Speed bar */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] text-[#8B9EC7] font-bold">SPD</span>
          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${speed}%`, background: '#22C55E' }} />
          </div>
          <span className="text-[10px] text-[#22C55E] font-bold font-[family-name:var(--font-jetbrains-mono)]">{speed}%</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <span className="live-badge text-[10px]"><span className="live-dot" style={{ width: 6, height: 6 }} />LIVE</span>
          <button
            onClick={() => setFullscreen(v => !v)}
            className="p-1.5 rounded-lg transition-all hover:opacity-70"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#8B9EC7' }}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── Camera feed area ─────────────────────────────────────── */}
      <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: 200 }}>
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(26,86,219,0.3) 3px, rgba(26,86,219,0.3) 4px)' }} />
        {/* Corner brackets */}
        {[['top-8 left-8', 'border-t border-l'], ['top-8 right-8', 'border-t border-r'], ['bottom-36 left-8', 'border-b border-l'], ['bottom-36 right-8', 'border-b border-r']].map(([pos, b], i) => (
          <div key={i} className={`absolute ${pos} w-6 h-6 border-[#1A56DB]/40 ${b}`} />
        ))}
        {/* Camera placeholder */}
        <div className="text-center">
          <div className="text-[10px] font-semibold tracking-widest text-[#8B9EC7] mb-1">ESP32-CAM · LIVE FEED</div>
          <div className="text-[10px] text-[#8B9EC7]/60 font-[family-name:var(--font-jetbrains-mono)]">Menghubungkan kamera…</div>
        </div>

        {/* ── Sensor overlay (left side) ─────────────────────────── */}
        <div className="absolute left-3 top-12 flex flex-col gap-1.5">
          {[
            { label: '°C',  val: values.temperature.toFixed(1) },
            { label: 'pH',  val: values.ph.toFixed(2) },
            { label: 'm',   val: depth.toFixed(1) },
            { label: '%',   val: '78' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px]"
              style={{ background: 'rgba(13,27,62,0.7)', border: '1px solid rgba(26,86,219,0.2)', backdropFilter: 'blur(6px)' }}>
              <span className="font-bold font-[family-name:var(--font-jetbrains-mono)] text-[#F8FAFF]">{s.val}</span>
              <span className="text-[#8B9EC7]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom HUD info */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#8B9EC7]/60">HYDRONE · CAM-01</div>
          <div className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#8B9EC7]/60">MODE: {mode}</div>
        </div>
      </div>

      {/* ── Bottom controls (DJI layout) ─────────────────────────── */}
      <div className="relative z-10 flex items-end justify-between px-6 pb-4 pt-2">
        {/* Left joystick — Navigation */}
        <VirtualJoystick label="Navigasi" size={90} onChange={handleNav} />

        {/* Center E-STOP */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleEStop}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90"
            style={{
              background:   eStopActive ? '#B91C1C' : '#EF4444',
              boxShadow:    `0 0 24px ${eStopActive ? 'rgba(185,28,28,0.8)' : 'rgba(239,68,68,0.5)'}`,
            }}
          >
            <div className="text-center">
              <TriangleAlert size={16} className="text-white mx-auto" />
              <span className="text-[8px] font-black text-white leading-none">E-STOP</span>
            </div>
          </button>
        </div>

        {/* Right joystick — Throttle */}
        <VirtualJoystick label="Throttle" size={90} onChange={handleThrottle} />
      </div>

      {/* Demo watermark */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#8B9EC7]/30 font-[family-name:var(--font-jetbrains-mono)] pointer-events-none z-0">
        DEMO MODE — COMMANDS NOT TRANSMITTED
      </div>
    </div>
  )
}
