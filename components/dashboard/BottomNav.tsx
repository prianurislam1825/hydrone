'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, Gamepad2, User } from 'lucide-react'

const TABS = [
  { label: 'Dashboard', href: '/dashboard',         icon: LayoutDashboard },
  { label: 'Riwayat',   href: '/dashboard/history',  icon: History },
  { label: 'Kontrol',   href: '/dashboard/control',  icon: Gamepad2 },
  { label: 'Profil',    href: '/dashboard/profile',  icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl"
      style={{ background: 'var(--t-nav-bg)', borderColor: 'var(--t-border)' }}
      aria-label="Bottom navigation"
    >
      <div className="max-w-screen-2xl mx-auto flex items-stretch">
        {TABS.map(tab => {
          const isActive =
            tab.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 min-h-[56px] relative"
              aria-current={isActive ? 'page' : undefined}
              style={{ color: isActive ? 'var(--t-blue)' : 'var(--t-muted)' }}
            >
              {/* Active indicator line */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#1A56DB]"
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
