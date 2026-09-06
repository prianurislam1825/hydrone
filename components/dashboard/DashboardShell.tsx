'use client'

import BottomNav from '@/components/dashboard/BottomNav'
import Sidebar    from '@/components/dashboard/Sidebar'
import TopBar     from '@/components/dashboard/TopBar'
import { usePathname } from 'next/navigation'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const isControl = pathname === '/dashboard/control'

  // Control page — fullscreen, no chrome
  if (isControl) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--t-bg)', overflow: 'hidden' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--t-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 lg:pt-[60px] pb-[72px] lg:pb-0 overflow-auto min-h-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
