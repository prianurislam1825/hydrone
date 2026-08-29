'use client'

import Image from 'next/image'
import { useLang } from '@/lib/i18n/context'

const T = {
  eyebrow: { id: 'TENTANG HYDRONE', en: 'ABOUT HYDRONE' },
  p1: {
    id: 'Kami adalah tim lima pelajar SMA dari Mersiflab, membangun ROV pembersih sungai untuk kompetisi IID INNOPA.',
    en: 'We are a five-person high school team from Mersiflab, building a river-cleaning ROV for the IID INNOPA competition.',
  },
  p2: {
    id: 'Hydrone dimulai dari sebuah pertanyaan: mengapa kita terus membersihkan lautan padahal plastik masuk melalui sungai?',
    en: 'Hydrone started as a question: why do we keep cleaning the ocean when the plastic enters through rivers?',
  },
  p3: {
    id: 'Kami membangun jawabannya dari PETG cetak 3D, sensor off-the-shelf, dan banyak iterasi.',
    en: 'We built the answer from 3D-printed PETG, off-the-shelf sensors, and a lot of iteration.',
  },
  caption: {
    id: 'Mengumpulkan mikroplastik di kedalaman. Sungai Dengkeng, Jawa Tengah.',
    en: 'Collecting microplastics at depth. Sungai Dengkeng, Central Java.',
  },
}

export default function AboutSection() {
  const { lang } = useLang()

  return (
    <section id="tentang" className="py-24 bg-[#0D1B3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div data-anim>
            <span className="eyebrow">{T.eyebrow[lang]}</span>
            <span className="eyebrow-rule" />

            <div className="space-y-5 text-[#8B9EC7] leading-relaxed text-base">
              <p>{T.p1[lang]}</p>
              <p className="text-[#F8FAFF] font-medium">{T.p2[lang]}</p>
              <p>{T.p3[lang]}</p>
            </div>
          </div>

          {/* Right: ROV image */}
          <div data-anim="scale">
            <div className="relative rounded-2xl overflow-hidden border border-[#1E2D50] bg-[#111827]">
              <div className="relative aspect-video">
                <Image
                  src="/ChatGPT_Image_Jun_30_2026_10_44_29_AM.png"
                  alt="Hydrone ROV underwater"
                  fill
                  className="object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111827] to-[#1C2A4A]">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[#1A56DB]/15 border border-[#1A56DB]/30 flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#1A56DB] text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">H</span>
                    </div>
                    <div className="text-[#8B9EC7] text-sm">Hydrone ROV Render</div>
                  </div>
                </div>
              </div>

              {/* Caption overlay */}
              <div className="px-5 py-3 border-t border-[#1E2D50] bg-[#111827]">
                <p className="text-[#8B9EC7] text-xs italic">
                  {T.caption[lang]}
                </p>
              </div>

              {/* Orange accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#F05A22]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
