import { NextResponse } from 'next/server';
import dgram from 'dgram';

export const runtime = 'nodejs';

const globalAny = global as { 
  rovSocket?: dgram.Socket; 
  latestTelemetry?: string; 
  rovState: Record<string, string|number> 
};

// Initialize UDP Server & State on first load
if (!globalAny.rovSocket) {
  globalAny.rovSocket = dgram.createSocket('udp4');
  globalAny.rovSocket.bind(); // Bind to any port so ESP32 can reply to it

  globalAny.latestTelemetry = '';
  
  // Store the active command state
  globalAny.rovState = {
    ip: '192.168.4.2',
    fwd: 0, yaw: 0, vert: 0, armed: 0,
    r1: 0, r2: 0, r3: 0, r4: 0
  };

  // Listen for telemetry replies
  globalAny.rovSocket.on('message', (msg: Buffer) => {
    globalAny.latestTelemetry = msg.toString();
  });

  // INTERNAL UDP BLASTER (20Hz)
  // This guarantees the ESP32 receives commands exactly every 50ms,
  // bypassing any browser fetch lag, queues, or background throttling!
  setInterval(() => {
    const s = globalAny.rovState;
    if (!s) return;
    const payload = `${s.fwd},${s.yaw},${s.vert},${s.armed},${s.r1},${s.r2},${s.r3},${s.r4}`;
    globalAny.rovSocket?.send(payload, 3333, String(s.ip));
  }, 50);
}

export async function GET(request: Request) {
  if (!globalAny.rovState) {
    globalAny.rovState = {
      ip: '192.168.4.2', fwd: 0, yaw: 0, vert: 0, armed: 0,
      r1: 0, r2: 0, r3: 0, r4: 0
    };
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'status';
  
  try {
    if (type === 'cmd') {
      // Update the internal Node.js state, DO NOT block
      globalAny.rovState.ip = searchParams.get('ip') || '192.168.4.2';
      globalAny.rovState.fwd = searchParams.get('fwd') || '0';
      globalAny.rovState.yaw = searchParams.get('yaw') || '0';
      globalAny.rovState.vert = searchParams.get('vert') || '0';
      globalAny.rovState.armed = searchParams.get('armed') || '0';
      globalAny.rovState.r1 = searchParams.get('r1') || '0';
      globalAny.rovState.r2 = searchParams.get('r2') || '0';
      globalAny.rovState.r3 = searchParams.get('r3') || '0';
      globalAny.rovState.r4 = searchParams.get('r4') || '0';
      
      return NextResponse.json({ success: true, method: 'state_updated' });
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
      } catch {
        // ignore
      }

      return NextResponse.json({ success: true, method: 'udp-cache', data });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
