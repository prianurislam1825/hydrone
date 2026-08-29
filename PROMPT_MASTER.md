# HYDRONE — Master Prompt untuk Antigravity / AI Coding

> Copy paste SELURUH isi file ini ke Antigravity sebagai prompt pertama.
> AI akan langsung generate project lengkap dalam sekali jalan.

---

## CONTEXT

Saya ingin membuat web profile untuk proyek HYDRONE menggunakan Next.js.
Semua file konfigurasi sudah disiapkan di project ini:
- `.github/copilot-instructions.md` — standar kode wajib diikuti
- `types/index.ts` — semua TypeScript interfaces sudah ada
- `tsconfig.json`, `.eslintrc.json`, `.prettierrc` — konfigurasi sudah siap
- `.env.example` — template environment variables

Baca semua file konfigurasi di atas sebagai acuan sebelum mulai generate.

---

## PERINTAH UTAMA

Buat web profile HYDRONE lengkap dalam satu project Next.js.
HYDRONE adalah autonomous underwater ROV untuk membersihkan sampah
plastik makro dan mikroplastik di perairan Indonesia.
Dikembangkan oleh tim pelajar SMA Negeri 1 Surakarta untuk kompetisi
IID INNOPA, dengan dukungan bimbingan dari Mersiflab.

---

## YANG HARUS DIBUAT (urutan prioritas)

### FASE 1 — Foundation (buat ini dulu, semuanya)

1. `app/globals.css` — design system dengan @theme inline Tailwind v4
2. `lib/i18n/translations.ts` — semua teks ID/EN
3. `lib/i18n/context.tsx` — LangProvider + useLang()
4. `lib/config.ts` — getAppConfig()
5. `lib/auth/config.ts` — NextAuth Credentials
6. `lib/auth/index.ts` — export handlers, auth, signIn, signOut
7. `proxy.ts` — route protection (bukan middleware.ts)
8. `app/layout.tsx` — root layout dengan providers
9. `app/(public)/layout.tsx` — public group layout
10. `app/(auth)/login/layout.tsx` + `page.tsx` + `LoginForm.tsx`

### FASE 2 — Landing Page Sections (buat semua)

11. `components/landing/LandingNav.tsx`
12. `components/landing/HeroSection.tsx`
13. `components/landing/StatsSection.tsx`
14. `components/landing/AboutSection.tsx`
15. `components/landing/FeaturesSection.tsx`
16. `components/landing/HowItWorks.tsx`
17. `components/landing/ProductSection.tsx`
18. `components/landing/PartnersSection.tsx`
19. `components/landing/TeamSection.tsx`
20. `components/landing/VisionMission.tsx`
21. `components/landing/CtaSection.tsx`
22. `components/landing/LandingFooter.tsx`
23. `components/landing/LandingPage.tsx`
24. `app/(public)/page.tsx`

### FASE 3 — UI Components

25. `components/ui/StatusBadge.tsx`
26. `components/ui/LoadingSkeleton.tsx`
27. `components/ui/EmptyState.tsx`

---

## DESIGN SYSTEM

### Warna Brand HYDRONE
```css
/* Dalam globals.css @theme inline */
--color-deep-ocean:  #0A1628;   /* background terdalam */
--color-navy:        #1B3A6B;   /* sidebar, header bg */
--color-ocean:       #1565C0;   /* primary brand blue */
--color-cyan:        #00B4D8;   /* highlight, accent */
--color-teal:        #0096C7;   /* mid tone */
--color-aqua:        #90E0EF;   /* light accent */
--color-surface:     #CAF0F8;   /* very light bg */
--color-green:       #43A047;   /* safe, eco, nature */
--color-gold:        #D4A017;   /* warning, caution */
--color-danger:      #EF4444;   /* danger, error */
--color-dark:        #0D1B2A;   /* dark text */
```

### Vibe / Aesthetic
- **Tema**: Deep sea, underwater control room, futuristic ocean
- **Background**: Dark navy/ocean gradients
- **Cards**: Dark glass morphism — `bg-white/5 border border-white/10 backdrop-blur`
- **Hero**: Animated bubble particles naik dari bawah (underwater feel)
- **Glow effects**: Cyan/teal glow pada elemen penting
- **Typography**: Geist Sans — bold untuk heading, regular untuk body

### Animasi (CSS only)
Tambahkan keyframes ini di globals.css:
```css
/* Bubble particles naik */
@keyframes bubble-rise {
  0%   { transform: translateY(0) scale(1); opacity: 0.6; }
  100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
}

/* Fade up saat scroll */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Scale in */
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}

/* Glow pulse */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0,180,216,0.3); }
  50%      { box-shadow: 0 0 40px rgba(0,180,216,0.6); }
}

/* Wave horizontal */
@keyframes wave-x {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Float */
@keyframes float-up {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}
```

---

## KONTEN SETIAP SECTION

### 1. NAVBAR
Links: Tentang | Cara Kerja | Produk | Klien | Tim | Visi & Misi
CTA button: "Hubungi Kami" → https://wa.me/6281227917676
Language toggle: ID / EN flag
Mobile: hamburger menu

### 2. HERO SECTION
Background: animated dark ocean gradient + bubble particles naik
Logo: `/public/hydrone-logo.png` (placeholder jika belum ada)
Tagline utama (ID): "Autonomous Underwater Plastic Collector"
Tagline utama (EN): "Autonomous Underwater Plastic Collector"
Sub (ID): "ROV bawah air yang menangkap sampah plastik makro dan
           menyaring mikroplastik hingga 5 mikron dari perairan Indonesia."
Sub (EN): "An underwater ROV that captures macroplastic waste and
           filters microplastics down to 5 microns from Indonesian waters."
CTA 1: "Hubungi Kami" → WA (gold button)
CTA 2: "Cara Kerjanya" → #cara-kerja (outline button)
Floating sensor cards (animatif):
  - Turbidity: 12 NTU — Clear
  - TDS: 180 ppm — Safe
  - Suhu: 28.4°C — Normal
  - GPS: -7.5561, 110.8316

Tagline bawah: "Dive. Collect. Protect."

### 3. STATS SECTION
Background putih/light
4 stat dengan animated counter saat scroll:
  - 2 Jenis Sampah     → "Makro + Mikroplastik"
  - 5 µm               → "Ukuran Filter Terkecil"
  - 10 Fitur           → "Terintegrasi dalam 1 Alat"
  - 20 Meter           → "Jangkauan Kabel Tether"

### 4. ABOUT SECTION
Background: very light (surface color)
Label section (ID): "Apa itu HYDRONE?"
Label section (EN): "What is HYDRONE?"
Heading (ID): "Robot Bawah Air yang Membersihkan Perairan dari Dalam"
Heading (EN): "An Underwater Robot That Cleans Waters From Within"

Paragraf 1 (ID): "HYDRONE adalah robot pembersih perairan bawah air yang
dirancang untuk mengatasi dua masalah sekaligus: sampah plastik besar yang
terlihat mata, dan mikroplastik berbahaya yang tersebar di dalam air."
Paragraf 1 (EN): "HYDRONE is an underwater water-cleaning robot designed
to tackle two problems at once: large visible plastic waste, and dangerous
microplastics scattered throughout the water."

Paragraf 2 (ID): "Berbeda dari alat pembersih konvensional yang hanya
bekerja di permukaan, HYDRONE beroperasi di bawah air menggunakan sistem
daya apung adaptif, sehingga bisa menjangkau polutan yang tidak terlihat
dari atas."
Paragraf 2 (EN): "Unlike conventional cleaners that only work on the
surface, HYDRONE operates underwater using an adaptive buoyancy system,
reaching pollutants invisible from above."

Paragraf 3 (ID): "Semua data kualitas air dikirim secara real-time ke
dashboard, menghasilkan peta pencemaran yang bisa digunakan pemerintah
dan peneliti."
Paragraf 3 (EN): "All water quality data is sent in real-time to a
dashboard, producing pollution maps usable by governments and researchers."

4 Pillar Cards:
  1. Icon: AnchorIcon   | ID: "Bekerja Di Bawah Air"    | EN: "Operates Underwater"
  2. Icon: Fish          | ID: "Tangkap Plastik Makro"   | EN: "Captures Macroplastic"
  3. Icon: Filter        | ID: "Filter Mikroplastik 5µm" | EN: "5µm Microplastic Filter"
  4. Icon: Activity      | ID: "Monitor Kualitas Air"    | EN: "Water Quality Monitor"

Visual kanan: lingkaran orbit dengan logo HYDRONE di tengah
+ floating bubble cards menunjukkan sensor readings

### 5. FEATURES SECTION (6 cards)
Background: dark navy

| # | Icon Lucide | Judul ID | Judul EN | Desc ID | Desc EN |
|---|---|---|---|---|---|
| 1 | Network | Jaring Penangkap Pasif | Passive Deployable Net | Jaring nilon mengembang otomatis saat HYDRONE bergerak maju, menangkap botol, kantong, dan plastik besar tanpa mekanisme aktif tambahan. | A nylon net automatically deploys as HYDRONE moves forward, capturing bottles, bags, and large plastics without additional active mechanisms. |
| 2 | Droplets | Suction Mikroplastik 2 Tahap | Dual-Stage Microplastic Suction | Pompa DC menyedot air melalui dua tahap filtrasi berurutan yaitu filter 10 mikron lalu 5 mikron, menangkap partikel mikroplastik halus. | A DC pump draws water through two sequential filtration stages, 10 micron then 5 micron filters, capturing fine microplastic particles. |
| 3 | ArrowUpDown | Sistem Daya Apung Adaptif | Adaptive Buoyancy System | Ballast chamber yang bisa diisi atau dikosongkan otomatis memungkinkan HYDRONE menyelam, hover, dan naik tanpa intervensi manual. | A ballast chamber that fills or empties automatically allows HYDRONE to dive, hover, and surface without manual intervention. |
| 4 | Navigation | Propulsi Pivot 6 Arah | 6-Direction Pivot Propulsion | Dua thruster brushless yang bisa berotasi memberi kemampuan gerak maju, mundur, belok, naik, dan turun hanya dengan dua motor. | Two pivoting brushless thrusters provide forward, reverse, turning, rising, and diving movement with just two motors. |
| 5 | Gauge | Monitor Kualitas Air Real-time | Real-Time Water Quality Monitor | Sensor turbidity, TDS, suhu, pH, dan GPS mencatat kondisi air secara terus-menerus dan mengirim data ke dashboard web. | Turbidity, TDS, temperature, pH, and GPS sensors continuously record water conditions and send data to a web dashboard. |
| 6 | Joystick | Dua Mode Operasi | Dual Operation Mode | Bisa dioperasikan secara otonom menggunakan sensor, atau dikendalikan manual oleh operator melalui kabel tether 20 meter. | Operates autonomously using sensors, or manually controlled by an operator through a 20-meter tether cable. |

### 6. HOW IT WORKS (4 langkah)
Background: light surface

Langkah 1 — Icon: PlaneTakeoff
  ID: "Deploy ke Perairan"
  EN: "Deploy to Water"
  Desc ID: "HYDRONE diturunkan ke sungai, danau, atau perairan pesisir yang akan dibersihkan."
  Desc EN: "HYDRONE is lowered into the river, lake, or coastal water to be cleaned."

Langkah 2 — Icon: Navigation
  ID: "Navigasi ke Area Tercemar"
  EN: "Navigate to Polluted Area"
  Desc ID: "Thruster menggerakkan HYDRONE menuju titik pencemaran secara otonom atau via kendali manual."
  Desc EN: "Thrusters move HYDRONE toward pollution hotspots autonomously or via manual control."

Langkah 3 — Icon: Filter
  ID: "Tangkap dan Saring"
  EN: "Collect and Filter"
  Desc ID: "Jaring menangkap plastik besar, sementara pompa suction menyaring mikroplastik secara bersamaan."
  Desc EN: "The net captures large plastics while the suction pump filters microplastics simultaneously."

Langkah 4 — Icon: BarChart3
  ID: "Monitor dan Kirim Data"
  EN: "Monitor and Transmit Data"
  Desc ID: "Sensor mencatat kualitas air real-time dan mengirim data ke dashboard untuk analisis pencemaran."
  Desc EN: "Sensors record real-time water quality and send data to the dashboard for pollution analysis."

Hasil banner (ID): "Hasilnya: Air Lebih Bersih dan Data Pencemaran Terverifikasi"
Hasil banner (EN): "Result: Cleaner Water and Verified Pollution Data"

### 7. PRODUCT SECTION
Background: putih

Label (ID): "Produk Kami" | (EN): "Our Product"
Nama: HYDRONE ROV
Tagline: "Dive. Collect. Protect."
Sub (ID): "Bawah Air · Otonom · Monitor Real-time"
Sub (EN): "Underwater · Autonomous · Real-time Monitoring"

Deskripsi (ID): "Sistem pembersih perairan terintegrasi yang menangani sampah plastik
makro dan mikroplastik sekaligus, dilengkapi monitoring kualitas air real-time dan
kemampuan operasi ganda otonom maupun manual."
Deskripsi (EN): "An integrated water cleaning system handling both macroplastic and
microplastic simultaneously, with real-time water quality monitoring and dual
autonomous or manual operation capability."

8 fitur included (CheckCircle icon):
  ID: Tangkap plastik makro dengan jaring pasif
  ID: Saring mikroplastik hingga 5 mikron
  ID: Sistem daya apung adaptif otomatis
  ID: Propulsi 6 arah dengan pivot thruster
  ID: Monitor kualitas air real-time
  ID: Dua mode: otonom dan manual
  ID: Kamera bawah air + pencahayaan LED
  ID: Dashboard web + penyimpanan data cloud

  EN: Capture macroplastic with passive net
  EN: Filter microplastics down to 5 microns
  EN: Automatic adaptive buoyancy system
  EN: 6-direction movement with pivot thrusters
  EN: Real-time water quality monitoring
  EN: Dual mode: autonomous and manual
  EN: Underwater camera + LED lighting
  EN: Web dashboard + cloud data storage

2 mode badges:
  Otonom: "ESP32 + sensor navigasi otomatis" / "ESP32 + automatic sensor navigation"
  Manual: "Kendali via kabel tether 20m" / "Control via 20m tether cable"

CTA: "Hubungi Kami" → WA (green WhatsApp button)

Floating cards:
  - Turbidity: 12 NTU (Clear)
  - Depth: 1.2 m

### 8. PARTNERS SECTION
Background: putih
4 logo mitra (gunakan placeholder jika file belum ada):
  1. SMA Negeri 1 Surakarta  → /public/partners/sman1-solo.png
  2. IID INNOPA               → /public/partners/innopa.png
  3. Mersiflab                → /public/partners/mersiflab.png
  4. (kosongkan / "Mitra 4")  → placeholder

Tagline bawah (ID): "Bersama membangun solusi perairan bersih untuk Indonesia"
Tagline bawah (EN): "Together building clean water solutions for Indonesia"

### 9. TEAM SECTION
Background: dark navy (berbeda dengan section lain untuk variasi)
Heading (ID): "Tim di Balik HYDRONE"
Heading (EN): "The Team Behind HYDRONE"
Sub (ID): "Pelajar SMA Negeri 1 Surakarta yang berinovasi untuk lingkungan perairan"
Sub (EN): "Students from SMA Negeri 1 Surakarta innovating for aquatic environments"

Data tim LENGKAP (sudah final, jangan diganti placeholder):

KETUA TIM:
  name: "Marsya Razanah Khansa"
  title: "Project Leader"
  role: { id: "Ketua Tim", en: "Team Leader" }
  desc: {
    id: "Memimpin seluruh visi dan pengembangan HYDRONE dari konsep hingga implementasi lapangan.",
    en: "Leads the entire vision and development of HYDRONE from concept to field implementation."
  }
  photo: null  // ganti dengan '/team/marsya.jpg' setelah foto tersedia
  color: "#D4A017"
  wa: "https://wa.me/6281227917676"
  ig: "https://www.instagram.com/[username_marsya]"
  email: "marsyarazanah10@gmail.com"
  leader: true

ANGGOTA 1:
  name: "Farid Wimbadi Nugraha"
  title: "Hardware Engineer"
  role: { id: "Insinyur Perangkat Keras", en: "Hardware Engineer" }
  desc: {
    id: "Bertanggung jawab atas desain dan implementasi sistem mekanik ROV, termasuk thruster, buoyancy, dan struktur badan alat.",
    en: "Responsible for designing and implementing the ROV mechanical systems, including thrusters, buoyancy, and body structure."
  }
  photo: null
  color: "#1565C0"
  wa: "https://wa.me/6285868383180"
  ig: "https://www.instagram.com/[username_farid]"
  email: "f.wimbadi@gmail.com"

ANGGOTA 2:
  name: "Evan Fadillah Nur Santosa"
  title: "Software Engineer"
  role: { id: "Insinyur Perangkat Lunak", en: "Software Engineer" }
  desc: {
    id: "Mengembangkan firmware ESP32, sistem kendali Arduino, dan dashboard web untuk monitoring real-time.",
    en: "Develops ESP32 firmware, Arduino control systems, and the web dashboard for real-time monitoring."
  }
  photo: null
  color: "#43A047"
  wa: "https://wa.me/6281228662047"
  ig: "https://www.instagram.com/[username_evan]"
  email: "evanfadillah445@gmail.com"

ANGGOTA 3:
  name: "Raisa Qarira Santosa"
  title: "Research Officer"
  role: { id: "Penanggung Jawab Riset", en: "Research Officer" }
  desc: {
    id: "Memimpin penelitian dampak mikroplastik, analisis data kualitas air, dan dokumentasi ilmiah untuk kompetisi.",
    en: "Leads microplastic impact research, water quality data analysis, and scientific documentation for competitions."
  }
  photo: null
  color: "#00B4D8"
  wa: "https://wa.me/6285727178769"
  ig: "https://www.instagram.com/[username_raisa]"
  email: "raisasa.qs@gmail.com"

ANGGOTA 4:
  name: "Dzikron Zaidan Ahmad"
  title: "Systems Integrator"
  role: { id: "Integrator Sistem", en: "Systems Integrator" }
  desc: {
    id: "Mengintegrasikan seluruh subsistem HYDRONE mulai dari sensor, elektronik, hingga sistem komunikasi tether.",
    en: "Integrates all HYDRONE subsystems from sensors and electronics to the tether communication system."
  }
  photo: null
  color: "#9C27B0"
  wa: "https://wa.me/6281548158100"
  ig: "https://www.instagram.com/[username_dzikron]"
  email: "dzikronzaidan@gmail.com"

Setiap kartu tim wajib menampilkan:
- Avatar placeholder (lingkaran berwarna dengan icon User dari Lucide) atau foto jika ada
- Badge title (Project Leader / Hardware Engineer / dll)
- Nama lengkap
- Role bilingual
- Deskripsi singkat
- Tombol: WA (hijau) + IG (pink) + Email (biru)

NOTE untuk developer:
// Untuk menambah foto: simpan ke /public/team/marsya.jpg
// Ubah photo: null menjadi photo: '/team/marsya.jpg'

### 10. VISION & MISSION
Background: putih

Label: "Visi & Misi" / "Vision & Mission"
Heading (ID): "Mengapa HYDRONE Ada?"
Heading (EN): "Why Does HYDRONE Exist?"

VISI (card dark ocean gradient):
  Icon: Eye (Lucide)
  (ID): "Perairan Indonesia Bebas Sampah Plastik dan Mikroplastik"
  (EN): "Indonesian Waters Free from Plastic Waste and Microplastics"
  Desc (ID): "Kami percaya setiap sungai, danau, dan perairan pesisir Indonesia berhak bersih dari ancaman plastik yang merusak ekosistem dan mengancam kesehatan manusia."
  Desc (EN): "We believe every river, lake, and coastal water in Indonesia deserves to be free from plastic threats that destroy ecosystems and endanger human health."

MISI (5 poin, card light bg):
  Icon: Target (Lucide) untuk header
  Icon: CheckCircle2 per item

  1. ID: Membersihkan sampah plastik makro dari perairan sebelum terfragmentasi menjadi mikroplastik.
     EN: Clean macroplastic waste from water bodies before they fragment into microplastics.

  2. ID: Menyaring mikroplastik berukuran hingga 5 mikron yang sudah tersebar di kolom air.
     EN: Filter microplastics down to 5 microns already dispersed throughout the water column.

  3. ID: Menghasilkan data kualitas air real-time untuk mendukung penelitian dan kebijakan lingkungan.
     EN: Generate real-time water quality data to support environmental research and policy.

  4. ID: Mengembangkan teknologi pembersih perairan yang terjangkau dan dapat digunakan secara luas.
     EN: Develop affordable water cleaning technology that can be widely deployed.

  5. ID: Berkontribusi pada SDG 6, 12, dan 14 melalui inovasi teknologi berbasis data.
     EN: Contribute to SDG 6, 12, and 14 through data-driven technological innovation.

### 11. CTA SECTION
Background: dark ocean gradient (dark dan dramatis)

Heading (ID): "Tertarik Berkolaborasi?"
Heading (EN): "Interested in Collaborating?"
Sub (ID): "Kami terbuka untuk kemitraan, sponsorship, dan kolaborasi riset bersama HYDRONE. Hubungi kami sekarang."
Sub (EN): "We are open to partnerships, sponsorships, and research collaboration with HYDRONE. Contact us now."

2 tombol:
  1. "Chat WhatsApp" → https://wa.me/6281227917676 (WA Marsya - Ketua) (green)
  2. "Kirim Email" → mailto:marsyarazanah10@gmail.com (outline)

Tech tags: ROV Bawah Air | Filter 5µm | ESP32 IoT | Dual Mode | IID INNOPA

### 12. FOOTER
Background: #0A1628 (deepest dark)
Tri-color top border: gold | ocean blue | green

Kolom 1 — Brand:
  Logo + nama HYDRONE
  Sub: "Autonomous Underwater Plastic Collector"
  Deskripsi singkat
  Kontak: WA, Email, Instagram
  Indicator: "Sistem Aktif" dengan pulse dot

Kolom 2 — Navigasi:
  Beranda, Tentang, Fitur, Produk, Tim, Visi & Misi

Kolom 3 — Kompetisi:
  IID INNOPA
  SMA Negeri 1 Surakarta
  Mersiflab
  (link ke website masing-masing jika ada)

Kontak footer:
  WA:    https://wa.me/6281227917676 (Marsya — Ketua Tim)
  Email: marsyarazanah10@gmail.com
  IG:    [username_marsya — isi setelah konfirmasi]

Bottom: Copyright © 2025 HYDRONE | SMA Negeri 1 Surakarta | IID INNOPA

---

## HALAMAN LOGIN (/login)

### Layout
Desktop: split 50/50 (kiri branding, kanan form)
Mobile: single card full-screen

### Panel Kiri (desktop only)
Background: dark ocean gradient animatif + bubble particles
Logo HYDRONE besar (80px) dengan glow effect
Heading: "HYDRONE Control Center"
Sub: "Monitor dan kendalikan sistem pembersih perairan secara real-time"
3 feature pills dengan icon:
  - Activity  | "Monitor Sensor Real-time"
  - Wifi      | "Koneksi via Tether"
  - Shield    | "Akses Terproteksi"

Decorative: lingkaran orbit animasi + sensor value bubbles

### Panel Kanan / Form
Card dengan shadow
Header: Logo kecil + "Masuk ke Dashboard" / "Sign in to Dashboard"
Tri-color accent bar di atas card (gold | blue | green)

Field Email:
  label: "Email" | placeholder: "admin@hydrone.local"
  icon: Mail (Lucide) di dalam field

Field Password:
  label: "Password" | placeholder: "••••••••"
  icon: Lock (Lucide) + show/hide toggle (Eye/EyeOff)

Error message: AlertTriangle icon + pesan merah

Submit button:
  ID: "Masuk ke Dashboard"
  EN: "Sign in to Dashboard"
  Style: ocean blue gradient + full width + loading spinner

Footer note:
  ID: "Akses terbatas untuk tim dan mitra resmi HYDRONE"
  EN: "Access restricted to official HYDRONE team and partners"

Dev hint (NODE_ENV=development only):
  "Demo: admin@hydrone.local / hydrone2024"

### Auth Logic
APP_MODE=local: terima kredensial APAPUN (demo mode)
APP_MODE=cloud: validasi email + password via database

---

## ATURAN KODE WAJIB

```typescript
// WAJIB: Semua teks dalam format bilingual
const T = {
  title: { id: 'Judul', en: 'Title' },
}
// Usage: <h1>{T.title[lang]}</h1>

// WAJIB: useLang() untuk ambil bahasa
const { lang, toggle } = useLang()

// WAJIB: next/image untuk semua gambar
import Image from 'next/image'
<Image src="/hydrone-logo.png" alt="HYDRONE" width={80} height={80} />

// WAJIB: Lucide icons (bukan emoji)
import { Droplets, Filter, Navigation } from 'lucide-react'

// DILARANG: any type
// DILARANG: <img> tag
// DILARANG: emoji di UI
// DILARANG: teks hardcode (harus di T object)
// DILARANG: em dash (—) dalam teks user-facing
```

---

## PACKAGE.JSON MINIMAL

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "5.0.0-beta.32",
    "lucide-react": "^0.400.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5",
    "eslint": "^9",
    "eslint-config-next": "^15",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.6"
  }
}
```

---

## SETELAH GENERATE SELESAI

Jalankan:
```bash
npm install
npm run dev
```

Login demo:
- Email: admin@hydrone.local
- Password: hydrone2024 (atau apa saja di local mode)

Buka http://localhost:3000 untuk melihat hasil.

---

## DATA YANG PERLU DIISI MANUAL SETELAH GENERATE

Cari dan ganti di seluruh project:
- `[username_marsya]`  → Instagram handle Marsya
- `[username_farid]`   → Instagram handle Farid
- `[username_evan]`    → Instagram handle Evan
- `[username_raisa]`   → Instagram handle Raisa
- `[username_dzikron]` → Instagram handle Dzikron

Upload file ke /public/:
- `hydrone-logo.png`          → Logo HYDRONE
- `team/marsya.jpg`           → Foto Marsya
- `team/farid.jpg`            → Foto Farid
- `team/evan.jpg`             → Foto Evan
- `team/raisa.jpg`            → Foto Raisa
- `team/dzikron.jpg`          → Foto Dzikron
- `partners/sman1-solo.png`   → Logo SMA Negeri 1 Surakarta
- `partners/innopa.png`       → Logo IID INNOPA
- `partners/mersiflab.png`    → Logo Mersiflab

Semua data kontak (WA, email) sudah final dan tidak perlu diganti.
