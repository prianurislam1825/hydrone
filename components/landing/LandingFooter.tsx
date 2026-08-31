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
      id: `© ${year} Tim Hydrone · SMAN 1 Surakarta & SMA Muh PK. Semua hak cipta dilindungi.`,
      en: `© ${year} Hydrone Team · SMAN 1 Surakarta & SMA Muh PK. All rights reserved.`,
    },
  }

  return (
    <footer className="py-12 border-t" style={{ background: 'var(--t-surface-3)', borderColor: 'var(--t-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="font-bold text-2xl font-[family-name:var(--font-space-grotesk)] mb-4" style={{ color: 'var(--t-text)' }}>
          Hydrone
        </div>
        <p className="text-sm max-w-md mb-8" style={{ color: 'var(--t-muted)' }}>
          {T.desc[lang]}
        </p>
        <div className="text-xs font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>
          {T.rights[lang]}
        </div>
      </div>
    </footer>
  )
}
