'use client'

import { useLang } from '@/lib/i18n/context';
import { ChevronDown, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface SpecRow { name: string; value: string }
interface SpecGroup { title: { id: string; en: string }; rows: SpecRow[] }

const SPEC_GROUPS: SpecGroup[] = [
  { title: { id: 'Badan & Struktur', en: 'Body & Structure' }, rows: [{ name: 'Dimensi (P x L x T)', value: '500 x 200 x 120 mm' }, { name: 'Lebar total + pod thruster', value: '~350 mm' }, { name: 'Berat target', value: '~7.5 kg' }, { name: 'Material badan', value: 'PETG (3D printed)' }, { name: 'Kedalaman operasi', value: '0 - 10 m' }] },
  { title: { id: 'Sistem Propulsi', en: 'Propulsion System' }, rows: [{ name: 'Total thruster', value: '4 unit' }, { name: 'Horizontal', value: '2x (1 CW + 1 CCW)' }, { name: 'Vertikal', value: '2x (sudut-V 75°)' }, { name: 'Efektivitas thrust vertikal', value: '96.6% (sin 75°)' }, { name: 'Kontrol kemudi', value: 'Diferensial thrust' }, { name: 'Tegangan propulsi', value: '14.8V (Li-Ion 4S)' }] },
  { title: { id: 'Sistem Balast', en: 'Ballast System' }, rows: [{ name: 'Konfigurasi', value: 'Dual-chamber' }, { name: 'Volume total', value: '1.000 ml (1 liter)' }, { name: 'Komponen utama', value: 'Pompa air DC 12V + kompresor mini + katup solenoid' }] },
  { title: { id: 'Mekanisme Jaring', en: 'Net Mechanism' }, rows: [{ name: 'Tipe mekanisme', value: 'Passive flap door + servo latch' }, { name: 'Frame', value: 'Fiberglass rod / HDPE strip' }, { name: 'Material jaring', value: 'Nylon/polyester mesh' }, { name: 'Penguncian', value: 'Servo-actuated sliding latch' }] },
  { title: { id: 'Sistem Filtrasi', en: 'Filtration System' }, rows: [{ name: 'Tahapan filter', value: '2-stage series' }, { name: 'Stage 1', value: '20 - 50 mikron' }, { name: 'Stage 2', value: '0.1 mikron (mikroplastik)' }, { name: 'Housing', value: '10-inch filter housing x 2' }] },
  { title: { id: 'Sensor Suite', en: 'Sensor Suite' }, rows: [{ name: 'pH sensor', value: 'Analog → Arduino A1' }, { name: 'TDS sensor', value: 'Analog → Arduino A2' }, { name: 'Turbidity sensor', value: 'Analog → ESP32 GPIO34' }, { name: 'Temperature DS18B20', value: 'OneWire → ESP32 GPIO32' }, { name: 'MPU6050 IMU', value: 'I2C → ESP32 GPIO21/22' }] },
  { title: { id: 'Kamera & Pencahayaan', en: 'Camera & Lighting' }, rows: [{ name: 'Kamera', value: 'ESP32-CAM (onboard WiFi)' }, { name: 'LED spotlight', value: 'Waterproof putih x 2 (depan)' }, { name: 'LED DRL', value: 'Waterproof oranye (samping)' }] },
  { title: { id: 'Sistem Daya', en: 'Power System' }, rows: [{ name: 'Pack A (Propulsi)', value: 'Li-Ion 4S5P, 14.8V, ~12.500 mAh' }, { name: 'Pack B (Elektronik)', value: 'Li-Ion 3S2P, 11.1V, ~5.000 mAh' }, { name: 'Hot-swappable', value: 'Ya (top-access panel)' }] },
  { title: { id: 'Komunikasi & Kontrol', en: 'Communication & Control' }, rows: [{ name: 'Tipe link', value: 'Physical tether' }, { name: 'Panjang tether', value: '20 m' }, { name: 'Interface operator', value: 'Tablet / laptop di permukaan' }, { name: 'Backend dashboard', value: 'Firebase (deployment penuh)' }] },
]

const SUMMARY_STATS = [
  { value: '500mm', label: { id: 'Panjang', en: 'Length' } },
  { value: '120mm', label: { id: 'Tinggi', en: 'Height' } },
  { value: '4', label: { id: 'Thruster', en: 'Thrusters' } },
  { value: '0.1µm', label: { id: 'Presisi Mikro', en: 'Micro Precision' } },
  { value: '20m', label: { id: 'Tether', en: 'Tether' } },
  { value: '10m', label: { id: 'Kedalaman Maks', en: 'Max Depth' } },
]

function SpecGroupCard({ group, defaultOpen }: { group: SpecGroup; defaultOpen: boolean }) {
  const { lang } = useLang()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--t-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors min-h-[52px]"
        style={{ background: 'var(--t-surface)' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--t-surface-2)')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--t-surface)')}
      >
        <span className="font-semibold text-sm font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--t-text)' }}>
          {group.title[lang]}
        </span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--t-muted)' }} />
      </button>
      {open && (
        <div style={{ background: 'var(--t-bg)' }}>
          {group.rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--t-border)' }}>
              <span className="text-sm" style={{ color: 'var(--t-muted)' }}>{row.name}</span>
              <span className="text-sm font-medium font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-text)' }}>{row.value}</span>
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
    <section id="spesifikasi" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-anim>
          <span className="eyebrow">{T.eyebrow[lang]}</span>
          <span className="eyebrow-rule mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--t-text)' }}>{T.heading[lang]}</h2>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-20" data-anim>
          {SUMMARY_STATS.map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center border" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
              <div className="font-bold text-2xl font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--t-text)' }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--t-muted)' }}>{s.label[lang]}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-6 font-[family-name:var(--font-space-grotesk)]" style={{ color: 'var(--t-text)' }} data-anim>
          {T.fullTitle[lang]}
        </h3>

        <div className="space-y-3 mb-16">
          {SPEC_GROUPS.map((group, i) => (
            <div key={i} data-anim data-delay={`${Math.min(i * 50, 300)}`}>
              <SpecGroupCard group={group} defaultOpen={i === 0} />
            </div>
          ))}
        </div>

        {/* Doc card */}
        <div className="glass rounded-2xl p-8 text-center" data-anim>
          <p className="text-sm mb-6 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--t-muted)' }}>{T.docNote[lang]}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hydrone.id@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all min-h-[48px] text-sm font-semibold w-full sm:w-auto border hover:bg-white/5"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-muted)' }}
            >
              <Mail size={18} />{T.contact[lang]}
            </a>
            <a
              href="https://wa.me/6281548158100"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22C55E]/10 border border-[#22C55E]/20 hover:border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/20 font-semibold rounded-xl transition-all min-h-[48px] text-sm w-full sm:w-auto"
            >
              <MessageCircle size={18} />{T.contact[lang]}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
