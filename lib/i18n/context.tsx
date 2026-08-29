'use client'

import { createContext, useCallback, useContext, useState } from 'react'
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
  const [lang, setLangState] = useState<Lang>('id')

  const toggle = useCallback(() => {
    setLangState(prev => (prev === 'id' ? 'en' : 'id'))
  }, [])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
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
