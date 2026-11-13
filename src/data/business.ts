// Business — verbatim copy from https://www.pgn-solution.co.id/id/service and /id/tuk
// Imagery is reused from the original site's header, gallery and service media.
const VIDEO = 'https://www.pgn-solution.co.id/template/videos/';

export const businessHero = {
  title: 'Bekerja bersama, percaya, dan mengubah dunia',
  text: 'PT PGAS Solution menyediakan berbagai layanan yang berkonsentrasi pada layanan pendukung dalam 4 bidang bisnis',
  image: '/media/header/1693383393-bisnis.jpg',
};

// Homepage "Bisnis Kami" block
export const homeBusiness = {
  eyebrow: 'Bisnis Kami',
  title: 'Kami Menawarkan Jasa di Bidang Layanan Pendukung',
  text: 'Kami adalah satu-satunya perusahaan dengan layanan terintegrasi di bidang energi dan infrastruktur, membantu klien kami untuk mengoptimalkan biaya mereka.',
};

export type Portfolio = { text: string; client?: string };

/** Splits a trailing "(Client name)" from a portfolio line for display. Text is unchanged. */
function p(line: string): Portfolio {
  const m = line.match(/^(.*\S)\s*\(([^()]+)\)\s*$/);
  return m ? { text: m[1], client: m[2].trim() } : { text: line };
}

export const lines = [
  {
    id: 'epc',
    tag: 'EPC',
    title: 'Engineering, Procurement, and Construction',
    short: 'Engineering, Procurement, and Construction',
    text: 'Pengelolaan jasa EPC menyediakan jasa konstruksi Engineering, Procurement, Construction, Installation, & Commissioning (EPCIC) dalam skala besar.',
    image: '/media/media/1607326291-dji-0030.jpg',
    imageAlt: 'Foto udara pekerjaan pipa gas lepas pantai Kalija',
    secondary: '/media/media/1598380421-dsc07972-large.jpg',
    thumb: '/media/brand/services-hover-02.png',
    video: VIDEO + '1598337206_EPC.mp4.mp4',
    stats: [
      { value: '258', unit: 'proyek', label: 'selesai dikerjakan' },
      { value: '1', unit: 'perusahaan', label: 'dalam subsdisiary' },
      { value: '1315', unit: 'orang', label: 'dipekerjakan oleh perusahaan' },
    ],
    areas: [] as { title: string; text: string }[],
    products: [
      'Oil & Gas Plant Facilities (Onshore)',
      'SPBG',
      'Oil and Gas Pipeline Transmission and Distribution (Offshore and Onshore)',
      'Mechanical (Static and Rotating Equipment) and piping',
      'Electrical, Instrumentation, and Fire Fighting System',
      'Fiber Optic',
      'Household gas network',
    ],
    portfolio: [
      'Proyek Pengerjaan Offtake Station Tambak Lorok (Pekerjaan Sipil, Pengadaan Material Utama & Penunjang, dan Kerjasama Penyediaan Jasa Marine Survey) dengan panjang pipa 202 km  (PT Kalimantan Jawa Gas)',
      'Pelaksanaan Pekerjaan Pengembangan Jaringan Daerah Dumai senilai (PT Perusahaan Gas Negara Tbk)',
      'Jasa Perancangan, Pengadaan, dan Konstruksi (EPC) Infrastruktur Distribusi Gas Aroma Kopi dia. 12” sepanjang 4.4 km (PT Pertamina Gas)',
    ].map(p),
    link: undefined as { label: string; href: string } | undefined,
  },
  {
    id: 'om',
    tag: 'O&M',
    title: 'Operation and Maintenance',
    short: 'Operation and Maintenance',
    text: 'Pengelolaan dan pemeliharaan infrastruktur dan aset operasi di jaringan pipa distribusi dan transmisi gas bumi beserta fasilitasnya dan termasuk aset penunjangnya yang terkait.',
    image: '/media/media/1665720958-dji-0711.jpg',
    imageAlt: 'Kapal pendukung pekerjaan rektifikasi freespan pipa gas bawah laut',
    secondary: '/media/media/1665721059-dsc00694.jpg',
    thumb: '/media/brand/services-hover-01.png',
    video: VIDEO + '1598337403_OPERATION%20AND%20MAINTENANCE.mp4.mp4',
    stats: [],
    areas: [
      { title: 'Pelaksanaan Proyek Operasi', text: 'Pekerjaan pengoperasian dan pemeliharaan Fasilitas, Jaringan Offshore & Onshore' },
      { title: 'Integrity dan Engineering', text: 'Pipeline integrity  -\tFacility integrity  -\tAssesment  - Aplikasi Operation and Maintenance' },
      { title: 'Kalibrasi dan Manufaktur', text: 'Kalibrasi Meter, Pengelolaan dan Persedian Pergudangan, Fabrikasi' },
    ],
    products: [
      'Pemeliharaan valve, Diesel Engine Generator, Gas Engine Generator, Meter, Transmitter serta aset fasilitas lainnya.',
      'Patroli jalur pipa Offshore, pemeliharaan Navigational Buoy, pemeliharaan Subsea Valve, Marine Radar Surveillance',
      'Survei CIPS DCVG, Inteliigent Pigging, Freespan Correction, Acoustic Survey, Pipeline Reinforcement',
      'Risk Based Inspection, FMECA, Resertifikasi Instalasi dan Peralatan',
      'Risk Assessment, Corrosion Under Insulation',
      'Pemeliharaan Valve, Diesel Engine Generator, Gas Engine Generator, Meter, Transmitter serta aset lainya',
      'Patroli jalur pipa/ROW, pengecekan kebocoran, pemeliharaan rambu – rambu, pemeliharaan sectional valve dan future connection, pemeliharaan vegetasi dan sebagainya.',
      'Patroli Udara',
    ],
    portfolio: [
      'Manajemen Aset dan Reliabilitas Infrastruktur Operasi dan Sistem Manajemen Gas (PT Perusahaan Gas Negara Tbk )',
      'Rektifikasi Free Span Pipa Gas Bawah Laut 28” di 29 titik dan NCM sepanjang 290 km Pagerungan-Porong PT Pertamina Gas Eastern Java Area (PT Pertamina Gas)',
      'Pengoperasian dan Pemeliharaan Fasilitas Penyaluran Gas Kepodang-Tambak Lorok beserta Penunjang terkait (PT Kalimantan Jawa Gas)',
      'POMA Pipeline Maintenance Services dengan total Panjang pipa 840 km Senipah-Handil-Kutai Lama-Badak-Santan-Bontang (PT Pertamina Hulu Mahakam )',
      'Provision non-destructive test (NDT) & QA/QC service for Pangkah Onshore and Offshore Operation (PT Saka Energi Indonesia)',
      'Provision of Cathodic Protection Pipeline Survey and verifying Corrosion Coupon (PT Saka Energi Indonesia)',
      'Pengoprasian dan Pemeliharaa Pipa Distribusi dan Stasiun Meter Gas SPBG di Wilayah PT Pertamina Gas OWJA (PT Pertamina Gas)',
      'Jasa Pengawasan Pipa Bawah Laut dan Floating Storage & Regasification Unit (PT Nusantara Regas)',
      'Pembangunan, Pengelolaan dan Penyerahan (Build Operate Transfer) Tanah, Instalasi dan Peralatan Pengguna Gas Bumi di Cement Mill Dumai (PT Semen Padang)',
      'Jasa Pemeliharaan Fire Suppression System dan Fire & Gas Detection System (PT Nusantara Regas)',
    ].map(p),
    link: undefined,
  },
  {
    id: 'supply-chain',
    tag: 'SC',
    title: 'Supply Chain',
    short: 'Supply Chain',
    text: 'The supply chain business sector provides trading, training and certification (TUK), calibration, and HSSE services',
    image: '/media/brand/career-ourachivment-02.jpg',
    imageAlt: 'Jaringan pipa gas di fasilitas pembangkit listrik',
    secondary: '/media/brand/career-ourachivment-01.jpg',
    thumb: '/media/brand/services-hover-03.png',
    video: VIDEO + '1665718130_TEASER%20MANUFAKTUR_1_1.mp4.mp4',
    stats: [],
    areas: [
      { title: 'Kerjasama International', text: 'Menyediakan Produk yang bersaing dan memiliki kualitas tinggi yang diproduksi oleh perusahaan terkemuka di dunia.' },
      { title: 'Kalibrasi', text: 'Layanan perbaikan dan kalibrasi meter gas.' },
      { title: 'Manufacture Pipa PE', text: 'Pabrikasi Pipa Polyethylene' },
    ],
    products: [
      'Logistic and Trading: Oil and gas pipeline material, civil, chemical, lubricants, and other material',
      'Pipa Gas MDPE 80/HDPE 100',
      'Calibration, Manufacturing and Warehousing(KMP): Gas meter calibration, Warehouse and Management, Gas Stakes',
      'Pipa Subduct HDPE 100',
    ],
    portfolio: [
      'Pengadaan Electronic Volume Corrector (EVC) Tahun 2020 sebanyak 335 unit (PT Perusahaan Gas Negara Tbk)',
      'Pengadaan Meter Diafragma G 1.6 Tahun 2020 sebanyak 19.244 unit (PT Perusahaan Gas Negara Tbk)',
    ].map(p),
    // "Selengkapnya" link to the SOLFIPE article (now hosted on this site)
    link: { label: 'Selengkapnya', href: '/articles/news/solfipe-produk-inovasi-pipa-pe-sebagai-komitmen-pgn-solution-untuk-mendukung' },
  },
  {
    id: 'tuk',
    tag: 'TUK',
    title: 'TUK PGAS Training Center',
    short: 'TUK PGAS Training Center',
    text: 'Memberikan pelatihan dan sertifikasi untuk mengoptimalkan kompetensi sumber daya manusia dalam infrastruktur energi dan pemanfaatan gas alam Indonesia.',
    image: '/media/header/pgas-solution-tuk.jpg',
    imageAlt: 'TUK PGAS Training Center',
    secondary: '/media/brand/career-ourachivment-03.jpg',
    thumb: '/media/brand/services-hover-04.png',
    video: VIDEO + '1598337594_TUK.mp4.mp4',
    stats: [],
    areas: [
      { title: 'Pelatihan & Sertifikasi Pekerja', text: 'Memberikan pelatihan dan sertifikasi pekerja dalam memenuhi kebutuhan dalam menjalankan bisnis perusahaan' },
      { title: 'Kerjasama', text: 'Bekerjasama dengan Lembaga sertifikasi Nasional dan Kementrian Ketenagakerjaan' },
      { title: 'Offline & Online', text: 'Pelatihan yang dapat menyesuaikan dalam segala situasi' },
    ],
    products: [],
    portfolio: [],
    link: undefined,
  },
];

// Full TUK detail page content (/id/tuk), shown on its own page: /business/tuk.
export const tuk = {
  heroTitle: 'Perkembangan Terbaik untuk Hasil yang Unggul',
  heroText: 'Tempat Uji Kompetensi PGAS Training Center adalah Lembaga yang menyediakan fasilitas implementasi Uji Kompetensi, yang dilakukan oleh LSP, yang didirikan oleh PT PGAS Solution',
  aboutTitle: 'Tentang TUK PGAS Training Center',
  about: 'Tempat Uji Kompetensi (TUK) PGAS Training Center yang dimiliki oleh PT PGAS Solution hadir sebagai komitmen perusahaan dalam optimalisasi kompetensi sumber daya manusia dalam infrastruktur energi dan pemanfaatan gas alam Indonesia. TUK PGAS Training Center telah memperoleh lisensi dari LSP ENERGI pada 24 Oktober 2016, dan TUK PGAS Training Center dengan LSP PGN sejak 2017 dan ditetapkan sebagai Pusat Uji Kompetensi independen oleh LSP PGN 2020.',
  whyTitle: 'Mengapa TUK PGAS Training Center?',
  why: [
    { title: 'Tempat Uji Penyedia Pertama untuk Kompetensi di Sektor Gas Bumi di Indonesia', text: 'Kami menghadirkan yang pertama sebagai TUK di Sektor Gas Bumi Indonesia' },
    { title: 'Fasilitas dan Infrastruktur yang Memadai', text: 'Untuk mendukung proses pelatihan dan sertifikasi, kami selalu memperhatikan kenyamanan dan kelengkapan peserta pelatihan teoretis atau praktis.' },
    { title: 'Pelatihan Online dan Offline', text: 'Kami memiliki metode pelatihan online dan offline seperti kami melakukan teori, praktik, diskusi, berbagi pengalaman, permainan, atau permainan peran yang dirancang sesuai dengan tujuan pelatihan.' },
    { title: 'Penilai dan Pelatih yang Kompeten', text: 'Pusat Pelatihan TUK PGAS didukung oleh penilai dan pelatih yang kompeten di bidangnya masing-masing. Asesor profesional dan pelatih TUK PGAS Training Center akan memberikan berbagai pengetahuan dan pengalaman bagi peserta dalam menghadapi ujian sertifikasi.' },
  ],
  certTitle: 'Layanan Sertifikasi',
  certText: 'Kami memiliki layanan sertifikasi di berbagai bidang, sebagai berikut:',
  certGroups: [
    {
      title: 'Sertifikasi untuk Layanan Infrastruktur Gas',
      items: [
        'Operator Penyambung Pipa Polyethylene (Pe)',
        'Operator Penyambungan Pipa Galvanis',
        'Memeriksa Kualitas Pemasangan Pipa Polyethylene (Pe) dalam Distribusi Sistem Jaringan dan Pemasangan Pipa Gas Bumi',
        'Pengoperasian Peralatan Stasiun Pengisian Bahan Bakar Gas (SPBG)',
        'Pemeriksaan Stasiun Distribusi Gas Bumi',
        'Melaksanakan Komersialisasi Gas Bumi',
        'Operator Penyambung Pipa Multilayer',
        'Desainer Desain Instalasi Pipa Gas Bumi',
        'Pemantauan Operator terhadap Sistem Perlindungan Katodik',
        'Inspektur Sistem Pengukuran Penyerahan Gas Bumi',
        'Operator Pemeliharaan Metering Dan Pengaturan Stasiun (MRS) Dan non-pelanggan',
        'Pemeliharaan Operator Tabung Katup dan Katup Bola di Jaringan Distribusi Gas bumi',
        'Operator Patroli Jaringan',
        'Operator K3',
        'Operator penjaga lantai',
      ],
    },
    {
      title: 'Layanan Sertifikasi di bidang lain',
      items: [
        'Pakar Manajemen Proyek Muda - IAMPI',
        'Pelatihan dan Sertifikasi Ahli K3',
        'Pelatihan dan Sertifikasi P3K',
        'Pelatihan dan Sertifikasi Pemadam Kebakaran',
        'Pelatihan dan Sertifikasi MS Office',
        'Pelatihan dan Sertifikasi Pengawas SDM',
        'Pelatihan dan Sertifikasi Administrasi Kantor',
        'Pelatihan dan Sertifikasi Keuangan dan Pengadaan',
        'OB dan Pelatihan dan Sertifikasi Keamanan',
        'Pelatihan dan Sertifikasi Komersial',
        'Tenaga Kerja Operasional Pemasar',
        'Operator dan Pengawas Industri Minyak dan Gas OHS',
        'Perawatan Minyak dan Gas Bumi (CRO)',
        'Operator Pengisian Bahan Bakar Bersertifikat',
      ],
    },
  ],
  partnersTitle: 'Mitra',
  partnersText: 'Selama bertahun-tahun kami telah bermitra dengan beberapa perusahaan terbaik untuk meningkatkan pengalaman belajar Anda dan memberikan hasil terbaik untuk peserta TUK PGAS Training Center.',
  registrationTitle: 'Registrasi',
  registrationText: 'Tertarik dengan layanan kami? Silakan unduh formulir pendaftaran di bawah ini dan kirimkan ke info.tuk@pgn-solution.co.id . Tim kami akan memandu Anda setelah Anda mengirim email.',
  registrationForm: { label: 'Registration form', href: 'https://www.pgn-solution.co.id/template/documents/FORMULIR_PENDAFTARAN_PELATIHAN_TUK.pdf' },
  email: 'info.tuk@pgn-solution.co.id',
  contactText: 'Untuk pertanyaan, kritik, atau saran, silakan kirim email ke info.tuk@pgn-solution.co.id atau isi formulir berikut:',
};

export const packages = {
  title: 'Service Packages: 3 Solutions',
  text: 'PT PGAS Solution menawarkan tiga paket layanan dengan nama 3 Solution. Ketiga paket menyediakan area layanan mulai dari instalasi, pemeliharaan, pelatihan, hingga pasokan gas bagi konsumen.',
  items: [
    { name: '1 Solution', icon: '/media/brand/solution-1.gif', text: 'Menawarkan layanan sesuai kebutuhan pelanggan. Semua layanan mulai dari instalasi, operasi, perdagangan, hingga pelatihan yang dipilih pelanggan.' },
    { name: '2 Solution', icon: '/media/brand/solution-2.gif', text: 'Menawarkan layanan pengembangan infrastruktur dengan sistem bundling EPC dan O&M, yang mencakup desain, instalasi, dan operasi' },
    { name: '3 Solution', icon: '/media/brand/solution-3.gif', text: 'Menawarkan layanan pengembangan infrastruktur menggunakan EPC, O&M, dan sistem bundling Komoditas Energi, yang mencakup desain, instalasi, operasi, dan komoditas gas untuk digunakan.' },
  ],
};

export const clientsBlock = {
  eyebrow: 'Klien Kami',
  title: 'Solusi Mitra yang Andal Dalam Energi dan Infrastruktur',
  text: 'Kami adalah mitra yang paling dapat diandalkan untuk menyelesaikan proyek ambisius di bidang energi & infrastruktur',
};
