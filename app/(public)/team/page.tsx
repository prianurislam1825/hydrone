import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'
import PageHeader from '@/components/landing/PageHeader'
import PartnersSection from '@/components/landing/PartnersSection'
import TeamSection from '@/components/landing/TeamSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tim Hydrone | Our Team',
  description: 'Profil tim pelajar dan mitra di balik pengembangan proyek Hydrone.',
}

export default function TeamPage() {
  return (
    <div className="min-h-screen pt-[60px]" style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}>
      <LandingNav />
      <PageHeader
        badge={{ id: 'INOVATOR MUDA INDONESIA', en: 'INDONESIAN YOUNG INNOVATORS' }}
        title={{ id: 'Tim Pelajar & Mitra HYDRONE', en: 'HYDRONE Student Team & Partners' }}
        subtitle={{
          id: 'Profil tim pengembang dari SMAN 1 Surakarta & SMA Muhammadiyah PK, beserta dukungan mitra riset.',
          en: 'Developer team profile from SMAN 1 Surakarta & SMA Muhammadiyah PK, supported by research partners.',
        }}
      />
      <main>
        <TeamSection />
        <PartnersSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
