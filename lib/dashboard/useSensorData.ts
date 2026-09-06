'use client'

import { useEffect, useRef, useState } from 'react'

/* â”€â”€ Sensor config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  { key: 'ph',          label: 'pH',          unit: 'pH',  normalMin: 6.5, normalMax: 8.5,  normalLabel: '6.5 â€“ 8.5 pH', decimals: 2 },
  { key: 'tds',         label: 'TDS',         unit: 'ppm', normalMin: 0,   normalMax: 500,  normalLabel: '< 500 ppm',    decimals: 0 },
  { key: 'turbidity',   label: 'Turbidity',   unit: 'NTU', normalMin: 0,   normalMax: 50,   normalLabel: '< 50 NTU',     decimals: 1 },
  { key: 'temperature', label: 'Temperature', unit: 'Â°C',  normalMin: 20,  normalMax: 32,   normalLabel: '20 â€“ 32Â°C',    decimals: 1 },
]

export type SensorKey     = 'ph' | 'tds' | 'turbidity' | 'temperature'
export type SensorValues  = Record<SensorKey, number | null>
export type SensorHistory = Record<SensorKey, number[]>
export type StatusLevel   = 'normal' | 'warning' | 'danger' | 'offline'

export function getSensorStatus(value: number | null, cfg: SensorConfig): StatusLevel {
  if (value === null) return 'offline'
  const { normalMin, normalMax } = cfg
  const buffer = (normalMax - normalMin) * 0.1
  if (value < normalMin - buffer || value > normalMax + buffer) return 'danger'
  if (value < normalMin          || value > normalMax)          return 'warning'
  return 'normal'
}

/* â”€â”€ Dummy data config (random walk â€” used when DB not connected) */
const DUMMY: Record<SensorKey, { base: number; step: number; min: number; max: number }> = {
  ph:          { base: 7.2,  step: 0.04, min: 6.5, max: 8.1  },
  tds:         { base: 186,  step: 4,    min: 70,  max: 340   },
  turbidity:   { base: 34,   step: 2.5,  min: 8,   max: 95    },
  temperature: { base: 26.4, step: 0.1,  min: 23,  max: 30    },
}
const DUMMY_DEPTH   = { base: 1.2,  step: 0.05, min: 0.0, max: 3.5 }
const DUMMY_HEADING = { base: 47,   step: 1,    min: 0,   max: 360  }
const DUMMY_BAT_A   = 78
const DUMMY_BAT_B   = 91

function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)) }
function randomWalk(current: number, cfg: { step: number; min: number; max: number }) {
  return clamp(current + (Math.random() - 0.5) * cfg.step * 2, cfg.min, cfg.max)
}

/* â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const HISTORY_LENGTH     = 30
export const UPDATE_INTERVAL_MS = 2500

/* â”€â”€ State interface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export interface SensorState {
  values:      SensorValues
  history:     SensorHistory
  depth:       number | null
  heading:     number | null
  batteryA:    number | null
  batteryB:    number | null
  connected:   boolean        // true = reading from DB, false = dummy
  lastUpdated: Date | null
  tick:        number
}

/** Initial dummy values */
function initDummyValues(): SensorValues {
  return { ph: DUMMY.ph.base, tds: DUMMY.tds.base, turbidity: DUMMY.turbidity.base, temperature: DUMMY.temperature.base }
}
function initHistory(): SensorHistory {
  return { ph: [], tds: [], turbidity: [], temperature: [] }
}

/* â”€â”€ Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function useSensorData(): SensorState {
  const [state, setState] = useState<SensorState>({
    values:      initDummyValues(),
    history:     initHistory(),
    depth:       DUMMY_DEPTH.base,
    heading:     DUMMY_HEADING.base,
    batteryA:    DUMMY_BAT_A,
    batteryB:    DUMMY_BAT_B,
    connected:   false,
    lastUpdated: null,
    tick:        0,
  })

  const dummyRef = useRef({
    values:  initDummyValues(),
    depth:   DUMMY_DEPTH.base,
    heading: DUMMY_HEADING.base,
  })

  useEffect(() => {
    let cancelled = false

    async function fetchLatest() {
      try {
        const res  = await fetch('/api/sensors/latest', { cache: 'no-store' })
        const json = await res.json()

        if (cancelled) return

        if (json.ok && json.data) {
          /* â”€â”€ Real DB data â”€â”€ */
          const d = json.data as Record<string, number | null>
          const values: SensorValues = {
            ph:          d.ph          ?? null,
            tds:         d.tds         ?? null,
            turbidity:   d.turbidity   ?? null,
            temperature: d.temperature ?? null,
          }

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
              depth:       d.depth     ?? null,
              heading:     d.heading   ?? null,
              batteryA:    d.battery_a ?? null,
              batteryB:    d.battery_b ?? null,
              connected:   true,
              lastUpdated: new Date(),
              tick:        prev.tick + 1,
            }
          })
        } else {
          /* â”€â”€ No DB data â†’ use random-walk dummy â”€â”€ */
          applyDummy(cancelled)
        }
      } catch {
        /* â”€â”€ Network error â†’ use random-walk dummy â”€â”€ */
        if (!cancelled) applyDummy(cancelled)
      }
    }

    function applyDummy(cancelled: boolean) {
      if (cancelled) return
      const dr = dummyRef.current

      // Advance random walk
      const newValues = { ...dr.values }
      ;(Object.keys(DUMMY) as SensorKey[]).forEach(k => {
        newValues[k] = randomWalk(dr.values[k] as number, DUMMY[k])
      })
      const newDepth   = randomWalk(dr.depth,   DUMMY_DEPTH)
      const newHeading = clamp(dr.heading + (Math.random() - 0.5) * 2, 0, 360)

      dummyRef.current = { values: newValues, depth: newDepth, heading: newHeading }

      setState(prev => {
        const newHistory = { ...prev.history }
        ;(Object.keys(newValues) as SensorKey[]).forEach(k => {
          const arr = [...prev.history[k], newValues[k] as number]
          newHistory[k] = arr.length > HISTORY_LENGTH ? arr.slice(-HISTORY_LENGTH) : arr
        })
        return {
          values:      newValues,
          history:     newHistory,
          depth:       newDepth,
          heading:     newHeading,
          batteryA:    DUMMY_BAT_A,
          batteryB:    DUMMY_BAT_B,
          connected:   false,
          lastUpdated: new Date(),
          tick:        prev.tick + 1,
        }
      })
    }

    fetchLatest()
    const interval = setInterval(fetchLatest, UPDATE_INTERVAL_MS)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return state
}
