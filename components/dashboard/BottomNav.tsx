'use client'

import {
    Bell,
    Cpu,
    Gamepad2, History,
    LayoutDashboard,
    LayoutGrid,
    Settings,
    X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/* ── Bottom tabs (4 main) ─────────────────────────────────── */
const TABS = [
  { label: 'Dashboard', href: '/dashboard',         icon: LayoutDashboard },
  { label: 'Kontrol',   href: '/dashboard/control', icon: Gamepad2, center: true },
  { label: 'Riwayat',   href: '/dashboard/history', icon: History },
  { label: 'Menu',      href: null,                 icon: LayoutGrid, gridTrigger: true },
]

/* ── All menus for the grid sheet ─────────────────────────── */
const ALL_MENUS = [
  { label: 'Dashboard',  href: '/dashboard',          icon: LayoutDashboard, color: '#1A56DB' },
  { label: 'Riwayat',    href: '/dashboard/history',  icon: History,         color: '#F59E0B' },
  { label: 'Perangkat',  href: '/dashboard/devices',  icon: Cpu,             color: '#8B5CF6' },
  { label: 'Kontrol',    href: '/dashboard/control',  icon: Gamepad2,        color: '#F05A22' },
  { label: 'Alert',      href: '/dashboard/alerts',   icon: Bell,            color: '#EF4444' },
  { label: 'Pengaturan', href: '/dashboard/profile',  icon: Settings,        color: '#22C55E' },
]

/* ── Menu grid bottom sheet ───────────────────────────────── */
function MenuSheet({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          background:  'var(--t-surface)',
          boxShadow:   '0 -8px 40px rgba(0,0,0,0.2)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--t-border)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--t-border)' }}>
          <span className="text-sm font-extrabold" style={{ color: 'var(--t-text)' }}>Semua Menu</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)', background: 'var(--t-bg)' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Grid 3×2 */}
        <div className="grid grid-cols-3 gap-3 p-4">
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
                className="flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl transition-all active:scale-95"
                style={{
                  background:  isActive ? item.color + '15' : 'var(--t-bg)',
                  border:      `1px solid ${isActive ? item.color + '40' : 'var(--t-border)'}`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: item.color + '18' }}
                >
                  <Icon size={20} style={{ color: item.color }} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span
                  className="text-xs font-semibold text-center leading-tight"
                  style={{ color: isActive ? item.color : 'var(--t-text)' }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ── BottomNav ────────────────────────────────────────────── */
export default function BottomNav() {
  const pathname          = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      {/* Menu sheet */}
      {sheetOpen && <MenuSheet onClose={() => setSheetOpen(false)} />}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl lg:hidden"
        style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-border)' }}
        aria-label="Bottom navigation"
      >
        <div className="flex items-stretch">
          {TABS.map(tab => {
            const Icon = tab.icon

            /* ── Grid trigger button ── */
            if ('gridTrigger' in tab && tab.gridTrigger) {
              return (
                <button
                  key="menu-grid"
                  onClick={() => setSheetOpen(v => !v)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] transition-all"
                  style={{ color: sheetOpen ? '#1A56DB' : 'var(--t-muted)' }}
                  aria-label="Semua menu"
                  aria-expanded={sheetOpen}
                >
                  {sheetOpen
                    ? <X size={20} strokeWidth={2.5} style={{ color: '#1A56DB' }} />
                    : <LayoutGrid size={20} strokeWidth={1.8} />
                  }
                  <span className="text-[10px] font-semibold tracking-wide">
                    {sheetOpen ? 'Tutup' : 'Menu'}
                  </span>
                </button>
              )
            }

            /* ── Center elevated button (Kontrol) ── */
            if ('center' in tab && tab.center && tab.href) {
              const isActive = pathname.startsWith(tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex-1 flex flex-col items-center justify-center relative -mt-3 pb-1"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl mb-1 transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #1A56DB, #00B4D8)'
                        : 'linear-gradient(135deg, #1C2A4A, #1A3060)',
                      boxShadow: isActive
                        ? '0 4px 20px rgba(26,86,219,0.5), 0 0 0 3px var(--t-bg)'
                        : '0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px var(--t-bg)',
                    }}
                  >
                    <Icon size={22} color="#ffffff" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-bold tracking-wide" style={{ color: isActive ? '#1A56DB' : 'var(--t-muted)' }}>
                    {tab.label}
                  </span>
                </Link>
              )
            }

            /* ── Regular tab ── */
            if (!tab.href) return null
            const isActive = tab.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(tab.href)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] relative transition-all"
                aria-current={isActive ? 'page' : undefined}
                style={{ color: isActive ? '#1A56DB' : 'var(--t-muted)' }}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#1A56DB]" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
