# HYDRONE — AI Coding Instructions

## Project Overview
HYDRONE is a web profile for an autonomous underwater ROV that collects plastic and microplastic waste from rivers, lakes, and coastal waters. Developed by SMA Negeri 1 Surakarta students for IID INNOPA international competition, supported by Mersiflab.

## MANDATORY Tech Stack
- **Framework**: Next.js App Router (NEVER use Pages Router)
- **Language**: TypeScript strict mode — NO `any` type ever
- **Styling**: Tailwind CSS v4 — use `@theme inline` in globals.css, NO tailwind.config.js
- **Icons**: Lucide React ONLY — absolutely NO emoji in UI components
- **Images**: ALWAYS use `next/image`, NEVER `<img>` tag
- **Auth**: next-auth v5 beta — export `{ handlers, auth, signIn, signOut }` from `lib/auth/index.ts`
- **Fonts**: next/font/google (Geist Sans + Geist Mono)

## Architecture Rules

### Route Protection
- Use `proxy.ts` at root (NOT `middleware.ts` — deprecated in Next.js 16)
- Export function named `proxy`, not `middleware`

### Component Rules
- ALL component files: PascalCase (e.g., `HeroSection.tsx`)
- `use client` ONLY when component needs: useState, useEffect, event handlers, browser APIs
- Server components by default — keep `use client` minimal

### i18n (Bilingual ID/EN)
- ALL UI text must be bilingual using this exact pattern:
```typescript
const T = {
  title: { id: 'Judul', en: 'Title' },
  desc:  { id: 'Deskripsi', en: 'Description' },
}
// Usage:
<h1>{T.title[lang]}</h1>
```
- Get language from: `const { lang } = useLang()` — import from `@/lib/i18n/context`
- NEVER hardcode text directly in JSX

### TypeScript Rules
- NO `any` — use `unknown` and narrow with type guards
- Define ALL interfaces in `types/index.ts`
- Import types with `import type { ... }`
- Use `satisfies` operator for const objects with known shapes

### Styling Rules
- Brand colors via Tailwind arbitrary values: `bg-[#0A1628]`
- NO inline `style={{}}` except for dynamic values (animation delays, etc.)
- Mobile-first: start with mobile layout, add `sm:`, `md:`, `lg:` for larger screens
- Touch targets minimum `min-h-[44px]` on all interactive elements

### Animation Rules
- CSS-only animations — NO framer-motion, NO GSAP
- Define keyframes in `globals.css`
- Scroll-reveal via IntersectionObserver + CSS class toggle
- Use `data-anim` attributes for animated elements

### Text Rules
- NO em dash (—) in user-facing text — use comma or period instead
- NO emoji in UI — use Lucide icons
- All text in `T = { id: ..., en: ... }` objects

## File Locations
```
lib/i18n/context.tsx    → LangProvider, useLang(), useT()
lib/i18n/translations.ts → Global translations object
lib/auth/config.ts      → NextAuth configuration
lib/auth/index.ts       → Export handlers, auth, signIn, signOut
lib/config.ts           → getAppConfig(), validateDeviceToken()
types/index.ts          → ALL TypeScript interfaces
proxy.ts                → Route protection (replaces middleware.ts)
```

## HYDRONE Brand Colors
```
Deep Ocean:  #0A1628  (darkest background)
Navy:        #1B3A6B  (sidebar, hero bg)
Ocean Blue:  #1565C0  (primary brand)
Cyan Water:  #00B4D8  (accents, highlights)
Teal:        #0096C7  (mid tone)
Light Aqua:  #90E0EF  (light accents)
Surface:     #CAF0F8  (very light bg)

Green:       #43A047  (safe/eco indicators)
Gold:        #D4A017  (warning/caution)
Red:         #EF4444  (danger)
```

## DO NOT
- Use Pages Router
- Use `middleware.ts` (use `proxy.ts` instead)
- Use `any` TypeScript type
- Use `<img>` tag (use `next/image`)
- Use emoji in UI (use Lucide icons)
- Hardcode text — always bilingual T object
- Use em dash (—) in text
- Install framer-motion or animation libraries
- Use `export default` for layout files that have metadata (use named exports)
