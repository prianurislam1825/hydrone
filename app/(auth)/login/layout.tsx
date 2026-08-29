import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - HYDRONE Control Center',
  description: 'Masuk ke HYDRONE Control Center untuk monitoring dan kendali sistem ROV.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
