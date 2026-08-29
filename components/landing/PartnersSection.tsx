'use client'

import Image from 'next/image'
import { useLang } from '@/lib/i18n/context'

const PARTNERS = [
  {
    name: 'SMA Negeri 1 Surakarta',
    logo: '/partners/sman1-solo.png',
    abbr: 'SMAN1',
    color: '#1565C0',
  },
  {
    name: 'IID INNOPA',
    logo: '/partners/innopa.png',
    abbr: 'INNOPA',
    color: '#D4A017',
  },
  {
    name: 'Mersiflab',
    logo: '/partners/mersiflab.png',
    abbr: 'MERSIF',
    color: '#43A047',
  },
  {
    name: 'Mitra Strategis',
    logo: '',
    abbr: 'MITRA',
    color: '#9C27B0',
  },
]

const T = {
  sectionLabel: { id: 'Mitra Kami', en: 'Our Partners' },
  heading: { id: 'Didukung Oleh', en: 'Supported By' },
  tagline: {
    id: 'Bersama membangun solusi perairan bersih untuk Indonesia',
    en: 'Together building clean water solutions for Indonesia',
  },
}

export default function PartnersSection() {
  const { lang } = useLang()

  return (
    <section id="klien" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-anim>
          <span className="section-label">{T.sectionLabel[lang]}</span>
          <h2 className="text-3xl font-black text-[#0D1B2A] mt-2">{T.heading[lang]}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {PARTNERS.map((p, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-gray-50"
              data-anim
              data-delay={`${i * 100}`}
            >
              {p.logo ? (
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-sm"
                  style={{ backgroundColor: p.color }}
                >
                  {p.abbr}
                </div>
              )}
              <span className="text-gray-600 text-xs font-medium text-center leading-tight">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm font-medium" data-anim>
          {T.tagline[lang]}
        </p>
      </div>
    </section>
  )
}
