'use client'

import { useLang } from '@/lib/i18n/context'
import { ArrowRight } from 'lucide-react'

const T = {
  badge:   { id: 'LIVE DATA STREAM', en: 'LIVE DATA STREAM' },
  heading: { id: 'Lihat sensor Hydrone streaming secara real-time.', en: "See Hydrone's sensors streaming in real time." },
  cta:     { id: 'Buka Dashboard', en: 'Open Dashboard' },
}

export default function CtaSection() {
  const { lang } = useLang()

  return (
    <section className="py-24" style={{ background: 'linear-gradient(to bottom, var(--t-bg), var(--t-surface))' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden" data-anim>
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#1A56DB]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10">
            <span className="live-badge justify-center mb-6">
              <span className="live-dot" />
              {T.badge[lang]}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold mb-8 max-w-md mx-auto leading-snug" style={{ color: 'var(--t-text)' }}>
              {T.heading[lang]}
            </h2>

            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A56DB] hover:bg-[#1646B8] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#1A56DB]/30 min-h-[56px] text-base"
            >
              {T.cta[lang]}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
