# 07 — Visual Review (screenshots, 2026-09-17)

**Why this exists:** reports 01–06 were based on fetched text/HTML only. This review **looks at rendered pages**: the current site (after the Angular 22 / i18n / blog commits pulled on 2026-09-17) and reference sites.

**Method:**
- **Current site:** `ng serve`, screenshots at 1440px desktop (light + dark) and 390px mobile (iframe + headless Chrome), plus computed-style checks.
- **References:** headless Chrome at 1440px: samalive.co, anthropic.com/engineering/building-effective-agents, simonwillison.net, alecsoth.com, nadavkander.com, sspai.com.
- **Not committed:** screenshots, because the reference images are third-party.

**Build/test state at review time:**
- `ng build` passes. Initial load 648 kB raw / 139 kB transferred.
- **All 9 Jest suites fail to load** since the Angular 22 upgrade ("Jest encountered an unexpected token"). The Jest transform config needs updating.

---

## 1. What the site looks like now

### 1.1 Home / portfolio (desktop, dark)
- 3-column **masonry**, ~1200px container, 8px gutters, **rounded corners + shadow** on photos.
- A **"PORTFOLIO" H1** in a fallback-looking grotesk sits above the grid and takes ~150px before any photo.
- The background is neutral `#1b1b1b`-ish, not the warm `--surface` token. The warm palette still doesn't show on this page.
- Masonry breaks the reading order: the curated sequence can't be followed.
- Photos **fade in on scroll** (opacity 0 until IntersectionObserver fires). In the first screenshots the grid looked washed out or blank mid-transition.
- **Verdict:** photos are reasonably large, but the chrome (heading, radius, shadow, fade) competes with them, and there's no identity statement.

### 1.2 Topbar
- Active link is **blue** (off-brand; the accent should be clay).
- Language toggle is a bordered chip "中文"; theme toggle icon.
- **Mobile bug (confirmed, 390px):** the desktop `<mat-toolbar class="hidden lg:flex">` renders **under** the mobile header, so there are two navs and the nav row overflows horizontally. **Cause:** Angular Material's toolbar CSS sets `display:flex` outside Tailwind's cascade layers, so it beats Tailwind's `hidden` (unlayered CSS always wins over `@layer utilities`). Removing Material, or moving the toolbar into plain markup, fixes it.

### 1.3 Blog post (`/blog`, sample "Decoupling the Brain from the Hands")
**Good base:**
- 720px column, 17px body, line-height ~1.85, Signika headings, a clear dek with accent rule.
- Monospace meta line, figure captions, code block with filename.
- Chinese version renders well: good CJK line-height, mixed-script spacing handled.

**Problems:**
- **Two aesthetics fight.** The article shell is editorial, but the figures, eyebrow and code blocks use a **cyber-terminal / HUD** look:
  - `ENGINEERING // AGENT ARCHITECTURE`, `SCHEMATIC // DECOUPLED`, `VIRTUALIZATION // HARNESS_V1`;
  - `STATUS: Brain = Cattle · Hands = …` strips, dot-grid backgrounds;
  - monospace for every label, orange status dots.

  That is the opposite of "Calm · Cinematic · Editorial" and of the Darkroom Diagrams kit (report 03).
- **Figure quality issues:**
  - edge labels are clipped or overlap boxes (`return string | erro`, `execute(name, input)` running into node borders, `e_003)` overflowing);
  - labels ~11–12px at 720px;
  - 9–12 labelled elements per figure plus decorative labels (density budget is ≤ 7 nodes);
  - several "meaning" colours (orange dot, orange border, orange text, dashed orange).
- **Code block:** every line has its own highlighted background, so it reads like selected text rather than syntax colour.
- Body text uses the system sans (`-apple-system`/PingFang), headings use Signika. Fine for zh; for EN long reads it looks generic next to references (see 2.2).
- "Back to Portfolio" as the first element of a post is odd navigation (should be "Writing" / breadcrumbs).

### 1.4 About / Contact
- **About:**
  - rotated polaroid (`-rotate-3`), script "me", waving-hand emoji animation;
  - **the employer is still named** (Q24 violation, live);
  - bio text is English even on the 中文 locale.
- **Contact:** clean form on tokens, but the intro copy stays English on the 中文 locale, so the runtime i18n is incomplete.

### 1.5 Footer
- The wordmark is still purple/gradient-coloured (off-brand). "Available upon request" is ambiguous, given decision Q22 (no hiring signal).

---

## 2. What the references actually look like (verified by screenshot)

### 2.1 samalive.co (owner's photo reference)
- **Near-black background, photos fill ~86% of viewport width**, justified rows, **~4px gutters**, **no radius, no shadow, no page title**: the grid starts right under the nav.
- Nav: script logo left, **tiny uppercase letter-spaced** category links, icons right. The chrome is barely there.
- The photos carry everything. The site's "design" is scale + tight gutters + silence.

### 2.2 Anthropic Engineering: "Building effective agents"
- **Warm off-white background**, very generous margins.
- Big **sans headline** beside an abstract pictogram illustration; standfirst in a large light sans.
- **Body in a serif**, ~60ch column, left-offset; headings in a medium-weight sans.
- **Figures:**
  - a *white rounded card* on the off-white page, with lots of empty space around a small diagram;
  - **pastel tinted pill/box nodes** (In/Out peach, LLM green, tools lilac), hairline grey arrows with open heads, small sans labels, **5–6 nodes**;
  - caption is a short plain line under the card ("The augmented LLM").
- No HUD labels, no status strips, no monospace in figures. It's calm because it leaves things out.

### 2.3 simonwillison.net
- Utilitarian: dense single column + "Highlights" sidebar, tag chips with counts, type badges (RELEASE / TOOL), quotes with big quote marks, date headings.
- The *structure* is what to copy (date grouping, type labels, tags with counts), not the visual style.

### 2.4 alecsoth.com
- A **first-person voice statement** in a coloured block ("My name is Alec Soth… I live in Minnesota…"), then a **huge bold nav** as the page's main type.
- Confirms the intro-strip idea (Q2): personality through a sentence, not a hero image.

### 2.5 nadavkander.com
- Single full-screen image slideshow (didn't load in headless), wordmark left, **4-column small-text nav**, bottom-left `03/35 · caption`.
- Gallery-like restraint: tiny type, photo owns the screen.

### 2.6 sspai.com (少数派)
- Dense, card-heavy Chinese tech portal, dark UI, rounded cards, promos. Good CJK type rendering, **not** a model for this site's layout. Use it for Chinese typography only (report 04).

---

## 3. Gap analysis → biggest design levers

Ranked by visual impact per effort.

| # | Lever | Now | Target (evidence) | Effort |
|---|---|---|---|---|
| 1 | **Pick one visual voice** | Editorial shell + cyber-terminal figures/eyebrows | Editorial/print throughout; mono only for small meta (dates, code, file names) (Anthropic, Lil'Log) | S (decision) → M (restyle) |
| 2 | **Let photos be big and silent** | Masonry in 1200px box, radius, shadow, fade-in, "PORTFOLIO" H1 | Justified rows up to ~1600px, 4–8px gutters, **no radius/shadow/fade**, visually hidden H1, intro strip instead (samalive, Kander, Soth) | M |
| 3 | **Fix the chrome** | Blue active link, bordered 中文 chip, purple footer wordmark, double nav on mobile | Clay (accent-ink) active state, plain-text `中文 / EN`, ink wordmark, one semantic header (remove Material) | S |
| 4 | **Redraw diagrams calmly** | Dark HUD cards, 9–12 labelled items, decorative labels, clipped text, 11–12px | Report 03 kit: ≤ 7 nodes, one accent, open chevrons, ≥ 13px labels, no status strips/grids; light card on light theme like Anthropic, tinted nodes | M per figure type (4 archetypes exist) |
| 5 | **Reading typography for EN long-form** | System sans body | Try **serif body for EN posts only** (Newsreader / Source Serif 4 / Literata) + Signika headings, zh stays system sans (Anthropic uses serif body) | S to prototype; owner decision |
| 6 | **Remove ornament on About** | Tilted polaroid, waving emoji, script "me" | Single-column essay, straight portrait, one signature accent | S |
| 7 | **Finish i18n visually** | English copy on 中文 About/Contact | All public copy per locale (or plan's build-time i18n) | M |
| 8 | **Warm palette everywhere** | Neutral greys on shell/home | Shell uses `--surface`/`--ink` tokens; photos sit on warm near-black/cream | S |

**Bugs found (fix regardless of redesign):**
1. Mobile double nav / horizontal overflow (Material vs Tailwind layers).
2. Jest suites broken after Angular 22.
3. Diagram labels clipped/overlapping (`editorial-graphic.component.html`).
4. Employer name on About.
5. Code block line backgrounds.
6. Home fade-in can leave photos invisible if JS/observer is slow.

---

## 4. Direction options for the planning session

These are 3 coherent directions; each is one voice. Mockups would be the next step before choosing.

**A. "Darkroom Editorial"** (recommended; closest to the brief)
- **Photos:** full-width justified rows, tight gutters, warm near-black stage by default for the gallery, cream for writing.
- **Writing:** Anthropic-like page (cream, serif EN body, Signika headings, pastel-tinted calm diagrams in a light card, generous margins).
- **Mono:** only for dates, code, EXIF.
- **Accent:** clay, used once per view.

**B. "Terminal Lab"** (keeps the current figure style, commits to it site-wide)
- Dark-first, monospace eyebrows, HUD figures, grid backgrounds.
- Coherent and distinctive, and fits the playful/game zone. But it **contradicts the photo-first calm brief** and makes photos feel like secondary UI.
- Only viable if the brand brief itself changes.

**C. "Split personality, one grid"**
- Editorial for photos/About; Terminal Lab confined to `/writing` and `/play`.
- Easiest migration from today, but risks reading as two sites. The brief says one unified system.

**Recommendation:** A for the core site. Keep the "terminal/game" energy for the long-term playful zone (`/play`, 404, easter egg), where it becomes a deliberate contrast instead of a conflict.

## 5. Suggested next steps

1. **Owner:** choose A/B/C, and whether EN posts get a serif body.
2. **Build 2–3 static mockups** (home, post with one redrawn figure, mobile) for the chosen direction, as an HTML artifact, before touching Angular.
3. **Quick fixes** independent of direction: mobile nav bug, Jest config, employer name, shell tokens, remove photo fade, clay active link.
4. **Then** fold the chosen direction into PRDs 02–04 and the design tokens (report 04 + 03 token proposals, with the accent-ink contrast fix).
