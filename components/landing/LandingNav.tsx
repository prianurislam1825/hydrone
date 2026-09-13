'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import { Download, LogIn, Menu, Moon, Sun, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const NAV_LINKS = [
  { label: { id: 'Beranda',    en: 'Home'        }, href: '/'             },
  { label: { id: 'Fitur',      en: 'Features'    }, href: '/features'     },
  { label: { id: 'Cara Kerja', en: 'How It Works' }, href: '/how-it-works' },
  { label: { id: 'Spesifikasi',en: 'Specs'        }, href: '/specs'        },
  { label: { id: 'Tim Kami',   en: 'Our Team'    }, href: '/team'         },
  { label: { id: 'Tentang',    en: 'About'       }, href: '/about'        },
]

export default function LandingNav() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const pathname = usePathname()
  const [isOpen,   setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Capture install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) setIsInstalled(true)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const [showInstallModal, setShowInstallModal] = useState(false)

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice
        if (outcome === 'accepted') setInstallPrompt(null)
        return
      } catch {
        // Fallback to modal if browser blocks prompt
      }
    }
    setShowInstallModal(true)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:    scrolled ? 'var(--t-nav-bg)'               : 'transparent',
        borderBottom:  scrolled ? '1px solid var(--t-nav-border)'  : 'none',
        backdropFilter:scrolled ? 'blur(20px)'                     : 'none',
        boxShadow:     scrolled ? '0 1px 20px rgba(0,0,0,0.06)'    : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* ── Logo ──────────────────────────────────── */}
          <Link href="/" className="flex items-center group shrink-0 py-1" aria-label="Hydrone Home">
            <Image
              src="/blue-logo-hydrone.png"
              alt="Hydrone"
              width={140}
              height={41}
              className="h-8 sm:h-9 w-auto object-contain logo-light transition-opacity duration-200"
              priority
            />
            <Image
              src="/white-logo-hydrone.png"
              alt="Hydrone"
              width={140}
              height={41}
              className="h-8 sm:h-9 w-auto object-contain logo-dark transition-opacity duration-200"
              priority
            />
          </Link>

          {/* ── Desktop nav links ─────────────────────── */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map(link => {
              const isAct = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-150 min-h-[40px] flex items-center"
                  style={{ color: isAct ? '#1A56DB' : 'var(--t-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = isAct ? '#1A56DB' : 'var(--t-muted)')}
                >
                  {link.label[lang]}
                  {/* Active underline */}
                  {isAct && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-[#1A56DB]" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Right controls ───────────────────────── */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Lang toggle */}
            <button
              onClick={toggleLang}
              className="h-9 px-2.5 rounded-lg text-xs font-semibold transition-all border"
              style={{
                color:       'var(--t-muted)',
                borderColor: 'var(--t-border)',
                background:  'var(--t-surface)',
              }}
              aria-label="Toggle language"
            >
              <span style={{ color: lang === 'id' ? 'var(--t-text)' : 'var(--t-muted)', fontWeight: lang === 'id' ? 700 : 500 }}>ID</span>
              <span className="mx-0.5" style={{ color: 'var(--t-border)' }}>/</span>
              <span style={{ color: lang === 'en' ? 'var(--t-text)' : 'var(--t-muted)', fontWeight: lang === 'en' ? 700 : 500 }}>EN</span>
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-5 mx-1" style={{ background: 'var(--t-border)' }} />

            {/* Login CTA */}
            <a
              href="/login"
              className="h-9 px-4 flex items-center gap-1.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background:  'linear-gradient(135deg, #1A56DB, #0D3A9E)',
                boxShadow:   '0 1px 8px rgba(26,86,219,0.25)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(26,86,219,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 8px rgba(26,86,219,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              <LogIn size={13} />
              {lang === 'id' ? 'Masuk' : 'Sign In'}
            </a>

            {/* Install App button (Desktop) */}
            {!isInstalled && (
              <button
                onClick={handleInstall}
                className="h-9 px-3 flex items-center gap-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: 'rgba(26,86,219,0.3)', color: '#1A56DB', background: 'rgba(26,86,219,0.06)' }}
                title={lang === 'id' ? 'Pasang sebagai Aplikasi' : 'Install App'}
              >
                <Download size={13} />
                {lang === 'id' ? 'Install App' : 'Install App'}
              </button>
            )}
          </div>

          {/* ── Mobile right ─────────────────────────── */}
          <div className="md:hidden flex items-center gap-1.5">
            {!isInstalled && (
              <button
                onClick={handleInstall}
                className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{ borderColor: 'rgba(26,86,219,0.3)', color: '#1A56DB', background: 'rgba(26,86,219,0.08)' }}
                title={lang === 'id' ? 'Install App' : 'Install App'}
              >
                <Download size={12} />
                <span>{lang === 'id' ? 'Install' : 'Install'}</span>
              </button>
            )}
            {mounted && (
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all"
              style={{ color: 'var(--t-muted)', borderColor: 'var(--t-border)', background: 'var(--t-surface)' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[520px]' : 'max-h-0'}`}
      >
        <div className="border-t px-4 py-3 flex flex-col gap-0.5"
          style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-nav-border)' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] flex items-center"
              style={{ color: pathname === link.href ? '#1A56DB' : 'var(--t-muted)' }}
            >
              {link.label[lang]}
            </Link>
          ))}
          {!isInstalled && (
            <div className="pt-2 pb-1 border-t" style={{ borderColor: 'var(--t-border)' }}>
              <button
                onClick={() => { handleInstall(); setIsOpen(false) }}
                className="w-full h-10 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-2"
                style={{ borderColor: 'rgba(26,86,219,0.3)', color: '#1A56DB', background: 'rgba(26,86,219,0.08)' }}
              >
                <Download size={14} />
                {lang === 'id' ? 'Install Aplikasi Hydrone' : 'Install Hydrone App'}
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 pt-2 mt-1 border-t" style={{ borderColor: 'var(--t-border)' }}>
            <button
              onClick={() => { toggleLang(); setIsOpen(false) }}
              className="flex-1 h-10 rounded-lg text-xs font-semibold border transition-all"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)', background: 'var(--t-surface)' }}
            >
              {lang === 'id' ? 'English' : 'Indonesia'}
            </button>
            <a
              href="/login"
              className="flex-1 h-10 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)' }}
            >
              <LogIn size={13} />
              {lang === 'id' ? 'Masuk' : 'Sign In'}
            </a>
          </div>
        </div>
      </div>

      {/* ── Universal Install Modal for All Browsers & Platforms ────────── */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md rounded-2xl p-6 border shadow-2xl overflow-hidden"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
          >
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border transition-all hover:opacity-80"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1A56DB]/10 border border-[#1A56DB]/20 text-[#1A56DB]">
                <Download size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">
                  {lang === 'id' ? 'Install Aplikasi Hydrone' : 'Install Hydrone App'}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--t-muted)' }}>
                  {lang === 'id' ? 'Panduan pemasangan untuk semua HP & Browser' : 'Installation guide for all devices & browsers'}
                </p>
              </div>
            </div>

            <div className="space-y-3 my-5 text-xs">
              {/* Android (Chrome, Edge, Samsung Internet, Firefox) */}
              <div className="p-3.5 rounded-xl border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                <div className="font-bold text-sm mb-1.5 flex items-center gap-2 text-[#1A56DB]">
                  <span>Android (Chrome / Edge / Samsung / Firefox)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1" style={{ color: 'var(--t-muted)' }}>
                  <li>{lang === 'id' ? 'Ketuk menu browser (titik 3 ⋮ di kanan atas)' : 'Tap browser menu (three dots ⋮ at top right)'}</li>
                  <li>{lang === 'id' ? 'Pilih "Install aplikasi" / "Tambahkan ke Layar Utama"' : 'Select "Install app" or "Add to Home screen"'}</li>
                </ol>
              </div>

              {/* iPhone / iPad (Safari, Chrome, Edge) */}
              <div className="p-3.5 rounded-xl border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                <div className="font-bold text-sm mb-1.5 flex items-center gap-2 text-[#00B4D8]">
                  <span>iOS iPhone / iPad (Safari & Chrome)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1" style={{ color: 'var(--t-muted)' }}>
                  <li>{lang === 'id' ? 'Ketuk tombol Bagikan / Share (ikon petak dengan panah)' : 'Tap Share button (square icon with arrow)'}</li>
                  <li>{lang === 'id' ? 'Gulir ke bawah lalu pilih "Tambahkan ke Layar Utama"' : 'Scroll down & select "Add to Home Screen"'}</li>
                </ol>
              </div>

              {/* Desktop / Laptop */}
              <div className="p-3.5 rounded-xl border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
                <div className="font-bold text-sm mb-1.5 flex items-center gap-2 text-[#F05A22]">
                  <span>Desktop (Chrome / Edge / Opera)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1" style={{ color: 'var(--t-muted)' }}>
                  <li>{lang === 'id' ? 'Klik ikon Install (⊕) di kanan bilah alamat browser' : 'Click Install icon (⊕) in address bar'}</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)' }}
            >
              {lang === 'id' ? 'Saya Mengerti' : 'Got It'}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
