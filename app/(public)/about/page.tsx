import AboutSection from '@/components/landing/AboutSection'
import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import PageHeader from '@/components/landing/PageHeader'
import VisionMission from '@/components/landing/VisionMission'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang Hydrone | About',
  description: 'Mengenal proyek Hydrone ROV pembersih sungai dan pemantau kualitas air.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-[60px]" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <PageHeader
        badge={{ id: 'SOLUSI PERAIRAN BERSIH', en: 'CLEAN WATER SOLUTION' }}
        title={{ id: 'Tentang Proyek HYDRONE', en: 'About HYDRONE Project' }}
        subtitle={{
          id: 'Inovasi ROV bawah air otonom karya pelajar Indonesia untuk mendukung perairan bebas sampah plastik dan mikroplastik.',
          en: 'Autonomous underwater ROV innovation by Indonesian students supporting plastic & microplastic free waters.',
        }}
      />
      <main>
        <AboutSection />
        <VisionMission />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
