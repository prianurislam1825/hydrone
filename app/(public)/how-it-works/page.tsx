import CtaSection from '@/components/landing/CtaSection'
import HowItWorks from '@/components/landing/HowItWorks'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cara Kerja Hydrone | How It Works',
  description: 'Prosedur dan tahap operasi Hydrone ROV dari perakitan hingga pemantauan real-time.',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <HowItWorks />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
