import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('ip') || '192.168.4.2';
  const type = searchParams.get('type') || 'status';
  const query = searchParams.get('q') || '';
  
  try {
    let url = `http://${ip}/${type}`;
    if (query) url += `?${query}`;

    const res = await fetch(url, { 
      signal: AbortSignal.timeout(500),
      cache: 'no-store'
    });
    const text = await res.text();
    return NextResponse.json({ success: true, data: text });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
