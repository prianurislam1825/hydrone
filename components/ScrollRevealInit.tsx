'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ScrollRevealInit() {
  const pathname = usePathname()

  useEffect(() => {
    const observeElements = () => {
      const elements = document.querySelectorAll('[data-anim]')
      if (!elements.length) return

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
      )

      elements.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('visible')
        } else {
          observer.observe(el)
        }
      })
    }

    observeElements()
    const t1 = setTimeout(observeElements, 100)
    const t2 = setTimeout(() => {
      // Safety fallback: ensure all animated elements become visible so content is never blank
      document.querySelectorAll('[data-anim]').forEach(el => el.classList.add('visible'))
    }, 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname])

  return null
}
