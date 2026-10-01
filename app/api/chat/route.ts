import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // Menggunakan Pollinations.ai (Free OpenAI-compatible) demi kelancaran presentasi!
    const openAIMessages = history
      .filter((msg: { id: string }) => msg.id !== 'welcome')
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

    openAIMessages.unshift({
      role: 'system',
      content: 'Kamu adalah AI Assistant resmi untuk HYDRONE, sebuah sistem kolektor sampah plastik bawah air otonom (ROV) buatan SMA Negeri 1 Surakarta. Tugasmu: Memberikan rekomendasi, menganalisis data kualitas air (pH, TDS, Kekeruhan, Suhu), dan menjawab pertanyaan pengguna tentang Hydrone dengan ramah, profesional, dan ringkas. Jawab menggunakan bahasa Indonesia.'
    });
    openAIMessages.push({ role: 'user', content: message });

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: openAIMessages,
        model: 'openai'
      })
    });

    if (!res.ok) {
      return NextResponse.json({ 
        success: true, 
        reply: "Maaf, server AI sedang sibuk. Silakan coba lagi."
      });
    }

    const responseText = await res.text();
    return NextResponse.json({ 
      success: true, 
      reply: responseText 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
