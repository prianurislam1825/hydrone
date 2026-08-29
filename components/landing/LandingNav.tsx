'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const NAV_LINKS = [
  { label: { id: 'Beranda', en: 'Home' }, href: '#' },
  { label: { id: 'Dashboard', en: 'Dashboard' }, href: '/login' },
  { label: { id: 'Tentang', en: 'About' }, href: '#tentang' },
  { label: { id: 'Spesifikasi', en: 'Specs' }, href: '#spesifikasi' },
]

export default function LandingNav() {
  const { lang, toggle } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0D1B3E]/90 backdrop-blur-xl border-b border-[#1E2D50] shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/_PFP_Hydrone.png"
                alt="Hydrone"
                width={32}
                height={32}
                className="object-contain"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A56DB]/20 text-[#1A56DB] font-bold text-sm border border-[#1A56DB]/30">H</span>'
                  }
                }}
              />
            </div>
            <span className="text-[#F8FAFF] font-bold text-lg tracking-wide font-[family-name:var(--font-space-grotesk)] group-hover:text-[#1A56DB] transition-colors">
              Hydrone
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[#8B9EC7] hover:text-[#F8FAFF] hover:bg-white/5 rounded-lg transition-all duration-200 min-h-[44px] flex items-center"
              >
                {link.label[lang]}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-[#8B9EC7] hover:text-[#F8FAFF] transition-all min-h-[44px]"
              aria-label="Toggle language"
            >
              <span className={lang === 'id' ? 'font-bold text-[#F8FAFF]' : 'text-[#8B9EC7]'}>ID</span>
              <span className="text-[#1E2D50]">/</span>
              <span className={lang === 'en' ? 'font-bold text-[#F8FAFF]' : 'text-[#8B9EC7]'}>EN</span>
            </button>

            {/* LIVE badge */}
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <span className="live-badge text-xs">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              LIVE
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#8B9EC7] hover:text-[#F8FAFF] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0D1B3E]/98 backdrop-blur-xl border-t border-[#1E2D50]">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-[#8B9EC7] hover:text-[#F8FAFF] hover:bg-white/5 rounded-lg transition-all min-h-[44px]"
              >
                {link.label[lang]}
              </a>
            ))}
            <button
              onClick={() => { toggle(); setIsOpen(false) }}
              className="block w-full text-left px-4 py-3 text-[#8B9EC7] hover:text-[#F8FAFF] hover:bg-white/5 rounded-lg min-h-[44px]"
            >
              {lang === 'id' ? 'English' : 'Indonesia'}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
