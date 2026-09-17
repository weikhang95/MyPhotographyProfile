# Design Research — Redesign Input

**Date:** 2026-09-16 (overnight research run)
**Purpose:** input for the **redesign planning session**. Nothing here is decided. Decisions live in [`growth-plan.md`](./growth-plan.md).
**Method:** 6 research agents; the lead reviewed and summarised their findings. Full reports are in [`docs/design-research/`](./design-research/). Each report marks claims as verified (fetched page, CSS, image or docs) or inferred.
**Caveat:** web fetching returns text/HTML, not screenshots, so visual details (spacing, type feel) are often inferred. Open the reference sites in a browser before copying a visual detail.

| # | Report | Lines |
|---|---|---|
| 01 | [Photo portfolios](./design-research/01-photo-portfolios.md): 14 sites incl. samalive.co, Squarespace Five/Hester, Alec Soth, Nadav Kander, Rinko Kawauchi, Magnum, Kinfolk | ~340 |
| 02 | [Editorial tech blogs](./design-research/02-tech-blogs.md): 17 sites incl. Simon Willison, Anthropic Engineering, Lil'Log, Julia Evans, Maggie Appleton, Josh Comeau, Gwern | ~640 |
| 03 | [Diagram style kit](./design-research/03-diagram-style.md): Anthropic/Vercel/Cloudflare/Alammar figures → "Darkroom Diagrams" v0.1 spec + tooling | ~480 |
| 04 | [Bilingual typography](./design-research/04-bilingual-typography.md): EN/简体中文 fonts, CJK rules, switcher, tokens | ~275 |
| 05 | [Current UI audit](./design-research/05-current-ui-audit.md): repo audit with file:line references, blockers, Material removal, redesign order | ~420 |
| 06 | [Playful zone](./design-research/06-playful-3d-pixel.md): three.js / pixel / game-like / anime-inspired, phased plan | ~215 |
| 07 | [**Visual review**](./design-research/07-visual-review.md): screenshots of the current site (post Angular 22 / i18n / blog commits) vs samalive, Anthropic, Simon, Soth, Kander, sspai; gap analysis, bugs, 3 direction options | ~190 |

---

## 🆕 2026-09-17 visual review: headline

The site currently has **two competing visual voices**: a calm editorial shell and **cyber-terminal / HUD** blog figures and eyebrows (`SCHEMATIC // …`, `STATUS: …`, dot grids). Rendered references (Anthropic, samalive) win by *leaving things out*. Recommended direction: **A "Darkroom Editorial"**, with the terminal energy kept for the playful zone. Also found:
- mobile double-nav bug (Material CSS beats Tailwind `hidden`);
- all Jest suites broken since Angular 22;
- clipped diagram labels.

See [07](./design-research/07-visual-review.md).

## ⚠️ Found during research — needs owner attention

1. **Employer named on the live About page:** `src/app/about/about.component.html:27`. This conflicts with decision Q24. It's a one-line hotfix; not changed overnight because it edits live content.
2. **`.impeccable.md` holds the retired direction** (blue→purple gradient, neutral-50…950). The new warm-neutral brief is in `PRODUCT.md` (titled "# .impeccable.md") and `AGENTS.md`. PRDs 00–06 cite `.impeccable.md` as the source of truth, so agents following them get the old brief. Fix before any redesign work.
3. **Stale facts in docs:**
   - `PRODUCT.md:75` says NgModule (the app is standalone).
   - PRD 1 cites `tailwind.config.js`.
   - PRD 2 cites `app.module.ts`.
   - PRD 5 says Karma (the repo uses Jest).
4. **Tokens don't show on the site:** `app.component.html:1` sets `bg-white dark:bg-neutral-900 text-black` over the warm tokens on every page. Swapping these to token classes is a quick win that makes the new palette visible everywhere.
5. **Accent contrast fails:** clay `#B08968` on cream `#FBF9F4` = **3.01:1** (lead re-computed), which fails WCAG AA for text and links. Proposed `accent-ink` `#7A5A3F` = 5.94:1. Dark-mode tokens pass: `#8A857B` on `#121110` = 5.14:1. Report 03 wrongly flags dark muted; a correction note has been added there.
6. **Growth plan in the public repo** named internal work wikis. Replaced with a generic description in this commit. The **earlier commit history still contains the name**; rewriting history is the owner's call.

---

## 1. Current state (from audit 05)

- **Raw colours:** 84 raw colour utility classes (topbar 42, app shell 20, about 12), 3 arbitrary hex classes, 1 gradient (`app.component.html:13`), 11 inline SVGs, 6 hex values in SCSS. Only Contact and Admin use tokens.
- **Angular Material can be removed entirely:**
  - It's used only for `<mat-toolbar>`, the `mat-typography` class, and two themes.
  - Material accounts for about 157 of 216 kB of built CSS, and the live HTML inlines about 116 kB of `--mat-*` variables.
  - `@angular/animations` exists only for the mobile menu slide and costs a 64 kB chunk.
  - Remove both **before** prerendering, so that CSS isn't copied into every page in both languages.
- **Build baseline:** initial 562 kB raw / 120 kB transferred; portfolio chunk 145 kB (mostly Fancybox).
- **Blockers for SSG + i18n:**
  - `@angular/ssr` and `@angular/localize` aren't installed, and routes are inline in `main.ts`.
  - No inline theme script, so dark-mode users see a light flash; the gallery is `opacity:0` until JS runs.
  - The `**` route redirects to home, so there's no real 404, and `href="/"` in the topbar drops the locale prefix.
  - 0 i18n markers, about 60 public strings.
  - Cloudinary URL code is duplicated (`portfolio.component.ts`, `about.component.ts`), and the passthrough loader gives no responsive `srcset`.
  - Live `/robots.txt` returns the SPA HTML, and workers.dev sends no `noindex`.
  - The Worker only branches on `/api/`, so new routing is needed for the locale redirect, 301s and `/img/*`.
- **Good news:**
  - All `window`/`document`/`localStorage` uses are already guarded.
  - Fancybox imports cleanly in Node.
  - The admin guard calls the API, so admin routes must simply be excluded from prerendering.
- **Accessibility:**
  - Blue focus rings and `focus:outline-none` override the global focus style.
  - There's a nested nav landmark in the topbar.
  - Alt text has a typo ("Coffe milk").

## 2. Photography side (report 01)

**Patterns seen across strong photographer sites:**
- **Series** are how work is organised (not genre categories), with a separate curated overview.
- Navigation is short.
- Series labels read "Title · Year · N photos".
- Captions follow **Subject, Place, Country, Year**.
- Colours are neutral with one tiny accent; the clay accent fits.
- **Alt text is missing almost everywhere.** samalive.co has 197 images with empty alt. That's an easy SEO/a11y win for this site.

**About the owner's references:**
- samalive.co runs on the same Squarespace template as Levon Biss: justified rows, 5px gutter, 500px row height, no captions, one URL per photo in the lightbox.
- The Squarespace **Hester** and **Five** demos now show a pickle shop and a holiday rental. What's worth keeping is their *structure*:
  - **Hester:** centred logo, 60px gutters, calm section rhythm.
  - **Five:** title/description banner, dark lightbox.

**Proposed homepage:**
1. Header: name · `Photos · Writing · About · Contact` · `EN / 中文`.
2. Intro strip: 1–2 first-person sentences (Alec Soth style), max ~60ch.
3. Curated **justified-row grid** (no cropping; ~320–420px row height on desktop, single column on mobile, 8–16px gutter).
4. Series cards: title, one-line description, "N photos · Year".
5. Latest writing strip: 2–3 items.
6. Quiet footer.

**Proposed series page:**
1. Kicker (`Travel · Croatia`).
2. H1 title.
3. Meta line (`Oct 2025 · 18 photographs`).
4. One-sentence description.
5. **80–200 words of intro text**, the main SEO content, written separately in EN and 中文.
6. Single-column image sequence with `<figure>`/`<figcaption>`; portrait pairs can sit side by side as diptychs.
7. Gallery/Index toggle.
8. Previous / all / next series links.
9. JSON-LD, hreflang, readable slugs.

**Lightbox:**
- Always-dark warm overlay, even in light mode.
- Caption `Title · Place, Year` and a `3 / 14` counter.
- Keyboard, swipe, and a focus trap that returns focus on close.
- A URL for every photo; 150–200ms fade only.

**Avoid:** square crops, masonry (loses sequence), zoom/slide animations, long nav.

## 3. Writing side (report 02)

**Index (`/writing`):**
- One calm text list **grouped by year**, with tabs `All · Posts · Notes · TIL`, each tab a real URL.
- Posts show a dek + reading time, notes their first words, TILs only the title.
- No thumbnails, so photography stays the image-led half of the site.
- Posts that exist in one language only are labelled ("EN only").
- A topic view, plus Atom feeds per type and per language.

**Long-post anatomy (ordered):**
1. Series eyebrow.
2. Title.
3. Dek.
4. Monospace meta line (published · updated · read time · language link).
5. **TL;DR box** (3–5 bullets that answer the question).
6. Collapsible TOC (over ~1,500 words).
7. Intro (why this post exists).
8. **"What is X?"** H2 with a one-sentence bold definition.
9. **Overview diagram.**
10. Body sections using the template *What · When (and when not) · How · Example*, with numbered figures and full-sentence captions, code blocks, rare callouts (Note / Watch out), optional sidenotes.
11. "Which should I use?" summary.
12. Appendices.
13. References.
14. "Cite this" block.
15. Acknowledgements.
16. Tags + series nav.
17. Previous / next.
18. Related posts + subscribe.

**Note:** title written as a claim · date · optional quoted source + link · 1–6 paragraphs · tags · "Expanded into → post" backlink.

**TIL:** `/til` filtered view of notes tagged `til`, topic counts, full bodies inline on topic pages, own feed.

**Tag pages:** open with a 1–2 sentence definition, so each doubles as a glossary entry (good for AEO); keep 10–15 curated tags.

**Series pages:** status ("3 of 5 published") and a numbered list of parts.

**`/now` page:**
- "Updated YYYY-MM-DD · from Penang, where …"
- Sections: Building / Shooting (with one photo) / Writing / Learning / Reading / Not doing.
- Collapsed log of past updates; link to nownownow.com.

**AEO, ranked by value:**
1. TL;DR first.
2. Question-form H2s.
3. One-sentence definition after each heading.
4. The same section template across posts.
5. Visible dates plus JSON-LD dates.
6. Author entity (Person schema).
7. Tag glossary pages.
8. Figure text alternatives.
9. Stable slugs + hreflang.
10. Prerendered HTML, `llms.txt`, `.md` twins.
11. Full-content feeds.
12. References.

## 4. Diagram style kit (report 03)

**What makes diagrams feel premium** (checked on real Anthropic, Vercel and Cloudflare figures):
- one visual system per post;
- neutral structure with **one highlight colour meaning "look here"**;
- thin 1–1.5px strokes with open chevron arrowheads;
- lots of empty space, **≤ 7 nodes per figure**;
- orthogonal routing with rounded elbows;
- captions that state the takeaway;
- separate light/dark and mobile versions (Vercel does this).

None of the Anthropic figures has alt text, so this site can do better.

**Proposed "Darkroom Diagrams" v0.1:**
- **Canvas:** 8px grid, 720px canvas, 32px padding.
- **Strokes and corners:** 1px nodes / 1.25px connectors / 1.75px highlighted path; radii 6 (node) / 12 (group) / pill (endpoints).
- **Shape = kind of thing:**
  - human: pill;
  - agent: box with a small "agent" label above the name;
  - **model/LLM: double inset border (signature shape, optional aperture glyph)**;
  - tool: monospace `name()`;
  - data store: cylinder or stacked sheets;
  - context: token-cell strip;
  - group: dashed boundary.
- **Colour = attention:** clay accent once per figure, never used to mean a type.
- **Line meaning:** solid = sync call; dashed = async; dot at source = data flow; dotted = conditional; arc = loop.
- **Step numbers** drawn as circle shapes (not ①②), matching an ordered list in the text.
- **CJK labels:** system CJK stack, +1px size, line-height 1.5, no uppercase, no italics, full-width punctuation.
- **Captions:** `Figure N` / `图 N` + takeaway sentence; no title inside the SVG; `role="img"` + `<title>`/`<desc>`; optional "Text version" `<details>`.
- **Width tiers:** body / wide / full. Flagship figures get a portrait variant for narrow screens; notes may scroll sideways.
- **Pipeline:**
  - Figma layers named after CSS classes, EN/ZH string variables, export with text kept as text.
  - Build step: SVGO → swap fixed hex for CSS variables → **fail the build on any colour outside the palette** → inject title/desc → `<app-diagram>` component.
  - Excalidraw: fixed palette, never its dark export (it turns clay into blue-teal), commit the source file.

## 5. Bilingual typography (report 04)

- **Chinese font:** Signika first, then **system CJK fonts** (PingFang SC → Hiragino Sans GB → Microsoft YaHei → Noto Sans CJK SC). **No Chinese web font:** Noto Sans SC is 2.41 MB per weight across 101 slices (measured). sspai, Matters and Apple China all do this.
- **zh body text:** 17px, line-height 1.8, measure ~36em (34–38 characters), letter-spacing 0. Headings one step smaller than EN, weight 600. **No italics:** `em:lang(zh){font-style:normal}`, plus weight or `text-emphasis` dots.
- **Punctuation gotcha:** with Signika first, “ ” — … inside Chinese text render in Signika's narrow shapes. Fix with a `local()` + `unicode-range` "CJK Punct" `@font-face` placed before Signika in the zh stack (test on real devices).
- **CSS support in 2026:**
  - `text-autospace: normal` is Baseline (Chrome 140 / Safari 18.4 / Firefox 145);
  - `text-spacing-trim` is Chrome-only;
  - `hanging-punctuation` is Safari-only.
- **Language switcher:** text link labelled in the target language ("中文" / "EN"), top-right, same path. hreflang `en` / `zh-Hans` / `x-default`, in both directions.
- **Conflict with decision Q17:** Google advises against auto-redirecting by `Accept-Language`. Our plan redirects only the bare `/` (cookie first, then `Accept-Language`) with `x-default`. That's a common pattern, but report 04 suggests considering a static EN `/` with the switcher. **Re-confirm in the planning session.**
- **Clean-up:** `.font-signika` helper classes hard-code Signika. Switch them to `var(--font-display)` so zh pages get the punctuation fix.

## 6. Playful zone (report 06)

**References:**
- **3D:** Bruno Simon folio-2025 (three.js WebGPU + Rapier), Messenger by abeto (cel-shaded, calm), Jordan Breton (floating island, real HTML content alongside).
- **Calm site plus optional play:** Robby Leonardi (game on a separate path), Rauno /craft, Ciechanowski and Maxime Heckel (interactive figures inside essays).

**Integration patterns, ranked:**
1. Small touches + a **real 404 page with a mini-game**.
2. Easter egg (Konami code / clicking the signature) **plus** a visible footer "Lab" link.
3. **Interactive AI-concept figures in posts** ("the agent loop is a game loop"). Best fit for SEO and the AI-builder identity.
4. Lazy `/play` **2D pixel George Town** (clock tower = About, shophouse = Photos, kopitiam = Blog, jetty = Contact).
5. 3D photo gallery: last, because 3D perspective and lighting make photos look worse.

**Bundle sizes** (measured, gzipped): three.js ~134–191 kB · OGL 14 kB · KAPLAY 69 kB · Pixi 8 ~167 kB · Phaser 4 369 kB.
- **Recommendation:** KAPLAY + Tiled maps for `/play` v1; three.js with `RenderPixelatedPass` or cel shading only for a later 3D version.
- **Keeping it off main pages:** route `loadComponent` + dynamic `import()` inside `afterNextRender`, `@defer` for figures. Prerendering only outputs the placeholder, so real text must sit outside `@defer`.

**Accessibility and fallback:** reduced motion or no WebGL → static pixel map with normal links; "Fast travel" HTML menu; dialogue in an `aria-live` region; tap-to-move on touch.

**Licences:**

| Source | Licence | Notes |
|---|---|---|
| Kenney | CC0 | Don't use its logo |
| KayKit | CC0 | |
| Quaternius | CC0 per its itch.io pages | Licence file itself not opened |
| LPC | CC-BY-SA / GPL | Attribution required |
| Mixamo | Royalty-free | Raw files can't be redistributed |
| itch.io | Varies | Filter by `/assets-cc0/`, not the `cc0` tag |

Pixel fonts with CJK glyphs (Fusion Pixel / Ark Pixel): licences not yet checked. **Take the style from anime and MMORPGs, never their characters or assets.**

**Phases:**
- **0.** Palette + chibi self-avatar.
- **1.** 404 mini-game (≤ 15 kB).
- **2.** Easter egg → `/lab`.
- **3.** Agent-loop blog figure.
- **4.** `/play` v1 2D George Town (≤ 250 kB initial).
- **5.** Achievements + async "ghost" visitors in D1.
- **6.** 3D pixel-shaded Penang.

**Check before each phase ships:** Lighthouse scores on main pages unchanged.

---

## 7. Proposed redesign sequence (merges audit 05 with build order B)

Effort: S under half a session · M about 1 session · L 2+ sessions.

| # | Work | Effort |
|---|---|---|
| 0a | **Doc repair:** make `.impeccable.md` the new brief (merge in `PRODUCT.md`), fix stale NgModule/Karma/`tailwind.config.js`/`app.module.ts` references | S |
| 0b | **Remove Angular Material + animations**; switch the shell to token colours; delete `vercel.json` (owner confirm) | S |
| 0c | **Complete the tokens:** `accent-ink`, `danger`, `scrim`; 6-step type scale; motion durations; `:lang(zh)` font stack + CJK punctuation face; replace `.font-*` helpers | S–M |
| 0d | **SSG + i18n scaffold** + Worker routing (locale redirect, 301s, `noindex`, `robots.txt`, 404) + inline theme script + CI | L |
| 1 | `IconComponent` (Phosphor) → Topbar (switcher, single header > nav) → Footer (GitHub, no gradient) | S + M + S |
| 2 | Writing surfaces: index/tabs, post, note, TIL, tags, series, not-translated fallback, SEO/AEO layer | L |
| 3 | Photo manifest + R2 loader + lightbox adapter → home (intro strip + justified grid) → series pages | M + M |
| 4 | About (no employer) · `/now` · Contact (enquiry type, `danger` token) · Admin touch-up | S–M each |
| 5 | A11y/Lighthouse pass, both locales × both themes | M |
| ∥ | Diagram style kit v0.1 (Figma library + build step) | M |
| Later | Playful zone phases 0–2 can start after 0d (404 page is needed anyway) | — |

**Quick wins available any time:** remove the employer name; switch shell colours to tokens.

---

## 8. Planning session agenda (decisions for the owner)

Grouped and trimmed from the ~50 open questions across the reports. Each report has its own full list.

**A. Brand and type**
1. Keep Signika for long English reading, or add a text serif (Newsreader / Source Serif 4 / Literata)?
2. Which typeface for diagram labels: Signika, or a neutral grotesk (Inter / IBM Plex Sans)?
3. Approve the accent contrast fix (`accent-ink` `#7A5A3F` for text and links)?
4. Chinese quotes: curly “ ” (needs the punctuation fix) or 「」?
5. Spaces between Chinese and English: typed (portable to feeds and search snippets; recommended) or CSS `text-autospace` only?
6. Does reachability from mainland China matter? If yes, self-host fonts instead of Google Fonts.

**B. Photos**
7. Grid captions on hover/focus, or only in the lightbox? Title for every photo, or just place + year?
8. Name series by place ("Venice 2025") or by theme ("Low tide")?
9. Series page: single-column essay with Index toggle (recommended) or grid + lightbox?
10. Lightbox always dark (recommended) or follow the theme?
11. Homepage grid: fixed 18–24 hand-picked photos, or latest N?
12. Show camera/EXIF details: shown, hidden, or behind an info toggle?
13. Which parts of Five and Hester do you actually like?

**C. Writing**
14. URL scheme: `/writing/…` for everything, or `/posts` `/notes` `/til`? Flat or dated slugs?
15. Does `/writing` open on All or on Posts?
16. Sidenotes on desktop, or footnotes only?
17. Status/confidence labels on posts (Gwern style)?
18. Photos inside blog posts (section breaks or hero images), or no images besides diagrams?
19. Chinese terms: keep Agent / token / RAG in English, or translate (智能体 / 词元 / 检索增强生成)? This feeds the glossary.
20. Untranslated posts in `/zh/` listings: show with an "English only" label (recommended) or hide?

**D. i18n / routing**
21. `/`: redirect by cookie/Accept-Language (current Q17 decision) or a static EN page with the switcher? (Google guidance)
22. Switcher label: show only the other language, or the `中文 / EN` pair?

**E. Diagrams**
23. Portrait mobile variants for every flagship figure (2 languages × 2 layouts = 4 exports)?
24. Static SVG only in v1, or step-through figures for flagship posts?
25. Keep diagram source files (`.fig` export, `.excalidraw`) in the repo?

**F. Playful zone**
26. Name it Play / Lab / World / 游乐场? Link it in the nav or only the footer?
27. 2D first (recommended) or straight to 3D? Which feeling: cozy, nostalgic 2D MMORPG (Ragnarok/MapleStory), or cinematic cel-shaded?
28. Draw the avatar and pixel art yourself, or start with CC0 assets?
29. Social features (ghost visitors, guestbook): yes or no?

**G. Housekeeping**
30. Hotfix the employer name now?
31. Delete `vercel.json` (Cloudflare confirmed)?
32. Rewrite git history to remove the internal wiki name from the earlier growth-plan commit, or leave it?
