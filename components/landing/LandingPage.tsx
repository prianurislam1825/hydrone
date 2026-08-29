'use client'

import { useEffect } from 'react'

// Scroll reveal observer — initializes data-anim elements
function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-anim]')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = (entry.target as HTMLElement).dataset.delay ?? '0'
            setTimeout(() => {
              entry.target.classList.add('visible')
            }, parseInt(delay))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}

import LandingNav from './LandingNav'
import HeroSection from './HeroSection'
import StatsSection from './StatsSection'
import AboutSection from './AboutSection'
import FeaturesSection from './FeaturesSection'
import HowItWorks from './HowItWorks'
import ProductSection from './ProductSection'
import PartnersSection from './PartnersSection'
import TeamSection from './TeamSection'
import VisionMission from './VisionMission'
import CtaSection from './CtaSection'
import LandingFooter from './LandingFooter'

export default function LandingPage() {
  return (
    <>
      <ScrollReveal />
      <LandingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorks />
        <ProductSection />
        <PartnersSection />
        <TeamSection />
        <VisionMission />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  )
}
