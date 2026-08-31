'use client'

import { useLang } from '@/lib/i18n/context'
import { BarChart3, CheckCircle2, Filter, Navigation, PlaneTakeoff } from 'lucide-react'

const STEPS = [
  {
    num: '01', icon: <PlaneTakeoff size={28} />,
    title: { id: 'Deploy ke Perairan', en: 'Deploy to Water' },
    desc: { id: 'HYDRONE diturunkan ke sungai, danau, atau perairan pesisir yang akan dibersihkan.', en: 'HYDRONE is lowered into the river, lake, or coastal water to be cleaned.' },
    color: '#00B4D8',
  },
  {
    num: '02', icon: <Navigation size={28} />,
    title: { id: 'Navigasi ke Area Tercemar', en: 'Navigate to Polluted Area' },
    desc: { id: 'Thruster menggerakkan HYDRONE menuju titik pencemaran secara otonom atau via kendali manual.', en: 'Thrusters move HYDRONE toward pollution hotspots autonomously or via manual control.' },
    color: '#1565C0',
  },
  {
    num: '03', icon: <Filter size={28} />,
    title: { id: 'Tangkap dan Saring', en: 'Collect and Filter' },
    desc: { id: 'Jaring menangkap plastik besar, sementara pompa suction menyaring mikroplastik secara bersamaan.', en: 'The net captures large plastics while the suction pump filters microplastics simultaneously.' },
    color: '#43A047',
  },
  {
    num: '04', icon: <BarChart3 size={28} />,
    title: { id: 'Monitor dan Kirim Data', en: 'Monitor and Transmit Data' },
    desc: { id: 'Sensor mencatat kualitas air real-time dan mengirim data ke dashboard untuk analisis pencemaran.', en: 'Sensors record real-time water quality and send data to the dashboard for pollution analysis.' },
    color: '#D4A017',
  },
]

const T = {
  sectionLabel: { id: 'Cara Kerja', en: 'How It Works' },
  heading: { id: 'Bagaimana HYDRONE Beroperasi?', en: 'How Does HYDRONE Operate?' },
  result: { id: 'Hasilnya: Air Lebih Bersih dan Data Pencemaran Terverifikasi', en: 'Result: Cleaner Water and Verified Pollution Data' },
}

export default function HowItWorks() {
  const { lang } = useLang()

  return (
    <section id="cara-kerja" className="py-24" style={{ background: 'var(--t-hiw-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-anim>
          <span className="eyebrow">{T.sectionLabel[lang]}</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2" style={{ color: 'var(--t-hiw-text)' }}>{T.heading[lang]}</h2>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center" data-anim data-delay={`${i * 120}`}>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#00B4D8]/30 to-transparent" />
              )}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg relative z-10"
                style={{ backgroundColor: step.color + '20', color: step.color }}
              >
                {step.icon}
              </div>
              <div
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black z-20"
                style={{ backgroundColor: step.color }}
              >
                {step.num}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--t-hiw-text)' }}>{step.title[lang]}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--t-hiw-muted)' }}>{step.desc[lang]}</p>
            </div>
          ))}
        </div>

        {/* Result banner */}
        <div className="bg-gradient-to-r from-[#1565C0] to-[#00B4D8] rounded-2xl p-6 flex items-center justify-center gap-3 text-white shadow-xl" data-anim>
          <CheckCircle2 size={24} className="flex-shrink-0" />
          <span className="font-bold text-lg text-center">{T.result[lang]}</span>
        </div>
      </div>
    </section>
  )
}
