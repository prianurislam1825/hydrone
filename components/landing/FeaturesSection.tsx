'use client'

import { useLang } from '@/lib/i18n/context'
import type { Lang } from '@/types'
import { Activity, Filter, Trash2 } from 'lucide-react'
import { useState } from 'react'

const PILLARS = [
  {
    num: '01',
    color: '#1A56DB',
    gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
    glow: 'rgba(26,86,219,0.22)',
    icon: <Trash2 size={24} />,
    name: { id: 'COLLECT WASTE', en: 'COLLECT WASTE' },
    desc: {
      id: 'Mengumpulkan sampah plastik dari permukaan air secara pasif pada setiap perjalanan tanpa tambahan motor.',
      en: 'Passively collects plastic waste from the water surface on every journey without additional motors.',
    },
    tag: { id: 'Pasif · Tanpa Motor', en: 'Passive · No Extra Motor' },
  },
  {
    num: '02',
    color: '#00B4D8',
    gradient: 'linear-gradient(135deg, #00B4D8, #22C55E)',
    glow: 'rgba(0,180,216,0.22)',
    icon: <Filter size={24} />,
    name: { id: 'FILTER WATER', en: 'FILTER WATER' },
    desc: {
      id: 'Menyaring air melalui dua tahap untuk memisahkan sedimen hingga mikroplastik berukuran 0,1 μm.',
      en: 'Filters water through two stages to separate sediment down to microplastics measuring 0.1 μm.',
    },
    tag: { id: '2 Tahap · 0,1 μm', en: '2 Stages · 0.1 μm' },
  },
  {
    num: '03',
    color: '#F05A22',
    gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    glow: 'rgba(240,90,34,0.22)',
    icon: <Activity size={24} />,
    name: { id: 'MONITOR WATER', en: 'MONITOR WATER' },
    desc: {
      id: 'Memantau kualitas air secara real-time melalui sensor pH, TDS, kekeruhan, dan suhu.',
      en: 'Monitors water quality in real-time through pH, TDS, turbidity, and temperature sensors.',
    },
    tag: { id: 'Real-time · 4 Sensor', en: 'Real-time · 4 Sensors' },
  },
]

function PillarCard({ pillar, lang, index }: { pillar: typeof PILLARS[0]; lang: Lang; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group relative rounded-2xl border flex flex-col overflow-hidden cursor-default transition-all duration-300"
      style={{
        background: 'var(--t-surface)',
        borderColor: hovered ? `${pillar.color}55` : 'var(--t-border)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px ${pillar.glow}` : '0 2px 10px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-anim
      data-delay={`${index * 120}`}
    >
      {/* Top accent gradient bar */}
      <div className="h-1 w-full shrink-0" style={{ background: pillar.gradient }} />

      <div className="p-6 sm:p-7 flex flex-col flex-1 relative">
        {/* Background number watermark */}
        <div
          className="absolute top-4 right-5 text-4xl font-black opacity-10 select-none font-[family-name:var(--font-plus-jakarta)]"
          style={{ color: pillar.color }}
        >
          {pillar.num}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white transition-transform duration-300 group-hover:scale-110 shrink-0"
          style={{ background: pillar.gradient, boxShadow: `0 6px 18px ${pillar.glow}` }}
        >
          {pillar.icon}
        </div>

        {/* Title: 01 — COLLECT WASTE */}
        <h3
          className="font-extrabold text-lg sm:text-xl tracking-tight mb-3 font-[family-name:var(--font-plus-jakarta)] flex items-center gap-1.5"
          style={{ color: 'var(--t-text)' }}
        >
          <span
            className="font-black"
            style={{
              background: pillar.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {pillar.num} —
          </span>
          <span>{pillar.name[lang]}</span>
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--t-muted)' }}>
          {pillar.desc[lang]}
        </p>

        {/* Badge / Tag */}
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold self-start transition-colors"
          style={{
            background: `${pillar.color}14`,
            color: pillar.color,
            border: `1px solid ${pillar.color}28`,
          }}
        >
          {pillar.tag[lang]}
        </div>
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  const { lang } = useLang()

  return (
    <section id="fitur" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(26,86,219,0.06) 0%, transparent 60%)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-anim>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
            {{ id: 'Tiga Kemampuan Utama', en: 'Three Core Capabilities' }[lang]}
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, var(--t-text) 0%, #1A56DB 60%, #00B4D8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {{ id: 'Satu ROV, Tiga Misi', en: 'One ROV, Three Missions' }[lang]}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <PillarCard key={i} pillar={p} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
