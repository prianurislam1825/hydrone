'use client'

import { User, Mail } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'
import type { Lang } from '@/types'

interface TeamMember {
  name: string
  role: { id: string; en: string }
  desc: { id: string; en: string }
  color: string
  email?: string
}

const TEAM: TeamMember[] = [
  {
    name: 'Dzikron Zaidan',
    role: { id: 'CEO (Team Leader)', en: 'CEO (Team Leader)' },
    desc: { id: 'Brand & Eksekutif', en: 'Brand & Executive' },
    color: '#F05A22',
    email: 'hydrone.id@gmail.com',
  },
  {
    name: 'Farid Wimbadi',
    role: { id: 'CTO', en: 'CTO' },
    desc: { id: 'Mekanik & Teknologi', en: 'Mechanics & Technology' },
    color: '#22C55E',
  },
  {
    name: 'Evan Fadillah',
    role: { id: 'CPO', en: 'CPO' },
    desc: { id: 'Produk & Firmware', en: 'Product & Firmware' },
    color: '#8B5CF6',
  },
  {
    name: 'Raisa Qarira',
    role: { id: 'CRO', en: 'CRO' },
    desc: { id: 'Riset & Data', en: 'Research & Data' },
    color: '#1A56DB',
  },
  {
    name: 'Marsya Razanah',
    role: { id: 'CMO', en: 'CMO' },
    desc: { id: 'Pemasaran & Visi', en: 'Marketing & Vision' },
    color: '#F59E0B',
  },
]

const T = {
  eyebrow: { id: 'TIM KAMI', en: 'OUR TEAM' },
  heading: { id: 'Dibangun oleh Mersiflab', en: 'Built by Mersiflab' },
  sub: {
    id: 'Lima pelajar SMA dengan satu misi: membersihkan sungai Indonesia.',
    en: 'Five high school students with one mission: cleaning Indonesian rivers.',
  },
  org: { id: 'Dibangun di bawah', en: 'Built under' },
  comp: { id: 'Untuk', en: 'For' },
}

function MemberCard({ member, lang }: { member: TeamMember; lang: Lang }) {
  return (
    <div className="bg-[#111827] border border-[#1E2D50] rounded-[20px] p-6 text-center hover:border-[#1A56DB] transition-all duration-300">
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: member.color + '20', border: `2px solid ${member.color}40` }}
      >
        <User size={28} style={{ color: member.color }} />
      </div>

      <h3 className="text-[#F8FAFF] font-bold text-base font-[family-name:var(--font-space-grotesk)]">{member.name}</h3>
      <span
        className="inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 mb-2"
        style={{ color: member.color, backgroundColor: member.color + '15', border: `1px solid ${member.color}30` }}
      >
        {member.role[lang]}
      </span>
      <p className="text-[#8B9EC7] text-sm">{member.desc[lang]}</p>

      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#8B9EC7] hover:text-[#1A56DB] transition-colors min-h-[36px]"
        >
          <Mail size={12} />
          {member.email}
        </a>
      )}
    </div>
  )
}

export default function TeamSection() {
  const { lang } = useLang()

  return (
    <section id="tim" className="py-24 bg-[#0D1B3E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-anim>
          <span className="eyebrow">{T.eyebrow[lang]}</span>
          <span className="eyebrow-rule mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFF] mt-4">{T.heading[lang]}</h2>
          <p className="text-[#8B9EC7] mt-3 max-w-md mx-auto">{T.sub[lang]}</p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-16">
          {TEAM.map((member, i) => (
            <div key={i} data-anim data-delay={`${i * 100}`}>
              <MemberCard member={member} lang={lang} />
            </div>
          ))}
        </div>

        {/* Organization badge */}
        <div className="glass rounded-2xl p-8 text-center" data-anim>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div>
              <span className="text-[#8B9EC7] text-xs uppercase tracking-wider">{T.org[lang]}</span>
              <div className="text-[#F8FAFF] font-bold text-lg mt-1 font-[family-name:var(--font-space-grotesk)]">MERSIFLAB</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-[#1E2D50]" />
            <div>
              <span className="text-[#8B9EC7] text-xs uppercase tracking-wider">{T.comp[lang]}</span>
              <div className="text-[#F8FAFF] font-bold text-lg mt-1 font-[family-name:var(--font-space-grotesk)]">IID INNOPA 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
