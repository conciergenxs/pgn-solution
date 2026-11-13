// Initial content for the CMS at /cms: the site's own press releases, news and gallery albums.
// The CMS keeps its edits in the browser (see src/cms/app.ts); this file is only the starting point.
import { articles, gallery } from '../../lib/content';

export function GET() {
  const posts = articles
    .filter((a) => a.category === 'press-release' || a.category === 'news')
    .map((a) => ({
      id: `${a.category}/${a.slug}`,
      kind: a.category,
      title: a.title,
      slug: a.slug,
      date: a.isoDate,
      status: 'published',
      image: a.image ?? null,
      excerpt: a.excerpt,
      body: a.body,
      author: a.author || 'Admin',
      updatedAt: Date.parse(a.isoDate),
    }));
  const albums = gallery.map((g, i) => ({ id: g.slug, title: g.title, images: g.images, updatedAt: Date.parse('2022-10-14') - i * 864e5 }));
  return new Response(JSON.stringify({ posts, albums }), { headers: { 'content-type': 'application/json' } });
}
