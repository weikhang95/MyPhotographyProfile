# .impeccable.md

Persistent design + engineering context for the Chong Wei Khang portfolio + AI blog. Loaded by all future sessions before design or implementation work.

---

## Design Context

### Users

Primary audience is **fellow photographers and creative peers** who land on the site to evaluate craft, sequencing, and visual taste. Secondary audience is **technically-minded readers** drawn in by the AI blog — agent builders, engineers exploring LangGraph / Claude / agentic patterns. The site has dual identity (photographer + AI builder) under **one unified design system**, not two sub-brands.

Job to be done: let a peer scan the photo body of work in under a minute, then optionally dive into long-form AI writing without context-switching the visual language.

Emotional goals: **calm, considered, quietly confident**. The reader should feel they have stepped into a gallery, not a marketing funnel.

### Brand Personality

Three words: **Calm · Cinematic · Editorial.**

- **Calm** — generous whitespace, slow transitions, no aggressive CTAs, no popups.
- **Cinematic** — photography is the protagonist; chrome recedes; widescreen framing and intentional cropping.
- **Editorial** — print-inspired typographic hierarchy, restrained type scale, captions and metadata treated as first-class.

Voice: first-person, sparing, technical when warranted, never flashy. Owner: Chong Wei Khang, based in Penang, Malaysia.

### Aesthetic Direction

**References (positive):**
- Squarespace photographer templates **Five** and **Hester** — clean grid, big imagery, classic portfolio chrome.
- Editorial print sensibility for the blog side (magazine-feel hierarchy, not a developer blog clone).

**Anti-references (explicitly avoid):**
- The current **blue → purple gradient brand** in the footer and any other gradient brand treatment. Retire it.
- **Generic Material / Bootstrap defaults** — no stock Material chips, no default Material buttons left untouched, no obvious template surfaces.
- **Heavy motion, glassmorphism, neon glow, flashy hover effects** — motion only where it earns its place (lightbox open, route transitions, image fades).
- **Handwritten font (Nothing You Could Do) used as default body or heading** — reserve for a single signature moment (footer signature or homepage hero accent), not site-wide.

**Theme:** Light + dark, both first-class. Keep the existing `ThemeService` and `.dark-mode` body class mechanism. Photos must look correct on near-black; blog body text must remain readable on warm white.

**Color palette:** Warm neutrals (cream, bone, charcoal) plus a single restrained ink accent. Let photographs be the only saturated color on the page. Suggested base tokens (refine in implementation):

- Light surface: warm white / cream (`#FBF9F4` range)
- Light ink: deep charcoal (`#1B1A17` range)
- Dark surface: warm near-black (`#121110` range — slightly warmer than `#000`)
- Dark ink: bone / off-white (`#E8E4DC` range)
- Accent: single muted warm (sand / clay) used for links, focus rings, signature moments only

**Typography:** Keep **Signika** as the primary UI + display family. Drop **Roboto** dependency (Signika covers it). Reserve **Nothing You Could Do** for one signature spot. Add a **monospaced** family (system mono stack or JetBrains Mono / IBM Plex Mono) for blog code blocks, EXIF metadata, and timestamps. Establish a tight modular type scale (1.2 ratio or 1.25, no more than 6 steps).

**Iconography:** **Phosphor Icons** (https://phosphoricons.com/) as the sole icon system. Replace the current inline SVG socials, Material Icons font dependency, and any ad-hoc SVGs. Use the **Regular** weight as default, **Bold** for emphasis, **Duotone** sparingly. Install via `@phosphor-icons/web` or per-icon SVG imports.

**Layout:** Max content width ≈ 1280px (keep current `max-w-7xl`). Spacing scale on a 4px / 8px grid. Photography galleries break the centered container for full-bleed moments. Blog posts respect a measure of 60–72 characters per line.

### Design Principles

These five principles override taste arguments in implementation. When in doubt, defer to them in order.

1. **The photograph is the protagonist.** Chrome — type, buttons, nav, page background — must never compete with imagery. If a UI element draws the eye away from a photo, it is too loud.
2. **Restraint over ornament.** Remove before adding. One signature font, one accent color, one motion idiom per surface. No gradient brand, no glow, no decorative shadows.
3. **Editorial hierarchy.** Every page reads like a magazine spread: a clear entry point, an intentional rhythm, generous whitespace, captions that carry meaning. No floating CTAs.
4. **One system, two voices.** Photo and AI blog share tokens, type, spacing, icons, and chrome. The blog earns its technical voice through monospace, dense metadata, and code blocks — not through a different palette or layout.
5. **Accessible by default.** WCAG 2.2 AA contrast, `prefers-reduced-motion` honored everywhere, full keyboard support for nav and lightbox, semantic landmarks, alt text on every image. The floor is non-negotiable.

### Scope of Work

Visual redesign **plus structural cleanup**, single-pass:

- Drop the duplicate **MUI** dependency; keep Angular Material only where it earns its weight.
- Drop **Roboto** Google Font; keep Signika.
- Drop **Material Icons** font; migrate to Phosphor.
- Introduce **design tokens** (CSS custom properties extended via Tailwind theme) for color, type, spacing, radii, motion.
- **Lazy-load** feature routes (`about`, `contact`, new `blog`).
- Add a **blog feature** with local markdown source (`src/content/posts/*.md`), build-time rendered. Blog topics: agent build logs / experiments, tutorials / how-to guides, opinion essays on AI.
- Keep current `NgModule` architecture for this pass (no full standalone-components / signals migration yet — file that as a follow-up).

---

_Updated 2026-05-24. Edit this file when design intent changes; do not let it drift._
