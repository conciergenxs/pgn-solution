import articlesRaw from '../data/generated/articles.json';
import galleryRaw from '../data/generated/gallery.json';
import clientsRaw from '../data/generated/clients.json';
import tukPartnersRaw from '../data/generated/tuk-partners.json';
import recognitionRaw from '../data/generated/recognition.json';
import boardRaw from '../data/generated/board.json';
import reportsRaw from '../data/generated/reports.json';
// English text for scraped content, keyed per item (from the original site's /en pages; see README).
import enRaw from '../data/generated/en.json';
import type { Lang } from '../i18n';
import { bioEn, roleEn } from '../data/en/board';

type EnText = { title?: string; excerpt?: string; body?: string; label?: string; role?: string; bio?: string };
const EN = enRaw as Record<'articles' | 'gallery' | 'board' | 'recognition', Record<string, EnText>>;

export type Category = 'press-release' | 'news' | 'csr';

export type Article = {
  category: Category;
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  author?: string | null;
  image?: string | null;
  excerpt: string;
  body: string;
  sourceUrl: string;
};

// `path` prefixes each article's own URL; `list` is where the category is listed (a tab on /articles).
export const categoryMeta: Record<Category, { label: string; path: string; list: string }> = {
  'press-release': { label: 'Press Release', path: '/articles/press-release', list: '/articles#press-release' },
  news: { label: 'Berita', path: '/articles/news', list: '/articles#news' },
  csr: { label: 'CSR', path: '/articles/csr', list: '/gcg#csr' },
};
const categoryEn: Record<Category, string> = { 'press-release': 'Press Release', news: 'News', csr: 'CSR' };
export const categoryLabel = (c: Category, lang: Lang = 'id') => (lang === 'en' ? categoryEn[c] : categoryMeta[c].label);

const byDateDesc = (a: Article, b: Article) => (a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0);

const all: Article[] = (articlesRaw as Article[]).slice().sort(byDateDesc);

/** An article in a locale: English title/excerpt/body where the original site has them, else as published. */
export function localize(a: Article, lang: Lang = 'id'): Article {
  if (lang !== 'en') return a;
  const en = EN.articles[`${a.category}/${a.slug}`];
  return en ? { ...a, title: en.title || a.title, excerpt: en.excerpt || a.excerpt, body: en.body || a.body } : a;
}
/** Whether an article has English text (used to label the ones only available in Indonesian). */
export const hasEnglish = (a: Pick<Article, 'category' | 'slug'>) => Boolean(EN.articles[`${a.category}/${a.slug}`]?.body);

export const articles: Article[] = all;
export const articlesIn = (lang: Lang = 'id') => (lang === 'en' ? all.map((a) => localize(a, 'en')) : all);

export function articlesBy(category: Category, lang: Lang = 'id'): Article[] {
  return articlesIn(lang).filter((a) => a.category === category);
}

export function articleUrl(a: Pick<Article, 'category' | 'slug'>): string {
  return `${categoryMeta[a.category].path}/${a.slug}`;
}

const MONTHS = {
  id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** Formats an ISO date (YYYY-MM-DD), e.g. "25 Oktober 2026" / "25 October 2026". */
export function formatDate(iso: string, lang: Lang = 'id'): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}

export type Album = { id: string; title: string; slug: string; images: string[] };
export const gallery: Album[] = (galleryRaw as Album[]).map((g) => ({ ...g, images: g.images.filter((i) => !i.includes('image-not-found')) }));
export const galleryIn = (lang: Lang = 'id'): Album[] => (lang === 'en' ? gallery.map((g) => ({ ...g, title: EN.gallery[g.slug]?.title || g.title })) : gallery);

export const clients: string[] = clientsRaw as string[];
export const tukPartners: string[] = tukPartnersRaw as string[];

export type Recognition = { image: string; label: string };
export const awards: Recognition[] = (recognitionRaw as { awards: Recognition[] }).awards;
export const certifications: Recognition[] = (recognitionRaw as { certifications: Recognition[] }).certifications;
const recIn = (list: Recognition[], lang: Lang) => (lang === 'en' ? list.map((r) => ({ ...r, label: EN.recognition[r.image]?.label || r.label })) : list);
export const awardsIn = (lang: Lang = 'id') => recIn(awards, lang);
export const certificationsIn = (lang: Lang = 'id') => recIn(certifications, lang);

export type BoardMember = { name: string; role: string; image: string; bio: string };
export const board = boardRaw as { commissioners: BoardMember[]; directors: BoardMember[] };
const memberIn = (m: BoardMember, lang: Lang) => (lang === 'en' ? { ...m, role: roleEn(m.role), bio: bioEn(m.bio) } : m);
export const boardIn = (lang: Lang = 'id') => ({ commissioners: board.commissioners.map((m) => memberIn(m, lang)), directors: board.directors.map((m) => memberIn(m, lang)) });

export type Report = { year: number; pdf: string; cover: string };
export const reports: Report[] = reportsRaw as Report[];

export function paginate<T>(items: T[], perPage: number) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  return { pages, page: (n: number) => items.slice((n - 1) * perPage, n * perPage) };
}
