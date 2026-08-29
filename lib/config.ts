import type { AppConfig } from '@/types'

// ── App Config ────────────────────────────────────────────────
export function getAppConfig(): AppConfig {
  const mode = (process.env.NEXT_PUBLIC_APP_MODE ?? 'local') as AppConfig['mode']
  return {
    mode,
    authEnabled: process.env.AUTH_ENABLED === 'true',
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'HYDRONE',
  }
}

// ── Device token validation ───────────────────────────────────
export function validateDeviceToken(token: string): boolean {
  const validToken = process.env.DEVICE_TOKEN
  if (!validToken) return false
  return token === validToken
}
