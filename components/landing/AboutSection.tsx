'use client'

import { useLang } from '@/lib/i18n/context'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const T = {
  eyebrow: { id: 'TENTANG HYDRONE', en: 'ABOUT HYDRONE' },
  p1: {
    id: 'Setiap tahun, jutaan ton plastik mengalir ke laut, dan sebagian besar masuk lewat sungai. Kami menanyakan satu pertanyaan sederhana: kenapa terus membersihkan lautan, kalau titik masuknya bisa dihentikan lebih dulu?',
    en: 'Every year, millions of tons of plastic flow into the ocean, and most of it enters through rivers. We started with one simple question: why keep cleaning the ocean, when the entry point can be stopped first?',
  },
  p2: {
    id: 'Hydrone adalah jawaban kami: ROV yang dirancang untuk menangkap sampah di berbagai sungai, sambil memantau kondisi air secara real-time.',
    en: 'Hydrone is our answer: an ROV designed to capture debris across different rivers, while monitoring water quality in real time.',
  },
  p3: {
    id: 'Dibangun dari PETG cetak 3D dan sensor off-the-shelf, lalu disempurnakan lewat puluhan iterasi desain. Hydrone dirancang bukan sekadar sebagai prototipe kompetisi, melainkan sebagai solusi yang bisa diadopsi lintas sungai dan lintas komunitas, membuka jalan bagi kolaborasi dengan pemerintah daerah dalam menjaga ekosistem sungai jangka panjang.',
    en: "Built from 3D-printed PETG and off-the-shelf sensors, then refined through dozens of design iterations. Hydrone isn't just built as a competition prototype, it's designed as a solution that can be adopted across rivers and communities, opening the door to collaboration with local governments in protecting river ecosystems for the long term.",
  },
  caption: {
    id: 'Mengumpulkan mikroplastik di kedalaman. Sungai Dengkeng, Jawa Tengah.',
    en: 'Collecting microplastics at depth. Sungai Dengkeng, Central Java.',
  },
}

const MEDIA = [
  { type: 'video', src: '/animation.mp4' },
  { type: 'image', src: '/hydrone-visual.jpg' },
  { type: 'image', src: '/image1.jpg' },
]

export default function AboutSection() {
  const { lang } = useLang()
  const [currentMedia, setCurrentMedia] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMedia(prev => (prev + 1) % MEDIA.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="tentang" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div data-anim>
            <span className="eyebrow">{T.eyebrow[lang]}</span>
            <span className="eyebrow-rule" />
            <div className="space-y-5 leading-relaxed text-base" style={{ color: 'var(--t-muted)' }}>
              <p>{T.p1[lang]}</p>
              <p className="font-medium" style={{ color: 'var(--t-text)' }}>{T.p2[lang]}</p>
              <p>{T.p3[lang]}</p>
            </div>
          </div>

          {/* Right: ROV media carousel */}
          <div data-anim="scale">
            <div className="relative rounded-2xl overflow-hidden border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="relative aspect-video">
                {MEDIA.map((media, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === currentMedia ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    {media.type === 'video' ? (
                      <video src={media.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <Image src={media.src} alt="Hydrone ROV" fill className="object-cover" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}>
                <p className="text-xs italic" style={{ color: 'var(--t-muted)' }}>{T.caption[lang]}</p>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#F05A22]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
