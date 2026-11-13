# PGN Solution — Corporate Website (revamp)

Static website for PT PGAS Solution, built with [Astro](https://astro.build). It has 375 pages: every page in the new sitemap, all 148 press releases, 17 news articles and 3 CSR articles, each in Indonesian (at the root) and English (under `/en`), plus the 404 page.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs static files to dist/
npm run preview    # serves dist/
```

Requires Node 18.20+ (developed on Node 24).

Optional environment variable (copy `.env.example` to `.env`):

| Variable | Purpose |
| --- | --- |
| `PUBLIC_FORM_ENDPOINT` | URL that receives form POSTs (`multipart/form-data`) from the contact, TUK and career forms. Without it, the forms open the visitor's email client with the message already filled in. |

## Sitemap → routes

| # | Page | Route |
| --- | --- | --- |
| 01 | Homepage | `/` |
| 02 | About Us | `/about` |
| 03 | Business (includes the former `/id/tuk` page) | `/business` |
| 04 | GCG & Compliance | `/gcg` |
| 05 | Investor Relations | `/investor-relations` |
| 5.1 | Annual Report | `/investor-relations/annual-report` |
| 06 | Partnership | `/partnership` |
| 07 | Article | `/articles`: one section with tabs for Press Release (`#press-release`), Berita (`#news`) and Galeri (`#gallery`) |
| 7.1 | News Article Detail | `/articles/news/[slug]` |
| 7.2 | Press Release Detail | `/articles/press-release/[slug]` |
| 7.3 | Gallery | the Galeri tab on `/articles` (albums open in the lightbox) |
| 08 | Careers | `/careers` |
| 8.1 | Career Opportunities | `/careers/opportunities` |
| 8.2 | Career Detail / Application | `/careers/opportunities/[slug]` (one page per job) and `/careers/apply` |
| 09 | Contact Us | `/contact` |

CSR articles linked from the GCG page use the same article template at `/articles/csr/[slug]`.

The old top-level URLs (`/id/about`, `/id/service`, `/id/gcg`, …) redirect to the new routes. See `astro.config.mjs`.

## Project structure

```
src/
  data/                 Page copy, taken word for word from www.pgn-solution.co.id (ID)
    site.ts             Company info, navigation, socials, shared CTA
    about.ts business.ts gcg.ts investor.ts pages.ts
    en/                 English copy: each file reuses its Indonesian twin and replaces only the words
    generated/          Scraped content as JSON (articles, gallery, board, reports, logos;
                        en.json = English article text, album titles and award labels)
  i18n/                 Locales: index.ts (routing helpers), content.ts (data per locale), ui.ts (interface words)
  middleware.ts         Prefixes internal links with /en on English pages
  lib/content.ts        Typed accessors and helpers for the generated data
  components/           Header, Footer, PageHero, SubNav, Frame, ArticleCard, forms, chart…
  layouts/Base.astro    <head>/SEO, view transitions, lightbox
  pages/[...lang]/      One file per route, built once per locale (/about and /en/about)
  scripts/app.ts        Client behaviour: smooth scroll, reveals, header, lightbox, dialogs, forms
  styles/global.css     Design tokens and shared component styles
public/media/           Original imagery downloaded from the existing site (resized and compressed)
```

### CMS (`/cms`)
A content manager for the Artikel page: press releases, news and gallery albums (create, edit, publish or draft, delete with undo, bulk publish/draft/delete, search, filters, sorting, paging; album photos can be uploaded, reordered by dragging, set as cover or removed). It is not linked from the site and is marked `noindex`.
- **Preview:** "Pratinjau" in the article and album editors opens the real public page in a frame (desktop or phone width) and fills it with what is in the editor, saved or not: the article page itself and its card on the Artikel page, or the album's card in the Galeri tab with its photos in the lightbox. It borrows an existing page as the template and swaps the content in the browser (`openPreview`, `previewPost`, `previewAlbum` in `src/cms/app.ts`), so it follows any change to the site's templates.
- **Front end only.** It starts from `/cms/seed.json` (built from the site's own articles and gallery by `src/pages/cms/seed.json.ts`) and keeps every change in the browser's `localStorage` (`pgn-cms:v1`) as an overlay, so edits survive a reload but stay in that browser. Uploaded images are scaled down in the browser and stored as data URLs. Nothing is sent anywhere and the public pages do not change.
- **Code:** `src/pages/cms/index.astro` (shell), `src/cms/app.ts` (store, router, views), `src/cms/cms.css`. The site's middleware skips `/cms`.
- **To make it real:** replace the store functions in `app.ts` (`allPosts`, `savePost`, `removePosts`, `allAlbums`, `saveAlbum`, `removeAlbum`, `readImage`) with calls to a backend, and have the site read its content from there.

### Languages (ID / EN)
- **Routes:** Indonesian is the default at the root (`/about`); English lives under `/en` (`/en/about`). Every page sits in `src/pages/[...lang]/` and is built for both. The header's language picker (desktop panel and mobile ID/EN toggle) links to the same page in the other language; each page declares the other as its `hreflang` alternate.
- **Links:** pages write plain internal links (`/business#epc`); `src/middleware.ts` prefixes them with `/en` on English pages. The only exception is the picker's Indonesian link, written with `keepId()`.
- **Copy:** Indonesian copy stays in `src/data/*.ts`. English copy is in `src/data/en/*.ts`; each file spreads its Indonesian twin and overrides only the text, so images, numbers and order stay in one place. Pages read both through `content(lang)` (`src/i18n/content.ts`). Interface words used across pages (header, footer, lightbox, forms) are in `src/i18n/ui.ts`; words used by one page sit in a small `L = { id, en }` table at the top of that page. Text written by scripts (read more, form messages, carousel status) switches on `<html lang>` (`T_ID` / `T_EN` in `src/scripts/app.ts`).
- **Where the English comes from:** the original site's English pages (`/en/*`) where they exist, with obvious typos fixed. Those pages leave several sections in Indonesian (O&M and Supply Chain details, product and portfolio lines, history 2021–2023, Anti-Bribery, WBS, part of CSR, form options) and repeat the "1 Solution" text for all three packages; those parts are translated from the current Indonesian copy. Where the two versions disagree on a figure, the Indonesian (current) value is used.
- **Articles:** 124 of the 168 articles have an English version on the original site (fetched from the `/en/` twin of each source URL, images mapped to local files, excerpts made the same way). The other 44 exist only in Indonesian; on English pages they keep their Indonesian text, are marked `lang="id"`, and the article page says "This article is only available in Indonesian." Article URLs are the same in both languages (`/en/articles/news/<slug>`).
- **BOD & BOC profiles:** the original English site shows them in Indonesian. On English pages the roles, field labels, degree levels, months and appointment deeds are translated by rule (`src/data/en/board.ts`); institution names and earlier job titles stay as published.
- **Adding copy:** add new text to both the Indonesian data file and its `src/data/en/` twin (or to both halves of a page's `L` table).

### Editing content
- **Static copy:** edit the files in `src/data/` (Indonesian) and `src/data/en/` (English).
- **Articles:** `src/data/generated/articles.json`. Each entry has `category` (`press-release` | `news` | `csr`), `slug`, `title`, `isoDate`, `image`, `excerpt` and `body` (sanitised HTML).
- **Job vacancies:** add entries to `jobs` in `src/data/pages.ts`. Each one automatically gets a detail page with an application form.
- **Partnership announcements:** add entries to `partnership.announcements` in `src/data/pages.ts`.
- **Partnership procedures:** documents and links live in `partnership.procedures`; `partnership.procedureGroups` sorts them into the three topic cards (by index).

## Design system (summary)
Component language follows the reference site (terminal-industries.com), measured at 1440px. Colours stay PGN.

- **Homepage hero hand-off:** the hero is pinned (`position: sticky`) and the rest of the page is a white sheet that slides up over it, as on terminal-industries.com. The top edge of the sheet has a tab-shaped cut-out that the hero shows through. Its depth is tied to scroll: 40px while the sheet sits at the bottom of the viewport, shrinking to flat as the sheet reaches the top. Once the hero is fully covered it is hidden. The code is `initSheet`/`updateSheet` in `src/scripts/app.ts`.
- **Client logos (homepage):** `LogoCarousel.astro` is one row of square cells modelled on the "Built by the Industry" grid at terminal-industries.com:
  - **Grid:** crosshair corners, and grid lines that fade out on every side.
  - **Hover:** a cursor-following PGN-blue glow lights the nearby cell borders, and the logo turns from grey to colour.
  - **Paging:** chevrons page through all 48 logos (5 per page on desktop, 3 below 1024px). The cells swap in a 70ms-staggered wave, left to right going forward and right to left going back.
  - **Code:** `initLogoCarousel` in `src/scripts/app.ts`.
- **Homepage order:** hero, then Bisnis Kami, Tentang Kami (the three-step "Setiap usaha untuk keunggulan" block, with the pipes), Klien Kami, and the latest articles.
- **Tentang Kami pipes:** the yellow pipes at either side of Tentang Kami are one asset, `public/media/client/pipe-xl.webp` (made from `Test.png`), mirrored for the right side. The pattern follows the gantries on thelaunchcompany.cc.
  - **Bottom fade:** only the bottom fades into the page.
  - **Sizing:** the pipes have a fixed size, `clamp(200px, 16.5vw, 340px)`. The section's content padding grows so all content stays 32px clear of the flanges.
  - **Layering:** all section content sits on one layer below the pipes, so the pipes are always in front.
  - **Small screens:** below 1360px they are hidden.
- **Bisnis Kami background:** Bisnis Kami is the first section on the sheet. Its grey starts under the notch edge, which takes the same grey, and fades into the white of Tentang Kami at the bottom.
- **Tentang Kami steps:** modelled on terminal-industries.com's feature steps.
  - **Sticky image:** the notch on its left edge travels from top to bottom as the steps are scrolled.
  - **Text:** each figure and caption fits on one line (sized from the column with container units).
  - **Activation:** when a step becomes active its characters sweep grey → PGN blue → final colour with a 14ms per-character stagger, like the reference's lime sweep.
  - **Code:** `splitChars`, `initSteps` and `updateSteps` in `src/scripts/app.ts`.
- **Headline sweep (site-wide):** every plain-text section headline (`.sec-head` titles and `h2.t-xl` / `t-lg` / `t-md`, page heroes excluded) gets the same per-character grey → blue → own-colour sweep once it scrolls into view. Dark sections use the lighter blue. The code is `initHeadlineSweep` in `src/scripts/app.ts`, with styles under `.sweep` in `global.css`.
- **Footer:**
  - **Top tab:** a white tab hangs into the top centre, the same size as the hero notch.
  - **Background:** behind the closing CTA sits a faint grid with crosshairs (the client-logo grid vocabulary), with blue light streaks travelling along its lines. This follows the moving lines in terminal-industries.com's footer; the code is `initFooterGrid` in `src/scripts/app.ts`.
  - **CTA:** the headline is two lines and the button is white.
  - **Footer body:** small mono labels, 16px links, and muted contact details.
  - **Kontak page:** it has no CTA, so it shows neither the tab nor the grid, because the section above the footer is dark there.
- **Inner pages follow the homepage system:**
  - **Cards:** `.card` uses the homepage surface (white, 20px radius, hairline edge); dark cards keep a deep surface.
  - **Article cards:** `ArticleCard` uses the business-card layout: framed photo with an optional badge, date, a two-line title, a two-line excerpt and a "Baca →" footer. On /articles, press releases and news use the homepage feed card (full photo, white badge, text bottom-left), nine per tab with "Tampilkan lebih banyak" for the next nine.
  - **Articles page:** the hero, a headline, then the tabs. The old listing URLs (`/articles/press-release`, `/articles/news`, `/articles/gallery`) redirect to their tab. A hash naming a tab panel opens that tab (`hashTarget` in `src/scripts/app.ts`), so menu links and "Lihat semua" on article pages land on the right tab.
  - **Scrollers:** they use the round `.chev-btn`. Every chevron on the site is PGN blue with a white arrow. On hover it brightens to `#2aa3df`, like the primary button in the header. At the end of a row it becomes a faint outline.
  - **TUK partners:** they use `LogoCarousel`.
  - **Headlines:** section headlines aim for two lines (`SectionHead` never goes narrower than 22ch, and titles over 60 characters step down a size). The page heroes and the floating section nav are unchanged.
- **Hero image bands (inner pages and article detail):**
  - **Layout:** the image under each page hero is full-bleed (up to one viewport tall).
  - **Notches:** a centred notch (the hero-tab width) opens in its top edge as it rises into view, reaching 40px when it meets the top of the viewport. The bottom notch closes as it scrolls away, so the edges are straight when the band is not in focus. This follows terminal-industries.com.
  - **Code:** `initNotchBands` / `updateNotchBands` in `src/scripts/app.ts`.
- **No breadcrumbs:** page heroes no longer show breadcrumbs; the active header item marks the section.
- **Bisnis, business lines (`ServiceLine.astro`):** EPC, O&M, Supply Chain and TUK share one layout, laid out to explain itself (described below with EPC as the example).
  - **Panel content:** EPC's blue panel shows its stats. Lines without stats (O&M, Supply Chain, TUK) show their three focus areas (title + text) in the same panel, with the same bending divider lines.
  - **Covers:** each video cover is that line's homepage "Bisnis Kami" photo (`public/media/bussines/*.jpg`).
  - **Chip icons:** picked by keyword from each scope name (`iconFor`: house, fuel pump, fiber, bolt, plane, map pin, shield, magnifier, gear, gauge, truck, plant, pipe; a check mark as fallback).
  - **Portfolio:** up to three projects sit in a grid (two → two columns). More than three (O&M has ten) become one horizontal row that bleeds to the page edge, with chevrons beside the count.
  - **Chip layouts:** O&M's eight sentence-like scopes use `chipLayout="pairs"` (two equal columns, four rows). Supply Chain's order puts its two short pipe products side by side in one row.
  - **Line link:** Supply Chain's "Selengkapnya" sits under its lead.
  - **TUK:** the section keeps the shared layout with a primary "Lihat Detail" button under its lead (`cta` prop), linking to its own page. Its lead is a shortened version (`lead` prop, two lines on desktop); the full text stays in the data and on the detail page.
- **TUK detail page (`/business/tuk`, `src/pages/business/tuk.astro`):** everything that used to sit under TUK on /business.
  - **Hero:** the darkened training photo (`/media/header/pgas-solution-tuk.jpg`, 2400px), with a floating section nav (Tentang, Keunggulan, Sertifikasi, Mitra, Registrasi).
  - **Tentang:** the heading on the left (two lines) and one intro sentence on the right (the about paragraph's first sentence). The dated facts in the rest of that paragraph become a three-point timeline: 2016 lisensi LSP ENERGI, 2017 bersama LSP PGN, 2020 Pusat Uji Kompetensi independen. Then the three focus areas as white cards with an icon chip (hover: blue). The old secondary intro (`tuk.heroText`) is no longer shown; it repeated the same point.
  - **Keunggulan:** the heading at the same size as the Tentang heading (`t-lg`); the four reasons as navy → blue cards, like the business portfolio cards.
  - **Sertifikasi:** the title and intro on the left, segmented tabs on the right, one per group with its count (15 / 14; arrow keys move between tabs). The open group's certifications sit below as tiles in the Produk & Jasa chip style (shield-check icon, three columns, hover: blue) and rise in as a wave when a tab opens (`initTabs`).
  - **Mitra:** the homepage client grid (`LogoCarousel`).
  - **Registrasi:** the title and one paragraph (the email address is a mailto link), then a compact download row (file icon, "Registration form · PDF", blue Download button). The contact form sits beside it. The repeated contact paragraph and the separate "PDF" label were removed.
  - **Navigation:** the header's "TUK Training Center" link now points here, and "Bisnis" stays active on this page.
  - **Head:** index badge + tag, the title on the left (`t-lg`, two lines), and the lead on the right.
  - **Feature row:** a blue stats panel on the left and the photo/video on the right, same height. The frame has a notch in the middle of its left edge (top edge below 860px), and a glass "Putar video" pill plays the video in place. The EPC cover is the homepage's EPC card photo (`/media/bussines/epc.jpg`, via the `cover` prop).
  - **Stats panel:** one smooth diagonal gradient (`#5cc0ee` → `#2aa3df` → PGN blue → `#1475a8` → `#0f6290`), mostly light blue and easing into dark blue toward the bottom-right. The three numbers count up in white. The dividers between them are the animated lines (`[data-lines="rows"]`): each starts at the text's left edge and bends into the empty right side, the first up to the top and the next down to the bottom, at different x. So the lines never cross each other or the text, and the lights are staggered so they never run side by side. Without JS the dividers are plain hairlines.
  - **Produk & Jasa (chips):** no photo. A centred head ("Produk & Jasa", "7 lingkup pekerjaan") over a centred block of soft grey chips (max 1080px), each as long as its name with a blue line icon. The display order is set per line with `chipOrder` (EPC: pipeline + SPBG / mechanical + plant / electrical + household + fiber) so the three rows come out near-equal in width; the scopes have no inherent order. They rise in as a wave the first time they come into view. On hover a chip fills PGN blue and lifts while the others dim. Phones: one full-width chip per line.
  - **Portfolio:** one card per project, coloured navy → PGN blue like the history cards. The project description is the card's content (display font); the client sits at the foot above a hairline with a small "Klien" label. (The large distance figure was removed: on its own it didn't explain anything.)
  - **Code:** `initServices` in `src/scripts/app.ts` (grid glow). `initVideos` now marks a `[data-video-host]` as playing.
- **Bisnis, Service Packages:** not a business line but an offer built on them, so it gets its own layout: the homepage "Bisnis Kami" card. Each card has a media box with the package's animated isometric illustration on white, a blue "Paket N" tag, the name and the full text. The section is white like the lines above. Its top gap matches the gap between lines (~148px at 1440), with a similar gap before the footer.
- **GCG & Kepatuhan:**
  - **Hero:** `public/media/hero/gcg.webp` (1774w) + `gcg@2x.webp`, converted from the supplied `gcg.png`; `gcg.jpg` is the share image.
  - **Prinsip-Prinsip GCG:** the headline is the same size as "Tata Kelola Perusahaan" above it (`t-lg`). The five principles are compact cards in shades of navy → PGN blue (like the business portfolio cards), three then two wider ones, one column on phones, in the order Transparansi, Akuntabilitas, Kewajaran, Kemandirian, Pertanggungjawaban (`principleOrder`). Each has a theme icon (eye, checked clipboard, shield, compass, scales), the name, its English term (left out on the English page, where it would repeat the name) and the meaning. On hover the card lifts and its icon turns white.
- **GCG, Dasar Kebijakan:** the head (eyebrow, title, intro) on the left and segmented tabs on the right (Regulasi 5 / Pedoman Internal 7). The open group's documents sit below as two-column tiles in the Produk & Jasa chip style (institution icon for regulations, document icon for internal guidelines), with the internal-guidelines note above its tiles. Uses `initTabs`.
- **GCG, Roadmap:** one year at a time. A rail of year stops spans the full content width (2023 flush right under the chevrons): the chosen year lights up, earlier stops fill in, and the line fills to it. Below it (no divider), that year's number at headline size (`t-lg`) and count, then its initiatives as a plain numbered list with hairlines between rows but none under the last row (two columns for years with more than seven items). Chevrons beside the title step through the years, and 2023 opens on load. Uses `initTabs`, which now also handles `[data-tab-prev]` / `[data-tab-next]`, sets a `--tab-p` progress and marks earlier tabs `is-done`. On phones the rail scrolls sideways.
- **GCG, SMAP band:** the dark Sistem Manajemen Anti Penyuapan section has a white notch in the middle of its top and bottom edges (like the BOD & BOC band) and roomier padding (~158px at 1440). The GCG section above it ends with the usual section gap.
- **GCG, WBS:** after the intro, the content runs as four connected steps on the intro's two columns: 01 what can be reported, 02 where to report, 03 reporter protection, 04 legal basis.
  - **Left column:** the step number and title, sticky while the step is read. One continuous rail links the numbers. The current step's number fills blue and earlier ones get a blue ring (`initWbsSteps`).
  - **Right column:** the step's content: warning-icon tiles, channel rows (icon, label, value, a text action), the blue gradient protection panel, and document tiles.
  - **Below 1000px:** the steps stack with the rail on the left.
- **GCG, SMAP band:** the left head stays sticky through the list (the band uses `overflow: clip`, which, unlike `hidden`, doesn't break sticky).
- **GCG, Shareholder:** a centred eyebrow and statement, over the PGN logo in a single cell of the homepage client grid: crosshairs on the corners, and lines that run out on every side and fade. No added figures.
- **GCG, CSR:** the headline at section size (`t-lg`). The five areas form a bento: three cards, then two wider ones. Each card is light grey with a theme icon (hard hat, leaf, people, heart, medical cross), title and text. On hover it fills with the blue gradient and the text turns white. "CSR Terbaru" is unchanged.
- **GCG, Pakta Komitmen K3PL:** white (no longer the dark band), with the usual ~144px gap before the footer.
- **Relasi Investor hero:** `public/media/hero/investor.webp` (1774w) + `investor@2x.webp`, converted from the supplied `relasi investor.png`; `investor.jpg` is the share image. The Highlights / Annual Report buttons under the hero copy were removed.
- **Relasi Investor, Highlights:** on white, in the homepage client-grid vocabulary. Four cells sit between hairlines (two columns below 1000px), with crosshairs at the crossings and lines running out and fading. Each cell holds "Lebih dari", the figure (count-up), the label, a faint smooth trend line with its year range, and a hidden data table. On hover the cell tints and the figure and trend turn blue.
- **Relasi Investor, Annual Report:** the latest report is featured: cover, eyebrow, title at section size, and the long statement held to four lines with "Baca selengkapnya" (`initReadMore`), plus one download button. Every earlier report (2013–2024) follows right here as a row of covers, each with its year and a PDF link. The row scrolls with chevrons and runs to the page edge. The separate `/investor-relations/annual-report` page was removed; the header's "Annual Report" link now points to `/investor-relations#annual-report`.
- **Shared pieces:** `YearAccordion.astro` holds the year accordion's markup and CSS (Tentang Kami Sejarah). The segmented tabs are global (`.seg-tabs` / `.seg-tab`), used by TUK certification and GCG policy basis.
- **Section heads:** the description under a section headline uses `text-wrap: pretty`, so a paragraph never ends on a lone word.
- **Headline capitals:** headlines and other large headline-type text are title-cased when the page is built (`src/middleware.ts` → `src/i18n/case.ts`): every `h1`–`h3`, plus `p`/`span` text with the type-scale classes (`t-sm`, `t-md`, `t-xl`, `t-card`) or a few named titles (empty-state title, TUK milestones, certification names, GCG accordion titles, the homepage step figures). Every word starts with a capital except, in Indonesian, "di", "ke" and "dan" (client rule), and in English the usual title-case small words (and, or, of, the, to, for, in, …), which also stay lowercase inside Indonesian headlines that carry English names. Acronyms and words with inner capitals stay as written. Descriptions, names of people, addresses, links, article and album titles, city names and footer labels are left as published. Write copy in plain sentence case in the data; the capitals are applied for you.
- **Glass surfaces:** the header pill, its dropdowns, the floating section nav, the mobile menu card, the homepage "Artikel terbaru" card, the video play button and the BOD/BOC badges share one material: `rgba(22, 27, 36, 0.55)` with `blur(20px) saturate(1.6)` and a 1px light edge.
- **Eyebrows:** `.t-eyebrow` is all caps (`text-transform`), so eyebrow copy stays in normal case in the data.
- **Bisnis hero:** the image band uses `public/media/hero/business.webp` (1672w) and `business@2x.webp` (Lanczos 2× + unsharp), converted from the supplied `bussines.png`; `business.jpg` is the share image. The EPC / O&M / SC / TUK buttons under the hero copy were removed (the floating section nav already links to each line).
- **Tentang Kami, Sejarah:** a horizontal year accordion.
  - **Collapsed years:** all 13 years are slim columns showing the year (vertical) and one dot per event.
  - **Opening:** hover (with a short intent delay), click or the arrow keys open a year into a card with its events and the big year (full white, bottom-left, the same for every year). The open card's colour runs from navy (2009) towards PGN blue (2023) via `--yr-mix`.
  - **Lines:** the open card carries three faint rounded lines, each with a glowing light travelling along it (after the footer streaks on terminal-industries.com/about). Each year gets its own layout (L- and Z-shaped lines from different edges, seeded by the year). The lines are drawn at the card's final open size the moment it opens, so they are already showing as it widens, and the lights start mid-run. They are paused off-screen; with reduced motion only the static lines show. Code: `initHistoryLines`.
  - **Autoplay:** it cycles every 5s while in view and pauses under the pointer.
  - **Head:** centred. The description is a shortened version of the original paragraph (`history.summary` in `src/data/about.ts`; the original stays in `history.text`) and is held to two lines.
  - **Below 1366px:** it becomes a vertical tap accordion.
  - **Code:** `initHistory` in `src/scripts/app.ts`.
- **Tentang Kami, BOD & BOC:** one row of portrait cards (commissioners, then directors) beside the intro, following the supplied "Our teams" reference.
  - **Band:** a light grey band (`#f2f3f5`), set off by the usual section gap above and below, with a white rounded notch in the middle of its top and bottom edges (`Notch`).
  - **Cards:** each card is the full photo with a BOC/BOD badge top-left, a blue arrow button top-right, and the role and name over a bottom shade. Badge and role use the body font (Geist). Clicking a card opens the existing profile dialog.
  - **Navigation:** chevrons under the intro step one card at a time (`data-scroller`). The row runs off the right edge; on narrow screens the intro sits above it.
- **Tentang Kami, Penghargaan & Sertifikasi:** the homepage "Klien Kami" grid, reused for the documents.
  - **Grid:** `LogoCarousel` in docs mode gives the same square cells, crosshair corners, grid lines that fade out on every side, blue cursor glow on the borders, and left-to-right wave paging with chevrons and an `NN / NN` counter.
  - **Cells:** each cell holds one document sheet, monochrome until hovered (like the logos). On hover (mouse) it shrinks up and its title fades in at the bottom of the cell on a blue fade, so the text never sits on the document. Clicking opens the lightbox over the current set.
  - **Tabs:** Penghargaan 17 (default) and Sertifikasi 6, beside the head. Switching swaps the row in the same wave. Four documents per page on desktop (two below 1024px). Pages don't wrap, so the last page may have empty cells.
  - **Centring:** each sheet is centred exactly in its cell (absolute + auto margins), whatever its proportions.
  - **Data fix:** one entry in `recognition.json` is labelled `certification-2` (a file name). It is shown as "Penghargaan Program P2 HIV & AIDS di Tempat Kerja", the title printed on the certificate.
  - **Code:** docs mode lives in `LogoCarousel.astro` (`docs` and `initialCat` props) and `initLogoCarousel`. `openLightbox` in `src/scripts/app.ts` opens the lightbox from code.
- **Lightbox (site-wide):**
  - **Fit:** the image always fits the screen at 100%, so there is nothing to scroll.
  - **Zoom:** – / 100% / + buttons zoom from 1× to 4×. The wheel zooms toward the pointer, double-click toggles 2.5×, keys are + / - / 0, drag pans, and touch can pinch. At 100%, a swipe steps to the next image and tapping the empty area closes.
  - **Top bar:** the group name and the document title sit top-left in the body font; count and close sit top-right. The backdrop is a dark navy at 90%.
- **Dialogs and Lenis:** Lenis blocks wheel/touch scrolling while it is stopped, so every `<dialog>` gets `data-lenis-prevent` (`initDialogs`, `initLightbox`). Long board bios now scroll inside their dialog.
- **Header:** floating pill centred 46px from the top, `rgba(0,0,0,.3)` with a 30px backdrop blur, 18px padding, 8px radius. Nav links are 14px; the CTAs are mono buttons.
- **Buttons:** Inter Tight (the headline font) 12px/600, uppercase, wide letter-spacing, 42px high, 8px radius. Variants: primary (PGN blue), secondary (white), soft (5% ink), dark, and a 59px block button used inside cards.
- **Header:** on desktop (≥1281px) the header is a full-width bar at the top of the page. Once the page scrolls past 80px it shrinks to fit its content and pinches a neck on each side of the nav, so the logo and the "Hubungi Kami" button read as separate pieces. The pattern comes from thelaunchcompany.cc. The material is a cool charcoal `rgba(22,27,36,.72)` (taken from xpeng-one.vercel.app) with `blur(30px)`. The motion is in `initHeaderMorph` (`src/scripts/app.ts`); with reduced motion it switches without animating.
- **Type:** headings use Inter Tight 600 (500 for small headings) with 0 letter-spacing, picked to match the heavy, tightly set "pgn" wordmark. Body text is Geist; labels and buttons are Geist Mono. Section heads are centred: a grey eyebrow, a large headline, then muted body copy.
- **Surfaces:** `#f0f0f0` cards with 24px radius and 40px padding; 16–24px media radius; notch tabs (`Notch.astro`) at section edges and cut into images; dotted grid backdrops; a crosshair logo wall.
- **Layout:** 70px side gutter at 1440px; sections are 120px top and 90px bottom; split layouts with a sticky left column; a floating bottom pill for in-page navigation.
- **Colour roles:** reference deep green → PGN deep navy `#032233`; reference lime → PGN blue `#1A90CA`.

## Content migration notes and open items

These items need a decision or an asset from PGN Solution:

1. **Language.** Only the Indonesian (ID) version was migrated. The original site's EN version is not included yet. The header already has an ID / EN switch; EN is shown disabled ("segera hadir") until the English pages exist. To enable it, migrate the English copy from the original `/en/*` pages and set `available: true` for `en` in `locales` (`src/data/site.ts`).
2. **Form backend.** The original forms post to endpoints on the old server, which need CSRF tokens, so they can't be reused. Set `PUBLIC_FORM_ENDPOINT` to enable real submissions. Until then:
   - The contact and TUK forms open an email to `info@pgn-solution.co.id` / `info.tuk@pgn-solution.co.id`.
   - The career form does the same, and the visitor has to attach their CV to the email by hand.
3. **Logo.** The only logo available on the site is a 166×33 px PNG. A vector (SVG) logo is needed for sharp rendering on high-density screens.
4. **Board portraits.** The originals are 102×138 px. The BOD & BOC section now shows them as large portrait cards (about 360px wide), so they look soft. Replace the files in `public/media/board/` (same names, same 102:138 ratio, at least 720×975 px) with higher-resolution photos.
5. **Files still hosted on the old server.** Annual report PDFs, partnership and TUK documents, and the four business videos (18–477 MB each) are linked from `https://www.pgn-solution.co.id/template/...`. Move them to permanent hosting before the old server is retired. The videos also need web-optimised encodes.
6. **Missing on the original server.** Three press-release images return 404 at the source; those articles show a neutral placeholder. The gallery albums "Pipa Minyak Blok Rokan" and "Pipa Gas Senipah-Balikpapan" have no photos at the source, so the Galeri tab leaves them out.
7. **No vacancies or announcements.** The original site lists no open jobs and no partnership announcements. Both pages show an empty state and pick up data automatically once entries are added.
8. **Article URL redirects.** Old article URLs (`/id/news/<title with spaces>`, `/id/press-release/...`) are not redirected one by one. Add host-level redirects if search traffic to old article URLs matters.
9. **Conflicting phone numbers.** The original contact page lists `+6221 6385 4572 / 4506` for headquarters, while the original footer lists `p. +6221 6386 7037 / f. +6221 6385 4506`. Both are kept where they originally appeared. Please confirm which is current.
10. **Imagery reuse.** All imagery is original. Some photos are reused in new contexts:
    - Gallery project photos illustrate the business chapters.
    - The Partnership, Articles, Careers and Contact heroes are new supplied images (`/media/hero/*`); the original Partnership page had no header image.
11. **Copy fidelity.** Text is kept verbatim, including original spellings such as "Commisioner", "subsdisiary" and "Akuntablitas". Two presentational changes were made:
    - A few all-caps sub-headings on the GCG page are shown in title case.
    - The O&M "Integrity dan Engineering" items are separated with `·` instead of tabs and dashes.
    A few short UI strings are new rather than migrated: empty states, form hints and status messages, the steps on the application page, and the annual-report count line.
12. **Homepage hero image.** The hero is a static photo with no overlay, `public/media/hero/home.webp` (1510w, downscaled) + `home@2x.webp` (the native 3020w), converted from the supplied `image 12.png` (offshore platform); `home.jpg` is the share image. It replaced the YouTube background video. `initYouTubeBg` in `src/scripts/app.ts` is still there and runs only if an element with `data-yt-bg` exists, so the video can be brought back by adding that element.
13. **Investor charts.** These use the exact data series from the original page's Chart.js config. Some series stop before 2025, exactly as they did on the original.
