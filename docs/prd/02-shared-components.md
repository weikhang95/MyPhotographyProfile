# PRD 2 — Shared Components

**Label:** `ready-for-agent`
**Depends on:** PRD 1 (Design Foundations)
**Source of truth:** [`.impeccable.md`](../../.impeccable.md)

## Problem Statement

The current Topbar and Footer carry the legacy design: inline SVG icons hand-pasted per social link, a hamburger menu drawn from ad-hoc SVG paths, a `mat-toolbar` chrome that does not earn its weight, hover effects that rotate and scale (`hover:scale-110 hover:rotate-6`) that contradict the "calm, cinematic" personality, and a blue→purple gradient brand wordmark in the footer (`bg-gradient-to-r from-blue-500 to-purple-600`). The theme toggle is an inline SVG with no accessible label. Each later PRD will need to drop icons and chrome into pages, and right now there is no shared icon component or restrained primitive to reach for.

## Solution

Build the shared component layer that every later PRD consumes: a single `IconComponent` over Phosphor, a refactored Topbar with restrained navigation and an accessible theme toggle, a redesigned Footer with the gradient brand removed and the socials routed through the icon component, and lightweight button/link primitives that consume the design tokens from PRD 1. After this merge, no page contains an inline social SVG or a Material Icons class name, and the design language is finally visible on the page chrome.

## User Stories

1. As a developer, I want a single `<app-icon name="…" weight="…" size="…">` component so that I never paste an inline SVG into a template again.
2. As a developer, I want the icon component to be tree-shake friendly so that unused Phosphor icons never ship to the browser.
3. As a developer, I want documented icon weights (`regular`, `bold`, `duotone`) so that I match the design intent without reading the source.
4. As a visitor, I want the Topbar to feel calm and uncluttered so that the photographs are not competing with chrome on first paint.
5. As a visitor on desktop, I want the Topbar to scroll naturally with the page (not stick aggressively) so that the gallery has full focus.
6. As a visitor on mobile, I want a mobile menu that opens cleanly and closes with a tap outside or the Escape key so that I am not trapped inside it.
7. As a keyboard user, I want full tab access to Topbar links, the mobile menu toggle, and the theme toggle, with visible focus rings so that I can navigate without a mouse.
8. As a screen-reader user, I want every icon-only button to have an accessible label so that I know what the control does.
9. As a visitor switching themes, I want the toggle to indicate current state (sun for light is active, moon for dark is active) without ambiguity.
10. As a visitor, I want the Topbar wordmark "WEI KHANG" to feel like a signature, not a logo competing with the imagery.
11. As a visitor reading the Footer, I want the name "CHONG WEI KHANG" rendered in the token palette (no gradient) so that it sits inside the editorial system.
12. As a visitor, I want the social links in the Footer to look like quiet directional cues, not buttons demanding clicks.
13. As a visitor hovering a social link, I want a single restrained interaction (colour shift to the accent token, no rotation, no scale jump) so that motion stays calm.
14. As a developer building the AI blog or the portfolio gallery, I want a small `<app-button>` and `<app-link>` primitive so that I do not re-style buttons inline on every page.
15. As a developer, I want the `mat-toolbar` removed or visibly justified so that the chrome carries no unused Material defaults.

## Implementation Decisions

- **`IconComponent`.** A standalone Angular component with three inputs: `name` (Phosphor icon name, e.g. `'camera'`, `'sun'`, `'moon'`, `'list'`, `'x'`, `'instagram-logo'`, `'linkedin-logo'`, `'github-logo'`), `weight` (`'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'`, defaulting to `'regular'`), and `size` (number in px or a token name `'sm' | 'md' | 'lg'`). Renders an inline `<svg>` directly. Implementation can use `@phosphor-icons/core` SVG data tree-shaken per-icon, or per-icon SVG imports — pick the approach that keeps the bundle smallest. Expose `aria-hidden="true"` by default; require `aria-label` callers when the icon is the only content.
- **Topbar refactor.** Replace inline hamburger SVG with `<app-icon name="list">` / `<app-icon name="x">`. Replace theme-toggle SVGs with `<app-icon name="sun">` / `<app-icon name="moon">` plus an `aria-label` that reads "Switch to dark mode" / "Switch to light mode". Replace `mat-toolbar` with a plain semantic `<header><nav>…</nav></header>` unless a Material behaviour is being used (it is not — current usage is layout-only). Drop `MatToolbarModule` import if no other page needs it.
- **Topbar nav items.** Update to four items: PORTFOLIO, BLOG (placeholder, points to `/blog` even though that route lands in PRD 5), ABOUT, CONTACT. Comment-out lines that hid CONTACT should be removed if Contact is back in scope; if Contact stays hidden, drop the route stub too (defer to PRD 4).
- **Mobile menu.** Close on outside click, on Escape key, on route change. No transform/scale flourish. Plain fade or vertical slide bounded by `prefers-reduced-motion`.
- **Footer redesign.** Remove the `bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent` from the wordmark — render in `text-ink` with the display family. Replace the four hand-pasted social SVGs with `<app-icon>` instances (`instagram-logo`, `facebook-logo`, `linkedin-logo`; Unsplash has no Phosphor icon — use a small bundled SVG asset or fallback to a text link, pick during implementation). Drop the `transform hover:scale-110 hover:rotate-6` flourishes; hover state is `text-accent` only, with a `transition-colors` on the base duration token. Add an `<a>` for the new Blog section. Add an email address using `<app-icon name="envelope">` if Contact is reachable that way.
- **`<app-button>` primitive.** A standalone component with `variant` (`'primary' | 'ghost' | 'link'`), `size` (`'sm' | 'md' | 'lg'`), `as` (`'button' | 'a'`), and content projection. Styled via token utilities only. No Material wrapper.
- **`<app-link>` primitive.** Inline text-link styling that defaults to underlined-on-hover with `text-accent` colour, optional `external` flag to add `target="_blank"` and `rel="noreferrer"` plus a small north-east arrow icon.
- **Drop `MatButtonModule`** from `app.module.ts` if no consumer remains after the Topbar refactor. Keep `BrowserAnimationsModule` until a downstream PRD confirms no animation depends on it.

## Testing Decisions

- **No new unit tests in this PRD.** All work is presentational. Behaviour-rich modules (`PortfolioImageService`, `BlogContentService`, `MarkdownRenderer`) arrive in PRDs 3 and 5, where tests are scoped.
- **Manual verification checklist:**
  - Topbar renders in light and dark with the new tokens.
  - Mobile menu opens, closes on outside click, closes on Escape, closes on route change.
  - Theme toggle announces its target state to screen readers (`aria-label` content visible to AT).
  - All Topbar and Footer interactive elements are reachable by Tab, in a logical order, with a visible focus ring drawn from the focus-ring token.
  - Network panel shows no Material Icons font requests.
  - Inline social SVGs no longer appear in `app.component.html`.
  - Footer wordmark renders in `text-ink`, no gradient.
  - Hover on any social link triggers only a colour transition; no rotation, no scaling.
  - `prefers-reduced-motion: reduce` disables the mobile menu transition and the link hover transitions.
- **Visual regression.** Take before/after screenshots of light Topbar, dark Topbar, light Footer, dark Footer, and mobile menu open, and attach to the PR. No screenshot library required.

## Out of Scope

- Building the blog route or any blog UI (PRD 5).
- Redesigning the Portfolio page beyond the chrome touching its margins (PRD 3).
- Redesigning the About or Contact pages (PRD 4).
- Removing `BrowserAnimationsModule` (deferred until PRD 6 cleanup confirms no consumer).
- Replacing the `@fancyapps/ui` lightbox (PRD 3).

## Further Notes

- The Unsplash icon gap is real — Phosphor does not ship an Unsplash brand mark. Options: ship one SVG asset in `src/assets/icons/unsplash.svg` and render it through the same `<app-icon>` component via a fallback path, drop the Unsplash link to a text-only "Unsplash" link, or omit Unsplash from the redesigned Footer. The text-only option matches the editorial restraint best.
- `mat-toolbar` removal will shrink the Material surface to `MatButtonModule` only (if even that stays). PRD 6 can decide whether Angular Material is still earning its weight or can be dropped entirely.
- Keep the favicon SVG (`<link rel="icon" href="data:image/svg+xml,…">`) as is until the brand mark is reconsidered; a brand-mark redesign is not in scope for any of these PRDs.
