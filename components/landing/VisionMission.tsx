'use client'

import { Eye, Target, CheckCircle2 } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const MISSION_ITEMS = [
  {
    id: 'Membersihkan sampah plastik makro dari perairan sebelum terfragmentasi menjadi mikroplastik.',
    en: 'Clean macroplastic waste from water bodies before they fragment into microplastics.',
  },
  {
    id: 'Menyaring mikroplastik berukuran hingga 5 mikron yang sudah tersebar di kolom air.',
    en: 'Filter microplastics down to 5 microns already dispersed throughout the water column.',
  },
  {
    id: 'Menghasilkan data kualitas air real-time untuk mendukung penelitian dan kebijakan lingkungan.',
    en: 'Generate real-time water quality data to support environmental research and policy.',
  },
  {
    id: 'Mengembangkan teknologi pembersih perairan yang terjangkau dan dapat digunakan secara luas.',
    en: 'Develop affordable water cleaning technology that can be widely deployed.',
  },
  {
    id: 'Berkontribusi pada SDG 6, 12, dan 14 melalui inovasi teknologi berbasis data.',
    en: 'Contribute to SDG 6, 12, and 14 through data-driven technological innovation.',
  },
]

const T = {
  sectionLabel: { id: 'Visi & Misi', en: 'Vision & Mission' },
  heading: { id: 'Mengapa HYDRONE Ada?', en: 'Why Does HYDRONE Exist?' },
  visionLabel: { id: 'Visi', en: 'Vision' },
  visionTitle: {
    id: 'Perairan Indonesia Bebas Sampah Plastik dan Mikroplastik',
    en: 'Indonesian Waters Free from Plastic Waste and Microplastics',
  },
  visionDesc: {
    id: 'Kami percaya setiap sungai, danau, dan perairan pesisir Indonesia berhak bersih dari ancaman plastik yang merusak ekosistem dan mengancam kesehatan manusia.',
    en: 'We believe every river, lake, and coastal water in Indonesia deserves to be free from plastic threats that destroy ecosystems and endanger human health.',
  },
  missionLabel: { id: 'Misi', en: 'Mission' },
}

export default function VisionMission() {
  const { lang } = useLang()

  return (
    <section id="visi-misi" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-anim>
          <span className="section-label">{T.sectionLabel[lang]}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B2A] mt-2">{T.heading[lang]}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Vision card */}
          <div
            className="rounded-2xl p-8 bg-gradient-to-br from-[#0A1628] via-[#1B3A6B] to-[#0A1628] text-white shadow-2xl"
            data-anim
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/20 border border-[#00B4D8]/30 flex items-center justify-center">
                <Eye size={20} className="text-[#00B4D8]" />
              </div>
              <span className="font-bold text-[#00B4D8] uppercase tracking-wider text-sm">
                {T.visionLabel[lang]}
              </span>
            </div>
            <h3 className="text-xl font-black mb-4 leading-snug">{T.visionTitle[lang]}</h3>
            <p className="text-white/70 leading-relaxed">{T.visionDesc[lang]}</p>

            {/* Decorative wave */}
            <div className="mt-8 flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div
                  key={n}
                  className="flex-1 rounded-full bg-[#00B4D8]/30"
                  style={{ height: `${8 + (n % 4) * 6}px` }}
                />
              ))}
            </div>
          </div>

          {/* Mission card */}
          <div
            className="rounded-2xl p-8 bg-[#CAF0F8] border border-blue-100 shadow-sm"
            data-anim
            data-delay="100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1565C0]/10 border border-[#1565C0]/20 flex items-center justify-center">
                <Target size={20} className="text-[#1565C0]" />
              </div>
              <span className="font-bold text-[#1565C0] uppercase tracking-wider text-sm">
                {T.missionLabel[lang]}
              </span>
            </div>
            <ul className="space-y-4">
              {MISSION_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#43A047] mt-0.5 flex-shrink-0" />
                  <span className="text-[#0D1B2A]/80 text-sm leading-relaxed">{item[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
