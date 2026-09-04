'use client'

import { useLang } from '@/lib/i18n/context'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 18 + 6,
        duration: Math.random() * 15 + 8,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.5 + 0.15,
      })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full border border-[#00B4D8]/50 bg-[#00B4D8]/20"
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
    eyebrow: { id: 'RIVER ROV  ·  IID INNOPA 2026', en: 'RIVER ROV  ·  IID INNOPA 2026' },
    h1line1: { id: 'Cleaning Rivers.', en: 'Cleaning Rivers.' },
    h1line2: { id: 'Reading Water.', en: 'Reading Water.' },
    h1line3: { id: 'Built by Students.', en: 'Built by Students.' },
    sub: {
      id: 'Hydrone adalah ROV bawah air yang mengumpulkan sampah plastik sungai dan mengirim data kualitas air secara real-time, dibangun dari nol oleh tim pelajar SMA.',
      en: 'Hydrone is an underwater ROV that collects river plastic and streams live water quality data — built from scratch by a five-person high school team.',
    },
    cta1: { id: 'Lihat Dashboard', en: 'View Dashboard' },
    cta2: { id: 'Pelajari Lebih', en: 'Learn More' },
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hex-bg" style={{ background: 'var(--t-bg)' }}>
      <Bubbles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 pt-32">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          {/* Left: copy */}
          <div>
            <span className="eyebrow">{T.eyebrow[lang]}</span>
            <span className="eyebrow-rule" />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="block" style={{ color: 'var(--t-text)' }}>{T.h1line1[lang]}</span>
              <span className="block text-[#1A56DB]">{T.h1line2[lang]}</span>
              <span className="block text-[#F05A22]">{T.h1line3[lang]}</span>
            </h1>

            <p className="text-base sm:text-lg max-w-lg leading-relaxed mb-10" style={{ color: 'var(--t-muted)' }}>
              {T.sub[lang]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A56DB] hover:bg-[#1646B8] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#1A56DB]/30 min-h-[52px] text-sm"
              >
                {T.cta1[lang]}
                <ArrowRight size={16} />
              </a>
              <a
                href="#tentang"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all min-h-[52px] text-sm hover:bg-white/5"
                style={{ border: '1px solid var(--t-border)', color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}
              >
                {T.cta2[lang]}
              </a>
            </div>
          </div>

          {/* Right: ROV image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 rounded-3xl z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--t-bg), transparent, var(--t-bg))' }} />

              <div className="absolute inset-0 rounded-3xl flex items-center justify-center p-8 border" style={{ background: 'linear-gradient(135deg, var(--t-surface), var(--t-surface-2))', borderColor: 'var(--t-border)' }}>
                <div className="relative w-full h-full">
                  <Image src="/blue-logo-hydrone.png" alt="Hydrone ROV Logo" fill className="object-contain" />
                </div>
              </div>

              {/* Floating feature cards */}
              <div className="absolute -top-3 -right-3 glass rounded-xl px-3.5 py-2.5 text-xs animate-float-up z-20">
                <div className="font-bold font-[family-name:var(--font-jetbrains-mono)] text-sm" style={{ color: 'var(--t-text)' }}>0.1 µm</div>
                <div style={{ color: 'var(--t-muted)' }}>Filter Precision</div>
              </div>
              <div className="absolute top-1/2 -right-8 glass rounded-xl px-3.5 py-2.5 text-xs animate-float-up z-20" style={{ animationDelay: '1s' }}>
                <div className="font-bold text-sm" style={{ color: 'var(--t-text)' }}>DLH</div>
                <div style={{ color: 'var(--t-muted)' }}>Collab Partner</div>
              </div>
              <div className="absolute -bottom-3 -left-3 glass rounded-xl px-3.5 py-2.5 text-xs animate-float-up z-20" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" style={{ animation: 'live-pulse 2s ease-in-out infinite' }} />
                  <span className="font-bold text-sm" style={{ color: 'var(--t-text)' }}>Real-time</span>
                </div>
                <div style={{ color: 'var(--t-muted)' }}>Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
