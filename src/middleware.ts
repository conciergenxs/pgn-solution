import { defineMiddleware } from 'astro:middleware';
import { ID_MARK } from './i18n';
import { titleCase, titleCaseHtml } from './i18n/case';

// On English pages, internal page links get the /en prefix: href="/about" → href="/en/about".
// Left alone: assets (/media, /_astro, anything with a file extension), links already under /en,
// protocol-relative and external URLs. ID_MARK links (the language switcher) keep their Indonesian
// target on every page.
// Links marked hreflang="id" (the language picker) point at the Indonesian page on purpose.
const INTERNAL = /href="\/(?!\/|en(?:[/#?"])|_astro\/|media\/|~id)([^"]*)"(?! hreflang="id")/g;
const hasExt = (p: string) => /\.[a-z0-9]{2,5}(?:[?#]|$)/i.test(p.split(/[?#]/)[0]);

// Headlines (h1–h3) and other large headline-type text are title-cased in the page's language
// (src/i18n/case.ts), text and aria-label alike.
// Left as published: article and album titles (all caps at the source), city names, footer labels.
const HEADING = /<(h[1-3])\b([^>]*)>([\s\S]*?)<\/\1>/g;
const KEEP = /class="[^"]*\b(?:feed__title|art-card__title|a-card__title|ad-title|hero__news-title|footer-label|ct-area__city)\b/;
// Other text set in the headline type or at headline sizes (not descriptions, names, addresses or data):
// the type-scale classes and a few named titles. Only plain-text elements, so nesting can't trip the match.
const LARGE = /<(p|span)\b([^>]*\bclass="[^"]*\b(?:t-sm|t-md|t-xl|t-card|ann-empty__title|tk-mile__title|tk-certs__name|tk-reg__doc-name|acc__title|steps__head|steps__body)\b[^"]*"[^>]*)>([^<]*)<\/\1>/g;
function headlines(html: string, lang: 'id' | 'en') {
  return html
    .replace(HEADING, (m, tag: string, attrs: string, inner: string) => {
      if (KEEP.test(attrs)) return m;
      const a = attrs.replace(/aria-label="([^"]*)"/, (_x, v: string) => `aria-label="${titleCase(v, lang)}"`);
      return `<${tag}${a}>${titleCaseHtml(inner, lang)}</${tag}>`;
    })
    .replace(LARGE, (_m, tag: string, attrs: string, text: string) => `<${tag}${attrs}>${titleCaseHtml(text, lang)}</${tag}>`);
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  const res = await next();
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html')) return res;
  // the CMS is its own app: no locale links, no headline casing
  if (/^\/cms(?:\/|$)/.test(ctx.url.pathname)) return res;
  const en = /^\/en(?:\/|$)/.test(ctx.url.pathname);
  let html = await res.text();
  if (en) html = html.replace(INTERNAL, (m, rest: string) => (hasExt(rest) ? m : `href="/en${rest ? `/${rest}`.replace(/^\/([#?])/, '$1') : ''}"`));
  html = html.split(`href="${ID_MARK}`).join('href="');
  html = headlines(html, en ? 'en' : 'id');
  return new Response(html, { status: res.status, statusText: res.statusText, headers: res.headers });
});
