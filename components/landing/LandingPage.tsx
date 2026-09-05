'use client'

import { useEffect } from 'react'
import AboutSection from './AboutSection'
import CtaSection from './CtaSection'
import FeaturesSection from './FeaturesSection'
import HeroSection from './HeroSection'
import HowItWorks from './HowItWorks'
import LandingFooter from './LandingFooter'
import LandingNav from './LandingNav'
import PartnersSection from './PartnersSection'
import SpecsSection from './SpecsSection'
import StatsSection from './StatsSection'
import TeamSection from './TeamSection'

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
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
