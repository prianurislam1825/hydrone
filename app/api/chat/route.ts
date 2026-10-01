import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // TODO: The user provided an API key: apikey_019GPtzU6BM4fyKrzeWD2imp
    // We need to know which provider this is for (OpenAI, Groq, Dify, Botpress, Flowise, Gemini, etc.)
    // For now, return a placeholder response so the widget works visually.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      success: true, 
      reply: `Halo! Saya sudah menerima pesan Anda: "${message}". Namun, saya belum tahu API Provider mana yang harus saya gunakan untuk API Key yang diberikan. Bisa beritahu AI Engineer saya (Gemini)?`
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
