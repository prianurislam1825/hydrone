import DashboardShell from '@/components/dashboard/DashboardShell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Hydrone',
  description: 'Real-time sensor data, history, and control for Hydrone ROV.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
