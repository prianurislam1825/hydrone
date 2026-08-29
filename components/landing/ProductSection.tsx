'use client'

import { CheckCircle, Cpu, Cable, Droplets, Gauge } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

const FEATURES = [
  { id: 'Tangkap plastik makro dengan jaring pasif', en: 'Capture macroplastic with passive net' },
  { id: 'Saring mikroplastik hingga 5 mikron', en: 'Filter microplastics down to 5 microns' },
  { id: 'Sistem daya apung adaptif otomatis', en: 'Automatic adaptive buoyancy system' },
  { id: 'Propulsi 6 arah dengan pivot thruster', en: '6-direction movement with pivot thrusters' },
  { id: 'Monitor kualitas air real-time', en: 'Real-time water quality monitoring' },
  { id: 'Dua mode: otonom dan manual', en: 'Dual mode: autonomous and manual' },
  { id: 'Kamera bawah air + pencahayaan LED', en: 'Underwater camera + LED lighting' },
  { id: 'Dashboard web + penyimpanan data cloud', en: 'Web dashboard + cloud data storage' },
]

const T = {
  sectionLabel: { id: 'Produk Kami', en: 'Our Product' },
  name: { id: 'HYDRONE ROV', en: 'HYDRONE ROV' },
  tagline: { id: 'Dive. Collect. Protect.', en: 'Dive. Collect. Protect.' },
  sub: { id: 'Bawah Air · Otonom · Monitor Real-time', en: 'Underwater · Autonomous · Real-time Monitoring' },
  desc: {
    id: 'Sistem pembersih perairan terintegrasi yang menangani sampah plastik makro dan mikroplastik sekaligus, dilengkapi monitoring kualitas air real-time dan kemampuan operasi ganda otonom maupun manual.',
    en: 'An integrated water cleaning system handling both macroplastic and microplastic simultaneously, with real-time water quality monitoring and dual autonomous or manual operation capability.',
  },
  modeAutonomousLabel: { id: 'Otonom', en: 'Autonomous' },
  modeAutonomousDesc: { id: 'ESP32 + sensor navigasi otomatis', en: 'ESP32 + automatic sensor navigation' },
  modeManualLabel: { id: 'Manual', en: 'Manual' },
  modeManualDesc: { id: 'Kendali via kabel tether 20m', en: 'Control via 20m tether cable' },
  cta: { id: 'Hubungi Kami', en: 'Contact Us' },
  turbidity: { id: 'Turbidity', en: 'Turbidity' },
  depth: { id: 'Kedalaman', en: 'Depth' },
}

export default function ProductSection() {
  const { lang } = useLang()

  return (
    <section id="produk" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Details */}
          <div data-anim>
            <span className="section-label" style={{ color: '#00B4D8' }}>{T.sectionLabel[lang]}</span>
            <h2 className="text-4xl font-black text-[#0D1B2A] mt-2 mb-1">{T.name[lang]}</h2>
            <p className="text-[#00B4D8] font-mono font-bold text-lg mb-1">{T.tagline[lang]}</p>
            <p className="text-gray-500 text-sm mb-6">{T.sub[lang]}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{T.desc[lang]}</p>

            {/* Features checklist */}
            <ul className="space-y-3 mb-8">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#43A047] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{f[lang]}</span>
                </li>
              ))}
            </ul>

            {/* Mode badges */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex items-center gap-3 bg-[#1565C0]/10 border border-[#1565C0]/20 rounded-xl px-4 py-3">
                <Cpu size={20} className="text-[#1565C0] flex-shrink-0" />
                <div>
                  <div className="font-bold text-[#1565C0] text-sm">{T.modeAutonomousLabel[lang]}</div>
                  <div className="text-gray-500 text-xs">{T.modeAutonomousDesc[lang]}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#43A047]/10 border border-[#43A047]/20 rounded-xl px-4 py-3">
                <Cable size={20} className="text-[#43A047] flex-shrink-0" />
                <div>
                  <div className="font-bold text-[#43A047] text-sm">{T.modeManualLabel[lang]}</div>
                  <div className="text-gray-500 text-xs">{T.modeManualDesc[lang]}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/6281227917676"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#43A047] hover:bg-[#388E3C] text-white font-bold rounded-xl transition-all shadow-lg min-h-[52px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {T.cta[lang]}
            </a>
          </div>

          {/* Right: Visual */}
          <div className="flex items-center justify-center" data-anim="scale">
            <div className="relative w-80 h-80">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1565C0]/10 to-[#00B4D8]/10" />

              {/* Main device visual */}
              <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-[#1B3A6B] to-[#0A1628] border border-[#00B4D8]/30 shadow-2xl flex flex-col items-center justify-center gap-4 animate-glow-pulse">
                <div className="w-16 h-16 rounded-full bg-[#00B4D8]/20 border-2 border-[#00B4D8]/50 flex items-center justify-center">
                  <span className="text-[#00B4D8] font-black text-2xl">H</span>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">HYDRONE ROV</div>
                  <div className="text-[#00B4D8] text-xs font-mono">v1.0.0</div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-[#43A047] text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#43A047] animate-pulse-dot" />
                    ACTIVE
                  </div>
                </div>
              </div>

              {/* Floating sensor cards */}
              <div className="absolute -top-2 -right-2 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 text-xs animate-float-up">
                <div className="flex items-center gap-2">
                  <Droplets size={12} className="text-[#00B4D8]" />
                  <div>
                    <div className="font-bold text-gray-800">12 NTU</div>
                    <div className="text-[#43A047]">{T.turbidity[lang]}</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 text-xs animate-float-up" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2">
                  <Gauge size={12} className="text-[#1565C0]" />
                  <div>
                    <div className="font-bold text-gray-800">1.2 m</div>
                    <div className="text-[#1565C0]">{T.depth[lang]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
