'use client'

import { useLang } from '@/lib/i18n/context'

export default function LandingFooter() {
  const { lang } = useLang()
  const year = new Date().getFullYear()

  const T = {
    desc: {
      id: 'Proyek ROV pembersih sungai otonom oleh Mersiflab untuk IID INNOPA 2026.',
      en: 'Autonomous river-cleaning ROV project by Mersiflab for IID INNOPA 2026.',
    },
    rights: {
      id: `\u00a9 ${year} Tim Hydrone \u00b7 SMAN 1 Surakarta & SMA Muh PK. Semua hak cipta dilindungi.`,
      en: `\u00a9 ${year} Hydrone Team \u00b7 SMAN 1 Surakarta & SMA Muh PK. All rights reserved.`,
    },
  }

  return (
    <footer className="bg-[#050A14] py-12 border-t border-[#1E2D50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="text-[#F8FAFF] font-bold text-2xl font-[family-name:var(--font-space-grotesk)] mb-4">
          Hydrone
        </div>
        <p className="text-[#8B9EC7] text-sm max-w-md mb-8">
          {T.desc[lang]}
        </p>
        <div className="text-[#8B9EC7]/60 text-xs font-[family-name:var(--font-jetbrains-mono)]">
          {T.rights[lang]}
        </div>
      </div>
    </footer>
  )
}
