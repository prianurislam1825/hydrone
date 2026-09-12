import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import PageHeader from '@/components/landing/PageHeader'
import ProductSection from '@/components/landing/ProductSection'
import SpecsSection from '@/components/landing/SpecsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spesifikasi Hydrone | Specs',
  description: 'Spesifikasi teknis, ukuran, dan parameter sensor Hydrone ROV.',
}

export default function SpecsPage() {
  return (
    <div className="min-h-screen pt-[60px]" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <PageHeader
        badge={{ id: 'PARAMETER & METRIK', en: 'PARAMETERS & METRICS' }}
        title={{ id: 'Spesifikasi Teknis ROV', en: 'ROV Technical Specifications' }}
        subtitle={{
          id: 'Detail dimensi, sistem propulsi, material badan, kapasitas filter mikroplastik, serta arsitektur elektronik ESP32.',
          en: 'Dimensions, propulsion system, chassis material, microplastic filter capacity, and ESP32 electronics architecture details.',
        }}
      />
      <main>
        <SpecsSection />
        <ProductSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
