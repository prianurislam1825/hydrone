'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Lang } from '@/types'
import { translations } from './translations'

// ── Context types ─────────────────────────────────────────────
interface LangContextValue {
  lang: Lang
  toggle: () => void
  setLang: (lang: Lang) => void
}

// ── Context ───────────────────────────────────────────────────
const LangContext = createContext<LangContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  // Load initial lang from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hydrone-lang') as Lang | null
      if (saved === 'id' || saved === 'en') {
        setLangState(saved)
      }
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setLangState(prev => {
      const next = prev === 'id' ? 'en' : 'id'
      try { localStorage.setItem('hydrone-lang', next) } catch {}
      return next
    })
  }, [])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    try { localStorage.setItem('hydrone-lang', newLang) } catch {}
  }, [])

  return (
    <LangContext.Provider value={{ lang, toggle, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

// ── useLang hook ──────────────────────────────────────────────
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return ctx
}

// ── useT hook — access global translations ────────────────────
export function useT() {
  const { lang } = useLang()
  return { t: translations, lang }
}
