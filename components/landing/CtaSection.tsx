'use client'

import { MessageCircle, Mail } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const TAGS = ['ROV Bawah Air', 'Filter 5µm', 'ESP32 IoT', 'Dual Mode', 'IID INNOPA']

const T = {
  heading: { id: 'Tertarik Berkolaborasi?', en: 'Interested in Collaborating?' },
  sub: {
    id: 'Kami terbuka untuk kemitraan, sponsorship, dan kolaborasi riset bersama HYDRONE. Hubungi kami sekarang.',
    en: 'We are open to partnerships, sponsorships, and research collaboration with HYDRONE. Contact us now.',
  },
  btnWhatsApp: { id: 'Chat WhatsApp', en: 'Chat WhatsApp' },
  btnEmail: { id: 'Kirim Email', en: 'Send Email' },
}

export default function CtaSection() {
  const { lang } = useLang()

  return (
    <section className="py-24 bg-gradient-to-br from-[#0A1628] via-[#1B3A6B] to-[#0A1628] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#00B4D8]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#1565C0]/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <div data-anim>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">{T.heading[lang]}</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">{T.sub[lang]}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12" data-anim data-delay="100">
          <a
            href="https://wa.me/6281227917676"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#43A047] hover:bg-[#388E3C] text-white font-bold rounded-xl transition-all shadow-lg min-h-[56px] text-base"
          >
            <MessageCircle size={20} />
            {T.btnWhatsApp[lang]}
          </a>
          <a
            href="mailto:marsyarazanah10@gmail.com"
            className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-bold rounded-xl transition-all min-h-[56px] text-base hover:bg-white/5"
          >
            <Mail size={20} />
            {T.btnEmail[lang]}
          </a>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3" data-anim data-delay="200">
          {TAGS.map(tag => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
