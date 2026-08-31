'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Sensor configuration (from HYDRONE_WEBSITE_BRIEF_v1.0) ───────────
export interface SensorConfig {
  key:      string
  label:    string
  unit:     string
  base:     number
  step:     number
  min:      number
  max:      number
  normalMin: number
  normalMax: number
  normalLabel: string
  decimals: number
}

export const SENSOR_CONFIGS: SensorConfig[] = [
  {
    key: 'ph', label: 'pH', unit: 'pH',
    base: 7.2, step: 0.04, min: 6.5, max: 8.1,
    normalMin: 6.5, normalMax: 8.5, normalLabel: '6.5 – 8.5 pH',
    decimals: 2,
  },
  {
    key: 'tds', label: 'TDS', unit: 'ppm',
    base: 186, step: 4, min: 70, max: 340,
    normalMin: 0, normalMax: 500, normalLabel: '< 500 ppm',
    decimals: 0,
  },
  {
    key: 'turbidity', label: 'Turbidity', unit: 'NTU',
    base: 34, step: 2.5, min: 8, max: 95,
    normalMin: 0, normalMax: 50, normalLabel: '< 50 NTU',
    decimals: 1,
  },
  {
    key: 'temperature', label: 'Temperature', unit: '°C',
    base: 26.4, step: 0.1, min: 23.0, max: 30.0,
    normalMin: 20, normalMax: 32, normalLabel: '20 – 32°C',
    decimals: 1,
  },
]

export const HISTORY_LENGTH = 30
export const UPDATE_INTERVAL_MS = 2500

// ── Static values ────────────────────────────────────────────────────
export const BATTERY_A = 78   // Pack A — static
export const BATTERY_B = 91   // Pack B — static

export type SensorKey = 'ph' | 'tds' | 'turbidity' | 'temperature'
export type SensorHistory = Record<SensorKey, number[]>
export type SensorValues  = Record<SensorKey, number>

// ── Status level from current value ──────────────────────────────────
export type StatusLevel = 'normal' | 'warning' | 'danger'

export function getSensorStatus(value: number, cfg: SensorConfig): StatusLevel {
  const { normalMin, normalMax } = cfg
  const range = normalMax - normalMin
  const buffer = range * 0.1
  if (value < normalMin - buffer || value > normalMax + buffer) return 'danger'
  if (value < normalMin || value > normalMax) return 'warning'
  return 'normal'
}

// ── Clamp utility ─────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

// ── Random-walk next value ─────────────────────────────────────────────
function nextVal(current: number, cfg: SensorConfig): number {
  return clamp(current + (Math.random() - 0.5) * cfg.step * 2, cfg.min, cfg.max)
}

// ── Depth random walk (separate from sensor suite) ────────────────────
const DEPTH_CFG = { base: 1.2, step: 0.05, min: 0.0, max: 3.5 }
const HEADING_CFG = { base: 47, step: 1, min: 0, max: 360 }

function nextHeading(current: number): number {
  const next = current + (Math.random() - 0.5) * 2
  return ((next % 360) + 360) % 360  // wrap around 0–360
}

// ── Main hook ─────────────────────────────────────────────────────────
export interface SensorState {
  values:   SensorValues
  history:  SensorHistory
  depth:    number
  heading:  number
  /** tick count — increments every UPDATE_INTERVAL_MS */
  tick:     number
}

export function useSensorData(): SensorState {
  const initHistory = useCallback((): SensorHistory => {
    const h: Partial<SensorHistory> = {}
    for (const cfg of SENSOR_CONFIGS) {
      h[cfg.key as SensorKey] = Array(HISTORY_LENGTH).fill(cfg.base)
    }
    return h as SensorHistory
  }, [])

  const initValues = useCallback((): SensorValues => {
    const v: Partial<SensorValues> = {}
    for (const cfg of SENSOR_CONFIGS) v[cfg.key as SensorKey] = cfg.base
    return v as SensorValues
  }, [])

  const [state, setState] = useState<SensorState>(() => ({
    values:  initValues(),
    history: initHistory(),
    depth:   DEPTH_CFG.base,
    heading: HEADING_CFG.base,
    tick:    0,
  }))

  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newValues  = { ...prev.values }
        const newHistory = { ...prev.history }

        for (const cfg of SENSOR_CONFIGS) {
          const key = cfg.key as SensorKey
          const next = nextVal(prev.values[key], cfg)
          newValues[key] = next
          newHistory[key] = [...prev.history[key].slice(1), next]
        }

        const newDepth   = clamp(prev.depth + (Math.random() - 0.5) * DEPTH_CFG.step * 2, DEPTH_CFG.min, DEPTH_CFG.max)
        const newHeading = nextHeading(prev.heading)

        return {
          values:  newValues,
          history: newHistory,
          depth:   newDepth,
          heading: newHeading,
          tick:    prev.tick + 1,
        }
      })
    }, UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return state
}
