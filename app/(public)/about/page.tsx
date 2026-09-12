import AboutSection from '@/components/landing/AboutSection'
import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import VisionMission from '@/components/landing/VisionMission'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang Hydrone | About',
  description: 'Mengenal proyek Hydrone ROV pembersih sungai dan pemantau kualitas air.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <AboutSection />
        <VisionMission />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
