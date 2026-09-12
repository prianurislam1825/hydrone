import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import SpecsSection from '@/components/landing/SpecsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spesifikasi Hydrone | Specs',
  description: 'Spesifikasi teknis, ukuran, dan parameter sensor Hydrone ROV.',
}

export default function SpecsPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <SpecsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
