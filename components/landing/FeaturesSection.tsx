'use client'

import { useLang } from '@/lib/i18n/context'

const PILLARS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" />
      </svg>
    ),
    title: { id: 'COLLECT', en: 'COLLECT' },
    desc: {
      id: 'Jaring pasif menangkap sampah plastik makro pada setiap operasi.',
      en: 'Passive net captures macro debris on every run.',
    },
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 3 2 12l10 3 3 10z" /><path d="m22 3-9 9" />
      </svg>
    ),
    title: { id: 'FILTER', en: 'FILTER' },
    desc: {
      id: 'Filtrasi dua tahap hingga 0.1 mikron untuk mikroplastik.',
      en: 'Two-stage filtration down to 0.1 microns.',
    },
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: { id: 'MONITOR', en: 'MONITOR' },
    desc: {
      id: 'pH, TDS, turbidity, dan suhu real-time via tether.',
      en: 'Real-time pH, TDS, turbidity and temperature via tether.',
    },
  },
]

export default function FeaturesSection() {
  const { lang } = useLang()

  return (
    <section className="py-24 bg-[#0D1B3E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="group bg-[#111827] border border-[#1E2D50] rounded-[20px] p-6 transition-all duration-300 hover:border-[#1A56DB] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1A56DB]/10"
              data-anim
              data-delay={`${i * 100}`}
            >
              <div className="text-[#1A56DB] mb-5 group-hover:text-[#F05A22] transition-colors">
                {p.icon}
              </div>
              <h3 className="text-[#F8FAFF] font-bold text-lg tracking-wider mb-3 font-[family-name:var(--font-space-grotesk)]">
                {p.title[lang]}
              </h3>
              <p className="text-[#8B9EC7] text-sm leading-relaxed">
                {p.desc[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
