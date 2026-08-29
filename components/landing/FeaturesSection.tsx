'use client'

import {
  Network,
  Droplets,
  ArrowUpDown,
  Navigation,
  Gauge,
  Joystick,
} from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const FEATURES = [
  {
    icon: <Network size={28} />,
    title: { id: 'Jaring Penangkap Pasif', en: 'Passive Deployable Net' },
    desc: {
      id: 'Jaring nilon mengembang otomatis saat HYDRONE bergerak maju, menangkap botol, kantong, dan plastik besar tanpa mekanisme aktif tambahan.',
      en: 'A nylon net automatically deploys as HYDRONE moves forward, capturing bottles, bags, and large plastics without additional active mechanisms.',
    },
    color: '#00B4D8',
    gradient: 'from-[#00B4D8]/20 to-[#00B4D8]/5',
  },
  {
    icon: <Droplets size={28} />,
    title: { id: 'Suction Mikroplastik 2 Tahap', en: 'Dual-Stage Microplastic Suction' },
    desc: {
      id: 'Pompa DC menyedot air melalui dua tahap filtrasi berurutan yaitu filter 10 mikron lalu 5 mikron, menangkap partikel mikroplastik halus.',
      en: 'A DC pump draws water through two sequential filtration stages, 10 micron then 5 micron filters, capturing fine microplastic particles.',
    },
    color: '#0096C7',
    gradient: 'from-[#0096C7]/20 to-[#0096C7]/5',
  },
  {
    icon: <ArrowUpDown size={28} />,
    title: { id: 'Sistem Daya Apung Adaptif', en: 'Adaptive Buoyancy System' },
    desc: {
      id: 'Ballast chamber yang bisa diisi atau dikosongkan otomatis memungkinkan HYDRONE menyelam, hover, dan naik tanpa intervensi manual.',
      en: 'A ballast chamber that fills or empties automatically allows HYDRONE to dive, hover, and surface without manual intervention.',
    },
    color: '#43A047',
    gradient: 'from-[#43A047]/20 to-[#43A047]/5',
  },
  {
    icon: <Navigation size={28} />,
    title: { id: 'Propulsi Pivot 6 Arah', en: '6-Direction Pivot Propulsion' },
    desc: {
      id: 'Dua thruster brushless yang bisa berotasi memberi kemampuan gerak maju, mundur, belok, naik, dan turun hanya dengan dua motor.',
      en: 'Two pivoting brushless thrusters provide forward, reverse, turning, rising, and diving movement with just two motors.',
    },
    color: '#1565C0',
    gradient: 'from-[#1565C0]/20 to-[#1565C0]/5',
  },
  {
    icon: <Gauge size={28} />,
    title: { id: 'Monitor Kualitas Air Real-time', en: 'Real-Time Water Quality Monitor' },
    desc: {
      id: 'Sensor turbidity, TDS, suhu, pH, dan GPS mencatat kondisi air secara terus-menerus dan mengirim data ke dashboard web.',
      en: 'Turbidity, TDS, temperature, pH, and GPS sensors continuously record water conditions and send data to a web dashboard.',
    },
    color: '#D4A017',
    gradient: 'from-[#D4A017]/20 to-[#D4A017]/5',
  },
  {
    icon: <Joystick size={28} />,
    title: { id: 'Dua Mode Operasi', en: 'Dual Operation Mode' },
    desc: {
      id: 'Bisa dioperasikan secara otonom menggunakan sensor, atau dikendalikan manual oleh operator melalui kabel tether 20 meter.',
      en: 'Operates autonomously using sensors, or manually controlled by an operator through a 20-meter tether cable.',
    },
    color: '#9C27B0',
    gradient: 'from-[#9C27B0]/20 to-[#9C27B0]/5',
  },
]

const T = {
  sectionLabel: { id: 'Fitur Unggulan', en: 'Key Features' },
  heading: { id: 'Teknologi di Balik HYDRONE', en: 'Technology Behind HYDRONE' },
}

export default function FeaturesSection() {
  const { lang } = useLang()

  return (
    <section id="fitur" className="py-24 bg-[#1B3A6B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-anim>
          <span className="section-label">{T.sectionLabel[lang]}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">{T.heading[lang]}</h2>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${feat.gradient} border border-white/10 backdrop-blur rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group`}
              data-anim
              data-delay={`${i * 80}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/5 group-hover:scale-110 transition-transform"
                style={{ color: feat.color }}
              >
                {feat.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3 leading-tight">
                {feat.title[lang]}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{feat.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
