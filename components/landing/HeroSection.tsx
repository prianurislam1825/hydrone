'use client'

import { useLang } from '@/lib/i18n/context'
import { Activity, ArrowRight, Droplets, Thermometer, Wifi } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

/* ── Bubbles — ALL BLUE ── */
function Bubbles() {
  const bubbles = useMemo(
    () => Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left:     `${Math.random() * 100}%`,
      size:     Math.random() * 18 + 5,
      duration: Math.random() * 14 + 8,
      delay:    Math.random() * 10,
      opacity:  Math.random() * 0.35 + 0.08,
      color:    i % 2 === 0 ? '#1A56DB' : '#00B4D8',
    })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {bubbles.map(b => (
        <div key={b.id} className="absolute rounded-full" style={{
          left: b.left, bottom: '-50px', width: b.size, height: b.size, opacity: b.opacity,
          background: `radial-gradient(circle at 35% 35%, ${b.color}55, ${b.color}11)`,
          border: `1px solid ${b.color}44`,
          animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
        }} />
      ))}
    </div>
  )
}

/* ── Floating sensor card ── */
function SensorCard({ icon, label, value, unit, status, color, delay = '0s', pos }: {
  icon: React.ReactNode; label: string; value: string; unit: string
  status: string; color: string; delay?: string
  pos: { top?: string; bottom?: string; left?: string; right?: string }
}) {
  return (
    <div className="absolute glass rounded-2xl px-3 py-2.5 z-20 animate-float-up shadow-xl"
      style={{ ...pos, animationDelay: delay, backdropFilter: 'blur(16px)',
        border: `1px solid ${color}30`, minWidth: 100,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))' }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span style={{ color }}>{icon}</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-base font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>{value}</span>
        <span className="text-[9px]" style={{ color: 'var(--t-muted)' }}>{unit}</span>
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[9px]" style={{ color }}>{status}</span>
      </div>
    </div>
  )
}

function RovVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square" style={{ overflow: 'visible' }}>
      <div className="absolute inset-0 rounded-full opacity-20 animate-[orange-glow_3s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle, #1A56DB44 0%, transparent 70%)' }} />
      <div className="absolute inset-8 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg, var(--t-surface), var(--t-surface-2))', border: '1px solid var(--t-border)',
          transform: 'perspective(800px) rotateY(-8deg) rotateX(4deg)' }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #1A56DB)' }} />
        <div className="relative w-3/4 h-3/4 p-4">
          <Image src="/blue-logo-hydrone.png" alt="Hydrone ROV" fill className="object-contain drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
          ACTIVE
        </div>
      </div>
      <SensorCard icon={<Droplets size={11} />}    label="pH"     value="7.24" unit="pH"  status="Normal" color="#1A56DB" delay="0s"   pos={{ top: '0px', right: '0px' }} />
      <SensorCard icon={<Thermometer size={11} />} label="Temp"   value="26.4" unit="°C"  status="Normal" color="#22C55E" delay="0.8s" pos={{ top: '38%', right: '4px' }} />
      <SensorCard icon={<Activity size={11} />}    label="Turb"   value="34"   unit="NTU" status="Clear"  color="#1A56DB" delay="1.6s" pos={{ bottom: '0px', left: '4px' }} />
      <SensorCard icon={<Wifi size={11} />}        label="Tether" value="20"   unit="m"   status="Online" color="#00B4D8" delay="2.4s" pos={{ top: '18%', left: '4px' }} />
    </div>
  )
}

export default function HeroSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'RIVER ROV · IID INNOPA 2026', en: 'RIVER ROV · IID INNOPA 2026' },
    tag:     { id: 'AI Powered', en: 'AI Powered' },
    h1a:     { id: 'Cleaning Rivers,', en: 'Cleaning Rivers,' },
    h1b:     { id: 'Reading Water.', en: 'Reading Water.' },
    h1c:     { id: 'Built by Students.', en: 'Built by Students.' },
    sub: {
      id: 'ROV bawah air untuk koleksi makroplastik dan penyaringan mikroplastik hingga 0.1 mikron, memantau kualitas air secara real-time — dibangun oleh lima pelajar SMA.',
      en: 'Underwater ROV for macroplastic collection and microplastic filtration down to 0.1 microns, streaming real-time water quality data — built by five high school students.',
    },
    cta1: { id: 'Lihat Dashboard', en: 'View Dashboard' },
    cta2: { id: 'Pelajari Lebih',  en: 'Learn More' },
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 80% 60% at 10% 20%, rgba(26,86,219,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 0%,  rgba(0,180,216,0.06) 0%, transparent 50%)
        `,
      }} />
      <div className="absolute inset-0 hex-bg opacity-40 pointer-events-none" aria-hidden />
      <Bubbles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 pt-36">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-12 items-center">

          {/* Left */}
          <div data-anim className="min-w-0" style={{ overflow: 'visible', paddingRight: '8px' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.15), rgba(0,180,216,0.1))',
                border: '1px solid rgba(26,86,219,0.25)', color: '#1A56DB' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-[live-pulse_2s_ease-in-out_infinite]" />
              {T.tag[lang]}
            </div>

            <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
              {T.eyebrow[lang]}
            </div>

            {/* H1 — clamp font size so it never overflows on mobile */}
            <h1 className="font-extrabold leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.75rem, 5.5vw, 3.4rem)', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              <span className="block" style={{ color: 'var(--t-text)' }}>{T.h1a[lang]}</span>
              <span className="block" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #1A56DB 0%, #00B4D8 60%, #1A56DB 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                paddingRight: '4px', paddingBottom: '4px',
              }}>{T.h1b[lang]}</span>
              <span className="block" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #F05A22 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                paddingRight: '4px', paddingBottom: '4px',
              }}>{T.h1c[lang]}</span>
            </h1>

            <p className="text-sm sm:text-base max-w-lg leading-relaxed mb-10" style={{ color: 'var(--t-muted)' }}>
              {T.sub[lang]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all shadow-lg min-h-[50px] text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)', boxShadow: '0 4px 20px rgba(26,86,219,0.35)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}>
                {T.cta1[lang]} <ArrowRight size={16} />
              </a>
              <a href="#tentang"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all min-h-[50px] text-sm hover:bg-[#1A56DB]/5"
                style={{ border: '1px solid var(--t-border)', color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}>
                {T.cta2[lang]}
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center justify-center overflow-hidden" data-anim="scale" data-delay="200">
            <RovVisual />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" aria-hidden
        style={{ background: 'linear-gradient(to bottom, transparent, var(--t-bg))' }} />
    </section>
  )
}
