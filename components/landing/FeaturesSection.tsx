'use client'

import { useLang } from '@/lib/i18n/context'

const PILLARS = [
  {
    num: '01',
    gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
    glow: 'rgba(26,86,219,0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18"/><circle cx="7" cy="6" r="1" fill="currentColor"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="7" cy="18" r="1" fill="currentColor"/>
      </svg>
    ),
    title:   { id: 'COLLECT',  en: 'COLLECT' },
    desc:    { id: 'Jaring pasif menangkap sampah makroplastik pada setiap operasi tanpa motor tambahan.', en: 'Passive net captures macroplastic debris on every run without additional motors.' },
    tag:     { id: 'Pasif · Otomatis', en: 'Passive · Automatic' },
  },
  {
    num: '02',
    gradient: 'linear-gradient(135deg, #00B4D8, #22C55E)',
    glow: 'rgba(0,180,216,0.22)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 12 12 15 15 25"/><line x1="22" y1="3" x2="13" y2="12"/>
      </svg>
    ),
    title:   { id: 'FILTER',   en: 'FILTER' },
    desc:    { id: 'Filtrasi dua tahap: Stage 1 (20–50 µm sedimen) + Stage 2 (0.1 µm mikroplastik).', en: 'Two-stage filtration: Stage 1 (20–50 µm sediment) + Stage 2 (0.1 µm microplastic).' },
    tag:     { id: '0.1 µm Presisi', en: '0.1 µm Precision' },
  },
  {
    num: '03',
    gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    glow: 'rgba(240,90,34,0.22)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    title:   { id: 'MONITOR',  en: 'MONITOR' },
    desc:    { id: 'pH, TDS, turbidity, dan suhu distream real-time via tether ke dashboard web.', en: 'pH, TDS, turbidity and temperature streamed real-time via tether to the web dashboard.' },
    tag:     { id: 'Real-time · Live', en: 'Real-time · Live' },
  },
]

export default function FeaturesSection() {
  const { lang } = useLang()

  return (
    <section id="fitur" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(26,86,219,0.06) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-anim>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
            Tiga Kemampuan Utama
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, var(--t-text) 0%, #1A56DB 60%, #00B4D8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Satu ROV, Tiga Misi
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-6 cursor-default transition-all duration-500 ease-out overflow-hidden"
              style={{
                background: 'var(--t-surface)',
                border: '1px solid var(--t-border)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-6px) perspective(600px) rotateX(2deg)'
                el.style.boxShadow = `0 20px 48px ${p.glow}`
                el.style.borderColor = 'transparent'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(0) perspective(600px) rotateX(0deg)'
                el.style.boxShadow = 'none'
                el.style.borderColor = 'var(--t-border)'
              }}
              data-anim
              data-delay={`${i * 120}`}
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: p.gradient }} />

              {/* Number */}
              <div className="absolute top-4 right-4 text-4xl font-black opacity-5 font-[family-name:var(--font-plus-jakarta)]" style={{ color: 'var(--t-text)' }}>
                {p.num}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white transition-transform duration-300 group-hover:scale-110"
                style={{ background: p.gradient, boxShadow: `0 4px 16px ${p.glow}` }}>
                {p.icon}
              </div>

              <h3 className="font-extrabold text-xl tracking-wider mb-2 font-[family-name:var(--font-plus-jakarta)]" style={{ color: 'var(--t-text)' }}>
                {p.title[lang]}
              </h3>

              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--t-muted)' }}>
                {p.desc[lang]}
              </p>

              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: `${p.glow}`, border: `1px solid ${p.glow}`, color: 'var(--t-text)' }}>
                {p.tag[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
