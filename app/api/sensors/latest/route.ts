import pool from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT ph, tds, turbidity, temperature, depth, heading, battery_a, battery_b, created_at
       FROM sensor_readings
       WHERE device_id = 'hydrone-rov-01'
       ORDER BY created_at DESC
       LIMIT 1`
    ) as [Record<string, number | string | null>[], unknown]

    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: true, data: null })
    }

    return NextResponse.json({ ok: true, data: rows[0] })
  } catch (err) {
    console.error('[sensors/latest]', err)
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 })
  }
}
