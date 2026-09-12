'use client'

import { useLang } from '@/lib/i18n/context'
import Link from 'next/link'

interface PageHeaderProps {
  badge: { id: string; en: string }
  title: { id: string; en: string }
  subtitle: { id: string; en: string }
}

export default function PageHeader({ badge, title, subtitle }: PageHeaderProps) {
  const { lang } = useLang()

  return (
    <div className="relative py-16 sm:py-20 border-b overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--t-surface) 0%, var(--t-surface-2) 100%)',
        borderColor: 'var(--t-border)',
      }}>
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(26,86,219,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 80% 100%, rgba(0,180,216,0.08) 0%, transparent 60%)
        `,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold mb-4" style={{ color: 'var(--t-muted)' }}>
          <Link href="/" className="hover:text-[#1A56DB] transition-colors">
            {lang === 'id' ? 'Beranda' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#1A56DB] font-bold">{title[lang]}</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-4 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(26,86,219,0.15), rgba(0,180,216,0.1))',
            border: '1px solid rgba(26,86,219,0.25)',
            color: '#1A56DB',
          }}>
          <span className="w-2 h-2 rounded-full bg-[#1A56DB] animate-[live-pulse_2s_ease-in-out_infinite]" />
          {badge[lang]}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4"
          style={{
            background: 'linear-gradient(135deg, #1A56DB 0%, #00B4D8 60%, #1A56DB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {title[lang]}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: 'var(--t-muted)' }}>
          {subtitle[lang]}
        </p>
      </div>
    </div>
  )
}
