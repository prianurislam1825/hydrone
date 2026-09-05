import { LangProvider } from '@/lib/i18n/context'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Hydrone — River Debris Collection ROV',
    template: '%s | Hydrone',
  },
  description:
    'Hydrone is a student-built underwater ROV that collects river plastic and monitors water quality in real time. Built for IID INNOPA 2026 by Mersiflab.',
  keywords: ['Hydrone', 'ROV', 'underwater', 'river', 'plastic', 'microplastic', 'IID INNOPA', 'Mersiflab'],
  authors: [{ name: 'Mersiflab' }],
  other: { 'theme-color': '#EEF2FF' },
}

/**
 * Anti-flash inline script.
 * Default = LIGHT. Only switch to dark if user previously selected dark.
 */
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('hydrone-theme');
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    // light = default, no attribute needed
  } catch(e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="font-sans antialiased"
        style={{ backgroundColor: 'var(--t-bg)', color: 'var(--t-text)' }}
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
