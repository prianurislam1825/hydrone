'use client'

import { useLang } from '@/lib/i18n/context'
import { useTheme } from '@/lib/theme/useTheme'
import { Bell, ChevronRight, Clock, Globe, LogIn, LogOut, Mail, Moon, Shield, Sun, User } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

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
  const { data: session }              = useSession()
  const [notif, setNotif]              = useState(true)

  const userName    = session?.user?.name  || 'HYDRONE Admin'
  const userEmail   = session?.user?.email || 'admin@hydrone.local'
  const userImage   = session?.user?.image
  const loginMethod = userImage ? 'Google OAuth' : 'Credentials'

  return (
    <div className="min-h-full" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4">

        {/* ── Header ── */}
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>
            {lang === 'id' ? 'Profil & Pengaturan' : 'Profile & Settings'}
          </h1>
          <p className="text-xs" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'Kelola akun dan preferensi aplikasi' : 'Manage account and app preferences'}
          </p>
        </div>

        {/* ── Avatar card ── */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--t-border)' }}>
          {/* Gradient header */}
          <div className="px-5 pt-6 pb-10 flex flex-col items-center gap-2" style={{ background: 'linear-gradient(135deg, #1A56DB, #0D3A9E)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.15)' }}>
              {userImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-white" />
              )}
            </div>
            <div className="text-center mt-1">
              <div className="text-lg font-bold text-white">{userName}</div>
              <div className="text-xs text-white/70">{userEmail}</div>
            </div>
            <div className="flex gap-2 mt-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/25">ADMIN</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#22C55E]/25 text-[#86EFAC] border border-[#22C55E]/30">
                {lang === 'id' ? 'Aktif' : 'Active'}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="-mt-4 mx-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            <InfoRow icon={<Mail size={15} />}   label="Email"         value={userEmail} />
            <InfoRow icon={<Clock size={15} />}  label={lang === 'id' ? 'Anggota Sejak' : 'Member Since'} value={lang === 'id' ? 'Juli 2026' : 'July 2026'} />
            <InfoRow icon={<LogIn size={15} />}  label={lang === 'id' ? 'Login Terakhir' : 'Last Login'}  value={lang === 'id' ? 'Hari ini' : 'Today'} />
            <InfoRow icon={<Shield size={15} />} label={lang === 'id' ? 'Metode Login' : 'Login Method'}  value={loginMethod} />
          </div>
          <div className="h-4" />
        </div>

        {/* ── Preferensi ── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block px-1" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'Preferensi' : 'Preferences'}
          </span>
          <div className="flex flex-col gap-2">
            <ToggleRow
              icon={<Bell size={16} />}
              label={lang === 'id' ? 'Notifikasi' : 'Notifications'}
              sublabel={lang === 'id' ? 'Peringatan sensor dan status' : 'Sensor warnings and status alerts'}
              active={notif}
              onToggle={() => setNotif(v => !v)}
            />
            <ToggleRow
              icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              label={lang === 'id' ? 'Mode Gelap' : 'Dark Mode'}
              sublabel={theme === 'dark' ? (lang === 'id' ? 'Tampilan gelap aktif' : 'Dark theme active') : (lang === 'id' ? 'Tampilan terang aktif' : 'Light theme active')}
              active={theme === 'dark'}
              onToggle={toggleTheme}
            />
          </div>
        </div>

        {/* ── Bahasa ── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block px-1" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'Bahasa' : 'Language'}
          </span>
          <button
            onClick={toggleLang}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl border transition-all"
            style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
          >
            <div className="flex items-center gap-3">
              <Globe size={16} style={{ color: 'var(--t-muted)' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>
                  {lang === 'id' ? 'Bahasa Antarmuka' : 'Interface Language'}
                </div>
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

        {/* ── Tentang ── */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block px-1" style={{ color: 'var(--t-muted)' }}>
            {lang === 'id' ? 'Tentang Aplikasi' : 'About App'}
          </span>
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}>
            {[
              { label: lang === 'id' ? 'Versi Aplikasi' : 'App Version', value: '1.0.0' },
              { label: lang === 'id' ? 'Perangkat' : 'Device',           value: 'Hydrone ROV' },
              { label: lang === 'id' ? 'Tim' : 'Team',                  value: 'Hydrone' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--t-border)' }}>
                <span className="text-sm" style={{ color: 'var(--t-muted)' }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--t-text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Logout ── */}
        <a
          href="/login"
          className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#EF4444' }}
        >
          <LogOut size={15} />
          {lang === 'id' ? 'Keluar' : 'Log Out'}
        </a>

        <p className="text-center text-[10px] pb-2 font-[family-name:var(--font-jetbrains-mono)]" style={{ color: 'var(--t-muted)', opacity: 0.4 }}>
          Hydrone
        </p>
      </div>
    </div>
  )
}
