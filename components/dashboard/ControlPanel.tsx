'use client'

import {
    Anchor,
    ArrowDown, ArrowLeft, ArrowRight,
    ArrowUp,
    ChevronDown,
    ChevronUp,
    Filter,
    Power,
    TriangleAlert
} from 'lucide-react'
import { useRef, useState } from 'react'

// ── Toast ─────────────────────────────────────────────────────────────
interface Toast {
  id:  number
  msg: string
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#F8FAFF] shadow-2xl animate-fade-up"
          style={{
            background:  '#1C2A4A',
            border:      '1px solid #1E2D50',
            borderLeft:  '4px solid #F05A22',
            minWidth:    260,
          }}
        >
          <TriangleAlert size={14} className="text-[#F05A22] shrink-0" />
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── Direction Button ──────────────────────────────────────────────────
interface DirBtnProps {
  icon:    React.ReactNode
  label:   string
  onClick: () => void
  large?:  boolean
}

function DirBtn({ icon, label, onClick, large }: DirBtnProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        flex items-center justify-center rounded-xl
        bg-[#1C2A4A] border border-[#1E2D50]
        hover:bg-[#1A56DB]/20 hover:border-[#1A56DB]/60
        active:scale-95 active:bg-[#1A56DB]/30
        transition-all duration-150 select-none
        ${large ? 'w-14 h-14' : 'w-11 h-11'}
      `}
    >
      <span className="text-[#8B9EC7] group-hover:text-[#F8FAFF]">{icon}</span>
    </button>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────────
interface ToggleProps {
  label:    string
  icon:     React.ReactNode
  active:   boolean
  onToggle: () => void
  color?:   string
}

function ToggleSwitch({ label, icon, active, onToggle, color = '#1A56DB' }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#1C2A4A] border border-[#1E2D50] hover:border-[#1A56DB]/50 transition-all"
    >
      <div className="flex items-center gap-2.5">
        <span style={{ color: active ? color : '#8B9EC7' }}>{icon}</span>
        <span className="text-sm font-medium text-[#F8FAFF]">{label}</span>
      </div>
      {/* Toggle pill */}
      <div
        className={`relative w-10 h-5.5 rounded-full border transition-all duration-300 ${
          active ? 'border-transparent' : 'border-[#1E2D50] bg-[#0D1B3E]'
        }`}
        style={active ? { background: color } : {}}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#F8FAFF] shadow-md transition-all duration-300 ${
            active ? 'left-5' : 'left-0.5'
          }`}
        />
      </div>
    </button>
  )
}

// ── Main control panel ────────────────────────────────────────────────
export default function ControlPanel() {
  const [toasts, setToasts]       = useState<Toast[]>([])
  const [netOpen, setNetOpen]     = useState(false)
  const [filterOn, setFilterOn]   = useState(true)
  const counterRef                = useRef(0)

  function showToast(msg = 'Demo mode — commands not transmitted.') {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  const demo = () => showToast()

  function handleNetToggle() {
    setNetOpen(v => !v)
    showToast(`Net ${netOpen ? 'CLOSED' : 'OPEN'} — Demo mode, command not transmitted.`)
  }

  function handleFilterToggle() {
    setFilterOn(v => !v)
    showToast(`Filter ${filterOn ? 'OFF' : 'ON'} — Demo mode, command not transmitted.`)
  }

  return (
    <>
      <ToastStack toasts={toasts} />

      <section
        role="region"
        aria-label="Control panel (demo mode)"
        className="mt-6 rounded-2xl bg-[#111827] border border-[#F05A22]/30 overflow-hidden"
      >
        {/* ── Warning header ─────────────────────────── */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#1E2D50] bg-[#7A2D11]/20">
          <TriangleAlert size={16} className="text-[#F05A22] shrink-0" />
          <div>
            <div className="text-sm font-bold text-[#F05A22] tracking-wide">
              CONTROL PANEL — DEMO MODE
            </div>
            <div className="text-xs text-[#8B9EC7] mt-0.5">
              Commands are not transmitted. This is a UI demonstration only.
            </div>
          </div>
          <span className="ml-auto shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F05A22]/15 text-[#F05A22] border border-[#F05A22]/30">
            OFFLINE
          </span>
        </div>

        {/* ── Content ───────────────────────────────── */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Directional controls */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8B9EC7]">Directional</span>
            <div className="flex flex-col items-center gap-2">
              {/* Forward */}
              <DirBtn icon={<ArrowUp size={20} />} label="Forward" onClick={demo} large />
              {/* Left / Right */}
              <div className="flex gap-2">
                <DirBtn icon={<ArrowLeft size={20} />}  label="Left"  onClick={demo} large />
                {/* Center stop */}
                <button
                  onClick={demo}
                  aria-label="Stop"
                  title="Stop"
                  className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 active:scale-95 transition-all text-[#EF4444] font-bold text-xs"
                >
                  STOP
                </button>
                <DirBtn icon={<ArrowRight size={20} />} label="Right" onClick={demo} large />
              </div>
              {/* Back */}
              <DirBtn icon={<ArrowDown size={20} />} label="Back" onClick={demo} large />
            </div>
          </div>

          {/* Depth controls */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8B9EC7]">Depth Control</span>
            <div className="flex flex-col items-center gap-3">
              <DirBtn icon={<ChevronUp size={22} />} label="Ascend" onClick={demo} large />
              <div className="text-center">
                <div className="text-xs text-[#8B9EC7]">Target depth</div>
                <div className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)] text-[#F8FAFF]">
                  1.2 m
                </div>
              </div>
              <DirBtn icon={<ChevronDown size={22} />} label="Descend" onClick={demo} large />
            </div>
          </div>

          {/* System toggles */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8B9EC7]">Systems</span>
            <div className="flex flex-col gap-3">
              <ToggleSwitch
                label="Net"
                icon={<Anchor size={14} />}
                active={netOpen}
                onToggle={handleNetToggle}
                color="#22C55E"
              />
              <ToggleSwitch
                label="Filter"
                icon={<Filter size={14} />}
                active={filterOn}
                onToggle={handleFilterToggle}
                color="#1A56DB"
              />
              <button
                onClick={() => showToast('Emergency stop — Demo mode, command not transmitted.')}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 active:scale-95 transition-all text-[#EF4444] text-sm font-bold"
              >
                <Power size={14} />
                Emergency Stop
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
