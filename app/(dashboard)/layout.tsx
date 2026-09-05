import BottomNav from '@/components/dashboard/BottomNav'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Hydrone',
  description: 'Real-time sensor data, history, and control for Hydrone ROV.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--t-bg)' }}>
      {/* ── Sidebar — desktop only ── */}
      <Sidebar />

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — desktop only (sidebar handles mobile) */}
        <TopBar />
        {/* Content: pt for topbar on desktop, pb for bottom nav on mobile */}
        <main className="flex-1 lg:pt-[60px] pb-[72px] lg:pb-0 overflow-auto">
          {children}
        </main>
      </div>

      {/* ── Bottom nav — mobile only ── */}
      <BottomNav />
    </div>
  )
}
