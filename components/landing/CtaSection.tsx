'use client'
import { useLang } from '@/lib/i18n/context'
import { ArrowRight } from 'lucide-react'

const T = {
  badge:   { id: 'STREAM DATA LANGSUNG', en: 'LIVE DATA STREAM' },
  heading: { id: 'Punya pertanyaan atau ingin berkolaborasi?', en: 'Have questions or want to collaborate?' },
  sub:     { id: 'Tim Hydrone siap berdiskusi mengenai teknologi ROV dan pemantauan air.', en: 'The Hydrone team is ready to discuss ROV tech and water monitoring.' },
  cta:     { id: 'Hubungi Kami', en: 'Contact Us' },
}

export default function CtaSection() {
  const { lang } = useLang()

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 60% 60% at 30% 50%, rgba(26,86,219,0.1)  0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 70% 50%, rgba(240,90,34,0.07) 0%, transparent 55%)
        `,
      }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A7A 40%, #1A56DB 70%, #00B4D8 100%)',
            boxShadow: '0 24px 80px rgba(26,86,219,0.35)',
          }}
          data-anim
        >
          {/* Inner glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(240,90,34,0.2) 0%, transparent 55%)',
          }} />

          {/* Subtle hex grid overlay */}
          <div className="absolute inset-0 hex-bg opacity-10 pointer-events-none" aria-hidden />

          <div className="relative z-10">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 border border-white/20 bg-white/10 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
              {T.badge[lang]}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 max-w-lg mx-auto leading-snug text-white">
              {T.heading[lang]}
            </h2>

            <p className="text-sm text-white/70 mb-10 max-w-md mx-auto">
              {T.sub[lang]}
            </p>

            <div className="flex justify-center">
              <a
                href="mailto:hydrone.id@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold rounded-xl transition-all min-h-[52px] text-base hover:shadow-lg hover:-translate-y-0.5"
                style={{ color: '#1A56DB' }}
              >
                {T.cta[lang]}
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
