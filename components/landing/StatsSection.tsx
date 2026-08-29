'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/i18n/context'

interface StatItem {
  target: number
  suffix: string
  label: { id: string; en: string }
  sub: { id: string; en: string }
  color: string
  bg: string
}

const STATS: StatItem[] = [
  {
    target: 2,
    suffix: '',
    label: { id: 'Jenis Sampah', en: 'Waste Types' },
    sub: { id: 'Makro + Mikroplastik', en: 'Macro + Microplastic' },
    color: '#1565C0',
    bg: 'bg-blue-50',
  },
  {
    target: 5,
    suffix: ' µm',
    label: { id: 'Ukuran Filter Terkecil', en: 'Smallest Filter Size' },
    sub: { id: 'Teknologi filtrasi presisi', en: 'Precision filtration tech' },
    color: '#00B4D8',
    bg: 'bg-cyan-50',
  },
  {
    target: 10,
    suffix: '',
    label: { id: 'Fitur', en: 'Features' },
    sub: { id: 'Terintegrasi dalam 1 Alat', en: 'Integrated in 1 Device' },
    color: '#43A047',
    bg: 'bg-green-50',
  },
  {
    target: 20,
    suffix: ' m',
    label: { id: 'Jangkauan Kabel Tether', en: 'Tether Cable Range' },
    sub: { id: 'Kendali fleksibel', en: 'Flexible control' },
    color: '#D4A017',
    bg: 'bg-yellow-50',
  },
]

function AnimatedCounter({ target, suffix, color }: { target: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true
          const duration = 1200
          const start = performance.now()

          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-5xl font-black" style={{ color }}>
      {count}
      <span className="text-3xl">{suffix}</span>
    </div>
  )
}

export default function StatsSection() {
  const { lang } = useLang()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} rounded-2xl p-6 text-center shadow-sm border border-gray-100`}
              data-anim
              data-delay={`${i * 100}`}
            >
              <AnimatedCounter target={stat.target} suffix={stat.suffix} color={stat.color} />
              <div className="mt-3 font-bold text-gray-800 text-sm">{stat.label[lang]}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.sub[lang]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
