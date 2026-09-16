# PRD 6 — Accessibility, Motion, SEO, Cleanup

**Label:** `ready-for-agent`
**Depends on:** PRDs 1–5
**Source of truth:** [`.impeccable.md`](../../.impeccable.md)

## Problem Statement

By the time PRDs 1–5 ship, the site is visually and structurally redesigned, but accessibility, motion behaviour, SEO metadata, and dead-code cleanup will have been touched piecemeal across many merges. Without a final unified pass, drift will accumulate: a focus ring missing on one button, a `prefers-reduced-motion` check forgotten on one route, a `<title>` element still reading "Chong Wei Khang" globally, a `BrowserAnimationsModule` import still loaded for no consumer, an inline SVG hiding in a forgotten template. A single focused PRD closes those gaps.

## Solution

Run a structured audit across the whole site: WCAG 2.2 AA conformance for contrast, focus, keyboard, semantics, and alt text; `prefers-reduced-motion` coverage on every animated surface; per-route `<title>` and meta description; OpenGraph and Twitter card metadata; favicon and brand-mark review; and removal of any dependency, import, or markup left over from the legacy design.

## User Stories

1. As a user relying on a screen reader, I want every page to expose a clear hierarchy of landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) and headings so that I can navigate quickly.
2. As a keyboard user, I want a visible focus ring (drawn from the focus-ring token) on every interactive element across every page so that I always know where my focus is.
3. As a user with low vision, I want every surface to meet WCAG 2.2 AA contrast (4.5:1 body, 3:1 large text) in both light and dark mode so that I can read without strain.
4. As a user, I want all images to have meaningful alt text (or `alt=""` for purely decorative images) so that the gallery and post heroes are not noise to a screen reader.
5. As a user with motion sensitivity, I want `prefers-reduced-motion: reduce` honoured on every transition (lightbox open, mobile menu toggle, link hover, route fade) so that the site does not trigger discomfort.
6. As a user landing on a non-home route from a shared link, I want the browser tab title to reflect the page (e.g. "About — Chong Wei Khang", "Blog — Chong Wei Khang", post title for blog detail) so that I know where I am.
7. As someone sharing a page on social media, I want each route to expose OpenGraph and Twitter card metadata (title, description, hero image) so that the preview is meaningful.
8. As a search engine indexing the site, I want a `<meta name="description">` per route so that the result snippet is accurate.
9. As a developer, I want all references to the retired Material Icons font, MUI library, and blue→purple gradient brand to be gone from the codebase so that the legacy design cannot resurface accidentally.
10. As a developer, I want any unused Angular Material module imports (e.g. `BrowserAnimationsModule` if no animation consumer remains) to be removed so that the bundle stays lean.
11. As a developer running `npm run build`, I want the production bundle audited for size with a clear baseline recorded so that regressions are visible in future PRs.
12. As the site owner, I want a small `robots.txt` and a `sitemap.xml` (static, generated at build time) so that search engines can crawl the new blog routes.

## Implementation Decisions

- **A11y audit.** Run a tool-assisted pass (axe DevTools, Lighthouse, or `@axe-core/cli`) plus a manual checklist. Capture findings in the PR description with severity. Fix everything at AA or above; document anything intentionally left at AAA-noncompliance.
- **Focus rings.** A single token-driven focus style applied via a global utility (`:focus-visible` outline using `--focus-ring`). Audit every interactive element across Topbar, Footer, Portfolio gallery, About, Contact, BlogList, BlogPost.
- **Reduced-motion strategy.** Wrap every CSS transition or animation in a `@media (prefers-reduced-motion: no-preference)` guard, or use the inverse `@media (prefers-reduced-motion: reduce) { * { transition: none !important; … } }` sweep as a defensive backstop. Confirm the lightbox, mobile menu, route transitions (if any), and link hovers all degrade gracefully.
- **Alt text audit.** Walk the Portfolio data array — every alt is present today; confirm each is meaningful (not just a filename). Walk blog post hero images — frontmatter should require an `alt` field if `hero` is set; add that as a renderer-level validation.
- **Per-route titles.** Implement a small `TitleService` (or use Angular's built-in `Title` service) hooked into router events. Map each route to a title template: `Portfolio` → "Chong Wei Khang", `/about` → "About — Chong Wei Khang", `/contact` → "Contact — Chong Wei Khang", `/blog` → "Blog — Chong Wei Khang", `/blog/:slug` → `"${post.title} — Chong Wei Khang"`.
- **Meta description.** Same approach: per-route descriptions injected into `<meta name="description">`. Blog posts use the frontmatter `excerpt`.
- **OpenGraph + Twitter cards.** Set `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, plus `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. Per-route. For the home / portfolio route, choose a representative photograph; for the blog index, the most recent post's hero; for a blog post, that post's hero.
- **robots.txt and sitemap.xml.** Static files in `src/`. The sitemap is generated at build time (the same prebuild script that builds the blog manifest can emit `sitemap.xml`). Include `/`, `/about`, `/contact`, `/blog`, `/blog/:slug` for every non-draft post.
- **Dead-code sweep.** Grep the repo for: `from-blue`, `to-purple`, `bg-gradient`, `material-icons`, `@mui/material`, `Roboto`, `mat-toolbar` (if dropped in PRD 2), inline `<svg>` icons outside the `IconComponent`, `BrowserAnimationsModule` (verify still needed), `MatButtonModule` (verify still needed). Remove anything orphaned.
- **Dependency audit.** Re-run `npm ls` and remove any package no longer imported (`@mui/material` removed in PRD 1; check `@angular/material-experimental`, `@fancyapps/ui` if PRD 3 swapped the lightbox — it did not in this scope).
- **Bundle baseline.** Run `npm run build -- --stats-json` (or the Rspack equivalent) and record initial chunk size, lazy chunk sizes, font payload, image payload. Attach the numbers to the PR. No size budget enforced yet; future PRs can compare.
- **Brand mark and favicon.** Keep the current SVG-data-URI camera favicon for now. Revisit only if the brand-mark question is reopened (out of scope here).

## Testing Decisions

- **No new unit tests in this PRD.** The work is audit, configuration, and removal. Existing tests from PRDs 3 and 5 must continue to pass.
- **Tool-assisted audits.** Capture output in the PR:
  - Lighthouse a11y score = 100 on Portfolio, About, Contact, BlogList, BlogPost.
  - axe DevTools "0 issues" on the same routes in both light and dark.
  - WAVE check on the same routes.
- **Manual verification checklist:**
  - Tab through every page from top to bottom; every focusable element has a visible focus ring.
  - Reverse-tab through every page; order remains sensible.
  - Run NVDA (Windows) or VoiceOver (macOS) on each page; landmarks and headings are announced correctly.
  - Toggle `prefers-reduced-motion: reduce` and confirm transitions are suppressed everywhere (lightbox, mobile menu, link hover, theme toggle).
  - Inspect each route's `<head>`; title and meta description match the route.
  - Share each route to a social preview tool (e.g. opengraph.xyz) and confirm the preview renders.
  - `npm ls @mui/material` returns nothing.
  - `grep -ri "material-icons" src/` returns nothing.
  - `grep -ri "from-blue\|to-purple\|bg-gradient-to-r" src/` returns nothing.
  - `robots.txt` and `sitemap.xml` are present in the build output.

## Out of Scope

- Server-side rendering with Angular Universal (revisit if blog SEO underperforms).
- Image CDN migration off Cloudinary.
- A11y conformance to AAA across the site (AA is the target).
- Performance budgets enforced in CI (capture the baseline first; enforce later if it matters).
- Internationalisation.
- Cookie banner / privacy notice (the site sets no tracking cookies).
- Brand-mark redesign or logo wordmark refresh.

## Further Notes

- The `tailwind.config.js` change from `'media'` to `'class'` in PRD 1 should already be in place; confirm.
- Vercel deploy is already configured (`vercel.json`); the static `sitemap.xml` and `robots.txt` will be served from `dist/` automatically.
- If a future PRD adds RSS for the blog, it can extend the same prebuild script used for the manifest and sitemap.
