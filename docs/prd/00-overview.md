# PRD Overview — Portfolio Redesign + AI Blog

Six staged redesign PRDs, plus a parallel backend track (PRD 7), that take the site from its current state (gradient brand, Material Icons font, MUI duplicate, single-purpose photo portfolio) to its target state (warm-neutral editorial palette, Phosphor icons, photography portfolio plus AI blog under one unified design system).

**Source of truth for design intent:** [`.impeccable.md`](../../.impeccable.md). The five design principles there override taste arguments anywhere in these PRDs.

**Status label vocabulary:** `ready-for-agent` once a PRD is approved and unblocked. Merge stages strictly in order — later PRDs depend on tokens and shared components established earlier.

| # | PRD | Depends on | Ship size | Status (2026-09-16) |
| - | --- | ---------- | --------- | ------------------- |
| 1 | [Design Foundations](./01-design-foundations.md) | — | Medium | Mostly done (tokens on Tailwind 4, Roboto + Material Icons font removed, Phosphor installed); `mat-icon` usages remain for PRD 2 |
| 2 | [Shared Components](./02-shared-components.md) | 1 | Medium | Not started (CONTACT nav link done) |
| 3 | [Portfolio Redesign](./03-portfolio-redesign.md) | 1, 2 | Medium | Not started |
| 4 | [About + Contact Polish](./04-about-contact-polish.md) | 1, 2 | Small | Not started; revised to keep enquiry form |
| 5 | [AI Blog Feature](./05-ai-blog-feature.md) | 1, 2 | Large | Not started |
| 6 | [A11y, Motion, SEO, Cleanup](./06-a11y-motion-seo-cleanup.md) | 1–5 | Medium | Focus ring done; rest not started |
| 7 | [Backend on Cloudflare](./07-backend-cloudflare.md) | — (parallel track) | Ongoing | Phase A shipped; B–D planned |

PRD 7 is a parallel learning track and does not block PRDs 2–6. Hosting is Cloudflare Workers (static assets + `/api/*` Worker + D1); see [`docs/cloudflare-free-tier.md`](../cloudflare-free-tier.md).

## Deep modules introduced across these PRDs

| Module | PRD | Tested? |
| ------ | --- | ------- |
| `ThemeService` | exists; touched in 1 | No (not in scope) |
| Design tokens (CSS vars + Tailwind theme) | 1 | No (static surface) |
| `IconComponent` (Phosphor wrapper) | 2 | No |
| `PortfolioImageService` | 3 | **Yes** |
| `LightboxAdapter` | 3 | No |
| `BlogContentService` | 5 | **Yes** |
| `MarkdownRenderer` | 5 | **Yes** |
| Worker API (`worker/`: enquiries, admin auth) | 7 | Planned (Phase B) |
| `AdminApiService`, `adminGuard` | 7 | Contact form tested; admin not yet |

## What is not in any of these PRDs

- Migration to standalone components / signals across the whole app (a few components are already standalone; full migration is deferred).
- CMS-backed blog content (markdown in repo is the chosen source).
- Multi-language support (English only).
- Server-side rendering / Angular Universal.
- Backend features beyond PRD 7.
- E-commerce or booking flows.
