import pool from '@/lib/db'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '30')
  try {
    const [rows] = await pool.execute(
      `SELECT ph, tds, turbidity, temperature, depth, heading, battery_a, battery_b, created_at
       FROM sensor_readings
       WHERE device_id = 'hydrone-rov-01'
       ORDER BY created_at DESC
       LIMIT ?`,
      [Math.min(limit, 200)]
    ) as [Record<string, number | string | null>[], unknown]

    return NextResponse.json({ ok: true, data: (rows as unknown[]).reverse() })
  } catch (err) {
    console.error('[sensors/history]', err)
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 })
  }
}
