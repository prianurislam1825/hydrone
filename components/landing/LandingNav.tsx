'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import { Menu, Moon, Sun, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: { id: 'Beranda', en: 'Home' }, href: '#' },
  { label: { id: 'Dashboard', en: 'Dashboard' }, href: '/dashboard' },
  { label: { id: 'Tentang', en: 'About' }, href: '#tentang' },
  { label: { id: 'Spesifikasi', en: 'Specs' }, href: '#spesifikasi' },
]

export default function LandingNav() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--t-nav-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--t-nav-border)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="flex items-center group">
            <div className="relative w-10 h-10 overflow-hidden">
              <Image
                src="/logo-white.png"
                alt="Hydrone"
                fill
                className="object-contain"
              />
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm rounded-lg transition-all duration-200 min-h-[44px] flex items-center hover:bg-white/5"
                style={{ color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}
              >
                {link.label[lang]}
              </a>
            ))}
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
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              style={{ color: 'var(--t-muted)' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden border-t backdrop-blur-xl"
          style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-nav-border)' }}
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg transition-all min-h-[44px] hover:bg-white/5"
                style={{ color: 'var(--t-muted)' }}
              >
                {link.label[lang]}
              </a>
            ))}
            <button
              onClick={() => { toggleLang(); setIsOpen(false) }}
              className="block w-full text-left px-4 py-3 rounded-lg min-h-[44px] hover:bg-white/5 transition-all"
              style={{ color: 'var(--t-muted)' }}
            >
              {lang === 'id' ? 'English' : 'Indonesia'}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
