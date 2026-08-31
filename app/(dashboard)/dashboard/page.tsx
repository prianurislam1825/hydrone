'use client'

import BatteryPanel from '@/components/dashboard/BatteryPanel'
import CameraFeed from '@/components/dashboard/CameraFeed'
import ControlPanel from '@/components/dashboard/ControlPanel'
import DepthGauge from '@/components/dashboard/DepthGauge'
import RovStatusPanel from '@/components/dashboard/RovStatusPanel'
import SensorTile from '@/components/dashboard/SensorTile'
import ThrusterPanel from '@/components/dashboard/ThrusterPanel'
import { SENSOR_CONFIGS, useSensorData } from '@/lib/dashboard/useSensorData'
import { Anchor, Filter, Wifi } from 'lucide-react'

export default function DashboardPage() {
  const { values, history, depth, heading, tick } = useSensorData()

  return (
    <div className="min-h-screen" style={{ background: 'var(--t-bg)' }}>
      {/* Page header */}
      <div className="border-b backdrop-blur-sm" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow">RIVER WATER QUALITY MONITORING</span>
              <span className="eyebrow-rule" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--t-text)' }}>
              Real-Time Dashboard
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--t-muted)' }}>
              Sungai Dengkeng, Central Java · Mock telemetry · Updates every 2.5 s
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <Wifi size={13} className="text-[#22C55E]" />
              <span className="text-xs font-semibold text-[#22C55E] font-[family-name:var(--font-jetbrains-mono)]">TETHER OK</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <Anchor size={13} style={{ color: 'var(--t-muted)' }} />
              <span className="text-xs font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)' }}>NET: CLOSED</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <Filter size={13} className="text-[#1A56DB]" />
              <span className="text-xs text-[#1A56DB] font-[family-name:var(--font-jetbrains-mono)]">FILTER: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6">

          {/* ── Left column ── */}
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

            {/* Depth gauge + net/filter status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DepthGauge depth={depth} maxDepth={10} />

              <div className="flex flex-col gap-4">
                {/* Net status */}
                <div className="flex-1 flex flex-col justify-center gap-3 rounded-xl p-4 sm:p-5 border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Anchor size={14} style={{ color: 'var(--t-muted)' }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Net Mechanism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border" style={{ color: 'var(--t-muted)', background: 'rgba(139,158,199,0.1)', borderColor: 'rgba(139,158,199,0.2)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: 'var(--t-muted)' }} />
                      CLOSED
                    </span>
                    <span className="text-xs" style={{ color: 'var(--t-muted)' }}>Passive flap · servo latch</span>
                  </div>
                  <div className="text-[11px] leading-relaxed" style={{ color: 'var(--t-muted)', opacity: 0.7 }}>1× per session · manual reset</div>
                </div>

                {/* Filter status */}
                <div className="flex-1 flex flex-col justify-center gap-3 rounded-xl p-4 sm:p-5 border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Filter size={14} className="text-[#1A56DB]" />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--t-muted)' }}>Filtration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#1A56DB]/15 text-[#1A56DB] border border-[#1A56DB]/25">
                      <span className="w-2 h-2 rounded-full bg-[#1A56DB]" style={{ animation: 'live-pulse 2s ease-in-out infinite' }} />
                      ACTIVE
                    </span>
                    <span className="text-xs" style={{ color: 'var(--t-muted)' }}>2-stage series</span>
                  </div>
                  <div className="text-[11px] leading-relaxed" style={{ color: 'var(--t-muted)', opacity: 0.7 }}>Stage 1: 20–50 µm · Stage 2: 0.1 µm</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">
            <RovStatusPanel depth={depth} heading={heading} />
            <ThrusterPanel />
            <BatteryPanel />
            <CameraFeed />
          </div>
        </div>

        {/* Control panel */}
        <ControlPanel />

        <p className="mt-8 text-center text-xs font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.5 }}>
          Hydrone · IID INNOPA 2026 · Mersiflab · UI Demo — Mock Telemetry
        </p>
      </div>
    </div>
  )
}
