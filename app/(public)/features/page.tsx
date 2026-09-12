import CtaSection from '@/components/landing/CtaSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import ProductSection from '@/components/landing/ProductSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitur Hydrone | Features',
  description: 'Kemampuan dan fitur unggulan Hydrone ROV dalam mengumpulkan sampah dan menyaring mikroplastik.',
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <FeaturesSection />
        <ProductSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
