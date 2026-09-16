# Growth Plan — Decisions and Q&A

**Session date:** 2026-09-16
**Status:** Planning (grilling session). Q1–Q25 decided; **redesign planning session pending** (research in [`docs/design-research.md`](./design-research.md)). PRDs have **not** yet been updated to reflect these decisions — see [Next session](#next-session-start-here).
**Related docs:** [`docs/prd/00-overview.md`](./prd/00-overview.md), [`docs/prd/07-backend-cloudflare.md`](./prd/07-backend-cloudflare.md), [`docs/cloudflare-free-tier.md`](./cloudflare-free-tier.md), [`.impeccable.md`](../.impeccable.md)

---

## Next session (start here)

1. Plan the redesign (owner flagged it as a big need) using [`docs/design-research.md`](./design-research.md).
2. Confirm shared understanding of this document (nothing has been implemented from it yet).
3. Update PRDs to match these decisions (see [PRD impact](#prd-impact)).
4. Start Step 0 (Foundation).
5. Owner actions (not Claude): decide on buying `weikhang.com`; set an R2 billing alert before enabling R2.

On a new machine:

```bash
git pull
npm ci
npx wrangler login          # Cloudflare auth for deploy / D1
# Local secrets are gitignored — recreate:
echo 'ADMIN_PASSWORD=local-dev-password' > .dev.vars
npm run db:migrate:local
```

---

## Summary of decisions

| # | Topic | Decision |
|---|---|---|
| Q1 | Goal of visibility | **Reputation among peers** (photographers + AI builders) and **showcasing skills / learning in public** (refined in Q22 — not job-seeking) |
| Q2 | Homepage | **Short identity intro strip, then the photo grid** |
| Q3 | Proof of AI skill | **Blog about AI and agent concepts**, not a projects page |
| Q4 | Blog source material | **Original explainers only** (own words, from own deep studies). RedNote notes = inspiration with citation. No employer-internal content; work posts only later with written employer approval |
| Q5 | Language | **Both English and 简体中文**, separate versions |
| Q6 | i18n scope | **Whole public site** (UI, About, Contact, blog); admin stays English. **Flexible posts** — a post may exist in one language only |
| Q7 | Content types | **Long posts + short notes** (`type: post \| note`), one feed, shared tags. Style reference for long posts: OpenAI / Anthropic engineering posts |
| Q8/Q9 | Diagrams | **Diagram style kit first**, then **Figma SVG for flagship posts**, **Excalidraw for notes/quick diagrams**. Inline SVG using CSS tokens (dark mode safe), per-language exports |
| Q10 | Writing pace | **Light:** ~1 long post every 1–2 months, ~1 note/week. Reassess after 3 months |
| Q11/Q12 | Domain | Buy a real domain, one domain for everything. Preferred: **`weikhang.com`** — owner still considering. Domain kept in one config value |
| Q13 | Rendering | **Static prerender (SSG)** at build time, served as Workers static assets. Reverses "no SSR" in PRDs 5/6 |
| Q13+ | Requirement | Content must be **SEO-, AEO- and AI-agent-friendly** (see baseline below) |
| Q14 | AI crawlers | **Text open** to search and training bots; **photos blocked for training bots** (robots.txt paths + `noai`/`noimageai` + IPTC metadata). AI Crawl Control once on own domain |
| Q15 | Photo organisation | **Curated grid now, series/story pages later**; data model supports series from day one |
| Q16 | Photo hosting | **R2 with pre-generated sizes** (local `sharp` script: AVIF + WebP, several widths, IPTC metadata), served through the Worker at `/img/*`. Admin upload UI later. Cloudinary kept until migration verified |
| Q17 | i18n tech + URLs | **Angular built-in `@angular/localize`**, both locales prefixed: `/en/…`, `/zh/…`. `/` → 302 by cookie then `Accept-Language`. Old unprefixed URLs → 301 to `/en/…`. `x-default` = `/en/`. `zh-Hans` |
| Q18 | Translation workflow | **Official tools only:** Angular CLI MCP (`ng mcp`), built-in i18n with **JSON** format, `ng-extract-i18n-merge`, Claude translates using `i18n/glossary.md`; owner reviews 中文 before publish |
| Q19 | Distribution | **No social promotion yet** — build content quietly first. Planned later: POSSE (own site first, then LinkedIn EN / 小红书 ZH with link back), Atom feeds at launch, newsletter after 5+ posts |
| Q20 | Quiet phase | **Drafts excluded from build**; published pages indexable **only after the domain is bought** (workers.dev stays `noindex`). "Go loud" trigger defined below |
| Q21 | Analytics | **Cloudflare Web Analytics** now (cookie-free), **Google Search Console + Bing Webmaster Tools** after domain, own D1 view counters later (learning) |
| Q22 | Intent signal | **No "open to work"**. Showcase + learning in public. GitHub link added. Contact form gets an **enquiry type** |
| Q23 | Replacing CV | **Richer About + `/now` page + TIL tag** on notes |
| Q24 | Employer | **Not named on site**; work history lives on LinkedIn, site links to it |
| Q25 | Build order | **B — Foundation → Content → Polish**, with redesign treated as a major track to plan next session |

---

## Full Q&A

### Q1. What is "more publicity" for?

- **Options:** A. paid photo work; B. career (recruiters/employers); C. reputation among peers; D. a mix.
- **Recommendation:** B first, C second, because the audience in `.impeccable.md` is peers and AI readers, and the "no marketing funnel" rule clashes with client acquisition.
- **Decision:** **B and C.**
- **Later refinement (Q22):** B means *showcasing skills and learning in public*, not job-seeking.

### Q2. What should visitors see first on `/`?

- **Options:** A. photos only (current); B. short intro strip, then photos; C. AI/projects first; D. split landing page.
- **Recommendation:** B. A one-line identity statement (e.g. "Photographer and AI builder in Penang") with links to Work / Writing / About, then the photo grid. This keeps "the photograph is the protagonist".
- **Decision:** **B.**

### Q3. How do you prove AI-builder skills?

- **Options:** A. blog only; B. projects page; C. projects + blog; D. link out only.
- **Recommendation:** C.
- **Owner's answer:** prefers sharing **AI and agent concepts**, like the studies in the Notion AI category, rather than projects.
- **Decision:** **Blog of AI/agent concept explainers.** No projects page for now.

### Q4. Which source material becomes posts?

**Facts found in Notion (2026-09-16):**

| Source | Examples | Risk |
|---|---|---|
| Own deep studies | "Agent SDK Capability Study — Claude Agent SDK vs OpenAI Agents SDK vs Codex SDK", "AI Agents in EDA / FPGA IP Design — Deep Study (中英双语)" | Low: original analysis |
| RedNote AI Knowledge Base | 56 notes digested from other authors' 小红书 posts (agent loop, sandbox, harness, context engineering…) | Copyright; reads as reposting |
| Work engineering wikis | Internal agent-server documentation | **Employer-internal**; confidentiality |

Local file with related study material: `docs/claude-agents-study.md`.

- **Options:** A. original explainers only; B. notes published nearly as-is, with credit; C. include work experience with employer approval.
- **Recommendation:** A now; C only with written employer approval.
- **Decision:** **A first.**
- **Rules:**
  - Write in your own words.
  - Cite RedNote or other sources when an idea comes from them.
  - Generalise work knowledge; never name internal systems or show internal code.

### Q5. Language

- **Options:** A. English only; B. Chinese only; C. both, separate versions; D. English on site, Chinese summaries on 小红书.
- **Recommendation:** D, for simplicity.
- **Decision:** **C, with proper i18n.**

### Q6. i18n scope

- **Options:** A. blog posts only; B. whole public site; C. whole site including admin.
- **Posts:** strict (every post needs both languages) or flexible (one language allowed).
- **Recommendation:** B, flexible.
- **Decision:** **B, flexible.**
- **Missing translation:** the other locale shows "not yet translated" with a link to the version that exists.

**Reference sites** named by the owner:
- **Photography:** https://www.samalive.co/
  - Squarespace, image-heavy, minimal text.
  - Category nav: Portrait, Landscape, Automotive, Commissions, Cityscape, Life, About, Presets.
  - Grid homepage, email contact.
- **AI writing:** https://simonwillison.net/
  - Entries, links, quotes, notes, TILs, tools.
  - Heavy tagging, Atom feed, year/month archive, search, very frequent posting.

### Q7. Content types

- **Options:** A. long posts only (PRD 5 as written); B. long posts + short notes; C. full Simon set (entries/links/quotes/notes/TILs/tools).
- **Recommendation:** B. Notes are low effort, which keeps a writing habit, and they're cheap to translate. RedNote-inspired thoughts become notes with a link to the source.
- **Decision:** **B.**
- **Style reference for long posts:** OpenAI engineering posts, e.g. https://openai.com/index/scaling-storage-one-billion-users-part-one/ (page blocks automated fetching, so the style notes are general):
  - large title, byline, date;
  - narrow calm column;
  - clean custom diagrams at key points;
  - series support ("Part one");
  - deep dive on one real problem.

**Content model:**

```yaml
# src/content/posts/<lang>/<slug>.md  (exact path decided in PRD 5 revision)
type: post | note
title: …
slug: …
lang: en | zh
date: 2026-09-16
updated: …            # optional
summary: …            # TL;DR paragraph, used for AEO + OG description
tags: [agents, til]   # "til" tag → /til listing
series: …             # optional, e.g. "Agent harness part 1"
draft: true | false
translation_of: …     # slug of source-language version, if translated
translation_reviewed: true | false
source_links: []      # citations (e.g. RedNote post that inspired a note)
syndication: []       # later: LinkedIn / 小红书 URLs
hero_image: …         # optional
```

### Q8. How diagrams are made

- **Options:** A. Mermaid; B. hand-made SVG (Excalidraw/Figma); C. Mermaid default + hand SVG for heroes.
- **Recommendation:** C.
- **Owner's answer:** wants **polished diagram art like OpenAI and Anthropic engineering posts**; Excalidraw (or a similar tool, "archify") is the fallback if too hard.
- **Result:** reopened as Q9.

### Q9. Diagram approach (refined)

**Key facts:**
- **Dark mode:** exported SVGs with fixed colours break it. Diagrams must be **inline SVG using tokens** (`var(--ink)`, `var(--accent)`, `var(--border)`, `var(--surface-raised)`).
- **Consistency:** polish comes from a **style kit**: one stroke weight, corner radius, font, arrowhead style, and one accent.

- **Options:**
  - A. Excalidraw (hand-drawn look, fastest);
  - B. style kit + Figma (polished, ~30–60 min per diagram, EN + ZH exports);
  - C. diagrams as code (Angular SVG components, labels via i18n, can animate);
  - D. B for flagship posts, A for notes.
- **Recommendation:** D, with the style kit designed first. C kept as a future learning option.
- **Decision:** **D.**

**Diagram pipeline (to specify in PRD 5 revision):**
- `docs/design/diagram-style-kit.md` plus a Figma component library: palette = design tokens, stroke, type, box/arrow rules, spacing.
- Exports per language: `diagram-name.en.svg`, `diagram-name.zh.svg`.
- A build step inlines the SVG and replaces fixed colours with CSS variables. It also adds `role="img"`, `<title>`/`<desc>` per language, and a caption.
- Notes use Excalidraw exports through the same colour-replacement step where possible.

### Q10. Writing pace

- **Options:** A. light (1 long post / 1–2 months, 1 note/week); B. steady (1 long/month, 2–3 notes/week); C. heavy (Simon-like).
- **Recommendation:** A to start, B after 3 months if the habit sticks.
- **Decision:** **A.** Owner's motivation: writing is a way to re-learn and deepen understanding from the ground up.

### Q11. Domain

**Problems with `chong.weikhang.workers.dev`:**
- looks temporary;
- tied to Workers (moving host breaks links and ranking);
- no custom email.

- **Options:** A. keep workers.dev; B. buy one name domain; C. separate subdomains (`photo.` / `blog.`), rejected because it splits SEO.
- **Recommendation:** B via Cloudflare Registrar (at-cost), one domain, locale paths under it. Free Email Routing gives `hi@domain` → Gmail.
- **Decision:** **Buy a domain** (owner action).

### Q12. Which domain

Availability checked 2026-09-16. This is a lookup, not a guarantee, and premium pricing is possible; Cloudflare's search is authoritative.

| Domain | Lookup result |
|---|---|
| weikhang.com | Unregistered (whois "No match") |
| weikhang.dev | Unregistered (RDAP 404) |
| chongweikhang.com | Unregistered (whois "No match") |
| chongweikhang.dev | Unregistered (RDAP 404) |

- **Recommendation:** `weikhang.com`. .com is neutral across both identities; optionally also buy `chongweikhang.com` and redirect it.
- **Estimate:** ~US$10–11/year for .com at Cloudflare (not checked live).
- **Decision:** **`weikhang.com` preferred, owner still considering.** Proceed with dev work first.
- **Constraint:** site origin lives in one config value (e.g. `SITE_URL`) so switching domains is a one-line change.

### Q13. Rendering for SEO and link previews

**Problem with the current SPA:**
- **Link previews:** LinkedIn/WhatsApp/X/小红书 don't run JavaScript, so shared links show no preview.
- **Search:** Google renders late; Bing and AI crawlers often don't render at all.
- **Per-page tags:** each page needs its own `hreflang`/`<title>` in the HTML.

- **Options:** A. stay SPA; B. static prerender (SSG) at build; C. full SSR in the Worker.
- **Recommendation:** B. Content is markdown in the repo, known at build time; zero runtime cost; same Workers static assets deploy; `/api` unchanged.
- **Decision:** **B.**
- **Owner's added requirement:** "Make sure our content is SEO and AEO friendly, also with good AI agent search or crawl."

**Implications:**
- Code must be prerender-safe: no `window`/`localStorage` at bootstrap. `ThemeService` needs guards; `PortfolioComponent` already checks `isBrowser`.
- Admin routes stay client-only (not prerendered).
- Publishing a post = rebuild + deploy.
- PRDs 5 and 6 "no SSR/Universal" lines must be revised.

**SEO / AEO / AI-agent baseline (all public pages):**
- Real HTML per route per locale: unique `<title>`, meta description, canonical URL, `hreflang` alternates + `x-default`.
- JSON-LD:
  - `WebSite`;
  - `Person` (`name`, `url`, `sameAs` = GitHub `weikhang95`, LinkedIn `chongweikhang`, Instagram `weikhang95`, Unsplash `@weikhang95`, Facebook; `knowsAbout`);
  - `BlogPosting` (author, dates, `inLanguage`, `image`);
  - `ImageObject`/`Photograph` (creator, `copyrightNotice`, `license`, `acquireLicensePage` → contact);
  - `BreadcrumbList`.
- Open Graph + Twitter card tags; per-post OG image (generated at build).
- `sitemap.xml` with `xhtml:link` language alternates; `robots.txt`; Atom feed per locale plus a combined feed.
- **AEO writing format:**
  - `summary` / TL;DR first paragraph;
  - question-style H2s where natural;
  - visible date, updated date, author byline;
  - definitions stated plainly;
  - sources cited with links.
- **AI agents:**
  - `/llms.txt` (site index for LLMs), optionally `/llms-full.txt`;
  - raw markdown mirror per post: `/en/blog/<slug>.md`;
  - semantic HTML (`article`, `time`, `nav`, real heading levels).
- Performance: prerendered HTML, responsive images, lazy loading below the fold.

### Q14. AI crawlers

**Fact:**
- **Search/answer bots** (OAI-SearchBot, PerplexityBot, Claude-SearchBot, ChatGPT-User) fetch to answer and usually cite.
- **Training bots** (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider) collect for model training.

- **Options:** A. allow all; B. search/answer only, block training site-wide; C. text open to all, photos blocked for training; D. block all.
- **Recommendation:** C. Writing spread into models builds the AI-builder reputation; photos are craft and copyright.
- **Decision:** **C.**

**Implementation notes:**
- `robots.txt`: allow all bots on text paths; `Disallow: /img/` (and photo originals) for training user-agents.
- `<meta name="robots" content="noai, noimageai">` on photo-heavy pages (non-standard, but respected by some).
- IPTC/XMP metadata on every image: creator, copyright, and **Data Mining = "prohibited for AI/ML training"** (`plus:DataMining`).
- **Caveat:** `robots.txt` is a request, not enforcement. Cloudflare **AI Crawl Control** can enforce by verified bot only on a Cloudflare zone, so it needs the own domain.

### Q15. Photo organisation

**Fact:** the current portfolio has **14 photos** on Cloudinary (`dbdetsjli`) in a flat array inside `PortfolioComponent`. Subjects:
- **Travel:** Slovenia ×2, Plitvice (Croatia), St Mark's Campanile, Hatyai Lee's Garden;
- **Penang:** turf club, Malindo beach, Orcabrew coffee ×2;
- **Still life:** calligraphy, tofu;
- **Other:** moon.

- **Options:** A. one curated grid; B. categories like samalive (needs 40+ photos); C. series/story pages; D. A now, C over time.
- **Recommendation:** D, with the data model designed for series from day one. Series pages carry indexable text and act as photo essays.
- **Decision:** **D.** Owner has **many more photos** to add.

**Photo data model:**

```ts
interface Photo {
  id: string;               // stable slug
  src: string;              // R2 key base, e.g. "2024/plitvice-01"
  width: number; height: number;
  alt: { en: string; zh?: string };
  caption?: { en?: string; zh?: string };
  location?: { en: string; zh?: string };
  takenAt?: string;          // ISO date or year
  series?: string;           // series slug
  camera?: string; lens?: string; exif?: Record<string, string>;
  featured?: boolean;        // appears on homepage grid
}

interface Series {
  slug: string;
  title: { en: string; zh?: string };
  intro: { en: string; zh?: string };   // 2–3 short paragraphs, markdown
  location?: string; year?: string;
  cover: string;             // photo id
  photos: string[];          // ordered photo ids
  draft?: boolean;
}
```

### Q16. Photo hosting: R2 or Cloudinary

**Facts checked 2026-09-16:**

| | Cloudinary Free | R2 + Cloudflare Images (Free) |
|---|---|---|
| Allowance | **25 credits/month**; 1 credit = 1 GB storage **or** 1 GB bandwidth **or** 1,000 transformations | **10 GB** R2 storage; Images binding: **5,000 unique transformations/month** |
| Bandwidth | Uses credits | **Free egress** |
| Over limit | Account restricted | New transforms error `9422`, cached ones still served; R2 bills beyond free (payment method required) |
| Metadata | Stripped on delivery by default (`fl_keep_iptc` to keep) | Full control |

**Estimate:** 300 photos ≈ 2–3 GB of web JPEGs. On Cloudinary, 1,000 visitors × 20 MB ≈ 20 GB bandwidth, most of the 25 credits.

- **Options:** A. stay on Cloudinary; B. R2 + resizing on request; C. R2 + pre-generated sizes; D. C now + admin upload UI later.
- **Recommendation:** D.
- **Decision:** **D.**

**Implementation notes:**
- **Local script** (`scripts/photos/`, Node + `sharp`):
  - input: originals folder + a metadata file;
  - output: widths e.g. 480 / 960 / 1600 / 2400 in AVIF + WebP (+ JPEG fallback if needed);
  - embeds IPTC/XMP (creator, copyright, AI-training prohibited);
  - strips GPS if location privacy matters;
  - uploads to an R2 bucket;
  - writes `photos.json` (the data model above).
- **Serving:**
  - Worker route `/img/*` reads from the R2 binding;
  - `Cache-Control: public, max-age=31536000, immutable` with hashed/versioned keys;
  - `run_worker_first` gains `"/img/*"`;
  - **not** served from `r2.dev` (rate-limited, not for production).
- Angular uses `NgOptimizedImage` with a custom loader producing `/img/<key>-<w>.avif` etc.
- **Migration:** the 14 existing photos go through the same script. Cloudinary stays until the migration is verified, then remove the `res.cloudinary.com` preconnect.
- **Owner action before enabling R2:** add a payment method **and set a billing notification**.
- **Later (PRD 7 Phase D):** `/admin` upload page reusing the pipeline (resize in the Worker via the Images binding, or upload originals and process locally).

### Q17. i18n library and URL structure

- **Library options:** A. Angular built-in `@angular/localize` (compile-time, one prerendered output per locale); B. Transloco (runtime).
- **URL options:** 1. English at `/`, Chinese at `/zh/`; 2. both prefixed with a redirect at `/`.
- **Recommendation:** A, both prefixed.
- **Decision:** **A** (owner also asked for LLM-era i18n tooling, see Q18).

**URL rules:**
- `/en/…` and `/zh/…` for all public pages.
- `/`: Worker 302 → saved `lang` cookie, else `Accept-Language` (zh* → `/zh/`), else `/en/`.
- Legacy unprefixed paths (`/about`, `/contact`, `/portfolio`…) → 301 to `/en/…`.
- `/api/*`, `/img/*`, `/admin*` are not localised.
- `hreflang="en"`, `hreflang="zh-Hans"`, `x-default` → `/en/`.
- Language switcher sets the `lang` cookie and links to the equivalent path in the other locale (or the "not yet translated" fallback).
- Chinese variant: **Simplified (`zh-Hans`)**, assumed for the 小红书 audience. Confirm if Traditional is wanted.

**Build note:** Angular i18n + prerender outputs `dist/my-photography-profile/browser/en/` and `/zh/`. `wrangler.jsonc` assets and the SPA fallback need to account for per-locale `index.html` (admin fallback stays on one locale).

### Q18. Translation workflow in the LLM era

**Facts found 2026-09-16:**

| Tool | What | Fit |
|---|---|---|
| Angular CLI MCP server (`ng mcp`, official since CLI 20.2) | Live angular.dev docs search, best practices, examples, `modernize`, build/test tools | High |
| `ng-extract-i18n-merge` | Extract and merge i18n strings into existing translation files | High |
| angular-i18n-mcp (community) | MCP for Angular XLIFF files | Low–medium (small project; audit first) |
| Intlayer | Alternative i18n framework with MCP/LSP/agent skills | Replaces built-in i18n (conflicts with Q17) |
| Hosted translation services (Crowdin, Tolgee, Lokalise, Phrase…) | Official MCP servers | Overkill for one person |

- **Options:** A. official tools only; B. A + community angular-i18n-mcp; C. switch to Intlayer.
- **Recommendation:** A.
- **Decision:** **A.**

**Workflow:**
1. Add `i18n` attributes / `$localize` in components.
2. `ng extract-i18n` via `ng-extract-i18n-merge` → `src/locale/messages.json` (source) and `messages.zh.json` (merged, new keys flagged).
3. Claude translates new keys using `i18n/glossary.md`: preferred 中文 terms, and terms kept in English (e.g. agent, harness, context engineering, token, prompt).
4. Owner reviews 中文.
5. Posts: the translated markdown copy gets `translation_of` + `translation_reviewed: false` until the owner reviews. The build **excludes unreviewed translations** from production.
6. Set up Angular CLI MCP in Claude Code for this repo.

### Q19. Distribution

- **Syndication options:** A. POSSE (own site first, then LinkedIn EN / 小红书 ZH / optional X/Threads, with links back); B. publish fully on platforms, site as archive.
- **Retention options:** 1. feeds only; 2. feeds + hosted newsletter (Buttondown/Substack); 3. feeds + own D1 newsletter.
- **Recommendation:** A + 1 at launch, add 2 after 5+ posts; a build-time "share kit" (OG image, LinkedIn draft, 小红书 card outline). Claude drafts; the owner posts. Claude never posts on the owner's behalf.
- **Owner's answer:** **build up more content first before posting to social media.**
- **Decision:**
  - **At launch:** Atom feeds only.
  - **Deferred until the go-loud trigger:** social syndication (POSSE), the share kit, and the newsletter.
  - **Kept as a later backend learning item:** own D1 newsletter.

### Q20. What "quiet" means

- **Options:** A. public + indexed, not promoted; B. hidden (`noindex`/password) until launch; C. published pages indexable, drafts excluded from build, admin preview for drafts.
- **Recommendation:** C, with the domain bought before indexing so search history builds on the final domain.
- **Decision:** **C.**

**Rules:**
- `draft: true` content never reaches the production build (admin/local preview only).
- While on `*.workers.dev`: `X-Robots-Tag: noindex` header + `robots.txt` disallow.
- After domain purchase: indexing on, submit sitemap.

**"Go loud" trigger** (proposed; owner accepted C without changing numbers):
- **Content:** 1 flagship long post (EN + 中文, with style-kit diagrams), 6–8 notes, 2 photo series.
- **Site:** domain live; redesign PRDs 2–4 done; SEO/AEO baseline in place.

### Q21. Analytics

- **Options:** A. Cloudflare Web Analytics (free, cookie-free, JS beacon); B. A + own D1 view counters; C. Google Analytics 4 (cookies + banner, rejected); D. Google Search Console + Bing Webmaster Tools.
- **Recommendation:** A + D; B later as learning.
- **Decision:** **A now, D after domain, B later.**
- **Notes:** Web Analytics can run on workers.dev via the JS snippet. Search Console needs DNS verification on the owned domain. No cookies, no consent banner.

### Q22. Intent signal

- **Options:** A. nothing explicit; B. quiet availability line + GitHub link + enquiry type on Contact; C. B + `/cv` page; D. loud "Hire me" CTAs (rejected).
- **Recommendation:** C.
- **Owner's answer:** "C, because I more to share and showcase my skills and for my personal learning like Simon Willison, but might not open for career."
- **Decision:**
  - **No "open to work" / availability line.** Goal = showcase skills + learn in public.
  - **Add GitHub** (`https://github.com/weikhang95`, 14 public repos) to footer and `sameAs`.
  - **Contact form gets an enquiry type:** Photography / AI & writing / Other. Needs D1 migration `0003_enquiry_type.sql` (column with CHECK constraint), API validation, admin inbox filter.
  - CV page replaced by Q23.

### Q23. What replaces the CV page

- **Options:** A. neutral `/cv`; B. richer About + `/now`; C. B + TIL tag on notes.
- **Recommendation:** C.
- **Decision:** **C.**

**Details:**
- **About** (bilingual):
  - bio;
  - what I work on (agents, LLM tooling, Angular, Cloudflare, photography);
  - short timeline (no employer names, Q24);
  - links to GitHub, LinkedIn, Unsplash, Instagram;
  - `Person` JSON-LD with `knowsAbout`, `jobTitle` (generic).
  - The single `font-script` signature accent lives here (PRD 4).
- **`/now`:** 5–10 lines (learning / shooting / building), a "last updated" date, updated monthly.
- **TIL:** notes tagged `til` get a `/[lang]/til` listing and their own feed. No new content type.

### Q24. Employer naming

- **Options:** A. generic description; B. named with role; C. named only on LinkedIn, site links there.
- **Recommendation:** C.
- **Decision:** **C.** The site never names the employer.

### Q25. Build order

**Dependencies:**
- i18n + prerender touch every component, so retrofitting them after the redesign causes rework.
- Content writing is the longest task.
- CI matters once builds get heavy.

**Options:**
- A. Redesign first (PRD 2 → 3 → 4), then blog/SEO/i18n.
- **B. Foundation → Content → Polish** (recommended).
- C. Content engine first, before prerender/i18n (URLs and structure would churn).

**Option B detail:**

| Step | Work | Why here |
|---|---|---|
| 0 | **Foundation:** SSG prerender; i18n scaffold (`/en`, `/zh`, Worker `/` redirect, legacy 301s); `noindex` on workers.dev; Cloudflare Web Analytics; Angular CLI MCP; CI with tests + deploy on push (PRD 7 Phase B) | Everything builds on it |
| 1 | **PRD 2** shared components (icon, link, footer/topbar) with i18n markers from day one | Design system before pages |
| 2 | **Content engine (PRD 5 revised):** posts + notes, TIL tag, drafts, translation flow + glossary, SEO/AEO layer (JSON-LD, feeds, sitemap + hreflang, `llms.txt`, `.md` mirrors, OG images) | **Owner starts writing here**, in parallel with later steps |
| 3 | **Photos:** R2 bucket + `/img/*` Worker route, `sharp` pipeline script, series data model, migrate 14 photos, PRD 3 portfolio redesign, homepage intro strip | Unlocks the photo backlog |
| 4 | **PRD 4 revised:** About, `/now`, Contact restyle + enquiry type (`0003` migration) | Small; needs components |
| 5 | **PRD 6:** a11y, motion, Lighthouse, cleanup (remove `vercel.json`, Cloudinary preconnect) | Final polish |
| ∥ | **Diagram style kit** (design work, Figma library) | Needed before the flagship post |
| Gate | **Domain bought (owner):** switch `SITE_URL`, custom domain on Worker, enable indexing, Search Console + Bing, AI Crawl Control, Email Routing `hi@` | Any time; blocks indexing |
| Long-term | **Playful zone:** three.js / pixel-art / game-like interaction inspired by MMORPGs and anime, isolated from the calm main site (e.g. lazy `/play` route or easter egg), respecting reduced motion and performance. Research: [`docs/design-research.md`](./design-research.md) | Owner's personal interest; after core site is stable |
| Later | Newsletter, share kit + POSSE, own view counters, admin photo upload, Turnstile + email alerts (PRD 7 C/D) | After go-loud trigger or as learning |

Step 0 is estimated at 1–2 sessions.

- **Decision:** **B.** Owner notes the redesign is a big need; plan it in detail next session (may reorder PRD 2/3/4 inside B). Overnight design research was run to feed that session.

---

## PRD impact

To do after the redesign planning session. These PRDs don't reflect the decisions yet.

| PRD | Change needed |
|---|---|
| 00 overview | New goals (reputation + learning in public); new build order; remove "SSR not in scope", "English only", "CMS" lines where contradicted; add PRD 8 if created |
| 02 Shared components | i18n markers; language switcher in Topbar; GitHub icon in Footer; BLOG + NOW nav items |
| 03 Portfolio | R2 `/img/*` loader replaces Cloudinary `PortfolioImageService` internals; series data model; homepage intro strip; `ImageObject` JSON-LD; `noimageai` |
| 04 About + Contact | Richer bilingual About, `/now` page, no employer name, enquiry type on form |
| 05 AI Blog | Posts + notes + TIL; per-locale content; drafts; translation flags; diagram pipeline; SSG instead of runtime manifest where appropriate; feeds, `llms.txt`, `.md` mirrors |
| 06 A11y/SEO | SSG + full SEO/AEO baseline moves earlier (Steps 0 and 2); `hreflang`; robots rules for AI bots; per-locale sitemap; Web Analytics |
| 07 Backend | Phase B moves into Step 0; add R2 `/img/*`, `0003_enquiry_type`, `/` locale redirect + legacy 301s + `noindex` header; later: view counters, newsletter |
| New (08?) | **i18n + prerender foundation** PRD, or fold into 00/06 — decide when updating |

---

## Owner actions (not for Claude)

- [ ] Decide on and buy `weikhang.com` (optionally `chongweikhang.com`) via Cloudflare Registrar.
- [ ] Before enabling R2: add payment method **and** billing notification (Manage Account → Billing → Notifications).
- [ ] Gather photo originals for migration + backlog; pick first 2 series.
- [ ] Pick the first flagship post topic (candidates from own deep studies: "Claude Agent SDK vs OpenAI Agents SDK vs Codex SDK", "What an agent harness is", "Agents in EDA/FPGA design").
- [ ] Confirm Simplified Chinese (`zh-Hans`).
- [ ] Start writing notes once Step 2 lands (target ~1/week).
- [ ] Later: post syndication on LinkedIn / 小红书 yourself when the go-loud trigger is met.

## Sources consulted (2026-09-16)

- Reference sites: https://www.samalive.co/ · https://simonwillison.net/ · https://openai.com/index/scaling-storage-one-billion-users-part-one/ (403 to automated fetch)
- Cloudflare Images pricing: https://developers.cloudflare.com/images/pricing/
- Cloudinary pricing: https://cloudinary.com/pricing
- Angular CLI MCP server: https://angular.dev/ai/mcp
- Angular CLI MCP tools guide: https://medium.com/@amosisaila/angular-cli-20-2-meets-ai-the-complete-guide-to-mcp-integration-3df60f40fb74
- angular-i18n-mcp: https://glama.ai/mcp/servers/ffeldhaus/angular-i18n-mcp
- dalisys/i18n-mcp: https://github.com/dalisys/i18n-mcp
- Intlayer Angular comparison: https://intlayer.org/blog/i18n-technologies/frameworks/angular
- i18next TMS list: https://www.i18next.com/overview/translation-management-systems
- Cloudflare free-tier notes: [`docs/cloudflare-free-tier.md`](./cloudflare-free-tier.md)
