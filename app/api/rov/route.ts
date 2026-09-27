import { NextResponse } from 'next/server';
import dgram from 'dgram';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('ip') || '192.168.4.2';
  const type = searchParams.get('type') || 'status';
  
  try {
    if (type === 'cmd') {
      const fwd = searchParams.get('fwd') || '0';
      const yaw = searchParams.get('yaw') || '0';
      const vert = searchParams.get('vert') || '0';
      const armed = searchParams.get('armed') || '0';
      const r1 = searchParams.get('r1') || '0';
      const r2 = searchParams.get('r2') || '0';
      const r3 = searchParams.get('r3') || '0';
      const r4 = searchParams.get('r4') || '0';
      
      const payload = `${fwd},${yaw},${vert},${armed},${r1},${r2},${r3},${r4}`;
      const client = dgram.createSocket('udp4');
      client.send(payload, 3333, ip, (err) => {
        client.close();
      });
      return NextResponse.json({ success: true, method: 'udp', data: payload });
    } else {
      // Status over HTTP
      const res = await fetch(`http://${ip}/status`, { 
        signal: AbortSignal.timeout(2000), // Increased timeout
        cache: 'no-store'
      });
      const text = await res.text();
      return NextResponse.json({ success: true, method: 'http', data: text });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
