'use client'

import { useLang } from '@/lib/i18n/context'
import { BarChart3, CheckCircle2, Filter, Navigation2, Power, Waves } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: <Power size={20} />,
    gradient: 'linear-gradient(135deg, #1A56DB, #0D3A9E)',
    glow:     'rgba(26,86,219,0.35)',
    title:    { id: 'Inisialisasi Sistem', en: 'System Initialization' },
    desc:     {
      id: 'ESP32 + Arduino Mega mengaktifkan semua komponen: sensor suite (pH, TDS, turbidity, suhu), thruster ESC, relay module, dan koneksi tether 20m ke operator di permukaan.',
      en: 'ESP32 + Arduino Mega activates all components: sensor suite (pH, TDS, turbidity, temp), thruster ESCs, relay module, and 20m tether connection to the surface operator.',
    },
    badge: { id: 'Startup', en: 'Startup' },
  },
  {
    num: '02',
    icon: <Waves size={20} />,
    gradient: 'linear-gradient(135deg, #00B4D8, #1A56DB)',
    glow:     'rgba(0,180,216,0.3)',
    title:    { id: 'Deploy & Kedalaman', en: 'Deploy & Depth Control' },
    desc:     {
      id: 'ROV diturunkan ke sungai. Sistem balast aktif — pompa air + kompresor + solenoid valve — mengatur kedalaman secara presisi. Vertical thruster 2× mempertahankan posisi di kolom air.',
      en: 'ROV is lowered into the river. Active ballast system — water pump + compressor + solenoid valve — controls depth precisely. 2× vertical thrusters maintain position in the water column.',
    },
    badge: { id: '0–10 m', en: '0–10 m' },
  },
  {
    num: '03',
    icon: <Navigation2 size={20} />,
    gradient: 'linear-gradient(135deg, #22C55E, #00B4D8)',
    glow:     'rgba(34,197,94,0.3)',
    title:    { id: 'Navigasi & Koleksi Sampah', en: 'Navigate & Collect Debris' },
    desc:     {
      id: 'Operator mengarahkan Hydrone via tether. 4 thruster (2 horizontal differential + 2 vertikal 75°) menggerakkan ROV ke area tercemar. Jaring pasif terbuka otomatis saat ROV maju — menangkap makroplastik tanpa motor tambahan.',
      en: 'Operator steers Hydrone via tether. 4 thrusters (2 horizontal differential + 2 vertical 75°) navigate to polluted areas. Passive net opens automatically as ROV advances — capturing macroplastic without extra motors.',
    },
    badge: { id: '4 Thruster', en: '4 Thrusters' },
  },
  {
    num: '04',
    icon: <Filter size={20} />,
    gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)',
    glow:     'rgba(240,90,34,0.3)',
    title:    { id: 'Filtrasi Mikroplastik', en: 'Microplastic Filtration' },
    desc:     {
      id: 'Bilge pump DC mengisap air melalui 2 tahap filter: Stage 1 pre-filter 20–50 µm (sedimen/lumpur) dan Stage 2 final filter 0.1 µm (mikroplastik). Partikel tertampung di kontainer transparan yang bisa dilepas.',
      en: 'DC bilge pump draws water through 2 filter stages: Stage 1 pre-filter 20–50 µm (sediment/silt) and Stage 2 final filter 0.1 µm (microplastic). Particles collected in a removable transparent container.',
    },
    badge: { id: '0.1 µm', en: '0.1 µm' },
  },
  {
    num: '05',
    icon: <BarChart3 size={20} />,
    gradient: 'linear-gradient(135deg, #8B5CF6, #1A56DB)',
    glow:     'rgba(139,92,246,0.3)',
    title:    { id: 'Monitor & Kirim Data', en: 'Monitor & Transmit Data' },
    desc:     {
      id: 'Sensor merekam data setiap 2.5 detik. ESP32 mengirim ke Firebase Realtime Database via tether. Dashboard web menampilkan pH, TDS, turbidity, suhu, dan kedalaman secara live — lengkap dengan sparkline dan status alert.',
      en: 'Sensors record data every 2.5 seconds. ESP32 transmits to Firebase Realtime Database via tether. The web dashboard displays pH, TDS, turbidity, temperature, and depth live — with sparklines and status alerts.',
    },
    badge: { id: 'Real-time', en: 'Real-time' },
  },
  {
    num: '06',
    icon: <CheckCircle2 size={20} />,
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    glow:     'rgba(34,197,94,0.3)',
    title:    { id: 'Operasi Selesai', en: 'Operation Complete' },
    desc:     {
      id: 'Operator menutup jaring via servo latch dari dashboard. ROV naik ke permukaan menggunakan ballast + vertical thruster. Semua data operasi tersimpan di history dan dapat diexport ke Excel (CSV) untuk analisis lebih lanjut.',
      en: 'Operator closes the net via servo latch from the dashboard. ROV ascends using ballast + vertical thrusters. All operation data is saved to history and can be exported to Excel (CSV) for further analysis.',
    },
    badge: { id: 'Selesai', en: 'Complete' },
  },
]

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
            Cara Kerja
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: 'var(--t-text)' }}>
            Bagaimana{' '}
            <span style={{
              background: 'linear-gradient(135deg, #1A56DB, #00B4D8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Hydrone</span>{' '}
            Beroperasi?
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
            className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, #1A56DB44, #00B4D888, #F05A2244, #8B5CF644, transparent)' }}
            aria-hidden
          />

          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`relative flex items-start gap-0 sm:gap-8 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} pl-16 sm:pl-0`}
                  data-anim
                  data-delay={`${Math.min(i * 100, 400)}`}
                >
                  {/* ── Icon node on the line ── */}
                  <div
                    className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg z-10 shrink-0"
                    style={{
                      background: step.gradient,
                      boxShadow: `0 0 0 4px var(--t-bg), 0 0 0 6px ${step.glow.replace('0.3', '0.4')}, 0 4px 16px ${step.glow}`,
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* ── Content card ── */}
                  <div className={`mb-8 sm:mb-12 w-full sm:w-[calc(50%-2.5rem)] group`}>
                    <div
                      className="rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1"
                      style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement
                        el.style.boxShadow = `0 12px 36px ${step.glow}`
                        el.style.borderColor = 'transparent'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement
                        el.style.boxShadow = 'none'
                        el.style.borderColor = 'var(--t-border)'
                      }}
                    >
                      {/* Top gradient stripe */}
                      <div className="h-0.5 -mx-5 -mt-5 mb-4 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: step.gradient }} />

                      {/* Number + badge row */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-3xl font-black opacity-20"
                          style={{
                            background: step.gradient,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            fontFamily: 'var(--font-plus-jakarta)',
                            opacity: 1,
                          }}
                        >
                          {step.num}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: step.glow,
                            border: `1px solid ${step.glow}`,
                            color: 'var(--t-text)',
                          }}
                        >
                          {step.badge[lang]}
                        </span>
                      </div>

                      <h3 className="font-bold text-base mb-2" style={{ color: 'var(--t-text)' }}>
                        {step.title[lang]}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--t-muted)' }}>
                        {step.desc[lang]}
                      </p>
                    </div>
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
          className="mt-4 rounded-2xl p-6 flex items-center justify-center gap-4 text-white shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1A56DB 0%, #00B4D8 50%, #0D3A9E 100%)' }}
          data-anim
        >
          <CheckCircle2 size={24} className="shrink-0" />
          <span className="font-bold text-lg text-center">
            {lang === 'id'
              ? 'Hasilnya: Air Lebih Bersih dan Data Pencemaran Terverifikasi'
              : 'Result: Cleaner Water and Verified Pollution Data'}
          </span>
        </div>
      </div>
    </section>
  )
}
