'use client'

import { useEffect } from 'react'
import AboutSection from './AboutSection'
import CtaSection from './CtaSection'
import FeaturesSection from './FeaturesSection'
import HeroSection from './HeroSection'
import LandingFooter from './LandingFooter'
import LandingNav from './LandingNav'
import PartnersSection from './PartnersSection'
import SpecsSection from './SpecsSection'
import StatsSection from './StatsSection'
import TeamSection from './TeamSection'

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    const elements = document.querySelectorAll('[data-anim]')
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <AboutSection />
        <TeamSection />
        <PartnersSection />
        <SpecsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
