'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '@/lib/i18n/context'

interface SpecRow {
  name: string
  value: string
}

interface SpecGroup {
  title: { id: string; en: string }
  rows: SpecRow[]
}

const SPEC_GROUPS: SpecGroup[] = [
  {
    title: { id: 'Badan & Struktur', en: 'Body & Structure' },
    rows: [
      { name: 'Dimensi (P x L x T)', value: '500 x 200 x 120 mm' },
      { name: 'Lebar total + pod thruster', value: '~350 mm' },
      { name: 'Berat target', value: '~7.5 kg' },
      { name: 'Material badan', value: 'PETG (3D printed)' },
      { name: 'Kedalaman operasi', value: '0 - 10 m' },
    ],
  },
  {
    title: { id: 'Sistem Propulsi', en: 'Propulsion System' },
    rows: [
      { name: 'Total thruster', value: '4 unit' },
      { name: 'Horizontal', value: '2x (1 CW + 1 CCW)' },
      { name: 'Vertikal', value: '2x (sudut-V 75\u00b0)' },
      { name: 'Efektivitas thrust vertikal', value: '96.6% (sin 75\u00b0)' },
      { name: 'Kontrol kemudi', value: 'Diferensial thrust' },
      { name: 'Spesifikasi thruster', value: 'T200-equivalent, 12-24V, 20A max' },
      { name: 'Tegangan propulsi', value: '14.8V (Li-Ion 4S)' },
    ],
  },
  {
    title: { id: 'Sistem Balast', en: 'Ballast System' },
    rows: [
      { name: 'Konfigurasi', value: 'Dual-chamber' },
      { name: 'Volume total', value: '1.000 ml (1 liter)' },
      { name: 'Komponen utama', value: 'Pompa air DC 12V + kompresor mini + katup solenoid' },
    ],
  },
  {
    title: { id: 'Mekanisme Jaring', en: 'Net Mechanism' },
    rows: [
      { name: 'Tipe mekanisme', value: 'Passive flap door + servo latch' },
      { name: 'Frame', value: 'Fiberglass rod / HDPE strip' },
      { name: 'Material jaring', value: 'Nylon/polyester mesh' },
      { name: 'Penguncian', value: 'Servo-actuated sliding latch' },
    ],
  },
  {
    title: { id: 'Sistem Filtrasi', en: 'Filtration System' },
    rows: [
      { name: 'Tahapan filter', value: '2-stage series' },
      { name: 'Stage 1 (Pre-filter)', value: '20 - 50 mikron' },
      { name: 'Stage 2 (Final)', value: '0.1 mikron (mikroplastik)' },
      { name: 'Housing', value: '10-inch filter housing x 2' },
      { name: 'Sumber hisap', value: 'Bilge pump submersible DC 12V' },
    ],
  },
  {
    title: { id: 'Sensor Suite', en: 'Sensor Suite' },
    rows: [
      { name: 'pH sensor', value: 'Analog \u2192 Arduino A1' },
      { name: 'TDS sensor', value: 'Analog \u2192 Arduino A2' },
      { name: 'Turbidity sensor', value: 'Analog \u2192 Arduino A0 / ESP32 GPIO34' },
      { name: 'DS18B20 temperature', value: 'OneWire \u2192 ESP32 GPIO32' },
      { name: 'MPU6050 IMU', value: 'I2C \u2192 ESP32 GPIO21/22' },
    ],
  },
  {
    title: { id: 'Kamera & Pencahayaan', en: 'Camera & Lighting' },
    rows: [
      { name: 'Kamera', value: 'ESP32-CAM (onboard WiFi)' },
      { name: 'LED spotlight', value: 'Waterproof putih x 2 (depan)' },
      { name: 'LED DRL', value: 'Waterproof oranye (samping)' },
    ],
  },
  {
    title: { id: 'Sistem Daya', en: 'Power System' },
    rows: [
      { name: 'Pack A (Propulsi)', value: 'Li-Ion 4S5P, 14.8V, ~12.500 mAh' },
      { name: 'Pack B (Elektronik)', value: 'Li-Ion 3S2P, 11.1V, ~5.000 mAh' },
      { name: 'Hot-swappable', value: 'Ya (top-access panel)' },
      { name: 'BMS', value: 'Independent per pack' },
    ],
  },
  {
    title: { id: 'Komunikasi & Kontrol', en: 'Communication & Control' },
    rows: [
      { name: 'Tipe link', value: 'Physical tether' },
      { name: 'Panjang tether', value: '20 m' },
      { name: 'Konten tether', value: 'USB/Ethernet waterproof cable' },
      { name: 'Interface operator', value: 'Tablet / laptop di permukaan' },
      { name: 'Backend dashboard', value: 'Firebase (deployment penuh)' },
    ],
  },
]

const SUMMARY_STATS = [
  { value: '500mm', label: { id: 'Panjang', en: 'Length' } },
  { value: '120mm', label: { id: 'Tinggi', en: 'Height' } },
  { value: '4', label: { id: 'Thruster', en: 'Thrusters' } },
  { value: '0.1\u00b5m', label: { id: 'Presisi Mikroplastik', en: 'Microplastic Precision' } },
  { value: '20m', label: { id: 'Jangkauan Tether', en: 'Tether Range' } },
  { value: '10m', label: { id: 'Kedalaman Maks', en: 'Max Depth' } },
]

function SpecGroupCard({ group, defaultOpen }: { group: SpecGroup; defaultOpen: boolean }) {
  const { lang } = useLang()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-[#1E2D50] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#111827] hover:bg-[#1C2A4A] transition-colors min-h-[52px]"
      >
        <span className="text-[#F8FAFF] font-semibold text-sm font-[family-name:var(--font-space-grotesk)]">
          {group.title[lang]}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#8B9EC7] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="bg-[#0D1B3E]">
          {group.rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3 border-t border-[#1E2D50]/50"
            >
              <span className="text-[#8B9EC7] text-sm">{row.name}</span>
              <span className="text-[#F8FAFF] text-sm font-medium font-[family-name:var(--font-jetbrains-mono)]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SpecsSection() {
  const { lang } = useLang()

  const T = {
    eyebrow: { id: 'SPESIFIKASI TEKNIS', en: 'TECHNICAL SPECIFICATIONS' },
    heading: { id: 'Sekilas Pandang', en: 'At a Glance' },
    fullTitle: { id: 'Spesifikasi Lengkap', en: 'Full Specifications' },
    docNote: {
      id: 'Dokumentasi teknis lengkap tersimpan dalam Hydrone Bible, spesifikasi hidup yang dikelola oleh Librarian proyek.',
      en: 'Full technical documentation is maintained in the Hydrone Bible, a living specification document updated by the project Librarian.',
    },
    contact: { id: 'Hubungi Tim', en: 'Contact Team' },
  }

  return (
    <section id="spesifikasi" className="py-24 bg-[#0D1B3E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-anim>
          <span className="eyebrow">{T.eyebrow[lang]}</span>
          <span className="eyebrow-rule mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFF] mt-4">{T.heading[lang]}</h2>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-20" data-anim>
          {SUMMARY_STATS.map((s, i) => (
            <div
              key={i}
              className="bg-[#111827] border border-[#1E2D50] rounded-xl p-4 text-center"
            >
              <div className="text-[#F8FAFF] font-bold text-2xl font-[family-name:var(--font-space-grotesk)]">
                {s.value}
              </div>
              <div className="text-[#8B9EC7] text-[10px] uppercase tracking-wider mt-1">
                {s.label[lang]}
              </div>
            </div>
          ))}
        </div>

        {/* Full specs */}
        <h3 className="text-lg font-bold text-[#F8FAFF] mb-6 font-[family-name:var(--font-space-grotesk)]" data-anim>
          {T.fullTitle[lang]}
        </h3>

        <div className="space-y-3 mb-16">
          {SPEC_GROUPS.map((group, i) => (
            <div key={i} data-anim data-delay={`${Math.min(i * 50, 300)}`}>
              <SpecGroupCard group={group} defaultOpen={i === 0} />
            </div>
          ))}
        </div>

        {/* Documentation card */}
        <div className="glass rounded-2xl p-8 text-center" data-anim>
          <p className="text-[#8B9EC7] text-sm mb-6 max-w-lg mx-auto leading-relaxed">
            {T.docNote[lang]}
          </p>
          <a
            href="mailto:marsyarazanah10@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#1E2D50] hover:border-[#1A56DB] text-[#8B9EC7] hover:text-[#F8FAFF] font-semibold rounded-xl transition-all min-h-[48px] text-sm hover:bg-white/5"
          >
            {T.contact[lang]}
          </a>
        </div>
      </div>
    </section>
  )
}
