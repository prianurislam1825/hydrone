import ScrollRevealInit from '@/components/ScrollRevealInit'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollRevealInit />
      {children}
    </>
  )
}
