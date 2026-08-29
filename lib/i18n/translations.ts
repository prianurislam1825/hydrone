// ─────────────────────────────────────────────────────────────
//  HYDRONE — Complete bilingual translations (ID / EN)
// ─────────────────────────────────────────────────────────────

export const translations = {
  nav: {
    about: { id: 'Tentang', en: 'About' },
    howItWorks: { id: 'Cara Kerja', en: 'How It Works' },
    product: { id: 'Produk', en: 'Product' },
    partners: { id: 'Klien', en: 'Partners' },
    team: { id: 'Tim', en: 'Team' },
    visionMission: { id: 'Visi & Misi', en: 'Vision & Mission' },
    contact: { id: 'Hubungi Kami', en: 'Contact Us' },
  },
  hero: {
    tagline: { id: 'Autonomous Underwater Plastic Collector', en: 'Autonomous Underwater Plastic Collector' },
    sub: {
      id: 'ROV bawah air yang menangkap sampah plastik makro dan menyaring mikroplastik hingga 5 mikron dari perairan Indonesia.',
      en: 'An underwater ROV that captures macroplastic waste and filters microplastics down to 5 microns from Indonesian waters.',
    },
    cta1: { id: 'Hubungi Kami', en: 'Contact Us' },
    cta2: { id: 'Cara Kerjanya', en: 'How It Works' },
    slogan: { id: 'Dive. Collect. Protect.', en: 'Dive. Collect. Protect.' },
    sensors: {
      turbidity: { id: 'Turbidity', en: 'Turbidity' },
      turbidityStatus: { id: 'Jernih', en: 'Clear' },
      tds: { id: 'TDS', en: 'TDS' },
      tdsStatus: { id: 'Aman', en: 'Safe' },
      temp: { id: 'Suhu', en: 'Temperature' },
      tempStatus: { id: 'Normal', en: 'Normal' },
      gps: { id: 'GPS', en: 'GPS' },
    },
  },
  stats: {
    heading: { id: 'HYDRONE dalam Angka', en: 'HYDRONE by the Numbers' },
    items: [
      {
        value: '2',
        suffix: '',
        label: { id: 'Jenis Sampah', en: 'Waste Types' },
        sub: { id: 'Makro + Mikroplastik', en: 'Macro + Microplastic' },
      },
      {
        value: '5',
        suffix: ' µm',
        label: { id: 'Ukuran Filter Terkecil', en: 'Smallest Filter Size' },
        sub: { id: 'Teknologi filtrasi presisi', en: 'Precision filtration tech' },
      },
      {
        value: '10',
        suffix: '',
        label: { id: 'Fitur', en: 'Features' },
        sub: { id: 'Terintegrasi dalam 1 Alat', en: 'Integrated in 1 Device' },
      },
      {
        value: '20',
        suffix: ' m',
        label: { id: 'Jangkauan Kabel Tether', en: 'Tether Cable Range' },
        sub: { id: 'Kendali fleksibel', en: 'Flexible control' },
      },
    ],
  },
  about: {
    sectionLabel: { id: 'Apa itu HYDRONE?', en: 'What is HYDRONE?' },
    heading: {
      id: 'Robot Bawah Air yang Membersihkan Perairan dari Dalam',
      en: 'An Underwater Robot That Cleans Waters From Within',
    },
    p1: {
      id: 'HYDRONE adalah robot pembersih perairan bawah air yang dirancang untuk mengatasi dua masalah sekaligus: sampah plastik besar yang terlihat mata, dan mikroplastik berbahaya yang tersebar di dalam air.',
      en: 'HYDRONE is an underwater water-cleaning robot designed to tackle two problems at once: large visible plastic waste, and dangerous microplastics scattered throughout the water.',
    },
    p2: {
      id: 'Berbeda dari alat pembersih konvensional yang hanya bekerja di permukaan, HYDRONE beroperasi di bawah air menggunakan sistem daya apung adaptif, sehingga bisa menjangkau polutan yang tidak terlihat dari atas.',
      en: 'Unlike conventional cleaners that only work on the surface, HYDRONE operates underwater using an adaptive buoyancy system, reaching pollutants invisible from above.',
    },
    p3: {
      id: 'Semua data kualitas air dikirim secara real-time ke dashboard, menghasilkan peta pencemaran yang bisa digunakan pemerintah dan peneliti.',
      en: 'All water quality data is sent in real-time to a dashboard, producing pollution maps usable by governments and researchers.',
    },
    pillars: [
      {
        title: { id: 'Bekerja Di Bawah Air', en: 'Operates Underwater' },
        icon: 'Anchor',
      },
      {
        title: { id: 'Tangkap Plastik Makro', en: 'Captures Macroplastic' },
        icon: 'Fish',
      },
      {
        title: { id: 'Filter Mikroplastik 5µm', en: '5µm Microplastic Filter' },
        icon: 'Filter',
      },
      {
        title: { id: 'Monitor Kualitas Air', en: 'Water Quality Monitor' },
        icon: 'Activity',
      },
    ],
  },
  features: {
    sectionLabel: { id: 'Fitur Unggulan', en: 'Key Features' },
    heading: { id: 'Teknologi di Balik HYDRONE', en: 'Technology Behind HYDRONE' },
    items: [
      {
        title: { id: 'Jaring Penangkap Pasif', en: 'Passive Deployable Net' },
        desc: {
          id: 'Jaring nilon mengembang otomatis saat HYDRONE bergerak maju, menangkap botol, kantong, dan plastik besar tanpa mekanisme aktif tambahan.',
          en: 'A nylon net automatically deploys as HYDRONE moves forward, capturing bottles, bags, and large plastics without additional active mechanisms.',
        },
        icon: 'Network',
        color: '#00B4D8',
      },
      {
        title: { id: 'Suction Mikroplastik 2 Tahap', en: 'Dual-Stage Microplastic Suction' },
        desc: {
          id: 'Pompa DC menyedot air melalui dua tahap filtrasi berurutan yaitu filter 10 mikron lalu 5 mikron, menangkap partikel mikroplastik halus.',
          en: 'A DC pump draws water through two sequential filtration stages, 10 micron then 5 micron filters, capturing fine microplastic particles.',
        },
        icon: 'Droplets',
        color: '#0096C7',
      },
      {
        title: { id: 'Sistem Daya Apung Adaptif', en: 'Adaptive Buoyancy System' },
        desc: {
          id: 'Ballast chamber yang bisa diisi atau dikosongkan otomatis memungkinkan HYDRONE menyelam, hover, dan naik tanpa intervensi manual.',
          en: 'A ballast chamber that fills or empties automatically allows HYDRONE to dive, hover, and surface without manual intervention.',
        },
        icon: 'ArrowUpDown',
        color: '#43A047',
      },
      {
        title: { id: 'Propulsi Pivot 6 Arah', en: '6-Direction Pivot Propulsion' },
        desc: {
          id: 'Dua thruster brushless yang bisa berotasi memberi kemampuan gerak maju, mundur, belok, naik, dan turun hanya dengan dua motor.',
          en: 'Two pivoting brushless thrusters provide forward, reverse, turning, rising, and diving movement with just two motors.',
        },
        icon: 'Navigation',
        color: '#1565C0',
      },
      {
        title: { id: 'Monitor Kualitas Air Real-time', en: 'Real-Time Water Quality Monitor' },
        desc: {
          id: 'Sensor turbidity, TDS, suhu, pH, dan GPS mencatat kondisi air secara terus-menerus dan mengirim data ke dashboard web.',
          en: 'Turbidity, TDS, temperature, pH, and GPS sensors continuously record water conditions and send data to a web dashboard.',
        },
        icon: 'Gauge',
        color: '#D4A017',
      },
      {
        title: { id: 'Dua Mode Operasi', en: 'Dual Operation Mode' },
        desc: {
          id: 'Bisa dioperasikan secara otonom menggunakan sensor, atau dikendalikan manual oleh operator melalui kabel tether 20 meter.',
          en: 'Operates autonomously using sensors, or manually controlled by an operator through a 20-meter tether cable.',
        },
        icon: 'Joystick',
        color: '#9C27B0',
      },
    ],
  },
  howItWorks: {
    sectionLabel: { id: 'Cara Kerja', en: 'How It Works' },
    heading: { id: 'Bagaimana HYDRONE Beroperasi?', en: 'How Does HYDRONE Operate?' },
    steps: [
      {
        num: '01',
        title: { id: 'Deploy ke Perairan', en: 'Deploy to Water' },
        desc: {
          id: 'HYDRONE diturunkan ke sungai, danau, atau perairan pesisir yang akan dibersihkan.',
          en: 'HYDRONE is lowered into the river, lake, or coastal water to be cleaned.',
        },
        icon: 'PlaneTakeoff',
        color: '#00B4D8',
      },
      {
        num: '02',
        title: { id: 'Navigasi ke Area Tercemar', en: 'Navigate to Polluted Area' },
        desc: {
          id: 'Thruster menggerakkan HYDRONE menuju titik pencemaran secara otonom atau via kendali manual.',
          en: 'Thrusters move HYDRONE toward pollution hotspots autonomously or via manual control.',
        },
        icon: 'Navigation',
        color: '#1565C0',
      },
      {
        num: '03',
        title: { id: 'Tangkap dan Saring', en: 'Collect and Filter' },
        desc: {
          id: 'Jaring menangkap plastik besar, sementara pompa suction menyaring mikroplastik secara bersamaan.',
          en: 'The net captures large plastics while the suction pump filters microplastics simultaneously.',
        },
        icon: 'Filter',
        color: '#43A047',
      },
      {
        num: '04',
        title: { id: 'Monitor dan Kirim Data', en: 'Monitor and Transmit Data' },
        desc: {
          id: 'Sensor mencatat kualitas air real-time dan mengirim data ke dashboard untuk analisis pencemaran.',
          en: 'Sensors record real-time water quality and send data to the dashboard for pollution analysis.',
        },
        icon: 'BarChart3',
        color: '#D4A017',
      },
    ],
    result: {
      id: 'Hasilnya: Air Lebih Bersih dan Data Pencemaran Terverifikasi',
      en: 'Result: Cleaner Water and Verified Pollution Data',
    },
  },
  product: {
    sectionLabel: { id: 'Produk Kami', en: 'Our Product' },
    name: { id: 'HYDRONE ROV', en: 'HYDRONE ROV' },
    tagline: { id: 'Dive. Collect. Protect.', en: 'Dive. Collect. Protect.' },
    sub: { id: 'Bawah Air · Otonom · Monitor Real-time', en: 'Underwater · Autonomous · Real-time Monitoring' },
    desc: {
      id: 'Sistem pembersih perairan terintegrasi yang menangani sampah plastik makro dan mikroplastik sekaligus, dilengkapi monitoring kualitas air real-time dan kemampuan operasi ganda otonom maupun manual.',
      en: 'An integrated water cleaning system handling both macroplastic and microplastic simultaneously, with real-time water quality monitoring and dual autonomous or manual operation capability.',
    },
    features: [
      { id: 'Tangkap plastik makro dengan jaring pasif', en: 'Capture macroplastic with passive net' },
      { id: 'Saring mikroplastik hingga 5 mikron', en: 'Filter microplastics down to 5 microns' },
      { id: 'Sistem daya apung adaptif otomatis', en: 'Automatic adaptive buoyancy system' },
      { id: 'Propulsi 6 arah dengan pivot thruster', en: '6-direction movement with pivot thrusters' },
      { id: 'Monitor kualitas air real-time', en: 'Real-time water quality monitoring' },
      { id: 'Dua mode: otonom dan manual', en: 'Dual mode: autonomous and manual' },
      { id: 'Kamera bawah air + pencahayaan LED', en: 'Underwater camera + LED lighting' },
      { id: 'Dashboard web + penyimpanan data cloud', en: 'Web dashboard + cloud data storage' },
    ],
    modeAutonomous: {
      label: { id: 'Otonom', en: 'Autonomous' },
      desc: { id: 'ESP32 + sensor navigasi otomatis', en: 'ESP32 + automatic sensor navigation' },
    },
    modeManual: {
      label: { id: 'Manual', en: 'Manual' },
      desc: { id: 'Kendali via kabel tether 20m', en: 'Control via 20m tether cable' },
    },
    cta: { id: 'Hubungi Kami', en: 'Contact Us' },
  },
  partners: {
    sectionLabel: { id: 'Mitra Kami', en: 'Our Partners' },
    heading: { id: 'Didukung Oleh', en: 'Supported By' },
    tagline: {
      id: 'Bersama membangun solusi perairan bersih untuk Indonesia',
      en: 'Together building clean water solutions for Indonesia',
    },
    items: [
      {
        name: 'SMA Negeri 1 Surakarta',
        logo: '/partners/sman1-solo.png',
        label: { id: 'SMA Negeri 1 Surakarta', en: 'SMA Negeri 1 Surakarta' },
      },
      {
        name: 'IID INNOPA',
        logo: '/partners/innopa.png',
        label: { id: 'IID INNOPA', en: 'IID INNOPA' },
      },
      {
        name: 'Mersiflab',
        logo: '/partners/mersiflab.png',
        label: { id: 'Mersiflab', en: 'Mersiflab' },
      },
    ],
  },
  team: {
    sectionLabel: { id: 'Tim Kami', en: 'Our Team' },
    heading: { id: 'Tim di Balik HYDRONE', en: 'The Team Behind HYDRONE' },
    sub: {
      id: 'Pelajar SMA Negeri 1 Surakarta yang berinovasi untuk lingkungan perairan',
      en: 'Students from SMA Negeri 1 Surakarta innovating for aquatic environments',
    },
    contact: { id: 'Hubungi', en: 'Contact' },
  },
  visionMission: {
    sectionLabel: { id: 'Visi & Misi', en: 'Vision & Mission' },
    heading: { id: 'Mengapa HYDRONE Ada?', en: 'Why Does HYDRONE Exist?' },
    vision: {
      label: { id: 'Visi', en: 'Vision' },
      title: {
        id: 'Perairan Indonesia Bebas Sampah Plastik dan Mikroplastik',
        en: 'Indonesian Waters Free from Plastic Waste and Microplastics',
      },
      desc: {
        id: 'Kami percaya setiap sungai, danau, dan perairan pesisir Indonesia berhak bersih dari ancaman plastik yang merusak ekosistem dan mengancam kesehatan manusia.',
        en: 'We believe every river, lake, and coastal water in Indonesia deserves to be free from plastic threats that destroy ecosystems and endanger human health.',
      },
    },
    mission: {
      label: { id: 'Misi', en: 'Mission' },
      items: [
        {
          id: 'Membersihkan sampah plastik makro dari perairan sebelum terfragmentasi menjadi mikroplastik.',
          en: 'Clean macroplastic waste from water bodies before they fragment into microplastics.',
        },
        {
          id: 'Menyaring mikroplastik berukuran hingga 5 mikron yang sudah tersebar di kolom air.',
          en: 'Filter microplastics down to 5 microns already dispersed throughout the water column.',
        },
        {
          id: 'Menghasilkan data kualitas air real-time untuk mendukung penelitian dan kebijakan lingkungan.',
          en: 'Generate real-time water quality data to support environmental research and policy.',
        },
        {
          id: 'Mengembangkan teknologi pembersih perairan yang terjangkau dan dapat digunakan secara luas.',
          en: 'Develop affordable water cleaning technology that can be widely deployed.',
        },
        {
          id: 'Berkontribusi pada SDG 6, 12, dan 14 melalui inovasi teknologi berbasis data.',
          en: 'Contribute to SDG 6, 12, and 14 through data-driven technological innovation.',
        },
      ],
    },
  },
  cta: {
    heading: { id: 'Tertarik Berkolaborasi?', en: 'Interested in Collaborating?' },
    sub: {
      id: 'Kami terbuka untuk kemitraan, sponsorship, dan kolaborasi riset bersama HYDRONE. Hubungi kami sekarang.',
      en: 'We are open to partnerships, sponsorships, and research collaboration with HYDRONE. Contact us now.',
    },
    btnWhatsApp: { id: 'Chat WhatsApp', en: 'Chat WhatsApp' },
    btnEmail: { id: 'Kirim Email', en: 'Send Email' },
    tags: ['ROV Bawah Air', 'Filter 5µm', 'ESP32 IoT', 'Dual Mode', 'IID INNOPA'],
  },
  footer: {
    brand: {
      sub: { id: 'Autonomous Underwater Plastic Collector', en: 'Autonomous Underwater Plastic Collector' },
      desc: {
        id: 'ROV bawah air untuk membersihkan sampah plastik dan mikroplastik di perairan Indonesia.',
        en: 'Underwater ROV to clean plastic waste and microplastics from Indonesian waters.',
      },
      status: { id: 'Sistem Aktif', en: 'System Active' },
    },
    navTitle: { id: 'Navigasi', en: 'Navigation' },
    navLinks: [
      { label: { id: 'Beranda', en: 'Home' }, href: '#' },
      { label: { id: 'Tentang', en: 'About' }, href: '#tentang' },
      { label: { id: 'Fitur', en: 'Features' }, href: '#fitur' },
      { label: { id: 'Produk', en: 'Product' }, href: '#produk' },
      { label: { id: 'Tim', en: 'Team' }, href: '#tim' },
      { label: { id: 'Visi & Misi', en: 'Vision & Mission' }, href: '#visi-misi' },
    ],
    compTitle: { id: 'Kompetisi', en: 'Competition' },
    copy: { id: '© 2025 HYDRONE | SMA Negeri 1 Surakarta | IID INNOPA', en: '© 2025 HYDRONE | SMA Negeri 1 Surakarta | IID INNOPA' },
  },
  login: {
    title: { id: 'Masuk ke Dashboard', en: 'Sign in to Dashboard' },
    sub: { id: 'Monitor dan kendalikan sistem pembersih perairan secara real-time', en: 'Monitor and control the water cleaning system in real-time' },
    controlCenter: { id: 'HYDRONE Control Center', en: 'HYDRONE Control Center' },
    emailLabel: { id: 'Email', en: 'Email' },
    passwordLabel: { id: 'Password', en: 'Password' },
    submit: { id: 'Masuk ke Dashboard', en: 'Sign in to Dashboard' },
    loading: { id: 'Memuat...', en: 'Loading...' },
    footer: { id: 'Akses terbatas untuk tim dan mitra resmi HYDRONE', en: 'Access restricted to official HYDRONE team and partners' },
    devHint: { id: 'Demo: admin@hydrone.local / hydrone2024', en: 'Demo: admin@hydrone.local / hydrone2024' },
    pills: [
      { id: 'Monitor Sensor Real-time', en: 'Real-time Sensor Monitor' },
      { id: 'Koneksi via Tether', en: 'Tether Connection' },
      { id: 'Akses Terproteksi', en: 'Protected Access' },
    ],
  },
} as const

export type Translations = typeof translations
