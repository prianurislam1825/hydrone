import DashboardNav from '@/components/dashboard/DashboardNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Live Telemetry',
  description: 'Real-time sensor data from Hydrone ROV — pH, TDS, turbidity, temperature and ROV telemetry.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen hex-bg" style={{ background: 'var(--t-bg)' }}>
      <DashboardNav />
      <main className="pt-16">{children}</main>
    </div>
  )
}
