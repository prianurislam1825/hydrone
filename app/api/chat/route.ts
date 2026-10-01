import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // API Key from Environment Variable
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        reply: "Sistem belum mendeteksi API Key Claude. Silakan tambahkan CLAUDE_API_KEY di Environment Variables Vercel Anda."
      });
    }

    // Format the history for Anthropic Claude API
    // History from frontend is: { role: 'user' | 'assistant', content: string }
    const anthropicMessages = history
      .filter((msg: { id: string }) => msg.id !== 'welcome') // Remove the local welcome message
      .map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      }));

    // Add the current user message
    anthropicMessages.push({ role: 'user', content: message });

    // Call Anthropic Claude API
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // Using Haiku for fast response, can change to claude-3-5-sonnet-20240620
        max_tokens: 1024,
        system: "Kamu adalah AI Assistant resmi untuk HYDRONE, sebuah sistem kolektor sampah plastik bawah air otonom (ROV) buatan SMA Negeri 1 Surakarta. Tugasmu: Memberikan rekomendasi, menganalisis data kualitas air (pH, TDS, Kekeruhan, Suhu), dan menjawab pertanyaan pengguna tentang Hydrone dengan ramah, profesional, dan ringkas. Gunakan bahasa Indonesia.",
        messages: anthropicMessages
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Claude API Error:', errorText);
      
      // FALLBACK MOCK (Biar widget tetap jalan buat demo walaupun saldo API kosong)
      const lowerMsg = message.toLowerCase();
      let mockReply = 'Maaf, saya tidak mengerti. Ada yang bisa dibantu terkait Hydrone?';
      if (lowerMsg.includes('hydrone') || lowerMsg.includes('apa')) {
        mockReply = 'HYDRONE adalah sistem ROV otonom inovatif buatan SMA Negeri 1 Surakarta. Alat ini dirancang untuk membersihkan sampah plastik di perairan dangkal dan memonitor kualitas air (pH, Turbidity, TDS, Suhu) secara real-time melalui sensor IoT yang terintegrasi.';
      } else if (lowerMsg.includes('sensor') || lowerMsg.includes('kualitas')) {
        mockReply = 'Hydrone dilengkapi sensor kualitas air real-time: pH meter, kekeruhan (Turbidity), total padatan terlarut (TDS), dan suhu. Data ini langsung dikirim ke Control Center untuk dianalisis.';
      } else if (lowerMsg.includes('cara kerja')) {
        mockReply = 'Cara kerjanya: Hydrone bergerak menyusuri perairan (otonom/manual), menangkap sampah makroplastik menggunakan jaring, memfilter mikroplastik dengan filter 5um, lalu membaca data kualitas air dan mengirimkannya ke dashboard ini.';
      }

      return NextResponse.json({ 
        success: true, 
        reply: `*(Mode Offline)* ${mockReply}`
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
