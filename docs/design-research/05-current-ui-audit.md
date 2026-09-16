# 05 — Current UI Audit (pre-redesign)

Audited 2026-09-16 at commit `b8d14d0` (working tree has uncommitted `docs/growth-plan.md` and an untracked `src/assets/Photos/Avatar.jpg`). Read-only: nothing in the repo was changed. The production build was written to the scratchpad (`--output-path`), not to `dist/`.

Paths below are relative to the repo root: `/Users/weikhang95/Documents/Angular/MyPhotographyProfile`.

---

## 0. Two problems in the docs to fix first

1. **`.impeccable.md` holds the *old* design direction.** `.impeccable.md` has only 23 lines and still says "Blue-to-purple gradient accent for brand identity" (`.impeccable.md:13`) and "Stick to the neutral palette (neutral-50 through neutral-950)" (`.impeccable.md:21`). The *new* direction (warm neutrals, clay accent, Phosphor icons, retire the gradient) is in `PRODUCT.md`, which is titled `# .impeccable.md` (`PRODUCT.md:1`), and is mirrored in `AGENTS.md`. PRDs 00–06 all name `.impeccable.md` as the source of truth, so any agent that follows those links gets the retired direction. This audit measures against `PRODUCT.md` / `AGENTS.md`.
2. **Stale facts in the docs:**
   - `PRODUCT.md:75` says "Keep current `NgModule` architecture". The app is fully standalone (`src/main.ts:19`).
   - PRD 1 still points at `tailwind.config.js` (`docs/prd/01-design-foundations.md:35`).
   - PRD 2 still points at `app.module.ts` (`docs/prd/02-shared-components.md:42`).
   - PRD 5 names Karma + Jasmine as the test runner (`docs/prd/05-ai-blog-feature.md:81`). The repo uses Jest (`package.json` `test`).
   - The growth plan links to `docs/design-research.md`, which does not exist.

---

## 1. Inventory

Key for the "Raw colours" column: the number of raw Tailwind colour classes found by grep (§2a), then the token-class count (`bg-/text-/border-/decoration-/divide-` + `surface|surface-raised|ink|ink-muted|accent|border`).

| Component | Files | What it renders | Styling approach | Material / icons | Gap vs design principles (PRODUCT.md / AGENTS.md) |
|---|---|---|---|---|---|
| **index.html** | `src/index.html` | Shell `<html lang="en">`, one global title and description, favicon as an inline SVG data-URI, preconnects to Cloudinary and Google Fonts, Signika 300..700 + Nothing You Could Do | `body class="mat-typography bg-surface text-ink min-h-screen"` (`:17`) | `mat-typography` class; 1 inline SVG (favicon `:11`) | No inline theme script, so dark-mode users see a light flash (worse once prerendered). No canonical, OG, hreflang or JSON-LD. Loads Signika weight 300, but the principles use 400–700. `lang` is hard-coded. |
| **AppComponent (shell + footer)** | `src/app/app.component.{ts,html,scss}` | Wrapper div → container → `<app-topbar>`, `<main>`, `<footer>` with a gradient wordmark, "Penang, Malaysia / Available upon request", 4 social SVG links, © year | Raw Tailwind: **20 raw colour classes, 0 token classes**. `.scss` is empty. | 0 mat-icon; **4 inline SVGs** (`:23,30,37,44`); arbitrary brand hex classes `hover:text-[#1877F2]` / `[#E4405F]` / `[#0A66C2]` (`:20,27,41`) | **The wrapper `bg-white dark:bg-neutral-900 text-black dark:text-white` (`:1`) paints over the body's warm tokens, so the token palette never shows on any page.** It uses pure black ink. Blue→purple gradient wordmark (`:13`). `transition-all` + `hover:-translate-y-0.5` on socials (`:20–41`). "Available upon request" conflicts with Q22 (no availability line). No GitHub link (Q22). No Blog / Now links. |
| **TopbarComponent** | `src/app/topbar/topbar.component.{ts,html,scss}` | Mobile bar (hamburger, wordmark, theme toggle) plus a mobile menu overlay; desktop `mat-toolbar` with wordmark, nav (PORTFOLIO / ABOUT ME / CONTACT) and theme toggle | Raw Tailwind: **42 raw colour classes, 0 token classes** (the worst file). Uses `!bg-white dark:!bg-neutral-900 !py-4` `!important` overrides on `mat-toolbar` (`:51`). `@angular/animations` `slideMenu` trigger (`.ts:19–29`). | `MatToolbarModule` (used once, `:51`); `MatIconModule` imported (`.ts:3,13`) with **0 `<mat-icon>` uses**; **6 inline SVGs** (hamburger, close, sun ×2, moon ×2: `:10,15,27,32,63,68`) | Blue accent everywhere: 9× `text-blue-500/400` for active/hover links, 9× `ring-blue-500` focus rings. `focus:outline-none` on buttons (`:8,25,61`) replaces the token focus ring with blue. Markup is duplicated for mobile and desktop (links ×2, toggle ×2). Wordmark uses `href="/"` (`:20,52`), which forces a full reload and will escape the `/en/` / `/zh/` locale prefix. Mobile menu has no Escape, outside-click or route-change close (the link click handler covers only one case). No language switcher, BLOG or NOW. |
| **PortfolioComponent** | `src/app/portfolio/portfolio.component.{ts,html,scss}` | `<h1>PORTFOLIO</h1>`, a CSS `columns-1/2/3` masonry of 12 Cloudinary images, each wrapped in `<a data-fancybox="gallery">`, with a scroll-reveal IntersectionObserver | 4 raw colour classes (`text-neutral-700 dark:text-neutral-300` `:4`; `bg-black/0 group-hover:bg-black/20` `:19`), 0 token classes. SCSS reveal animation (`.scss:1–19`). | No Material. Fancybox 5 (`.ts:2,46`). `NgOptimizedImage` with a passthrough loader. | Decorative chrome: `rounded-lg shadow-md hover:shadow-xl` (`:9`), `group-hover:scale-[1.03]` zoom (`:18`), dark hover overlay (`:19`). Opacity-0 reveal (`.scss:2`) hides content until JS runs (against "don't block content behind animations"). No captions, intro strip (Q2), series or metadata. Images are shrunk to 960/450 px wide (`.ts:16,22`). Fancybox is bound in `ngOnInit` (`.ts:46`) and never unbound in `ngOnDestroy` (`.ts:89`). `track image` uses object identity (`:7`). No `PortfolioImageService` or `LightboxAdapter` yet. |
| **AboutComponent** | `src/app/about/about.component.{ts,html,scss}` | `<h1>ABOUT ME</h1>`, a rotated polaroid-style portrait with a script "me", "Hello there, I'm Wei Khang 👋" with a waving animation, 3 bio paragraphs | Raw Tailwind: 12 raw colour classes, 0 token classes. Infinite `wave` keyframes (`.scss:1–17`). | No Material; 0 icons | Tilted card `-rotate-3 sm:-rotate-6 hover:rotate-0 shadow-lg` (`:6`) plus an infinitely looping emoji (`.scss:4`) go against "restraint over ornament". **Names the employer, the employer by name (`:27`), which violates Q24.** No `/now`, GitHub, timeline or JSON-LD. Script font is used for "me" (`:14`), which PRD 4 allows as the single signature moment. |
| **ContactComponent** | `src/app/contact/contact.component.{ts,html,scss}` | h1, intro, reactive form (name, email, subject, message, honeypot) → `POST /api/enquiries`, inline 422 errors, sending/sent/error states | **Mostly tokenised:** 9 token classes, 2 raw colours (`text-red-700 dark:text-red-400` `:80`). SCSS uses `rgb(var(--token))` plus hex error colours `#b91c1c` / `#f87171` (`.scss:2–3`). | No Material; 0 icons | Closest to the target. No error/danger token. `.field:focus { outline: none }` (`.scss:16–19`) leaves only a 1px border colour change as the focus indicator. No enquiry-type field (Q22). No mailto alternative or socials (PRD 4). The h1 is still all-caps "CONTACT". |
| **AdminLoginComponent** | `src/app/admin/login/admin-login.component.{ts,html}` | h1 ADMIN, password field, submit button | 7 token classes, 2 raw colours (`text-red-700 dark:text-red-400` `:16`) | none | `focus:outline-none focus:border-accent` (`:12`) removes the focus ring. English-only admin is acceptable (Q6). |
| **AdminEnquiriesComponent** | `src/app/admin/enquiries/admin-enquiries.component.{ts,html,scss}` | Status tabs with counts, expandable enquiry list, reply/unread/archive/delete actions, pagination | 18 token classes, 2 raw colours (`:27`). SCSS `.action` uses tokens plus hex danger colours `#b91c1c` / `#f87171` (`.scss:23–34`). | none | Uses `role="tab"` without `tabpanel` or arrow-key handling (`:12`). `aria-label` on a bare `<span>` unread dot (`:48`) is ignored by assistive tech. Uses native `confirm()` (`.ts:105`). Needs an enquiry-type filter (Q22). |
| **ThemeService** | `src/app/theme.service.ts` | Toggles `.dark` on `<html>`; stores `user-theme` in localStorage; follows system preference changes | n/a | n/a | Guarded with `typeof window/document/localStorage` (`:10–13`), so it is prerender-safe, but it only runs once Topbar injects it (after bootstrap), so there is a flash of the wrong theme. `BehaviorSubject(false)` (`:9`) means prerendered HTML always shows the moon icon. Should become a signal plus an inline `<head>` script. |
| **image-loader** | `src/app/image-loader.ts` | `IMAGE_LOADER` that returns `config.src` unchanged | n/a | n/a | Because the loader ignores `width`, `NgOptimizedImage` produces no responsive `srcset`. This is the seam for the R2 `/img/<key>-<w>.avif` loader (Q16). |
| **styles.scss** | `src/styles.scss` | Tailwind 4 import, `.dark` custom variant, RGB-triplet tokens (`:13–34`), `@theme inline` (`:36–61`), global `:focus-visible` (`:64–67`), **full Material M3 theme** (`:69–89`), legacy `.font-signika` / `.font-nothingyoucoulddo` classes (`:94–104`), body transition (`:112`), reduced-motion backstop (`:127–136`) | Tokens exist but are consumed only by Contact and Admin | `@use '@angular/material'` + `material-experimental` (`:1–2`, `matx` unused); `mat.all-component-themes` (`:88`) | Typography has no modular type scale (only `--text-2xs`) and no spacing or motion-duration tokens (`--ease-editorial` only). There are 19 uses of the duplicate `font-signika` / `font-nothingyoucoulddo` classes in templates instead of `font-display` / `font-script`. No danger, success or scrim token. The `$dark-theme` Material theme is defined but never applied (`:77–85`). |

**Also:**
- `angular.json:37` loads `@angular/material/prebuilt-themes/indigo-pink.css` **as well as** the SCSS Material theme.
- `vercel.json` is still present.
- No `robots.txt` or `sitemap.xml` exists. On the live site `/robots.txt` returns **200 with `text/html`** (the SPA fallback serves `index.html`).
- There is no `X-Robots-Tag: noindex` header on workers.dev (checked with `curl -sI`).

---

## 2. Counts, with the exact commands

All commands were run from the repo root with **bash** (zsh expands `--include=*.html` as a glob, so quote the patterns). Spec files are excluded.

### 2a. Raw colour utility classes: **84 total**

```bash
RAW='(bg|text|border|ring|from|to|via|divide)-(neutral|gray|slate|zinc|stone|blue|purple|red|green|black|white)(-[0-9]{2,3})?(/[0-9]+)?\b'
grep -rhoE "$RAW" src --include='*.html' --include='*.ts' --exclude='*.spec.ts' | wc -l          # 84
for f in $(grep -rlE "$RAW" src --include='*.html' --include='*.ts' --exclude='*.spec.ts'); do echo "$f $(grep -oE "$RAW" $f | wc -l)"; done
grep -rhoE "$RAW" src --include='*.html' --include='*.ts' --exclude='*.spec.ts' | sort | uniq -c | sort -rn
```

| File | Raw colour classes |
|---|---|
| `src/app/topbar/topbar.component.html` | 42 |
| `src/app/app.component.html` | 20 |
| `src/app/about/about.component.html` | 12 |
| `src/app/portfolio/portfolio.component.html` | 4 |
| `src/app/contact/contact.component.html` | 2 |
| `src/app/admin/login/admin-login.component.html` | 2 |
| `src/app/admin/enquiries/admin-enquiries.component.html` | 2 |

Most frequent classes:

| Class | Count |
|---|---|
| `text-blue-500` | 9 |
| `ring-blue-500` | 9 |
| `text-white` | 6 |
| `text-blue-400` | 6 |
| `border-neutral-800` | 6 |
| `text-neutral-700` | 5 |
| `text-neutral-300` | 5 |
| `text-black` | 5 |
| `border-neutral-200` | 5 |
| `bg-white` | 4 |
| `bg-neutral-900` | 4 |
| `text-red-700` | 3 |
| `text-red-400` | 3 |
| gradient stops `from-blue-500/400`, `to-purple-600/500` | 4 |

Arbitrary hex classes: 3.

```bash
grep -rnoE '\[#[0-9A-Fa-f]{3,8}\]' src --include='*.html'   # app.component.html:20,27,41
```

Token utility classes by file (`grep -oE '\b(bg|text|border|decoration|divide)-(surface|surface-raised|ink|ink-muted|accent|border)\b' <file> | wc -l`):

| File | Token classes |
|---|---|
| admin-enquiries | 18 |
| contact | 9 |
| admin-login | 7 |
| index.html | 2 |
| app, topbar, portfolio, about | **0** |

### 2b. mat-icon: **0 template uses, 1 dead import**

```bash
grep -rn 'mat-icon\|MatIcon' src
# topbar.component.ts:3 import { MatIconModule }; topbar.component.ts:13 imports: [MatIconModule, …]
```

### 2c. Gradients: **1**

```bash
grep -rnE 'gradient' src     # app.component.html:13 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500
```

### 2d. Hard-coded hex in SCSS: **6 real values** (plus 12 in comments that document tokens)

```bash
grep -rnE '#[0-9A-Fa-f]{3,8}\b' src --include='*.scss'
```

- `contact.component.scss:2` `#b91c1c`
- `contact.component.scss:3` `#f87171`
- `admin-enquiries.component.scss:23,26` `#b91c1c`
- `admin-enquiries.component.scss:31,34` `#f87171`
- `styles.scss:15–31`: hex only in comments beside RGB triplets (fine)

### 2e. Transitions and animations: **23 in templates, 6 in SCSS, 1 in TS**

```bash
grep -rnoE '\btransition(-[a-z]+)?\b|duration-[0-9]+|animate-[a-z]+|hover:scale|hover:-?rotate-[0-9]+|-rotate-[0-9]+|hover:-translate-y-[0-9.]+|group-hover:scale-\[[0-9.]+\]|hover:shadow-[a-z]+' src --include='*.html'
grep -rnE 'transition|animation|@keyframes|trigger\(|animate\(' src --include='*.scss' --include='*.ts' --exclude='*.spec.ts'
```

**Template `transition*` classes: 16**

| File | Count | Lines and detail |
|---|---|---|
| app | 4 | `:20,27,34,41` `transition-all duration-300` |
| topbar | 3 | `:54–56` |
| portfolio | 3 | `:9,18,19` (`duration-500`) |
| about | 1 | `:6` (`duration-500`) |
| contact | 2 | `:13,84` |
| admin-login | 1 | `:20` |
| admin-enquiries | 3 | `:5,15,45` |

**Motion flourishes that contradict the principles:**
- `hover:-translate-y-0.5` ×4: app `:20,27,34,41`
- `group-hover:scale-[1.03]`: portfolio `:18`
- `hover:shadow-xl`: portfolio `:9`
- `-rotate-3 sm:-rotate-6 hover:rotate-0`: about `:6`
- `animate-wave` ×2: about `:21,24`

**SCSS:**
- `portfolio.component.scss:4` 0.6 s reveal
- `about.component.scss:2–17` infinite `wave`
- `contact.component.scss:14`
- `admin-enquiries.component.scss:10`
- `styles.scss:112` body background/colour transition
- `styles.scss:127–136` reduced-motion backstop (good)

**TS:** `topbar.component.ts:19–29` `@angular/animations` `slideMenu`, which needs `provideAnimationsAsync()` (`src/main.ts:24`).

**Inline SVGs: 11**
```bash
grep -rc '<svg' src --include='*.html'
```
index.html 1, app 4, topbar 6.

### 2f. Browser globals (`window` / `document` / `localStorage` etc.)

```bash
grep -rnE '\b(window|document|localStorage|sessionStorage|navigator|matchMedia|IntersectionObserver|confirm|alert|location)\b' src --include='*.ts' --exclude='*.spec.ts'
```

| file:line | Use | Prerender-safe? |
|---|---|---|
| `src/app/theme.service.ts:10–13` | `typeof window/document/localStorage` guard | yes (guard) |
| `theme.service.ts:31, 46, 65` | `localStorage.get/setItem` | yes, behind the guard; but causes a theme flash (§4) |
| `theme.service.ts:44, 76` | `document.documentElement.classList` | yes (guarded); should use `inject(DOCUMENT)` |
| `theme.service.ts:54, 63` | `window.matchMedia` | yes (guarded) |
| `src/app/portfolio/portfolio.component.ts:37` | `typeof window !== 'undefined'` guard | yes, but brittle; prefer `afterNextRender` / `isPlatformBrowser` |
| `portfolio.component.ts:46` | `Fancybox.bind` in `ngOnInit` | guarded. The module import (`:2`) was checked: `import('@fancyapps/ui/dist/index.esm.js')` loads fine in plain Node |
| `portfolio.component.ts:52` | `window.matchMedia` | guarded |
| `portfolio.component.ts:62, 84` | `el.nativeElement.querySelectorAll` | guarded (after `isBrowser` return) |
| `portfolio.component.ts:68–72` | `IntersectionObserver` | guarded |
| `src/app/admin/enquiries/admin-enquiries.component.ts:105` | `confirm()` | click-time only; admin must not be prerendered anyway |
| `src/app/admin/admin.guard.ts:12–14` | HTTP `GET /api/admin/session` | would run during prerender if `/admin` is not excluded |
| `src/app/app.component.ts:14` | `new Date().getFullYear()` | safe, but bakes the build year into prerendered HTML |

**Result: no hard blocker; everything is guarded.** The real prerender risks are behavioural:
- theme flash
- content hidden by the opacity-0 reveal
- the guard firing during prerender
- Fancybox never unbound

---

## 3. Accessibility quick issues

**Contrast checks** (python WCAG luminance on token hex values):

| Pair | Ratio | Result |
|---|---|---|
| Light accent `#B08968` on surface `#FBF9F4` | **3.01:1** | Fails 4.5:1 for text links / `hover:text-accent`. The focus ring at 0.7 alpha (`styles.scss:65`) is below the 3:1 non-text minimum. |
| Dark accent on surface | 8.63 | ok |
| ink-muted, light | 6.52 | ok |
| ink-muted, dark | 5.14 | ok |
| error `#b91c1c` on cream | 6.15 | ok |

Fix: darken the light `--accent` (to about `#8A6A4F` range) or split it into `accent` (decorative) and `accent-ink` (text/focus).

**Headings**
- Portfolio has only an `h1` (`portfolio.component.html:3`); the gallery section is unlabelled (`:4`).
- About renders two `h2`s on mobile, "Hello there," and "I'm Wei Khang" (`about.component.html:20–21`). That is one sentence split into two headings, with a desktop duplicate at `:23`, which is hidden with `display:none` so it is fine for assistive tech.
- All h1s are uppercase literals ("PORTFOLIO", "ABOUT ME"). Screen readers may spell them out; use `uppercase` CSS instead.
- The footer wordmark is a `<p>`, which is fine.
- No page has an h1 → h3 skip.

**Alt text**
- All 12 portfolio images have alt text (`portfolio.component.ts:144–205`), but it is terse keyword-style ("Tofu", "Moon").
- Typo: "Coffe milk" (`:183`).
- There is no alt for zh (Q15 model needs `alt.en/zh`).
- About: "Wei Khang's profile picture" (`about.component.ts:20`).
- The emoji 👋 (`about.component.html:21,24`) has no `role="img"` / `aria-label` / `aria-hidden`.

**Focus**
- The global `:focus-visible` exists (`styles.scss:64`) but is overridden:
  - `focus:outline-none` + `ring-blue-500` in `topbar.component.html:8,25,61`
  - nav links add a blue ring on top of the outline (`:43–45,54–56`)
  - `.field:focus{outline:none}` (`contact.component.scss:16`)
  - `focus:outline-none` (`admin-login.component.html:12`)
- Portfolio thumbnails are `<a href>`, so they are focusable, and Fancybox opens on Enter.
- There is no skip link.
- The mobile menu doesn't move or trap focus and doesn't close on Escape.

**Landmarks**
- `<header>` (topbar), `<main>` (`app.component.html:4`) and `<footer>` (`:9`) exist. They sit inside a centred `div`, which is acceptable.
- **Nested navigation landmarks:** `div role="navigation"` wraps `<nav aria-label="Mobile navigation">` (`topbar.component.html:41–42`).
- Desktop nav sits inside `mat-toolbar` (`:51`).
- `role="tab"` without tabpanels (`admin-enquiries.component.html:10–12`).
- `aria-label` on a non-interactive `<span>` (`:48`).

**lang**
- Static `lang="en"` (`src/index.html:2`). `@angular/localize` per-locale builds will set it, but `zh-Hans` must be configured.
- No `dir` or `hreflang`. Chinese text will need a CJK fallback font stack, because Signika has no CJK glyphs.

**Motion**
- The global reduced-motion backstop exists (`styles.scss:127`).
- Portfolio reveal checks reduced motion (`portfolio.component.ts:52,60`) and has a CSS fallback (`.scss:13–19`).
- About's infinite wave is covered only by the backstop (it sets iteration-count 1, so it still plays once).

---

## 4. Blockers for the decided plan (build order B)

### 4a. Prerender (SSG) readiness

- **Packages:** `@angular/ssr` and `@angular/localize` are **not installed** (`ls node_modules/@angular/{ssr,localize}` → missing). There is no `main.server.ts`, `app.config.ts`, `app.routes.ts` or `server` / `prerender` / `outputMode` in `angular.json:20–43`. The builder is already `@angular-devkit/build-angular:application` (`angular.json:20`), which supports prerender.
- **Routes:** routes and providers are declared inline in `src/main.ts:10–26`. Extract them to `app.routes.ts` + `app.config.ts` so the browser and server bootstraps share them.
- **Hydration:** no `provideClientHydration()`.
- **Theme flash:** there is no inline pre-paint script. `ThemeService` applies `.dark` only after bootstrap (`theme.service.ts:17–24`). Prerendered HTML will always be light-first, and the toggle icon starts as "moon" (`:9`).
- **Hidden content:** `.reveal-image { opacity: 0 }` (`portfolio.component.scss:2`) makes prerendered gallery HTML invisible until JS runs. This hurts LCP and link previews and contradicts "don't block content behind animations".
- **Admin must be excluded from prerender.** `adminGuard` calls the API (`admin.guard.ts:12`).
- **Year:** `currentYear` (`app.component.ts:14`) is frozen at build time. Acceptable for yearly rebuilds; otherwise compute it on the client.
- **Hosting:** `wrangler.jsonc` uses `not_found_handling: "single-page-application"` and `run_worker_first: ["/api/*"]`. With per-locale output (`browser/en/`, `browser/zh/`):
  - the fallback must become `404-page`, or be handled in the Worker
  - `run_worker_first` must add `/`, legacy unprefixed paths, `/img/*` and `/admin*`
  - `robots.txt` / `sitemap.xml` / `llms.txt` must be real files, because today `/robots.txt` returns HTML
- **Soft 404:** the wildcard `{ path: '**', redirectTo: '' }` (`src/main.ts:16`) turns unknown URLs into the home page. SSG and SEO need a real 404 route.
- **Budgets:** `anyComponentStyle` budget is 2 kB warn / 4 kB error (`angular.json:57–59`). That is fine now, but blog prose styles should live in global CSS.

### 4b. i18n: 0 `i18n` / `$localize` markers today

```bash
grep -rn 'i18n\|\$localize' src | wc -l   # 0
```

Hard-coded user-facing strings were counted by hand from the templates and TS read above. Proper nouns (social network names) are excluded from the "translatable" column.

| Component | Hard-coded strings (occurrences) | Unique translatable | Notes |
|---|---|---|---|
| Topbar | 16 | 9 | WEI KHANG ×2, PORTFOLIO ×2, ABOUT ME ×2, CONTACT ×2; aria-labels: "Toggle navigation menu", "Switch to light/dark mode" ×2 pairs, "Mobile navigation", "Main navigation". Duplicated mobile/desktop markup doubles the i18n work, so dedupe first. |
| App footer | 9 | 5 | CHONG WEI KHANG, "Penang, Malaysia", "Available upon request" (remove per Q22), "© … Developed by Chong Wei Khang", 4 `sr-only` network names |
| Portfolio | 13 | 13 | "PORTFOLIO" + 12 alt strings in TS (`portfolio.component.ts:147–203`). These move to `photos.json` `alt.{en,zh}` rather than i18n files. |
| About | 9 | 8 | h1, "Hello there," / "I'm Wei Khang" (duplicated mobile/desktop), script "me", 3 long paragraphs, alt (`about.ts:20`). The bio needs a rewrite anyway (Q23/Q24), so it could be markdown per locale. |
| Contact | 18 | 17 | h1, intro, sent title + body, "Send another message", 4 labels, honeypot label (don't translate), "Sending…" / "Send message", counter; TS: 5 validation/error strings (`contact.component.ts:59,76–79`). Server error text from the Worker (`body.error`, `details`) is English too; the API should return codes, not prose. |
| Admin login | 6 | n/a | English-only by decision (Q6) |
| Admin enquiries | 21 | n/a | English-only; includes tab labels (`.ts:25–28`), `confirm` text (`.ts:105`), error (`.ts:137`) |

**Other i18n impacts:**
- `DatePipe` format `'d MMM y, h:mm a'` (`admin-enquiries.component.html:54`) is admin-only, so it's fine. Public dates (blog) must use locale-aware formatting.
- Uppercase nav labels written as literals don't translate sensibly. Use CSS `uppercase` with sentence-case source strings.
- Fonts: Signika has no CJK. Add a zh font stack, for example `"PingFang SC", "Noto Sans SC", "Microsoft YaHei"`, via `:lang(zh)` on `--font-display`.

### 4c. Image pipeline coupling to Cloudinary

- The Cloudinary base URL is duplicated in two components: `portfolio.component.ts:93` and `about.component.ts:12`.
- The transform string `w_…,h_…,c_fit,q_auto,f_auto` is duplicated: `portfolio.component.ts:122`, `about.component.ts:15`.
- The data model is a Cloudinary `public_id` with random suffixes (`filename`, `portfolio.component.ts:6`). There are no real width/height values, only two assumed aspect-ratio buckets (`IMAGE_CONFIG`, `:12–25`: landscape 3:2, portrait 9:16). Any photo with a different ratio gets letterboxed by `c_fit`, and `width`/`height` on `<img>` will be wrong, which risks layout shift.
- Passthrough `IMAGE_LOADER` (`image-loader.ts:3`, registered `main.ts:21`) means no srcset.
- `<link rel="preconnect" href="https://res.cloudinary.com">` (`index.html:12`).
- The Fancybox "full" URL is also Cloudinary (`portfolio.component.ts:136–142`).
- **Migration seam:** replace `image-loader.ts` with an R2 loader (`/img/<key>-<w>.<fmt>`), move the data to `photos.json` using the Q15 `Photo` model (real `width`/`height`, `alt.{en,zh}`, `series`), and build `PortfolioImageService` against that model rather than against Cloudinary. The Worker needs a `/img/*` route and an R2 binding (none in `wrangler.jsonc` today).
- `src/assets/Photos/Avatar.jpg` is untracked and excluded from assets (`angular.json:35`). It is probably the About portrait candidate for R2.

### 4d. Route structure for `/en` and `/zh`

**Current routes** (`src/main.ts:10–17`):

| Path | Component |
|---|---|
| `''` | Portfolio |
| `about` | About |
| `contact` | Contact |
| `admin/login` | Admin login |
| `admin` | Admin enquiries |
| `**` | redirect to `''` |

**Changes needed:**
- **Locale prefix via `@angular/localize`.** Each locale build gets `baseHref: /en/` or `/zh/` (`i18n.locales` in `angular.json`, `localize: true`), so the in-app route table can stay unprefixed. Only `href="/"` literals break: `topbar.component.html:20,52` must become `routerLink="/"`.
- **New routes:**
  - `blog` and `blog/:slug`
  - `notes` (or a `type` filter)
  - `til`
  - `now`
  - `series/:slug` (later)
  - a real `404`
  - prerender param lists for slugs
- **Admin:** stays unlocalised. Build it into the `en` bundle only, and have the Worker map `/admin*` to `/en/index.csr.html` or equivalent. Also keep `/api/*` and `/img/*` outside both locales.
- **Worker:** `/` → 302 by cookie or `Accept-Language`; legacy `/about` and `/contact` → 301 to `/en/…`. Today the Worker returns early for any non-`/api/` path (`worker/index.ts:45–46`).
- **Language switcher:** Topbar needs one that maps the current path to the other locale and falls back to "not yet translated".

---

## 5. Angular Material: what is used and can it go

**Actually used:**

| Item | Where | Status |
|---|---|---|
| `<mat-toolbar>` | `topbar.component.html:51` | Layout only; its colours are overridden with `!important` |
| `MatIconModule` | `topbar.component.ts:3,13` | Imported, 0 uses (dead) |
| `mat-typography` body class | `index.html:17` | Applies Material typescale to h1–h6/p and fights the site's own heading styles |
| M3 theme | `styles.scss:1–2, 69–89` | `mat.all-component-themes` emits the CSS variables for **every** Material component; `matx` imported but unused; `$dark-theme` defined but never used |
| Prebuilt theme | `angular.json:37` | `indigo-pink.css` loaded on top, a second full Material theme |
| `@angular/animations` + `provideAnimationsAsync()` | `topbar.component.ts:6,19–29`, `main.ts:5,24` | Only for the mobile-menu slide |
| `@angular/cdk`, `@angular/cdk-experimental`, `@angular/material-experimental` | `package.json` | 0 imports in `src` |

**Can it be removed entirely? Yes.** Nothing uses Material behaviour: no dialogs, form fields, overlays, ripples or CDK a11y.

**Removal steps:**
- Swap `mat-toolbar` for `<header><nav>`.
- Delete the `MatIconModule` import, the `mat-typography` class, `styles.scss:1–2` and `:69–89`, and `angular.json:37`.
- Replace `slideMenu` with CSS (`@starting-style` / `transition-behavior: allow-discrete`, or Angular's `animate.enter` / `animate.leave`).
- Drop `provideAnimationsAsync`.
- Uninstall `@angular/material`, `@angular/material-experimental`, `@angular/cdk`, `@angular/cdk-experimental` and `@angular/animations`.
- If a future lightbox or menu needs focus trapping, `@angular/cdk/a11y` alone can be re-added.

**Bundle impact** (`npx ng build --output-path <scratchpad>`, production, 2026-09-16):

```
Initial total                     562.24 kB raw | 119.62 kB transfer
  styles-67UL254K.css             216.20 kB     |  21.03 kB
  main-HXH7PY74.js                 22.13 kB     |   6.28 kB  (contains mat-toolbar ×47, slideMenu)
  chunk-6UTOVZBD.js               145.16 kB     |  42.98 kB  (Angular core/router/common)
  chunk-JRXHNSYJ.js                96.16 kB     |  24.11 kB
Lazy
  portfolio-component             144.84 kB     |  38.59 kB  (Fancybox)
  browser                          64.21 kB     |  17.21 kB  (@angular/animations AnimationEngine — loaded when Topbar renders, i.e. every page)
  chunk-TKBBA2L4.js                39.29 kB     |   8.29 kB  (forms, shared by contact/admin)
  admin-enquiries 8.87 kB · contact 7.45 kB · about 3.93 kB · admin-login 2.50 kB
```

**CSS breakdown** (regex over the built `styles-*.css`): about **157 kB of the 216 kB** is in rules that mention `.mat-` / `.mdc-` / `--mat-` / `--mdc-` (2,439 `--mat-*` custom properties). Fancybox accounts for about 23 kB.

**Live HTML:** the page at `https://chong.weikhang.workers.dev/` inlines a **~116 kB critical `<style>`** (Beasties), dominated by `--mat-*` variables, inside an otherwise empty `<app-root>`.

**Expected savings from removing Material + animations:**
- ~150 kB raw CSS
- ~100 kB of inlined HTML CSS per page (which would otherwise be multiplied across every prerendered page × 2 locales)
- the 64 kB animations chunk
- a few kB of toolbar JS in `main`

Worth doing in Foundation or PRD 2, before prerender multiplies the inlined CSS.

---

## 6. Recommended redesign order (aligned to build order B)

Effort: S ≈ under half a session, M ≈ 1 session, L ≈ 2+ sessions.

| # | Surface / work | Effort | Depends on | Notes |
|---|---|---|---|---|
| **0a** | **Doc repair:** move the new direction from `PRODUCT.md` into `.impeccable.md` (or repoint the PRDs); fix stale NgModule / Karma / `tailwind.config.js` / `app.module.ts` references; create or remove the `design-research.md` link | S | — | Prevents agents from reading the gradient-era brief |
| **0b** | **Foundation: strip Material + animations** (§5); delete `vercel.json`; change the shell wrapper `app.component.html:1` to token classes so the warm palette actually appears | S | — | Do this before SSG so the ~116 kB inline CSS isn't prerendered into every page |
| **0c** | **Foundation: token completion.** Fix light accent contrast (3.01:1); add `danger`, `accent-ink`, `scrim` tokens; 6-step type scale; motion duration tokens; `:lang(zh)` CJK font stack; remove `.font-signika` / `.font-nothingyoucoulddo` duplicates (19 uses → `font-display` / `font-script`); drop Signika weight 300 | S–M | 0b | Contrast fix unblocks every later focus ring and link |
| **0d** | **Foundation: SSG + i18n scaffold.** Install `@angular/ssr` + `@angular/localize`; extract `app.config.ts` / `app.routes.ts`; `provideClientHydration`; `outputMode: static`; locales en / zh-Hans; exclude admin; real 404 route; inline theme script in `<head>`; convert `ThemeService` to a signal plus `inject(DOCUMENT)`; Worker: `/` redirect, legacy 301s, `noindex` header, per-locale assets and `run_worker_first` update; real `robots.txt` | L | 0b | Growth-plan Step 0. Pair with CI (PRD 7 Phase B). |
| **1a** | **`IconComponent` (Phosphor)** replacing 11 inline SVGs; `app-link` / `app-button` primitives | S | 0c | `@phosphor-icons/core` is already installed; Unsplash has no Phosphor mark, so use a text link |
| **1b** | **Topbar rebuild:** one semantic `header > nav` (dedupe mobile/desktop markup); routerLink wordmark; token focus states; Escape / outside-click / route-change close; language switcher; nav Work / Writing / About / Now / Contact with `i18n` markers | M | 0d, 1a | 42 raw colours → 0. Fixes nested nav landmark and blue rings. |
| **1c** | **Footer rebuild:** ink wordmark (no gradient); Phosphor socials plus GitHub; remove "Available upon request"; remove translate/scale hovers; `i18n` markers; skip link in shell | S | 1a | 20 raw colours + 3 arbitrary hex → 0 |
| **2** | **Content engine surfaces:** BlogList (posts + notes), BlogPost/Note detail (prose styles, code blocks, TOC, `<time>`, `article`), `/til`, tag list, empty state, "not yet translated" fallback; JSON-LD / OG / hreflang / feeds / `llms.txt` / `.md` mirrors | L | 0d, 1b, 1c | Largest new UI surface. Defines prose and mono tokens used later by About/Now. |
| **3a** | **Photo data + loader:** `photos.json` (Q15 model with real dimensions, `alt.{en,zh}`); R2 `IMAGE_LOADER` replacing passthrough; `PortfolioImageService` + tests; `LightboxAdapter` (bind/unbind) | M | 0d; R2 + Worker `/img/*` (PRD 7) | Removes both Cloudinary copies (`portfolio.ts:93`, `about.ts:12`) and the preconnect later |
| **3b** | **Portfolio / home redesign:** identity intro strip (Q2); editorial grid with captions; remove shadow, zoom, overlay and opacity-0 reveal (or make the reveal progressive enhancement only); series-ready layout; `ImageObject` JSON-LD; `noimageai` | M | 3a, 1b | Series pages later (S–M each once the layout exists) |
| **4a** | **About rewrite:** remove rotated polaroid and waving emoji; single-column essay, one script signature; **remove employer name (`about.component.html:27`)**; timeline; links; `Person` JSON-LD; bilingual | S–M | 1a, 2 (prose styles) | The Q24 violation is live now; consider a one-line hotfix before the redesign |
| **4b** | **`/now` page** | S | 2 (prose styles) | 5–10 lines plus updated date |
| **4c** | **Contact restyle + enquiry type:** `danger` token replaces hex; visible focus ring on fields; enquiry type select; mailto + socials; i18n of labels and validation; API returns error *codes* for localisation; D1 `0003_enquiry_type` | S–M | 0c, 1a, Worker | Already ~80% tokenised |
| **4d** | **Admin touch-up:** danger token; tabs ARIA (use buttons with `aria-pressed`, or full tabpanel pattern); unread dot `role="img"`/sr-only text; enquiry-type filter; focus ring on login input | S | 0c, 4c | English-only, not prerendered |
| **5** | **A11y / motion / cleanup pass (PRD 6):** axe + Lighthouse on both locales and themes; remove Cloudinary preconnect after migration; bundle baseline; alt text quality ("Coffe milk" typo) | M | all above | Much of it is absorbed earlier if 0c and 1b land correctly |
| ∥ | Diagram style kit (tokens → SVG rules) | M | 0c | Parallel design track, needed before the flagship post |

**Critical path:** 0a → 0b → 0c → 0d → 1a → 1b/1c → 2 (owner starts writing) → 3a → 3b → 4a–4d → 5.

**Two quick wins that can ship at any time:**
- remove the employer name from About
- change the shell wrapper colours to tokens (`app.component.html:1`)

The second one alone makes the warm palette visible site-wide.
