# PRD 5 — AI Blog Feature

**Label:** `ready-for-agent`
**Depends on:** PRD 1 (Design Foundations), PRD 2 (Shared Components)
**Source of truth:** [`.impeccable.md`](../../.impeccable.md)

## Problem Statement

The site is currently a single-purpose photography portfolio. The owner now wants to publish writing on AI — agent build logs, tutorials, and opinion essays — without spinning up a separate site, without adopting a CMS, and without forking the visual language. There is no content pipeline, no markdown rendering, no syntax highlighting, no route for a post list or a post detail, and no metadata story for things like reading time, tags, or publish date. The blog has to look and feel like an editorial extension of the photography site (one unified design system, not two sub-brands) while earning a quietly technical voice through monospace and dense metadata.

## Solution

Add a `/blog` route backed by local markdown files in `src/content/posts/`. Build two deep modules behind small interfaces: `MarkdownRenderer` (pure: parses frontmatter, renders markdown to safe HTML, applies syntax highlighting) and `BlogContentService` (lists posts, fetches by slug, sorts by date, exposes derived metadata like reading time). Render two pages: a `BlogListComponent` (index) and a `BlogPostComponent` (detail with table of contents, reading time, formatted code blocks). Generate a static JSON manifest of posts at build time so the runtime never reads the filesystem. Lazy-load the whole blog module.

## User Stories

1. As the site owner, I want to publish a new blog post by dropping a `.md` file into `src/content/posts/` and committing it, so that publishing has no out-of-repo dependency.
2. As the site owner, I want each post to carry frontmatter (title, slug, date, excerpt, tags, optional hero image) so that I do not have to encode metadata inline in the prose.
3. As the site owner, I want posts sorted newest-first on the index so that fresh writing is found first.
4. As a visitor browsing `/blog`, I want to see a list of posts with title, date, excerpt, and tags so that I can decide what to read.
5. As a visitor on `/blog`, I want the list to feel editorial (generous spacing, restrained type, no cards or shadows) so that the writing has the same calm as the photography.
6. As a visitor opening a post at `/blog/:slug`, I want the title, date, reading-time estimate, and tags above the body so that I know what I am about to read.
7. As a visitor reading a post, I want body text at a comfortable measure (60–72ch) and a clear typographic hierarchy for headings, lists, blockquotes, and inline code so that long-form is easy to read.
8. As a visitor reading a technical post, I want code blocks rendered in the monospace family with syntax highlighting that respects light and dark mode so that examples are legible in both themes.
9. As a visitor on a longer post, I want a sticky table of contents on desktop (collapses on mobile) so that I can jump between sections.
10. As a visitor, I want inline links inside posts to use the accent token (no underline-everywhere) and external links to render with the small external-link icon from the icon component, so that links are visible without being noisy.
11. As a visitor sharing a post, I want the URL to be the slug-based path (`/blog/:slug`) so that links are clean and stable.
12. As a visitor on mobile, I want the blog to be a one-column read with the same spacing rhythm as the photo gallery so that the site feels of-a-piece.
13. As a visitor with `prefers-reduced-motion: reduce`, I want any post-open or scroll-driven motion disabled so that reading is comfortable.
14. As a visitor with a screen reader, I want post headings to be real `<h2>` / `<h3>` so that I can navigate by headings.
15. As a developer, I want `BlogContentService` to expose a small interface (`list()`, `getBySlug(slug)`, `tagsOf(post)`, `readingTime(post)`) so that I can compose new surfaces (RSS, tag pages) without rewriting parsing logic.
16. As a developer, I want unit tests on `BlogContentService` (list ordering, slug lookup, missing-slug handling) and `MarkdownRenderer` (frontmatter parsing, headings, code blocks, link rewriting) so that content rendering does not silently break when a new post lands.
17. As a developer, I want `MarkdownRenderer` to sanitize HTML (no script injection from a markdown file the owner happens to commit) so that the parser is safe by default.
18. As the site owner, I want the blog module lazy-loaded so that visitors who never click "Blog" do not pay for the markdown parser or the syntax highlighter.
19. As the site owner, I want the index page to be reachable from the Topbar nav and the Footer so that the AI blog is discoverable.
20. As the site owner, I want the blog index to handle the empty state gracefully (a quiet message rather than a blank list) so that the page is presentable even before the first post lands.

## Implementation Decisions

- **Content location.** `src/content/posts/*.md`, one file per post. Filename can be `YYYY-MM-DD-slug.md` for human ordering, but the `slug` and `date` fields in frontmatter are authoritative; the filename has no runtime meaning.
- **Frontmatter shape.** YAML, with these fields: `title` (required), `slug` (required, kebab-case), `date` (required, ISO `YYYY-MM-DD`), `excerpt` (required, ~140 chars), `tags` (optional string array), `hero` (optional image URL — Cloudinary or local asset), `draft` (optional boolean; drafts skipped at build time). Validation runs at build time and fails loudly on a missing required field.
- **Build-time manifest.** A small Node script (or a custom Angular CLI builder) reads all markdown files at build time, parses frontmatter and body, and emits a single JSON manifest at `src/assets/blog/manifest.json` plus per-post HTML at `src/assets/blog/posts/:slug.json`. The runtime fetches the manifest once and the per-post JSON on demand. No fs access at runtime; no SSR required. Choose between an `npm` prebuild script and a Vite/Rspack plugin during implementation — the simpler option is the prebuild script.
- **`MarkdownRenderer`.** A pure utility class (no Angular DI). Interface:
  - `parse(rawMarkdown: string): { frontmatter: PostFrontmatter; html: string }`
  Internally uses `marked` (small, fast) or `markdown-it` (more extensible). Frontmatter parsing via `gray-matter` (or a hand-rolled parser if the dependency cost is unwelcome). HTML sanitisation via `DOMPurify` or `sanitize-html` to strip `<script>`, `on*` handlers, and `javascript:` URLs. Syntax highlighting via `shiki` (preferred — themeable, no JS at runtime if pre-rendered) or `prismjs` (smaller, runtime). If `shiki` is used, highlighting happens at build time and the manifest contains pre-highlighted HTML.
- **`BlogContentService`.** Angular injectable. Interface:
  - `list(): Observable<PostSummary[]>` — returns posts sorted by date desc, excludes drafts.
  - `getBySlug(slug: string): Observable<Post>` — returns the full post or throws `PostNotFoundError`.
  - `tagsOf(post: Post | PostSummary): string[]` — convenience accessor (defensive copy).
  - `readingTime(post: Post): number` — words / 200, rounded.
  Internally fetches `assets/blog/manifest.json` once (cached), and `assets/blog/posts/:slug.json` per detail view.
- **`PostSummary` vs `Post`.** Summary = frontmatter only (used by the list); full `Post` adds `html`. The list page never loads body HTML; only the detail page does. Keeps the index lightweight.
- **Routing.** Add a lazy-loaded `BlogModule` (or standalone routes file): `/blog` → `BlogListComponent`, `/blog/:slug` → `BlogPostComponent`, unknown slug → redirect to `/blog`. Update the wildcard route in `app-routing.module.ts` if needed.
- **`BlogListComponent`.** Editorial layout: page title, optional short intro, then a vertical list of post entries — each is title (large, `font-display`), date + reading time + tags (small, mono, `text-ink-muted`), excerpt (one paragraph), and a "Read →" link. Generous spacing between entries. No cards, no borders unless restrained dividers earn their place.
- **`BlogPostComponent`.** Editorial article layout: title block (title, date, reading time, tags) above the body, body in a centered ≈ 65ch column, optional hero image full-bleed above the title block. Sticky TOC on the right at viewport widths ≥ lg; collapses to an in-flow disclosure at smaller widths. TOC built from `<h2>` and `<h3>` IDs added by the renderer.
- **Code blocks.** Rendered in `font-mono` at a slightly smaller size, with a soft surface background (`bg-surface-raised`), generous padding, no line numbers unless requested. Inline code uses the same font with subtle background. Light-mode and dark-mode syntax themes are both shipped.
- **External link rendering.** The renderer rewrites `<a href>` to add `target="_blank" rel="noopener noreferrer"` and append a small `<app-icon name="arrow-up-right">` for any link whose host differs from the site's. Internal links stay clean.
- **Empty state.** When `list()` returns zero posts, render a single line: "Writing soon."
- **Topbar + Footer.** Topbar nav gains a BLOG link (already placeholder-stubbed in PRD 2). Footer gains a quiet link in the same row as the other nav anchors.

## Testing Decisions

- **A good test asserts external behaviour.** For `MarkdownRenderer`, that means: feed in a markdown string, assert that the returned `html` contains the expected elements and that the returned `frontmatter` is the parsed object. Do not assert on the internal AST of the markdown library; do not snapshot full HTML strings (brittle). For `BlogContentService`, that means: stub the manifest fetch, then assert that `list()` returns posts in date-desc order and `getBySlug` returns the matching post or throws.
- **Modules to test in this PRD:**
  - `MarkdownRenderer` (unit). Cases:
    - Parses frontmatter into the expected `{ title, slug, date, excerpt, tags }` shape.
    - Throws or returns an error on missing required frontmatter fields.
    - Renders `## Heading` as an `<h2>` with a slugified `id`.
    - Renders fenced code blocks with the configured highlighter and a language class.
    - Strips `<script>` and `on*` attributes from author HTML embedded in markdown.
    - Rewrites external `<a>` to `target="_blank" rel="noopener noreferrer"`.
    - Leaves internal `<a href="/...">` untouched.
  - `BlogContentService` (unit). Cases:
    - `list()` returns posts sorted by `date` descending.
    - `list()` excludes posts with `draft: true`.
    - `getBySlug(existingSlug)` returns the matching post.
    - `getBySlug(missingSlug)` rejects with `PostNotFoundError`.
    - `readingTime(post)` rounds correctly at the 200-words-per-minute boundary.
    - `tagsOf(post)` returns a defensive copy (mutating the result does not mutate the post).
- **Modules deliberately not tested in this PRD:** `BlogListComponent` and `BlogPostComponent` (composition layers; visual + keyboard testing manual).
- **Prior art.** Karma + Jasmine remain the test runner. `MarkdownRenderer` is testable as a plain class via `new MarkdownRenderer()`. `BlogContentService` uses `HttpClientTestingModule` (or a direct stub for the manifest fetch). Establish a `src/content/posts/__fixtures__/` directory with one representative markdown file used by both renderer and service tests so the fixture stays the source of truth for parsing assumptions.
- **Manual verification checklist:**
  - Drop a sample post `2026-05-24-hello-world.md` into `src/content/posts/`, run the build, and confirm it appears at `/blog` and renders at `/blog/hello-world`.
  - A draft post does not appear in the list.
  - Code blocks render in both light and dark mode legibly.
  - Sticky TOC follows scroll on desktop, collapses on mobile.
  - Empty-state copy renders when no non-draft posts exist.
  - The blog chunk is lazy-loaded (verify via build output).
  - Topbar BLOG link is active when on `/blog` or `/blog/*`.

## Out of Scope

- A CMS, an admin UI, or any non-markdown publishing path.
- Comments on posts.
- Newsletter signup or email subscription.
- RSS feed generation (a strong candidate for a follow-up; the `BlogContentService` interface is designed to make it trivial later).
- Per-tag landing pages (`/blog/tags/:tag`).
- Search across posts (revisit once there are >10 posts).
- Server-side rendering of posts for SEO (use Angular static prerender served as Cloudflare Workers static assets as a follow-up if SEO becomes important).
- Multi-author byline support — single author (the site owner) is assumed.
- Markdown extensions like footnotes, math, mermaid diagrams (add when a post demands them).

## Further Notes

- The `MarkdownRenderer` interface is the seam between the content format and the rest of the app. Keep it ruthlessly small. If a future PRD needs to support MDX (markdown with embedded components), it can introduce a sibling `MdxRenderer` with the same interface shape; consumers should not have to learn a new contract.
- Reading time at 200 wpm is a convention, not science. Do not expose a configuration knob until a real reason emerges.
- The blog tone (calm, considered) extends to the page chrome — resist adding social-share buttons, "claps", or engagement widgets.
- Cloudinary already hosts photography assets and can host blog hero images at no marginal cost.
