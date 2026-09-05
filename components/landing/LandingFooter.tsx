'use client'

import { useLang } from '@/lib/i18n/context'
import { Github, Mail, MessageCircle } from 'lucide-react'

const NAV_LINKS = [
  { label: { id: 'Beranda', en: 'Home' }, href: '#' },
  { label: { id: 'Tentang', en: 'About' }, href: '#tentang' },
  { label: { id: 'Spesifikasi', en: 'Specs' }, href: '#spesifikasi' },
  { label: { id: 'Dashboard', en: 'Dashboard' }, href: '/dashboard' },
]

const CONTACT = [
  { icon: <Mail size={14} />,          href: 'mailto:hydrone.id@gmail.com',         label: 'hydrone.id@gmail.com' },
  { icon: <MessageCircle size={14} />, href: 'https://wa.me/6281548158100',          label: '+62 815-4815-8100' },
  { icon: <Github size={14} />,        href: 'https://github.com/prianurislam1825/hydrone', label: 'github.com/hydrone' },
]

export default function LandingFooter() {
  const { lang } = useLang()
  const year = new Date().getFullYear()

  const T = {
    tagline: { id: 'Cleaning Rivers. Reading Water. Built by Students.', en: 'Cleaning Rivers. Reading Water. Built by Students.' },
    desc:    { id: 'Proyek ROV bawah air untuk pembersihan makroplastik dan pemantauan kualitas air sungai — oleh Hydrone untuk IID INNOPA 2026.', en: 'Underwater ROV project for macroplastic collection and river water quality monitoring — by Hydrone for IID INNOPA 2026.' },
    nav:     { id: 'Navigasi', en: 'Navigation' },
    contact: { id: 'Kontak', en: 'Contact' },
    rights:  { id: `© ${year} Tim Hydrone · Hydrone. Semua hak cipta dilindungi.`, en: `© ${year} Hydrone Team · Hydrone. All rights reserved.` },
    school:  { id: 'SMAN 1 Surakarta & SMA Muhammadiyah PK', en: 'SMAN 1 Surakarta & SMA Muhammadiyah PK' },
  }

  return (
    <footer className="relative overflow-hidden border-t" style={{ borderColor: 'var(--t-border)' }}>
      {/* Gradient background */}
      <div style={{
        background: 'linear-gradient(160deg, var(--t-surface) 0%, var(--t-surface-2) 50%, var(--t-bg) 100%)',
      }}>
        {/* Top accent line */}
        <div className="h-0.5" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #F05A22, #1A56DB)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">

            {/* Brand col */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-2xl font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'var(--font-plus-jakarta)',
                  }}
                >
                  Hydrone
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-[#1A56DB]/20 text-[#1A56DB] bg-[#1A56DB]/5">
                  <span className="w-1 h-1 rounded-full bg-[#22C55E]" /> LIVE
                </span>
              </div>
              <p className="text-xs italic mb-3 font-medium" style={{
                background: 'linear-gradient(135deg, #1A56DB, #F05A22)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {T.tagline[lang]}
              </p>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--t-muted)' }}>
                {T.desc[lang]}
              </p>
            </div>

            {/* Nav col */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--t-muted)' }}>{T.nav[lang]}</div>
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map(l => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-sm transition-colors hover:text-[#1A56DB]"
                      style={{ color: 'var(--t-muted)' }}
                    >
                      {l.label[lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact col */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--t-muted)' }}>{T.contact[lang]}</div>
              <ul className="flex flex-col gap-3">
                {CONTACT.map((c, i) => (
                  <li key={i}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs transition-colors hover:text-[#1A56DB]"
                      style={{ color: 'var(--t-muted)' }}
                    >
                      {c.icon}
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, var(--t-border), transparent)' }} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]" style={{ color: 'var(--t-muted)' }}>
            <span className="font-[family-name:var(--font-jetbrains-mono)]">{T.rights[lang]}</span>
            <span>{T.school[lang]}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
