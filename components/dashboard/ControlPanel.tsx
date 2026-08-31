'use client'

import { Anchor, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronUp, Filter, Power, TriangleAlert } from 'lucide-react';
import { useRef, useState } from 'react';

interface Toast { id: number; msg: string }

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-up" style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-border)', borderLeft: '4px solid #F05A22', color: 'var(--t-text)', minWidth: 260 }}>
          <TriangleAlert size={14} className="text-[#F05A22] shrink-0" />
          {t.msg}
        </div>
      ))}
    </div>
  )
}

function DirBtn({ icon, label, onClick, large }: { icon: React.ReactNode; label: string; onClick: () => void; large?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex items-center justify-center rounded-xl transition-all duration-150 select-none active:scale-95 border ${large ? 'w-14 h-14' : 'w-11 h-11'}`}
      style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(26,86,219,0.2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,86,219,0.6)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--t-surface-2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--t-border)' }}
    >
      {icon}
    </button>
  )
}

function ToggleSwitch({ label, icon, active, onToggle, color = '#1A56DB' }: { label: string; icon: React.ReactNode; active: boolean; onToggle: () => void; color?: string }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all border"
      style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)' }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,86,219,0.5)')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--t-border)')}
    >
      <div className="flex items-center gap-2.5">
        <span style={{ color: active ? color : 'var(--t-muted)' }}>{icon}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>{label}</span>
      </div>
      <div className="relative w-10 rounded-full border transition-all duration-300" style={{ height: 22, background: active ? color : 'var(--t-bg)', borderColor: active ? color : 'var(--t-border)' }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300" style={{ left: active ? 20 : 2 }} />
      </div>
    </button>
  )
}

export default function ControlPanel() {
  const [toasts, setToasts]     = useState<Toast[]>([])
  const [netOpen, setNetOpen]   = useState(false)
  const [filterOn, setFilterOn] = useState(true)
  const counterRef              = useRef(0)

  function showToast(msg = 'Demo mode — commands not transmitted.') {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  return (
    <>
      <ToastStack toasts={toasts} />
      <section role="region" aria-label="Control panel (demo mode)" className="mt-6 rounded-2xl overflow-hidden border border-[#F05A22]/30">
        {/* Warning header */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b" style={{ background: 'rgba(122,45,17,0.15)', borderColor: 'var(--t-border)' }}>
          <TriangleAlert size={16} className="text-[#F05A22] shrink-0" />
          <div>
            <div className="text-sm font-bold text-[#F05A22] tracking-wide">CONTROL PANEL — DEMO MODE</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>Commands are not transmitted. This is a UI demonstration only.</div>
          </div>
          <span className="ml-auto shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F05A22]/15 text-[#F05A22] border border-[#F05A22]/30">OFFLINE</span>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ background: 'var(--t-surface)' }}>
          {/* Directional */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Directional</span>
            <div className="flex flex-col items-center gap-2">
              <DirBtn icon={<ArrowUp size={20} />} label="Forward" onClick={() => showToast()} large />
              <div className="flex gap-2">
                <DirBtn icon={<ArrowLeft size={20} />} label="Left" onClick={() => showToast()} large />
                <button onClick={() => showToast()} aria-label="Stop" title="Stop" className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 active:scale-95 transition-all text-[#EF4444] font-bold text-xs">STOP</button>
                <DirBtn icon={<ArrowRight size={20} />} label="Right" onClick={() => showToast()} large />
              </div>
              <DirBtn icon={<ArrowDown size={20} />} label="Back" onClick={() => showToast()} large />
            </div>
          </div>

          {/* Depth */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Depth Control</span>
            <div className="flex flex-col items-center gap-3">
              <DirBtn icon={<ChevronUp size={22} />} label="Ascend" onClick={() => showToast()} large />
              <div className="text-center">
                <div className="text-xs" style={{ color: 'var(--t-muted)' }}>Target depth</div>
                <div className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>1.2 m</div>
              </div>
              <DirBtn icon={<ChevronDown size={22} />} label="Descend" onClick={() => showToast()} large />
            </div>
          </div>

          {/* Systems */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Systems</span>
            <div className="flex flex-col gap-3">
              <ToggleSwitch label="Net" icon={<Anchor size={14} />} active={netOpen} onToggle={() => { setNetOpen(v => !v); showToast(`Net ${netOpen ? 'CLOSED' : 'OPEN'} — Demo mode.`) }} color="#22C55E" />
              <ToggleSwitch label="Filter" icon={<Filter size={14} />} active={filterOn} onToggle={() => { setFilterOn(v => !v); showToast(`Filter ${filterOn ? 'OFF' : 'ON'} — Demo mode.`) }} color="#1A56DB" />
              <button onClick={() => showToast('Emergency stop — Demo mode, command not transmitted.')} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 active:scale-95 transition-all text-[#EF4444] text-sm font-bold">
                <Power size={14} />Emergency Stop
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
