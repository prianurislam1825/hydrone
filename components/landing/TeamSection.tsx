'use client'

import { useLang } from '@/lib/i18n/context'
import type { Lang } from '@/types'
import { ExternalLink, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface TeamMember {
  name:     string
  role:     { id: string; en: string }
  desc:     { id: string; en: string }
  color:    string
  gradient: string
  email?:   string
  phone?:   string
  photo?:   string
  initials: string
}

const TEAM: TeamMember[] = [
  {
    name: 'Dzikron Zaidan Ahmad',
    role: { id: 'CEO · Team Leader', en: 'CEO · Team Leader' },
    desc: { id: 'Brand & Strategi Eksekutif', en: 'Brand & Executive Strategy' },
    color: '#F05A22', gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    email: 'hydrone.id@gmail.com', phone: '081548158100', initials: 'DZ',
  },
  {
    name: 'Farid Wimbadi Nugraha',
    role: { id: 'CTO', en: 'CTO' },
    desc: { id: 'Mekanikal & Teknologi', en: 'Mechanical & Technology' },
    color: '#22C55E', gradient: 'linear-gradient(135deg, #22C55E, #00B4D8)',
    email: 'f.wimbadi@gmail.com', phone: '085868383180', initials: 'FW',
  },
  {
    name: 'Evan Fadillah Nur Santosa',
    role: { id: 'CPO', en: 'CPO' },
    desc: { id: 'Produk & Firmware', en: 'Product & Firmware' },
    color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #1A56DB)',
    email: 'evanfadillah445@gmail.com', phone: '081228662047', initials: 'EF',
  },
  {
    name: 'Raisa Qarira Santosa',
    role: { id: 'CRO', en: 'CRO' },
    desc: { id: 'Riset & Data', en: 'Research & Data' },
    color: '#1A56DB', gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
    email: 'raisasa.qs@gmail.com', phone: '085727178769', initials: 'RQ',
  },
  {
    name: 'Marsya Razanah Khansa',
    role: { id: 'CMO', en: 'CMO' },
    desc: { id: 'Pemasaran & Visi', en: 'Marketing & Vision' },
    color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #F05A22)',
    email: 'marsyarazanah10@gmail.com', phone: '081227917676', initials: 'MR',
  },
]

/* ── Simple elegant card — hover lift + border glow only ── */
function MemberCard({ member, lang, index }: { member: TeamMember; lang: Lang; index: number }) {
  const [hovered, setHovered]   = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 cursor-default"
      style={{
        background:   'var(--t-surface)',
        borderColor:  hovered ? member.color + '55' : 'var(--t-border)',
        transform:    hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:    hovered ? `0 16px 40px ${member.color}20` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-anim
      data-delay={`${index * 80}`}
    >
      {/* Color top bar */}
      <div className="h-1 shrink-0" style={{ background: member.gradient }} />

      {/* Photo / initials square */}
      <div className="relative mx-4 mt-4 rounded-xl overflow-hidden shrink-0"
        style={{ aspectRatio: '1/1', background: 'var(--t-surface-2)' }}>
        {member.photo && !imgError ? (
          <Image src={member.photo} alt={member.name} fill className="object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${member.color}18, ${member.color}06)` }}>
            <span className="font-black text-3xl tracking-tight select-none"
              style={{ background: member.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {member.initials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 self-start"
          style={{ color: member.color, background: member.color + '15', border: `1px solid ${member.color}25` }}>
          {member.role[lang]}
        </span>

        <h3 className="font-extrabold text-sm leading-tight mb-1" style={{ color: 'var(--t-text)' }}>
          {member.name}
        </h3>
        <p className="text-[11px] mb-3 flex-1" style={{ color: 'var(--t-muted)' }}>
          {member.desc[lang]}
        </p>

        {/* Contact */}
        <div className="flex flex-col gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--t-border)' }}>
          {member.phone && (
            <a href={`https://wa.me/62${member.phone.substring(1)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] transition-colors group"
              style={{ color: 'var(--t-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#22C55E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}>
              <Phone size={10} className="shrink-0" />{member.phone}
              <ExternalLink size={9} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`}
              className="flex items-center gap-1.5 text-[10px] transition-colors group"
              style={{ color: 'var(--t-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A56DB')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}>
              <Mail size={10} className="shrink-0" />
              <span className="truncate">{member.email}</span>
              <ExternalLink size={9} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeamSection() {
  const { lang } = useLang()

  return (
    <section id="tim" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-surface)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(26,86,219,0.05) 0%, transparent 55%)`,
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-14" data-anim>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'TIM KAMI' : 'OUR TEAM'}
          </div>
          <div className="w-12 h-0.5 mx-auto mb-5 rounded-full" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8)' }} />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: 'var(--t-text)' }}>
            {lang === 'id' ? 'Lima Otak di Balik Hydrone' : 'Five Minds Behind Hydrone'}
          </h2>
          <p className="max-w-md mx-auto text-sm" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id'
              ? 'Pelajar SMA dari Hydrone yang membangun solusi pembersih sungai dari nol.'
              : 'High school students from Hydrone building a river cleaning solution from scratch.'}
          </p>
        </div>

        {/* Equal 5-column grid — all cards same size */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
          {TEAM.map((member, i) => (
            <MemberCard key={member.name} member={member} lang={lang} index={i} />
          ))}
        </div>

        {/* Org badge */}
        <div className="rounded-2xl p-8 text-center relative overflow-hidden border" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }} data-anim>
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #F05A22)' }} />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {[
              { label: lang === 'id' ? 'Dibangun di bawah' : 'Built under', value: 'Hydrone', gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)' },
              { label: lang === 'id' ? 'Untuk kompetisi' : 'For competition', value: 'IID INNOPA 2026', gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)' },
              { label: 'Based in', value: 'Surakarta, Jawa Tengah', color: 'var(--t-text)' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--t-muted)' }}>{item.label}</div>
                <div className="font-extrabold text-xl" style={{
                  ...('gradient' in item ? { background: item.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : { color: item.color }),
                }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
