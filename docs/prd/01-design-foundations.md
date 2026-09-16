# PRD 1 — Design Foundations

**Label:** `ready-for-agent`
**Depends on:** —
**Source of truth:** [`.impeccable.md`](../../.impeccable.md)

## Problem Statement

As the owner of the site, I want a single coherent design language across photography and the (upcoming) AI blog, but the current codebase has none. Colors are inline Tailwind utilities (`bg-white`, `dark:bg-neutral-900`, `from-blue-500 to-purple-600`), the brand gradient contradicts the editorial direction, three font families are loaded but only one is used meaningfully, two icon systems are linked (Material Icons font plus ad-hoc inline SVGs), and two competing UI libraries are installed (`@angular/material` and `@mui/material`). Without a token layer and a consistent icon and type system, every subsequent redesign decision has to be re-litigated, and the blog feature will inherit the same drift.

## Solution

Establish the design foundation in one merge: a token surface (CSS custom properties extended via the Tailwind theme), a finalised type system (Signika + monospace, Roboto and Material Icons font removed), and a single Phosphor-based icon path. Drop the MUI dependency. Make no page-level visual changes yet — that is PRD 2 and onward. After this merge, every later PRD references tokens by name, not raw hex or `text-blue-500`.

## User Stories

1. As the site owner, I want a single named palette of warm neutrals so that I never have to pick a hex value mid-implementation.
2. As the site owner, I want light and dark modes to read from the same token names so that adding a new component does not require dual hex lookups.
3. As the site owner, I want a fixed modular type scale so that headings and body sizes stay coherent across pages.
4. As the site owner, I want Signika kept as the primary family and Roboto dropped so that font loading is leaner and the editorial intent is honoured.
5. As the site owner, I want a monospace family available so that the blog can render code blocks and metadata in PRD 5 without a follow-up font wiring task.
6. As the site owner, I want Nothing You Could Do retained but unused by default so that it stays available for the single signature moment without leaking into normal copy.
7. As the site owner, I want Phosphor Icons installed and wired so that every later PRD has one canonical icon source.
8. As the site owner, I want the Material Icons font link removed so that the page does not pay the cost of a font I no longer use.
9. As the site owner, I want `@mui/material` removed from `package.json` so that there is no ambiguity over which UI library this project uses.
10. As a developer working on this repo, I want a documented token list so that I can resist the urge to hand-pick a colour mid-task.
11. As a developer, I want Tailwind utilities to expose the new tokens (`bg-surface`, `text-ink`, `text-accent`, `font-display`, `font-mono`) so that I can compose in HTML without reaching for raw CSS.
12. As a visitor with `prefers-color-scheme: dark`, I want the site to honour my preference on first load so that I do not see a flash of light theme.
13. As a visitor with a saved theme preference, I want my choice persisted across sessions so that the site remembers me.
14. As a visitor on a low-bandwidth connection, I want only the fonts that are actually used to be requested so that first paint is faster.

## Implementation Decisions

- **Token surface.** Introduce CSS custom properties on `:root` and on `.dark` for the warm-neutral palette and a small set of structural tokens: surface, surface-raised, ink (high contrast text), ink-muted, accent, focus-ring, border, shadow. Suggested values from `.impeccable.md` (`#FBF9F4` / `#1B1A17` / `#121110` / `#E8E4DC` plus a sand/clay accent) are starting points; refine during implementation against AA contrast checks.
- **Tailwind theme.** Extend `tailwind.config.js` `theme.extend.colors` with semantic names (`surface`, `ink`, `accent`, etc.) sourced from the CSS variables. Extend `fontFamily.display` (Signika), `fontFamily.script` (Nothing You Could Do, used sparingly), `fontFamily.mono` (system mono stack: `ui-monospace, SFMono-Regular, …`, or JetBrains Mono / IBM Plex Mono if a webfont is added). Extend `fontSize` with a 6-step modular scale on a 1.2 or 1.25 ratio. Extend `spacing` on the existing 4/8px grid (no change needed if Tailwind defaults align). Extend `borderRadius` with `sm`, `md` (default), `lg`. Extend `transitionDuration` and `transitionTimingFunction` with `slow` / `base` / `fast` named values matching the cinematic intent.
- **Dark-mode switch strategy.** Tailwind config is currently `darkMode: 'media'`; switch to `darkMode: 'class'` so the `ThemeService`'s `.dark` class toggle drives Tailwind utilities as well. Confirm `ThemeService` already toggles `documentElement.classList.toggle('dark', isDarkMode)` — it does — and adjust the existing body class names accordingly.
- **Font loading.** Remove the Roboto `<link>` from `src/index.html`. Remove the Material Icons font `<link>` from `src/index.html`. Keep the Signika and Nothing You Could Do links. If a webfont monospace is chosen, add a single self-hosted or Google Fonts link with `display=swap`.
- **Phosphor install.** Choose between `@phosphor-icons/web` (CSS class-based, smaller install footprint) and `@phosphor-icons/core` (SVG data, lets us tree-shake per-icon). Prefer per-icon SVG imports via a small custom Angular component (built in PRD 2) so unused icons never ship. Install the package only; do not build the component yet.
- **Drop MUI.** Remove `@mui/material` from `package.json` dependencies and from `package-lock.json`. Grep the repo first to confirm zero imports (likely the case based on current scan).
- **No page-level visual changes.** Existing pages will keep using their current inline Tailwind classes after this PRD. PRD 2 onward replaces those with token-aware utilities. This is intentional to keep the diff reviewable.
- **CLAUDE / AGENTS context.** Tokens, font choices, icon system, and the MUI removal are all already captured in `.impeccable.md` and `AGENTS.md`. Do not duplicate those docs; reference them.

## Testing Decisions

- **No new unit tests in this PRD.** The change is a static token surface plus dependency cleanup. There is no behavioural module to assert against.
- **Manual verification checklist (record in the PR description):**
  - Light and dark mode each render the existing pages without visual regression beyond the intended palette shift.
  - `prefers-color-scheme: dark` is honoured on first load with no saved preference.
  - A saved preference (`user-theme` in `localStorage`) overrides system preference.
  - Network panel shows no Roboto and no Material Icons font requests.
  - `npm ls @mui/material` returns nothing.
  - Tailwind classes `bg-surface`, `text-ink`, `text-accent`, `font-display`, `font-mono` resolve and render correctly in a scratch component.
- **Contrast check.** Verify each surface/ink pairing against WCAG 2.2 AA (4.5:1 for body, 3:1 for large text) before merging. This is captured formally in PRD 6 but should not be skipped here.

## Out of Scope

- Building the `IconComponent` itself (PRD 2).
- Replacing inline SVGs in Topbar and Footer (PRD 2).
- Removing the blue→purple gradient in markup (PRD 2 — Footer redesign).
- Visual redesign of any page (PRDs 3, 4, 5).
- Accessibility audit (PRD 6).
- Removing dead Material Icons class references in templates (PRD 6 cleanup).

## Further Notes

- The current `styles.scss` mixes Angular Material theme setup with token definitions; keep the Material theme block but move colour and typography tokens into a clearly delineated section above it. A future PRD can split styles.scss into smaller partials if it grows unwieldy.
- `theme-type: dark` in the Material theme uses `mat.$violet-palette`. This is unused in current screens (no Material primary-coloured component is visible) but verify before changing the palette assignment; defer that change to PRD 2 where the Material surface is touched.
- The `body class="… dark:bg-black bg-white …"` in `index.html` will be replaced when `darkMode: 'class'` lands; flip to `bg-surface text-ink` and let the class toggle drive both modes.
