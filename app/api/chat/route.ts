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
      let mockReply = 'Maaf, karena keterbatasan server saat ini saya dalam Mode Offline. Namun Anda bisa bertanya tentang: "Apa itu Hydrone", "Cara kerja", "Sensor", "Spesifikasi", atau "Tim Pembuat".';
      
      if (lowerMsg.includes('hydrone') || lowerMsg.includes('apa itu') || lowerMsg.includes('robot apa')) {
        mockReply = 'HYDRONE adalah robot pembersih perairan bawah air otonom yang dirancang untuk mengatasi dua masalah sekaligus: sampah plastik besar (makroplastik) dan mikroplastik berbahaya yang tersebar di dalam air. Alat ini dibuat oleh siswa SMA Negeri 1 Surakarta.';
      } else if (lowerMsg.includes('sensor') || lowerMsg.includes('kualitas') || lowerMsg.includes('data')) {
        mockReply = 'Hydrone dilengkapi sensor kualitas air real-time: pH meter, kekeruhan (Turbidity), total padatan terlarut (TDS), suhu, dan GPS. Semua data ini dikirim secara langsung ke Dashboard untuk memetakan tingkat pencemaran air.';
      } else if (lowerMsg.includes('cara kerja') || lowerMsg.includes('bagaimana') || lowerMsg.includes('kerja nya')) {
        mockReply = 'Cara kerjanya: Hydrone bergerak menyusuri perairan menggunakan sistem daya apung adaptif. Jaring nilon pasif akan otomatis menangkap sampah plastik besar, sementara sistem pompa hisap 2-tahap menyaring mikroplastik hingga ukuran 5 mikron secara bersamaan.';
      } else if (lowerMsg.includes('tim') || lowerMsg.includes('pembuat') || lowerMsg.includes('siapa') || lowerMsg.includes('sma')) {
        mockReply = 'HYDRONE dikembangkan oleh tim inovator dari SMA Negeri 1 Surakarta, yang terdiri dari: Marsya Razanah Khansa (Project Leader), Farid Wimbadi Nugraha (Hardware Engineer), Evan Fadillah Nur Santosa (Software Engineer), Raisa Qarira Santosa (Research Officer), dan Dzikron Zaidan Ahmad (Systems Integrator).';
      } else if (lowerMsg.includes('spesifikasi') || lowerMsg.includes('kabel') || lowerMsg.includes('baterai') || lowerMsg.includes('spek')) {
        mockReply = 'Spesifikasi Hydrone: Memiliki sistem propulsi pivot 6 arah (2 thruster brushless), kabel tether sepanjang 20 meter untuk komunikasi, sistem filter 10um & 5um, serta menggunakan otak utama ESP32 IoT. Dapat beroperasi secara Manual via Dashboard maupun Otonom.';
      } else if (lowerMsg.includes('mikroplastik') || lowerMsg.includes('filter') || lowerMsg.includes('saring')) {
        mockReply = 'Untuk mikroplastik, Hydrone menggunakan sistem "Dual-Stage Microplastic Suction". Pompa DC menyedot air melewati filter 10 mikron terlebih dahulu, kemudian dilanjutkan ke filter 5 mikron, sehingga partikel mikroplastik super halus berhasil ditangkap.';
      } else if (lowerMsg.includes('halo') || lowerMsg.includes('hai') || lowerMsg.includes('hi') || lowerMsg.includes('pagi') || lowerMsg.includes('siang') || lowerMsg.includes('malam')) {
        mockReply = 'Halo! Saya AI Assistant resmi HYDRONE (Mode Offline). Saya sudah dibekali data lengkap mengenai proyek ini. Silakan tanyakan apa saja seputar fungsi, sensor, cara kerja, atau tim pembuat Hydrone!';
      } else if (lowerMsg.includes('visi') || lowerMsg.includes('misi') || lowerMsg.includes('tujuan')) {
        mockReply = 'Visi HYDRONE adalah mewujudkan perairan Indonesia yang bebas dari sampah plastik dan mikroplastik. Tujuannya adalah mengumpulkan sampah sebelum terfragmentasi, dan menghasilkan data kualitas air untuk penelitian serta kebijakan lingkungan.';
      }

      return NextResponse.json({ 
        success: true, 
        reply: `*(Offline)* ${mockReply}`
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
