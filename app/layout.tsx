import { LangProvider } from '@/lib/i18n/context'
import type { Metadata } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

// Plus Jakarta Sans — identical to SteriFlow font
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  display:  'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets:  ['latin'],
  weight:   ['400', '500', '600'],
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'Hydrone — River Debris Collection ROV',
    template: '%s | Hydrone',
  },
  description:
    'Hydrone is a student-built underwater ROV that collects river plastic and monitors water quality in real time. Built for IID INNOPA 2026 by Hydrone.',
  keywords: ['Hydrone', 'ROV', 'underwater', 'river', 'plastic', 'microplastic', 'IID INNOPA'],
  authors:  [{ name: 'Hydrone' }],
  other:    { 'theme-color': '#EEF2FF' },
}

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('hydrone-theme');
    if (t === 'dark') document.documentElement.setAttribute('data-theme','dark');
  } catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hydrone" />
        <link rel="apple-touch-icon" href="/pfp-hydrone.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(reg) { console.log('SW registered'); })
                .catch(function(err) { console.log('SW error:', err); });
            });
          }
        ` }} />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
        style={{
          fontFamily:          'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
          backgroundColor:     'var(--t-bg)',
          color:               'var(--t-text)',
          fontSize:            '16px',
          lineHeight:          '1.65',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        } as React.CSSProperties}
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
