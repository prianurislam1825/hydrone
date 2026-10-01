import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // API Key from Environment Variable
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        reply: "Sistem belum mendeteksi API Key Claude. Tolong tambahkan CLAUDE_API_KEY di menu Environment Variables Vercel."
      });
    }

    // Format the history for Anthropic Claude API
    const anthropicMessages = history
      .filter((msg: { id: string }) => msg.id !== 'welcome')
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

    anthropicMessages.push({ role: 'user', content: message });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', 
        max_tokens: 1024,
        system: "Kamu adalah AI Assistant resmi untuk HYDRONE, sebuah sistem kolektor sampah plastik bawah air otonom (ROV) buatan SMA Negeri 1 Surakarta. Tugasmu: Memberikan rekomendasi, menganalisis data kualitas air (pH, TDS, Kekeruhan, Suhu), dan menjawab pertanyaan pengguna tentang Hydrone dengan ramah, profesional, dan ringkas. Gunakan bahasa Indonesia.",
        messages: anthropicMessages
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      let userFriendlyError = `Error (${res.status}): `;
      
      try {
        const errJson = JSON.parse(errorText);
        const errMsg = errJson.error?.message || errorText;
        const errType = errJson.error?.type || '';
        
        if (errType === 'authentication_error') {
           userFriendlyError = "API Key Claude kamu DITOLAK (Invalid). Pastikan kodenya diawali 'sk-ant-api03-...', bukan 'sk-ant-usr-...'. Bikin kunci baru dari tombol 'Get API key' di web Claude.";
        } else if (errType === 'not_found_error') {
           userFriendlyError = "API Key kamu valid, TAPI server Claude menolak akses ke model AI. Ini terjadi karena akun API kamu belum diisi saldo/kredit ($0). Silakan 'Add funds' minimal $5 di Console Anthropic.";
        } else if (errType === 'permission_error') {
           userFriendlyError = "API Key kamu tidak punya izin untuk mengakses sistem Claude (Permission Error).";
        } else {
           userFriendlyError += errMsg;
        }
      } catch {
        userFriendlyError += errorText;
      }

      console.error('Claude API Error:', errorText);
      return NextResponse.json({ 
        success: true, 
        reply: `*(Sistem Claude Error)*\n\n${userFriendlyError}`
      });
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      reply: data.content[0].text 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
