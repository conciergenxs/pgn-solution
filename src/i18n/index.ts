// Locales. Indonesian is the default and lives at the root (/about); English lives under /en (/en/about).
// Every page sits in src/pages/[...lang]/ and builds once per locale.
export type Lang = 'id' | 'en';
export const LANGS: Lang[] = ['id', 'en'];

/** The [...lang] route param for a locale: undefined for Indonesian (root), 'en' for English. */
export const langParam = (lang: Lang) => (lang === 'en' ? 'en' : undefined);

/** getStaticPaths for a page that only varies by locale. */
export const langPaths = () => LANGS.map((lang) => ({ params: { lang: langParam(lang) } }));

/** The locale of the current request, from the [...lang] param. */
export const langOf = (params: Record<string, string | undefined>): Lang => (params.lang === 'en' ? 'en' : 'id');

/** A pathname without its locale prefix: /en/about → /about, /en → /. */
export const basePath = (pathname: string) => pathname.replace(/^\/en(?=\/|$)/, '') || '/';

/** The same page in another locale. */
export const pathIn = (lang: Lang, pathname: string) => {
  const base = basePath(pathname);
  return lang === 'en' ? (base === '/' ? '/en' : `/en${base}`) : base;
};

/* Links. Pages write plain internal hrefs (/about#history); src/middleware.ts prefixes them with /en on
   English pages. A link that must point at the Indonesian page as-is either carries hreflang="id" right
   after its href (the language picker does) or uses the marker below, which the middleware strips. */
export const ID_MARK = '/~id';
export const keepId = (href: string) => `${ID_MARK}${href}`;
