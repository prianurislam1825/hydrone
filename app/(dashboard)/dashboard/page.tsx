'use client'

import { useSensorData, SENSOR_CONFIGS } from '@/lib/dashboard/useSensorData'
import SensorTile    from '@/components/dashboard/SensorTile'
import DepthGauge    from '@/components/dashboard/DepthGauge'
import RovStatusPanel from '@/components/dashboard/RovStatusPanel'
import ThrusterPanel  from '@/components/dashboard/ThrusterPanel'
import BatteryPanel   from '@/components/dashboard/BatteryPanel'
import CameraFeed     from '@/components/dashboard/CameraFeed'
import ControlPanel   from '@/components/dashboard/ControlPanel'
import { Filter, Anchor, Wifi } from 'lucide-react'

export default function DashboardPage() {
  const { values, history, depth, heading, tick } = useSensorData()

  return (
    <div className="min-h-screen bg-[#0D1B3E]">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="border-b border-[#1E2D50] bg-[#0D1B3E]/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow">RIVER WATER QUALITY MONITORING</span>
              <span className="eyebrow-rule" />
            </div>
            <h1
              className="text-xl sm:text-2xl font-bold text-[#F8FAFF] font-[family-name:var(--font-space-grotesk)]"
            >
              Real-Time Dashboard
            </h1>
            <p className="text-sm text-[#8B9EC7] mt-0.5">
              Sungai Dengkeng, Central Java · Mock telemetry · Updates every 2.5 s
            </p>
          </div>

          {/* Connection status cluster */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E2D50]">
              <Wifi size={13} className="text-[#22C55E]" />
              <span className="text-xs font-semibold text-[#22C55E] font-[family-name:var(--font-jetbrains-mono)]">
                TETHER OK
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E2D50]">
              <Anchor size={13} className="text-[#8B9EC7]" />
              <span className="text-xs text-[#8B9EC7] font-[family-name:var(--font-jetbrains-mono)]">
                NET: CLOSED
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E2D50]">
              <Filter size={13} className="text-[#1A56DB]" />
              <span className="text-xs text-[#1A56DB] font-[family-name:var(--font-jetbrains-mono)]">
                FILTER: ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6">

          {/* ════ LEFT COLUMN ════════════════════════════════════════ */}
          <div className="flex flex-col gap-6">

            {/* Sensor tiles 2×2 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="eyebrow">Sensor Suite</span>
                <span className="eyebrow-rule" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SENSOR_CONFIGS.map(cfg => (
                  <SensorTile
                    key={cfg.key}
                    config={cfg}
                    value={values[cfg.key as keyof typeof values]}
                    history={history[cfg.key as keyof typeof history]}
                    tick={tick}
                  />
                ))}
              </div>
            </div>

            {/* Depth gauge + net/filter status row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DepthGauge depth={depth} maxDepth={10} />

              {/* Net + Filter status card */}
              <div className="flex flex-col gap-4">
                {/* Net status */}
                <div className="flex-1 flex flex-col justify-center gap-3 rounded-xl p-4 sm:p-5 bg-[#111827] border border-[#1E2D50]">
                  <div className="flex items-center gap-2 mb-1">
                    <Anchor size={14} className="text-[#8B9EC7]" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">Net Mechanism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#8B9EC7]/10 text-[#8B9EC7] border border-[#8B9EC7]/20">
                      <span className="w-2 h-2 rounded-full bg-[#8B9EC7]" />
                      CLOSED
                    </span>
                    <span className="text-xs text-[#8B9EC7]">Passive flap · servo latch</span>
                  </div>
                  <div className="text-[11px] text-[#8B9EC7]/70 leading-relaxed">
                    1× per session · manual reset by operator
                  </div>
                </div>

                {/* Filter status */}
                <div className="flex-1 flex flex-col justify-center gap-3 rounded-xl p-4 sm:p-5 bg-[#111827] border border-[#1E2D50]">
                  <div className="flex items-center gap-2 mb-1">
                    <Filter size={14} className="text-[#1A56DB]" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">Filtration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#1A56DB]/15 text-[#1A56DB] border border-[#1A56DB]/25">
                      <span
                        className="w-2 h-2 rounded-full bg-[#1A56DB]"
                        style={{ animation: 'live-pulse 2s ease-in-out infinite' }}
                      />
                      ACTIVE
                    </span>
                    <span className="text-xs text-[#8B9EC7]">2-stage series</span>
                  </div>
                  <div className="text-[11px] text-[#8B9EC7]/70 leading-relaxed">
                    Stage 1: 20–50 µm · Stage 2: 0.1 µm
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* ════ END LEFT COLUMN ════════════════════════════════════ */}

          {/* ════ RIGHT COLUMN ═══════════════════════════════════════ */}
          <div className="flex flex-col gap-4">
            <RovStatusPanel depth={depth} heading={heading} />
            <ThrusterPanel />
            <BatteryPanel />
            <CameraFeed />
          </div>
          {/* ════ END RIGHT COLUMN ═══════════════════════════════════ */}

        </div>

        {/* ── Control panel (full width, below grid) ─────────────── */}
        <ControlPanel />

        {/* ── Footer note ─────────────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-[#8B9EC7]/50 font-[family-name:var(--font-jetbrains-mono)]">
          Hydrone · IID INNOPA 2026 · Mersiflab · UI Demo — Mock Telemetry
        </p>
      </div>
    </div>
  )
}
