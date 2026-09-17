# AGENTS.md

Shared instructions for AI coding agents (Claude Code, Codex, Cursor, etc.) working on this repo. Read alongside `.impeccable.md`.

## Project

Angular 22 photography portfolio for **Chong Wei Khang (张炜康)** (Penang, Malaysia). Being expanded into a dual-identity site: photography portfolio **plus** an AI blog (agent build logs, tutorials, opinion essays). Stack: Angular 22 (standalone components, WebMCP tools enabled), Tailwind CSS 4, Angular Material 22, `@fancyapps/ui` lightbox, Jest. Hosted on Cloudflare Workers (static assets, `wrangler.jsonc`). Routes: `/` (portfolio), `/about`, `/contact`, and (planned) `/blog`.

## How to work in this repo

- Defer to `.impeccable.md` for all design decisions. The five principles there override taste arguments.
- Follow `.gemini/rules/design-quality.md` for all editorial graphics, schematics, and diagrams (4-quadrant visual QA gate, canvas isolation, grounded connectors, token fidelity).
- Prefer editing existing files over creating new ones. Do not introduce abstractions ahead of need.
- Keep visual changes inside the tokens defined in `.impeccable.md` (warm-neutral palette, Signika + mono, Phosphor icons).
- Do **not** reintroduce the blue→purple gradient brand, Material Icons font, MUI (`@mui/material`), or Roboto. Those are being retired.
- Light + dark mode are both first-class. Test every change in both via the existing `ThemeService` / `.dark` class on `<html>`.
- Accessibility floor: WCAG 2.2 AA contrast, `prefers-reduced-motion` honored, full keyboard nav, alt text on every image. No exceptions.
- Lazy-load feature routes. Components are standalone; a signals migration is a separate planned effort.

---

## Design Context

### Users

Primary audience is **fellow photographers and creative peers** evaluating craft, sequencing, and visual taste. Secondary audience is **technically-minded readers** drawn in by the AI blog — agent builders and engineers exploring LangGraph / Claude / agentic patterns. Dual identity (photographer + AI builder) under **one unified design system**, not two sub-brands.

Job to be done: let a peer scan the photo body of work in under a minute, then optionally dive into long-form AI writing without context-switching the visual language.

Emotional goals: **calm, considered, quietly confident**. Gallery, not marketing funnel.

### Brand Personality

Three words: **Calm · Cinematic · Editorial.**

- **Calm** — generous whitespace, slow transitions, no aggressive CTAs, no popups.
- **Cinematic** — photography is the protagonist; chrome recedes; widescreen framing and intentional cropping.
- **Editorial** — print-inspired typographic hierarchy, restrained type scale, captions and metadata treated as first-class.

Voice: first-person, sparing, technical when warranted, never flashy.

### Aesthetic Direction

**References (positive):**
- Squarespace photographer templates **Five** and **Hester** — clean grid, big imagery, classic portfolio chrome.
- Editorial print sensibility for the blog side (magazine-feel hierarchy, not a developer blog clone).

**Anti-references (explicitly avoid):**
- The current **blue → purple gradient brand**. Retire it.
- **Generic Material / Bootstrap defaults** — no stock chips, no untouched default buttons, no obvious template surfaces.
- **Heavy motion, glassmorphism, neon glow, flashy hover effects** — motion only where it earns its place.
- **Handwritten font (Nothing You Could Do) as default body or heading** — reserve for one signature moment.

**Theme:** Light + dark, both first-class. Keep `ThemeService` and the `.dark` class on `<html>`.

**Color palette:** Warm neutrals (cream, bone, charcoal) plus a single restrained ink accent. Photographs are the only saturated color. Suggested base tokens:

- Light surface: warm white / cream (`#FBF9F4` range)
- Light ink: deep charcoal (`#1B1A17` range)
- Dark surface: warm near-black (`#121110` range)
- Dark ink: bone / off-white (`#E8E4DC` range)
- Accent: single muted warm (sand / clay) for links, focus rings, signature moments

**Typography:** Keep **Signika** as primary UI + display family. Drop **Roboto**. Reserve **Nothing You Could Do** for one signature spot. Add a **monospaced** family (system mono stack or JetBrains Mono / IBM Plex Mono) for blog code blocks, EXIF metadata, timestamps. Tight modular type scale (1.2 or 1.25 ratio, ≤6 steps).

**Iconography:** **Phosphor Icons** (https://phosphoricons.com/) as the sole icon system. Replace inline SVG socials, the Material Icons font dependency, and any ad-hoc SVGs. Regular weight default, Bold for emphasis, Duotone sparingly. `@phosphor-icons/core` is installed (per-icon SVG data).

**Layout:** Max content width ≈ 1280px (keep `max-w-7xl`). 4 / 8px spacing grid. Galleries break the centered container for full-bleed. Blog posts respect a 60–72 character measure.

### Design Principles

In conflict, apply in order:

1. **The photograph is the protagonist.** Chrome must never compete with imagery.
2. **Restraint over ornament.** Remove before adding. One signature font, one accent color, one motion idiom per surface.
3. **Editorial hierarchy.** Every page reads like a magazine spread.
4. **One system, two voices.** Photo and AI blog share tokens, type, spacing, icons, and chrome. The blog earns its technical voice through monospace and dense metadata, not a different palette.
5. **Accessible by default.** WCAG 2.2 AA, reduced-motion respected, keyboard-first, semantic landmarks, alt text on every image.

---

_Updated 2026-09-16. Mirror of the Design Context section in `.impeccable.md`._
