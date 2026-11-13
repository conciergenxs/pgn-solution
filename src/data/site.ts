// Global company information — copied verbatim from https://www.pgn-solution.co.id (ID locale).

export const company = {
  name: 'PT PGAS Solution',
  brand: 'PGN Solution',
  tagline: 'Action for excellence',
  address: ['Komplek Perkantoran PGN Gedung C', 'Jl K.H. Zainul Arifin No. 20 Jakarta Barat, 11140 Indonesia'],
  // Footer values as published in the original site footer
  phone: '+6221 6386 7037',
  fax: '+6221 6385 4506',
  email: 'info@pgn-solution.co.id',
  hotline: '+6281211888645',
};

export const socials = [
  { label: 'LinkedIn', handle: 'PT PGAS Solution', href: 'https://www.linkedin.com/company/pt-pgas-solution/', icon: 'linkedin' },
  { label: 'YouTube', handle: 'PGN Solution', href: 'https://www.youtube.com/channel/UCafv20BgjnJPyVP7w-Qt4eg', icon: 'youtube' },
  { label: 'Instagram', handle: '@pgn_solution', href: 'https://www.instagram.com/pgn_solution/', icon: 'instagram' },
  { label: 'Facebook', handle: 'PT PGAS Solutions', href: 'https://www.facebook.com/PT-PGAS-Solution-100236291771635', icon: 'facebook' },
  { label: 'X (Twitter)', handle: '@pgn_solution', href: 'https://twitter.com/pgn_solution', icon: 'x' },
] as const;

// Company figures repeated in every page header of the original site.
export const companyStats = [
  { value: '2009', prefix: 'sejak', label: 'perusahaan berdiri' },
  { value: '2.672', suffix: 'orang', label: 'bekerja di perusahaan' },
  { value: '3300', prefix: '>', suffix: 'proyek', label: 'dikelola dan diselesaikan.' },
];

export type NavItem = { label: string; href: string; children?: { label: string; href: string; note?: string }[] };

// Navigation follows the new sitemap (01–09).
export const nav: NavItem[] = [
  {
    label: 'Tentang Kami',
    href: '/about',
    children: [
      { label: 'Visi & Misi', href: '/about#vision-mission' },
      { label: 'Budaya Kami', href: '/about#our-culture' },
      { label: 'Sejarah Perusahaan', href: '/about#company-history' },
      { label: 'BOD & BOC', href: '/about#bod-boc' },
      { label: 'Penghargaan & Sertifikasi', href: '/about#awards-certification' },
    ],
  },
  {
    label: 'Bisnis',
    href: '/business',
    children: [
      { label: 'EPC', href: '/business#epc' },
      { label: 'O & M', href: '/business#om' },
      { label: 'Supply Chain', href: '/business#supply-chain' },
      { label: 'TUK Training Center', href: '/business/tuk' },
      { label: 'Service Packages', href: '/business#service-packages' },
    ],
  },
  {
    label: 'GCG & Kepatuhan',
    href: '/gcg',
    children: [
      { label: 'GCG', href: '/gcg#gcg' },
      { label: 'Sistem Manajemen Anti Penyuapan', href: '/gcg#smap' },
      { label: 'Whistleblowing System (WBS)', href: '/gcg#wbs' },
      { label: 'Shareholder', href: '/gcg#shareholder' },
      { label: 'CSR', href: '/gcg#csr' },
      { label: 'Komitmen K3PL', href: '/gcg#hsse' },
    ],
  },
  {
    label: 'Relasi Investor',
    href: '/investor-relations',
    children: [
      { label: 'Highlights', href: '/investor-relations#highlight' },
      { label: 'Annual Report', href: '/investor-relations#annual-report' },
    ],
  },
  { label: 'Partnership', href: '/partnership' },
  {
    label: 'Artikel',
    href: '/articles',
    children: [
      { label: 'Press Release', href: '/articles#press-release' },
      { label: 'Berita Terbaru', href: '/articles#news' },
      { label: 'Galeri', href: '/articles#gallery' },
    ],
  },
  {
    label: 'Karir',
    href: '/careers',
    children: [
      { label: 'Lowongan', href: '/careers/opportunities' },
      { label: 'Lamar', href: '/careers/apply' },
    ],
  },
  {
    label: 'Kontak',
    href: '/contact',
    children: [
      { label: 'Kantor Pusat', href: '/contact#headquarters' },
      { label: 'Area Operasional', href: '/contact#branch-office' },
      { label: 'Hotline Center', href: '/contact#hotline-center' },
    ],
  },
];

// Language switcher: Indonesian at the root, English under /en.
export const locales = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia' },
  { code: 'en', label: 'EN', name: 'English' },
] as const;

// Shared closing call-to-action shown above the footer on every page.
export const contactCta = {
  eyebrow: 'Kontak',
  title: 'Hubungi kami untuk keperluan Anda',
  text: 'Kami selalu terbuka untuk kerja sama, hubungi kami dan pelajari lebih lanjut tentang bagaimana kami dapat membantu bisnis Anda.',
  button: 'Hubungi Kami',
};

// Optional form backend. When unset, forms fall back to composing an email.
export const formEndpoint: string | undefined = import.meta.env.PUBLIC_FORM_ENDPOINT || undefined;
