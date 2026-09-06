'use client'

import { useLang } from '@/lib/i18n/context'
import {
    Bell,
    ChevronLeft, ChevronRight,
    Cpu, Gamepad2,
    History,
    LayoutDashboard,
    LogOut,
    Settings
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: { id: 'Dashboard',  en: 'Dashboard'  }, href: '/dashboard',          icon: LayoutDashboard },
  { label: { id: 'Riwayat',    en: 'History'    }, href: '/dashboard/history',  icon: History },
  { label: { id: 'Perangkat',  en: 'Devices'    }, href: '/dashboard/devices',  icon: Cpu },
  { label: { id: 'Kontrol',    en: 'Control'    }, href: '/dashboard/control',  icon: Gamepad2 },
  { label: { id: 'Alert',      en: 'Alerts'     }, href: '/dashboard/alerts',   icon: Bell },
  { label: { id: 'Pengaturan', en: 'Settings'   }, href: '/dashboard/profile',  icon: Settings },
]

export default function Sidebar() {
  const pathname    = usePathname()
  const { lang }    = useLang()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-r transition-all duration-300 relative"
      style={{
        width:           collapsed ? 64 : 220,
        background:      'var(--t-surface)',
        borderColor:     'var(--t-border)',
        minHeight:       '100vh',
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{ borderColor: 'var(--t-border)', minHeight: 60 }}>
        <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'rgba(26,86,219,0.2)' }}>
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
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-extrabold text-sm leading-tight" style={{ color: 'var(--t-text)' }}>Hydrone</div>
            <div className="text-[10px]" style={{ color: 'var(--t-muted)' }}>IOT WATER SYSTEM</div>
          </div>
        )}
      </div>

      {/* ── Connection badge ─────────────────────────── */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border"
            style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
            LOCAL MODE
          </div>
        </div>
      )}

      {/* ── Nav items ────────────────────────────────── */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label[lang] : undefined}
              className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-150 group relative"
              style={{
                background:  isActive ? 'rgba(26,86,219,0.1)'  : 'transparent',
                color:       isActive ? '#1A56DB'               : 'var(--t-muted)',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(26,86,219,0.05)'
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              }}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#1A56DB]" />
              )}
              <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-semibold">{item.label[lang]}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom: user + logout ─────────────────────── */}
      <div className="border-t px-2 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--t-border)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
            style={{ background: 'rgba(26,86,219,0.05)' }}>
            <div className="w-7 h-7 rounded-full bg-[#1A56DB] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate" style={{ color: 'var(--t-text)' }}>Admin</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--t-muted)' }}>admin@hydrone.id</div>
            </div>
          </div>
        )}
        <Link href="/login"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all hover:bg-red-50 group"
          title={collapsed ? 'Keluar' : undefined}
          style={{ color: 'var(--t-muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#EF4444' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--t-muted)' }}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Keluar</span>}
        </Link>
      </div>

      {/* ── Collapse toggle ───────────────────────────── */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full border flex items-center justify-center transition-all hover:border-[#1A56DB] z-10"
        style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
