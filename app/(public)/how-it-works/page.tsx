import CtaSection from '@/components/landing/CtaSection'
import HowItWorks from '@/components/landing/HowItWorks'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import PageHeader from '@/components/landing/PageHeader'
import ProductSection from '@/components/landing/ProductSection'
import SpecsSection from '@/components/landing/SpecsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cara Kerja Hydrone | How It Works',
  description: 'Prosedur dan tahap operasi Hydrone ROV dari perakitan hingga pemantauan real-time.',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-[60px]" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <PageHeader
        badge={{ id: 'PROSEDUR OPERASI', en: 'OPERATIONAL PROCEDURE' }}
        title={{ id: 'Cara Kerja & Tahap Operasi', en: 'How It Works & Operating Stages' }}
        subtitle={{
          id: 'Enam tahap komprehensif dari startup sistem, deploy ballast, navigasi 4 thruster, filtrasi 2 tahap, hingga pengiriman telemetri cloud.',
          en: 'Six comprehensive stages from system startup, ballast deployment, 4-thruster navigation, 2-stage filtration, to cloud telemetry ingestion.',
        }}
      />
      <main>
        <HowItWorks />
        <ProductSection />
        <SpecsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
