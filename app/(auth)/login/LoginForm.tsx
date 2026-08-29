'use client'

import { useState, useMemo } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertTriangle, Activity, Wifi, Shield } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useLang } from '@/lib/i18n/context'

// Bubble particles for left panel
function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 14 + 5,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10"
          style={{
            left: b.left,
            bottom: '-30px',
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

const T = {
  controlCenter: { id: 'HYDRONE Control Center', en: 'HYDRONE Control Center' },
  panelSub: {
    id: 'Monitor dan kendalikan sistem pembersih perairan secara real-time',
    en: 'Monitor and control the water cleaning system in real-time',
  },
  pills: [
    { icon: <Activity size={14} />, label: { id: 'Monitor Sensor Real-time', en: 'Real-time Sensor Monitor' } },
    { icon: <Wifi size={14} />, label: { id: 'Koneksi via Tether', en: 'Tether Connection' } },
    { icon: <Shield size={14} />, label: { id: 'Akses Terproteksi', en: 'Protected Access' } },
  ],
  formTitle: { id: 'Masuk ke Dashboard', en: 'Sign in to Dashboard' },
  emailLabel: { id: 'Email', en: 'Email' },
  passwordLabel: { id: 'Password', en: 'Password' },
  submit: { id: 'Masuk ke Dashboard', en: 'Sign in to Dashboard' },
  loading: { id: 'Memuat...', en: 'Loading...' },
  footer: { id: 'Akses terbatas untuk tim dan mitra resmi HYDRONE', en: 'Access restricted to official HYDRONE team and partners' },
  devHint: { id: 'Demo: admin@hydrone.local / hydrone2024', en: 'Demo: admin@hydrone.local / hydrone2024' },
}

export default function LoginForm() {
  const { lang, toggle } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDev = process.env.NODE_ENV === 'development'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email atau password tidak valid.')
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — branding (desktop only) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#0A1628] via-[#1B3A6B] to-[#0A1628] flex-col items-center justify-center p-12">
        <Bubbles />

        {/* Orbit decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="w-96 h-96 rounded-full border-2 border-[#00B4D8] border-dashed" />
          <div className="absolute w-64 h-64 rounded-full border border-[#00B4D8]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-full bg-[#00B4D8]/20 border-2 border-[#00B4D8]/40 flex items-center justify-center mb-6 animate-glow-pulse">
            <span className="text-[#00B4D8] font-black text-3xl">H</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-3">{T.controlCenter[lang]}</h1>
          <p className="text-white/60 mb-10 max-w-xs leading-relaxed">{T.panelSub[lang]}</p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {T.pills.map((pill, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm"
              >
                <span className="text-[#00B4D8]">{pill.icon}</span>
                {pill.label[lang]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          {/* Language toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggle}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className={lang === 'id' ? 'font-bold text-[#1565C0]' : 'text-gray-400'}>ID</span>
              <span className="text-gray-300">/</span>
              <span className={lang === 'en' ? 'font-bold text-[#1565C0]' : 'text-gray-400'}>EN</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tri-color accent bar */}
            <div className="flex h-1">
              <div className="flex-1 bg-[#D4A017]" />
              <div className="flex-1 bg-[#1565C0]" />
              <div className="flex-1 bg-[#43A047]" />
            </div>

            <div className="p-8">
              {/* Form header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-full bg-[#1565C0]/10 border border-[#1565C0]/20 flex items-center justify-center">
                  <span className="text-[#1565C0] font-black text-sm">H</span>
                </div>
                <h2 className="text-xl font-black text-gray-800">{T.formTitle[lang]}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {T.emailLabel[lang]}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@hydrone.local"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all text-sm min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {T.passwordLabel[lang]}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all text-sm min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] flex items-center"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-600 text-sm">{error}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1565C0] to-[#0096C7] hover:from-[#1251A1] hover:to-[#007BA8] disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg min-h-[52px] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {T.loading[lang]}
                    </>
                  ) : (
                    T.submit[lang]
                  )}
                </button>
              </form>

              {/* Dev hint */}
              {isDev && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-mono">{T.devHint[lang]}</p>
                </div>
              )}

              {/* Footer note */}
              <p className="mt-6 text-center text-xs text-gray-400">{T.footer[lang]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
