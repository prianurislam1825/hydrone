'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import {
    Bell,
    Bell as BellIcon,
    Cpu, Gamepad2,
    History,
    LayoutDashboard,
    LayoutGrid,
    Moon,
    Settings,
    Sun,
    X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/* ── All menu items ─────────────────────────────────────────────── */
const ALL_MENUS = [
  { label: 'Dashboard',  href: '/dashboard',          icon: LayoutDashboard, color: '#1A56DB' },
  { label: 'Riwayat',    href: '/dashboard/history',  icon: History,         color: '#F59E0B' },
  { label: 'Perangkat',  href: '/dashboard/devices',  icon: Cpu,             color: '#8B5CF6' },
  { label: 'Kontrol',    href: '/dashboard/control',  icon: Gamepad2,        color: '#F05A22' },
  { label: 'Alert',      href: '/dashboard/alerts',   icon: BellIcon,        color: '#EF4444' },
  { label: 'Pengaturan', href: '/dashboard/profile',  icon: Settings,        color: '#22C55E' },
]

/* ── Grid menu dropdown ─────────────────────────────────────────── */
function MenuGrid({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  return (
    <div
      className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl z-50 overflow-hidden"
      style={{
        width:       280,
        background:  'var(--t-surface)',
        borderColor: 'var(--t-border)',
        boxShadow:   '0 16px 48px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--t-border)' }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--t-muted)' }}>
          Semua Menu
        </span>
        <button onClick={onClose} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#EF4444]/10 transition-all" style={{ color: 'var(--t-muted)' }}>
          <X size={14} />
        </button>
      </div>

      {/* Grid 2×3 */}
      <div className="grid grid-cols-3 gap-px p-1" style={{ background: 'var(--t-border)' }}>
        {ALL_MENUS.map(item => {
          const Icon     = item.icon
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl transition-all group"
              style={{
                background: isActive ? item.color + '15' : 'var(--t-surface)',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = item.color + '08' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--t-surface)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: item.color + '15', border: `1px solid ${item.color}30` }}
              >
                <Icon size={18} style={{ color: item.color }} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className="text-[10px] font-semibold text-center leading-tight"
                style={{ color: isActive ? item.color : 'var(--t-muted)' }}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full" style={{ background: item.color }} />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t" style={{ borderColor: 'var(--t-border)' }}>
        <p className="text-[10px] text-center" style={{ color: 'var(--t-muted)', opacity: 0.6 }}>
          Hydrone Dashboard · v1.0
        </p>
      </div>
    </div>
  )
}

/* ── TopBar ─────────────────────────────────────────────────────── */
export default function TopBar() {
  const { theme, toggle: toggleTheme, mounted } = useTheme()
  const { lang, toggle: toggleLang }            = useLang()
  const [menuOpen, setMenuOpen]                 = useState(false)
  const menuRef                                 = useRef<HTMLDivElement>(null)

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <header
      className="hidden lg:flex fixed top-0 right-0 z-40 h-[60px] items-center justify-between px-6 border-b"
      style={{
        left:           'var(--sidebar-width, 220px)',
        background:     'var(--t-surface)',
        borderColor:    'var(--t-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: mode badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border"
          style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
          LOCAL MODE
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

        {/* Bell */}
        <button className="theme-toggle relative" aria-label="Notifications">
          <Bell size={15} />
        </button>

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

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--t-border)' }} />

        {/* ── Grid menu button ── */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Semua menu"
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{
              background:  menuOpen ? 'rgba(26,86,219,0.12)' : 'var(--t-bg)',
              borderColor: menuOpen ? '#1A56DB'               : 'var(--t-border)',
              color:       menuOpen ? '#1A56DB'               : 'var(--t-muted)',
            }}
          >
            {menuOpen ? <X size={16} /> : <LayoutGrid size={16} />}
          </button>

          {/* Dropdown */}
          {menuOpen && <MenuGrid onClose={() => setMenuOpen(false)} />}
        </div>
      </div>
    </header>
  )
}
