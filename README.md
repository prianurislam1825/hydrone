# HYDRONE — Autonomous Underwater Plastic & Microplastic Collection System

> ROV bawah air untuk membersihkan sampah plastik makro dan mikroplastik di perairan Indonesia.
> Dikembangkan oleh tim pelajar SMA Negeri 1 Surakarta untuk kompetisi IID INNOPA, dengan dukungan Mersiflab.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15+ App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React (NO emoji di UI) |
| Auth | next-auth v5 beta (Credentials) |
| Image | next/image semua gambar |
| i18n | Custom hook useLang() — ID / EN |

---

## Struktur Folder

```
app/
  (public)/page.tsx          ← Landing page utama
  (auth)/login/page.tsx      ← Halaman login
  layout.tsx
  globals.css

components/
  landing/                   ← Semua section landing page
    LandingNav.tsx
    HeroSection.tsx
    StatsSection.tsx
    AboutSection.tsx
    FeaturesSection.tsx
    HowItWorks.tsx
    ProductSection.tsx
    PartnersSection.tsx
    TeamSection.tsx
    VisionMission.tsx
    CtaSection.tsx
    LandingFooter.tsx
    LandingPage.tsx
  ui/                        ← Komponen reusable
    StatusBadge.tsx
    LoadingSkeleton.tsx
    EmptyState.tsx

lib/
  i18n/
    context.tsx              ← LangProvider + useLang()
    translations.ts          ← Semua teks ID/EN
  auth/
    config.ts                ← NextAuth config
    index.ts
  config.ts                  ← App config (mode, env)

types/
  index.ts                   ← Semua TypeScript interfaces

proxy.ts                     ← Route protection (Next.js 16 middleware replacement)
```

---

## Menjalankan Lokal

```bash
npm install
npm run dev
# Buka http://localhost:3000
```

Login demo (APP_MODE=local):
- Email: admin@hydrone.local
- Password: hydrone2024

---

## Environment Variables

Salin `.env.example` ke `.env.local` dan isi:

```bash
cp .env.example .env.local
```

---

## Fitur Utama

- Landing page animatif dengan underwater theme
- Bilingual ID/EN dengan toggle di navbar
- Halaman login dengan branding HYDRONE
- Mobile-first responsive
- Scroll-reveal animations (CSS only)
- Dark ocean design system

---

## Konvensi Kode

- Semua file komponen: `PascalCase`
- Semua teks UI dalam objek: `{ id: '...', en: '...' }`
- Tidak ada emoji di UI — gunakan Lucide icons
- Tidak ada `any` di TypeScript
- Semua gambar via `next/image`
- `use client` hanya jika benar-benar perlu interaktivitas
