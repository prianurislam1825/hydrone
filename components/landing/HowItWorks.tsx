'use client'

import { useLang } from '@/lib/i18n/context'
import type { Lang } from '@/types'
import { BarChart3, CheckCircle2, Filter, Navigation2, Power, Waves } from 'lucide-react'
import { useState } from 'react'

interface StepItem {
  num: string
  color: string
  icon: React.ReactNode
  gradient: string
  glow: string
  title: { id: string; en: string }
  desc: { id: string; en: string }
  badge: { id: string; en: string }
}

const STEPS: StepItem[] = [
  {
    num: '01',
    color: '#1A56DB',
    icon: <Power size={20} />,
    gradient: 'linear-gradient(135deg, #1A56DB, #0D3A9E)',
    glow: 'rgba(26,86,219,0.25)',
    title: { id: 'Inisialisasi Sistem', en: 'System Initialization' },
    desc: {
      id: 'ESP32 + Arduino Mega mengaktifkan semua komponen: sensor suite (pH, TDS, turbidity, suhu), thruster ESC, relay module, dan koneksi tether 20m ke operator di permukaan.',
      en: 'ESP32 + Arduino Mega activates all components: sensor suite (pH, TDS, turbidity, temp), thruster ESCs, relay module, and 20m tether connection to the surface operator.',
    },
    badge: { id: 'Startup', en: 'Startup' },
  },
  {
    num: '02',
    color: '#00B4D8',
    icon: <Waves size={20} />,
    gradient: 'linear-gradient(135deg, #00B4D8, #1A56DB)',
    glow: 'rgba(0,180,216,0.25)',
    title: { id: 'Deploy & Kedalaman', en: 'Deploy & Depth Control' },
    desc: {
      id: 'ROV diturunkan ke sungai. Sistem balast aktif — pompa air + kompresor + solenoid valve — mengatur kedalaman secara presisi. Vertical thruster 2× mempertahankan posisi di kolom air.',
      en: 'ROV is lowered into the river. Active ballast system — water pump + compressor + solenoid valve — controls depth precisely. 2× vertical thrusters maintain position in the water column.',
    },
    badge: { id: '0–10 m', en: '0–10 m' },
  },
  {
    num: '03',
    color: '#22C55E',
    icon: <Navigation2 size={20} />,
    gradient: 'linear-gradient(135deg, #22C55E, #00B4D8)',
    glow: 'rgba(34,197,94,0.25)',
    title: { id: 'Navigasi & Koleksi Sampah', en: 'Navigate & Collect Debris' },
    desc: {
      id: 'Operator mengarahkan Hydrone via tether. 4 thruster (2 horizontal differential + 2 vertikal 75°) menggerakkan ROV ke area tercemar. Jaring pasif terbuka otomatis saat ROV maju — menangkap makroplastik tanpa motor tambahan.',
      en: 'Operator steers Hydrone via tether. 4 thrusters (2 horizontal differential + 2 vertical 75°) navigate to polluted areas. Passive net opens automatically as ROV advances — capturing macroplastic without extra motors.',
    },
    badge: { id: '4 Thruster', en: '4 Thrusters' },
  },
  {
    num: '04',
    color: '#F05A22',
    icon: <Filter size={20} />,
    gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    glow: 'rgba(240,90,34,0.25)',
    title: { id: 'Filtrasi Mikroplastik', en: 'Microplastic Filtration' },
    desc: {
      id: 'Bilge pump DC mengisap air melalui 2 tahap filter: Stage 1 pre-filter 20–50 µm (sedimen/lumpur) dan Stage 2 final filter 0.1 µm (mikroplastik). Partikel tertampung di kontainer transparan yang bisa dilepas.',
      en: 'DC bilge pump draws water through 2 filter stages: Stage 1 pre-filter 20–50 µm (sediment/silt) and Stage 2 final filter 0.1 µm (microplastic). Particles collected in a removable transparent container.',
    },
    badge: { id: '0.1 µm', en: '0.1 µm' },
  },
  {
    num: '05',
    color: '#8B5CF6',
    icon: <BarChart3 size={20} />,
    gradient: 'linear-gradient(135deg, #8B5CF6, #1A56DB)',
    glow: 'rgba(139,92,246,0.25)',
    title: { id: 'Monitor & Kirim Data', en: 'Monitor & Transmit Data' },
    desc: {
      id: 'Sensor merekam data setiap 2.5 detik. ESP32 mengirim ke Firebase Realtime Database via tether. Dashboard web menampilkan pH, TDS, turbidity, suhu, dan kedalaman secara live — lengkap dengan sparkline dan status alert.',
      en: 'Sensors record data every 2.5 seconds. ESP32 transmits to Firebase Realtime Database via tether. The web dashboard displays pH, TDS, turbidity, temperature, and depth live — with sparklines and status alerts.',
    },
    badge: { id: 'Real-time', en: 'Real-time' },
  },
  {
    num: '06',
    color: '#16A34A',
    icon: <CheckCircle2 size={20} />,
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    glow: 'rgba(34,197,94,0.25)',
    title: { id: 'Operasi Selesai', en: 'Operation Complete' },
    desc: {
      id: 'Operator menutup jaring via servo latch dari dashboard. ROV naik ke permukaan menggunakan ballast + vertical thruster. Semua data operasi tersimpan di history dan dapat diexport ke Excel (CSV) untuk analisis lebih lanjut.',
      en: 'Operator closes the net via servo latch from the dashboard. ROV ascends using ballast + vertical thrusters. All operation data is saved to history and can be exported to Excel (CSV) for further analysis.',
    },
    badge: { id: 'Selesai', en: 'Complete' },
  },
]

/* ── Individual Step Card ────────────────────────────────────── */
function StepCard({ step, lang, index }: { step: StepItem; lang: Lang; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 cursor-default"
      style={{
        background: 'var(--t-surface)',
        borderColor: hovered ? `${step.color}55` : 'var(--t-border)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 14px 32px ${step.glow}` : '0 2px 8px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-anim
      data-delay={`${Math.min(index * 100, 400)}`}
    >
      {/* Top accent gradient bar — neatly curves with rounded-2xl */}
      <div className="h-1 w-full shrink-0" style={{ background: step.gradient }} />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Number & badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{
              background: step.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'var(--font-plus-jakarta)',
            }}
          >
            {step.num}
          </span>
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full tracking-wide shrink-0 transition-colors"
            style={{
              background: `${step.color}14`,
              color: step.color,
              border: `1px solid ${step.color}28`,
            }}
          >
            {step.badge[lang]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base sm:text-lg mb-2 tracking-tight leading-snug" style={{ color: 'var(--t-text)' }}>
          {step.title[lang]}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--t-muted)' }}>
          {step.desc[lang]}
        </p>
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const { lang } = useLang()

  return (
    <section id="cara-kerja" className="py-24 relative overflow-hidden" style={{ background: 'var(--t-bg)' }}>
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: `
          radial-gradient(ellipse 55% 50% at 0%   40%, rgba(26,86,219,0.07)  0%, transparent 55%),
          radial-gradient(ellipse 45% 40% at 100% 60%, rgba(240,90,34,0.05)  0%, transparent 55%)
        `,
      }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16" data-anim>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--t-muted)' }}>
            {{ id: 'Cara Kerja', en: 'How It Works' }[lang]}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: 'var(--t-text)' }}>
            {lang === 'id' ? 'Bagaimana ' : 'How '}
            <span style={{
              background: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Hydrone</span>
            {lang === 'id' ? ' Beroperasi?' : ' Operates?'}
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id'
              ? 'Dari deploy ke sungai hingga data tersimpan — enam tahap operasi Hydrone.'
              : 'From river deployment to data storage — six stages of Hydrone operation.'}
          </p>
        </div>

        {/* ── Vertical timeline ── */}
        <div className="relative">
          {/* Central connector line */}
          <div
            className="absolute left-5 sm:left-1/2 sm:-translate-x-px top-3 bottom-3 w-0.5"
            style={{ background: 'linear-gradient(to bottom, #1A56DB55, #00B4D888, #22C55E55, #F05A2255, #8B5CF655, transparent)' }}
            aria-hidden
          />

          <div className="space-y-6 sm:space-y-0">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`relative flex items-start sm:items-center ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  } pl-14 sm:pl-0 sm:mb-12`}
                >
                  {/* ── Icon node on the line ── */}
                  <div
                    className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-3 sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white z-10 shrink-0 shadow-md"
                    style={{
                      background: step.gradient,
                      boxShadow: `0 0 0 3px var(--t-bg), 0 0 0 5px ${step.color}25, 0 6px 18px ${step.color}35`,
                    }}
                  >
                    <span className="sm:hidden scale-90">{step.icon}</span>
                    <span className="hidden sm:inline">{step.icon}</span>
                  </div>

                  {/* ── Content card ── */}
                  <div className="w-full sm:w-[calc(50%-2.5rem)]">
                    <StepCard step={step} lang={lang} index={i} />
                  </div>

                  {/* Empty spacer for alternating side on desktop */}
                  <div className="hidden sm:block w-[calc(50%-2.5rem)] shrink-0" />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Result banner ── */}
        <div
          className="mt-8 rounded-2xl p-5 sm:p-6 flex items-center justify-center gap-3 sm:gap-4 text-white shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1A56DB 0%, #00B4D8 50%, #0D3A9E 100%)' }}
          data-anim
        >
          <CheckCircle2 size={22} className="shrink-0" />
          <span className="font-bold text-base sm:text-lg text-center">
            {lang === 'id'
              ? 'Hasilnya: Air Lebih Bersih dan Data Pencemaran Terverifikasi'
              : 'Result: Cleaner Water and Verified Pollution Data'}
          </span>
        </div>
      </div>
    </section>
  )
}
