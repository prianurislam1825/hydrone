'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import { Download, LogIn, Menu, Moon, Sun, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const NAV_LINKS = [
  { label: { id: 'Beranda',    en: 'Home'        }, href: '#'            },
  { label: { id: 'Cara Kerja', en: 'How It Works' }, href: '#cara-kerja' },
  { label: { id: 'Fitur',      en: 'Features'    }, href: '#fitur'       },
  { label: { id: 'Tim Kami',   en: 'Our Team'    }, href: '#tim'         },
  { label: { id: 'Kontak',     en: 'Contact'     }, href: '#spesifikasi' },
]

export default function LandingNav() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const [isOpen,   setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('#')
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

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
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
          <a href="#" className="flex items-center gap-2.5 group shrink-0" onClick={() => setActive('#')}>
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border"
              style={{ borderColor: 'rgba(26,86,219,0.2)' }}>
              <Image
                src="/pfp-hydrone.png"
                alt="Hydrone"
                fill
                className="object-contain"
                onError={e => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  const p = t.parentElement
                  if (p) p.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg,#1A56DB,#00B4D8);color:#fff;font-weight:800;font-size:13px">H</span>'
                }}
              />
            </div>
            <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--t-text)' }}>
              Hydrone
            </span>
          </a>

          {/* ── Desktop nav links ─────────────────────── */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map(link => {
              const isAct = active === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActive(link.href)}
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
                </a>
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

            {/* Install App — shows when browser allows install */}
            {installPrompt && !isInstalled && (
              <button
                onClick={handleInstall}
                className="h-9 px-3 flex items-center gap-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: 'rgba(26,86,219,0.3)', color: '#1A56DB', background: 'rgba(26,86,219,0.06)' }}
                title={lang === 'id' ? 'Install sebagai App' : 'Install App'}
              >
                <Download size={13} />
                {lang === 'id' ? 'Install' : 'Install'}
              </button>
            )}
          </div>

          {/* ── Mobile right ─────────────────────────── */}
          <div className="md:hidden flex items-center gap-1.5">
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
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[480px]' : 'max-h-0'}`}
      >
        <div className="border-t px-4 py-3 flex flex-col gap-0.5"
          style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-nav-border)' }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => { setActive(link.href); setIsOpen(false) }}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] flex items-center"
              style={{ color: active === link.href ? '#1A56DB' : 'var(--t-muted)' }}
            >
              {link.label[lang]}
            </a>
          ))}
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
    </nav>
  )
}
