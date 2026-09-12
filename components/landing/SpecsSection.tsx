'use client'

import { useLang } from '@/lib/i18n/context'
import { Anchor, Filter, Gauge, MoveVertical, Radio, Ruler } from 'lucide-react'

const SUMMARY_STATS = [
  {
    value: '500mm',
    label: { id: 'Panjang', en: 'Length' },
    color: '#1A56DB',
    gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
    icon: <Ruler size={16} />,
  },
  {
    value: '120mm',
    label: { id: 'Tinggi', en: 'Height' },
    color: '#00B4D8',
    gradient: 'linear-gradient(135deg, #00B4D8, #22C55E)',
    icon: <MoveVertical size={16} />,
  },
  {
    value: '4',
    label: { id: 'Thruster', en: 'Thrusters' },
    color: '#F05A22',
    gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    icon: <Gauge size={16} />,
  },
  {
    value: '0.1µm',
    label: { id: 'Presisi Mikro', en: 'Micro Precision' },
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    icon: <Filter size={16} />,
  },
  {
    value: '20m',
    label: { id: 'Tether', en: 'Tether' },
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E, #00B4D8)',
    icon: <Radio size={16} />,
  },
  {
    value: '10m',
    label: { id: 'Kedalaman Maks', en: 'Max Depth' },
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #F05A22)',
    icon: <Anchor size={16} />,
  },
]

export default function SpecsSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'SPESIFIKASI TEKNIS', en: 'TECHNICAL SPECIFICATIONS' },
    heading: { id: 'Sekilas Pandang', en: 'At a Glance' },
    docNote: {
      id: 'Dokumentasi teknis lengkap tersimpan dalam Hydrone Bible, spesifikasi hidup yang dikelola oleh Librarian proyek.',
      en: 'Full technical documentation is maintained in the Hydrone Bible, a living specification document updated by the project Librarian.',
    },
    contact: { id: 'Hubungi Tim', en: 'Contact Team' },
  }

  return (
    <section id="spesifikasi" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(26,86,219,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 80%, rgba(240,90,34,0.04) 0%, transparent 50%)
        `,
      }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-anim>
          <span className="eyebrow">{T.eyebrow[lang]}</span>
          <span className="eyebrow-rule mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4" style={{ color: 'var(--t-text)' }}>{T.heading[lang]}</h2>
        </div>

        {/* Summary cards with vibrant icons & gradients — 2 rows (3 top, 3 bottom) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16" data-anim>
          {SUMMARY_STATS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center border relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group"
              style={{
                background: 'var(--t-surface)',
                borderColor: s.color + '35',
                boxShadow: `0 8px 24px ${s.color}12`,
              }}
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: s.gradient }} />

              {/* Icon badge */}
              <div
                className="w-11 h-11 rounded-2xl mx-auto mb-3.5 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
                style={{ background: s.color + '15', border: `1px solid ${s.color}30`, color: s.color }}
              >
                {s.icon}
              </div>

              {/* Value */}
              <div
                className="font-black text-2xl sm:text-3xl tracking-tight mb-1.5 font-[family-name:var(--font-plus-jakarta)]"
                style={{
                  background: s.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>

              {/* Label */}
              <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>
                {s.label[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
