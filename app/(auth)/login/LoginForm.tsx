'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, AlertTriangle, Activity, Wifi, Shield } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useLang } from '@/lib/i18n/context'

function HexPattern() {
  return (
    <div className="absolute inset-0 hex-bg opacity-30 pointer-events-none" />
  )
}

const T = {
  controlCenter: { id: 'Hydrone Control Center', en: 'Hydrone Control Center' },
  panelSub: {
    id: 'Monitor dan kendalikan sistem pembersih sungai secara real-time dari manapun.',
    en: 'Monitor and control the river cleaning system in real-time from anywhere.',
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
  loading: { id: 'Memproses...', en: 'Processing...' },
  footer: {
    id: 'Akses terbatas untuk tim dan mitra resmi HYDRONE',
    en: 'Access restricted to HYDRONE team and official partners',
  },
  devHint: {
    id: 'Mode Lokal: Masukkan email & password apa saja untuk demo.',
    en: 'Local Mode: Enter any email & password for demo.',
  },
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
    <div className="min-h-screen flex font-[family-name:var(--font-inter)]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0D1B3E] flex-col items-center justify-center p-12 overflow-hidden border-r border-[#1E2D50]">
        <HexPattern />
        
        {/* Subtle orange glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1A56DB]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="relative w-28 h-28 mb-8">
            <Image
              src="/pfp-hydrone.png"
              alt="Hydrone Logo"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#F8FAFF] mb-4 font-[family-name:var(--font-space-grotesk)]">
            {T.controlCenter[lang]}
          </h1>
          <p className="text-[#8B9EC7] mb-12 max-w-sm leading-relaxed text-sm">
            {T.panelSub[lang]}
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {T.pills.map((pill, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 bg-[#111827]/80 backdrop-blur-md border border-[#1E2D50] rounded-xl text-[#F8FAFF] text-sm font-medium shadow-lg"
              >
                <div className="text-[#1A56DB]">{pill.icon}</div>
                {pill.label[lang]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-[#F4F7FB] p-6 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Language toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
            >
              <span className={lang === 'id' ? 'font-bold text-[#1A56DB]' : 'text-gray-400'}>ID</span>
              <span className="text-gray-300">/</span>
              <span className={lang === 'en' ? 'font-bold text-[#1A56DB]' : 'text-gray-400'}>EN</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Top accent bar */}
            <div className="flex h-1.5">
              <div className="flex-1 bg-[#1A56DB]" />
              <div className="flex-1 bg-[#F05A22]" />
            </div>

            <div className="p-8 sm:p-10">
              {/* Form header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src="/pfp-hydrone.png"
                    alt="Hydrone Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-space-grotesk)]">
                  {T.formTitle[lang]}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {T.emailLabel[lang]}
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@hydrone.local"
                      required
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {T.passwordLabel[lang]}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#1A56DB] hover:bg-[#1646B8] disabled:bg-[#1A56DB]/60 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#1A56DB]/30 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {T.loading[lang]}
                    </>
                  ) : (
                    T.submit[lang]
                  )}
                </button>
              </form>

              {isDev && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-mono text-center">
                    {T.devHint[lang]}
                  </p>
                </div>
              )}

              <p className="mt-8 text-center text-xs text-gray-400 font-medium">
                {T.footer[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
