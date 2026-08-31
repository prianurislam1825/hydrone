import type { Metadata } from 'next'
import DashboardNav from '@/components/dashboard/DashboardNav'

export const metadata: Metadata = {
  title: 'Dashboard — Live Telemetry',
  description: 'Real-time sensor data from Hydrone ROV — pH, TDS, turbidity, temperature and ROV telemetry.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D1B3E] hex-bg">
      <DashboardNav />
      <main className="pt-16">{children}</main>
    </div>
  )
}
