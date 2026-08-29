'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 12 + 4,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.3 + 0.05,
      })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full border border-[#1A56DB]/20 bg-[#1A56DB]/5"
          style={{
            left: b.left,
            bottom: '-40px',
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function HeroSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'RIVER ROV  \u00b7  IID INNOPA 2026', en: 'RIVER ROV  \u00b7  IID INNOPA 2026' },
    h1line1: { id: 'Cleaning Rivers.', en: 'Cleaning Rivers.' },
    h1line2: { id: 'Reading Water.', en: 'Reading Water.' },
    h1line3: { id: 'Built by Students.', en: 'Built by Students.' },
    sub: {
      id: 'Hydrone adalah ROV bawah air yang mengumpulkan sampah plastik sungai dan mengirim data kualitas air secara real-time, dibangun dari nol oleh tim pelajar SMA.',
      en: 'Hydrone is an underwater ROV that collects river plastic and streams live water quality data \u2014 built from scratch by a five-person high school team.',
    },
    cta1: { id: 'Lihat Dashboard', en: 'View Dashboard' },
    cta2: { id: 'Pelajari Lebih', en: 'Learn More' },
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0D1B3E] hex-bg">
      <Bubbles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 pt-32">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          {/* Left: copy */}
          <div>
            <span className="eyebrow">{T.eyebrow[lang]}</span>
            <span className="eyebrow-rule" />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="block text-[#F8FAFF]">{T.h1line1[lang]}</span>
              <span className="block text-[#1A56DB]">{T.h1line2[lang]}</span>
              <span className="block text-[#F05A22]">{T.h1line3[lang]}</span>
            </h1>

            <p className="text-[#8B9EC7] text-base sm:text-lg max-w-lg leading-relaxed mb-10">
              {T.sub[lang]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A56DB] hover:bg-[#1646B8] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#1A56DB]/30 min-h-[52px] text-sm"
              >
                {T.cta1[lang]}
                <ArrowRight size={16} />
              </a>
              <a
                href="#tentang"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#1E2D50] hover:border-[#8B9EC7] text-[#8B9EC7] hover:text-[#F8FAFF] font-semibold rounded-xl transition-all min-h-[52px] text-sm hover:bg-white/5"
              >
                {T.cta2[lang]}
              </a>
            </div>
          </div>

          {/* Right: ROV image / placeholder */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-md">
              {/* Blue vignette */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#0D1B3E] via-transparent to-[#0D1B3E] z-10 pointer-events-none" />

              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#111827] to-[#1C2A4A] border border-[#1E2D50] flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <Image
                    src="/blue-logo-hydrone.png"
                    alt="Hydrone ROV Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Floating sensor cards (with higher z-index) */}
              <div className="absolute -top-3 -right-3 glass rounded-xl px-3 py-2 text-xs animate-float-up z-20">
                <div className="text-[#8B9EC7]">pH</div>
                <div className="text-[#F8FAFF] font-bold font-[family-name:var(--font-jetbrains-mono)]">7.24</div>
                <div className="text-[#22C55E] text-[10px]">Normal</div>
              </div>
              <div className="absolute -bottom-3 -left-3 glass rounded-xl px-3 py-2 text-xs animate-float-up z-20" style={{ animationDelay: '1.5s' }}>
                <div className="text-[#8B9EC7]">Turbidity</div>
                <div className="text-[#F8FAFF] font-bold font-[family-name:var(--font-jetbrains-mono)]">34 NTU</div>
                <div className="text-[#22C55E] text-[10px]">Clear</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
