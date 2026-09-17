# Design Quality Standards & Visual QA Gate

This rule enforces publication-grade editorial design standards (matching Anthropic Engineering and OpenAI Research blogs) across all editorial graphics, interactive visual components, and UI layouts in this repository.

---

## 1. The 4-Quadrant Visual QA Gate

Every new graphic, diagram, or UI layout **MUST** pass visual verification across all four state quadrants before code submission:

| Quadrant | Theme | Language | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Q1** | **Dark** | **English (`en`)** | High contrast on warm near-black (`#121110`), readable monospace payloads, crisp borders. |
| **Q2** | **Dark** | **Simplified Chinese (`zh`)** | CJK typography rendering without truncation, clipping, or faux-italics. |
| **Q3** | **Light** | **English (`en`)** | Gentle cream canvas (`#FBF9F4`), deep charcoal ink (`#1B1A17`), subtle borders without harsh glare. |
| **Q4** | **Light** | **Simplified Chinese (`zh`)** | Balanced CJK visual weight against light grid markers, line-height 1.85, aligned glyphs. |

### Verification Protocol
1. Launch or connect to the running application in Chrome DevTools MCP.
2. Toggle theme between Light and Dark mode (`ThemeService.toggleTheme()` / `.dark` class).
3. Toggle language between `en` and `zh` (`LocaleService.setLocale()` / `portfolio_locale` in `localStorage`).
4. Capture and visually inspect viewport screenshots in each quadrant.

---

## 2. Canvas Isolation & Layout Hierarchy

1. **Sealed Canvas Architecture**:
   - All SVGs must be wrapped in a `.graphic-canvas-container` that strictly isolates the drawing canvas (`position: relative`, `overflow: hidden`, `width: 100%`, `display: block`).
2. **Separation of Caption & Canvas**:
   - `<figcaption>` must **never** overlap or share stacking context with the graphic canvas.
   - Place `<figcaption>` strictly *outside and below* the canvas card with `margin-top: var(--space-4, 1rem)`.
   - Captions must use subdued editorial typography (`font-size: 0.8125rem`, `color: var(--ink-faint)`, centered or flush-left aligned with the narrative measure).
3. **Responsive Scaling (`viewBox`)**:
   - SVGs must specify an explicit `viewBox` (e.g. `0 0 880 360`) and `preserveAspectRatio="xMidYMid meet"`.
   - Container must use `width: 100%; height: auto;` to scale smoothly across mobile, tablet, and widescreen.

---

## 3. Strict Token Fidelity (Zero Hardcoded Color Constants)

1. **No Arbitrary Hex Codes in SVGs**:
   - Direct hex codes like `#ff5500` or `#112233` are prohibited in SVG presentation attributes or template markup.
   - Use CSS custom properties:
     - `var(--eg-canvas-bg)`
     - `var(--eg-canvas-border)`
     - `var(--eg-node-bg)`
     - `var(--eg-node-border)`
     - `var(--eg-node-border-active)`
     - `var(--eg-accent-terracotta)`
     - `var(--eg-accent-amber)`
     - `var(--eg-accent-teal)`
     - `var(--eg-ink-primary)`
     - `var(--eg-ink-secondary)`
     - `var(--eg-ink-muted)`
     - `var(--eg-ink-faint)`
     - `var(--eg-grid-dot)`
2. **WCAG 2.2 AA Contrast Floor**:
   - All body text, code payloads, and labels must meet minimum 4.5:1 contrast against their card background.
   - Accent badges and interactive boundary markers must meet minimum 3:1 contrast against adjacent surfaces.

---

## 4. Architectural Schematic Elegance (Publication Caliber)

When building flowcharts, pipelines, event streams, or multi-node topologies:

1. **Uniform Alignment & Geometry**:
   - Sequential cards or pipeline stages must share identical heights and vertical baseline (`y`) coordinates unless intentionally depicting hierarchical nesting.
   - Use rounded corners (`rx="8"`, `ry="8"`) consistent with the portfolio card radius.
2. **Grounded Connectors & Terminal Edges**:
   - Never leave connector rails or pipeline lines floating into empty space.
   - Connectors must start at an explicit source node (e.g. `t_genesis`, `Client`) and terminate with an explicit destination node or directional arrow marker (e.g. `t_{n+1} →`).
   - Inter-card connections should use centered arrows or discrete buses (`<path marker-end="url(#arrow)">`).
3. **Structured Information Density**:
   - Every block should feature:
     - Header badge / status indicator (`e_001 COMMITTED`, `AGENT_CORE`, etc.)
     - Title in monospaced or crisp semi-bold type
     - Key-value metadata block (e.g. `tokens: 342`, `duration: 420ms`)
   - Bottom status bar providing summary telemetry or system invariants.

---

## 5. Bilingual Typography & Escaping Rules

1. **CJK Rendering**:
   - Respect system CJK font stacks (`PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans SC`).
   - SVG text elements must set `user-select: none`, `dominant-baseline="central"` or `dominant-baseline="alphabetic"` for exact cross-browser font metric rendering.
2. **Angular Template Escaping**:
   - Angular template interpolation parses `{...}`.
   - For mathematical subscripts or string literals containing braces (e.g. `t_{n+1}`), escape using Angular string literals: `t_{{ 'n+1' }} →` or HTML entities to prevent template compiler errors.

---

## 6. SVG Typography Scale & Minimum Legibility Floor

To prevent diagrams from rendering illegibly small when scaled down inside article containers or mobile screens:

1. **Strict Minimum Floor (No Micro-Fonts)**:
   - **Never** use `font-size="8"` or `font-size="9"` in any SVG schematic.
   - Lowest allowable font size for micro-offsets or badges is **10.5px / 11px**.
2. **Standard Scale**:
   - **Node Titles & Headers**: `font-size="13"` to `font-size="14"`, `font-weight="600"` / `700`.
   - **Body Key-Values & Code Payloads**: `font-size="12"` to `font-size="12.5"`.
   - **Sub-labels & Secondary Descriptions**: `font-size="11"` to `font-size="11.5"`.
   - **Header Meta & Timeline Markers**: `font-size="11"` to `font-size="12"`.
   - **Focal Symbols**: `font-size="18"` to `font-size="20"`.

---

## 7. Automated Verification Pipeline

Prior to merging any commit:
1. `npm test -- --watch=false` — 100% of test suites must pass (zero regressions in WebMCP, Topbar, Blog, Portfolio).
2. `ng build` — Must compile cleanly with 0 errors and within bundle size budgets.
3. Git commit messages must follow standard conventional commits (`feat(blog): ...`, `fix(blog): ...`).
