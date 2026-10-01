import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // API Key from the user
    const apiKey = process.env.CLAUDE_API_KEY || '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';

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
      let mockReply = 'Maaf, saya sedang dalam mode offline. Anda bisa bertanya tentang: "Apa itu Hydrone?", "Bagaimana cara kerjanya?", atau "Sensor apa saja yang ada?".';
      if (lowerMsg.includes('hydrone') || lowerMsg.includes('apa')) {
        mockReply = 'HYDRONE adalah sistem ROV otonom inovatif buatan SMA Negeri 1 Surakarta. Alat ini dirancang untuk membersihkan sampah plastik di perairan dangkal dan memonitor kualitas air (pH, Turbidity, TDS, Suhu) secara real-time melalui sensor IoT yang terintegrasi.';
      } else if (lowerMsg.includes('sensor') || lowerMsg.includes('kualitas') || lowerMsg.includes('data')) {
        mockReply = 'Hydrone dilengkapi sensor kualitas air real-time: pH meter, kekeruhan (Turbidity), total padatan terlarut (TDS), dan suhu. Data ini langsung dikirim ke Control Center untuk dianalisis.';
      } else if (lowerMsg.includes('cara kerja') || lowerMsg.includes('bagaimana')) {
        mockReply = 'Cara kerjanya: Hydrone bergerak menyusuri perairan (otonom/manual), menangkap sampah makroplastik menggunakan jaring, memfilter mikroplastik dengan filter 5um, lalu membaca data kualitas air dan mengirimkannya ke dashboard ini.';
      } else if (lowerMsg.includes('halo') || lowerMsg.includes('hai') || lowerMsg.includes('hi')) {
        mockReply = 'Halo! Saya AI Assistant khusus Hydrone (Mode Offline). Ada yang bisa saya bantu jelaskan tentang proyek ini?';
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
