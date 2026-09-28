import { NextResponse } from 'next/server';
import dgram from 'dgram';

export const runtime = 'nodejs';

// Use global to preserve socket across hot reloads in dev
const globalAny = global as any;

if (!globalAny.udpServer) {
  globalAny.udpServer = dgram.createSocket('udp4');
  globalAny.latestTelemetry = '';
  
  globalAny.udpServer.on('message', (msg: Buffer, rinfo: any) => {
    globalAny.latestTelemetry = msg.toString();
  });
  
  globalAny.udpServer.on('error', (err: any) => {
    console.error('UDP Server Error:', err);
  });
  
  // Bind to any available port, or specific port if needed
  // If we don't bind, the socket won't receive incoming packets
  // But wait! ESP32 sends telemetry to `lastRemotePort`.
  // So we MUST use the SAME socket for sending commands, so the OS binds a port
  // and ESP32 sends replies to that port!
}

// We will use a dedicated socket for sending, which automatically binds to a port
// and we listen on it to catch the ESP32's replies!
if (!globalAny.rovSocket) {
  globalAny.rovSocket = dgram.createSocket('udp4');
  globalAny.rovSocket.on('message', (msg: Buffer, rinfo: any) => {
    globalAny.latestTelemetry = msg.toString();
  });
  // Bind to a random port
  globalAny.rovSocket.bind();
}

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
      globalAny.rovSocket.send(payload, 3333, ip);
      
      return NextResponse.json({ success: true, method: 'udp', data: payload });
    } else {
      // Status over UDP (read from global cache)
      let data = globalAny.latestTelemetry || '';
      
      // Override values specifically for the user's presentation
      try {
        if (data && data.startsWith('{')) {
          const parsed = JSON.parse(data);
          parsed.pH = parseFloat((Math.random() * (10.0 - 9.0) + 9.0).toFixed(2));
          parsed.turb = parseFloat((Math.random() * (50.0 - 20.0) + 20.0).toFixed(1));
          parsed.tds = Math.round(Math.random() * (550 - 250) + 250);
          data = JSON.stringify(parsed);
        }
      } catch (e) {}

      return NextResponse.json({ success: true, method: 'udp-cache', data });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
