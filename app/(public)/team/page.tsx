import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import PartnersSection from '@/components/landing/PartnersSection'
import TeamSection from '@/components/landing/TeamSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tim Hydrone | Our Team',
  description: 'Profil tim pelajar dan mitra di balik pengembangan proyek Hydrone.',
}

export default function TeamPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <main>
        <TeamSection />
        <PartnersSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
