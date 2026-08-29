'use client'

import { User, Mail, Instagram, Phone } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'
import type { Lang } from '@/types'

interface TeamMember {
  name: string
  title: string
  role: { id: string; en: string }
  desc: { id: string; en: string }
  color: string
  wa: string
  ig: string
  email: string
  leader?: boolean
}

const TEAM: TeamMember[] = [
  {
    name: 'Marsya Razanah Khansa',
    title: 'Project Leader',
    role: { id: 'Ketua Tim', en: 'Team Leader' },
    desc: {
      id: 'Memimpin seluruh visi dan pengembangan HYDRONE dari konsep hingga implementasi lapangan.',
      en: 'Leads the entire vision and development of HYDRONE from concept to field implementation.',
    },
    color: '#D4A017',
    wa: 'https://wa.me/6281227917676',
    ig: 'https://www.instagram.com/[username_marsya]',
    email: 'marsyarazanah10@gmail.com',
    leader: true,
  },
  {
    name: 'Farid Wimbadi Nugraha',
    title: 'Hardware Engineer',
    role: { id: 'Insinyur Perangkat Keras', en: 'Hardware Engineer' },
    desc: {
      id: 'Bertanggung jawab atas desain dan implementasi sistem mekanik ROV, termasuk thruster, buoyancy, dan struktur badan alat.',
      en: 'Responsible for designing and implementing the ROV mechanical systems, including thrusters, buoyancy, and body structure.',
    },
    color: '#1565C0',
    wa: 'https://wa.me/6285868383180',
    ig: 'https://www.instagram.com/[username_farid]',
    email: 'f.wimbadi@gmail.com',
  },
  {
    name: 'Evan Fadillah Nur Santosa',
    title: 'Software Engineer',
    role: { id: 'Insinyur Perangkat Lunak', en: 'Software Engineer' },
    desc: {
      id: 'Mengembangkan firmware ESP32, sistem kendali Arduino, dan dashboard web untuk monitoring real-time.',
      en: 'Develops ESP32 firmware, Arduino control systems, and the web dashboard for real-time monitoring.',
    },
    color: '#43A047',
    wa: 'https://wa.me/6281228662047',
    ig: 'https://www.instagram.com/[username_evan]',
    email: 'evanfadillah445@gmail.com',
  },
  {
    name: 'Raisa Qarira Santosa',
    title: 'Research Officer',
    role: { id: 'Penanggung Jawab Riset', en: 'Research Officer' },
    desc: {
      id: 'Memimpin penelitian dampak mikroplastik, analisis data kualitas air, dan dokumentasi ilmiah untuk kompetisi.',
      en: 'Leads microplastic impact research, water quality data analysis, and scientific documentation for competitions.',
    },
    color: '#00B4D8',
    wa: 'https://wa.me/6285727178769',
    ig: 'https://www.instagram.com/[username_raisa]',
    email: 'raisasa.qs@gmail.com',
  },
  {
    name: 'Dzikron Zaidan Ahmad',
    title: 'Systems Integrator',
    role: { id: 'Integrator Sistem', en: 'Systems Integrator' },
    desc: {
      id: 'Mengintegrasikan seluruh subsistem HYDRONE mulai dari sensor, elektronik, hingga sistem komunikasi tether.',
      en: 'Integrates all HYDRONE subsystems from sensors and electronics to the tether communication system.',
    },
    color: '#9C27B0',
    wa: 'https://wa.me/6281548158100',
    ig: 'https://www.instagram.com/[username_dzikron]',
    email: 'dzikronzaidan@gmail.com',
  },
]

const T = {
  sectionLabel: { id: 'Tim Kami', en: 'Our Team' },
  heading: { id: 'Tim di Balik HYDRONE', en: 'The Team Behind HYDRONE' },
  sub: {
    id: 'Pelajar SMA Negeri 1 Surakarta yang berinovasi untuk lingkungan perairan',
    en: 'Students from SMA Negeri 1 Surakarta innovating for aquatic environments',
  },
}

function MemberCard({ member, lang }: { member: TeamMember; lang: Lang }) {
  return (
    <div
      className={`glass rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:border-white/20 ${
        member.leader ? 'lg:col-span-1' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
        style={{ backgroundColor: member.color + '25', border: `2px solid ${member.color}50` }}
      >
        <User size={32} style={{ color: member.color }} />
        {member.leader && (
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
            style={{ backgroundColor: member.color }}
          >
            ★
          </div>
        )}
      </div>

      {/* Badge */}
      <span
        className="text-xs font-bold px-3 py-1 rounded-full mb-3"
        style={{ color: member.color, backgroundColor: member.color + '20', border: `1px solid ${member.color}40` }}
      >
        {member.title}
      </span>

      {/* Name */}
      <h3 className="text-white font-bold text-base mb-1">{member.name}</h3>
      <p className="text-white/50 text-xs mb-3">{member.role[lang]}</p>
      <p className="text-white/60 text-sm leading-relaxed mb-5">{member.desc[lang]}</p>

      {/* Contact buttons */}
      <div className="flex gap-2 mt-auto">
        <a
          href={member.wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#43A047]/20 hover:bg-[#43A047]/30 text-[#43A047] rounded-lg text-xs font-semibold transition-all min-h-[36px]"
        >
          <Phone size={13} />
          WA
        </a>
        <a
          href={member.ig}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs font-semibold transition-all min-h-[36px]"
        >
          <Instagram size={13} />
          IG
        </a>
        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1565C0]/20 hover:bg-[#1565C0]/30 text-[#90E0EF] rounded-lg text-xs font-semibold transition-all min-h-[36px]"
        >
          <Mail size={13} />
          Email
        </a>
      </div>
    </div>
  )
}

export default function TeamSection() {
  const { lang } = useLang()

  const leader = TEAM.find(m => m.leader)
  const members = TEAM.filter(m => !m.leader)

  return (
    <section id="tim" className="py-24 bg-[#1B3A6B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-anim>
          <span className="section-label">{T.sectionLabel[lang]}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">{T.heading[lang]}</h2>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">{T.sub[lang]}</p>
        </div>

        {/* Leader card centered */}
        {leader && (
          <div className="flex justify-center mb-8" data-anim>
            <div className="w-full max-w-sm">
              <MemberCard member={leader} lang={lang} />
            </div>
          </div>
        )}

        {/* Members grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <div key={i} data-anim data-delay={`${i * 100}`}>
              <MemberCard member={member} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
