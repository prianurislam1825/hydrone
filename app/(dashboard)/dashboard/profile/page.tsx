'use client'

import { useState } from 'react'
import { Mail, Clock, Shield, LogIn, User, Bell, Moon, Sun, Globe, ChevronRight, LogOut } from 'lucide-react'
import { useTheme } from '@/lib/theme/useTheme'
import { useLang } from '@/lib/i18n/context'

function ToggleRow({
  icon, label, sublabel, active, onToggle,
}: { icon: React.ReactNode; label: string; sublabel?: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl border transition-all text-left"
      style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--t-muted)' }}>{icon}</span>
        <div>
          <div className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>{label}</div>
          {sublabel && <div className="text-[11px]" style={{ color: 'var(--t-muted)' }}>{sublabel}</div>}
        </div>
      </div>
      <div
        className="relative w-11 rounded-full border transition-all duration-300 shrink-0"
        style={{ height: 24, background: active ? '#1A56DB' : 'var(--t-bg)', borderColor: active ? '#1A56DB' : 'var(--t-border)' }}
      >
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300" style={{ left: active ? 20 : 2 }} />
      </div>
    </button>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b last:border-0" style={{ borderColor: 'var(--t-border)' }}>
      <span style={{ color: 'var(--t-muted)' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--t-muted)' }}>{label}</div>
        <div className="text-sm font-medium truncate" style={{ color: 'var(--t-text)' }}>{value}</div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang }   = useLang()
  const [notif, setNotif]              = useState(true)

  return (
    <div className="min-h-full" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4">

        {/* ── Header ───────────────────────────────────────────── */}
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Profil & Pengaturan</h1>
          <p className="text-xs" style={{ color: 'var(--t-muted)' }}>Kelola akun dan preferensi aplikasi</p>
        </div>

        {/* ── Avatar card ──────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--t-border)' }}>
          {/* Gradient header */}
          <div className="px-5 pt-6 pb-10 flex flex-col items-center gap-2" style={{ background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white/20" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <User size={36} className="text-white" />
            </div>
            <div className="text-center mt-1">
              <div className="text-lg font-bold text-white">HYDRONE Admin</div>
              <div className="text-xs text-white/70">admin@hydrone.local</div>
            </div>
            <div className="flex gap-2 mt-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/25">ADMIN</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#22C55E]/25 text-[#86EFAC] border border-[#22C55E]/30">Aktif</span>
            </div>
          </div>

          {/* Info rows */}
          <div className="-mt-4 mx-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <InfoRow icon={<Mail size={15} />}   label="Email"         value="admin@hydrone.local" />
            <InfoRow icon={<Clock size={15} />}  label="Anggota Sejak" value="Juli 2026" />
            <InfoRow icon={<LogIn size={15} />}  label="Login Terakhir"value="31 Agustus 2026, 13:00" />
            <InfoRow icon={<Shield size={15} />} label="Metode Login"  value="Credentials" />
          </div>
          <div className="h-4" />
        </div>

        {/* ── Preferensi ───────────────────────────────────────── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block px-1" style={{ color: 'var(--t-muted)' }}>Preferensi</span>
          <div className="flex flex-col gap-2">
            <ToggleRow
              icon={<Bell size={16} />}
              label="Notifikasi"
              sublabel="Peringatan sensor dan status"
              active={notif}
              onToggle={() => setNotif(v => !v)}
            />
            <ToggleRow
              icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              label="Mode Gelap"
              sublabel={theme === 'dark' ? 'Tampilan gelap aktif' : 'Tampilan terang aktif'}
              active={theme === 'dark'}
              onToggle={toggleTheme}
            />
          </div>
        </div>

        {/* ── Bahasa ───────────────────────────────────────────── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block px-1" style={{ color: 'var(--t-muted)' }}>Bahasa / Language</span>
          <button
            onClick={toggleLang}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl border transition-all"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
          >
            <div className="flex items-center gap-3">
              <Globe size={16} style={{ color: 'var(--t-muted)' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>Bahasa Antarmuka</div>
                <div className="text-[11px]" style={{ color: 'var(--t-muted)' }}>{lang === 'id' ? 'Indonesia' : 'English'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ background: 'var(--t-surface-2)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}>
                {lang === 'id' ? 'ID → EN' : 'EN → ID'}
              </span>
              <ChevronRight size={14} style={{ color: 'var(--t-muted)' }} />
            </div>
          </button>
        </div>

        {/* ── Tentang ──────────────────────────────────────────── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block px-1" style={{ color: 'var(--t-muted)' }}>Tentang Aplikasi</span>
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            {[
              { label: 'Versi Aplikasi', value: '1.0.0' },
              { label: 'Perangkat',      value: 'Hydrone ROV' },
              { label: 'Kompetisi',      value: 'IID INNOPA 2026' },
              { label: 'Tim',            value: 'Mersiflab' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--t-border)' }}>
                <span className="text-sm" style={{ color: 'var(--t-muted)' }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Logout ───────────────────────────────────────────── */}
        <a
          href="/login"
          className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#EF4444' }}
        >
          <LogOut size={15} />
          Keluar
        </a>

        <p className="text-center text-[10px] pb-2 font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.4 }}>
          Hydrone · IID INNOPA 2026 · Mersiflab
        </p>
      </div>
    </div>
  )
}
