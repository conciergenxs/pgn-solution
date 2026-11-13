// @ts-check
import { defineConfig } from 'astro/config';

// Old URL structure (www.pgn-solution.co.id/id/...) → new sitemap.
const legacy = {
  '/id': '/',
  '/id/home': '/',
  '/id/about': '/about',
  '/id/service': '/business',
  '/id/tuk': '/business',
  '/id/gcg': '/gcg',
  '/id/investor': '/investor-relations',
  '/id/information': '/articles',
  '/id/partnership': '/partnership',
  '/id/career': '/careers',
  '/id/contact': '/contact',
};

// The press release, news and gallery listings became tabs on /articles.
const listings = {
  '/articles/press-release': '/articles#press-release',
  '/articles/news': '/articles#news',
  '/articles/gallery': '/articles#gallery',
};

export default defineConfig({
  site: 'https://www.pgn-solution.co.id',
  trailingSlash: 'ignore',
  redirects: { ...legacy, ...listings },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  build: { format: 'directory' },
});
