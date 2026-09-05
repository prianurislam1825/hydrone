'use client'

import { useLang } from '@/lib/i18n/context'
import {
  Activity,
  ArrowRight, Cpu,
  Droplets,
  Navigation2,
  Trash2,
  Wifi,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/* ── Media carousel ─────────────────────────────────────── */
const MEDIA = [
  { type: 'video', src: '/animation.mp4'       },
  { type: 'image', src: '/hydrone-visual.jpg'  },
  { type: 'image', src: '/image1.jpg'          },
]

/* ── 4 Highlight cards ──────────────────────────────────── */
const HIGHLIGHTS = [
  {
    icon:     <Navigation2 size={16} />,
    color:    '#1A56DB',
    gradient: 'linear-gradient(135deg,#1A56DB,#0D3A9E)',
    label:    'ROV',
    desc: {
      id: 'Remotely Operated Vehicle untuk operasi di sungai.',
      en: 'Remotely Operated Vehicle for river operations.',
    },
  },
  {
    icon:     <Activity size={16} />,
    color:    '#00B4D8',
    gradient: 'linear-gradient(135deg,#00B4D8,#0891b2)',
    label:    'REAL-TIME MONITORING',
    desc: {
      id: 'Memantau kondisi air secara real-time.',
      en: 'Monitor water conditions in real time.',
    },
  },
  {
    icon:     <Trash2 size={16} />,
    color:    '#F05A22',
    gradient: 'linear-gradient(135deg,#F05A22,#c2410c)',
    label:    'PLASTIC CAPTURE',
    desc: {
      id: 'Membantu menangkap sampah plastik di sungai.',
      en: 'Helps capture plastic waste in rivers.',
    },
  },
  {
    icon:     <Droplets size={16} />,
    color:    '#22C55E',
    gradient: 'linear-gradient(135deg,#22C55E,#16a34a)',
    label:    'WATER QUALITY',
    desc: {
      id: 'Memantau pH, TDS, turbidity, dan suhu.',
      en: 'Monitors pH, TDS, turbidity, and temperature.',
    },
  },
]

/* ── Translations ────────────────────────────────────────── */
const T = {
  eyebrow: { id: 'TENTANG HYDRONE', en: 'ABOUT HYDRONE' },
  heading: { id: 'Dari Sungai,\nUntuk Sungai', en: 'From the River,\nFor the River' },
  p1: {
    id: 'Setiap tahun, jutaan ton plastik mengalir ke laut, dan sebagian besar masuk melalui sungai. Kami melihat bahwa penanganan sampah plastik tidak cukup dilakukan di hilir jika titik masuknya dapat dikurangi sejak dari sungai, dampaknya dapat dicegah lebih awal.',
    en: 'Every year, millions of tons of plastic flow into the ocean, mostly through rivers. We believe that addressing plastic waste at the source from the river itself allows us to prevent the impact before it reaches the sea.',
  },
  p2: {
    id: 'Hydrone adalah ROV (Remotely Operated Vehicle) yang dirancang untuk membantu menangkap sampah plastik di sungai sekaligus memantau kondisi air secara real-time. Dikendalikan operator dari permukaan menggunakan tether, dilengkapi kamera untuk navigasi dan pemantauan bawah air.',
    en: 'Hydrone is an ROV (Remotely Operated Vehicle) designed to help capture plastic waste in rivers while monitoring water conditions in real time. Controlled by an operator from the surface via tether, equipped with a camera for underwater navigation and monitoring.',
  },
  p3: {
    id: 'Dibangun menggunakan PETG cetak 3D dan sensor off-the-shelf, dikembangkan melalui berbagai iterasi desain tidak hanya sebagai prototipe, tetapi sebagai solusi yang dapat diterapkan di berbagai sungai dan komunitas, membuka peluang kolaborasi dengan pemerintah daerah.',
    en: 'Built using 3D-printed PETG and off-the-shelf sensors, developed through multiple design iterations not just as a prototype, but as a scalable solution deployable across rivers and communities, opening collaboration opportunities with local governments.',
  },
  caption:  { id: 'Sungai Dengkeng, Jawa Tengah.', en: 'Sungai Dengkeng, Central Java.' },

  /* Control Center block */
  ccEyebrow: { id: 'CONTROL CENTER', en: 'CONTROL CENTER' },
  ccHeading: { id: 'Dikendalikan dari Permukaan', en: 'Controlled from the Surface' },
  ccDesc: {
    id: 'Operator memantau kamera, kondisi sensor, status sistem, dan mengendalikan pergerakan Hydrone secara langsung melalui Control Center — menggunakan tether dan live camera feed dari ESP32-CAM.',
    en: 'Operators monitor the camera, sensor data, system status, and control Hydrone movement directly through the Control Center — using a tether and live camera feed from the ESP32-CAM.',
  },
  ccCta:  { id: 'Buka Control Center', en: 'Open Control Center' },
  ccSub:  { id: 'Dibutuhkan login untuk akses', en: 'Login required for access' },
}

/* ══ Component ══════════════════════════════════════════════ */
export default function AboutSection() {
  const { lang } = useLang()
  const [currentMedia, setCurrentMedia] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrentMedia(p => (p + 1) % MEDIA.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="tentang" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-surface)' }}>

      {/* ── Ambient gradients ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 65% 55% at 100%  0%, rgba(26,86,219,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 45% 40% at 0%  100%, rgba(0,180,216,0.05) 0%, transparent 50%)
        `,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ════════════ ROW 1 — split layout ════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start mb-16">

          {/* ── LEFT: text ── */}
          <div data-anim>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: '#1A56DB' }}>
                {T.eyebrow[lang]}
              </span>
              <div className="flex-1 max-w-[48px] h-0.5 rounded-full" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8)' }} />
            </div>

            {/* Heading */}
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight"
              style={{ color: 'var(--t-text)', whiteSpace: 'pre-line' }}
            >
              {T.heading[lang]}
            </h2>

            {/* Paragraphs */}
            <div className="flex flex-col gap-4 mb-8" style={{ color: 'var(--t-muted)' }}>
              <p className="text-base leading-relaxed">{T.p1[lang]}</p>
              <p className="text-base leading-relaxed">{T.p2[lang]}</p>
              <p className="text-base leading-relaxed">{T.p3[lang]}</p>
            </div>

            {/* ── 4 Highlight cards ── */}
            <div className="grid grid-cols-2 gap-3">
              {HIGHLIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl p-4 border overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = h.color + '60'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${h.color}18`
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--t-border)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  }}
                  data-anim
                  data-delay={`${i * 80 + 100}`}
                >
                  {/* Gradient top line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: h.gradient }} />

                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: h.gradient, boxShadow: `0 4px 12px ${h.color}30` }}>
                    {h.icon}
                  </div>

                  {/* Label */}
                  <div className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: h.color }}>
                    {h.label}
                  </div>

                  {/* Desc */}
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-muted)' }}>
                    {h.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: ROV visual ── */}
          <div data-anim="scale" data-delay="200">
            {/* Outer floating wrapper */}
            <div className="animate-float-up" style={{ animationDuration: '5s' }}>
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border"
                style={{
                  background:   'linear-gradient(145deg, #0D1B3E, #111827)',
                  borderColor:  'rgba(26,86,219,0.25)',
                  boxShadow:    '0 32px 80px rgba(26,86,219,0.2), 0 0 0 1px rgba(0,180,216,0.1)',
                }}
              >
                {/* Multi-color top bar */}
                <div className="h-1" style={{ background: 'linear-gradient(to right, #1A56DB, #00B4D8, #F05A22)' }} />

                {/* Scan line overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,180,216,0.6) 3px, rgba(0,180,216,0.6) 4px)' }} />

                {/* Corner HUD brackets */}
                {[['top-4 left-4','border-t border-l'],['top-4 right-4','border-t border-r'],['bottom-12 left-4','border-b border-l'],['bottom-12 right-4','border-b border-r']].map(([pos, b], j) => (
                  <div key={j} className={`absolute ${pos} w-5 h-5 pointer-events-none`}
                    style={{ borderColor: 'rgba(0,180,216,0.35)', borderStyle: 'solid',
                      borderTopWidth:    b.includes('border-t') ? 1.5 : 0,
                      borderBottomWidth: b.includes('border-b') ? 1.5 : 0,
                      borderLeftWidth:   b.includes('border-l') ? 1.5 : 0,
                      borderRightWidth:  b.includes('border-r') ? 1.5 : 0,
                    }} />
                ))}

                {/* Media */}
                <div className="relative" style={{ aspectRatio: '16/10' }}>
                  {MEDIA.map((m, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentMedia ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                      {m.type === 'video'
                        ? <video src={m.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        : <Image src={m.src} alt="Hydrone ROV" fill className="object-cover" />
                      }
                    </div>
                  ))}

                  {/* Vignette overlay — futuristic feel */}
                  <div className="absolute inset-0 pointer-events-none z-20"
                    style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(13,27,62,0.55) 100%)' }} />

                  {/* Live HUD chip */}
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(3,8,16,0.85)', border: '1px solid rgba(34,197,94,0.4)', color: '#22C55E', backdropFilter: 'blur(8px)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
                    LIVE
                  </div>

                  {/* Bottom depth HUD */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2"
                    style={{ background: 'linear-gradient(to top, rgba(3,8,16,0.85), transparent)', backdropFilter: 'blur(4px)' }}>
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(0,180,216,0.7)' }}>HYDRONE · ROV-01</span>
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(0,180,216,0.7)' }}>Sungai Dengkeng · Jawa Tengah</span>
                  </div>
                </div>

                {/* Caption bar */}
                <div className="flex items-center justify-between px-5 py-3 border-t"
                  style={{ borderColor: 'rgba(26,86,219,0.2)', background: 'rgba(17,24,39,0.8)' }}>
                  <p className="text-xs italic" style={{ color: 'rgba(139,158,199,0.7)' }}>{T.caption[lang]}</p>
                  {/* Dot nav */}
                  <div className="flex gap-1.5">
                    {MEDIA.map((_, i) => (
                      <button key={i} onClick={() => setCurrentMedia(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: i === currentMedia ? 14 : 5, height: 5,
                          background: i === currentMedia ? '#1A56DB' : 'rgba(139,158,199,0.3)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating sensor chips below visual */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {[
                { icon: <Droplets size={11} />, label: 'pH', val: '7.24', color: '#1A56DB' },
                { icon: <Activity  size={11} />, label: 'TDS', val: '186 ppm', color: '#F59E0B' },
                { icon: <Cpu      size={11} />, label: 'Turb', val: '34 NTU', color: '#F05A22' },
                { icon: <Wifi     size={11} />, label: 'Tether', val: '20m', color: '#22C55E' },
              ].map((chip, i) => (
                <div key={i} className="glass flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] animate-float-up"
                  style={{ animationDelay: `${i * 0.4}s`, animationDuration: '4s' }}>
                  <span style={{ color: chip.color }}>{chip.icon}</span>
                  <span style={{ color: 'var(--t-muted)' }}>{chip.label}</span>
                  <span className="font-bold font-mono" style={{ color: chip.color }}>{chip.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════ ROW 2 — Control Center preview ══════════ */}
        <div
          className="relative rounded-3xl overflow-hidden border"
          style={{
            background:  'linear-gradient(135deg, #0D1B3E 0%, #1A3A7A 40%, #1A56DB 70%, #00B4D8 100%)',
            borderColor: 'rgba(0,180,216,0.25)',
            boxShadow:   '0 16px 56px rgba(26,86,219,0.25)',
          }}
          data-anim
        >
          {/* Inner glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(240,90,34,0.15) 0%, transparent 55%)' }} />

          {/* Hex grid overlay */}
          <div className="absolute inset-0 hex-bg opacity-10 pointer-events-none" aria-hidden />

          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center px-8 py-10 sm:px-12">
            {/* Text block */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[live-pulse_2s_ease-in-out_infinite]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                  {T.ccEyebrow[lang]}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                {T.ccHeading[lang]}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                {T.ccDesc[lang]}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { icon: <Wifi size={11} />,  label: lang === 'id' ? 'Tether 20m' : '20m Tether' },
                  { icon: <Activity size={11} />, label: lang === 'id' ? 'Sensor Real-time' : 'Real-time Sensors' },
                  { icon: <Cpu size={11} />,  label: 'ESP32-CAM' },
                  { icon: <Navigation2 size={11} />, label: lang === 'id' ? 'Kendali Manual' : 'Manual Control' },
                ].map((p, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
                    {p.icon}{p.label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white font-bold rounded-xl text-sm transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                style={{ color: '#1A56DB' }}
              >
                {T.ccCta[lang]}
                <ArrowRight size={16} />
              </Link>
              <span className="text-[10px] text-white/50">{T.ccSub[lang]}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
