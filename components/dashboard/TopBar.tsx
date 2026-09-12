'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import {
    Bell,
    Moon,
    Sun
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/* ── TopBar ─────────────────────────────────────────────────────── */
export default function TopBar() {
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const { lang, toggle: toggleLang }            = useLang()

  return (
    <header
      className="fixed top-0 left-0 lg:left-[var(--sidebar-width,220px)] right-0 z-40 h-[56px] lg:h-[60px] flex items-center justify-between px-3 sm:px-6 border-b backdrop-blur-xl"
      style={{
        background:     'var(--t-surface)',
        borderColor:    'var(--t-border)',
      }}
    >
      {/* Left: Brand logo (mobile) + mode badge */}
      <div className="flex items-center gap-2.5">
        <Link href="/dashboard" className="flex lg:hidden items-center gap-2 shrink-0 mr-1">
          <div className="w-7 h-7 rounded-lg overflow-hidden border relative" style={{ borderColor: 'rgba(26,86,219,0.25)' }}>
            <Image src="/pfp-hydrone.png" alt="Hydrone" fill className="object-contain" />
          </div>
          <span className="font-extrabold text-sm tracking-tight" style={{ color: 'var(--t-text)' }}>Hydrone</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border"
          style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
          {lang === 'id' ? 'MODE LOKAL' : 'LOCAL MODE'}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Lang */}
        <button
          onClick={toggleLang}
          className="h-8 px-2.5 rounded-lg text-xs font-semibold border transition-all"
          style={{ color: 'var(--t-muted)', borderColor: 'var(--t-border)', background: 'var(--t-bg)' }}
        >
          <span style={{ color: lang === 'id' ? 'var(--t-text)' : 'var(--t-muted)', fontWeight: lang === 'id' ? 700 : 500 }}>ID</span>
          <span className="mx-0.5" style={{ color: 'var(--t-border)' }}>/</span>
          <span style={{ color: lang === 'en' ? 'var(--t-text)' : 'var(--t-muted)', fontWeight: lang === 'en' ? 700 : 500 }}>EN</span>
        </button>

        {/* Theme */}
        {mounted && (
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}

        {/* Bell / Notifications */}
        <Link href="/dashboard/alerts" className="theme-toggle relative" aria-label={lang === 'id' ? 'Notifikasi' : 'Notifications'}>
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        </Link>

        {/* LIVE */}
        <span className="live-badge text-xs">
          <span className="live-dot" />
          LIVE
        </span>

        {/* Admin */}
        <Link href="/dashboard/profile" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1A56DB]/5 transition-all">
          <div className="w-7 h-7 rounded-full bg-[#1A56DB] flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>Admin</span>
        </Link>
      </div>
    </header>
  )
}

