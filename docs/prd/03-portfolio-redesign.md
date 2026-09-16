# PRD 3 — Portfolio Redesign

**Label:** `ready-for-agent`
**Depends on:** PRD 1 (Design Foundations), PRD 2 (Shared Components)
**Source of truth:** [`.impeccable.md`](../../.impeccable.md)

## Problem Statement

The Portfolio page is the front door of the site, yet its current layout reads like a default Tailwind grid: equal-feeling tiles, tight gutters, no editorial pacing, no captions, and the photographs themselves are downsized to 50–60% of their native size before display. Image-config dimensions, Cloudinary URL building, and orientation mapping all live inline in `PortfolioComponent`, mixed with `Fancybox.bind` lifecycle, making the gallery hard to test and tedious to evolve. `NgOptimizedImage` is wired but the lightbox path is bypassing it. There is no keyboard story for opening images, no caption surface, and no graceful path for adding photo metadata when the AI blog lands.

## Solution

Rebuild the gallery as an editorial sequence inspired by Squarespace's Five and Hester templates: bigger imagery, intentional rhythm between landscape and portrait orientations, generous gutters, optional captions surfaced as first-class metadata, and a calm lightbox with keyboard support. Extract the URL building and orientation logic into a `PortfolioImageService` with a small, testable interface. Wrap Fancybox behind a `LightboxAdapter` so the dependency is swappable and accessibility behaviour can be enforced at the seam. Lazy-load the Portfolio route. The image data array stays in the component (or moves to a JSON file) — the deep modules are the URL builder and the lightbox adapter.

## User Stories

1. As a visitor, I want the gallery to feel like a curated sequence, not a grid of equal cards, so that I read the work the way the photographer intends.
2. As a visitor, I want photographs to display at a size that respects their detail (not 50% scaled) so that I can see the craft.
3. As a visitor, I want generous whitespace between images so that each photograph has room to breathe.
4. As a visitor, I want landscape and portrait images to compose intentionally on the page (not forced into a uniform grid) so that the layout reads cinematically.
5. As a visitor, I want optional captions under or beside images so that I know where and what I am looking at.
6. As a visitor, I want to tap or click any image to open it full-screen so that I can see the full frame.
7. As a keyboard user, I want to open the lightbox with Enter / Space on a focused thumbnail, navigate with arrow keys, and close with Escape so that I can browse without a mouse.
8. As a screen-reader user, I want each photograph to carry meaningful alt text so that the gallery is not a wall of "image".
9. As a visitor on a slow connection, I want the gallery thumbnails to load progressively (priority on the first images, lazy on the rest) so that the page becomes usable quickly.
10. As a visitor with `prefers-reduced-motion: reduce`, I want the lightbox open/close transition to be instant or near-instant so that I do not get motion-sick.
11. As a developer, I want a `PortfolioImageService` with a small, named interface (`urlFor(image, intent)`, `dimensionsFor(image, intent)`) so that I can compose galleries elsewhere or migrate off Cloudinary without rewriting templates.
12. As a developer, I want unit tests on `PortfolioImageService` so that the URL builder cannot drift silently when Cloudinary parameters change.
13. As a developer, I want a `LightboxAdapter` wrapping Fancybox so that I can swap to another library without touching the gallery component.
14. As the site owner, I want the Portfolio route lazy-loaded so that future routes (Blog, About) do not pay for Fancybox at first paint.
15. As the site owner, I want the gallery to expose room for a section title and a one-line intro at the top of the page so that the work is contextualised without a separate hero.

## Implementation Decisions

- **Layout.** Break out of the uniform grid. Suggested composition: a 12-column desktop grid where landscape images span 8 columns and portrait images span 4–6, alternating to create rhythm. On mobile, stack single-column with full-bleed images. Gutters at the larger end of the spacing scale (32–48px desktop, 16–24px mobile). Allow occasional full-bleed images that escape the centered container for cinematic moments. Exact column composition is a design judgement during implementation; the principle is **rhythm and breathing room**, not a fixed pattern.
- **Image sizing.** Drop the `displayWidth / displayHeight` reduction in `IMAGE_CONFIG`. Serve display URLs at intent-appropriate sizes using Cloudinary's responsive transformations (`w_auto`, DPR-aware) and let `NgOptimizedImage` handle `srcset`. The full-resolution URL is reserved for the lightbox.
- **`PortfolioImageService`.** Extract from `PortfolioComponent`. Interface:
  - `urlFor(image: PortfolioImage, intent: 'thumb' | 'display' | 'full'): string`
  - `dimensionsFor(image: PortfolioImage, intent): { width: number; height: number }`
  - `srcSetFor(image: PortfolioImage): string`
  Internal: holds the Cloudinary base URL, the orientation→size map, and the transform-string builder. No Angular dependencies beyond `@Injectable`. Pure functions wherever possible.
- **`PortfolioImage` model.** Extend the existing interface with optional `caption?: string` and `location?: string` (used by editorial captions). Existing entries keep working without these fields.
- **Image data source.** Keep `portfolioImages` as an exported `const` from a sibling file (e.g. a TypeScript constant inside the portfolio folder) — not a service — so that the component reads it directly. A JSON file is acceptable if the implementer prefers; both are equivalent for this small set.
- **`LightboxAdapter`.** A small Angular service that wraps `Fancybox`. Interface:
  - `bind(selector: string, options?: LightboxOptions): void`
  - `unbind(selector: string): void`
  Internally calls `Fancybox.bind` and `Fancybox.unbind`. The portfolio component calls `bind` in `ngAfterViewInit` and `unbind` in `ngOnDestroy`. The adapter is the only place that imports from `@fancyapps/ui`; if a swap is needed later, only this file changes.
- **Keyboard support.** Fancybox already supports arrow-key and Escape navigation once opened. Confirm thumbnails are focusable (`<a>` or `<button>` with `tabindex="0"`, not a bare `<div>`). Enter / Space on a focused thumbnail must trigger the lightbox open — Fancybox's anchor behaviour handles this if the trigger is an `<a href>`.
- **Lazy-load route.** Convert the Portfolio route to `loadComponent: () => import('./portfolio/portfolio.component').then(m => m.PortfolioComponent)` (the component is already standalone). Fancybox + the adapter live inside that chunk.
- **Section header.** Above the gallery, render a quiet `<h1>` page title (e.g. "Selected Work") and an optional one-line intro paragraph, both using `font-display` and the token palette. No hero image, no parallax.
- **Captions.** When `caption` is present, render below the image in `font-display` (or a smaller scale step) and `text-ink-muted`. If `location` is also present, separate with a thin dot.
- **`NgOptimizedImage` and Fancybox interplay.** `NgOptimizedImage` rewrites the `<img>` tag's `srcset`. Confirm Fancybox still picks up the `data-fancybox` attribute on the wrapping `<a href>` (it does; Fancybox binds on the anchor, not the img). Keep the wrapper anchor.

## Testing Decisions

- **A good test asserts external behaviour.** For the URL builder, that means: given an image record and an intent, the URL returned matches the Cloudinary contract (correct base, correct transform string, correct filename, correct extension hint). The test does **not** assert internal helper method names. The test does **not** mock Cloudinary — Cloudinary URLs are deterministic strings.
- **Modules to test in this PRD:**
  - `PortfolioImageService` (unit). Cases:
    - Landscape image, intent `thumb`, returns a URL with the thumb width/height transform.
    - Portrait image, intent `display`, returns a URL with the display width/height transform.
    - Any image, intent `full`, returns a URL with the original width/height transform.
    - `srcSetFor` returns a comma-separated set with at least two density steps.
    - `dimensionsFor` returns the expected `{ width, height }` for each orientation × intent combination.
- **Modules deliberately not tested in this PRD:** `LightboxAdapter` (thin wrapper; tested manually), `PortfolioComponent` (composition layer; manual visual + keyboard testing).
- **Prior art.** No existing service tests in the repo — establish the pattern with Angular's `TestBed.runInInjectionContext` or plain `new PortfolioImageService()` since the service has no DI inputs. Karma + Jasmine is the configured runner (`karma.conf.js`, `test.ts`).
- **Manual verification checklist:**
  - All twelve current images render in light and dark.
  - First two images load eagerly; remaining are lazy.
  - Clicking any thumbnail opens Fancybox; arrow keys navigate; Escape closes.
  - Tab through the gallery in DOM order with visible focus rings.
  - Lightbox transitions disabled (or instant) under `prefers-reduced-motion: reduce`.
  - Page initial JS chunk no longer contains Fancybox (verify via build output / source-map-explorer).

## Out of Scope

- Replacing `@fancyapps/ui` with another lightbox (the adapter exists to make this a future change, not this PRD).
- Migrating off Cloudinary or adding a second image host.
- Adding image categorisation, tags, or filtering UI.
- Adding image upload tooling.
- Adding EXIF data display (a candidate for a later iteration once the AI blog establishes the metadata pattern).
- Server-side rendering for SEO of individual photographs.

## Further Notes

- The current `IMAGE_CONFIG` uses inconsistent percentage labels ("60% of original" for landscape, "50% of original" for portrait) which suggests the size choice was an iterative compromise. The new sizing strategy delegates to Cloudinary responsive transforms — the implementer should pick three intent sizes (thumb ≈ 400px wide, display ≈ 1200px wide, full = native) and let `srcset` resolve actual delivered pixels.
- Image alt text in the current array is short and descriptive ("Penang turf club", "Chinese calligraphy"). Keep that voice; add optional `caption` for any image that deserves a sentence-long story.
- The lightbox open animation in Fancybox v5 defaults are acceptable; do not customise unless the existing fade is visibly contradicting the calm intent.
