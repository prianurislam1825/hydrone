import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LangProvider } from '@/lib/i18n/context'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'HYDRONE - Autonomous Underwater Plastic Collector',
    template: '%s | HYDRONE',
  },
  description:
    'HYDRONE adalah ROV bawah air otonom untuk membersihkan sampah plastik makro dan mikroplastik di perairan Indonesia. Dikembangkan oleh tim pelajar SMA Negeri 1 Surakarta.',
  keywords: ['HYDRONE', 'ROV', 'underwater', 'plastic', 'microplastic', 'Indonesia', 'IID INNOPA'],
  authors: [{ name: 'Tim HYDRONE - SMA Negeri 1 Surakarta' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-deep-ocean text-white font-sans antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
