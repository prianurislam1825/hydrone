// ─────────────────────────────────────────────────────────────
//  HYDRONE — Central TypeScript type definitions
// ─────────────────────────────────────────────────────────────

// ── Language ──────────────────────────────────────────────────
export type Lang = 'id' | 'en'

export interface BilingualText {
  id: string
  en: string
}

// ── App Config ────────────────────────────────────────────────
export type AppMode = 'cloud' | 'local'

export interface AppConfig {
  mode:        AppMode
  authEnabled: boolean
  appName:     string
}

// ── Auth / User ───────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'VIEWER'

export interface User {
  id:         string
  name:       string
  email:      string
  role:       UserRole
  active:     boolean
  created_at: string
  last_login?: string | null
}

// ── Team member ───────────────────────────────────────────────
export interface TeamMember {
  name:     string
  title:    string                    // e.g. "CEO", "CTO"
  role:     BilingualText             // full role title
  desc:     BilingualText             // description
  photo:    string | null             // e.g. '/team/haikal.jpg' or null
  leader?:  boolean
  color:    string                    // brand color for avatar
  wa:       string                    // WhatsApp URL
  ig:       string                    // Instagram URL
  igHandle: string                    // e.g. '@username'
  email:    string
}

// ── Partner / mitra ───────────────────────────────────────────
export interface Partner {
  name:  string
  logo:  string                       // path to logo in /public
  label: BilingualText
  dark?: boolean                      // use mix-blend-multiply for dark logos
  url?:  string
}

// ── Feature card ──────────────────────────────────────────────
export interface FeatureItem {
  iconName: string                    // Lucide icon name
  title:    BilingualText
  desc:     BilingualText
  color:    string
  bg:       string
  border:   string
}

// ── Stat item ─────────────────────────────────────────────────
export interface StatItem {
  target:  number
  suffix:  string
  label:   BilingualText
  sub:     BilingualText
  color:   string
  bg:      string
}

// ── How it works step ─────────────────────────────────────────
export interface HowItWorksStep {
  num:      string
  iconName: string
  title:    BilingualText
  desc:     BilingualText
  color:    string
  bg:       string
}

// ── Mission item ──────────────────────────────────────────────
export interface MissionItem {
  id: string
  en: string
}

// ── Nav link ──────────────────────────────────────────────────
export interface NavLink {
  label: BilingualText
  href:  string
}

// ── API response wrappers ─────────────────────────────────────
export interface ApiSuccess<T> {
  ok:   true
  data: T
}

export interface ApiError {
  ok:    false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ── Sensor data (for future dashboard) ───────────────────────
export interface SensorReading {
  device_id:     string
  seq:           number
  turbidity:     number
  tds:           number
  temperature:   number
  ph?:           number
  latitude?:     number
  longitude?:    number
  battery:       number
  depth?:        number
  received_at:   string
}

// ── Connection status ─────────────────────────────────────────
export type ConnectionStatus = 'live' | 'stale' | 'offline' | 'connecting'

// ── Status level ──────────────────────────────────────────────
export type StatusLevel = 'safe' | 'warning' | 'danger' | 'offline' | 'unknown'
