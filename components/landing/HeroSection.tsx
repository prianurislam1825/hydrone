'use client'

import { useLang } from '@/lib/i18n/context'
import { Activity, ArrowRight, Droplets, Thermometer, Wifi } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

/* ── Animated bubbles ───────────────────────────────────────────── */
function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 20 + 5,
        duration: Math.random() * 14 + 8,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.45 + 0.1,
        color: i % 3 === 0 ? '#1A56DB' : i % 3 === 1 ? '#00B4D8' : '#F05A22',
      })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: b.left,
            bottom: '-50px',
            width:  b.size,
            height: b.size,
            opacity: b.opacity,
            background: `radial-gradient(circle at 35% 35%, ${b.color}55, ${b.color}11)`,
            border: `1px solid ${b.color}44`,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Floating 3D sensor card ────────────────────────────────────── */
function SensorCard({
  icon, label, value, unit, status, color, delay = '0s',
  position,
}: {
  icon: React.ReactNode; label: string; value: string; unit: string
  status: string; color: string; delay?: string; position: string
}) {
  return (
    <div
      className="absolute glass rounded-2xl px-3.5 py-3 z-20 animate-float-up shadow-xl"
      style={{
        ...Object.fromEntries(
          position.split(' ').map(p => {
            const [k, v] = p.split(':')
            return [k, v]
          }),
        ),
        animationDelay: delay,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${color}30`,
        background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))`,
        minWidth: 110,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-lg font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>{value}</span>
        <span className="text-[10px]" style={{ color: 'var(--t-muted)' }}>{unit}</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
        <span className="text-[10px]" style={{ color }}>{status}</span>
      </div>
    </div>
  )
}

/* ── ROV 3D visual ──────────────────────────────────────────────── */
function RovVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full opacity-20 animate-[orange-glow_3s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle, #1A56DB44 0%, transparent 70%)' }} />
      <div className="absolute inset-4 rounded-full opacity-10 animate-[orange-glow_3s_ease-in-out_infinite_1.5s]"
        style={{ background: 'radial-gradient(circle, #F05A2244 0%, transparent 70%)' }} />

      {/* Main card */}
      <div
        className="absolute inset-8 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, var(--t-surface), var(--t-surface-2))',
          border: '1px solid var(--t-border)',
          transform: 'perspective(800px) rotateY(-8deg) rotateX(4deg)',
        }}
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #F05A22)' }} />

        <div className="relative w-3/4 h-3/4 p-4">
          <Image src="/blue-logo-hydrone.png" alt="Hydrone ROV" fill className="object-contain drop-shadow-2xl" />
        </div>

        {/* Live badge */}
        <div className="absolute bottom-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
          AKTIF
        </div>
      </div>

      {/* Floating sensor cards */}
      <SensorCard icon={<Droplets size={12} />}    label="pH"       value="7.24" unit="pH"  status="Normal"  color="#1A56DB" delay="0s"   position="top:-12px right:-12px" />
      <SensorCard icon={<Thermometer size={12} />} label="Temp"     value="26.4" unit="°C"  status="Normal"  color="#22C55E" delay="0.8s" position="top:40% right:-20px" />
      <SensorCard icon={<Activity size={12} />}    label="Turb"     value="34"   unit="NTU" status="Clear"   color="#F59E0B" delay="1.6s" position="bottom:-12px left:-8px" />
      <SensorCard icon={<Wifi size={12} />}        label="Tether"   value="20"   unit="m"   status="Online"  color="#F05A22" delay="2.4s" position="top:20% left:-20px" />
    </div>
  )
}

/* ── Main section ───────────────────────────────────────────────── */
export default function HeroSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'RIVER ROV · IID INNOPA 2026', en: 'RIVER ROV · IID INNOPA 2026' },
    tag:     { id: 'AI Powered', en: 'AI Powered' },
    h1a:     { id: 'Cleaning Rivers,', en: 'Cleaning Rivers,' },
    h1b:     { id: 'Reading Water.', en: 'Reading Water.' },
    h1c:     { id: 'Built by Students.', en: 'Built by Students.' },
    sub: {
      id: 'ROV bawah air otomatis untuk koleksi sampah makroplastik dan penyaringan mikroplastik hingga 0.1 mikron, sekaligus memantau kualitas air secara real-time — dibangun oleh lima pelajar SMA dari Hydrone.',
      en: 'Autonomous underwater ROV for macroplastic collection and microplastic filtration down to 0.1 microns, simultaneously streaming real-time water quality data — built by five high school students from Hydrone.',
    },
    cta1: { id: 'Lihat Dashboard', en: 'View Dashboard' },
    cta2: { id: 'Pelajari Lebih',  en: 'Learn More' },
  }

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--t-bg)' }}
    >
      {/* Multi-stop non-monotone background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(26,86,219,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(240,90,34,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 0%,  rgba(0,180,216,0.07) 0%, transparent 50%)
          `,
        }}
      />

      {/* Hex grid */}
      <div className="absolute inset-0 hex-bg opacity-40 pointer-events-none" aria-hidden />

      <Bubbles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 pt-36">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-16 items-center">

          {/* ── Left ── */}
          <div data-anim>
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.15), rgba(0,180,216,0.1))', border: '1px solid rgba(26,86,219,0.25)', color: '#1A56DB' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-[live-pulse_2s_ease-in-out_infinite]" />
              {T.tag[lang]}
            </div>

            <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
              {T.eyebrow[lang]}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.06] tracking-tight mb-6">
              <span className="block" style={{ color: 'var(--t-text)' }}>{T.h1a[lang]}</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #1A56DB 0%, #00B4D8 50%, #1A56DB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {T.h1b[lang]}
              </span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #F05A22 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {T.h1c[lang]}
              </span>
            </h1>

            <p className="text-base sm:text-lg max-w-lg leading-relaxed mb-10" style={{ color: 'var(--t-muted)' }}>
              {T.sub[lang]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all shadow-lg min-h-[52px] text-sm"
                style={{
                  background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(26,86,219,0.35)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(26,86,219,0.55)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(26,86,219,0.35)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
              >
                {T.cta1[lang]} <ArrowRight size={16} />
              </a>
              <a
                href="#tentang"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all min-h-[52px] text-sm hover:bg-[#1A56DB]/5"
                style={{ border: '1px solid var(--t-border)', color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}
              >
                {T.cta2[lang]}
              </a>
            </div>
          </div>

          {/* ── Right: 3D ROV visual ── */}
          <div className="hidden lg:flex items-center justify-center" data-anim="scale" data-delay="200">
            <RovVisual />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" aria-hidden
        style={{ background: 'linear-gradient(to bottom, transparent, var(--t-bg))' }} />
    </section>
  )
}
