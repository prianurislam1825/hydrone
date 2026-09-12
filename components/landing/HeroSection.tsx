'use client'

import { useLang } from '@/lib/i18n/context'
import { Activity, ArrowRight, ChevronLeft, ChevronRight, Droplets, Thermometer, Wifi } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

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
    <div className="absolute glass rounded-2xl px-3 py-2 z-30 animate-float-up shadow-xl hidden sm:flex flex-col"
      style={{ ...pos, animationDelay: delay, backdropFilter: 'blur(16px)',
        border: `1px solid ${color}35`, minWidth: 96,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))' }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span style={{ color }}>{icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--t-muted)' }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-base font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>{value}</span>
        <span className="text-[9px]" style={{ color: 'var(--t-muted)' }}>{unit}</span>
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[9px] font-semibold" style={{ color }}>{status}</span>
      </div>
    </div>
  )
}

/* ── Wide Landscape Slideshow (Gambar Produk & Sungai) ── */
const SLIDES = [
  {
    id: 1,
    src: '/blue-logo-hydrone.png',
    title: { id: 'Desain 3D Model HYDRONE ROV', en: 'HYDRONE ROV 3D Model Design' },
    subtitle: { id: 'Visualisasi unit ROV bawah air', en: 'Underwater ROV unit visualization' },
    tag: { id: 'Gambar Produk', en: 'Product Image' },
  },
  {
    id: 2,
    src: '/hydrone-visual.jpg',
    title: { id: 'Pengujian Lapangan di Sungai', en: 'River Field Testing' },
    subtitle: { id: 'Uji kendali dan pembersihan perairan', en: 'Water cleaning & thruster test' },
    tag: { id: 'Foto Sungai', en: 'River Operation' },
  },
  {
    id: 3,
    src: '/image1.jpg',
    title: { id: 'Pengumpulan Sampah Plastik', en: 'Plastic Waste Collection' },
    subtitle: { id: 'Jaring penangkap mikro & makroplastik', en: 'Macro & microplastic capture net' },
    tag: { id: 'Dokumentasi Misi', en: 'Mission Documentation' },
  },
  {
    id: 4,
    src: '/pfp-hydrone.png',
    title: { id: 'Modul Sensor & Kontroler', en: 'Sensor & Controller Module' },
    subtitle: { id: 'Telemetri real-time pH, Suhu, Turbidity', en: 'Real-time pH, Temp, Turbidity telemetry' },
    tag: { id: 'Prototip Sistem', en: 'System Prototype' },
  },
]

function RovSlideshow() {
  const { lang } = useLang()
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused])

  const prevSlide = () => setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  const nextSlide = () => setCurrent(prev => (prev + 1) % SLIDES.length)

  const activeSlide = SLIDES[current]

  return (
    <div
      className="relative w-full max-w-xl mx-auto"
      style={{ overflow: 'visible' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Glow background */}
      <div className="absolute inset-0 rounded-3xl opacity-30 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #1A56DB 0%, #00B4D8 50%, transparent 80%)' }} />

      {/* Main Wide Landscape Card Container */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden flex flex-col justify-between"
        style={{
          background: 'linear-gradient(145deg, var(--t-surface), var(--t-surface-2))',
          borderColor: 'rgba(26,86,219,0.3)',
        }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 z-20" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #F05A22, #1A56DB)' }} />

        {/* Slide Image Showcase */}
        <div className="relative w-full h-full">
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <div className="relative w-full h-full p-6 sm:p-8 flex items-center justify-center bg-gradient-to-b from-black/20 via-transparent to-black/60">
                <Image
                  src={slide.src}
                  alt={slide.title[lang]}
                  fill
                  className="object-contain p-4 drop-shadow-2xl"
                  onError={e => {
                    const target = e.target as HTMLElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overlay Badges & Controls */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #00B4D8)' }}>
            {activeSlide.tag[lang]}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
            {current + 1} / {SLIDES.length}
          </span>
        </div>

        {/* Caption Info (Bottom left overlay) */}
        <div className="absolute bottom-3 left-3 right-16 sm:bottom-4 sm:left-4 sm:right-20 z-20 p-2.5 sm:p-3 rounded-xl backdrop-blur-md border border-white/10"
          style={{ background: 'rgba(10,22,40,0.75)', color: '#fff' }}>
          <div className="font-extrabold text-xs sm:text-sm truncate leading-tight text-white">
            {activeSlide.title[lang]}
          </div>
          <div className="text-[10px] sm:text-xs truncate text-cyan-300/90 mt-0.5">
            {activeSlide.subtitle[lang]}
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 active:scale-95 shadow-lg"
          style={{ background: 'rgba(10,22,40,0.6)' }}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 active:scale-95 shadow-lg"
          style={{ background: 'rgba(10,22,40,0.6)' }}
          aria-label="Next Slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot Indicators (Bottom Center) */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === current ? 'w-5 bg-[#00B4D8]' : 'w-1.5 bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Sensor Telemetry Badges (Surrounding the Wide Slideshow) */}
      <SensorCard icon={<Droplets size={11} />}    label="pH"     value="7.24" unit="pH"  status="Normal" color="#1A56DB" delay="0s"   pos={{ top: '-14px', right: '-12px' }} />
      <SensorCard icon={<Thermometer size={11} />} label={{ id: 'Suhu', en: 'Temp' }[lang]}   value="26.4" unit="°C"  status="Normal" color="#22C55E" delay="0.8s" pos={{ bottom: '24px', right: '-16px' }} />
      <SensorCard icon={<Activity size={11} />}    label={{ id: 'Kekeruhan', en: 'Turb' }[lang]}   value="34"   unit="NTU" status={{ id: 'Jernih', en: 'Clear' }[lang]}  color="#1A56DB" delay="1.6s" pos={{ bottom: '-14px', left: '16px' }} />
      <SensorCard icon={<Wifi size={11} />}        label="Tether" value="20"   unit="m"   status={{ id: 'Terhubung', en: 'Online' }[lang]} color="#00B4D8" delay="2.4s" pos={{ top: '-14px', left: '-12px' }} />
    </div>
  )
}

export default function HeroSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'RIVER ROV · IID INNOPA 2026', en: 'RIVER ROV · IID INNOPA 2026' },
    tag:     { id: 'Bertenaga AI & IoT', en: 'AI & IoT Powered' },
    h1a:     { id: 'Membersihkan Sungai,', en: 'Cleaning Rivers,' },
    h1b:     { id: 'Membaca Air.', en: 'Reading Water.' },
    sub: {
      id: 'Hydrone adalah ROV bawah air yang mengumpulkan sampah plastik sungai dan mengirim data kualitas air secara real-time, dibangun dari nol oleh tim pelajar SMA.',
      en: 'Hydrone is an underwater ROV that collects river plastic waste and transmits water quality data in real-time, built from scratch by a high school student team.',
    },
    cta1: { id: 'Lihat Dashboard', en: 'View Dashboard' },
    cta2: { id: 'Pelajari Lebih',  en: 'Learn More' },
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 80% 60% at 10% 20%, rgba(26,86,219,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 0%,  rgba(0,180,216,0.08) 0%, transparent 50%)
        `,
      }} />
      <div className="absolute inset-0 hex-bg opacity-40 pointer-events-none" aria-hidden />
      <Bubbles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 pt-36">
        <div className="grid lg:grid-cols-[50fr_50fr] gap-10 lg:gap-14 items-center">

          {/* Left Column (Diperbesar & Bolder) */}
          <div data-anim className="min-w-0" style={{ overflow: 'visible', paddingRight: '4px' }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-5 shadow-sm"
              style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.18), rgba(0,180,216,0.12))',
                border: '1px solid rgba(26,86,219,0.3)', color: '#1A56DB' }}>
              <span className="w-2 h-2 rounded-full bg-[#1A56DB] animate-[live-pulse_2s_ease-in-out_infinite]" />
              {T.tag[lang]}
            </div>

            <div className="text-xs font-black tracking-[0.22em] uppercase mb-3 text-[#00B4D8]" style={{ textShadow: '0 0 12px rgba(0,180,216,0.2)' }}>
              {T.eyebrow[lang]}
            </div>

            {/* H1 — Font size diperbesar (Lebih mencolok & gagah) */}
            <h1 className="font-black leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.1rem, 6.2vw, 3.8rem)', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              <span className="block" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #1A56DB 0%, #00B4D8 60%, #1A56DB 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                paddingRight: '4px', paddingBottom: '4px',
              }}>{T.h1a[lang]}</span>
              <span className="block" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #F05A22 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                paddingRight: '4px', paddingBottom: '4px',
              }}>{T.h1b[lang]}</span>
            </h1>

            <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-10 font-medium" style={{ color: 'var(--t-muted)' }}>
              {T.sub[lang]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/login"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 font-bold rounded-2xl transition-all shadow-xl min-h-[54px] text-base text-white"
                style={{ background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)', boxShadow: '0 6px 24px rgba(26,86,219,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}>
                {T.cta1[lang]} <ArrowRight size={18} />
              </a>
              <a href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 font-bold rounded-2xl transition-all min-h-[54px] text-base hover:bg-[#1A56DB]/5"
                style={{ border: '1px solid var(--t-border)', color: 'var(--t-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-muted)')}>
                {T.cta2[lang]}
              </a>
            </div>
          </div>

          {/* Right Column (Slideshow Gambar Menyamping) */}
          <div className="w-full flex items-center justify-center overflow-visible" data-anim="scale" data-delay="200">
            <RovSlideshow />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" aria-hidden
        style={{ background: 'linear-gradient(to bottom, transparent, var(--t-bg))' }} />
    </section>
  )
}
