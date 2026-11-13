// English copy for src/data/site.ts. Wording follows the original site's English pages
// (https://www.pgn-solution.co.id/en/*) where they exist; the rest is translated from the Indonesian.
import * as id from '../site';
import type { NavItem } from '../site';

// "Dikerjakan" is left untranslated on the original English page; translated here.
export const companyStats = [
  { value: '2009', prefix: 'since', label: 'company established' },
  { value: '2.672', suffix: 'people', label: 'employed by the company' },
  { value: '3300', prefix: '>', suffix: 'projects', label: 'managed and completed.' },
];

export const nav: NavItem[] = [
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'Vision & Mission', href: '/about#vision-mission' },
      { label: 'Our Culture', href: '/about#our-culture' },
      { label: 'Company History', href: '/about#company-history' },
      { label: 'BOD & BOC', href: '/about#bod-boc' },
      { label: 'Awards & Certification', href: '/about#awards-certification' },
    ],
  },
  {
    label: 'Business',
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
    label: 'GCG & Compliance',
    href: '/gcg',
    children: [
      { label: 'GCG', href: '/gcg#gcg' },
      { label: 'Anti-Bribery Management System', href: '/gcg#smap' },
      { label: 'Whistleblowing System (WBS)', href: '/gcg#wbs' },
      { label: 'Shareholder', href: '/gcg#shareholder' },
      { label: 'CSR', href: '/gcg#csr' },
      { label: 'HSSE Commitment', href: '/gcg#hsse' },
    ],
  },
  {
    label: 'Investor Relations',
    href: '/investor-relations',
    children: [
      { label: 'Highlights', href: '/investor-relations#highlight' },
      { label: 'Annual Report', href: '/investor-relations#annual-report' },
    ],
  },
  { label: 'Partnership', href: '/partnership' },
  {
    label: 'Articles',
    href: '/articles',
    children: [
      { label: 'Press Release', href: '/articles#press-release' },
      { label: 'Latest News', href: '/articles#news' },
      { label: 'Gallery', href: '/articles#gallery' },
    ],
  },
  {
    label: 'Careers',
    href: '/careers',
    children: [
      { label: 'Vacancies', href: '/careers/opportunities' },
      { label: 'Apply', href: '/careers/apply' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    children: [
      { label: 'Headquarters', href: '/contact#headquarters' },
      { label: 'Branch Office', href: '/contact#branch-office' },
      { label: 'Hotline Center', href: '/contact#hotline-center' },
    ],
  },
];

// The original English pages: "CONTACTS / Talk to our experts about your requirements / We are always open
// for cooperation Contact us and know more about how our expertise can help your business."
export const contactCta: typeof id.contactCta = {
  eyebrow: 'Contact',
  title: 'Talk to our experts about your requirements',
  text: 'We are always open for cooperation. Contact us and know more about how our expertise can help your business.',
  button: 'Contact Us',
};
