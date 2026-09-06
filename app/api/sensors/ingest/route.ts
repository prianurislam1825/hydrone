import pool from '@/lib/db'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * ESP32 POST endpoint — send sensor data here every ~2.5s
 * 
 * POST /api/sensors/ingest
 * Headers: Content-Type: application/json
 *          Authorization: Bearer <DEVICE_TOKEN from .env>
 * Body:
 * {
 *   "device_id": "hydrone-rov-01",
 *   "ph": 7.24,
 *   "tds": 186,
 *   "turbidity": 34.0,
 *   "temperature": 26.4,
 *   "depth": 1.2,
 *   "heading": 47,
 *   "battery_a": 78,
 *   "battery_b": 91
 * }
 */
export async function POST(req: NextRequest) {
  // Token auth
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (token !== (process.env.DEVICE_TOKEN ?? 'hydrone-demo-token')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      device_id = 'hydrone-rov-01',
      ph, tds, turbidity, temperature,
      depth, heading, battery_a, battery_b,
    } = body

    await pool.execute(
      `INSERT INTO sensor_readings
         (device_id, ph, tds, turbidity, temperature, depth, heading, battery_a, battery_b)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [device_id, ph ?? null, tds ?? null, turbidity ?? null,
       temperature ?? null, depth ?? null, heading ?? null,
       battery_a ?? null, battery_b ?? null]
    )

    // Update device connected status
    await pool.execute(
      `INSERT INTO device_status (device_id, connected, updated_at)
       VALUES (?, 1, NOW())
       ON DUPLICATE KEY UPDATE connected = 1, updated_at = NOW()`,
      [device_id]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[sensors/ingest]', err)
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 })
  }
}
