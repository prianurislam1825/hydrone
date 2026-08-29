'use client'

import Image from 'next/image'
import { useLang } from '@/lib/i18n/context'

const PARTNERS = [
  { name: 'SMA Negeri 1 Surakarta', src: '/partners/sman1.jpg', scale: 'scale-[1.35]' },
  { name: 'SMA Muhammadiyah PK', src: '/partners/smamuh.jpg', scale: 'scale-100' },
  { name: 'IID INNOPA', src: '/partners/innopa.png', scale: 'scale-100', invert: true },
  { name: 'Mersiflab', src: '/partners/mersiflab.png', scale: 'scale-100', invert: true },
]

export default function PartnersSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'DIDUKUNG OLEH', en: 'SUPPORTED BY' },
    heading: {
      id: 'Bersama membangun solusi perairan bersih untuk Indonesia.',
      en: 'Together building clean water solutions for Indonesia.',
    },
  }

  return (
    <section className="py-20 bg-[#111827] border-y border-[#1E2D50]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-anim>
          <span className="eyebrow">{T.eyebrow[lang]}</span>
          <span className="eyebrow-rule mx-auto mb-10" />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 transition-opacity duration-300" data-anim>
          {PARTNERS.map((p, i) => (
            <div key={i} className="relative w-28 h-28 bg-white rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#1A56DB]/20">
              <div className={`relative w-full h-full ${p.scale} ${p.invert ? 'brightness-0' : ''}`}>
                <Image
                  src={p.src}
                  alt={p.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.parentElement?.parentElement) {
                      target.parentElement.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#1C2A4A] text-[#8B9EC7] text-[10px] font-bold text-center p-2">${p.name}</div>`
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <p className="mt-12 text-[#8B9EC7] max-w-lg mx-auto text-sm" data-anim>
          {T.heading[lang]}
        </p>
      </div>
    </section>
  )
}
