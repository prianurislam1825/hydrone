'use client'

import { useLang } from '@/lib/i18n/context';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 500, suffix: 'mm', label: { id: 'Panjang Badan', en: 'Body Length' } },
  { value: 4, suffix: '', label: { id: 'Thruster', en: 'Thrusters' } },
  { value: 0.1, suffix: 'µm', label: { id: 'Presisi Filter', en: 'Filter Precision' }, decimals: 1 },
  { value: 20, suffix: 'm', label: { id: 'Jangkauan Tether', en: 'Tether Range' } },
]

function AnimatedNumber({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !triggered.current) {
          triggered.current = true
          const start = performance.now()
          const dur = 1800
          const animate = (now: number) => {
            const t = Math.min((now - start) / dur, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            setVal(ease * target)
            if (t < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <span ref={ref} className="font-[family-name:var(--font-space-grotesk)] font-bold text-5xl sm:text-6xl" style={{ color: 'var(--t-text)' }}>
      {val.toFixed(decimals)}
    </span>
  )
}

export default function StatsSection() {
  const { lang } = useLang()

  return (
    <section className="py-16" style={{ background: 'var(--t-surface)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center" data-anim data-delay={`${i * 100}`}>
              <div className="flex items-baseline justify-center gap-1">
                <AnimatedNumber target={s.value} decimals={s.decimals ?? 0} />
                <span className="text-[#1A56DB] font-bold text-xl">{s.suffix}</span>
              </div>
              <span className="text-xs uppercase tracking-widest mt-2 block" style={{ color: 'var(--t-muted)' }}>
                {s.label[lang]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
