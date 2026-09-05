'use client'

import { useLang } from '@/lib/i18n/context';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 0,   suffix: '%',   label: { id: 'Efektivitas Sterilisasi', en: 'Sterilization Effectiveness' }, target: 96,  decimals: 0, gradient: 'linear-gradient(135deg, #1A56DB, #00B4D8)' },
  { value: 0,   suffix: ' µm', label: { id: 'Presisi Filter',          en: 'Filter Precision' },            target: 0.1, decimals: 1, gradient: 'linear-gradient(135deg, #00B4D8, #22C55E)' },
  { value: 0,   suffix: ' m',  label: { id: 'Jangkauan Tether',        en: 'Tether Range' },                target: 20,  decimals: 0, gradient: 'linear-gradient(135deg, #F05A22, #F59E0B)' },
  { value: 0,   suffix: '/7',  label: { id: 'Monitoring Aktif',        en: 'Active Monitoring' },           target: 24,  decimals: 0, gradient: 'linear-gradient(135deg, #8B5CF6, #1A56DB)' },
]

function AnimatedNumber({ target, decimals, gradient }: { target: number; decimals: number; gradient: string }) {
  const [val, setVal]   = useState(0)
  const ref             = useRef<HTMLSpanElement>(null)
  const triggered       = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !triggered.current) {
        triggered.current = true
        const start = performance.now()
        const dur   = 2000
        const run   = (now: number) => {
          const t    = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          setVal(ease * target)
          if (t < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <span
      ref={ref}
      className="font-extrabold tabular-nums"
      style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: 'var(--font-plus-jakarta)',
      }}
    >
      {val.toFixed(decimals)}
    </span>
  )
}

export default function StatsSection() {
  const { lang } = useLang()

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: 'var(--t-surface)' }}>
      {/* Diagonal stripe accent */}
      <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(26,86,219,0.04) 40%, rgba(26,86,219,0.04) 60%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-6 py-4 relative group"
              data-anim
              data-delay={`${i * 100}`}
            >
              {/* Gradient underline accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-12 transition-all duration-500 rounded-full"
                style={{ background: s.gradient }} />

              <div className="flex items-baseline gap-0.5 mb-1">
                <AnimatedNumber target={s.target} decimals={s.decimals} gradient={s.gradient} />
                <span className="text-xl font-extrabold" style={{
                  background: s.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-plus-jakarta)',
                }}>
                  {s.suffix}
                </span>
              </div>
              <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--t-muted)' }}>
                {s.label[lang]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
