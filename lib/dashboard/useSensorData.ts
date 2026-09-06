'use client'

import { useEffect, useState } from 'react'

/* ── Sensor config (used for display ranges + labels) ────── */
export interface SensorConfig {
  key:         string
  label:       string
  unit:        string
  normalMin:   number
  normalMax:   number
  normalLabel: string
  decimals:    number
}

export const SENSOR_CONFIGS: SensorConfig[] = [
  { key: 'ph',          label: 'pH',          unit: 'pH',  normalMin: 6.5, normalMax: 8.5, normalLabel: '6.5 – 8.5 pH', decimals: 2 },
  { key: 'tds',         label: 'TDS',         unit: 'ppm', normalMin: 0,   normalMax: 500, normalLabel: '< 500 ppm',    decimals: 0 },
  { key: 'turbidity',   label: 'Turbidity',   unit: 'NTU', normalMin: 0,   normalMax: 50,  normalLabel: '< 50 NTU',     decimals: 1 },
  { key: 'temperature', label: 'Temperature', unit: '°C',  normalMin: 20,  normalMax: 32,  normalLabel: '20 – 32°C',    decimals: 1 },
]

export type SensorKey     = 'ph' | 'tds' | 'turbidity' | 'temperature'
export type SensorValues  = Record<SensorKey, number | null>
export type SensorHistory = Record<SensorKey, number[]>

export type StatusLevel = 'normal' | 'warning' | 'danger' | 'offline'

export function getSensorStatus(value: number | null, cfg: SensorConfig): StatusLevel {
  if (value === null) return 'offline'
  const { normalMin, normalMax } = cfg
  const buffer = (normalMax - normalMin) * 0.1
  if (value < normalMin - buffer || value > normalMax + buffer) return 'danger'
  if (value < normalMin          || value > normalMax)          return 'warning'
  return 'normal'
}

/* ── Static / display constants ─────────────────────────── */
export const HISTORY_LENGTH    = 30
export const UPDATE_INTERVAL_MS = 2500

/* ── Battery values from latest reading ─────────────────── */
export let BATTERY_A = 0
export let BATTERY_B = 0

/* ── Live sensor data from MySQL API ────────────────────── */
export interface SensorState {
  values:      SensorValues
  history:     SensorHistory
  depth:       number | null
  heading:     number | null
  batteryA:    number | null
  batteryB:    number | null
  connected:   boolean
  lastUpdated: Date | null
  tick:        number
}

const NULL_VALUES: SensorValues = { ph: null, tds: null, turbidity: null, temperature: null }

function initHistory(): SensorHistory {
  return { ph: [], tds: [], turbidity: [], temperature: [] }
}

export function useSensorData(): SensorState {
  const [state, setState] = useState<SensorState>({
    values:      NULL_VALUES,
    history:     initHistory(),
    depth:       null,
    heading:     null,
    batteryA:    null,
    batteryB:    null,
    connected:   false,
    lastUpdated: null,
    tick:        0,
  })

  useEffect(() => {
    let cancelled = false

    async function fetchLatest() {
      try {
        const res  = await fetch('/api/sensors/latest', { cache: 'no-store' })
        const json = await res.json()

        if (cancelled) return

        if (!json.ok || !json.data) {
          // No data in DB yet — show offline
          setState(prev => ({ ...prev, connected: false, tick: prev.tick + 1 }))
          return
        }

        const d = json.data as Record<string, number | null>

        const values: SensorValues = {
          ph:          d.ph          ?? null,
          tds:         d.tds         ?? null,
          turbidity:   d.turbidity   ?? null,
          temperature: d.temperature ?? null,
        }

        // Update exported BATTERY constants for legacy components
        BATTERY_A = d.battery_a ?? 0
        BATTERY_B = d.battery_b ?? 0

        setState(prev => {
          const newHistory = { ...prev.history }
          ;(Object.keys(values) as SensorKey[]).forEach(k => {
            const v = values[k]
            if (v !== null) {
              const arr = [...prev.history[k], v]
              newHistory[k] = arr.length > HISTORY_LENGTH ? arr.slice(-HISTORY_LENGTH) : arr
            }
          })

          return {
            values,
            history:     newHistory,
            depth:       d.depth       ?? null,
            heading:     d.heading     ?? null,
            batteryA:    d.battery_a   ?? null,
            batteryB:    d.battery_b   ?? null,
            connected:   true,
            lastUpdated: new Date(),
            tick:        prev.tick + 1,
          }
        })
      } catch {
        if (!cancelled) setState(prev => ({ ...prev, connected: false, tick: prev.tick + 1 }))
      }
    }

    fetchLatest()
    const interval = setInterval(fetchLatest, UPDATE_INTERVAL_MS)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return state
}
