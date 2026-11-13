/* PGN Solution CMS (/cms): manages the Artikel page content (press releases, news, gallery albums).
   Front end only. It loads /cms/seed.json (the site's own content) and keeps every change in this
   browser's localStorage as an overlay on top of it, so edits survive a reload. */

type Kind = 'press-release' | 'news';
type Status = 'published' | 'draft';
interface Post { id: string; kind: Kind; title: string; slug: string; date: string; status: Status; image: string | null; excerpt: string; body: string; author: string; updatedAt: number }
interface Album { id: string; title: string; images: string[]; updatedAt: number }
interface Activity { at: number; action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish'; kind: Kind | 'gallery'; title: string; id: string }
interface Overlay { posts: Record<string, Post | null>; albums: Record<string, Album | null>; log: Activity[] }

const KIND_LABEL: Record<Kind, string> = { 'press-release': 'Press Release', news: 'Berita' };
const STORE_KEY = 'pgn-cms:v1';
const PER_PAGE = 12;

/* ---------- icons ---------- */
const I: Record<string, string> = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9"/></svg>',
  press: '<svg viewBox="0 0 24 24"><path d="M4 5h12v14H6a2 2 0 0 1-2-2V5ZM16 9h4v8a2 2 0 0 1-2 2M8 9h4M8 13h4"/></svg>',
  news: '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/></svg>',
  gallery: '<svg viewBox="0 0 24 24"><path d="M3 6h14v12H3zM7 3h14v12M3 15l4-4 4 4 3-3 3 3"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
  dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>',
  chevL: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
  chevR: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><path d="M12 4 2.5 20h19L12 4ZM12 10v4.5M12 17.5v.3"/></svg>',
  image: '<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4"/><circle cx="15.5" cy="9" r="1.5"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>',
  bold: '<svg viewBox="0 0 24 24"><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/></svg>',
  italic: '<svg viewBox="0 0 24 24"><path d="M10 5h8M6 19h8M14 5l-4 14"/></svg>',
  underline: '<svg viewBox="0 0 24 24"><path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14"/></svg>',
  h: '<svg viewBox="0 0 24 24"><path d="M5 5v14M14 5v14M5 12h9M18 10l2-1v10"/></svg>',
  ul: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".8"/><circle cx="4.5" cy="12" r=".8"/><circle cx="4.5" cy="18" r=".8"/></svg>',
  ol: '<svg viewBox="0 0 24 24"><path d="M10 6h10M10 12h10M10 18h10M4 5l1.5-1v5M4 14.5c0-1 2.5-1 2.5 0S4 16.5 4 18h2.5"/></svg>',
  quote: '<svg viewBox="0 0 24 24"><path d="M5 11h4v6H5v-6c0-2.5 1-4 3-5M14 11h4v6h-4v-6c0-2.5 1-4 3-5"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  clear: '<svg viewBox="0 0 24 24"><path d="M6 5h12M12 5l-3 14M5 19h6M15 15l5 5M20 15l-5 5"/></svg>',
  undo: '<svg viewBox="0 0 24 24"><path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/></svg>',
  redo: '<svg viewBox="0 0 24 24"><path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
};

/* ---------- helpers ---------- */
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel as string) as T | null;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel as string)) as T[];
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const fmtDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return y ? `${d} ${MONTHS[m - 1]} ${y}` : '—'; };
const today = () => new Date().toISOString().slice(0, 10);
function ago(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'baru saja';
  if (s < 3600) return `${Math.floor(s / 60)} menit lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} hari lalu`;
  return fmtDate(new Date(t).toISOString().slice(0, 10));
}
const slugify = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-$/, '');
const textOf = (html: string) => { const d = document.createElement('div'); d.innerHTML = html; return (d.textContent || '').replace(/\s+/g, ' ').trim(); };
const excerptOf = (html: string, n = 220) => { const t = textOf(html); return t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '').replace(/[,.;:]$/, '') + '…'; };
const thumb = (src: string | null, cls = 'thumb') => (src ? `<img class="${cls}" src="${esc(src)}" alt="" loading="lazy" />` : `<span class="${cls} thumb--empty">${I.image}</span>`);

/* ---------- store: seed + overlay ---------- */
let seed: { posts: Post[]; albums: Album[] } = { posts: [], albums: [] };
let ov: Overlay = { posts: {}, albums: {}, log: [] };
function loadOverlay() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) ov = { posts: {}, albums: {}, log: [], ...JSON.parse(raw) }; } catch { /* storage unavailable */ }
}
/** Writes the overlay; on failure (quota) restores the previous state and reports it. */
function persist(prev: string): boolean {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(ov)); return true; } catch {
    ov = JSON.parse(prev);
    toast('Penyimpanan browser penuh. Perkecil atau kurangi gambar, lalu coba lagi.', { error: true });
    return false;
  }
}
const snapshot = () => JSON.stringify(ov);
function allPosts(): Post[] {
  const map = new Map<string, Post>();
  for (const p of seed.posts) map.set(p.id, p);
  for (const [id, p] of Object.entries(ov.posts)) { if (p) map.set(id, p); else map.delete(id); }
  return [...map.values()];
}
const postsOf = (kind: Kind) => allPosts().filter((p) => p.kind === kind);
const getPost = (id: string) => (id in ov.posts ? ov.posts[id] : seed.posts.find((p) => p.id === id)) ?? null;
function allAlbums(): Album[] {
  const map = new Map<string, Album>();
  for (const a of seed.albums) map.set(a.id, a);
  for (const [id, a] of Object.entries(ov.albums)) { if (a) map.set(id, a); else map.delete(id); }
  return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}
const getAlbum = (id: string) => (id in ov.albums ? ov.albums[id] : seed.albums.find((a) => a.id === id)) ?? null;
function log(action: Activity['action'], kind: Activity['kind'], title: string, id: string) {
  ov.log.unshift({ at: Date.now(), action, kind, title, id });
  ov.log = ov.log.slice(0, 40);
}
function savePost(p: Post, action: Activity['action']): boolean {
  const prev = snapshot();
  ov.posts[p.id] = p;
  log(action, p.kind, p.title, p.id);
  return persist(prev);
}
function removePosts(ids: string[]) {
  const prev = snapshot();
  const before = ids.map((id) => [id, id in ov.posts ? ov.posts[id] : undefined] as const);
  for (const id of ids) { const p = getPost(id); if (p) log('delete', p.kind, p.title, id); ov.posts[id] = null; }
  if (!persist(prev)) return null;
  // undo puts each entry back exactly as it was in the overlay
  return () => { const p2 = snapshot(); for (const [id, v] of before) { if (v === undefined) delete ov.posts[id]; else ov.posts[id] = v; } ov.log = ov.log.filter((a) => !(a.action === 'delete' && ids.includes(a.id))); persist(p2); };
}
function saveAlbum(a: Album, action: Activity['action']): boolean {
  const prev = snapshot();
  ov.albums[a.id] = a;
  log(action, 'gallery', a.title, a.id);
  return persist(prev);
}
function removeAlbum(id: string) {
  const prev = snapshot();
  const before = id in ov.albums ? ov.albums[id] : undefined;
  const a = getAlbum(id);
  if (a) log('delete', 'gallery', a.title, id);
  ov.albums[id] = null;
  if (!persist(prev)) return null;
  return () => { const p2 = snapshot(); if (before === undefined) delete ov.albums[id]; else ov.albums[id] = before; ov.log = ov.log.filter((x) => !(x.action === 'delete' && x.id === id)); persist(p2); };
}
const uniqueSlug = (kind: Kind, base: string, self?: string) => {
  let s = base || 'tanpa-judul', n = 2;
  while (allPosts().some((p) => p.kind === kind && p.slug === s && p.id !== self)) s = `${base}-${n++}`;
  return s;
};

/* ---------- images: read a file, scale it down, return a JPEG data URL ---------- */
function readImage(file: File, max = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('type'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load')); };
    img.src = url;
  });
}

/* ---------- toasts ---------- */
function toast(text: string, opts: { error?: boolean; undo?: () => void } = {}) {
  const box = $('[data-toasts]')!;
  const el = document.createElement('div');
  el.className = `toast${opts.error ? ' toast--error' : ''}`;
  el.innerHTML = `${opts.error ? I.alert : I.check}<span class="toast__text">${esc(text)}</span>${opts.undo ? '<button type="button">Urungkan</button>' : ''}`;
  box.append(el);
  const close = () => el.remove();
  el.querySelector('button')?.addEventListener('click', () => { opts.undo!(); close(); render(); toast('Perubahan dibatalkan.'); });
  setTimeout(close, opts.undo ? 7000 : 3500);
}

/* ---------- modal ---------- */
function modal(o: { title: string; text?: string; body?: string; ok: string; danger?: boolean; cancel?: string }): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const root = $('[data-modal-root]')!;
    const prevFocus = document.activeElement as HTMLElement | null;
    root.innerHTML = `<div class="modal-back"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
      <h2 class="modal__title" id="m-title">${esc(o.title)}</h2>${o.text ? `<p class="modal__text">${esc(o.text)}</p>` : ''}${o.body ?? ''}
      <div class="modal__actions"><button class="btn btn--ghost" type="button" data-m="no">${esc(o.cancel ?? 'Batal')}</button><button class="btn ${o.danger ? 'btn--danger' : 'btn--primary'}" type="button" data-m="ok">${esc(o.ok)}</button></div></div></div>`;
    const back = root.firstElementChild as HTMLElement, box = $('.modal', back)!;
    const done = (ok: boolean) => { const r = ok ? box : null; root.innerHTML = ''; document.removeEventListener('keydown', key); prevFocus?.focus(); resolve(r); };
    // the modal's own fields are read before it closes
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') done(false); if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') { e.preventDefault(); resolveWith(); } };
    const resolveWith = () => { const r = box; const vals = $$<HTMLInputElement>('input', box).map((i) => i.value); root.innerHTML = ''; document.removeEventListener('keydown', key); prevFocus?.focus(); (r as HTMLElement).dataset.values = JSON.stringify(vals); resolve(r); };
    document.addEventListener('keydown', key);
    back.addEventListener('click', (e) => { if (e.target === back) done(false); });
    $('[data-m="no"]', box)!.addEventListener('click', () => done(false));
    $('[data-m="ok"]', box)!.addEventListener('click', resolveWith);
    ($('input', box) ?? $('[data-m="ok"]', box))!.focus();
  });
}
const confirmDelete = (what: string, n = 1) => modal({ title: n > 1 ? `Hapus ${n} ${what}?` : `Hapus ${what} ini?`, text: 'Konten yang dihapus tidak lagi tampil di situs. Anda masih bisa mengurungkannya sesaat setelah menghapus.', ok: 'Hapus', danger: true });

/* ---------- router ---------- */
type Route = { name: 'overview' } | { name: 'list'; kind: Kind } | { name: 'edit'; kind: Kind; id?: string } | { name: 'gallery' } | { name: 'album'; id?: string } | { name: 'missing' };
function parse(hash: string): Route {
  const p = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (!p.length) return { name: 'overview' };
  if (p[0] === 'press-release' || p[0] === 'news') {
    const kind = p[0] as Kind;
    if (!p[1]) return { name: 'list', kind };
    if (p[1] === 'baru') return { name: 'edit', kind };
    return { name: 'edit', kind, id: `${kind}/${p[1]}` };
  }
  if (p[0] === 'galeri') return p[1] ? (p[1] === 'baru' ? { name: 'album' } : { name: 'album', id: p[1] }) : { name: 'gallery' };
  return { name: 'missing' };
}
let route: Route = { name: 'overview' };
let cleanups: (() => void)[] = [];
let leaveGuard: (() => boolean) | null = null; // returns true when the page has unsaved changes
let lastHash = location.hash;
let skipHash = false;
window.addEventListener('hashchange', async () => {
  if (skipHash) { skipHash = false; return; }
  if (leaveGuard?.()) {
    const target = location.hash;
    skipHash = true; location.hash = lastHash;
    const ok = await modal({ title: 'Tinggalkan halaman ini?', text: 'Perubahan yang belum disimpan akan hilang.', ok: 'Tinggalkan', danger: true, cancel: 'Tetap di sini' });
    if (!ok) return;
    leaveGuard = null; location.hash = target; return;
  }
  go();
});
window.addEventListener('beforeunload', (e) => { if (leaveGuard?.()) { e.preventDefault(); e.returnValue = ''; } });
function go() {
  lastHash = location.hash;
  route = parse(location.hash);
  leaveGuard = null;
  render();
  $('[data-app]')!.classList.remove('is-nav-open');
  window.scrollTo(0, 0);
}
const nav = (hash: string) => { location.hash = hash; };

/* ---------- shell: sidebar + breadcrumbs ---------- */
function renderNav() {
  const cur = route.name === 'overview' ? 'overview' : route.name === 'gallery' || route.name === 'album' ? 'gallery' : route.name === 'missing' ? '' : route.kind;
  const link = (key: string, href: string, icon: string, label: string, n?: number) =>
    `<a class="side__link" href="${href}"${cur === key ? ' aria-current="page"' : ''}>${icon}<span>${label}</span>${n !== undefined ? `<span class="side__count">${n}</span>` : ''}</a>`;
  $('[data-nav]')!.innerHTML =
    link('overview', '#/', I.home, 'Ringkasan') +
    '<p class="side__group">Artikel</p>' +
    link('press-release', '#/press-release', I.press, 'Press Release', postsOf('press-release').length) +
    link('news', '#/news', I.news, 'Berita', postsOf('news').length) +
    link('gallery', '#/galeri', I.gallery, 'Galeri', allAlbums().length);
}
function crumbs(items: [string, string?][]) {
  $('[data-crumbs]')!.innerHTML = items.map(([label, href], i) => (i === items.length - 1 ? `<span aria-current="page">${esc(label)}</span>` : `<a href="${href}">${esc(label)}</a><span class="sep">/</span>`)).join('');
  document.title = `${items[items.length - 1][0]} | CMS PGN Solution`;
}

/* ---------- view: overview ---------- */
function viewOverview(v: HTMLElement) {
  crumbs([['Ringkasan']]);
  const pr = postsOf('press-release'), nw = postsOf('news'), al = allAlbums();
  const photos = al.reduce((n, a) => n + a.images.length, 0);
  const drafts = [...pr, ...nw].filter((p) => p.status === 'draft');
  const stat = (icon: string, label: string, value: number, meta: string, href: string) =>
    `<a class="card stat" href="${href}"><span class="stat__top">${label}<span class="stat__icon">${icon}</span></span><span class="stat__value">${value}</span><span class="stat__meta">${meta}</span></a>`;
  const pub = (list: Post[]) => list.filter((p) => p.status === 'published').length;
  const latest = [...pr, ...nw].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
  const verb: Record<Activity['action'], string> = { create: 'membuat', update: 'memperbarui', delete: 'menghapus', publish: 'menerbitkan', unpublish: 'menarik ke draf' };
  const where = (k: Activity['kind']) => (k === 'gallery' ? 'album' : KIND_LABEL[k].toLowerCase());
  v.innerHTML = `
    <div class="ph"><div><h1 class="ph__title">Ringkasan</h1><p class="ph__sub">Kelola konten halaman Artikel: press release, berita, dan galeri.</p></div>
      <div class="ph__actions"><a class="btn btn--primary" href="#/press-release/baru">${I.plus}Tulis press release</a></div></div>
    <div class="stats">
      ${stat(I.press, 'Press Release', pr.length, `${pub(pr)} terbit, ${pr.length - pub(pr)} draf`, '#/press-release')}
      ${stat(I.news, 'Berita', nw.length, `${pub(nw)} terbit, ${nw.length - pub(nw)} draf`, '#/news')}
      ${stat(I.gallery, 'Album Galeri', al.length, `${photos} foto`, '#/galeri')}
      ${stat(I.edit, 'Draf', drafts.length, drafts.length ? 'menunggu diterbitkan' : 'tidak ada draf', drafts.length ? `#/${drafts[0].kind}` : '#/press-release')}
    </div>
    <div class="ov">
      <section class="card"><div class="card__head"><h2 class="card__title">Terakhir diperbarui</h2><a class="btn btn--text" href="#/press-release">Lihat semua</a></div>
        <ul class="list">${latest.map((p) => `<li><a class="list__item" href="${editHref(p)}">${thumb(p.image, 'list__thumb')}<span class="list__main"><span class="list__title">${esc(p.title)}</span><span class="list__meta">${KIND_LABEL[p.kind]} · ${fmtDate(p.date)}</span></span>${badge(p.status)}</a></li>`).join('')}</ul></section>
      <div style="display:grid;gap:18px">
        <section class="card"><div class="card__head"><h2 class="card__title">Buat konten</h2></div><div class="card__body quick">
          <a href="#/press-release/baru">${I.press}Press release baru</a><a href="#/news/baru">${I.news}Berita baru</a><a href="#/galeri/baru">${I.gallery}Album galeri baru</a></div></section>
        <section class="card"><div class="card__head"><h2 class="card__title">Aktivitas</h2></div>
          ${ov.log.length ? `<ul class="list">${ov.log.slice(0, 6).map((a) => `<li class="list__item"><span class="activity__dot activity__dot--${a.action}"></span><span class="list__main"><span class="list__title list__title--wrap">Anda ${verb[a.action]} ${where(a.kind)} “${esc(a.title)}”</span><span class="list__meta">${ago(a.at)}</span></span></li>`).join('')}</ul>`
            : `<div class="empty" style="padding:32px 18px"><p style="margin:0">Belum ada aktivitas. Perubahan yang Anda buat akan tercatat di sini.</p></div>`}
        </section>
      </div>
    </div>`;
}
// the public site only has pages for its own content (the CMS is not connected to it)
const onSite = (p: Post) => p.status === 'published' && seed.posts.some((x) => x.id === p.id);
const editHref = (p: Post) => `#/${p.kind}/${encodeURIComponent(p.slug)}`;
const badge = (s: Status) => `<span class="badge badge--${s}">${s === 'published' ? 'Terbit' : 'Draf'}</span>`;

/* ---------- view: list (press release / news) ---------- */
const listState: Record<Kind, { q: string; status: 'all' | Status; sort: 'new' | 'old' | 'az'; page: number; sel: Set<string> }> = {
  'press-release': { q: '', status: 'all', sort: 'new', page: 1, sel: new Set() },
  news: { q: '', status: 'all', sort: 'new', page: 1, sel: new Set() },
};
function viewList(v: HTMLElement, kind: Kind) {
  const st = listState[kind];
  const label = KIND_LABEL[kind];
  crumbs([['Artikel', '#/'], [label]]);
  const all = postsOf(kind);
  const counts = { all: all.length, published: all.filter((p) => p.status === 'published').length, draft: all.filter((p) => p.status === 'draft').length };
  v.innerHTML = `
    <div class="ph"><div><h1 class="ph__title">${label}</h1><p class="ph__sub">${counts.all} ${label.toLowerCase()} di halaman Artikel.</p></div>
      <div class="ph__actions"><a class="btn btn--primary" href="#/${kind}/baru">${I.plus}Tulis ${label.toLowerCase()}</a></div></div>
    <section class="card">
      <div class="tbar">
        <label class="search"><span class="visually-hidden">Cari judul</span>${I.search}<input class="input" type="search" placeholder="Cari judul atau penulis" value="${esc(st.q)}" data-q /></label>
        <div class="seg" role="group" aria-label="Status">${(['all', 'published', 'draft'] as const).map((s) => `<button type="button" aria-pressed="${st.status === s}" data-status="${s}">${{ all: 'Semua', published: 'Terbit', draft: 'Draf' }[s]}<span class="seg__n">${counts[s]}</span></button>`).join('')}</div>
        <div class="tbar__end"><label class="visually-hidden" for="sort">Urutkan</label><select class="select" id="sort" data-sort>
          <option value="new"${st.sort === 'new' ? ' selected' : ''}>Terbaru</option><option value="old"${st.sort === 'old' ? ' selected' : ''}>Terlama</option><option value="az"${st.sort === 'az' ? ' selected' : ''}>Judul A–Z</option></select></div>
      </div>
      <div class="bulk" data-bulk hidden><span class="bulk__n" data-bulk-n></span>
        <button class="btn btn--ghost" type="button" data-bulk-act="published">Terbitkan</button><button class="btn btn--ghost" type="button" data-bulk-act="draft">Jadikan draf</button><button class="btn btn--danger" type="button" data-bulk-act="delete">${I.trash}Hapus</button>
        <button class="btn btn--text" type="button" data-bulk-clear style="margin-left:auto">Batal pilih</button></div>
      <div data-rows></div>
    </section>`;
  const rowsBox = $('[data-rows]', v)!;
  const filtered = () => {
    const q = st.q.trim().toLowerCase();
    let list = all.filter((p) => (st.status === 'all' || p.status === st.status) && (!q || p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)));
    list = list.sort((a, b) => (st.sort === 'az' ? a.title.localeCompare(b.title, 'id') : st.sort === 'old' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date) || b.updatedAt - a.updatedAt));
    return list;
  };
  const drawRows = () => {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    st.page = Math.min(st.page, pages);
    const slice = list.slice((st.page - 1) * PER_PAGE, st.page * PER_PAGE);
    if (!list.length) {
      rowsBox.innerHTML = `<div class="empty"><span class="empty__icon">${I.search}</span><p class="empty__title">${all.length ? 'Tidak ada yang cocok' : `Belum ada ${label.toLowerCase()}`}</p><p style="margin:0">${all.length ? 'Coba kata kunci atau filter status lain.' : 'Mulai dengan menulis yang pertama.'}</p>${all.length ? '' : `<a class="btn btn--primary" href="#/${kind}/baru">${I.plus}Tulis ${label.toLowerCase()}</a>`}</div>`;
    } else {
      const allSel = slice.every((p) => st.sel.has(p.id));
      rowsBox.innerHTML = `<div class="table-wrap"><table class="table"><thead><tr>
        <th class="col-check"><input class="check" type="checkbox" aria-label="Pilih semua di halaman ini" data-sel-all${allSel ? ' checked' : ''} /></th>
        <th class="col-thumb"><span class="visually-hidden">Gambar</span></th><th>Judul</th><th class="col-status">Status</th><th class="col-date col-date-h">Tanggal</th><th class="col-act"><span class="visually-hidden">Aksi</span></th></tr></thead>
        <tbody>${slice.map((p) => `<tr class="${st.sel.has(p.id) ? 'is-selected' : ''}">
          <td class="col-check"><input class="check" type="checkbox" aria-label="Pilih ${esc(p.title)}" data-sel="${esc(p.id)}"${st.sel.has(p.id) ? ' checked' : ''} /></td>
          <td class="col-thumb">${thumb(p.image)}</td>
          <td><a class="row-title" href="${editHref(p)}">${esc(p.title)}</a><span class="row-sub">${esc(p.author)}</span></td>
          <td class="col-status">${badge(p.status)}</td>
          <td class="col-date">${fmtDate(p.date)}</td>
          <td class="col-act"><a class="icon-btn" href="${editHref(p)}" aria-label="Edit">${I.edit}</a><span class="rel"><button class="icon-btn" type="button" aria-label="Aksi lain" aria-haspopup="true" data-menu="${esc(p.id)}">${I.dots}</button>
            <span class="menu-pop" hidden>${onSite(p) ? `<a href="/articles/${p.kind}/${encodeURIComponent(p.slug)}" target="_blank" rel="noopener">${I.ext}Lihat di situs</a>` : ''}
            <button type="button" data-toggle-status="${esc(p.id)}">${p.status === 'published' ? `${I.edit}Jadikan draf` : `${I.check}Terbitkan`}</button>
            <button type="button" class="danger" data-del="${esc(p.id)}">${I.trash}Hapus</button></span></span></td></tr>`).join('')}</tbody></table></div>
        <div class="tfoot"><span>Menampilkan ${(st.page - 1) * PER_PAGE + 1}–${Math.min(st.page * PER_PAGE, list.length)} dari ${list.length}</span>${pagerHtml(st.page, pages)}</div>`;
    }
    const n = st.sel.size;
    $('[data-bulk]', v)!.hidden = !n;
    $('[data-bulk-n]', v)!.textContent = `${n} dipilih`;
  };
  drawRows();
  let qt = 0;
  $('[data-q]', v)!.addEventListener('input', (e) => { clearTimeout(qt); qt = window.setTimeout(() => { st.q = (e.target as HTMLInputElement).value; st.page = 1; drawRows(); }, 150); });
  $('[data-sort]', v)!.addEventListener('change', (e) => { st.sort = (e.target as HTMLSelectElement).value as typeof st.sort; drawRows(); });
  $$('[data-status]', v).forEach((b) => b.addEventListener('click', () => { st.status = b.dataset.status as typeof st.status; st.page = 1; $$('[data-status]', v).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); drawRows(); }));
  v.addEventListener('click', async (e) => {
    const t = e.target as HTMLElement;
    const pg = t.closest<HTMLElement>('[data-page]');
    if (pg) { st.page = Number(pg.dataset.page); drawRows(); rowsBox.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    const menuBtn = t.closest<HTMLElement>('[data-menu]');
    if (menuBtn) { e.stopPropagation(); openMenu(menuBtn); return; }
    const tog = t.closest<HTMLElement>('[data-toggle-status]');
    if (tog) { const p = getPost(tog.dataset.toggleStatus!)!; const next: Status = p.status === 'published' ? 'draft' : 'published'; if (savePost({ ...p, status: next, updatedAt: Date.now() }, next === 'published' ? 'publish' : 'unpublish')) toast(next === 'published' ? 'Diterbitkan.' : 'Dipindahkan ke draf.'); render(); return; }
    const del = t.closest<HTMLElement>('[data-del]');
    if (del) { if (!(await confirmDelete(label.toLowerCase()))) return; const undo = removePosts([del.dataset.del!]); st.sel.delete(del.dataset.del!); render(); if (undo) toast(`${label} dihapus.`, { undo }); return; }
    const act = t.closest<HTMLElement>('[data-bulk-act]');
    if (act) {
      const ids = [...st.sel];
      if (act.dataset.bulkAct === 'delete') { if (!(await confirmDelete(label.toLowerCase(), ids.length))) return; const undo = removePosts(ids); st.sel.clear(); render(); if (undo) toast(`${ids.length} ${label.toLowerCase()} dihapus.`, { undo }); return; }
      const status = act.dataset.bulkAct as Status;
      const prev = snapshot();
      for (const id of ids) { const p = getPost(id); if (p && p.status !== status) { ov.posts[id] = { ...p, status, updatedAt: Date.now() }; log(status === 'published' ? 'publish' : 'unpublish', kind, p.title, id); } }
      if (persist(prev)) toast(status === 'published' ? `${ids.length} diterbitkan.` : `${ids.length} dipindahkan ke draf.`);
      st.sel.clear(); render(); return;
    }
    if (t.closest('[data-bulk-clear]')) { st.sel.clear(); drawRows(); }
  });
  v.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-sel]')) { t.checked ? st.sel.add(t.dataset.sel!) : st.sel.delete(t.dataset.sel!); drawRows(); }
    if (t.matches('[data-sel-all]')) { $$<HTMLInputElement>('[data-sel]', v).forEach((c) => (t.checked ? st.sel.add(c.dataset.sel!) : st.sel.delete(c.dataset.sel!))); drawRows(); }
  });
}
function pagerHtml(cur: number, pages: number) {
  if (pages < 2) return '';
  const nums: (number | '…')[] = [];
  for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - cur) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…');
  return `<nav class="pager" aria-label="Halaman"><button type="button" aria-label="Sebelumnya" data-page="${cur - 1}"${cur === 1 ? ' disabled' : ''}>${I.chevL}</button>${nums.map((n) => (n === '…' ? '<button type="button" disabled>…</button>' : `<button type="button" data-page="${n}"${n === cur ? ' aria-current="page"' : ''}>${n}</button>`)).join('')}<button type="button" aria-label="Berikutnya" data-page="${cur + 1}"${cur === pages ? ' disabled' : ''}>${I.chevR}</button></nav>`;
}
function openMenu(btn: HTMLElement) {
  const pop = btn.nextElementSibling as HTMLElement;
  const open = pop.hidden;
  $$('.menu-pop').forEach((m) => (m.hidden = true));
  pop.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
}
document.addEventListener('click', (e) => { if (!(e.target as HTMLElement).closest('.menu-pop')) $$('.menu-pop').forEach((m) => (m.hidden = true)); });

/* ---------- view: editor (press release / news) ---------- */
function viewEdit(v: HTMLElement, kind: Kind, id?: string) {
  const existing = id ? getPost(id) : null;
  if (id && !existing) return viewMissing(v);
  const label = KIND_LABEL[kind];
  const isNew = !existing;
  const d: Post = existing ? { ...existing } : { id: '', kind, title: '', slug: '', date: today(), status: 'draft', image: null, excerpt: '', body: '', author: 'Admin Komunikasi', updatedAt: Date.now() };
  let slugTouched = !isNew;
  let excerptTouched = !isNew && d.excerpt !== excerptOf(d.body);
  let dirty = false;
  crumbs([['Artikel', '#/'], [label, `#/${kind}`], [isNew ? `${label} baru` : 'Edit']]);
  const tool = (cmd: string, icon: string, title: string, val = '') => `<button class="icon-btn" type="button" data-cmd="${cmd}"${val ? ` data-val="${val}"` : ''} title="${title}" aria-label="${title}">${icon}</button>`;
  v.innerHTML = `
    <div class="ed__bar">
      <div class="ed__state"><a class="btn btn--text" href="#/${kind}">${I.back}${label}</a>${isNew ? '' : badge(d.status)}<span data-dirty></span></div>
      <div class="ph__actions">
        ${!isNew && onSite(d) ? `<a class="btn btn--ghost" href="/articles/${kind}/${encodeURIComponent(d.slug)}" target="_blank" rel="noopener">${I.ext}Lihat di situs</a>` : ''}
        ${!isNew ? `<button class="btn btn--text" type="button" data-delete style="color:var(--red)">${I.trash}Hapus</button>` : ''}
        <button class="btn btn--ghost" type="button" data-preview>${I.eye}Pratinjau</button>
        <button class="btn btn--ghost" type="button" data-save="draft">${d.status === 'published' && !isNew ? 'Jadikan draf' : 'Simpan draf'}</button>
        <button class="btn btn--primary" type="button" data-save="published">${d.status === 'published' && !isNew ? 'Perbarui' : 'Terbitkan'}</button>
      </div>
    </div>
    <div class="ed">
      <div class="card ed__main">
        <div class="field" data-f="title"><label class="visually-hidden" for="f-title">Judul</label>
          <textarea class="ed__title" id="f-title" rows="1" placeholder="Judul ${label.toLowerCase()}" data-title>${esc(d.title)}</textarea><span class="hint hint--error" data-err="title" hidden>Judul wajib diisi.</span></div>
        <div class="ed__slug"><span>pgn-solution.co.id/articles/${kind}/</span><label class="visually-hidden" for="f-slug">Slug</label><input id="f-slug" value="${esc(d.slug)}" placeholder="slug-otomatis" data-slug /></div>
        <div class="rte">
          <div class="rte__tools" role="toolbar" aria-label="Format teks">
            ${tool('bold', I.bold, 'Tebal (Ctrl+B)')}${tool('italic', I.italic, 'Miring (Ctrl+I)')}${tool('underline', I.underline, 'Garis bawah (Ctrl+U)')}<span class="rte__sep"></span>
            ${tool('formatBlock', I.h, 'Subjudul', 'H3')}${tool('formatBlock', I.quote, 'Kutipan', 'BLOCKQUOTE')}${tool('insertUnorderedList', I.ul, 'Daftar poin')}${tool('insertOrderedList', I.ol, 'Daftar bernomor')}<span class="rte__sep"></span>
            ${tool('link', I.link, 'Sisipkan tautan')}${tool('removeFormat', I.clear, 'Hapus format')}<span class="rte__sep"></span>${tool('undo', I.undo, 'Urungkan')}${tool('redo', I.redo, 'Ulangi')}
          </div>
          <div class="rte__area prose" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Isi artikel" data-placeholder="Tulis isi ${label.toLowerCase()} di sini…" data-body>${d.body}</div>
          <div class="rte__foot"><span data-words></span><span>Ctrl+S untuk menyimpan</span></div>
        </div>
      </div>
      <aside class="ed__side">
        <section class="card"><div class="card__head"><h2 class="card__title">Gambar sampul</h2></div><div class="card__body" data-cover></div></section>
        <section class="card"><div class="card__head"><h2 class="card__title">Publikasi</h2></div><div class="card__body">
          <dl class="meta-rows"><div><dt>Status</dt><dd>${isNew ? 'Belum disimpan' : d.status === 'published' ? 'Terbit' : 'Draf'}</dd></div>${isNew ? '' : `<div><dt>Terakhir disimpan</dt><dd>${ago(d.updatedAt)}</dd></div>`}</dl>
          <div class="field" style="margin-top:14px" data-f="date"><label class="label" for="f-date">Tanggal terbit</label><input class="input" type="date" id="f-date" value="${esc(d.date)}" data-date /><span class="hint hint--error" data-err="date" hidden>Tanggal wajib diisi.</span></div>
          <div class="field"><label class="label" for="f-author">Penulis</label><input class="input" id="f-author" value="${esc(d.author)}" data-author /></div>
        </div></section>
        <section class="card"><div class="card__head"><h2 class="card__title">Kategori</h2></div><div class="card__body">
          <div class="radio-row">${(['press-release', 'news'] as Kind[]).map((k) => `<label><input type="radio" name="kind" value="${k}"${k === kind ? ' checked' : ''} data-kind />${KIND_LABEL[k]}</label>`).join('')}</div>
        </div></section>
        <section class="card"><div class="card__head"><h2 class="card__title">Ringkasan</h2></div><div class="card__body">
          <div class="field"><label class="visually-hidden" for="f-ex">Ringkasan</label><textarea class="textarea" id="f-ex" maxlength="300" placeholder="Diisi otomatis dari paragraf pertama" data-excerpt>${esc(d.excerpt)}</textarea>
          <span class="hint" data-ex-n></span></div>
        </div></section>
      </aside>
    </div>`;
  const titleEl = $<HTMLTextAreaElement>('[data-title]', v)!, slugEl = $<HTMLInputElement>('[data-slug]', v)!, bodyEl = $('[data-body]', v)!, exEl = $<HTMLTextAreaElement>('[data-excerpt]', v)!;
  const grow = () => { titleEl.style.height = 'auto'; titleEl.style.height = `${titleEl.scrollHeight}px`; };
  const setDirty = (on = true) => { dirty = on; $('[data-dirty]', v)!.innerHTML = on ? '<span class="ed__dirty">Belum disimpan</span>' : ''; };
  const words = () => { const n = textOf(bodyEl.innerHTML).split(' ').filter(Boolean).length; $('[data-words]', v)!.textContent = `${n} kata · ±${Math.max(1, Math.round(n / 200))} menit baca`; };
  const exCount = () => { $('[data-ex-n]', v)!.textContent = `${exEl.value.length}/300 karakter${excerptTouched ? '' : ' · otomatis'}`; };
  const drawCover = () => {
    const box = $('[data-cover]', v)!;
    box.innerHTML = d.image
      ? `<div class="cover"><img src="${esc(d.image)}" alt="Gambar sampul" /><div class="cover__actions"><button type="button" data-cover-change>Ganti</button><button type="button" data-cover-remove>Hapus</button></div></div><input type="file" accept="image/*" hidden data-cover-file />`
      : `<label class="drop" data-drop>${I.upload}<span><strong>Unggah gambar</strong> atau tarik ke sini</span><span class="hint">JPG atau PNG, rasio 16:10 disarankan</span><input type="file" accept="image/*" data-cover-file /></label>`;
    const file = $<HTMLInputElement>('[data-cover-file]', box)!;
    const take = async (f?: File | null) => { if (!f) return; try { d.image = await readImage(f); setDirty(); drawCover(); } catch { toast('File itu bukan gambar yang bisa dibaca.', { error: true }); } };
    file.addEventListener('change', () => take(file.files?.[0]));
    $('[data-cover-change]', box)?.addEventListener('click', () => file.click());
    $('[data-cover-remove]', box)?.addEventListener('click', () => { d.image = null; setDirty(); drawCover(); });
    const drop = $('[data-drop]', box);
    if (drop) {
      drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
      drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); take((e as DragEvent).dataTransfer?.files[0]); });
    }
  };
  grow(); words(); exCount(); drawCover();
  if (isNew) titleEl.focus();
  leaveGuard = () => dirty;

  titleEl.addEventListener('input', () => { grow(); setDirty(); $('[data-f="title"]', v)!.classList.remove('is-invalid'); $('[data-err="title"]', v)!.hidden = true; if (!slugTouched) slugEl.value = slugify(titleEl.value); });
  titleEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); bodyEl.focus(); } });
  slugEl.addEventListener('input', () => { slugTouched = true; setDirty(); });
  slugEl.addEventListener('blur', () => { slugEl.value = slugify(slugEl.value); });
  bodyEl.addEventListener('input', () => { setDirty(); words(); if (!excerptTouched) { exEl.value = excerptOf(bodyEl.innerHTML); exCount(); } });
  exEl.addEventListener('input', () => { excerptTouched = exEl.value.trim() !== ''; setDirty(); exCount(); });
  $$('[data-date], [data-author], [data-kind]', v).forEach((el) => el.addEventListener('input', () => setDirty()));
  // keep the toolbar's bold/italic state in step with the caret
  const syncTools = () => {
    const sel = window.getSelection();
    const inside = !!sel?.anchorNode && bodyEl.contains(sel.anchorNode);
    $$<HTMLElement>('[data-cmd="bold"],[data-cmd="italic"],[data-cmd="underline"]', v).forEach((b) => b.setAttribute('aria-pressed', String(inside && document.queryCommandState(b.dataset.cmd!))));
  };
  document.addEventListener('selectionchange', syncTools);
  cleanups.push(() => document.removeEventListener('selectionchange', syncTools));
  $$<HTMLElement>('[data-cmd]', v).forEach((b) => {
    b.addEventListener('mousedown', (e) => e.preventDefault()); // keep the selection in the editor
    b.addEventListener('click', async () => {
      bodyEl.focus();
      const cmd = b.dataset.cmd!;
      if (cmd === 'link') {
        const sel = window.getSelection();
        const range = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
        const r = await modal({ title: 'Sisipkan tautan', body: '<div class="field"><label class="label" for="m-url">Alamat (URL)</label><input class="input" id="m-url" type="url" placeholder="https://" /></div>', ok: 'Sisipkan' });
        const url = r ? (JSON.parse(r.dataset.values || '[]')[0] || '').trim() : '';
        if (!url || !range) return;
        bodyEl.focus(); sel!.removeAllRanges(); sel!.addRange(range);
        document.execCommand(range.collapsed ? 'insertHTML' : 'createLink', false, range.collapsed ? `<a href="${esc(url)}">${esc(url)}</a>` : url);
      } else if (cmd === 'formatBlock') {
        const cur = document.queryCommandValue('formatBlock').toUpperCase();
        document.execCommand('formatBlock', false, cur === b.dataset.val ? 'P' : b.dataset.val);
      } else document.execCommand(cmd);
      setDirty(); words(); syncTools();
    });
  });

  const collect = (status: Status): Post | null => {
    let ok = true;
    const title = titleEl.value.replace(/\s+/g, ' ').trim();
    const date = $<HTMLInputElement>('[data-date]', v)!.value;
    $('[data-f="title"]', v)!.classList.toggle('is-invalid', !title); $('[data-err="title"]', v)!.hidden = !!title;
    $('[data-f="date"]', v)!.classList.toggle('is-invalid', !date); $('[data-err="date"]', v)!.hidden = !!date;
    if (!title || !date) ok = false;
    if (!ok) { (title ? $('[data-date]', v) : titleEl)!.focus(); toast('Lengkapi isian yang ditandai.', { error: true }); return null; }
    const newKind = ($<HTMLInputElement>('[data-kind]:checked', v)!.value as Kind);
    const slug = uniqueSlug(newKind, slugify(slugEl.value || title), existing?.kind === newKind ? existing?.id : undefined);
    const body = bodyEl.innerHTML.trim();
    return { ...d, kind: newKind, id: `${newKind}/${slug}`, slug, title, date, status, body, author: $<HTMLInputElement>('[data-author]', v)!.value.trim() || 'Admin Komunikasi', excerpt: exEl.value.trim() || excerptOf(body), updatedAt: Date.now() };
  };
  const save = (status: Status) => {
    const p = collect(status);
    if (!p) return;
    const prev = snapshot();
    // a new slug or category means a new id: the old record goes
    if (existing && existing.id !== p.id) ov.posts[existing.id] = null;
    const action: Activity['action'] = isNew ? 'create' : status !== existing!.status ? (status === 'published' ? 'publish' : 'unpublish') : 'update';
    ov.posts[p.id] = p; log(action, p.kind, p.title, p.id);
    if (!persist(prev)) return;
    setDirty(false); leaveGuard = null;
    toast(status === 'published' ? (isNew || existing?.status !== 'published' ? `${KIND_LABEL[p.kind]} diterbitkan.` : 'Perubahan disimpan.') : 'Disimpan sebagai draf.');
    const target = editHref(p);
    if (location.hash !== target) { skipHash = false; location.hash = target; } else render();
  };
  $$<HTMLElement>('[data-save]', v).forEach((b) => b.addEventListener('click', () => save(b.dataset.save as Status)));
  $('[data-preview]', v)!.addEventListener('click', () => {
    const body = bodyEl.innerHTML.trim();
    previewPost({ ...d, kind: ($<HTMLInputElement>('[data-kind]:checked', v)!.value as Kind), title: titleEl.value.replace(/\s+/g, ' ').trim(), date: $<HTMLInputElement>('[data-date]', v)!.value || today(), author: $<HTMLInputElement>('[data-author]', v)!.value.trim() || 'Admin Komunikasi', body, excerpt: exEl.value.trim() || excerptOf(body) });
  });
  const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(existing?.status ?? 'draft'); } };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));
  $('[data-delete]', v)?.addEventListener('click', async () => {
    if (!(await confirmDelete(label.toLowerCase()))) return;
    const undo = removePosts([existing!.id]);
    leaveGuard = null; dirty = false;
    if (undo) { nav(`#/${kind}`); toast(`${label} dihapus.`, { undo }); }
  });
}

/* ---------- view: gallery ---------- */
function viewGallery(v: HTMLElement) {
  crumbs([['Artikel', '#/'], ['Galeri']]);
  const albums = allAlbums();
  v.innerHTML = `
    <div class="ph"><div><h1 class="ph__title">Galeri</h1><p class="ph__sub">${albums.length} album, ${albums.reduce((n, a) => n + a.images.length, 0)} foto.</p></div>
      <div class="ph__actions"><a class="btn btn--primary" href="#/galeri/baru">${I.plus}Album baru</a></div></div>
    ${albums.length ? `<div class="albums">${albums.map((a) => `
      <article class="card album">
        <div class="album__cover">${a.images[0] ? `<img src="${esc(a.images[0])}" alt="" loading="lazy" />` : ''}<span class="album__n">${a.images.length} foto</span></div>
        <div class="album__body"><div style="flex:1;min-width:0"><h2 class="album__title">${esc(a.title)}</h2><p class="album__meta">Diperbarui ${ago(a.updatedAt)}</p></div>
          <span class="rel album__menu"><button class="icon-btn" type="button" aria-label="Aksi album" aria-haspopup="true" data-menu>${I.dots}</button>
            <span class="menu-pop" hidden><a href="#/galeri/${encodeURIComponent(a.id)}">${I.edit}Edit album</a><button type="button" class="danger" data-del-album="${esc(a.id)}">${I.trash}Hapus</button></span></span></div>
        <a href="#/galeri/${encodeURIComponent(a.id)}" aria-label="Edit ${esc(a.title)}"></a>
      </article>`).join('')}</div>`
      : `<div class="card empty"><span class="empty__icon">${I.gallery}</span><p class="empty__title">Belum ada album</p><p style="margin:0">Buat album untuk menampilkan foto proyek di halaman Artikel.</p><a class="btn btn--primary" href="#/galeri/baru">${I.plus}Album baru</a></div>`}`;
  v.addEventListener('click', async (e) => {
    const t = e.target as HTMLElement;
    const m = t.closest<HTMLElement>('[data-menu]');
    if (m) { e.preventDefault(); e.stopPropagation(); openMenu(m); return; }
    const del = t.closest<HTMLElement>('[data-del-album]');
    if (del) { e.preventDefault(); if (!(await confirmDelete('album'))) return; const undo = removeAlbum(del.dataset.delAlbum!); render(); if (undo) toast('Album dihapus.', { undo }); }
  });
}

/* ---------- view: album editor ---------- */
function viewAlbum(v: HTMLElement, id?: string) {
  const existing = id ? getAlbum(id) : null;
  if (id && !existing) return viewMissing(v);
  const isNew = !existing;
  const a: Album = existing ? { ...existing, images: [...existing.images] } : { id: '', title: '', images: [], updatedAt: Date.now() };
  let dirty = false;
  crumbs([['Artikel', '#/'], ['Galeri', '#/galeri'], [isNew ? 'Album baru' : 'Edit album']]);
  v.innerHTML = `
    <div class="ed__bar">
      <div class="ed__state"><a class="btn btn--text" href="#/galeri">${I.back}Galeri</a><span data-dirty></span></div>
      <div class="ph__actions">${!isNew ? `<button class="btn btn--text" type="button" data-delete style="color:var(--red)">${I.trash}Hapus album</button>` : ''}<button class="btn btn--ghost" type="button" data-preview>${I.eye}Pratinjau</button><button class="btn btn--primary" type="button" data-save>${isNew ? 'Simpan album' : 'Simpan perubahan'}</button></div>
    </div>
    <div class="card ed__main" style="margin-bottom:18px">
      <div class="field" data-f="title"><label class="label" for="a-title">Judul album</label><input class="input" id="a-title" value="${esc(a.title)}" placeholder="Contoh: Pembangunan Pipa Gas Senipah–Balikpapan" data-title /><span class="hint hint--error" data-err hidden>Judul album wajib diisi.</span></div>
    </div>
    <section class="card"><div class="card__head"><h2 class="card__title">Foto <span class="hint" data-n></span></h2><span class="hint">Seret untuk mengubah urutan. Foto pertama menjadi sampul.</span></div>
      <div class="card__body"><div class="photos" data-photos></div></div></section>`;
  const grid = $('[data-photos]', v)!;
  const setDirty = (on = true) => { dirty = on; $('[data-dirty]', v)!.innerHTML = on ? '<span class="ed__dirty">Belum disimpan</span>' : ''; };
  leaveGuard = () => dirty;
  let dragFrom = -1;
  const draw = () => {
    $('[data-n]', v)!.textContent = `· ${a.images.length}`;
    grid.innerHTML = a.images.map((src, i) => `
      <figure class="photo" draggable="true" data-i="${i}" style="margin:0">
        <img src="${esc(src)}" alt="Foto ${i + 1}" loading="lazy" />${i === 0 ? '<span class="photo__tag">Sampul</span>' : ''}<span class="photo__no">${i + 1}</span>
        <span class="photo__acts">${i ? `<button type="button" title="Jadikan sampul" aria-label="Jadikan foto ${i + 1} sampul" data-cover-i="${i}">${I.star}</button>` : ''}<button type="button" class="danger" title="Hapus foto" aria-label="Hapus foto ${i + 1}" data-rm="${i}">${I.trash}</button></span>
      </figure>`).join('') + `<label class="photo photo--add" data-add>${I.upload}<span style="display:block;margin-top:6px;font-weight:600">Tambah foto</span><span class="hint">Bisa pilih beberapa sekaligus</span><input type="file" accept="image/*" multiple hidden data-files /></label>`;
    const input = $<HTMLInputElement>('[data-files]', grid)!;
    input.addEventListener('change', () => addFiles(input.files));
  };
  const addFiles = async (files: FileList | null | undefined) => {
    if (!files?.length) return;
    let bad = 0;
    for (const f of Array.from(files)) { try { a.images.push(await readImage(f, 1400)); } catch { bad++; } }
    setDirty(); draw();
    if (bad) toast(`${bad} file dilewati karena bukan gambar.`, { error: true });
  };
  draw();
  if (isNew) $<HTMLInputElement>('[data-title]', v)!.focus();
  $('[data-title]', v)!.addEventListener('input', () => { setDirty(); $('[data-f="title"]', v)!.classList.remove('is-invalid'); $('[data-err]', v)!.hidden = true; });
  grid.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const rm = t.closest<HTMLElement>('[data-rm]');
    if (rm) { a.images.splice(Number(rm.dataset.rm), 1); setDirty(); draw(); return; }
    const cv = t.closest<HTMLElement>('[data-cover-i]');
    if (cv) { const [img] = a.images.splice(Number(cv.dataset.coverI), 1); a.images.unshift(img); setDirty(); draw(); }
  });
  // drag to reorder; files dropped onto the grid are added
  grid.addEventListener('dragstart', (e) => { const f = (e.target as HTMLElement).closest<HTMLElement>('[data-i]'); if (!f) return; dragFrom = Number(f.dataset.i); f.classList.add('is-dragging'); e.dataTransfer!.effectAllowed = 'move'; });
  grid.addEventListener('dragover', (e) => { e.preventDefault(); $$('.photo.is-target', grid).forEach((x) => x.classList.remove('is-target')); (e.target as HTMLElement).closest('[data-i]')?.classList.add('is-target'); });
  grid.addEventListener('dragend', () => { dragFrom = -1; $$('.is-dragging, .is-target', grid).forEach((x) => x.classList.remove('is-dragging', 'is-target')); });
  grid.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files.length) { addFiles(e.dataTransfer.files); return; }
    const to = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    if (dragFrom < 0 || !to) return;
    const [img] = a.images.splice(dragFrom, 1);
    a.images.splice(Number(to.dataset.i), 0, img);
    dragFrom = -1; setDirty(); draw();
  });
  $('[data-preview]', v)!.addEventListener('click', () => previewAlbum({ ...a, title: $<HTMLInputElement>('[data-title]', v)!.value.trim() }));
  $('[data-save]', v)!.addEventListener('click', () => {
    const title = $<HTMLInputElement>('[data-title]', v)!.value.trim();
    if (!title) { $('[data-f="title"]', v)!.classList.add('is-invalid'); $('[data-err]', v)!.hidden = false; $<HTMLInputElement>('[data-title]', v)!.focus(); toast('Judul album wajib diisi.', { error: true }); return; }
    let albumId = a.id;
    if (!albumId) { const base = slugify(title) || 'album'; albumId = base; let n = 2; while (getAlbum(albumId)) albumId = `${base}-${n++}`; }
    if (!saveAlbum({ ...a, id: albumId, title, updatedAt: Date.now() }, isNew ? 'create' : 'update')) return;
    setDirty(false); leaveGuard = null;
    toast(isNew ? 'Album dibuat.' : 'Album disimpan.');
    if (isNew) nav(`#/galeri/${encodeURIComponent(albumId)}`); else render();
  });
  $('[data-delete]', v)?.addEventListener('click', async () => {
    if (!(await confirmDelete('album'))) return;
    const undo = removeAlbum(existing!.id);
    leaveGuard = null; dirty = false;
    if (undo) { nav('#/galeri'); toast('Album dihapus.', { undo }); }
  });
}

function viewMissing(v: HTMLElement) {
  crumbs([['Tidak ditemukan']]);
  v.innerHTML = `<div class="card empty"><span class="empty__icon">${I.alert}</span><p class="empty__title">Konten tidak ditemukan</p><p style="margin:0">Mungkin sudah dihapus atau alamatnya berubah.</p><a class="btn btn--ghost" href="#/">Kembali ke Ringkasan</a></div>`;
}

/* ---------- render + start ---------- */
function render() {
  cleanups.forEach((f) => f()); cleanups = [];
  // a fresh view element drops the previous view's listeners
  const old = $('[data-view]')!;
  const v = old.cloneNode(false) as HTMLElement;
  old.replaceWith(v);
  renderNav();
  switch (route.name) {
    case 'overview': viewOverview(v); break;
    case 'list': viewList(v, route.kind); break;
    case 'edit': viewEdit(v, route.kind, route.id); break;
    case 'gallery': viewGallery(v); break;
    case 'album': viewAlbum(v, route.id); break;
    default: viewMissing(v);
  }
}
$('[data-side-toggle]')?.addEventListener('click', () => $('[data-app]')!.classList.toggle('is-nav-open'));
document.addEventListener('click', (e) => { const app = $('[data-app]')!; if (app.classList.contains('is-nav-open') && !(e.target as HTMLElement).closest('[data-side], [data-side-toggle]')) app.classList.remove('is-nav-open'); });

(async () => {
  loadOverlay();
  try {
    const res = await fetch('/cms/seed.json');
    seed = await res.json();
  } catch {
    $('[data-view]')!.innerHTML = `<div class="card empty"><span class="empty__icon">${I.alert}</span><p class="empty__title">Konten gagal dimuat</p><p style="margin:0">Periksa koneksi, lalu muat ulang halaman.</p><button class="btn btn--ghost" type="button" onclick="location.reload()">Muat ulang</button></div>`;
    return;
  }
  go();
})();

/* ---------- preview: the real public page in a frame, filled with the editor's current content ---------- */
interface PreviewTab { label: string; src: string; apply: (doc: Document) => void }
function openPreview(title: string, tabs: PreviewTab[]) {
  const root = document.createElement('div');
  root.className = 'pv';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `Pratinjau: ${title}`);
  root.innerHTML = `
    <div class="pv__bar">
      <div class="pv__title"><span class="pv__label">Pratinjau</span><span class="pv__name">${esc(title || 'Tanpa judul')}</span></div>
      ${tabs.length > 1 ? `<div class="seg" role="group" aria-label="Tampilan">${tabs.map((t, i) => `<button type="button" aria-pressed="${i === 0}" data-pv-tab="${i}">${esc(t.label)}</button>`).join('')}</div>` : `<span class="hint">${esc(tabs[0].label)}</span>`}
      <div class="pv__end">
        <div class="seg" role="group" aria-label="Ukuran layar"><button type="button" aria-pressed="true" data-pv-dev="desktop">Desktop</button><button type="button" aria-pressed="false" data-pv-dev="mobile">Mobile</button></div>
        <button class="btn btn--ghost" type="button" data-pv-close>Tutup</button>
      </div>
    </div>
    <div class="pv__stage" data-pv-stage><div class="pv__frame" data-pv-frame><iframe title="Pratinjau halaman" data-pv-iframe></iframe><div class="pv__loading" data-pv-loading><span class="spinner"></span>Menyiapkan pratinjau…</div></div></div>
    <p class="pv__note">Pratinjau memakai tampilan situs dengan isi yang sedang Anda edit, termasuk yang belum disimpan.</p>`;
  document.body.append(root);
  document.body.style.overflow = 'hidden';
  const frame = $<HTMLIFrameElement>('[data-pv-iframe]', root)!;
  const loading = $('[data-pv-loading]', root)!;
  let tab = 0;
  const load = () => {
    loading.hidden = false;
    frame.style.visibility = 'hidden';
    // a fresh query each time, so switching width or tab always reloads (a hash change alone would not)
    const [path, hash = ''] = tabs[tab].src.split('#');
    frame.src = `${path}?pv=${Date.now()}${hash ? `#${hash}` : ''}`;
  };
  frame.addEventListener('load', () => {
    const doc = frame.contentDocument;
    if (!doc) return;
    // the site's scripts settle the page first; then the draft goes in
    setTimeout(() => {
      try { tabs[tab].apply(doc); } catch { /* the page changed shape; show it as is */ }
      // links inside the preview stay inside it (no navigation away from the draft)
      doc.addEventListener('click', (e) => { const a = (e.target as HTMLElement).closest('a'); if (a && !a.hasAttribute('data-lightbox')) e.preventDefault(); }, true);
      loading.hidden = true;
      frame.style.visibility = 'visible';
    }, 350);
  });
  const close = () => { root.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', key); };
  const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', key);
  $('[data-pv-close]', root)!.addEventListener('click', close);
  $$<HTMLElement>('[data-pv-tab]', root).forEach((b) => b.addEventListener('click', () => {
    tab = Number(b.dataset.pvTab); $$('[data-pv-tab]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); load();
  }));
  $$<HTMLElement>('[data-pv-dev]', root).forEach((b) => b.addEventListener('click', () => {
    $$('[data-pv-dev]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('[data-pv-frame]', root)!.classList.toggle('is-mobile', b.dataset.pvDev === 'mobile');
    load(); // reload so the page lays itself out for the new width
  }));
  load();
  $<HTMLElement>('[data-pv-close]', root)!.focus();
}

/** Puts a post into the public article template and into its card on the Artikel page. */
function previewPost(p: Post) {
  const template = seed.posts.find((x) => x.id === p.id) ?? seed.posts.find((x) => x.kind === p.kind && x.image) ?? seed.posts[0];
  const label = KIND_LABEL[p.kind];
  const pageTab: PreviewTab = {
    label: 'Halaman artikel',
    src: `/articles/${template.kind}/${encodeURIComponent(template.slug)}/`,
    apply: (doc) => {
      doc.title = `${p.title || 'Tanpa judul'} | PGN Solution`;
      const h1 = doc.querySelector('.ad-title'); if (h1) h1.textContent = p.title || 'Tanpa judul';
      const meta = doc.querySelector('.ad-head .t-mono'); if (meta) meta.innerHTML = `<span style="color:var(--blue-ink)">${esc(label)}</span>&nbsp;&nbsp;·&nbsp;&nbsp;<time>${fmtDate(p.date)}</time>`;
      doc.querySelector('.ad-note')?.remove();
      const band = doc.querySelector<HTMLElement>('.pband');
      const img = band?.querySelector('img');
      if (band && img) { if (p.image) { img.removeAttribute('srcset'); img.src = p.image; } else band.remove(); }
      const dds = doc.querySelectorAll('.ad-meta dd');
      if (dds[0]) dds[0].innerHTML = `<a class="text-link" href="#">${esc(label)}</a>`;
      if (dds[1]) dds[1].textContent = fmtDate(p.date);
      if (dds[2]) dds[2].textContent = p.author;
      const body = doc.querySelector('.ad-prose'); if (body) body.innerHTML = p.body || '<p><em>Belum ada isi.</em></p>';
    },
  };
  const cardTab: PreviewTab = {
    label: 'Kartu di halaman Artikel',
    src: `/articles/#${p.kind}`,
    apply: (doc) => {
      const panel = doc.getElementById(p.kind);
      const card = panel?.querySelector<HTMLElement>('.art-card');
      if (!card) return;
      let bg = card.querySelector<HTMLImageElement>('.art-card__bg');
      if (p.image) { if (!bg) { bg = doc.createElement('img'); bg.className = 'art-card__bg'; bg.alt = ''; card.prepend(bg); } bg.src = p.image; } else bg?.remove();
      card.querySelector('.art-card__badge')!.textContent = label;
      card.querySelector('.art-card__title')!.textContent = p.title || 'Tanpa judul';
      card.querySelector('.art-card__excerpt')!.textContent = p.excerpt || excerptOf(p.body);
      card.querySelector('.art-card__date')!.textContent = fmtDate(p.date);
      card.style.boxShadow = '0 0 0 3px #1a90ca, 0 0 0 7px rgba(26,144,202,.25)';
      card.scrollIntoView({ block: 'center' });
    },
  };
  openPreview(p.title, [pageTab, cardTab]);
}

/** Puts an album into the first card of the Galeri tab; its button opens the album's photos. */
function previewAlbum(a: Album) {
  openPreview(a.title, [{
    label: 'Kartu dan lightbox di Galeri',
    src: '/articles/#gallery',
    apply: (doc) => {
      const card = doc.querySelector<HTMLElement>('#gallery .art-card');
      if (!card) return;
      const bg = card.querySelector<HTMLImageElement>('.art-card__bg');
      if (bg) { if (a.images[0]) bg.src = a.images[0]; else bg.remove(); }
      card.querySelector('.art-card__badge')!.textContent = `${a.images.length} foto`;
      card.querySelector('.art-card__title')!.textContent = a.title || 'Tanpa judul';
      const btn = card.querySelector<HTMLElement>('[data-album]');
      if (btn) { btn.dataset.album = a.title; btn.dataset.albumImages = JSON.stringify(a.images); }
      card.style.boxShadow = '0 0 0 3px #1a90ca, 0 0 0 7px rgba(26,144,202,.25)';
      card.scrollIntoView({ block: 'center' });
    },
  }]);
}
