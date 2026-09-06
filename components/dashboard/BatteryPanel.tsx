'use client'

import { BatteryFull, BatteryLow, BatteryMedium, Bolt } from 'lucide-react';

const BATTERY_A = 78
const BATTERY_B = 91

interface Pack { label: string; sub: string; percent: number; voltage: string }

const PACKS: Pack[] = [
  { label: 'Pack A', sub: 'Propulsion (4S5P)',  percent: BATTERY_A, voltage: '14.8 V' },
  { label: 'Pack B', sub: 'Electronics (3S2P)', percent: BATTERY_B, voltage: '11.1 V' },
]

function batteryColor(pct: number): string {
  if (pct > 50) return '#22C55E'
  if (pct > 20) return '#F59E0B'
  return '#EF4444'
}

function BatteryIcon({ pct }: { pct: number }) {
  const style = { color: batteryColor(pct) }
  if (pct > 60) return <BatteryFull   size={16} style={style} />
  if (pct > 25) return <BatteryMedium size={16} style={style} />
  return               <BatteryLow    size={16} style={style} />
}

function PackRow({ pack }: { pack: Pack }) {
  const color = batteryColor(pack.percent)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BatteryIcon pct={pack.percent} />
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--t-text)' }}>{pack.label}</div>
            <div className="text-[10px]" style={{ color: 'var(--t-muted)' }}>{pack.sub}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold font-[family-name:var(--font-jetbrains-mono)] tabular-nums" style={{ color }}>{pack.percent}%</div>
          <div className="text-[10px] font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)' }}>{pack.voltage}</div>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pack.percent}%`, background: `linear-gradient(to right, ${color}66, ${color})`, boxShadow: `0 0 6px ${color}55` }} />
      </div>
    </div>
  )
}

export default function BatteryPanel() {
  return (
    <div role="region" aria-label="Battery status" className="flex flex-col gap-0 rounded-xl overflow-hidden border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b" style={{ borderColor: 'var(--t-border)' }}>
        <Bolt size={14} className="text-[#F59E0B]" />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Battery</span>
        <span className="ml-auto text-[10px]" style={{ color: 'var(--t-muted)' }}>Static — Demo</span>
      </div>
      <div className="flex flex-col gap-4 px-4 sm:px-5 py-4">
        {PACKS.map(p => <PackRow key={p.label} pack={p} />)}
        <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--t-border)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
          <span className="text-[10px]" style={{ color: 'var(--t-muted)' }}>Hot-swappable trays — top-access panel</span>
        </div>
      </div>
    </div>
  )
}
