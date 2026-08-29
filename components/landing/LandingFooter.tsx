'use client'

import { Phone, Mail, Instagram, Radio } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const NAV_LINKS = [
  { label: { id: 'Beranda', en: 'Home' }, href: '#' },
  { label: { id: 'Tentang', en: 'About' }, href: '#tentang' },
  { label: { id: 'Fitur', en: 'Features' }, href: '#fitur' },
  { label: { id: 'Produk', en: 'Product' }, href: '#produk' },
  { label: { id: 'Tim', en: 'Team' }, href: '#tim' },
  { label: { id: 'Visi & Misi', en: 'Vision & Mission' }, href: '#visi-misi' },
]

const T = {
  brand: {
    sub: { id: 'Autonomous Underwater Plastic Collector', en: 'Autonomous Underwater Plastic Collector' },
    desc: {
      id: 'ROV bawah air untuk membersihkan sampah plastik dan mikroplastik di perairan Indonesia.',
      en: 'Underwater ROV to clean plastic waste and microplastics from Indonesian waters.',
    },
    status: { id: 'Sistem Aktif', en: 'System Active' },
  },
  navTitle: { id: 'Navigasi', en: 'Navigation' },
  compTitle: { id: 'Kompetisi', en: 'Competition' },
  copy: { id: '© 2025 HYDRONE | SMA Negeri 1 Surakarta | IID INNOPA', en: '© 2025 HYDRONE | SMA Negeri 1 Surakarta | IID INNOPA' },
}

export default function LandingFooter() {
  const { lang } = useLang()

  return (
    <footer className="bg-[#0A1628] pt-16 pb-8">
      {/* Tri-color top border */}
      <div className="flex h-1 mb-12">
        <div className="flex-1 bg-[#D4A017]" />
        <div className="flex-1 bg-[#1565C0]" />
        <div className="flex-1 bg-[#43A047]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#00B4D8]/20 border border-[#00B4D8]/30 flex items-center justify-center">
                <span className="text-[#00B4D8] font-black text-sm">H</span>
              </div>
              <span className="text-white font-black text-xl">HYDRONE</span>
            </div>
            <p className="text-[#00B4D8] text-xs font-semibold mb-2">{T.brand.sub[lang]}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">{T.brand.desc[lang]}</p>

            {/* Contact */}
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="https://wa.me/6281227917676"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-[#43A047] transition-colors text-sm min-h-[36px]"
              >
                <Phone size={15} className="text-[#43A047]" />
                +62 812-2791-7676
              </a>
              <a
                href="mailto:marsyarazanah10@gmail.com"
                className="flex items-center gap-2 text-white/60 hover:text-[#90E0EF] transition-colors text-sm min-h-[36px]"
              >
                <Mail size={15} className="text-[#90E0EF]" />
                marsyarazanah10@gmail.com
              </a>
              <a
                href="https://www.instagram.com/[username_marsya]"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-pink-400 transition-colors text-sm min-h-[36px]"
              >
                <Instagram size={15} className="text-pink-400" />
                @hydrone_official
              </a>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-[#43A047]" />
              <span className="text-xs font-medium text-[#43A047]">{T.brand.status[lang]}</span>
              <span className="w-2 h-2 rounded-full bg-[#43A047] animate-pulse-dot" />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              {T.navTitle[lang]}
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm min-h-[36px] flex items-center"
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Competition */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              {T.compTitle[lang]}
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="text-white/50 text-sm block min-h-[36px] flex items-center">
                  IID INNOPA
                </span>
              </li>
              <li>
                <span className="text-white/50 text-sm block min-h-[36px] flex items-center">
                  SMA Negeri 1 Surakarta
                </span>
              </li>
              <li>
                <span className="text-white/50 text-sm block min-h-[36px] flex items-center">
                  Mersiflab
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/40 text-sm">{T.copy[lang]}</p>
        </div>
      </div>
    </footer>
  )
}
