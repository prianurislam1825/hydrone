'use client'

import { BatteryFull, BatteryMedium, BatteryLow, Bolt } from 'lucide-react'
import { BATTERY_A, BATTERY_B } from '@/lib/dashboard/useSensorData'

interface Pack {
  label:   string
  sub:     string
  percent: number
  voltage: string
}

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
  const props = { size: 16, className: '' }
  if (pct > 60) return <BatteryFull  {...props} style={{ color: batteryColor(pct) }} />
  if (pct > 25) return <BatteryMedium {...props} style={{ color: batteryColor(pct) }} />
  return         <BatteryLow    {...props} style={{ color: batteryColor(pct) }} />
}

interface PackRowProps {
  pack: Pack
}

function PackRow({ pack }: PackRowProps) {
  const color = batteryColor(pack.percent)

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BatteryIcon pct={pack.percent} />
          <div>
            <div className="text-xs font-semibold text-[#F8FAFF]">{pack.label}</div>
            <div className="text-[10px] text-[#8B9EC7]">{pack.sub}</div>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-sm font-bold font-[family-name:var(--font-jetbrains-mono)] tabular-nums"
            style={{ color }}
          >
            {pack.percent}%
          </div>
          <div className="text-[10px] text-[#8B9EC7] font-[family-name:var(--font-jetbrains-mono)]">
            {pack.voltage}
          </div>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full bg-[#0D1B3E] border border-[#1E2D50] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${pack.percent}%`,
            background: `linear-gradient(to right, ${color}66, ${color})`,
            boxShadow:  `0 0 6px ${color}55`,
          }}
        />
      </div>
    </div>
  )
}

export default function BatteryPanel() {
  return (
    <div
      role="region"
      aria-label="Battery status"
      className="flex flex-col gap-0 rounded-xl bg-[#111827] border border-[#1E2D50] overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b border-[#1E2D50]">
        <Bolt size={14} className="text-[#F59E0B]" />
        <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">Battery</span>
        <span className="ml-auto text-[10px] text-[#8B9EC7]">Static — Demo</span>
      </div>

      {/* Pack rows */}
      <div className="flex flex-col gap-4 px-4 sm:px-5 py-4">
        {PACKS.map(p => (
          <PackRow key={p.label} pack={p} />
        ))}

        {/* Hot-swap notice */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#1E2D50]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
          <span className="text-[10px] text-[#8B9EC7]">Hot-swappable trays — top-access panel</span>
        </div>
      </div>
    </div>
  )
}
