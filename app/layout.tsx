import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { LangProvider } from '@/lib/i18n/context'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Hydrone - River Debris Collection ROV',
    template: '%s | Hydrone',
  },
  description:
    'Hydrone is a student-built underwater ROV that collects river plastic and monitors water quality in real time. Built for IID INNOPA 2026 by Mersiflab.',
  keywords: ['Hydrone', 'ROV', 'underwater', 'river', 'plastic', 'microplastic', 'IID INNOPA', 'Mersiflab'],
  authors: [{ name: 'Mersiflab' }],
  other: { 'theme-color': '#0D1B3E' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-navy text-brand-white font-sans antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
