'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import { Cpu, Home, Info, LayoutDashboard, Menu, Moon, Sun, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: { id: 'Beranda', en: 'Home' }, href: '/', icon: Home },
  { label: { id: 'Dashboard', en: 'Dashboard' }, href: '/dashboard', icon: LayoutDashboard },
  { label: { id: 'Tentang', en: 'About' }, href: '/#tentang', icon: Info },
  { label: { id: 'Spesifikasi', en: 'Specs' }, href: '/#spesifikasi', icon: Cpu },
]

export default function DashboardNav() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-lg"
      style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-nav-border)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
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
            <span
              className="font-bold text-lg tracking-wide font-[family-name:var(--font-space-grotesk)] group-hover:text-[#1A56DB] transition-colors"
              style={{ color: 'var(--t-text)' }}
            >
              Hydrone
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href || (link.href === '/dashboard' && pathname.startsWith('/dashboard'))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-sm rounded-lg transition-all duration-200 min-h-[44px] flex items-center gap-2"
                  style={{
                    color: isActive ? 'var(--t-text)' : 'var(--t-muted)',
                    background: isActive ? 'rgba(26,86,219,0.12)' : 'transparent',
                  }}
                >
                  {link.label[lang]}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#1A56DB]" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all min-h-[44px]"
              style={{ color: 'var(--t-muted)' }}
              aria-label="Toggle language"
            >
              <span style={{ fontWeight: lang === 'id' ? 700 : 400, color: lang === 'id' ? 'var(--t-text)' : 'var(--t-muted)' }}>ID</span>
              <span style={{ color: 'var(--t-border)' }}>/</span>
              <span style={{ fontWeight: lang === 'en' ? 700 : 400, color: lang === 'en' ? 'var(--t-text)' : 'var(--t-muted)' }}>EN</span>
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* LIVE badge */}
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            <span className="live-badge text-xs">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              LIVE
            </span>
            {mounted && (
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ color: 'var(--t-muted)' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div
          className="border-t px-4 py-4 space-y-1"
          style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-nav-border)' }}
        >
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px] hover:bg-white/5"
                style={{
                  color: isActive ? 'var(--t-text)' : 'var(--t-muted)',
                  background: isActive ? 'rgba(26,86,219,0.12)' : undefined,
                }}
              >
                <Icon size={16} />
                {link.label[lang]}
              </Link>
            )
          })}
          <button
            onClick={() => { toggleLang(); setIsOpen(false) }}
            className="w-full text-left px-4 py-3 rounded-lg min-h-[44px] hover:bg-white/5 transition-all"
            style={{ color: 'var(--t-muted)' }}
          >
            {lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
          </button>
        </div>
      </div>
    </nav>
  )
}
