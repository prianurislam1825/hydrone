'use client'

import { Anchor, Fish, Filter, Activity } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const PILLARS = [
  {
    icon: <Anchor size={22} />,
    title: { id: 'Bekerja Di Bawah Air', en: 'Operates Underwater' },
    color: '#1565C0',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: <Fish size={22} />,
    title: { id: 'Tangkap Plastik Makro', en: 'Captures Macroplastic' },
    color: '#43A047',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  {
    icon: <Filter size={22} />,
    title: { id: 'Filter Mikroplastik 5µm', en: '5µm Microplastic Filter' },
    color: '#00B4D8',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  {
    icon: <Activity size={22} />,
    title: { id: 'Monitor Kualitas Air', en: 'Water Quality Monitor' },
    color: '#D4A017',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
]

const T = {
  sectionLabel: { id: 'Apa itu HYDRONE?', en: 'What is HYDRONE?' },
  heading: {
    id: 'Robot Bawah Air yang Membersihkan Perairan dari Dalam',
    en: 'An Underwater Robot That Cleans Waters From Within',
  },
  p1: {
    id: 'HYDRONE adalah robot pembersih perairan bawah air yang dirancang untuk mengatasi dua masalah sekaligus: sampah plastik besar yang terlihat mata, dan mikroplastik berbahaya yang tersebar di dalam air.',
    en: 'HYDRONE is an underwater water-cleaning robot designed to tackle two problems at once: large visible plastic waste, and dangerous microplastics scattered throughout the water.',
  },
  p2: {
    id: 'Berbeda dari alat pembersih konvensional yang hanya bekerja di permukaan, HYDRONE beroperasi di bawah air menggunakan sistem daya apung adaptif, sehingga bisa menjangkau polutan yang tidak terlihat dari atas.',
    en: 'Unlike conventional cleaners that only work on the surface, HYDRONE operates underwater using an adaptive buoyancy system, reaching pollutants invisible from above.',
  },
  p3: {
    id: 'Semua data kualitas air dikirim secara real-time ke dashboard, menghasilkan peta pencemaran yang bisa digunakan pemerintah dan peneliti.',
    en: 'All water quality data is sent in real-time to a dashboard, producing pollution maps usable by governments and researchers.',
  },
}

export default function AboutSection() {
  const { lang } = useLang()

  return (
    <section id="tentang" className="py-24 bg-[#CAF0F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div data-anim>
            <span className="section-label">{T.sectionLabel[lang]}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B2A] mb-6 leading-tight">
              {T.heading[lang]}
            </h2>
            <div className="space-y-4 text-[#0D1B2A]/70 text-base leading-relaxed mb-8">
              <p>{T.p1[lang]}</p>
              <p>{T.p2[lang]}</p>
              <p>{T.p3[lang]}</p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map((p, i) => (
                <div
                  key={i}
                  className={`${p.bg} ${p.border} border rounded-xl p-4 flex items-center gap-3`}
                  data-anim
                  data-delay={`${(i + 1) * 100}`}
                >
                  <span style={{ color: p.color }}>{p.icon}</span>
                  <span className="text-[#0D1B2A] font-semibold text-sm leading-tight">
                    {p.title[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Orbit visual */}
          <div className="flex items-center justify-center" data-anim="scale">
            <div className="relative w-72 h-72">
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[#1565C0]/20" />
              <div className="absolute inset-8 rounded-full border-2 border-[#00B4D8]/30 border-dashed" />
              <div className="absolute inset-16 rounded-full border-2 border-[#0096C7]/40" />

              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1565C0] to-[#00B4D8] flex items-center justify-center shadow-2xl animate-glow-pulse">
                  <span className="text-white font-black text-3xl">H</span>
                </div>
              </div>

              {/* Orbiting dots */}
              {[0, 90, 180, 270].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-[#00B4D8] shadow-lg"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${deg}deg) translateX(120px) translateY(-50%)`,
                    animation: `orbit ${6 + i}s linear infinite`,
                    animationDelay: `${i * 1.5}s`,
                  }}
                />
              ))}

              {/* Floating data bubbles */}
              <div className="absolute -top-4 -right-4 glass-light rounded-xl px-3 py-2 shadow text-xs font-bold text-[#1565C0] border border-blue-200 animate-float-up" style={{ animationDelay: '0s' }}>
                12 NTU
              </div>
              <div className="absolute -bottom-4 -left-4 glass-light rounded-xl px-3 py-2 shadow text-xs font-bold text-[#43A047] border border-green-200 animate-float-up" style={{ animationDelay: '1s' }}>
                5 µm
              </div>
              <div className="absolute top-1/2 -right-8 glass-light rounded-xl px-3 py-2 shadow text-xs font-bold text-[#D4A017] border border-yellow-200 animate-float-up" style={{ animationDelay: '2s' }}>
                28.4°C
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
