import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const html = document.documentElement;

/* ------------------------------------------------------------------ */
/* Smooth scroll (one instance for the whole session)                  */
/* ------------------------------------------------------------------ */
const lenis = reduceMotion ? null : new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
if (lenis) {
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
/* Words the scripts write into the page, per <html lang> (Indonesian default, English under /en) */
const T_ID = {
  closeMenu: 'Tutup menu', openMenu: 'Buka menu', cvPdf: 'Resume/CV harus berupa file PDF.', sent: 'Terima kasih. Pesan Anda telah terkirim.',
  notSent: (m: string) => `Pesan belum terkirim. Coba lagi, atau kirim email ke ${m}.`, attach: (f: string) => `Lampirkan file CV Anda (${f}) pada email ini sebelum dikirim.`,
  subject: 'Pesan dari website', mailCareer: 'Aplikasi email Anda terbuka dengan data lamaran. Lampirkan CV Anda, lalu kirim.',
  mailContact: 'Aplikasi email Anda terbuka dengan pesan yang sudah terisi. Kirim email tersebut untuk menyelesaikan.', copied: 'Tautan disalin',
  docs: (a: number, b: number, n: number) => `Menampilkan dokumen ${a}–${b} dari ${n}.`, logos: (a: number, b: number, n: number) => `Menampilkan logo ${a}–${b} dari ${n} klien dan mitra PT PGAS Solution.`,
  close: 'Tutup', readMore: 'Baca selengkapnya',
};
const T_EN: typeof T_ID = {
  closeMenu: 'Close menu', openMenu: 'Open menu', cvPdf: 'The Resume/CV must be a PDF file.', sent: 'Thank you. Your message has been sent.',
  notSent: (m: string) => `Your message was not sent. Try again, or email ${m}.`, attach: (f: string) => `Attach your CV file (${f}) to this email before sending.`,
  subject: 'Message from the website', mailCareer: 'Your email app has opened with your application details. Attach your CV, then send.',
  mailContact: 'Your email app has opened with your message filled in. Send the email to finish.', copied: 'Link copied',
  docs: (a: number, b: number, n: number) => `Showing documents ${a}–${b} of ${n}.`, logos: (a: number, b: number, n: number) => `Showing logos ${a}–${b} of ${n} PT PGAS Solution clients and partners.`,
  close: 'Close', readMore: 'Read more',
};
const tr = () => (document.documentElement.lang === 'en' ? T_EN : T_ID);
const scrollY = () => window.scrollY;
function scrollToTarget(target: HTMLElement | number, immediate = false) {
  const offset = -(window.innerWidth > 700 ? 120 : 100);
  const y = typeof target === 'number' ? target : Math.max(0, target.getBoundingClientRect().top + window.scrollY + offset);
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.3, force: true });
  else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------------ */
/* Per-page state                                                      */
/* ------------------------------------------------------------------ */
let observers: IntersectionObserver[] = [];
let parallaxEls: { el: HTMLElement; speed: number }[] = [];
let spy: { links: HTMLAnchorElement[]; sections: HTMLElement[] } | null = null;
let lastY = 0;

function onScroll() {
  const y = scrollY();
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header && !header.classList.contains('is-open')) {
    // Reference behaviour: the pill header stays in place while scrolling.
  }
  lastY = y;
  headerMorph?.update(y);
  updateSheet();
  updateNotchBands();
  updateSteps();

  if (!reduceMotion) {
    const vh = window.innerHeight;
    for (const p of parallaxEls) {
      const r = p.el.parentElement!.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      p.el.style.transform = `translate3d(0, ${(-progress * p.speed * 100).toFixed(2)}px, 0)`;
    }
  }

  const subnav = document.querySelector<HTMLElement>('[data-subnav]');
  if (subnav) {
    const footer = document.querySelector('.site-footer');
    const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
    subnav.classList.toggle('is-visible', y > window.innerHeight * 0.6 && footerTop > window.innerHeight - 40);
  }

  if (spy) {
    let active = 0;
    spy.sections.forEach((s, i) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.35) active = i; });
    spy.links.forEach((l, i) => l.classList.toggle('is-active', i === active));
    const activeLink = spy.links[active];
    const list = activeLink?.closest('.subnav__inner') as HTMLElement | null;
    if (list && activeLink) {
      const left = activeLink.offsetLeft - 24;
      if (Math.abs(list.scrollLeft - left) > 40) list.scrollTo({ left, behavior: 'smooth' });
    }
    subnavShape?.setActive(active);
  }
}
if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });

/* ------------------------------------------------------------------ */
/* Modules                                                             */
/* ------------------------------------------------------------------ */
function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!toggle || !menu || !header) return;
  const pill = header.querySelector<HTMLElement>('[data-pill]');
  const set = (open: boolean) => {
    // the glass card sits 8px under the header pill
    if (open && pill) menu.style.setProperty('--menu-top', `${Math.round(pill.getBoundingClientRect().bottom + 8)}px`);
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    header.classList.toggle('is-open', open);
    header.classList.remove('is-hidden');
    toggle.setAttribute('aria-label', open ? tr().closeMenu : tr().openMenu);
    if (open) lenis?.stop(); else lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll<HTMLButtonElement>('.menu__expand').forEach((b) => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      document.getElementById(b.getAttribute('aria-controls')!)?.classList.toggle('is-open', open);
    });
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  // a tap outside the card closes the menu
  menu.addEventListener('click', (e) => { if (e.target === menu) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); toggle.focus(); } });
}

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
  els.forEach((e) => io.observe(e));
  observers.push(io);
}

function initParallax() {
  parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => ({ el, speed: parseFloat(el.dataset.parallax || '0.15') }));
}

function formatLike(template: string, n: number) {
  const usesDots = /\d\.\d{3}/.test(template);
  const s = Math.round(n).toString();
  return usesDots ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s;
}
function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (reduceMotion) return;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement;
      io.unobserve(el);
      const finalText = el.textContent || '';
      const target = parseInt(finalText.replace(/\D/g, ''), 10);
      if (!target) continue;
      const start = performance.now();
      const dur = 1600;
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - k, 4);
        el.textContent = k < 1 ? formatLike(finalText, target * eased) : finalText;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  els.forEach((e) => io.observe(e));
  observers.push(io);
}

function initSubnav() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-subnav] a[href^="#"]'));
  const sections = links.map((l) => document.getElementById(l.hash.slice(1))).filter(Boolean) as HTMLElement[];
  spy = links.length && sections.length === links.length ? { links, sections } : null;
  initSubnavShape();
}

/* Section nav shape: the white indicator slides to the active link and the glass gets a pinched
   neck on each side of it (header pattern), easing along as the active item changes. */
let subnavShape: { setActive: (i: number) => void; destroy: () => void } | null = null;
function initSubnavShape() {
  subnavShape?.destroy();
  subnavShape = null;
  const pill = document.querySelector<HTMLElement>('[data-subnav-pill]');
  const bg = pill?.querySelector<HTMLElement>('[data-subnav-bg]');
  const edge = pill?.querySelector<SVGPathElement>('[data-subnav-edge]');
  const list = pill?.querySelector<HTMLElement>('[data-subnav-list]');
  const ind = pill?.querySelector<HTMLElement>('[data-subnav-ind]');
  if (!pill || !bg || !edge || !list || !ind) return;
  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a'));
  if (!links.length) return;
  let active = -1, raf = 0;
  let cur: [number, number] = [-1, -1], target: [number, number] = [-1, -1];   // neck x (−1 = none)
  const DEPTH = 18;

  const measure = () => {
    const pr = pill.getBoundingClientRect();
    const a = links[active];
    if (!a) { target = [-1, -1]; return; }
    const r = a.getBoundingClientRect();
    ind.style.setProperty('--ind-x', `${(a.offsetLeft).toFixed(1)}px`);
    ind.style.setProperty('--ind-w', `${r.width.toFixed(1)}px`);
    ind.classList.add('is-on');
    const prev = links[active - 1]?.getBoundingClientRect();
    const next = links[active + 1]?.getBoundingClientRect();
    // neck sits a fixed distance from the white pill (≈ the pill's 12px inset from the bar edge),
    // never further than halfway to the neighbouring item
    const OFF = 28;
    target = [
      prev ? Math.max(r.left - OFF, (prev.right + r.left) / 2) - pr.left : -1,
      next ? Math.min(r.right + OFF, (r.right + next.left) / 2) - pr.left : -1,
    ];
  };
  const draw = () => {
    const W = pill.clientWidth, H = pill.clientHeight;
    const necks = cur.filter((x) => x > 30 && x < W - 30);
    if (!necks.length) { bg.style.removeProperty('clip-path'); pill.classList.remove('is-shaped'); return; }
    bg.style.clipPath = `path('${pillPath(W, H, necks, DEPTH)}')`;
    const svg = edge.ownerSVGElement!;
    svg.setAttribute('viewBox', `-0.5 -0.5 ${r2(W)} ${r2(H)}`);
    edge.setAttribute('d', pillPath(W - 1, H - 1, necks.map((x) => x - 0.5), DEPTH - 0.5));
    pill.classList.add('is-shaped');
  };
  const tick = () => {
    let moving = false;
    cur = cur.map((c, i) => {
      const t = target[i];
      if (t < 0) return -1;
      if (c < 0 || reduceMotion) return t;
      const n = c + (t - c) * 0.16;
      if (Math.abs(t - n) > 0.3) { moving = true; return n; }
      return t;
    }) as [number, number];
    draw();
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { measure(); if (!raf) raf = requestAnimationFrame(tick); };
  const onList = () => kick();
  list.addEventListener('scroll', onList, { passive: true });
  window.addEventListener('resize', onList, { passive: true });
  document.fonts?.ready.then(() => { if (active >= 0) kick(); });
  subnavShape = {
    setActive: (i) => { if (i === active) return; active = i; links.forEach((l, j) => l.classList.toggle('is-active', j === i)); kick(); },
    destroy: () => { cancelAnimationFrame(raf); list.removeEventListener('scroll', onList); window.removeEventListener('resize', onList); },
  };
}

/* A hash can name a tab panel ([data-tabs] > [data-tab-panel] with an id): that tab opens and the
   page scrolls to the tab set, since a hidden panel has no position of its own. */
function hashTarget(hash: string): HTMLElement | null {
  const el = document.getElementById(decodeURIComponent(hash.replace(/^#/, '')));
  if (!el) return null;
  if (el.matches('[data-tab-panel], [data-pane]')) {
    const root = el.closest<HTMLElement>('[data-tabs]');
    if (root) { el.dispatchEvent(new CustomEvent('tab:reveal')); return root; }
  }
  return el;
}

function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    a.addEventListener('click', (e) => {
      const target = hashTarget(url.hash);
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, '', url.hash);
      scrollToTarget(target);
    });
  });
}

/* Lightbox: any [data-lightbox] link inside a [data-lightbox-group]; other code can call openLightbox */
let openLightbox: ((items: { src: string; caption: string }[], index: number, title: string) => void) | null = null;
function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dlg) return;
  dlg.setAttribute('data-lenis-prevent', '');
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const view = dlg.querySelector<HTMLElement>('[data-lb-view]')!;
  const titleEl = dlg.querySelector('[data-lb-title]')!;
  const countEl = dlg.querySelector('[data-lb-count]')!;
  const capEl = dlg.querySelector('[data-lb-caption]')!;
  const pctEl = dlg.querySelector<HTMLElement>('[data-lb-zoom-reset]');
  const zIn = dlg.querySelector<HTMLButtonElement>('[data-lb-zoom-in]');
  const zOut = dlg.querySelector<HTMLButtonElement>('[data-lb-zoom-out]');
  let items: { src: string; caption: string }[] = [];
  let i = 0;

  // zoom: the image always fits the screen at 100%; zoom 1–4× toward the pointer, drag to pan, pinch on touch
  const MIN = 1, MAX = 4;
  let s = 1, tx = 0, ty = 0;
  const clampPan = () => {
    const lx = Math.max(0, (img.offsetWidth * s - view.clientWidth) / 2 + 40);
    const ly = Math.max(0, (img.offsetHeight * s - view.clientHeight) / 2 + 40);
    tx = Math.min(lx, Math.max(-lx, tx)); ty = Math.min(ly, Math.max(-ly, ty));
  };
  const apply = (animate = false) => {
    if (s <= MIN + 0.001) { s = MIN; tx = 0; ty = 0; }
    clampPan();
    img.style.transition = animate ? 'transform 0.3s cubic-bezier(.22,1,.36,1)' : 'none';
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    view.classList.toggle('is-zoomed', s > MIN);
    if (pctEl) pctEl.textContent = `${Math.round(s * 100)}%`;
    if (zOut) zOut.disabled = s <= MIN;
    if (zIn) zIn.disabled = s >= MAX;
  };
  // (cx, cy) = focus point relative to the view centre; it stays put while zooming
  const zoomTo = (ns: number, cx = 0, cy = 0, animate = true) => {
    ns = Math.min(MAX, Math.max(MIN, ns));
    tx = cx - (cx - tx) * (ns / s); ty = cy - (cy - ty) * (ns / s);
    s = ns;
    apply(animate);
  };
  const rel = (x: number, y: number) => { const r = view.getBoundingClientRect(); return [x - r.left - r.width / 2, y - r.top - r.height / 2]; };
  const reset = () => { s = 1; tx = 0; ty = 0; apply(); };

  const show = () => {
    const it = items[i];
    img.src = it.src;
    img.alt = it.caption;
    countEl.textContent = `${i + 1} / ${items.length}`;
    capEl.textContent = it.caption;
    (dlg.querySelector('[data-lb-prev]') as HTMLElement).hidden = items.length < 2;
    (dlg.querySelector('[data-lb-next]') as HTMLElement).hidden = items.length < 2;
    reset();
  };
  const step = (d: number) => { i = (i + d + items.length) % items.length; show(); };
  openLightbox = (its, idx, title) => {
    items = its; i = Math.max(0, Math.min(idx, its.length - 1));
    titleEl.textContent = title;
    show();
    dlg.showModal();
    lenis?.stop();
  };
  document.querySelectorAll<HTMLElement>('[data-lightbox-group]').forEach((group) => {
    const links = Array.from(group.querySelectorAll<HTMLAnchorElement>('[data-lightbox]'));
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // skip links hidden by a filter
        const vis = links.filter((l) => !l.closest('[hidden]'));
        openLightbox?.(vis.map((l) => ({ src: l.getAttribute('href')!, caption: l.dataset.caption || '' })), Math.max(0, vis.indexOf(link)), group.dataset.lightboxGroup || '');
      });
    });
  });
  if (dlg.dataset.bound) return;
  dlg.dataset.bound = '1';
  dlg.querySelector('[data-lb-prev]')!.addEventListener('click', () => step(-1));
  dlg.querySelector('[data-lb-next]')!.addEventListener('click', () => step(1));
  dlg.querySelector('[data-lb-close]')!.addEventListener('click', () => dlg.close());
  zIn?.addEventListener('click', () => zoomTo(s * 1.5));
  zOut?.addEventListener('click', () => zoomTo(s / 1.5));
  pctEl?.addEventListener('click', () => { s = 1; tx = 0; ty = 0; apply(true); });
  dlg.addEventListener('close', () => { lenis?.start(); reset(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === '+' || e.key === '=') zoomTo(s * 1.5);
    if (e.key === '-') zoomTo(s / 1.5);
    if (e.key === '0') { s = 1; apply(true); }
  });
  view.addEventListener('wheel', (e) => {
    e.preventDefault();
    const [cx, cy] = rel(e.clientX, e.clientY);
    zoomTo(s * Math.exp(-e.deltaY * 0.0022), cx, cy, false);
  }, { passive: false });
  view.addEventListener('dblclick', (e) => {
    if (s > MIN) { s = 1; apply(true); return; }
    const [cx, cy] = rel(e.clientX, e.clientY);
    zoomTo(2.5, cx, cy);
  });
  // pointers: one = pan (when zoomed), two = pinch; a short tap on the empty area closes; a swipe steps (at 100%)
  const pts = new Map<number, { x: number; y: number }>();
  let startDist = 0, startS = 1, lastX = 0, lastY = 0, downX = 0, downY = 0, moved = false;
  view.addEventListener('pointerdown', (e) => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    view.setPointerCapture(e.pointerId);
    lastX = downX = e.clientX; lastY = downY = e.clientY; moved = false;
    if (pts.size === 2) { const [a, b] = [...pts.values()]; startDist = Math.hypot(a.x - b.x, a.y - b.y); startS = s; }
  });
  view.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) moved = true;
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const [cx, cy] = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomTo(startS * (Math.hypot(a.x - b.x, a.y - b.y) / (startDist || 1)), cx, cy, false);
      return;
    }
    if (s > MIN) { tx += e.clientX - lastX; ty += e.clientY - lastY; apply(); }
    lastX = e.clientX; lastY = e.clientY;
  });
  const up = (e: PointerEvent) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size) return;
    const dx = e.clientX - downX;
    if (s === MIN && e.pointerType !== 'mouse' && Math.abs(dx) > 50 && items.length > 1) step(dx < 0 ? 1 : -1);
    else if (!moved && s === MIN && e.target === view) dlg.close();
  };
  view.addEventListener('pointerup', up);
  view.addEventListener('pointercancel', (e) => pts.delete(e.pointerId));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

function initDialogs() {
  // Lenis blocks wheel/touch scrolling while stopped; data-lenis-prevent lets dialogs scroll their own content
  document.querySelectorAll('dialog').forEach((d) => d.setAttribute('data-lenis-prevent', ''));
  document.querySelectorAll<HTMLElement>('[data-dialog-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = document.getElementById(btn.dataset.dialogOpen!) as HTMLDialogElement | null;
      if (!d) return;
      d.showModal();
      lenis?.stop();
      d.addEventListener('close', () => { lenis?.start(); btn.focus(); }, { once: true });
    });
  });
  document.querySelectorAll<HTMLDialogElement>('dialog[data-dialog]').forEach((d) => {
    d.querySelectorAll('[data-dialog-close]').forEach((b) => b.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
}

function initVideos() {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach((wrap) => {
    const btn = wrap.querySelector('button');
    btn?.addEventListener('click', () => {
      const v = document.createElement('video');
      v.src = wrap.dataset.video!;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.preload = 'metadata';
      v.setAttribute('aria-label', wrap.dataset.label || 'Video');
      wrap.replaceChildren(v);
      wrap.closest('[data-video-host]')?.classList.add('is-playing');
      v.focus();
    });
  });
}

/* Home: business line switcher */
function initSwitchers() {
  document.querySelectorAll<HTMLElement>('[data-switch]').forEach((root) => {
    const items = root.querySelectorAll<HTMLElement>('[data-switch-item]');
    const panes = root.querySelectorAll<HTMLElement>('[data-switch-pane]');
    const activate = (idx: number) => {
      items.forEach((it, i) => it.classList.toggle('is-active', i === idx));
      panes.forEach((p, i) => p.classList.toggle('is-active', i === idx));
    };
    items.forEach((it, i) => {
      it.addEventListener('mouseenter', () => activate(i));
      it.addEventListener('focusin', () => activate(i));
    });
  });
}

/* Forms: POST to PUBLIC_FORM_ENDPOINT if configured, otherwise compose an email. */
function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const say = (msg: string, error = false) => {
      if (!status) return;
      status.hidden = false;
      status.textContent = msg;
      status.classList.toggle('is-error', error);
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const file = fd.get('cv');
      if (file instanceof File && file.size && file.type && file.type !== 'application/pdf') {
        say(tr().cvPdf, true);
        return;
      }
      const endpoint = form.dataset.endpoint;
      const submit = form.querySelector<HTMLButtonElement>('[type=submit]');
      if (endpoint) {
        try {
          submit && (submit.disabled = true);
          const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          say(form.dataset.success || tr().sent);
        } catch {
          say(tr().notSent(form.dataset.mailto || ''), true);
        } finally {
          submit && (submit.disabled = false);
        }
        return;
      }
      // Fallback: open the visitor's email client with the message pre-filled.
      const lines: string[] = [];
      fd.forEach((v, k) => {
        if (v instanceof File) return;
        const label = form.querySelector(`[name="${k}"]`)?.getAttribute('data-label') || k;
        if (String(v).trim()) lines.push(`${label}: ${v}`);
      });
      if (file instanceof File && file.size) lines.push('', tr().attach(file.name));
      const subject = form.dataset.subject || tr().subject;
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      say(file instanceof File && file.size
        ? tr().mailCareer
        : tr().mailContact);
    });
  });
  // Prefill from query string (?posisi=...)
  const pos = new URLSearchParams(location.search).get('posisi');
  if (pos) document.querySelectorAll<HTMLInputElement>('input[name="position"]').forEach((i) => { if (!i.value) i.value = pos; });
}

function initFilter() {
  document.querySelectorAll<HTMLInputElement>('[data-filter-input]').forEach((input) => {
    const root = document.querySelector(input.dataset.filterInput!);
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>('[data-filter-text]');
    const empty = document.querySelector<HTMLElement>(input.dataset.filterEmpty || '');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      items.forEach((it) => { const ok = !q || it.dataset.filterText!.toLowerCase().includes(q); it.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown > 0;
    });
  });
}

function initCharts() {
  document.querySelectorAll<HTMLElement>('[data-chart]').forEach((chart) => {
    const tip = chart.querySelector<HTMLElement>('[data-chart-tip]');
    if (!tip) return;
    chart.querySelectorAll<SVGGElement>('[data-point]').forEach((pt) => {
      const show = () => {
        tip.hidden = false;
        tip.textContent = `${pt.dataset.label}: ${pt.dataset.value}`;
        const box = chart.getBoundingClientRect();
        const r = pt.getBoundingClientRect();
        tip.style.left = `${r.left - box.left + r.width / 2}px`;
        tip.style.top = `${r.top - box.top}px`;
        chart.querySelectorAll('[data-point]').forEach((p) => p.classList.toggle('is-active', p === pt));
      };
      pt.addEventListener('mouseenter', show);
      pt.addEventListener('focus', show);
    });
    chart.addEventListener('mouseleave', () => { tip.hidden = true; chart.querySelectorAll('[data-point]').forEach((p) => p.classList.remove('is-active')); });
  });
}

function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) => {
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy || location.href);
        const prev = b.textContent;
        b.textContent = tr().copied;
        setTimeout(() => (b.textContent = prev), 1800);
      } catch { /* clipboard unavailable */ }
    });
  });
}

let scrollerAbort: AbortController | null = null;
function initScrollers() {
  scrollerAbort?.abort();
  scrollerAbort = new AbortController();
  const { signal } = scrollerAbort;
  document.querySelectorAll<HTMLElement>('[data-scroller]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-scroller-track]');
    if (!track) return;
    const prev = root.querySelector<HTMLButtonElement>('[data-scroller-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-scroller-next]');
    // step by one card (plus gap) so each click lands on the next card's start
    const by = () => { const c = track.firstElementChild as HTMLElement | null; return c ? c.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0') : Math.max(280, track.clientWidth * 0.8); };
    const sync = () => {
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -by(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: by(), behavior: 'smooth' }));
    track.addEventListener('scroll', sync, { passive: true, signal });
    window.addEventListener('resize', sync, { passive: true, signal });
    sync();
  });
}

/* Feature steps: activate the step nearest the viewport centre, swap the sticky image */
let stepsState: { items: HTMLElement[]; imgs: HTMLElement[]; stage: HTMLElement | null; sticky: HTMLElement | null; notch: HTMLElement | null; active: number }[] = [];
/* Splits a text element into per-character spans with a staggered --d delay (screen readers get the
   plain text). Returns the delay after the last character so a following element continues the sweep. */
const CHAR_STEP = 0.014;
function splitChars(el: HTMLElement, delay = 0) {
  if (el.dataset.splitDone) return delay;
  el.dataset.splitDone = '1';
  const text = (el.textContent || '').trim();
  const sr = document.createElement('span');
  sr.className = 'visually-hidden';
  sr.textContent = text;
  const vis = document.createElement('span');
  vis.setAttribute('aria-hidden', 'true');
  text.split(/(\s+)/).forEach((tok) => {
    if (!tok) return;
    if (/^\s+$/.test(tok)) { vis.append(' '); delay += CHAR_STEP; return; }
    const word = document.createElement('span');
    word.className = 'ch-w';
    for (const c of tok) {
      const ch = document.createElement('span');
      ch.className = 'ch';
      ch.textContent = c;
      ch.style.setProperty('--d', `${delay.toFixed(3)}s`);
      delay += CHAR_STEP;
      word.append(ch);
    }
    vis.append(word);
  });
  el.replaceChildren(sr, vis);
  return delay;
}

/* Section headlines: same grey → blue → colour sweep as the Tentang Kami steps, replayed on every visit.
   Only plain-text headings are split (anything with inline markup is left alone), and the hero
   titles keep their own line-mask reveal. */
let sweepObserver: IntersectionObserver | null = null;
function initHeadlineSweep() {
  sweepObserver?.disconnect();
  // [data-sweep] opts any other plain-text element in (e.g. list items in a section)
  const sel = '.sec-head > h2, .sec-head > h3, h2.t-xl, h2.t-lg, h2.t-md, [data-sweep]';
  const heads = Array.from(document.querySelectorAll<HTMLElement>(sel)).filter((h) =>
    !h.closest('.hero, .phero') && h.children.length === 0 && (h.textContent || '').trim().length > 0 && !h.classList.contains('sweep'));
  if (!heads.length) return;
  heads.forEach((h) => {
    const m = getComputedStyle(h).color.match(/\d+(\.\d+)?/g);
    if (!m) return;
    const [r, g, b] = m.map(Number);
    h.style.setProperty('--to', `rgb(${r}, ${g}, ${b})`);
    h.style.setProperty('--dim', `rgba(${r}, ${g}, ${b}, 0.18)`);
    if (h.closest('.theme-dark')) h.style.setProperty('--hi', 'var(--blue-lit)');
    splitChars(h);
    h.classList.add('sweep');
  });
  // plays each time the text comes back into view: lit once ≥60% visible, reset only once it is
  // completely off-screen (so the reset is never seen), then it plays again on the next visit
  sweepObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.intersectionRatio >= 0.6) e.target.classList.add('is-swept');
      else if (!e.isIntersecting) e.target.classList.remove('is-swept');
    });
  }, { threshold: [0, 0.6], rootMargin: '0px 0px -8% 0px' });
  heads.forEach((h) => sweepObserver!.observe(h));
}

function initSteps() {
  stepsState = Array.from(document.querySelectorAll<HTMLElement>('[data-steps]')).map((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
    // each step's figure + caption sweep as one sentence
    items.forEach((it) => { let d = 0; it.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => { d = splitChars(el, d); }); });
    return {
      items,
      imgs: Array.from(root.querySelectorAll<HTMLElement>('[data-step-img]')),
      stage: root.querySelector<HTMLElement>('.steps__stage'),
      sticky: root.querySelector<HTMLElement>('.steps__sticky'),
      notch: root.querySelector<HTMLElement>('.steps__notch'),
      active: -1,
    };
  });
}
function updateSteps() {
  const mid = window.innerHeight / 2;
  for (const st of stepsState) {
    // only light a step once the list is actually in view, so the colour sweep is seen
    const list = st.items[0]?.parentElement?.getBoundingClientRect();
    if (list && (list.top > window.innerHeight * 0.8 || list.bottom < window.innerHeight * 0.2)) {
      if (st.active !== -1) { st.active = -1; st.items.forEach((it) => it.classList.remove('is-active')); }
      continue;
    }
    let best = 0, dist = Infinity;
    st.items.forEach((it, i) => { const r = it.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - mid); if (d < dist) { dist = d; best = i; } });
    if (best !== st.active) {
      st.active = best;
      st.items.forEach((it, i) => it.classList.toggle('is-active', i === best));
      st.imgs.forEach((im, i) => im.classList.toggle('is-active', i === best));
    }
    // the notch on the sticky image's edge travels top → bottom as the sticky range is scrolled
    if (st.stage && st.sticky && st.notch) {
      const travel = st.stage.offsetHeight - st.sticky.offsetHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, (st.sticky.getBoundingClientRect().top - st.stage.getBoundingClientRect().top) / travel)) : 0;
      st.notch.style.top = `${(8.7 + p * 40.3).toFixed(2)}%`;
    }
  }
}

/* Hero background video (YouTube IFrame API): muted, no controls, loops a segment */
type YTPlayer = { playVideo(): void; pauseVideo(): void; mute(): void; seekTo(s: number, a: boolean): void; getCurrentTime(): number; destroy(): void };
declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void } }
let ytPlayers: { player: YTPlayer; timer: number }[] = [];
let ytPaused = false;
function setBgVideosPaused(paused: boolean) {
  if (paused === ytPaused) return;
  ytPaused = paused;
  ytPlayers.forEach(({ player }) => { try { if (paused) player.pauseVideo(); else player.playVideo(); } catch { /* not ready yet */ } });
}
let ytApi: Promise<any> | null = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApi) {
    ytApi = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });
  }
  return ytApi;
}
function destroyYouTubeBg() {
  ytPlayers.forEach(({ player, timer }) => { clearInterval(timer); try { player.destroy(); } catch { /* already gone */ } });
  ytPlayers = [];
  ytPaused = false;
}
function initYouTubeBg() {
  destroyYouTubeBg();
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-yt-bg]'));
  if (!roots.length || reduceMotion) return;
  const saveData = (navigator as any).connection?.saveData;
  if (saveData) return;
  loadYouTubeApi().then((YT) => {
    roots.forEach((root) => {
      const mount = root.querySelector<HTMLElement>('[data-yt-mount]');
      if (!mount || !root.isConnected) return;
      const start = Number(root.dataset.ytStart || 0);
      const end = Number(root.dataset.ytEnd || 0);
      const player: YTPlayer = new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        videoId: root.dataset.ytBg,
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, rel: 0, start, end: end || undefined, origin: location.origin },
        events: {
          onReady: (e: any) => { e.target.mute(); e.target.playVideo(); },
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.PLAYING) root.classList.add('is-playing');
            if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(start, true); e.target.playVideo(); }
          },
        },
      });
      // seamless loop before YouTube shows its end screen
      const timer = window.setInterval(() => {
        try { if (end && player.getCurrentTime() >= end - 0.25) player.seekTo(start, true); } catch { /* not ready yet */ }
      }, 200);
      ytPlayers.push({ player, timer });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Header morph (desktop): full-width bar at the top of the page; once */
/* scrolled it shrinks to a compact pill, then "pinches" a neck on each */
/* side so the logo and the CTA look like they are budding off.        */
/* Pattern taken from thelaunchcompany.cc.                              */
/* ------------------------------------------------------------------ */
const PILL = { radius: 8, expH: 72, cmpH: 64, padL: 24, padR: 12, gap: 44, maxW: 1680, neckW: 18, neckDepth: 0.3, on: 80, off: 40 };
type Tween = { from: number; to: number; start: number; dur: number };
let headerMorph: { update: (y: number) => void; destroy: () => void } | null = null;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const r2 = (n: number) => Math.round(n * 100) / 100;

function pillPath(W: number, H: number, necks: number[], d: number) {
  const r = PILL.radius, w = PILL.neckW;
  let s = `M${r2(r)},0`;
  for (const n of necks) s += ` H${r2(n - w)} C${r2(n - w + 11)},0 ${r2(n - 9)},${r2(d)} ${r2(n)},${r2(d)} C${r2(n + 9)},${r2(d)} ${r2(n + w - 11)},0 ${r2(n + w)},0`;
  s += ` H${r2(W - r)} A${r},${r} 0 0 1 ${r2(W)},${r} V${r2(H - r)} A${r},${r} 0 0 1 ${r2(W - r)},${r2(H)}`;
  for (const n of [...necks].reverse()) s += ` H${r2(n + w)} C${r2(n + w - 11)},${r2(H)} ${r2(n + 9)},${r2(H - d)} ${r2(n)},${r2(H - d)} C${r2(n - 9)},${r2(H - d)} ${r2(n - w + 11)},${r2(H)} ${r2(n - w)},${r2(H)}`;
  s += ` H${r} A${r},${r} 0 0 1 0,${r2(H - r)} V${r} A${r},${r} 0 0 1 ${r},0 Z`;
  return s;
}

function initHeaderMorph() {
  headerMorph?.destroy();
  headerMorph = null;
  const header = document.querySelector<HTMLElement>('[data-header]');
  const pill = header?.querySelector<HTMLElement>('[data-pill]');
  const bg = pill?.querySelector<HTMLElement>('[data-pill-bg]');
  const line = pill?.querySelector<SVGPathElement>('[data-pill-line]');
  const brand = pill?.querySelector<HTMLElement>('.brand');
  const mid = pill?.querySelector<HTMLElement>('[data-pill-mid]');
  const cta = pill?.querySelector<HTMLElement>('.header-cta');
  if (!header || !pill || !bg || !line || !brand || !mid || !cta) return;
  const svg = line.ownerSVGElement!;

  const mq = window.matchMedia(`(min-width: 1281px)`);
  const dur = (ms: number) => (reduceMotion ? 0 : ms);
  let size = { b: 0, m: 0, c: 0, avail: 0 };
  let compact = scrollY() > PILL.on;
  // p: 0 = full-width bar → 1 = compact pill; q: 0 = smooth → 1 = fully pinched
  let p: Tween = { from: +compact, to: +compact, start: 0, dur: 0 };
  let q: Tween = { from: +compact, to: +compact, start: 0, dur: 0 };
  let raf = 0;

  const val = (t: Tween, now: number, ease: (x: number) => number) => {
    if (t.dur <= 0 || now >= t.start + t.dur) return now < t.start ? t.from : t.to;
    if (now <= t.start) return t.from;
    return t.from + (t.to - t.from) * ease((now - t.start) / t.dur);
  };
  const measure = () => {
    const cs = getComputedStyle(header);
    size = { b: brand.offsetWidth, m: mid.offsetWidth, c: cta.offsetWidth, avail: header.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
  };
  const clear = () => {
    pill.classList.remove('is-morph');
    for (const k of ['width', 'height', '--pill-h', '--mid-x']) pill.style.removeProperty(k);
    bg.style.removeProperty('clip-path');
    line.removeAttribute('d');
  };
  const render = (now: number) => {
    const k = val(p, now, easeInOutCubic);
    const pinch = val(q, now, easeOutQuart);
    const { b, m, c, avail } = size;
    const Wexp = Math.min(avail, PILL.maxW);
    const Wcmp = Math.min(Wexp, PILL.padL + b + PILL.gap + m + PILL.gap + c + PILL.padR);
    const W = Wexp + (Wcmp - Wexp) * k;
    const H = PILL.expH + (PILL.cmpH - PILL.expH) * k;
    const midX = (W - m) / 2 + (PILL.padL + b + PILL.gap - (W - m) / 2) * k;
    pill.style.width = `${r2(W)}px`;
    pill.style.height = `${r2(H)}px`;
    pill.style.setProperty('--pill-h', `${r2(H)}px`);
    pill.style.setProperty('--mid-x', `${r2(midX)}px`);
    const n1 = (PILL.padL + b + midX) / 2;
    const n2 = (midX + m + (W - PILL.padR - c)) / 2;
    const depth = pinch * PILL.neckDepth * H;
    bg.style.clipPath = `path('${pillPath(W, H, [n1, n2], depth)}')`;
    // 1px edge drawn half a pixel inside the clip so the whole stroke shows
    svg.setAttribute('viewBox', `-0.5 -0.5 ${r2(W)} ${r2(H)}`);
    line.setAttribute('d', pillPath(W - 1, H - 1, [n1 - 0.5, n2 - 0.5], Math.max(0, depth - 0.5)));
  };
  const loop = (now: number) => {
    render(now);
    const end = Math.max(p.start + p.dur, q.start + q.dur);
    raf = now < end ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const setup = () => {
    cancelAnimationFrame(raf); raf = 0;
    if (!mq.matches) { clear(); return; }
    pill.classList.add('is-morph');
    measure();
    render(performance.now());
  };

  const update = (y: number) => {
    if (!mq.matches) return;
    const next = compact ? y > PILL.off : y > PILL.on;
    if (next === compact) return;
    compact = next;
    const now = performance.now();
    const pNow = val(p, now, easeInOutCubic), qNow = val(q, now, easeOutQuart);
    if (compact) {
      // shrink first, then pinch
      p = { from: pNow, to: 1, start: now, dur: dur(560) };
      q = { from: qNow, to: 1, start: now + dur(380), dur: dur(520) };
    } else {
      // release the pinch, then open back up to full width
      q = { from: qNow, to: 0, start: now, dur: dur(200) };
      p = { from: pNow, to: 0, start: now + dur(120), dur: dur(560) };
    }
    kick();
  };
  const onResize = () => setup();
  mq.addEventListener('change', setup);
  window.addEventListener('resize', onResize, { passive: true });
  document.fonts?.ready.then(() => { if (headerMorph) setup(); });
  setup();
  headerMorph = {
    update,
    destroy: () => { cancelAnimationFrame(raf); mq.removeEventListener('change', setup); window.removeEventListener('resize', onResize); },
  };
}

/* ------------------------------------------------------------------ */
/* Homepage sheet: the hero stays pinned while the white page sheet    */
/* slides over it. The tab cut into the sheet's top edge flattens as   */
/* the sheet rises (terminal-industries.com).                          */
/* ------------------------------------------------------------------ */
const SHEET_CUT = 40;
// The hero still rises, just slower than the sheet: video at 35%, copy + card at 60% of scroll speed.
const SHEET_PARALLAX = { bg: 0.35, content: 0.6 };
let sheet: { el: HTMLElement; under: HTMLElement; bg: HTMLElement | null; content: HTMLElement | null; covered: boolean } | null = null;
function initSheet() {
  const el = document.querySelector<HTMLElement>('[data-sheet]');
  const under = document.querySelector<HTMLElement>('[data-sheet-under]');
  sheet = el && under ? { el, under, bg: under.querySelector<HTMLElement>('.hero__bg'), content: under.querySelector<HTMLElement>('.hero__content'), covered: false } : null;
  updateSheet();
}
function updateSheet() {
  if (!sheet) return;
  const vh = window.innerHeight;
  // a hero taller than the viewport pins with its bottom edge in view
  sheet.under.style.top = `${Math.min(0, vh - sheet.under.offsetHeight)}px`;
  const top = sheet.el.getBoundingClientRect().top;
  const d = SHEET_CUT * Math.min(1, Math.max(0, top / vh));
  sheet.el.style.setProperty('--cut-d', `${d.toFixed(2)}px`);
  // how far the sheet has risen over the (pinned) hero
  const risen = Math.min(vh, Math.max(0, sheet.under.getBoundingClientRect().bottom - top));
  if (!reduceMotion) {
    if (sheet.bg) sheet.bg.style.transform = `translate3d(0, ${(-risen * SHEET_PARALLAX.bg).toFixed(1)}px, 0)`;
    if (sheet.content) sheet.content.style.transform = `translate3d(0, ${(-risen * SHEET_PARALLAX.content).toFixed(1)}px, 0)`;
  }
  const covered = top <= 0;
  if (covered !== sheet.covered) {
    sheet.covered = covered;
    sheet.under.style.visibility = covered ? 'hidden' : '';
    setBgVideosPaused(covered);
  }
}

/* ------------------------------------------------------------------ */
/* Client logo carousel (homepage "Klien Kami")                        */
/* One row of square cells; chevrons page through all logos, and the  */
/* cells swap in a wave (left→right going forward, right→left back).  */
/* A blue glow follows the cursor and lights nearby cell borders.     */
/* ------------------------------------------------------------------ */
let carouselCleanup: (() => void)[] = [];
function initLogoCarousel() {
  carouselCleanup.forEach((f) => f());
  carouselCleanup = [];
  document.querySelectorAll<HTMLElement>('[data-lc]').forEach((root) => {
    const row = root.querySelector<HTMLElement>('[data-lc-row]');
    const prev = root.querySelector<HTMLButtonElement>('[data-lc-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-lc-next]');
    const status = root.querySelector<HTMLElement>('[data-lc-status]');
    const pageEl = root.querySelector<HTMLElement>('[data-lc-page]');
    const pagesEl = root.querySelector<HTMLElement>('[data-lc-pages]');
    if (!row || !prev || !next) return;
    type Item = { src: string; caption?: string; cat?: string };
    const all: Item[] = JSON.parse(root.dataset.items || '[]');
    if (!all.length) return;
    // docs mode (awards): pages don't wrap, cells open the lightbox, filters narrow the set
    const docs = root.dataset.mode === 'docs';
    let logos = all;
    const template = row.querySelector<HTMLElement>('.lc__cell')!.cloneNode(true) as HTMLElement;
    template.querySelectorAll('.lc__fade--left, .lc__fade--right, .lc__x--tr, .lc__x--br').forEach((n) => n.remove());

    const perPageFor = () => (window.innerWidth >= 1024 ? (docs ? 4 : 5) : docs ? 2 : 3);
    let per = 0, page = 0, busy = false;
    const pages = () => Math.max(1, Math.ceil(logos.length / per));
    const itemAt = (p: number, i: number): Item | null => {
      const k = p * per + i;
      return docs ? (k < logos.length ? logos[k] : null) : logos[k % logos.length];
    };
    // point a cell's link / caption at its item (docs mode); empty cells stay inert
    const dress = (cell: HTMLElement, it: Item | null) => {
      cell.classList.toggle('is-empty', !it);
      if (!docs) return;
      const a = cell.querySelector<HTMLAnchorElement>('[data-lc-open]');
      const cap = cell.querySelector<HTMLElement>('.lc__cap > span') || cell.querySelector<HTMLElement>('.lc__cap');
      if (a) {
        if (it) { a.href = it.src; a.setAttribute('aria-label', `${it.caption}, perbesar`); a.removeAttribute('tabindex'); a.removeAttribute('aria-hidden'); }
        else { a.removeAttribute('href'); a.removeAttribute('aria-label'); a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
      }
      if (cap) cap.textContent = it?.caption || '';
    };
    const pad = (n: number) => String(n).padStart(2, '0');
    const cells = () => Array.from(row.querySelectorAll<HTMLElement>('.lc__cell'));

    const flicker = (cell: HTMLElement, delay: number) => {
      cell.querySelectorAll<HTMLElement>('.lc__x').forEach((x) => {
        x.classList.remove('is-flicker'); void x.offsetWidth;
        x.style.animationDelay = `${delay}ms`; x.classList.add('is-flicker');
      });
    };
    const build = () => {
      const first = page * per;
      per = perPageFor();
      page = Math.floor(first / per) % pages();
      row.style.setProperty('--lc-n', String(per));
      row.replaceChildren(...Array.from({ length: per }, (_, i) => {
        const cell = template.cloneNode(true) as HTMLElement;
        const img = cell.querySelector('img')!;
        const it = itemAt(page, i);
        if (it) img.src = it.src; else img.remove();
        dress(cell, it);
        if (i === 0) cell.insertAdjacentHTML('beforeend', '<span class="lc__fade lc__fade--left" aria-hidden="true"></span>');
        if (i === per - 1) cell.insertAdjacentHTML('afterbegin', '<span class="lc__x lc__x--tr" aria-hidden="true"></span><span class="lc__x lc__x--br" aria-hidden="true"></span><span class="lc__fade lc__fade--right" aria-hidden="true"></span>');
        return cell;
      }));
      update();
    };
    const update = () => {
      if (pageEl) pageEl.textContent = pad(page + 1);
      if (pagesEl) pagesEl.textContent = pad(pages());
      const from = page * per + 1, to = Math.min(logos.length, page * per + per);
      if (status) status.textContent = docs ? tr().docs(from, to, logos.length) : tr().logos(from, to, logos.length);
      // warm the cache for both neighbours so the swap never waits on the network
      for (const p of [page + 1, page - 1 + pages()]) for (let i = 0; i < per; i++) { const it = itemAt(p % pages(), i); if (it) { const im = new Image(); im.src = it.src; } }
    };

    const go = (dir: 1 | -1, to?: number) => {
      if (busy) return;
      page = to ?? (page + dir + pages()) % pages();
      const list = cells();
      const STAGGER = 70, OUT = 300, IN = 520, OVERLAP = 170;
      let last: Promise<unknown> = Promise.resolve();
      busy = !reduceMotion;
      list.forEach((cell, i) => {
        const order = dir > 0 ? i : list.length - 1 - i;
        const delay = order * STAGGER;
        const box = cell.querySelector<HTMLElement>('.lc__logo')!;
        const old = box.querySelector('img');
        const it = itemAt(page, i);
        dress(cell, it);
        const img = document.createElement('img');
        img.alt = ''; img.decoding = 'async';
        if (it) { img.src = it.src; box.appendChild(img); }
        if (reduceMotion) { old?.remove(); return; }
        flicker(cell, delay);
        const shift = 14;
        if (!old && !it) return;
        if (!it) {
          old!.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, transform: `translate3d(${-dir * shift}px,0,0)`, filter: 'blur(6px)' }], { duration: OUT, delay, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' }).finished.then(() => old!.remove(), () => old!.remove());
          return;
        }
        if (!old) {
          last = img.animate([{ opacity: 0, transform: `translate3d(${dir * shift}px,0,0)`, filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: IN, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }).finished;
          return;
        }
        old.animate(
          [{ opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0)' }, { opacity: 0, transform: `translate3d(${-dir * shift}px,0,0)`, filter: 'blur(6px)' }],
          { duration: OUT, delay, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' },
        ).finished.then(() => old.remove(), () => old.remove());
        const a = img.animate(
          [{ opacity: 0, transform: `translate3d(${dir * shift}px,0,0)`, filter: 'blur(6px)' }, { opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0)' }],
          { duration: IN, delay: delay + OUT - OVERLAP, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' },
        );
        last = a.finished;
      });
      update();
      last.then(() => { busy = false; }, () => { busy = false; });
    };

    // cursor glow: every cell's glow tracks the same pointer (eased), so borders near it light up
    let tx = -9999, ty = -9999, cx = -9999, cy = -9999, raf = 0;
    const paint = () => {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      const rr = row.getBoundingClientRect();
      cells().forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--gx', `${(cx - (r.left - rr.left)).toFixed(1)}px`);
        c.style.setProperty('--gy', `${(cy - (r.top - rr.top)).toFixed(1)}px`);
      });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3 ? requestAnimationFrame(paint) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rr = row.getBoundingClientRect();
      const first = cx < -9000;
      tx = e.clientX - rr.left; ty = e.clientY - rr.top;
      if (first) { cx = tx; cy = ty; }
      row.classList.add('is-pointer');
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => row.classList.remove('is-pointer');

    const onPrev = () => go(-1), onNext = () => go(1);
    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);
    // docs mode: a cell opens the lightbox over the current (filtered) set
    const onOpen = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-lc-open]');
      if (!a || !docs) return;
      e.preventDefault();
      const i = cells().findIndex((c) => c.contains(a));
      const k = page * per + i;
      if (i < 0 || k >= logos.length || !openLightbox) return;
      openLightbox(logos.map((x) => ({ src: x.src, caption: x.caption || '' })), k, root.dataset.group || '');
    };
    row.addEventListener('click', onOpen);
    // docs mode: filter buttons in the same section
    const filterBtns = docs ? Array.from(root.closest('section')?.querySelectorAll<HTMLButtonElement>('[data-lc-filter]') || []) : [];
    const onFilter = (e: Event) => {
      const b = e.currentTarget as HTMLButtonElement;
      if (busy || b.getAttribute('aria-pressed') === 'true') return;
      const f = b.dataset.lcFilter;
      filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      logos = f === 'all' ? all : all.filter((x) => x.cat === f);
      go(1, 0);
    };
    filterBtns.forEach((b) => b.addEventListener('click', onFilter));
    const pressed = filterBtns.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.lcFilter;
    if (pressed && pressed !== 'all') logos = all.filter((x) => x.cat === pressed);
    row.addEventListener('pointermove', onMove);
    row.addEventListener('pointerleave', onLeave);
    const onResize = () => { if (perPageFor() !== per) build(); };
    window.addEventListener('resize', onResize, { passive: true });

    // first reveal: crosshairs flicker on once the row scrolls into view
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (!reduceMotion) cells().forEach((c, i) => flicker(c, i * 90));
    }, { threshold: 0.4 });
    io.observe(row);

    build();
    carouselCleanup.push(() => {
      prev.removeEventListener('click', onPrev); next.removeEventListener('click', onNext);
      row.removeEventListener('click', onOpen); filterBtns.forEach((b) => b.removeEventListener('click', onFilter));
      row.removeEventListener('pointermove', onMove); row.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize); io.disconnect(); cancelAnimationFrame(raf);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Footer background: a faint grid with crosshairs (same vocabulary as */
/* the client-logo grid) and a few light "comets" running along the   */
/* grid lines — after the moving lines in terminal-industries.com's   */
/* footer.                                                             */
/* ------------------------------------------------------------------ */
let footerGridCleanup: (() => void) | null = null;
function initFooterGrid() {
  footerGridCleanup?.();
  footerGridCleanup = null;
  const host = document.querySelector<HTMLElement>('[data-footer-grid]');
  if (!host) return;
  const footer = host.parentElement!;
  const SVG = 'http://www.w3.org/2000/svg';
  let cols: number[] = [], rows: number[] = [], W = 0, H = 0;
  const streaks: { el: HTMLElement; anim?: Animation; timer?: number }[] = [];
  let running = false;

  const build = () => {
    const cta = footer.querySelector<HTMLElement>('.cta-close');
    host.style.height = `${(cta ? cta.offsetTop + cta.offsetHeight : 560) + 160}px`;
    W = host.clientWidth; H = host.clientHeight;
    const C = W >= 1024 ? 222 : 150;
    cols = []; rows = [];
    for (let x = (W / 2) % C; x <= W; x += C) cols.push(Math.round(x) + 0.5);
    for (let y = 40 + C * 0.5; y <= H; y += C) rows.push(Math.round(y) + 0.5);
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    const lines = document.createElementNS(SVG, 'path');
    lines.setAttribute('class', 'fg-line');
    lines.setAttribute('d', [...cols.map((x) => `M${x} 0V${H}`), ...rows.map((y) => `M0 ${y}H${W}`)].join(''));
    const crosses = document.createElementNS(SVG, 'path');
    crosses.setAttribute('class', 'fg-x');
    crosses.setAttribute('d', cols.flatMap((x) => rows.map((y) => `M${x - 5} ${y}h11M${x} ${y - 5}v11`)).join(''));
    svg.append(lines, crosses);
    host.querySelector('svg')?.remove();
    host.prepend(svg);
  };

  const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const run = (st: { el: HTMLElement; anim?: Animation; timer?: number }) => {
    if (!running || !cols.length || !rows.length) return;
    const len = 140;
    const horizontal = Math.random() < 0.6;
    const forward = Math.random() < 0.5;
    let from: string, to: string, dist: number;
    if (horizontal) {
      const y = pick(rows);
      dist = W + len * 2;
      const a = -len, b = W + len;
      from = forward ? `translate(${a}px, ${y}px)` : `translate(${b}px, ${y}px) rotate(180deg)`;
      to = forward ? `translate(${b}px, ${y}px)` : `translate(${a}px, ${y}px) rotate(180deg)`;
    } else {
      const x = pick(cols);
      dist = H + len * 2;
      from = `translate(${x}px, ${-len}px) rotate(90deg)`;
      to = `translate(${x}px, ${H + len}px) rotate(90deg)`;
    }
    const dur = Math.max(4200, dist * 6.5);
    st.anim = st.el.animate(
      [{ transform: from, opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.9 }, { transform: to, opacity: 0 }],
      { duration: dur, easing: 'linear', fill: 'both' },
    );
    st.anim.finished.then(() => { st.timer = window.setTimeout(() => run(st), 600 + Math.random() * 2600); }, () => {});
  };
  const start = () => {
    if (running || reduceMotion) return;
    running = true;
    streaks.forEach((st, i) => { st.timer = window.setTimeout(() => run(st), i * 1400); });
  };
  const stop = () => {
    running = false;
    streaks.forEach((st) => { clearTimeout(st.timer); st.anim?.cancel(); });
  };

  build();
  for (let i = 0; i < 3; i++) { const el = document.createElement('span'); el.className = 'fg-streak'; host.append(el); streaks.push({ el }); }
  const io = new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop()), { threshold: 0.05 });
  io.observe(footer);
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = window.setTimeout(() => { if (footer.clientWidth !== W) { stop(); build(); start(); } }, 200); };
  window.addEventListener('resize', onResize, { passive: true });
  footerGridCleanup = () => { stop(); io.disconnect(); window.removeEventListener('resize', onResize); };
}

/* ------------------------------------------------------------------ */
/* Notched glass card (homepage "Artikel terbaru"): the top edge is    */
/* cut away between the two header labels, in the site's notch shape. */
/* ------------------------------------------------------------------ */
let notchCardObserver: ResizeObserver | null = null;
function notchCardPath(W: number, H: number, a: number, b: number, d: number, r: number) {
  const s = Math.min(Math.max(d * 1.6, 24), (b - a) / 3);   // width of each sloped side (gentle slope)
  const f = (n: number) => Math.round(n * 100) / 100;
  return [
    `M${f(r)},0 H${f(a)}`,
    `C${f(a + s * 0.45)},0 ${f(a + s * 0.55)},${f(d)} ${f(a + s)},${f(d)}`,
    `H${f(b - s)}`,
    `C${f(b - s * 0.55)},${f(d)} ${f(b - s * 0.45)},0 ${f(b)},0`,
    `H${f(W - r)} A${r},${r} 0 0 1 ${f(W)},${r} V${f(H - r)} A${r},${r} 0 0 1 ${f(W - r)},${f(H)}`,
    `H${r} A${r},${r} 0 0 1 0,${f(H - r)} V${r} A${r},${r} 0 0 1 ${r},0 Z`,
  ].join(' ');
}
function initNotchCards() {
  notchCardObserver?.disconnect();
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-notch-card]'));
  if (!cards.length) return;
  const shape = (card: HTMLElement) => {
    const label = card.querySelector<HTMLElement>('.hero__news-label');
    const link = card.querySelector<HTMLElement>('.hero__news-all');
    const item = card.querySelector<HTMLElement>('.hero__news-item');
    const edge = card.querySelector<SVGPathElement>('.hero__news-edge path');
    if (!label || !link || !item || !edge) return;
    const c = card.getBoundingClientRect();
    const W = c.width, H = c.height;
    const r = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 16;
    const a = label.getBoundingClientRect().right - c.left + 18;
    const b = link.getBoundingClientRect().left - c.left - 18;
    // a shallow cut (header-neck scale), never reaching the article row
    const d = Math.min(18, item.getBoundingClientRect().top - c.top - 8);
    if (b - a < 80 || d < 10) { card.classList.remove('is-notched'); card.style.removeProperty('clip-path'); return; }
    card.style.clipPath = `path('${notchCardPath(W, H, a, b, d, r)}')`;
    const svg = edge.ownerSVGElement!;
    svg.setAttribute('viewBox', `-0.5 -0.5 ${W} ${H}`);
    edge.setAttribute('d', notchCardPath(W - 1, H - 1, a - 0.5, b - 0.5, d - 0.5, r - 0.5));
    card.classList.add('is-notched');
  };
  notchCardObserver = new ResizeObserver((entries) => entries.forEach((e) => shape(e.target as HTMLElement)));
  cards.forEach((card) => { shape(card); notchCardObserver!.observe(card); });
  document.fonts?.ready.then(() => cards.forEach(shape));
}

/* ------------------------------------------------------------------ */
/* Grid backdrops (page heroes): a blue light follows the cursor and   */
/* lights the nearby grid lines and dots, like the client-logo grid.  */
/* ------------------------------------------------------------------ */
let gridGlowAbort: AbortController | null = null;
function initGridGlow() {
  gridGlowAbort?.abort();
  gridGlowAbort = new AbortController();
  const { signal } = gridGlowAbort;
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('.gridbg').forEach((el) => {
    // a short chain of points: the head follows the pointer, each point follows the one before it
    const N = 6;
    const pts = Array.from({ length: N }, () => ({ x: 0, y: 0 }));
    let tx = 0, ty = 0, lx = 0, ly = 0, energy = 0, raf = 0, fresh = true;
    const frame = () => {
      pts[0].x += (tx - pts[0].x) * 0.3; pts[0].y += (ty - pts[0].y) * 0.3;
      for (let i = 1; i < N; i++) { pts[i].x += (pts[i - 1].x - pts[i].x) * 0.2; pts[i].y += (pts[i - 1].y - pts[i].y) * 0.2; }
      pts.forEach((p, i) => { el.style.setProperty(`--g${i}x`, `${p.x.toFixed(1)}px`); el.style.setProperty(`--g${i}y`, `${p.y.toFixed(1)}px`); });
      energy *= 0.88;                                   // fades out within ~0.6s once the pointer rests
      el.style.setProperty('--ge', energy.toFixed(3));
      raf = energy > 0.01 ? requestAnimationFrame(frame) : 0;
      if (!raf) el.style.setProperty('--ge', '0');
    };
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (fresh) { pts.forEach((p) => { p.x = tx; p.y = ty; }); lx = tx; ly = ty; fresh = false; }
      const speed = Math.hypot(tx - lx, ty - ly);
      lx = tx; ly = ty;
      energy = Math.min(1, energy + speed / 28);       // brighter the faster it moves
      if (!raf) raf = requestAnimationFrame(frame);
    }, { signal });
    el.addEventListener('pointerleave', () => { fresh = true; }, { signal });
    signal.addEventListener('abort', () => cancelAnimationFrame(raf));
  });
}

/* ------------------------------------------------------------------ */
/* Full-bleed image bands (page heroes): a notch opens in the top edge */
/* as the band rises into view and the bottom notch closes as it       */
/* leaves (terminal-industries.com, below "Built by the Industry").    */
/* ------------------------------------------------------------------ */
let notchBands: { el: HTMLElement; last: string }[] = [];
function bandPath(W: number, H: number, a: number, b: number, s: number, dt: number, db: number) {
  const f = (n: number) => Math.round(n * 10) / 10;
  return [
    `M0,0 H${f(a)}`,
    `C${f(a + s * 0.45)},0 ${f(a + s * 0.55)},${f(dt)} ${f(a + s)},${f(dt)} H${f(b - s)}`,
    `C${f(b - s * 0.55)},${f(dt)} ${f(b - s * 0.45)},0 ${f(b)},0`,
    `H${f(W)} V${f(H)} H${f(b)}`,
    `C${f(b - s * 0.45)},${f(H)} ${f(b - s * 0.55)},${f(H - db)} ${f(b - s)},${f(H - db)} H${f(a + s)}`,
    `C${f(a + s * 0.55)},${f(H - db)} ${f(a + s * 0.45)},${f(H)} ${f(a)},${f(H)}`,
    `H0 Z`,
  ].join(' ');
}
function initNotchBands() {
  notchBands = Array.from(document.querySelectorAll<HTMLElement>('[data-notch-band]')).map((el) => ({ el, last: '' }));
  updateNotchBands();
}
function updateNotchBands() {
  if (!notchBands.length) return;
  const vh = window.innerHeight;
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
  for (const band of notchBands) {
    const r = band.el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) continue;
    const W = r.width, H = r.height;
    const maxD = Math.min(40, Math.max(18, W * 0.028));
    const dt = maxD * clamp01((vh - r.top) / vh);   // top notch deepens as the band rises to the top
    const db = maxD * clamp01(r.bottom / vh);       // bottom notch flattens as the band leaves
    const tab = Math.min(940, W * 0.72);
    const a = (W - tab) / 2, b = W - a, s = Math.min(60, W * 0.045);
    const d = bandPath(W, H, a, b, s, dt, db);
    if (d !== band.last) { band.el.style.clipPath = `path('${d}')`; band.last = d; }
  }
}

/* ------------------------------------------------------------------ */
/* Company history (Tentang Kami): horizontal year accordion. Hover,   */
/* click or arrow keys open a year; it also cycles on its own while    */
/* in view (paused under the pointer, stopped after any interaction).  */
/* ------------------------------------------------------------------ */
let historyCleanup: (() => void) | null = null;
function initHistory() {
  historyCleanup?.();
  historyCleanup = null;
  const root = document.querySelector<HTMLElement>('[data-history]');
  if (!root) return;
  const ac = new AbortController();
  const { signal } = ac;

  const wrap = root.querySelector<HTMLElement>('[data-yrs]');
  const yrs = Array.from(root.querySelectorAll<HTMLElement>('[data-yr]'));
  const tabs = yrs.map((y) => y.querySelector<HTMLButtonElement>('[data-yr-tab]')!);
  if (!wrap || !yrs.length) { historyCleanup = () => ac.abort(); return; }
  const n = yrs.length;
  let cur = yrs.findIndex((y) => y.classList.contains('is-active'));
  if (cur < 0) cur = 0;
  let auto = !reduceMotion, visible = false, hovering = false, hoverTimer = 0;
  const wide = () => window.innerWidth > 1365;

  const syncAuto = () => {
    wrap.classList.toggle('is-auto', auto && wide());
    wrap.classList.toggle('is-paused', !visible || hovering);
  };
  const open = (i: number, user = false) => {
    i = (i + n) % n;
    if (user && auto) { auto = false; syncAuto(); }
    if (i === cur) return;
    yrs[cur].classList.remove('is-active');
    tabs[cur].setAttribute('aria-selected', 'false'); tabs[cur].tabIndex = -1;
    cur = i;
    yrs[cur].classList.add('is-active');
    tabs[cur].setAttribute('aria-selected', 'true'); tabs[cur].tabIndex = 0;
    if (reduceMotion) return;
    yrs[cur].querySelectorAll<HTMLElement>('.yr__items > li').forEach((li, k) => {
      li.animate([{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 480, delay: 260 + k * 55, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    });
    yrs[cur].querySelector('.yr__big')?.animate([{ transform: 'translateY(30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 220, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  };

  yrs.forEach((y, i) => {
    tabs[i].addEventListener('click', () => open(i, true), { signal });
    // desktop: open on hover, with a short intent delay so sweeping across doesn't flicker
    y.addEventListener('pointerenter', (e) => {
      if ((e as PointerEvent).pointerType !== 'mouse' || !wide()) return;
      clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => open(i, true), 140);
    }, { signal });
    y.addEventListener('pointerleave', () => clearTimeout(hoverTimer), { signal });
  });
  wrap.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    const fwd = k === 'ArrowRight' || k === 'ArrowDown', back = k === 'ArrowLeft' || k === 'ArrowUp';
    if (fwd || back || k === 'Home' || k === 'End') {
      e.preventDefault();
      open(k === 'Home' ? 0 : k === 'End' ? n - 1 : cur + (fwd ? 1 : -1), true);
      tabs[cur].focus();
    }
  }, { signal });
  wrap.addEventListener('animationend', (e) => {
    if (auto && (e.target as HTMLElement).classList.contains('yr__prog')) open(cur + 1);
  }, { signal });
  wrap.addEventListener('pointerenter', () => { hovering = true; syncAuto(); }, { signal });
  wrap.addEventListener('pointerleave', () => { hovering = false; syncAuto(); }, { signal });
  window.addEventListener('resize', syncAuto, { passive: true, signal });
  const io = new IntersectionObserver((es) => { visible = es[0].intersectionRatio >= 0.4; syncAuto(); }, { threshold: [0, 0.4] });
  io.observe(wrap);
  syncAuto();
  historyCleanup = () => { ac.abort(); io.disconnect(); clearTimeout(hoverTimer); };
}

/* ------------------------------------------------------------------ */
/* History background: three plain lines with rounded corners and a    */
/* small light travelling along each (terminal-industries.com/about     */
/* footer, simplified).                                                 */
/* ------------------------------------------------------------------ */
let histLinesCleanup: (() => void) | null = null;
function roundedPolyline(pts: [number, number][], r: number) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1];
    const inLen = Math.hypot(x - px, y - py), outLen = Math.hypot(nx - x, ny - y);
    const k = Math.min(r, inLen / 2, outLen / 2);
    const ax = x - ((x - px) / inLen) * k, ay = y - ((y - py) / inLen) * k;
    const bx = x + ((nx - x) / outLen) * k, by = y + ((ny - y) / outLen) * k;
    d += ` L${ax.toFixed(1)},${ay.toFixed(1)} Q${x},${y} ${bx.toFixed(1)},${by.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0]},${last[1]}`;
}
type Pt = [number, number];
// small seeded PRNG so each year always gets the same (but its own) layout
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// three lines per year: L- and Z-shapes entering from different edges, one per height band
function yearLayout(seed: number, W: number, H: number): Pt[][] {
  const rnd = mulberry32(seed * 9301 + 49297);
  const r = (a: number, b: number) => a + rnd() * (b - a);
  const shapes = [
    (v: number): Pt[] => { const x = r(0.3, 0.85) * W; return [[x, 0], [x, v], [W, v]]; },            // from top, out right
    (v: number): Pt[] => { const x = r(0.25, 0.7) * W; return [[x, 0], [x, v], [0, v]]; },             // from top, out left
    (v: number): Pt[] => { const x = r(0.3, 0.8) * W; return [[0, v], [x, v], [x, H]]; },              // from left, down
    (v: number): Pt[] => { const x = r(0.35, 0.85) * W; return [[W, v], [x, v], [x, H]]; },            // from right, down
    (v: number): Pt[] => { const a = r(0.15, 0.45) * W, c = r(0.55, 0.9) * W; return rnd() < 0.5 ? [[a, 0], [a, v], [c, v], [c, H]] : [[c, 0], [c, v], [a, v], [a, H]]; }, // Z, top → bottom
    (v: number): Pt[] => { const b = r(0.3, 0.75) * W, v2 = Math.min(H * 0.94, v + r(0.14, 0.26) * H); return rnd() < 0.5 ? [[0, v], [b, v], [b, v2], [W, v2]] : [[W, v], [b, v], [b, v2], [0, v2]]; }, // step, side → side
  ];
  const pool = shapes.map((_, i) => i);
  const bands: [number, number][] = [[0.1, 0.3], [0.38, 0.58], [0.66, 0.84]];
  return bands.map(([lo, hi]) => {
    const k = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
    return shapes[k](r(lo, hi) * H);
  });
}
function initHistoryLines() {
  histLinesCleanup?.();
  histLinesCleanup = null;
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-yr]'));
  if (!cards.length) return;
  const NS = 'http://www.w3.org/2000/svg';
  const state = new Map<HTMLElement, { key: string; anims: Animation[] }>();
  const pauseT = new Map<HTMLElement, number>();
  let onScreen = false;

  // drawn at the card's FINAL open size (panel width × card height), pinned top-left,
  // so the lines are already there while the card is still widening
  const build = (card: HTMLElement) => {
    const host = card.querySelector<HTMLElement>('[data-yr-lines]');
    const panel = card.querySelector<HTMLElement>('.yr__panel');
    if (!host) return null;
    const W = Math.round(panel?.offsetWidth || card.clientWidth), H = Math.round(card.offsetHeight);
    if (W < 200 || H < 120) return null;
    const key = `${W}x${H}`, prev = state.get(card);
    if (prev?.key === key) return prev;
    prev?.anims.forEach((a) => a.cancel());
    const seed = parseInt(card.querySelector('.yr__label')?.textContent || '', 10) || cards.indexOf(card) + 1;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H));
    const dots: SVGPathElement[] = [];
    yearLayout(seed, W, H).forEach((pts) => {
      const d = roundedPolyline(pts, 28);
      const base = document.createElementNS(NS, 'path');
      base.setAttribute('class', 'hl-line'); base.setAttribute('d', d);
      svg.append(base);
      if (reduceMotion) return;
      const dot = document.createElementNS(NS, 'path');
      dot.setAttribute('class', 'hl-dot'); dot.setAttribute('d', d);
      svg.append(dot); dots.push(dot);
    });
    host.replaceChildren(svg);
    const phase = [0.18, 0.5, 0.8];
    const anims = dots.map((dot, i) => {
      const len = dot.getTotalLength(), seg = 18;
      dot.style.strokeDasharray = `${seg} ${len + seg}`;
      const duration = Math.max(2200, len * 5);
      const a = dot.animate(
        [{ strokeDashoffset: seg, opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.92 }, { strokeDashoffset: -len, opacity: 0 }],
        { duration, iterations: Infinity, easing: 'linear' },
      );
      // start mid-run so a light is already moving the moment the card opens
      a.currentTime = duration * phase[i % phase.length];
      a.pause();
      return a;
    });
    const st = { key, anims };
    state.set(card, st);
    return st;
  };
  const activate = (card: HTMLElement) => {
    clearTimeout(pauseT.get(card));
    const st = build(card);
    if (st && onScreen) st.anims.forEach((a) => a.play());
  };
  const deactivate = (card: HTMLElement) => {
    // let it fade out (CSS) before freezing
    pauseT.set(card, window.setTimeout(() => state.get(card)?.anims.forEach((a) => a.pause()), 450));
  };

  // react in the same frame the class flips (microtask), not after the width transition
  const mo = new MutationObserver((recs) => {
    const seen = new Set<HTMLElement>();
    for (const r of recs) {
      const card = r.target as HTMLElement;
      if (seen.has(card)) continue;
      seen.add(card);
      card.classList.contains('is-active') ? activate(card) : deactivate(card);
    }
  });
  cards.forEach((c) => mo.observe(c, { attributes: true, attributeFilter: ['class'] }));

  // layout changes (viewport resize, mobile row heights): redraw the open card if its size changed
  let rt = 0;
  const wrap = cards[0].parentElement!;
  const ro = new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(() => { const c = cards.find((x) => x.classList.contains('is-active')); if (c) activate(c); }, 150);
  });
  ro.observe(wrap);
  const io = new IntersectionObserver((es) => {
    onScreen = es[0].isIntersecting;
    const c = cards.find((x) => x.classList.contains('is-active'));
    const st = c && state.get(c);
    st?.anims.forEach((a) => (onScreen ? a.play() : a.pause()));
  });
  io.observe(wrap);
  const first = cards.find((c) => c.classList.contains('is-active'));
  if (first) activate(first);
  histLinesCleanup = () => {
    mo.disconnect(); ro.disconnect(); io.disconnect(); clearTimeout(rt);
    pauseT.forEach((t) => clearTimeout(t));
    state.forEach((st) => st.anims.forEach((a) => a.cancel()));
  };
}

/* ------------------------------------------------------------------ */
/* Business lines: line fields with travelling lights; chip wave.       */
/* ------------------------------------------------------------------ */
let servicesAbort: AbortController | null = null;
function initServices() {
  servicesAbort?.abort();
  servicesAbort = new AbortController();
  const { signal } = servicesAbort;
  // line fields: faint rounded lines with a light running along each (history-card motif), drawn to the host's size
  const NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll<HTMLElement>('[data-lines]').forEach((host) => {
    const seed = parseInt(host.dataset.seed || '1', 10);
    const panel = host.parentElement!;
    let anims: Animation[] = [], key = '', onScreen = false;
    // "rows": the dividers between the stats are the lines; each runs from the text's left edge and
    // bends away into the empty right side (first up to the top, next down to the bottom, alternating,
    // at different x), so no two lines cross, touch the text, or run close together
    const rowLayout = (W: number, H: number): Pt[][] | null => {
      const rows = Array.from(panel.querySelectorAll<HTMLElement>('[data-row]'));
      if (rows.length < 2) return null;
      const hr = host.getBoundingClientRect();
      const x0 = Math.round(rows[0].getBoundingClientRect().left - hr.left);
      const out: Pt[][] = [];
      for (let k = 1; k < rows.length; k++) {
        const y = Math.round(rows[k].getBoundingClientRect().top - hr.top);
        const up = k % 2 === 1;
        const x = Math.round(W - Math.max(40, W * (up ? 0.2 : 0.1)));
        out.push(up ? [[x0, y], [x, y], [x, 0]] : [[x0, y], [x, y], [x, H]]);
      }
      return out;
    };
    const draw = () => {
      const W = Math.round(host.clientWidth), H = Math.round(host.clientHeight);
      const rowsKey = host.dataset.lines === 'rows' ? Array.from(panel.querySelectorAll<HTMLElement>('[data-row]')).map((r) => r.offsetTop).join(',') : '';
      if (W < 120 || H < 120 || `${W}x${H}:${rowsKey}` === key) return;
      key = `${W}x${H}:${rowsKey}`;
      anims.forEach((a) => a.cancel()); anims = [];
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H));
      const dots: SVGPathElement[] = [];
      const layout = (host.dataset.lines === 'rows' && rowLayout(W, H)) || yearLayout(seed, W, H);
      panel.classList.toggle('has-lines', true);
      layout.forEach((pts) => {
        const d = roundedPolyline(pts, 28);
        const base = document.createElementNS(NS, 'path'); base.setAttribute('class', 'hl-line'); base.setAttribute('d', d); svg.append(base);
        if (reduceMotion) return;
        const dot = document.createElementNS(NS, 'path'); dot.setAttribute('class', 'hl-dot'); dot.setAttribute('d', d); svg.append(dot); dots.push(dot);
      });
      host.replaceChildren(svg);
      anims = dots.map((dot, i) => {
        const len = dot.getTotalLength(), seg = 18;
        dot.style.strokeDasharray = `${seg} ${len + seg}`;
        const duration = Math.max(2400, len * 5.5);
        const a = dot.animate([{ strokeDashoffset: seg, opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.92 }, { strokeDashoffset: -len, opacity: 0 }], { duration, iterations: Infinity, easing: 'linear' });
        // stagger so the lights are never side by side
        a.currentTime = duration * [0.1, 0.55, 0.8][i % 3];
        if (!onScreen) a.pause();
        return a;
      });
    };
    let rt = 0;
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = window.setTimeout(draw, 120); });
    ro.observe(host);
    const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; anims.forEach((a) => (onScreen ? a.play() : a.pause())); });
    io.observe(host);
    draw();
    signal.addEventListener('abort', () => { ro.disconnect(); io.disconnect(); clearTimeout(rt); anims.forEach((a) => a.cancel()); });
  });
  // scope chips rise in as a wave the first time they come into view
  document.querySelectorAll<HTMLElement>('[data-chips]').forEach((list) => {
    if (reduceMotion) return;
    const chips = Array.from(list.children) as HTMLElement[];
    chips.forEach((c) => { c.style.opacity = '0'; });
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      chips.forEach((c, k) => {
        c.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: k * 70, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' })
          .finished.then(() => { c.style.opacity = ''; }, () => { c.style.opacity = ''; });
        c.style.opacity = '';
      });
    }, { threshold: 0.3 });
    io.observe(list);
    signal.addEventListener('abort', () => { io.disconnect(); chips.forEach((c) => { c.style.opacity = ''; }); });
  });
}

/* ------------------------------------------------------------------ */
/* Tabs: [data-tabs] with [data-tab] buttons and [data-tab-panel] lists; */
/* the opened panel's items rise in as a wave. Arrow keys move tabs.    */
/* ------------------------------------------------------------------ */
let tabsAbort: AbortController | null = null;
function initTabs() {
  tabsAbort?.abort();
  tabsAbort = new AbortController();
  const { signal } = tabsAbort;
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-tab-panel], [data-pane]'));
    let cur = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));
    const prev = root.querySelector<HTMLButtonElement>('[data-tab-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-tab-next]');
    // a tab row that scrolls sideways (phones) keeps the chosen tab in view; never scrolls the page
    const centre = (smooth: boolean) => {
      const row = tabs[cur]?.parentElement;
      if (!row || row.scrollWidth <= row.clientWidth + 1) return;
      const left = tabs[cur].offsetLeft - (row.clientWidth - tabs[cur].offsetWidth) / 2;
      row.scrollTo({ left, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    };
    const sync = () => {
      // progress for rails (--tab-p), earlier tabs marked done, chevrons disabled at the ends
      root.style.setProperty('--tab-p', String(tabs.length > 1 ? cur / (tabs.length - 1) : 1));
      tabs.forEach((t, k) => t.classList.toggle('is-done', k < cur));
      if (prev) prev.disabled = cur <= 0;
      if (next) next.disabled = cur >= tabs.length - 1;
    };
    const open = (i: number, focus = false) => {
      cur = i;
      tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      // toggleAttribute works for SVG panels too (the .hidden property only exists on HTML elements)
      panels.forEach((p, k) => { p.toggleAttribute('hidden', k !== i); });
      sync();
      if (focus) tabs[i].focus();
      centre(true);
      // companions: elements tied to a panel index ([data-years] etc.) follow it
      root.querySelectorAll<HTMLElement>('[data-years]').forEach((el) => { el.hidden = Number(el.dataset.years) !== i; });
      if (reduceMotion || root.hasAttribute('data-tab-still')) return;
      Array.from(panels[i].children).forEach((c, k) => (c as HTMLElement).animate(
        [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 520, delay: Math.min(k, 14) * 35, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' },
      ));
    };
    const hashed = root.hasAttribute('data-tab-hash');
    tabs.forEach((t, k) => t.addEventListener('click', () => {
      if (k === cur) return;
      open(k);
      // [data-tab-hash]: the URL names the open tab, so it can be shared and reloaded
      if (hashed && panels[k]?.id) history.replaceState(history.state, '', `#${panels[k].id}`);
    }, { signal }));
    panels.forEach((p, k) => p.addEventListener('tab:reveal', () => { if (k !== cur) open(k); }, { signal }));
    // [data-tab-hover]: a mouse hovering a tab opens it too (short intent delay)
    if (root.hasAttribute('data-tab-hover')) {
      let ht = 0;
      tabs.forEach((t, k) => {
        t.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType !== 'mouse') return; clearTimeout(ht); ht = window.setTimeout(() => { if (k !== cur) open(k); }, 120); }, { signal });
        t.addEventListener('pointerleave', () => clearTimeout(ht), { signal });
      });
    }
    prev?.addEventListener('click', () => { if (cur > 0) open(cur - 1); }, { signal });
    next?.addEventListener('click', () => { if (cur < tabs.length - 1) open(cur + 1); }, { signal });
    sync();
    centre(false);
    tabs[0]?.parentElement?.addEventListener('keydown', (e) => {
      const key = (e as KeyboardEvent).key;
      if (key !== 'ArrowRight' && key !== 'ArrowLeft') return;
      e.preventDefault();
      open((cur + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length, true);
    }, { signal });
  });
}

/* ------------------------------------------------------------------ */
/* Expanding panels: [data-expand] > [data-expand-item]; the item in   */
/* focus (hover with a short intent delay, focus, click) widens.        */
/* ------------------------------------------------------------------ */
let expandAbort: AbortController | null = null;
function initExpand() {
  expandAbort?.abort();
  expandAbort = new AbortController();
  const { signal } = expandAbort;
  document.querySelectorAll<HTMLElement>('[data-expand]').forEach((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-expand-item]'));
    let timer = 0;
    const open = (el: HTMLElement) => items.forEach((it) => it.classList.toggle('is-active', it === el));
    items.forEach((it) => {
      it.addEventListener('pointerenter', (e) => {
        if ((e as PointerEvent).pointerType !== 'mouse') return;
        clearTimeout(timer);
        timer = window.setTimeout(() => open(it), 120);
      }, { signal });
      it.addEventListener('pointerleave', () => clearTimeout(timer), { signal });
      it.addEventListener('focus', () => open(it), { signal });
      it.addEventListener('click', () => open(it), { signal });
    });
    signal.addEventListener('abort', () => clearTimeout(timer));
  });
}

/* ------------------------------------------------------------------ */
/* Connected steps (GCG WBS): the step crossing the upper third of the  */
/* screen is current; earlier ones are done.                             */
/* ------------------------------------------------------------------ */
let wbsAbort: AbortController | null = null;
function initWbsSteps() {
  wbsAbort?.abort();
  wbsAbort = new AbortController();
  const { signal } = wbsAbort;
  document.querySelectorAll<HTMLElement>('[data-wb-steps]').forEach((root) => {
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-wb-step]'));
    if (!steps.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let cur = -1;
      steps.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) cur = k; });
      if (cur >= 0 && steps[cur].getBoundingClientRect().bottom < line * 0.5) cur = -1; // scrolled past the list
      steps.forEach((s, k) => { s.classList.toggle('is-current', k === cur); s.classList.toggle('is-done', cur >= 0 && k < cur); });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    window.addEventListener('resize', onScroll, { passive: true, signal });
    update();
  });
}

/* Read more: [data-more] toggles the clamped text it controls (aria-controls); hidden when nothing is cut */
function initReadMore() {
  document.querySelectorAll<HTMLButtonElement>('[data-more]').forEach((btn) => {
    const text = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!text) return;
    if (text.scrollHeight <= text.clientHeight + 2) { btn.hidden = true; return; }
    btn.addEventListener('click', () => {
      const open = !text.classList.contains('is-open');
      text.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? tr().close : tr().readMore;
    });
  });
}

/* ------------------------------------------------------------------ */
/* Load more: [data-load-more=N] (aria-controls = the list) unhides the */
/* next N [data-load-item] children; focus moves to the first new one.  */
/* ------------------------------------------------------------------ */
function initLoadMore() {
  document.querySelectorAll<HTMLButtonElement>('[data-load-more]').forEach((btn) => {
    const list = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!list) return;
    const step = Number(btn.dataset.loadMore) || 9;
    const left = btn.querySelector<HTMLElement>('[data-load-left]');
    btn.addEventListener('click', () => {
      const rest = Array.from(list.querySelectorAll<HTMLElement>('[data-load-item][hidden]'));
      const next = rest.slice(0, step);
      next.forEach((el, k) => {
        el.hidden = false;
        if (!reduceMotion) el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: k * 35, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
      const remaining = rest.length - next.length;
      if (left) left.textContent = String(remaining);
      next[0]?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
      // the button's wrapper ([data-load-wrap]) goes too, so no empty gap is left behind
      if (remaining <= 0) (btn.closest<HTMLElement>('[data-load-wrap]') ?? btn).hidden = true;
      lenis?.resize();
    });
  });
}

/* Albums: [data-album] buttons open their photos ([data-album-images], JSON) in the lightbox */
function initAlbums() {
  document.querySelectorAll<HTMLButtonElement>('[data-album]').forEach((btn) => {
    btn.addEventListener('click', () => {
      let srcs: string[] = [];
      try { srcs = JSON.parse(btn.dataset.albumImages || '[]'); } catch { return; }
      // small label: the group ("Galeri"); caption: the album; the counter already numbers the photos
      const album = btn.dataset.album || '';
      openLightbox?.(srcs.map((src) => ({ src, caption: album })), 0, btn.dataset.albumGroup || '');
    });
  });
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */
function init() {
  observers.forEach((o) => o.disconnect());
  observers = [];
  lastY = scrollY();
  initMenu();
  initHeaderMorph();
  initSheet();
  initLogoCarousel();
  initFooterGrid();
  initNotchCards();
  initGridGlow();
  initNotchBands();
  initHistory();
  initHistoryLines();
  initServices();
  initReveal();
  initParallax();
  initCounters();
  initSubnav();
  initAnchors();
  initLightbox();
  initDialogs();
  initVideos();
  initSwitchers();
  initForms();
  initFilter();
  initCharts();
  initCopy();
  initScrollers();
  initSteps();
  initHeadlineSweep();
  initTabs();
  initExpand();
  initWbsSteps();
  initReadMore();
  initLoadMore();
  initAlbums();
  initYouTubeBg();
  onScroll();
  lenis?.resize();
  requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('is-loaded')));
  if (location.hash) {
    const t = hashTarget(location.hash);
    if (t) setTimeout(() => scrollToTarget(t, true), 60);
  }
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-preparation', () => { html.classList.remove('is-arrived'); html.classList.add('is-navigating'); });
document.addEventListener('astro:before-swap', () => { html.classList.remove('is-loaded'); destroyYouTubeBg(); });
document.addEventListener('astro:after-swap', () => {
  html.classList.remove('is-navigating');
  html.classList.add('is-arrived', 'js');
  if (lenis) html.classList.add('lenis', 'lenis-smooth');
  document.body.style.overflow = '';
  lenis?.start();
  if (!location.hash) lenis?.scrollTo(0, { immediate: true });
});
