import BottomNav from '@/components/dashboard/BottomNav'
import DashboardNav from '@/components/dashboard/DashboardNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Hydrone',
  description: 'Real-time sensor data, history, and control for Hydrone ROV.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--t-bg)' }}>
      <DashboardNav />
      {/* pt-16 = top nav height, pb-bottom-nav = bottom nav height */}
      <main className="pt-16 pb-bottom-nav">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
