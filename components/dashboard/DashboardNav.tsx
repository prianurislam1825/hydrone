'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Home, Info, Cpu } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const NAV_LINKS = [
  { label: { id: 'Beranda', en: 'Home' }, href: '/', icon: Home },
  { label: { id: 'Dashboard', en: 'Dashboard' }, href: '/dashboard', icon: LayoutDashboard },
  { label: { id: 'Tentang', en: 'About' }, href: '/#tentang', icon: Info },
  { label: { id: 'Spesifikasi', en: 'Specs' }, href: '/#spesifikasi', icon: Cpu },
]

export default function DashboardNav() {
  const { lang, toggle } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B3E]/90 backdrop-blur-xl border-b border-[#1E2D50] shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#1A56DB]/30">
              <Image
                src="/pfp-hydrone.png"
                alt="Hydrone"
                fill
                className="object-contain"
                onError={e => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  const p = t.parentElement
                  if (p) p.innerHTML = '<span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A56DB]/20 text-[#1A56DB] font-bold text-sm">H</span>'
                }}
              />
            </div>
            <span className="text-[#F8FAFF] font-bold text-lg tracking-wide font-[family-name:var(--font-space-grotesk)] group-hover:text-[#1A56DB] transition-colors">
              Hydrone
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href || (link.href === '/dashboard' && pathname.startsWith('/dashboard'))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm rounded-lg transition-all duration-200 min-h-[44px] flex items-center gap-2 ${
                    isActive
                      ? 'text-[#F8FAFF] bg-[#1A56DB]/15'
                      : 'text-[#8B9EC7] hover:text-[#F8FAFF] hover:bg-white/5'
                  }`}
                >
                  {link.label[lang]}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#1A56DB]" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Right Side ────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-[#8B9EC7] hover:text-[#F8FAFF] transition-all min-h-[44px]"
              aria-label="Toggle language"
            >
              <span className={lang === 'id' ? 'font-bold text-[#F8FAFF]' : ''}>ID</span>
              <span className="text-[#1E2D50]">/</span>
              <span className={lang === 'en' ? 'font-bold text-[#F8FAFF]' : ''}>EN</span>
            </button>

            {/* LIVE badge */}
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
          </div>

          {/* ── Mobile Right ──────────────────────────────── */}
          <div className="md:hidden flex items-center gap-3">
            <span className="live-badge text-xs">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              LIVE
            </span>
            <button
              onClick={() => setIsOpen(v => !v)}
              className="p-2 text-[#8B9EC7] hover:text-[#F8FAFF] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0D1B3E]/98 backdrop-blur-xl border-t border-[#1E2D50] px-4 py-4 space-y-1">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px] ${
                  isActive
                    ? 'text-[#F8FAFF] bg-[#1A56DB]/15'
                    : 'text-[#8B9EC7] hover:text-[#F8FAFF] hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {link.label[lang]}
              </Link>
            )
          })}
          <button
            onClick={() => { toggle(); setIsOpen(false) }}
            className="w-full text-left px-4 py-3 text-[#8B9EC7] hover:text-[#F8FAFF] hover:bg-white/5 rounded-lg min-h-[44px]"
          >
            {lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
          </button>
        </div>
      </div>
    </nav>
  )
}
