import CtaSection from '@/components/landing/CtaSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import PageHeader from '@/components/landing/PageHeader'
import ProductSection from '@/components/landing/ProductSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitur Hydrone | Features',
  description: 'Kemampuan dan fitur unggulan Hydrone ROV dalam mengumpulkan sampah dan menyaring mikroplastik.',
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-[60px]" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <PageHeader
        badge={{ id: 'FITUR TERINTEGRASI', en: 'INTEGRATED FEATURES' }}
        title={{ id: 'Fitur & Kemampuan ROV', en: 'ROV Features & Capabilities' }}
        subtitle={{
          id: 'Satu sistem ROV bawah air dengan 3 misi utama: penangkap makroplastik, filtrasi mikroplastik 5µm, dan monitoring telemetri air real-time.',
          en: 'An integrated underwater ROV with 3 core missions: macroplastic collection, 5µm microplastic filtration, and real-time telemetry monitoring.',
        }}
      />
      <main>
        <FeaturesSection />
        <ProductSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
