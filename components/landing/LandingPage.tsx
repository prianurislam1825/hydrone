'use client'

import { useEffect } from 'react'
import LandingNav from './LandingNav'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import StatsSection from './StatsSection'
import AboutSection from './AboutSection'
import TeamSection from './TeamSection'
import PartnersSection from './PartnersSection'
import SpecsSection from './SpecsSection'
import CtaSection from './CtaSection'
import LandingFooter from './LandingFooter'

export default function LandingPage() {
  useEffect(() => {
    // Intersection Observer for scroll reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Optional: stop observing once animated
            // observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    const elements = document.querySelectorAll('[data-anim]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0D1B3E] text-[#F8FAFF]">
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
