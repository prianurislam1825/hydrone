'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const NAV_LINKS = [
  { label: { id: 'Tentang', en: 'About' }, href: '#tentang' },
  { label: { id: 'Cara Kerja', en: 'How It Works' }, href: '#cara-kerja' },
  { label: { id: 'Produk', en: 'Product' }, href: '#produk' },
  { label: { id: 'Klien', en: 'Partners' }, href: '#klien' },
  { label: { id: 'Tim', en: 'Team' }, href: '#tim' },
  { label: { id: 'Visi & Misi', en: 'Vision & Mission' }, href: '#visi-misi' },
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

  const T = {
    contact: { id: 'Hubungi Kami', en: 'Contact Us' },
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#00B4D8]/20 flex items-center justify-center border border-[#00B4D8]/30">
              <Image
                src="/hydrone-logo.png"
                alt="HYDRONE"
                width={36}
                height={36}
                className="object-contain"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<span class="text-[#00B4D8] font-bold text-sm">H</span>'
                  }
                }}
              />
            </div>
            <span className="text-white font-bold text-lg tracking-wide group-hover:text-[#00B4D8] transition-colors">
              HYDRONE
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 min-h-[44px] flex items-center"
              >
                {link.label[lang]}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition-all min-h-[44px]"
              aria-label="Toggle language"
            >
              <span className={lang === 'id' ? 'font-bold text-[#00B4D8]' : 'text-white/50'}>ID</span>
              <span className="text-white/30">/</span>
              <span className={lang === 'en' ? 'font-bold text-[#00B4D8]' : 'text-white/50'}>EN</span>
            </button>

            {/* CTA */}
            <a
              href="https://wa.me/6281227917676"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#D4A017] hover:bg-[#D4A017]/90 text-white text-sm font-semibold rounded-lg transition-all min-h-[44px] shadow-lg hover:shadow-[#D4A017]/30"
            >
              <Phone size={16} />
              {T.contact[lang]}
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="px-2 py-1 text-xs text-white/70 border border-white/20 rounded min-h-[44px]"
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A1628]/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all min-h-[44px] flex items-center"
              >
                {link.label[lang]}
              </a>
            ))}
            <a
              href="https://wa.me/6281227917676"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 mt-2 bg-[#D4A017] text-white font-semibold rounded-lg text-center justify-center min-h-[44px]"
            >
              <Phone size={16} />
              {T.contact[lang]}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
