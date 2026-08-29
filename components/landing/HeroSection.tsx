'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Phone, ChevronDown, Waves, Thermometer, MapPin, Droplets } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

// Generate bubble particles
function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 16 + 6,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/5"
          style={{
            left: b.left,
            bottom: '-40px',
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

// Floating sensor card
function SensorCard({
  icon,
  label,
  value,
  status,
  statusColor,
  className,
  style,
}: {
  icon: React.ReactNode
  label: string
  value: string
  status: string
  statusColor: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`absolute glass rounded-xl px-4 py-3 min-w-[140px] animate-float-up ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#00B4D8]">{icon}</span>
        <span className="text-white/60 text-xs font-medium">{label}</span>
      </div>
      <div className="text-white font-bold text-sm">{value}</div>
      <div className={`text-xs font-medium mt-0.5 ${statusColor}`}>{status}</div>
    </div>
  )
}

export default function HeroSection() {
  const { lang } = useLang()

  const T = {
    tagline: { id: 'Autonomous Underwater Plastic Collector', en: 'Autonomous Underwater Plastic Collector' },
    sub: {
      id: 'ROV bawah air yang menangkap sampah plastik makro dan menyaring mikroplastik hingga 5 mikron dari perairan Indonesia.',
      en: 'An underwater ROV that captures macroplastic waste and filters microplastics down to 5 microns from Indonesian waters.',
    },
    cta1: { id: 'Hubungi Kami', en: 'Contact Us' },
    cta2: { id: 'Cara Kerjanya', en: 'How It Works' },
    slogan: { id: 'Dive. Collect. Protect.', en: 'Dive. Collect. Protect.' },
    turbidityLabel: { id: 'Turbidity', en: 'Turbidity' },
    turbidityStatus: { id: 'Jernih', en: 'Clear' },
    tdsLabel: { id: 'TDS', en: 'TDS' },
    tdsStatus: { id: 'Aman', en: 'Safe' },
    tempLabel: { id: 'Suhu', en: 'Temperature' },
    tempStatus: { id: 'Normal', en: 'Normal' },
    gpsLabel: { id: 'GPS', en: 'GPS' },
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1628] via-[#0D2040] to-[#1B3A6B]">
      {/* Bubble particles */}
      <Bubbles />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(0,180,216,0.08) 0%, transparent 70%)',
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto pt-24 pb-16">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 flex items-center justify-center animate-glow-pulse mx-auto">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/hydrone-logo.png"
                alt="HYDRONE"
                width={80}
                height={80}
                className="object-contain"
                onError={e => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  const parent = el.parentElement
                  if (parent) {
                    parent.innerHTML = '<span style="font-size:2rem;font-weight:900;color:#00B4D8;">H</span>'
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-4 px-3 py-1.5 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse-dot" />
          <span className="text-[#00B4D8] text-xs font-semibold tracking-wider uppercase">IID INNOPA 2025</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
          {T.tagline[lang]}
        </h1>

        {/* Sub */}
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mb-10 leading-relaxed">
          {T.sub[lang]}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a
            href="https://wa.me/6281227917676"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4A017] hover:bg-[#D4A017]/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#D4A017]/30 min-h-[52px] text-base"
          >
            <Phone size={18} />
            {T.cta1[lang]}
          </a>
          <a
            href="#cara-kerja"
            className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 hover:border-white/60 text-white font-bold rounded-xl transition-all min-h-[52px] text-base hover:bg-white/5"
          >
            <ChevronDown size={18} />
            {T.cta2[lang]}
          </a>
        </div>

        {/* Slogan */}
        <p className="text-[#00B4D8] font-mono text-lg tracking-widest uppercase opacity-80">
          {T.slogan[lang]}
        </p>
      </div>

      {/* Floating sensor cards */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <SensorCard
          icon={<Droplets size={14} />}
          label={T.turbidityLabel[lang]}
          value="12 NTU"
          status={T.turbidityStatus[lang]}
          statusColor="text-[#43A047]"
          className="top-[28%] left-[8%]"
          style={{ animationDelay: '0s' } as React.CSSProperties}
        />
        <SensorCard
          icon={<Waves size={14} />}
          label={T.tdsLabel[lang]}
          value="180 ppm"
          status={T.tdsStatus[lang]}
          statusColor="text-[#43A047]"
          className="top-[38%] right-[7%]"
          style={{ animationDelay: '1s' } as React.CSSProperties}
        />
        <SensorCard
          icon={<Thermometer size={14} />}
          label={T.tempLabel[lang]}
          value="28.4°C"
          status={T.tempStatus[lang]}
          statusColor="text-[#D4A017]"
          className="bottom-[28%] left-[9%]"
          style={{ animationDelay: '2s' } as React.CSSProperties}
        />
        <SensorCard
          icon={<MapPin size={14} />}
          label={T.gpsLabel[lang]}
          value="-7.5561"
          status="110.8316"
          statusColor="text-[#00B4D8]"
          className="bottom-[36%] right-[8%]"
          style={{ animationDelay: '0.5s' } as React.CSSProperties}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <ChevronDown size={20} className="animate-bounce" />
      </div>
    </section>
  )
}
