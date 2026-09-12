'use client'

import { useLang } from '@/lib/i18n/context'
import {
    Cpu,
    Gamepad2, History,
    LayoutDashboard,
    User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* ── 5 Bottom Tabs (Home, Riwayat, Kontroler, Perangkat, Profil) ── */
const TABS = [
  { label: { id: 'Home', en: 'Home' },             href: '/dashboard',          icon: LayoutDashboard },
  { label: { id: 'Riwayat', en: 'History' },       href: '/dashboard/history',  icon: History },
  { label: { id: 'Kontroler', en: 'Controller' }, href: '/dashboard/control',  icon: Gamepad2, center: true },
  { label: { id: 'Perangkat', en: 'Devices' },     href: '/dashboard/devices',  icon: Cpu },
  { label: { id: 'Profil', en: 'Profile' },         href: '/dashboard/profile',  icon: User },
]

/* ── BottomNav ────────────────────────────────────────────── */
export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl lg:hidden"
      style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-border)' }}
      aria-label="Bottom navigation"
    >
      <div className="flex items-stretch">
        {TABS.map(tab => {
          const Icon = tab.icon

          /* ── Center elevated button (Kontroler) ── */
          if (tab.center) {
            const isActive = pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center relative -mt-3 pb-0.5 px-0.5"
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl mb-0.5 transition-all duration-200"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #1A56DB, #00B4D8)'
                      : 'linear-gradient(135deg, #1C2A4A, #1A3060)',
                    boxShadow: isActive
                      ? '0 4px 20px rgba(26,86,219,0.5), 0 0 0 3px var(--t-bg)'
                      : '0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px var(--t-bg)',
                  }}
                >
                  <Icon size={20} color="#ffffff" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-bold tracking-tight" style={{ color: isActive ? '#1A56DB' : 'var(--t-muted)' }}>
                  {tab.label[lang]}
                </span>
              </Link>
            )
          }

          /* ── Regular tab ── */
          const isActive = tab.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-0.5 min-h-[54px] relative transition-all"
              aria-current={isActive ? 'page' : undefined}
              style={{ color: isActive ? '#1A56DB' : 'var(--t-muted)' }}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#1A56DB]" />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] font-semibold tracking-tight">{tab.label[lang]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

