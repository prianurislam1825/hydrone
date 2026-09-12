'use client'

import { useLang } from '@/lib/i18n/context'
import { Mail, MessageCircle } from 'lucide-react'

const SUMMARY_STATS = [
  { value: '500mm', label: { id: 'Panjang', en: 'Length' } },
  { value: '120mm', label: { id: 'Tinggi', en: 'Height' } },
  { value: '4', label: { id: 'Thruster', en: 'Thrusters' } },
  { value: '0.1µm', label: { id: 'Presisi Mikro', en: 'Micro Precision' } },
  { value: '20m', label: { id: 'Tether', en: 'Tether' } },
  { value: '10m', label: { id: 'Kedalaman Maks', en: 'Max Depth' } },
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
    <section id="spesifikasi" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-anim>
          <span className="eyebrow">{T.eyebrow[lang]}</span>
          <span className="eyebrow-rule mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4" style={{ color: 'var(--t-text)' }}>{T.heading[lang]}</h2>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-16" data-anim>
          {SUMMARY_STATS.map((s, i) => (
            <div key={i} className="rounded-xl p-3.5 sm:p-4 text-center border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="font-extrabold text-xl sm:text-2xl font-[family-name:var(--font-plus-jakarta)]" style={{ color: 'var(--t-text)' }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--t-muted)' }}>{s.label[lang]}</div>
            </div>
          ))}
        </div>

        {/* Doc card */}
        <div className="glass rounded-2xl p-8 text-center" data-anim>
          <p className="text-sm mb-6 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--t-muted)' }}>{T.docNote[lang]}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hydrone.id@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all min-h-[48px] text-sm font-semibold w-full sm:w-auto border hover:bg-white/5"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
            >
              <Mail size={18} />{T.contact[lang]}
            </a>
            <a
              href="https://wa.me/6281548158100"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22C55E]/10 border border-[#22C55E]/20 hover:border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/20 font-semibold rounded-xl transition-all min-h-[48px] text-sm w-full sm:w-auto"
            >
              <MessageCircle size={18} />{T.contact[lang]}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
