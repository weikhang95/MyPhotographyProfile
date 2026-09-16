# 03 — Diagram Style Kit (research + proposal)

> **Correction (lead review, 2026-09-16):** the dark-mode muted token on the site is `#8A857B`, not `#5E5A52`. `#8A857B` on `#121110` = 5.14:1 and passes AA. The "2.75:1 fails" claims below tested the light-mode token on the dark surface. `#A39D92` remains an optional higher-contrast choice for diagrams. Reference images mentioned as saved in `scratchpad/design/img/` were not committed (third-party copyright).

Date: 2026-09-16. Scope: how strong engineering/explainer publications draw diagrams, turned into a kit for a bilingual (EN / 简体中文) AI-concepts blog on a photographer's site. Brand: Calm · Cinematic · Editorial, restraint, one accent.

**Evidence labels**
- **[V-img]** I downloaded the actual published image and looked at it (saved in `scratchpad/design/img/`).
- **[V-doc]** Confirmed from the page text, markup or official docs.
- **[I]** My inference / general knowledge, not checked this session.
- **[X]** Could not verify (blocked or not found).

Site context checked in the repo (read-only): the display font is `--font-display: 'Signika'`, there is a script font `'Nothing You Could Do'`, and a `--font-mono` system stack. Signika has no CJK glyphs **[I]**, so Chinese labels need a fallback font (see §3.6).

---

## 1. Source survey

### 1.1 Anthropic Engineering — "Building effective agents"
URL: https://www.anthropic.com/engineering/building-effective-agents
- **Format [V-doc]:** 8 figures, all PNG at 2401×1000 (one is 2400×1666). No alt text in the markup. Captions are short noun phrases: "The augmented LLM", "The prompt chaining workflow", "The routing workflow", "Autonomous agent", "High-level flow of a coding agent".
- **What they look like [V-img]** (I checked "The augmented LLM" and "orchestrator-workers"):
  - Lots of white space. Content fills maybe 60% of a wide 2.4:1 canvas. No title inside the image; the caption does that job.
  - **Shapes are coded by role:** the In/Out endpoints are pills in a light coral fill with coral text. LLM calls are sharp-cornered rectangles in pale green with green text. Retrieval, Tools and Memory are sharp rectangles in pale lavender with violet text. Borders are 1px, a slightly darker tint of the fill.
  - **The text takes the role colour** (green text in green boxes). There is no black text inside nodes, which keeps things soft.
  - **Arrows:** mid-grey (warm grey, about #9A9890), thin (~2px at 2400px wide, so ~1px when displayed), with open "chevron" heads rather than filled triangles. A **solid** arrow is the main data path. A **dashed** arrow is optional, dynamic or two-way (tool calls, parallel fan-out). Fan-out uses gentle curves.
  - **Edge labels** are plain dark sans text with no background, broken over two lines ("Query/ Results", "Call/ Response").
  - Typography is a geometric/grotesk sans (Anthropic's brand sans), medium weight for node labels. No uppercase.
  - Low density: 3–7 nodes per figure. Not animated.
- **Takeaway:** a simple, repeatable set of shapes (endpoint pill, LLM box, tool box). The same visual words appear across all 8 figures, so readers learn them once.

### 1.2 Anthropic Engineering — "How we built our multi-agent research system"
URL: https://www.anthropic.com/engineering/multi-agent-research-system
- **Format [V-doc]:** PNG at 4584×2579 and 4584×4584. No alt text. Captions are **long and explanatory**. Figure 2's caption is a full paragraph that walks through the process step by step, so it works as a text alternative. Prose points to figures ("As shown in the diagram above…").
- **Figure 1, "High-level Architecture of Advanced Research" [V-img]:**
  - A **title inside the image** in large black bold sans.
  - Two large **warm-grey/beige rounded panels** (radius ~24px at the output size) group areas ("Claude.ai chat" | "Multi-agent research system"). Panel titles are grey, medium weight.
  - Nodes are **light-blue filled rounded rectangles with no stroke** (radius ~6–8px) and dark grey text. The lead agent is a bigger box with a secondary text line ("Tools: search tools + MCP tools…").
  - Arrows are dark grey, thin, with open heads. Self-loops are drawn as a curved arrow under each subagent. Two-way links are drawn as a pair of parallel one-way arrows.
  - There is one brand-orange accent (the Claude logo tile). Everything else is neutral plus one blue.
- **Figure 2, "Multi-agent System Process Diagram" [V-img]:** a UML-style sequence diagram.
  - Lifeline headers are rounded boxes in a **single-hue green ramp** (lightest for User, darkest for CitationAgent). The colour encodes order or depth, not category.
  - The loop region is a pale green rounded frame with a mid-green 1px border and a tab label ("Iterative Research Process").
  - Messages are grey 1px lines with open arrowheads and small grey labels in `snake_case` (web_search, complete_task). The decision node ("More research needed?") has ✓ / ✕ circle icons.
  - Medium-to-high density, but it reads fine because everything is grey except the one green hue.

### 1.3 Anthropic — "Introducing Contextual Retrieval"
URL: https://www.anthropic.com/news/contextual-retrieval
- **Format [V-doc]:** 16:9 PNG at 3840×2160 (plus one results table). No alt text. Captions are one sentence and state the result ("…reduce the top-20-chunk retrieval failure rate by 49%."). One caption has a typo ("Contextual Retrieva").
- **"Contextual Retrieval Preprocessing" [V-img]:**
  - Title inside the image. The canvas is **warm off-white (#F0EEE8-ish)** and holds lighter panels (radius ~16px) with **UPPERCASE section headers** ("PREPROCESSING (new)").
  - **Two-tone semantic colour:** the *new* part of the pipeline is blue (light-blue fill, blue 1.5px stroke, blue connectors, radius ~6px). The *existing* part is warm grey/taupe (taupe fill, grey stroke, grey connectors). This is the key trick: **colour marks "what's new / what to look at"; everything else stays neutral.**
  - Connectors are orthogonal with rounded elbows, and several lines merge into a bus before splitting again. Some annotation text floats free in grey (e.g. "For every prompt, Claude responds with 50–100 tokens…").
  - Icons are small outline pictograms (a person for Query, stacked documents for Corpus). One orange Claude glyph marks where the model runs.
- **Takeaway:** a highlight colour on neutral structure. That matches the owner's "one accent" rule exactly.

### 1.4 OpenAI engineering / research posts
URLs: https://openai.com/index/unrolling-the-codex-agent-loop/ and https://openai.com/index/harness-engineering/ (both exist per search results)
- **[X]** openai.com returned HTTP 403 to both WebFetch and curl, so I could not look at the figures. developers.openai.com loaded, but its 2025 recap only had a hero PNG.
- **[I] from memory, not checked:** OpenAI research/blog figures tend to be very minimal: a monochrome black/grey line style on white or light grey, a lot of animated or looping hero media, and charts in a small palette. Treat this as unverified. **Do not cite it as fact.** If the owner wants OpenAI specifically, open the posts in a browser and screenshot them.

### 1.5 Vercel blog — "Life of a Vercel request: what happens when a user presses enter"
URL: https://vercel.com/blog/life-of-a-vercel-request-what-happens-when-a-user-presses-enter
- **Format [V-doc]:** The page markup names **separate PNG assets for light/dark and desktop/mobile**: `router_light.png`, `router_dark_mobile.png`, `platform_firewall_light.png`, `platform_firewall_dark.png`, `platform_firewall_light_mobile.png`, `final_image_light_mobile.png`. So each diagram ships in up to 4 versions (2 themes × 2 layouts).
- **Look [V-img]:**
  - **Almost monochrome.** Light version: grey text on a #FAFAFA canvas. Dark version: white text on pure black.
  - **Every container is a dashed 1px rounded rectangle** (radius ~6–8px), with nested dashed groups ("Vercel Edge Network" › "Routing" › items). The dark version adds a very subtle fill (#0A0A0A-ish) to inner groups.
  - The only colour is a **single blue-tinted circle** (the globe/edge node). That one accent is restrained.
  - Arrows are thin (1px), with small open heads and rounded orthogonal elbows. A long return path loops around the whole diagram.
  - Labels are Geist sans, regular weight, sentence case. Some groups have small line icons in front of their labels.
  - **The mobile version is re-laid out vertically**, not just scaled down (the router diagram becomes a top-to-bottom column).
- **Takeaway:** a separate mobile layout and per-theme exports are standard at the premium end. Inline SVG with CSS tokens lets the owner avoid the themed PNG pairs, but a portrait variant is still worth having for complex figures.

### 1.6 Cloudflare blog
URLs: https://blog.cloudflare.com/workflow-diagrams/ and https://blog.cloudflare.com/thinking-about-color/
- **Workflow diagrams post [V-img]:**
  - The figure is a product-UI rendering: a **dot-grid canvas**, white cards with a 1px light-grey border, soft shadow, radius ~6px, and a two-part header (a mono label like "do", "waitForEvent", "function call" above a sans label "task a").
  - Connectors are 2px mid-grey orthogonal lines with rounded corners and small square "port" handles where they meet a card.
  - Groups are dashed-border rounded panels with a light grey fill. Fully neutral; no accent colour in this figure.
  - Images are served as WebP through an `/_image?…&f=webp` resizer with a `srcset` **[V-doc]**.
- **"Thinking about color" [V-doc]:** Cloudflare built a "90-color palette" in optically balanced scales, with "the 5th step in each scale … closest to the original brand color, but adjusted slightly so it's accessible with both black and white". Grays got "the slightest hint of blue". Text on coloured backgrounds uses "one of the darker steps from the corresponding scale" instead of pure black. They also built a colour-blindness preview component using SVG filters. The diagram-relevant motivation from search results: the older style used "very bold colors and geometric styles" and they wanted a palette that could show "more nuanced or dynamic movement". That is paraphrased from a search snippet, so partly **[V-doc]**.
- **Takeaway:** tinted neutrals, text colour taken from the fill's own hue, contrast checked against both black and white, and a colour-blind check.

### 1.7 Stripe blog
URLs tried: https://stripe.com/blog/online-migrations, https://stripe.com/blog/idempotency
- **[X]** The current markup of these engineering posts has no diagram images (only avatars and nav assets). Web searches turned up nothing first-party about Stripe's diagram process.
- **[I]** Stripe is widely known for polished marketing illustrations (isometric, gradients, animated product vignettes) rather than engineering-blog diagrams. That style is too "loud" for this brand anyway. Treat as not verified.

### 1.8 Linear ("Now" blog)
URL: https://linear.app/now/how-we-redesigned-the-linear-ui
- **[V-img]** The post's figures are **product screenshots** on a dark canvas with generous margins (2352px-wide PNGs), not diagrams. Premium feel comes from framing: centred app window, a lot of negative space, no drop-shadow clutter.
- **Takeaway for this site:** the "figure as a framed object on a quiet stage" treatment carries over to screenshots of agent UIs or terminals.

### 1.9 Figma blog
- **[X]** Not fetched this session. **[I]** Figma's blog mostly uses bespoke editorial illustration and product UI crops. Not a strong diagram reference. Its help docs are used in §4.

### 1.10 Bartosz Ciechanowski (ciechanow.ski)
URL checked: https://ciechanow.ski/gps/
- **[V-doc]** Interactive WebGL canvases for 3D scenes, SVG for 2D, sliders and draggable points ("you can drag the **red point** around"). Demos are "animated – you can play and pause them by clicking/tapping on the button in their bottom left corner". Colour carries meaning (yellow = user or primary object, and so on). Prose refers to figure elements **in bold, by colour name**.
- **Takeaway:** the prose names the colour of what you should look at, and motion is pausable. Worth copying: the text should say "the clay-coloured arrow" for the highlighted path.

### 1.11 Josh W. Comeau
URL: https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/
- **[V-doc, via search snippets]** MDX + Next.js + Linaria. A custom React interactive widget in every post. React Spring / Framer Motion for animation.
- **[I]** His widgets are playful and spring-animated with pastel colours. The *interaction model* is useful to copy (step toggles, sliders); the whimsical look does not fit "Calm · Cinematic".

### 1.12 Lilian Weng (Lil'Log)
URL: https://lilianweng.github.io/posts/2023-06-23-agent/
- **[V-doc]** Figures are PNGs. Captions use a "Fig. N. …" pattern ("Overview of a LLM-powered autonomous agent system."). Borrowed figures are credited in the caption ("Image source: Yao et al. 2023").
- **[V-img] "agent-overview.png":** grey-filled rectangles with dark 1.5px borders, Arial/Helvetica-style labels, **monospace for tool names** (`Calendar()`, `Search()`). A **single pink-filled, bold "Agent" node** is the focal point. Dark filled-triangle arrows, grey dashed arrows for secondary relations, orthogonal bus connectors. **[I]** It looks like Google Slides/Drawings. It is clear and honest, but "utility" rather than premium.
- **Takeaway:** one highlighted node, monospace for code identifiers, strict caption and credit format. It also shows that the default arrowheads and Arial are what make a diagram look generic.

### 1.13 Jay Alammar — "The Illustrated Transformer"
URL: https://jalammar.github.io/illustrated-transformer/
- **[V-doc]** PNG + animated GIF (e.g. `transformer_decoding_1.gif`, `_2.gif`). The page loads a jQuery gifplayer, so GIFs are click-to-play. He states the approach: "We'll represent those vectors with these simple boxes", and builds up "one by one" from a black box to the details.
- **[V-img] "The_transformer_encoder_decoder_stack.png":** rounded rectangles (radius ~8px) with pale green fills (encoders) and pale pink fills (decoders), 2px dark slate borders, UPPERCASE semibold labels, a saturated blue rounded container, and colour-matched INPUT/OUTPUT labels next to their boxes.
- **Takeaway:** **progressive disclosure across a series of figures** (the same drawing, zoomed in step by step) and **a consistent visual vocabulary** (the vector = a row of small boxes) teach better than one dense figure. The palette is friendlier and more saturated than this brand needs.

### 1.14 Distill.pub
URL: https://distill.pub/guide/
- **[V-doc]** "For static diagrams, we recommend using a vector graphics tool, like Adobe Illustrator, Sketch or Inkscape." "For dynamic diagrams we recommend D3.js … draw a static diagram, tag elements of your diagram with classes or ids, and then manipulate them with D3." The layout classes are `.l-body`, `.l-middle`, `.l-page`, `.l-screen`, `.l-screen-inset`, `-outset` variants, and `.side` for margin figures.
- **Takeaway:** (a) draw in a vector tool, **name layers so exported ids and classes can be targeted by CSS and JS**. That is exactly the owner's plan. (b) Give figures **width tiers** beyond the text column.

### 1.15 Excalidraw
Sources: https://github.com/excalidraw/excalidraw/pull/8530, https://plus.excalidraw.com/blog/adding-hand-drawn-font-for-chinese-japanese-korean, https://deepwiki.com/excalidraw/excalidraw/5.2-svg-export-and-rendering, https://aldur.blog/micros/2025/07/13/exporting-excalidraw-svgs-and-inverting-their-colors-in-dark-mode/
- **[V-doc]** SVG export turns text into real SVG `<text>` nodes, one per line. Options include `exportWithDarkMode` (applies a dark-mode *filter*), `exportPadding`, and embedding the scene, so the file can be reopened for editing. There are open issues about embed-scene re-import.
- **[V-doc]** CJK: Excalidraw added **Xiaolai** as a hand-drawn CJK fallback for Excalifont (40k+ codepoints, Simplified + Traditional Chinese, Japanese, Korean), with CJK-aware wrapping and font splitting.
- **[V-doc]** A common blog approach to dark mode is `filter: invert(1)` on the exported SVG. The author calls it "pretty naive" because it inverts every colour, so accents become their complements (clay would turn blue-teal).
- **[I]** Editor styles: Sloppiness (Architect / Artist / Cartoonist, i.e. roughness 0/1/2), Stroke width (thin/bold/extra bold), Edges (sharp/round), Font (Excalifont hand-drawn, Nunito sans, Comic Shanns code). The "clean hand-drawn" look people like = Architect (roughness 0) or Artist, thin stroke, a small palette, generous spacing.
- **[I]** libraries.excalidraw.com hosts community shape libraries. A private `.excalidrawlib` for this site is easy to make.

### 1.16 tldraw
Source: https://tldraw.dev/sdk-features/styles and the export docs
- **[V-doc]** Dash styles: `draw | solid | dashed | dotted | none`. Fills: `none | semi | solid | pattern | fill | lined-fill`. Fonts: `draw | sans | serif | mono`. SVG export can be forced to dark or light, and "exports are fully self-contained: the editor embeds fonts, inlines styles". There's a third-party CLI (`kitschpatrol/tldraw-cli`).
- **Takeaway:** fine as an alternative for notes, but embedded fonts make files heavy, and colours are fixed per theme. Same mapping problem as Excalidraw.

### 1.17 Mermaid
URL: https://mermaid.js.org/config/theming.html
- **[V-doc]** The theme list on the page now includes `default, neutral, dark, forest, base` plus newer `neo`, `neo-dark`, `redux*`. Only **`base`** can be customised, through `themeVariables` (`primaryColor`, `primaryTextColor`, `lineColor`, `fontFamily`, `fontSize`, `background`, `darkMode`, …). **"The theming engine will only recognize hex colors and not color names"**, so `var(--x)` cannot be passed in; you need post-processing.

### 1.18 D2 (Terrastruct)
URL: https://d2lang.com/tour/themes/
- **[V-doc]** `d2 -t <theme>` and `--dark-theme <theme>`. With both set, the SVG adapts to the system light/dark preference (dark is off by default). `theme-overrides` and `dark-theme-overrides` replace the colour codes (N1…N7 neutrals, B1…B6 base, AA/AB alternates). There is a sketch mode, and the "Terminal" theme shows how strongly a theme can change the look (caps, no radius, mono).
- **Takeaway:** D2 is the best quick-diagram engine here. It has **built-in light/dark in one SVG** and overridable colour slots that can be set to this site's hex tokens exactly.

---

## 2. What makes diagrams feel premium vs generic

Patterns seen across the checked sources (Anthropic, Vercel, Cloudflare), compared with the "generic" examples (Lilian Weng's slide-tool look, default Mermaid):

| Premium | Generic |
|---|---|
| **One visual system across the whole post.** Same shapes, stroke, radius and type in every figure (Anthropic "effective agents" figures 1–7). | Each figure made ad hoc; styles drift. |
| **Neutral structure plus one semantic highlight colour.** Colour means "new / look here" (Contextual Retrieval blue; Vercel's single blue globe). | Rainbow category colours, or colour used as decoration. |
| **Text colour taken from the node's own hue** (Anthropic green-on-green, Cloudflare "darker step of the same scale"). | Pure black text on saturated fills. |
| **Thin strokes (≈1–1.5px displayed) and open chevron arrowheads**, sometimes curved fan-outs. | 2–3px black lines with big filled triangle heads (Office/Slides default). |
| **Lots of negative space.** Content fills ~60–70% of the canvas, with 3–7 nodes per figure. | Boxes packed to the edges; everything in one figure. |
| **The brand's own typeface** at one or two weights, sentence case, few sizes. | Arial/Helvetica fallback, mixed caps, many sizes. |
| **Solid vs dashed carries meaning** (main path vs optional/async). Dashed containers mark boundaries (Vercel). | Line styles used at random. |
| **Soft, tinted backgrounds and panels** (warm grey panels at Anthropic, #FAFAFA at Vercel) with moderate radii. | Pure white with hard black borders, or heavy drop shadows. |
| **Captions do real work**: one sentence stating the takeaway, or a paragraph that walks through the flow (Anthropic multi-agent Fig. 2). | "Figure 3: Architecture." |
| **Layouts per breakpoint** (Vercel `_mobile` exports) and **per theme** (`_light/_dark`). | One 2400px PNG scaled down to unreadable 6px text on phones. |
| **Progressive disclosure across figures** (Alammar zooming in one level at a time). | One monster diagram. |
| **Orthogonal routing with rounded elbows and buses** (Contextual Retrieval, Cloudflare). | Diagonal spaghetti crossings. |
| **Motion only when it explains, and it can be paused** (Ciechanowski play/pause; Alammar click-to-play GIFs). | Auto-looping decoration. |

Common gaps even at the top end, which this site can do better: **no alt text on any of the Anthropic figures [V-doc]**, text baked into PNGs (not translatable, not searchable), and titles repeated both inside the image and in the caption.

---

## 3. Proposed style kit — "Darkroom Diagrams" v0.1

### 3.1 Canvas, grid and spacing
- **Base unit: 4px. Layout grid: 8px.** All node positions and sizes snap to 8. Text baseline offsets may use 4.
- **Design canvas:** draw at **1× = 720px wide** (the planned text column; confirm the actual `max-width` of the prose column). Use `viewBox="0 0 720 H"`. Heights are multiples of 8.
- **Outer padding:** 32px on every side inside the viewBox (24px minimum for small inline figures).
- **Gap between nodes:** 48px on the main axis, 24px between siblings, and at least 32px for arrows that carry labels.
- **Node sizes:** minimum height 40px (one line) or 56px (two lines). Width snaps to 8 and must be at least text width + 32 (16px horizontal padding each side). Standard widths: 120 / 160 / 200 / 240.
- **Density budget:** 7 nodes max per figure (flagship ≤ 9). More than that means split into a sequence (the Alammar pattern).

### 3.2 Strokes
| Element | Width (at 1× = 720px) | Notes |
|---|---|---|
| Node border | 1px | `vector-effect="non-scaling-stroke"` so borders stay crisp when the SVG scales |
| Container / group border | 1px dashed `4 4` | Vercel-style boundary |
| Connector, default | 1.25px | Rounded caps and joins |
| Connector, highlighted path | 1.75px, accent colour | Only one highlighted path per figure |
| Emphasis ring (focus node) | 1.5px accent | Replaces the border rather than adding a second one |

### 3.3 Corner radii
- Node: **6px**. Container/panel: **12px**. Endpoint pill (Input/Output): **fully rounded** (`rx = h/2`). Callout/annotation chip: **4px**. Canvas background (if shown): **16px**, matching the site's image cards if they are rounded (to confirm).
- Nothing sharp except data-store "document" corners and code/token cells (see below). The radius tells you what kind of thing a shape is.

### 3.4 Box types (the vocabulary)
All fills are **tints**, never solid ink. Names map to CSS classes (`.dg-actor`, …) so exported SVGs can be restyled.

| Type | Shape | Fill | Stroke | Label | Glyph (optional, 16px, 1.25px line icon) |
|---|---|---|---|---|---|
| **Human / user** (`.dg-human`) | Pill, or a 40px circle plus a label below | `--dg-surface-2` | `--dg-border-strong` | ink, 500 | person outline |
| **Actor / agent** (`.dg-agent`) | Rounded rect r6, *double-height header strip* (Cloudflare-style: small mono kicker "agent" above the name) | `--dg-surface-2` | `--dg-border-strong` | ink 500; kicker muted mono 11px | none, or a small loop glyph |
| **Model / LLM** (`.dg-model`) | Rounded rect r6 with an **inner 1px inset line at 3px** (a subtle "chip" double border). This is the signature shape. | `--dg-accent-tint` *only if it's the focus*, otherwise `--dg-surface-2` | `--dg-ink` at 1px | ink 600 | small spark/aperture glyph (nods to photography: a 6-blade aperture) |
| **Tool** (`.dg-tool`) | Rounded rect r6, **dashed-free solid border**, label in **mono** with `()` e.g. `search()` | `--dg-surface` (no tint) | `--dg-border-strong` | ink mono 13px | wrench/terminal glyph optional |
| **Service / system** (`.dg-service`) | Rounded rect r6 | `--dg-surface-2` | `--dg-border` | ink 500 | none |
| **Data store** (`.dg-store`) | Cylinder (ellipse cap ry=6) for DB/vector index. **Stacked sheets** (two offset rects, 4px offset) for document corpora/memory files. | `--dg-surface-2` | `--dg-border-strong` | ink 500 | none |
| **Context / token strip** (`.dg-tokens`) | Row of 8×8 or 12×12 r2 cells (the Alammar "vector as boxes" idea), used for context windows | cells `--dg-muted` at 25% / accent for highlighted | none | n/a | n/a |
| **Container / boundary** (`.dg-group`) | Rect r12, dashed 1px | transparent, or `--dg-surface-2` at 50% | `--dg-border` | UPPERCASE 11px tracked label, muted, top-left inside at (16,16) | none |
| **Annotation** (`.dg-note`) | No box, just muted text and an optional 1px leader line ending in a 3px dot | none | `--dg-muted` | muted 12px, italic *not* used (CJK has no italic) | none |

Rule: **shape encodes the kind of thing; colour encodes attention.** Never use colour to mark type, so the one-accent rule stays intact.

### 3.5 Connectors and arrows
All arrowheads are **open chevrons**, 8px long, 45° half-angle, 1.25px stroke, drawn as a `<marker>` with `stroke="currentColor"` (verified pattern from Anthropic and Vercel figures).

| Meaning | Line | Head | Example |
|---|---|---|---|
| **Sync call / control flow** | solid 1.25px, `--dg-line` | open chevron at the end | agent → tool call |
| **Return / response** | solid 1.25px, `--dg-line`, drawn as a *separate parallel line* offset 8px (not a double-headed arrow) | open chevron | tool result → agent |
| **Async / event / fire-and-forget** | dashed `4 3` | open chevron | spawn subagent, webhook |
| **Data flow (payload moves)** | solid 1.25px **with a 5px filled dot at the source** | open chevron | chunks → embedding model |
| **Optional / conditional** | dotted `1 3` round caps | open chevron, and a condition label in mono | "if needs_more_research" |
| **Loop** | an arc of at least 270°, radius 16–24, under or beside the node | chevron | agent loop, self-reflection |
| **Highlighted path** | the same style as its meaning, but `--dg-accent` 1.75px | accent chevron | "the path this post is about" |

Routing: **orthogonal with 8px rounded elbows** by default. **Curves (cubic) only for fan-out/fan-in** from one node to 3 or more. Lines never cross text, and at most one crossing per figure (use a 4px gap "hop" if needed). Edge labels sit on a `--dg-surface` background chip (padding 2/6, radius 4) centred on the line, so the line visually breaks behind them.

### 3.6 Typography
- **Latin:** use the site's sans. Signika is the display face, but it is fairly soft and wide at small sizes. **Recommendation: one neutral grotesk for diagrams** (e.g. Inter or IBM Plex Sans, or the body face if one exists), with Signika only for the figure's optional in-image title. *Open question for owner.* Mono: `--font-mono` for identifiers, tool names and tokens.
- **Sizes (at 1× = 720px viewBox):** node label **14px/500**, secondary line **12px/400 muted**, edge label **12px/400**, group label **11px/600 UPPERCASE letter-spacing 0.06em** (EN only), step numbers **11px/600 tabular-nums**. There are only these four sizes. Nothing smaller than 11 at 1×, because when a 720 viewBox shrinks to a 360px phone, 11px renders at 5.5px (see §3.10 for how that's handled).
- **Case:** sentence case for labels, `mono_snake_case` for code identifiers, and UPPERCASE only for group labels.
- **CJK (简体中文):**
  - Font stack: `"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif`, appended after the Latin family, so mixed "LLM 调用" strings keep a Latin face for Latin text. Consider **self-hosting a subset of Noto Sans SC** only if text is converted to outlines at build (see §4.2). Otherwise rely on system fonts.
  - **No UPPERCASE and no letter-spacing** for group labels in zh. Use **600 weight at 12px** instead.
  - **Size +1px** for zh body labels (15/13/13) and **line-height 1.5** (EN 1.3). CJK glyphs look optically smaller and dense strokes blur at 12px.
  - Chinese strings are usually **~0.6–0.8× the length** of the English but need taller lines. Design node widths from the *longer* of the two, and check both before export.
  - Don't break a line inside a term. Keep technical terms in English where the Chinese AI community does (e.g. "RAG", "token", "Agent" often stay in Latin; "上下文窗口" for context window). Keep a shared glossary.
  - No italics in zh. Emphasis uses weight or accent colour only (this applies to both languages, for consistency).
  - Use full-width punctuation in zh labels (：，、) and a space between CJK and Latin/numbers ("第 1 步", "200K token").

### 3.7 Colour rules (tokens)
Map to the site tokens. The new diagram-only tokens are derived tints (values proposed, and must be contrast-checked).

```css
:root {
  --dg-surface:        #FBF9F4;  /* site surface */
  --dg-surface-2:      #F4F0E8;  /* node fill: surface darkened ~3% toward ink (proposed) */
  --dg-ink:            #1B1A17;
  --dg-muted:          #5E5A52;
  --dg-line:           #8A857B;  /* connectors: between muted and border (proposed) */
  --dg-border:         #E5E0D6;
  --dg-border-strong:  #CFC8BA;  /* node border (proposed) */
  --dg-accent:         #B08968;
  --dg-accent-ink:     #7A5A3F;  /* accent-coloured TEXT on light bg; computed: clay #B08968 on cream = 3.01:1 (fails AA small text); #7A5A3F = 5.94:1 */
  --dg-accent-tint:    #F1E7DC;  /* focus node fill (proposed) */
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { /* same as below */ } }
:root[data-theme="dark"] {
  --dg-surface:        #121110;
  --dg-surface-2:      #1A1816;  /* proposed */
  --dg-ink:            #E8E4DC;
  --dg-muted:          #A39D92;  /* computed: #5E5A52 on #121110 = 2.75:1 (fails); #A39D92 = 7.0:1 */
  --dg-line:           #6F6A61;
  --dg-border:         #2A2722;
  --dg-border-strong:  #3A362F;
  --dg-accent:         #D2A878;
  --dg-accent-ink:     #D2A878;  /* passes on dark */
  --dg-accent-tint:    #2A2219;
}
```
(Wire these to the site's real theme switch. The selectors above only illustrate the structure.)

Rules:
1. **Background:** the diagram's canvas is transparent by default, so it sits on the page surface. A flagship figure may use a `--dg-surface-2` stage with r16 (the Anthropic panel feel).
2. **Ink hierarchy:** labels `--dg-ink`, secondary and annotations `--dg-muted`, connectors `--dg-line`, node borders `--dg-border-strong`, groups `--dg-border`.
3. **One accent per figure, used once or twice:** the focus node's border and tint *and/or* one highlighted path. Never more than ~10% of the ink area. If two things need emphasis, use accent for one and **weight/solid-vs-muted** for the other.
4. **Text in accent** uses `--dg-accent-ink` (light mode), because clay on cream is 3.01:1 (computed with the WCAG formula), which fails AA for small text. Dark clay #D2A878 on #121110 = 8.63:1, which is fine.
5. **Never** encode meaning with accent colour alone. Pair it with stroke weight, a step number or a label (colour-blind safety, following Cloudflare's practice).
6. **No second hue.** If a comparison really needs two states ("before/after", "new vs existing" à la Contextual Retrieval), use **accent vs neutral**, never accent vs another colour.
7. **No gradients, no shadows.** One exception: a 1px `--dg-border` "lift" line under flagship stage panels, if needed.

### 3.8 Emphasis and highlight
- **Focus node:** `--dg-accent` 1.5px border, `--dg-accent-tint` fill, label weight 600.
- **Dim the rest (for build-up sequences):** non-focus elements at `opacity: .45`. Use this only in stepwise/interactive figures, not static ones.
- **Callout:** a muted annotation with a leader line and a 3px accent dot at the anchor.
- **"New" marker:** a small accent pill "new" / "新" (11px) at a node's top-right. Max one per figure.

### 3.9 Step numbering
- Circled numerals **drawn as shapes, not Unicode** (①② render inconsistently across CJK fonts): an 18px circle, 1.25px `--dg-ink` stroke, a transparent fill, and a tabular 11px/600 number. For the highlighted path, use an accent-filled circle with `--dg-surface` text.
- Put the number **on the connector near its source**, or at a node's top-left corner (offset −9,−9).
- Numbers match an ordered list or `<ol>` in the prose or caption ("① The agent sends…"), so the figure and text can be read side by side.
- Arabic numerals in both languages. Don't use 一二三 in figures.

### 3.10 Figure captions and container
Markup:
```html
<figure class="dg" id="fig-agent-loop">
  <svg role="img" aria-labelledby="fig-agent-loop-t fig-agent-loop-d" viewBox="0 0 720 400">
    <title id="fig-agent-loop-t">The agent loop</title>
    <desc id="fig-agent-loop-d">A user message enters… (a full sentence walkthrough)</desc>
    …
  </svg>
  <figcaption><span class="dg-num">Figure 2</span> The agent loop: the model keeps calling tools until it produces a final answer.</figcaption>
</figure>
```
- **Caption format:** EN `Figure N` in small caps or muted 600, then the **takeaway sentence** (not just a title). zh `图 N`, then the sentence with full-width punctuation. Credits: `Adapted from Author (Year).` / `改编自 Author (Year)。`
- Caption style: 14px muted, max-width = text column, left-aligned (centred only when the figure is narrower than the column).
- **No title text inside the SVG image.** The caption is the title (this avoids Anthropic's duplication, and one fewer string to translate).
- **Width tiers** (Distill idea): `.dg--body` (text column, default), `.dg--wide` (column + 2×80px outset, max 960px), `.dg--full` (viewport minus gutters, for flagship figures only).
- **Responsive:**
  - `width: 100%; height: auto` via viewBox.
  - **Minimum readable rule:** if the figure's container is narrower than **560px**, text at 14px would render below ~11px. Three options, in order of preference:
    - (a) Ship a **portrait variant** (`viewBox 0 0 360 H`, vertical flow) and swap with `<picture>`-like logic: two inline SVGs toggled by a container query `@container (max-width: 560px)` (Vercel ships `_mobile` exports [V-doc]).
    - (b) Wrap in a horizontal scroll area with a visible fade hint and "Scroll →" / "左右滑动".
    - (c) Design the landscape version to stay legible at 0.5× (labels ≥ 22px at 1×). Only for very simple figures.
  - Flagship figures: always (a). Notes: (b) is acceptable.

### 3.11 Accessibility
- `role="img"` + `<title>` + `<desc>` on every inline SVG, referenced by `aria-labelledby`. `<desc>` = a prose walkthrough of the flow (Anthropic's long caption shows the right level of detail) in **the same language as the page**.
- For complex figures, add a **"Text version" `<details>`** under the figure with an ordered list of steps (the numbered steps from §3.9). This also helps SEO and makes translation review easier.
- Text in SVG stays as live `<text>`, so it can be selected, found with Ctrl+F, and read by screen readers where supported. Decorative glyphs get `aria-hidden="true"`.
- Contrast (computed with the WCAG relative-luminance formula for the proposed tokens):
  - Labels: ink on cream is very high; muted #5E5A52 on #FBF9F4 = 6.52:1 ✓; dark muted #A39D92 on #121110 = 7.0:1 ✓; ink on accent-tint = 14.3:1 (light) / 12.4:1 (dark) ✓.
  - Connectors (the carriers of meaning): `--dg-line` #8A857B on cream = 3.49:1 ✓, #6F6A61 on #121110 = 3.51:1 ✓ (WCAG 1.4.11 non-text ≥ 3:1).
  - Borders: `--dg-border` 1.25:1 and `--dg-border-strong` 1.58:1 (light) / #3A362F 1.57:1 (dark) are **below 3:1**. That is acceptable only because nodes are identified by their **label + fill**, not the outline alone. Rule: **never rely on a border alone to convey a boundary or state.** Focus/state always adds weight or the accent. If the owner wants outline-only nodes (Vercel style), node borders must move to `--dg-line`.
- Motion (if any): respect `prefers-reduced-motion`, need a click to start, and have a pause control (Ciechanowski/Alammar pattern).
- Colour-blind check: run figures through a deuteranopia/protanopia filter (clay vs grey stays distinguishable by lightness, but verify).
- `forced-colors: active`: set strokes/text to `CanvasText` and the accent to `Highlight` so Windows High Contrast works.

---

## 4. Tooling workflow

### 4.1 Figma component library (flagship figures)
File: **"Diagram Kit — Darkroom"**
- **Pages:** `00 Cover & rules` · `01 Tokens` · `02 Primitives` · `03 Nodes` · `04 Connectors` · `05 Annotations & numbering` · `06 Templates` · `07 Figures / <post-slug>` (one page per post, or a separate file per post that uses the published library).
- **Variables (Figma Variables):** a collection `dg` with modes **Light / Dark**, holding exactly the `--dg-*` names from §3.7 (`dg/surface`, `dg/surface-2`, `dg/ink`, …). Name them identically so the export mapping is 1:1. Plus a number collection: `space/4,8,16,24,32,48`, `radius/node=6,group=12,chip=4`, `stroke/node=1,line=1.25,focus=1.75`.
- **Text styles:** `dg/label` 14/500, `dg/secondary` 12/400, `dg/edge` 12/400, `dg/group` 11/600 caps, `dg/mono` 13/400, and zh variants `dg-zh/label` 15/500 LH 1.5, etc.
- **Language:** add a **Text variable collection `lang` with modes EN / ZH-Hans** (Figma string variables). Bind every label to a string variable. Switching the frame's mode then produces the zh artboard with no duplicated drawing, and exports go per mode. **[I]** Figma string variables and modes exist, but check plan limits on the number of modes.
- **Components:** `Node` (variants: type = human|agent|model|tool|service|store|tokens; state = default|focus|dimmed; lines = 1|2; lang via variables), `Group` (dashed/filled), `Arrow head` markers, `Step badge` (default|accent), `Edge label chip`, `Callout`. Build nodes with **auto layout** (padding 16/12, hug width, min width 120) so zh/en strings resize the node.
- **Connectors:** Figma has no smart connectors in Design files (FigJam does) **[I]**, so draw with vector paths on the 8px grid, strokes centred, round caps. Arrowheads as a small component placed at the ends (simpler to style than Figma's built-in stroke endpoints when exporting to SVG markers).
- **Layer naming = CSS classes:** name layers `dg-node dg-model is-focus`, `dg-edge sync`, `dg-label`. With "Include id attribute" on, layer names become `id`s, which a build step can turn into `class`.

### 4.2 Figma SVG export settings
From Figma help **[V-doc]**:
- **Outline text:** "Figma converts any text layers into glyphs… Text will not be editable after export". **→ Turn OFF.** Keep live `<text>` for i18n, accessibility, search, selection and small file size.
  - *Tradeoff:* live text renders with whatever font the reader has. **Mitigation:** the diagram font must be one the site already loads (webfont on the page, inherited by inline SVG, which works because the SVG is inline and not `<img>`). Test zh on Windows (Microsoft YaHei metrics differ from PingFang, so leave ≥ 12px slack in node widths).
  - *When to outline:* only a figure's decorative in-image wordmark, or if you ever export to `<img>`/OG images.
- **Include "id" attribute: ON** (layer names become ids, used by the build step).
- **Simplify stroke: ON** (default; "SVG only supports center stroke"). Also **use centre strokes in the design itself** so nothing gets turned into masks.
- Export at 1× (vector), **one frame per language × layout** (e.g. `agent-loop.en.wide.svg`, `agent-loop.zh.wide.svg`, `agent-loop.en.narrow.svg`). Theme is *not* a separate export, because colours are swapped to tokens.
- Watch for Figma's text output: it emits `<text>` with `<tspan x y>` per line and a `font-family` attribute. The build step should strip `font-family` and `font-weight` literals in favour of classes.

### 4.3 Build step: fixed colours → CSS variables
Pipeline (a Node script run at content build, e.g. `scripts/diagrams.mjs`; the repo is Angular, so run it as a prebuild):
1. **Input:** `content/diagrams/*.svg` (raw Figma/D2/Excalidraw exports).
2. **SVGO** with a custom config: keep `viewBox`; `removeDimensions` (so CSS controls size); **`prefixIds`** (with the file slug, so multiple inline SVGs on one page don't clash ids or markers); `removeTitle: false`, `removeDesc: false`; turn off `convertColors`'s `currentColor` so it doesn't touch mapped colours before step 3; `inlineStyles` then `convertStyleToAttrs`, so colours live in attributes that are easy to rewrite.
3. **Colour map pass** (the key step): parse with `svgson` or a regex over `fill|stroke|stop-color` attributes. Replace **exact light-mode hexes from the Figma Light mode** with vars:
   ```js
   const map = {
     '#FBF9F4':'var(--dg-surface)', '#F4F0E8':'var(--dg-surface-2)', '#1B1A17':'var(--dg-ink)',
     '#5E5A52':'var(--dg-muted)', '#8A857B':'var(--dg-line)', '#E5E0D6':'var(--dg-border)',
     '#CFC8BA':'var(--dg-border-strong)', '#B08968':'var(--dg-accent)', '#7A5A3F':'var(--dg-accent-ink)',
     '#F1E7DC':'var(--dg-accent-tint)'
   };
   ```
   **Fail the build on any unmapped colour** (list the offending hex and element id). This enforces the one-accent palette automatically. Allow `none`, `transparent`, and `currentColor`.
   - Option B (cleaner): turn ids from layer names into classes (`dg-node dg-model is-focus`), strip *all* fill/stroke attributes, and style entirely from a `diagrams.css`. More robust against designer drift, but more CSS to maintain. **Suggestion: Option A for v0.1, and move to B once the component set is stable.**
4. **Accessibility injection:** read the sidecar `agent-loop.meta.yml` (`title.en`, `title.zh`, `desc.en`, `desc.zh`, `caption.en`, `caption.zh`, `credit`), insert `<title>`/`<desc>`, and set `role="img"` + `aria-labelledby`.
5. **Font pass:** remove `font-family` attributes and add `class="dg-t dg-t--label"`. The zh file gets `lang="zh-Hans"` on the `<svg>` root so the CSS `:lang(zh)` stack applies.
6. **Output:** a TS map or JSON `{ slug: { en: {wide, narrow}, zh: {wide, narrow}, meta } }` for an Angular `<app-diagram slug="agent-loop">` component. It renders `<figure>` and inlines the SVG via `innerHTML` (sanitised with a DomSanitizer bypass *only* for this build-time trusted content), switching wide/narrow with a container query or a `ResizeObserver`.
7. **CI check (optional):** render each SVG in both themes with Playwright, screenshot it, and run an automated contrast/overlap check (text bounding boxes must not overflow node rects in zh).

### 4.4 Excalidraw workflow (notes / quick posts)
- **Team library:** make a `darkroom.excalidrawlib` with the §3.4 shapes (human, agent, model with double border, tool with mono label, cylinder, stacked docs, token strip, step badge) pre-styled.
- **Canvas settings for the "clean hand-drawn" look [I]:** Sloppiness **Architect** (roughness 0) for crisp work, or **Artist** (1) for a "note" vibe (pick one per post and stay consistent). Stroke width **thin**. Edges **round**. Fill **solid** (hachure/cross-hatch fills fight the calm brand). Font **Excalifont** for notes (hand-drawn; CJK falls back to **Xiaolai** automatically [V-doc]) or **Nunito** (the "normal" font) if a cleaner note is wanted.
- **Restricted palette:** Excalidraw's colour picker takes custom hex, so use only these light-mode hexes: `#1B1A17` ink, `#5E5A52` muted, `#8A857B` line, `#CFC8BA` border-strong, `#F4F0E8` surface-2, `#B08968` accent, `#F1E7DC` accent-tint, background transparent.
- **Export:** SVG, **Background OFF**, **Dark mode OFF** (never use Excalidraw's dark filter: it is a filter/inversion and would turn clay into its complement; the invert approach is "pretty naive" [V-doc]), **Embed scene ON** (keeps the file re-editable; there are known re-import bugs [V-doc], so also commit the `.excalidraw` JSON source next to it), scale 1×, padding ~16.
- **Build:** the same §4.3 pipeline with the same colour map. The only extra step is **font handling**: Excalidraw SVGs embed `@font-face` data for Excalifont/Xiaolai **[I: exact embedding method not verified; deepwiki only confirms fonts are loaded before export]**. Either keep the embedded font (heavier; Xiaolai subsets can be big for zh, so check file size) or strip it and self-host Excalifont once site-wide. Measure size per figure and set a budget (e.g. ≤ 60KB gzipped per inline SVG).
- **Per language:** duplicate the scene into `x.en.excalidraw` and `x.zh.excalidraw`. Excalidraw has no string variables, so for notes this is acceptable.

### 4.5 Optional quick-diagram engines
**D2 (recommended for sequence/architecture quickies):**
```
vars: {
  d2-config: {
    theme-id: 0            # "Neutral default"; pick base, then override
    dark-theme-id: 200     # a dark theme id; check `d2 --list-themes`
    theme-overrides: {
      N1: "#1B1A17"; N2: "#5E5A52"; N3: "#8A857B"; N4: "#CFC8BA"; N5: "#E5E0D6"; N6: "#F4F0E8"; N7: "#FBF9F4"
      B1: "#1B1A17"; B2: "#B08968"; B3: "#CFC8BA"; B4: "#F4F0E8"; B5: "#F4F0E8"; B6: "#FBF9F4"
    }
    dark-theme-overrides: {
      N1: "#E8E4DC"; N2: "#A39D92"; N7: "#121110"; B2: "#D2A878"; B6: "#121110"
    }
  }
}
```
(The exact meaning of each N/B slot needs to be checked against D2's colour-code chart before relying on this [V-doc: the slots exist and can be overridden; the slot-to-element mapping is not verified here]. Theme ids are placeholders, so confirm them with `d2 --list-themes`.) Then either keep D2's own light/dark switching, or run the §4.3 colour map with **both** the light and dark hex maps pointing to the same variables (cleaner: set `dark-theme-id` off and map light hexes only). Set `--font-regular`/`--font-bold` via the D2 CLI font flags **[I]**, or strip fonts in the build.

**Mermaid (only where the content already lives in Markdown):**
```
%%{init: {"theme":"base","themeVariables":{
  "background":"#FBF9F4","primaryColor":"#F4F0E8","primaryTextColor":"#1B1A17",
  "primaryBorderColor":"#CFC8BA","lineColor":"#8A857B","secondaryColor":"#F1E7DC",
  "tertiaryColor":"#FBF9F4","fontFamily":"inherit","fontSize":"14px"}}}%%
```
Hex only [V-doc], so render at build time (`@mermaid-js/mermaid-cli`) and pass the output through the same colour map. **Don't** render Mermaid client-side; that would mean a JS payload and no token mapping. Mermaid's default arrowheads are filled triangles, so override the `marker` path in the post-process to match the open chevron.

---

## 5. Five example diagrams described with the kit

### 5.1 The agent loop (`agent-loop`)
- **Layout:** wide 720×360; the narrow variant is a vertical column.
- **Left:** a **human pill** "You" / "你". **Centre:** a large **model node** (double border, focus: accent border + tint) labelled "Model" with the secondary line "decides the next step" / "决定下一步". **Right:** a vertical stack of 3 **tool nodes** in mono (`read_file()`, `run_tests()`, `search()`), in a dashed **group** "TOOLS" / "工具".
- **Connectors:** You → Model sync solid, badge ①. Model → Tools **highlighted accent path** (1.75px), badge ② "tool call". Tools → Model return line offset 8px, badge ③ "result". A **loop arc** (300°) under the Model, in accent, labelled "repeat until done" / "直到完成". Model → You solid, badge ④ "final answer".
- **Caption:** "Figure 1 The agent loop: the model keeps choosing a tool, reading the result, and deciding again — until it can answer."
- **Text version:** ①–④ as a list.

### 5.2 Tool calling, zoomed in (`tool-call-anatomy`)
- **A sequence diagram** (the Anthropic Fig. 2 idea, restyled). Lifelines: **App** (service), **Model** (model node), **Tool** (tool, mono `get_weather()`). The header nodes sit at the top only (no repeated footer: less clutter).
- Messages: ① App → Model "messages + tool schemas" (data-flow: dot at source). ② Model → App **accent** "tool_use {city: "Kuala Lumpur"}" with a mono payload in a 4px-radius chip below the line. ③ App → Tool sync. ④ Tool → App return. ⑤ App → Model "tool_result". ⑥ Model → App "final text".
- The key teaching point is the **annotation callout** with an accent dot on ②: "The model never runs the tool — your code does." / "模型不会自己执行工具，执行的是你的代码。"
- Lifelines: 1px dashed `--dg-border-strong`.

### 5.3 The context window (`context-window`)
- A long horizontal **token strip** (`.dg-tokens`) of about 48 12px cells inside a group with a radius-12 dashed border labelled "CONTEXT WINDOW · 200K TOKENS" / "上下文窗口 · 200K token".
- Segments are shown by **lightness only**, not hue: system prompt (ink 70%), tool definitions (ink 50%), conversation history (ink 30%), retrieved docs (ink 20%). The **latest user message** segment is **accent**. Each segment has a thin bracket with a label below in 12px muted.
- To the right, past the dashed border, a few "overflow" cells in `--dg-border` with a dotted connector to a **stacked-sheets store** "summary / memory" / "摘要 / 记忆", showing what happens when it fills up.
- **Build-up version (interactive, optional):** a stepper that adds segments one at a time. Earlier segments dim to .45, respecting `prefers-reduced-motion` (no animated movement, just state changes).

### 5.4 RAG (`rag-pipeline`)
- **Two horizontal bands** in containers: top "INDEX (ahead of time)" / "建立索引（预先）", bottom "QUERY (every request)" / "查询（每次请求）". This is the Contextual Retrieval two-panel idea, but **neutral panels** with a `--dg-surface-2` fill.
- **Top:** stacked-sheets "Documents" → "Chunk" (service) → **model node** "Embedding model" → **cylinder** "Vector index". Data-flow connectors (dot at source), all neutral.
- **Bottom:** human "Question" → "Embed question" → a dotted connector *up* into the cylinder (labelled "top-k similar chunks") → **LLM model node (focus)** → "Answer".
- **Highlight rule:** the accent goes only on the path **retrieved chunks → LLM prompt**, because that is what the post teaches. A callout reads "retrieved text is pasted into the prompt" / "检索到的内容会被放进提示词".
- **Narrow variant:** the two bands stack vertically; the cylinder is shared at the join.

### 5.5 Multi-agent orchestration (`orchestrator-workers`)
- **Top:** an **agent node** "Lead agent" / "主智能体" with a mono kicker `orchestrator`, and a secondary line "plans, delegates, merges".
- A fan-out on **cubic curves** (the only curves in the kit) to 3 **agent nodes** "Subagent A/B/C" in a dashed group "RUNS IN PARALLEL" / "并行运行". Each has a small **loop arc** underneath (they search iteratively) and **async dashed** spawn edges (fire-and-forget).
- Fan-in: solid return lines, converging on a 4px dot "merge point", then into the lead agent.
- On the right: a **stacked-sheets store** "Memory / plan" linked to the lead agent by sync + return parallel lines.
- **Accent:** only subagent B and its return path, with a callout "each subagent has its own clean context window" / "每个子智能体都有独立、干净的上下文窗口". This links back to Figure 5.3 visually (use the same mini token strip inside subagent B).
- **Caption** credits the idea: "Adapted from Anthropic (2025), How we built our multi-agent research system."

---

## 6. Open questions for the owner

1. **Diagram typeface:** keep Signika (brand consistency, softer look) or add a neutral grotesk (Inter / IBM Plex Sans / Geist) just for diagram labels? What is the body text font, if not Signika?
2. **Actual text column width** and whether a `wide`/`full` figure breakout is acceptable in the blog layout.
3. **Accent contrast:** OK to add a darker `--dg-accent-ink` (~#7A5A3F) for clay-coloured *text* in light mode, and a lighter `--dg-muted` for dark mode? The current #5E5A52 on #121110 is very low contrast.
4. **Narrow layouts:** is producing a portrait variant for every flagship figure worth the effort (2 languages × 2 layouts = 4 exports), or should notes use horizontal scroll?
5. **Terminology policy for zh:** keep "Agent / token / RAG / LLM" in Latin, or translate (智能体 / 词元 / 检索增强生成 / 大模型)? This affects node widths.
6. **Hand-drawn notes:** Excalifont (hand-drawn) or Nunito (clean) for Excalidraw notes? The site already has a script font ("Nothing You Could Do"); should hand-drawn notes echo it, or stay separate?
7. **Interactivity budget:** static SVG only for v1, or allow stepper/"build-up" figures (Comeau/Ciechanowski style) for flagship posts?
8. **Photography tie-in:** use a subtle signature motif (e.g. the aperture glyph for the model node, film-frame proportions for panels), or keep the diagrams purely neutral?
9. **Figma plan:** do you have Figma string variables and multiple modes (needed for single-source EN/ZH artboards)? If not, keep duplicate frames per language.
10. **Source of truth:** should the `.fig`/`.excalidraw`/`.d2` sources live in the repo (e.g. `content/diagrams/src/`) with the build pipeline, or only the exported SVGs?
11. **OG/social images:** do diagrams also need raster exports (text outlined) for link previews or newsletters, where CSS variables won't apply?

---

### Sources
- Anthropic: https://www.anthropic.com/engineering/building-effective-agents · https://www.anthropic.com/engineering/multi-agent-research-system · https://www.anthropic.com/news/contextual-retrieval
- OpenAI (blocked, not verified): https://openai.com/index/unrolling-the-codex-agent-loop/ · https://openai.com/index/harness-engineering/
- Vercel: https://vercel.com/blog/life-of-a-vercel-request-what-happens-when-a-user-presses-enter
- Cloudflare: https://blog.cloudflare.com/workflow-diagrams/ · https://blog.cloudflare.com/thinking-about-color/
- Linear: https://linear.app/now/how-we-redesigned-the-linear-ui
- Stripe (no diagrams found): https://stripe.com/blog/online-migrations
- Ciechanowski: https://ciechanow.ski/gps/
- Comeau: https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/
- Lilian Weng: https://lilianweng.github.io/posts/2023-06-23-agent/
- Jay Alammar: https://jalammar.github.io/illustrated-transformer/
- Distill: https://distill.pub/guide/
- Excalidraw: https://github.com/excalidraw/excalidraw/pull/8530 · https://plus.excalidraw.com/blog/adding-hand-drawn-font-for-chinese-japanese-korean · https://deepwiki.com/excalidraw/excalidraw/5.2-svg-export-and-rendering · https://aldur.blog/micros/2025/07/13/exporting-excalidraw-svgs-and-inverting-their-colors-in-dark-mode/
- tldraw: https://tldraw.dev/sdk-features/styles · https://tldraw.dev/sdk-features/image-export
- Mermaid: https://mermaid.js.org/config/theming.html
- D2: https://d2lang.com/tour/themes/
- Figma export settings: https://help.figma.com/hc/en-us/articles/13402894554519-Export-formats-and-settings
