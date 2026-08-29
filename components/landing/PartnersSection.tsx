'use client'

import Image from 'next/image'
import { useLang } from '@/lib/i18n/context'

const PARTNERS = [
  { name: 'SMA Negeri 1 Surakarta', src: '/partners/sman1.jpg' },
  { name: 'SMA Muhammadiyah PK', src: '/partners/smamuh.jpg' },
  { name: 'IID INNOPA', src: '/partners/innopa.png' },
  { name: 'Mersiflab', src: '/partners/mersiflab.png' },
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

        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 transition-opacity duration-300" data-anim>
          {PARTNERS.map((p, i) => (
            <div key={i} className="relative w-28 h-28 transition-all duration-300 drop-shadow-md hover:scale-105">
              <Image
                src={p.src}
                alt={p.name}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#1C2A4A] rounded-full text-[#8B9EC7] text-[10px] font-bold text-center p-2 border border-[#1E2D50]">${p.name}</div>`
                  }
                }}
              />
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
