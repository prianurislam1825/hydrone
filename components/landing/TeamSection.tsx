'use client'

import { useLang } from '@/lib/i18n/context'
import type { Lang } from '@/types'
import { Crown, ExternalLink, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

/* ── Team data — sorted by rank (CEO first) ─────────────────── */
interface TeamMember {
  rank:     number        // 1 = highest
  name:     string
  role:     { id: string; en: string }
  desc:     { id: string; en: string }
  color:    string
  gradient: string
  email?:   string
  phone?:   string
  photo?:   string
  initials: string
  featured?: boolean      // true = CEO spotlight
}

const TEAM: TeamMember[] = [
  {
    rank: 1, featured: true,
    name:     'Dzikron Zaidan Ahmad',
    role:     { id: 'CEO · Team Leader', en: 'CEO · Team Leader' },
    desc:     { id: 'Brand & Strategi Eksekutif', en: 'Brand & Executive Strategy' },
    color:    '#F05A22',
    gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    email:    'hydrone.id@gmail.com',
    phone:    '081548158100',
    initials: 'DZ',
    // photo: '/team/zaidan.jpg',
  },
  {
    rank: 2,
    name:     'Farid Wimbadi Nugraha',
    role:     { id: 'CTO', en: 'CTO' },
    desc:     { id: 'Mekanikal & Teknologi', en: 'Mechanical & Technology' },
    color:    '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E, #00B4D8)',
    email:    'f.wimbadi@gmail.com',
    phone:    '085868383180',
    initials: 'FW',
  },
  {
    rank: 3,
    name:     'Evan Fadillah Nur Santosa',
    role:     { id: 'CPO', en: 'CPO' },
    desc:     { id: 'Produk & Firmware', en: 'Product & Firmware' },
    color:    '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #1A56DB)',
    email:    'evanfadillah445@gmail.com',
    phone:    '081228662047',
    initials: 'EF',
  },
  {
    rank: 4,
    name:     'Raisa Qarira Santosa',
    role:     { id: 'CRO', en: 'CRO' },
    desc:     { id: 'Riset & Data', en: 'Research & Data' },
    color:    '#1A56DB',
    gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
    email:    'raisasa.qs@gmail.com',
    phone:    '085727178769',
    initials: 'RQ',
  },
  {
    rank: 5,
    name:     'Marsya Razanah Khansa',
    role:     { id: 'CMO', en: 'CMO' },
    desc:     { id: 'Pemasaran & Visi', en: 'Marketing & Vision' },
    color:    '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #F05A22)',
    email:    'marsyarazanah10@gmail.com',
    phone:    '081227917676',
    initials: 'MR',
  },
]

/* ── Rank badge label ────────────────────────────────────────── */
const RANK_LABEL: Record<number, string> = {
  1: 'Team Leader',
  2: 'Technical Lead',
  3: 'Product Lead',
  4: 'Research Lead',
  5: 'Marketing Lead',
}

/* ── 3D Tilt card ────────────────────────────────────────────── */
function MemberCard({
  member, lang, index, featured = false,
}: {
  member: TeamMember; lang: Lang; index: number; featured?: boolean
}) {
  const cardRef                     = useRef<HTMLDivElement>(null)
  const [tilt, setTilt]             = useState({ x: 0, y: 0 })
  const [hovered, setHovered]       = useState(false)
  const [imgError, setImgError]     = useState(false)
  const [glowPos, setGlowPos]       = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) / (rect.width  / 2)
    const dy   = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -10, y: dx * 10 })
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    })
  }

  const reset = () => { setTilt({ x: 0, y: 0 }); setHovered(false) }

  return (
    <div
      ref={cardRef}
      className="relative cursor-default"
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      data-anim
      data-delay={`${index * 100}`}
    >
      {/* ── Featured crown badge ── */}
      {featured && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black shadow-lg"
          style={{
            background: member.gradient,
            color:      '#fff',
            boxShadow:  `0 4px 16px ${member.color}50`,
          }}
        >
          <Crown size={10} />
          TEAM LEADER
        </div>
      )}

      <div
        className="relative rounded-2xl overflow-hidden flex flex-col border"
        style={{
          background:   'var(--t-surface)',
          borderColor:  hovered ? member.color + '60' : 'var(--t-border)',
          transform:    `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'}`,
          transition:   hovered ? 'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s' : 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s',
          boxShadow:    hovered ? `0 24px 56px ${member.color}28, 0 0 0 1px ${member.color}30` : 'none',
          willChange:   'transform',
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1 w-full" style={{ background: member.gradient }} />

        {/* Mouse-follow glow */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 120px at ${glowPos.x}% ${glowPos.y}%, ${member.color}18, transparent 70%)`,
            }}
          />
        )}

        {/* Photo / initials */}
        <div className="relative mx-4 mt-4 mb-0 rounded-xl overflow-hidden shrink-0"
          style={{ aspectRatio: '1/1', background: 'var(--t-surface-2)' }}>
          {member.photo && !imgError ? (
            <Image src={member.photo} alt={member.name} fill className="object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: `radial-gradient(circle at 40% 35%, ${member.color}22, ${member.color}08)` }}>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-xl opacity-25"
                style={{ background: `radial-gradient(circle at 50% 50%, ${member.color}44, transparent 65%)`, animation: `orange-glow 3s ease-in-out ${index * 0.5}s infinite` }} />
              {/* Corner brackets */}
              {[['top-2 left-2','border-t border-l'],['top-2 right-2','border-t border-r'],['bottom-2 left-2','border-b border-l'],['bottom-2 right-2','border-b border-r']].map(([pos, b], j) => (
                <div key={j} className={`absolute ${pos} w-4 h-4`}
                  style={{ borderColor: member.color + '55', borderStyle: 'solid',
                    borderTopWidth:    b.includes('border-t') ? 1.5 : 0,
                    borderBottomWidth: b.includes('border-b') ? 1.5 : 0,
                    borderLeftWidth:   b.includes('border-l') ? 1.5 : 0,
                    borderRightWidth:  b.includes('border-r') ? 1.5 : 0,
                  }} />
              ))}
              {/* Rank number watermark */}
              <span className="absolute top-2 right-3 text-[10px] font-black opacity-20 font-mono" style={{ color: member.color }}>
                #{member.rank}
              </span>
              {/* Initials */}
              <span
                className="relative z-10 font-black text-3xl tracking-tight"
                style={{
                  background: member.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                {member.initials}
              </span>
            </div>
          )}
          {/* Shimmer sweep on hover */}
          {hovered && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(125deg, transparent 30%, ${member.color}20 50%, transparent 70%)`, animation: 'shimmer 0.7s ease forwards' }} />
          )}
        </div>

        {/* Info */}
        <div className="relative z-10 p-4 flex flex-col flex-1">
          {/* Role badge */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ color: member.color, background: member.color + '15', border: `1px solid ${member.color}25` }}>
              {featured && <Crown size={9} />}
              {member.role[lang]}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-extrabold text-sm leading-tight mb-1"
            style={{ color: 'var(--t-text)', fontFamily: 'var(--font-plus-jakarta)' }}>
            {member.name}
          </h3>

          {/* Rank label */}
          <p className="text-[10px] font-semibold mb-1" style={{ color: member.color, opacity: 0.8 }}>
            {RANK_LABEL[member.rank]}
          </p>

          {/* Desc */}
          <p className="text-[11px] mb-3 leading-relaxed flex-1" style={{ color: 'var(--t-muted)' }}>
            {member.desc[lang]}
          </p>

          {/* Contact */}
          <div className="flex flex-col gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--t-border)' }}>
            {member.phone && (
              <a href={`https://wa.me/62${member.phone.substring(1)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] group/link transition-colors"
                style={{ color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#22C55E')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}>
                <Phone size={10} className="shrink-0" />{member.phone}
                <ExternalLink size={9} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`}
                className="flex items-center gap-1.5 text-[10px] group/link transition-colors"
                style={{ color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A56DB')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}>
                <Mail size={10} className="shrink-0" />
                <span className="truncate">{member.email}</span>
                <ExternalLink size={9} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom glow wash on hover */}
        {hovered && (
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${member.color}12, transparent)` }} />
        )}
      </div>
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────── */
export default function TeamSection() {
  const { lang } = useLang()

  const featured = TEAM.find(m => m.featured)!
  const rest     = TEAM.filter(m => !m.featured)

  return (
    <section id="tim" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-surface)' }}>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          from { opacity: 0; transform: translateX(-100%); }
          to   { opacity: 1; transform: translateX(200%); }
        }
      `}</style>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 60% 50% at 15%  30%, rgba(240,90,34,0.06)  0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 85%  70%, rgba(26,86,219,0.06)  0%, transparent 55%)
        `,
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-16" data-anim>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
            TIM KAMI
          </div>
          <div className="w-12 h-0.5 mx-auto mb-5 rounded-full" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8)' }} />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: 'var(--t-text)' }}>
            Lima Otak di Balik Hydrone
          </h2>
          <p className="max-w-md mx-auto text-sm" style={{ color: 'var(--t-muted)' }}>
            Pelajar SMA dari Hydrone yang membangun solusi pembersih sungai dari nol — dipimpin oleh satu visi.
          </p>
        </div>

        {/* ── Featured CEO — full-width spotlight ── */}
        <div className="flex justify-center mb-8" data-anim>
          <div className="relative w-full max-w-sm pt-5">
            <MemberCard member={featured} lang={lang} index={0} featured />
          </div>
        </div>

        {/* ── Hierarchy connector line ── */}
        <div className="flex flex-col items-center gap-0 mb-6" aria-hidden>
          <div className="w-0.5 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #F05A22, #1A56DB)' }} />
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-24 sm:w-40" style={{ background: 'linear-gradient(to left, #1A56DB, transparent)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#1A56DB', boxShadow: '0 0 8px #1A56DB' }} />
            <div className="h-0.5 w-24 sm:w-40" style={{ background: 'linear-gradient(to right, #1A56DB, transparent)' }} />
          </div>
        </div>

        {/* ── Rest of team — 2×2 on desktop, 1×2 on tablet, 1 on mobile ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {rest.map((member, i) => (
            <MemberCard key={member.rank} member={member} lang={lang} index={i + 1} />
          ))}
        </div>

        {/* ── Org badge ── */}
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden border"
          style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}
          data-anim
        >
          {/* Gradient top stripe */}
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #F05A22)' }} />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--t-muted)' }}>Dibangun di bawah</div>
              <div className="font-extrabold text-xl" style={{ fontFamily: 'var(--font-plus-jakarta)',
                background: 'linear-gradient(135deg, #1A56DB, #00B4D8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Hydrone
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 rounded-full" style={{ background: 'linear-gradient(to bottom, transparent, var(--t-border), transparent)' }} />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--t-muted)' }}>Untuk kompetisi</div>
              <div className="font-extrabold text-xl" style={{ fontFamily: 'var(--font-plus-jakarta)',
                background: 'linear-gradient(135deg, #F05A22, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                IID INNOPA 2026
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 rounded-full" style={{ background: 'linear-gradient(to bottom, transparent, var(--t-border), transparent)' }} />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--t-muted)' }}>Based in</div>
              <div className="font-extrabold text-xl" style={{ fontFamily: 'var(--font-plus-jakarta)', color: 'var(--t-text)' }}>
                Surakarta, Jawa Tengah
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
