# 06 — Playful zone: three.js, pixel art, game-like and anime-inspired interaction

Research date: 2026-09-16. Scope: long-term "playful zone" for chongweikhang's site (Angular 21 + Tailwind 4, Cloudflare Workers free tier, EN/简体中文), without undermining the calm, cinematic, editorial main site.

**Verification key**
- **[V]** verified: I fetched the page, or the site's details come from a page I fetched or a search result that describes it directly.
- **[V-3p]** the site exists and is described by a third-party writeup I fetched (creativedevjobs.com, 80.lv, webgpu.com). I did not load the WebGL itself.
- **[I]** inferred: my own engineering judgement, not stated by the source.

**Repo facts that shape this (read from the repo, not edited)**
- `src/main.ts` already lazy-loads every route with `loadComponent`, so adding `/play` the same way is natural.
- `path: '**'` redirects to `''`. **There is no 404 page yet**, so a "404 mini-game" would first need a real 404 route. It would also need a real 404 status from the Worker, because a soft-404 redirect hurts SEO.
- `angular.json` has an `initial` budget of 900 kB (warning) and 1.5 MB (error). A lazy chunk does not count toward that budget, but three.js must never end up in the initial bundle.
- The site builds with `@angular-devkit/build-angular:application` and has no `outputMode`/prerender config yet. The growth plan calls for SSG, so the guidance below assumes prerendering is added.

---

## 1. Reference sites (14)

| # | Site | Interaction | Tech | Perf approach | A11y / fallback | Isolation from content | Steal / avoid |
|---|------|-------------|------|---------------|-----------------|------------------------|---------------|
| 1 | **Bruno Simon — folio 2025** https://bruno-simon.com/ [V] · source https://github.com/brunosimon/folio-2025 [V] | You drive a physics toy car around a world, discover content areas, unlock achievements and a daily circuit, and leave 30-character "whispers" for other visitors. | three.js `three/webgpu` + TSL (runs on WebGPU with WebGL fallback), Rapier3D WASM physics, GSAP, Howler, Vite [V] | Two-phase load: minimal palette and respawn assets first, then vehicle, world models and physics in parallel. Quality settings scale the post-processing chain (bloom/DoF). Heavy use of instancing. [V deepwiki] | HTML UI for Options, Controls (keyboard, mobile, gamepad) and Achievements [V]. No non-3D content path; the whole site is the game. | None. The portfolio *is* the game. | **Steal:** two-phase loading, a quality toggle, the achievements/secrets loop (very MMORPG), CC0 music commissioned for the site. **Avoid:** making the game the only way in. That is wrong for a photographer whose SEO depends on photos and text. |
| 2 | **Messenger (abeto)** https://messenger.abeto.co [V-3p] | Relaxing multiplayer mail delivery on a tiny spherical planet. Players customise clothes and hair and can only talk with emoji. | three.js + three-mesh-bvh (collision), Houdini/Blender/Substance assets, Node WebSocket multiplayer [V-3p] | About 5.7 MB initial and a 17.5 MB total cap. Reported smooth on mobile. [V-3p webgpu.com] | Unknown. | Standalone game on the studio's domain. | **Closest tonal match to "calm + anime + MMORPG"**: a cel-shaded, Jet Set Radio / Ghibli-ish look, a soothing soundtrack, low-stakes play. **Steal:** emoji-only social contact (no moderation burden), the "cozy" pacing. **Avoid:** real-time multiplayer on the free tier. Durable Objects are possible but add scope. |
| 3 | **Jordan Breton** https://jordan-breton.com/ [V] | A floating island (grass, waterfall, fire, butterflies). The camera moves between fixed points instead of free roam. FWA of the Day, 2 Oct 2025 [V]. | three.js [V] | Loading percentage and "Initializing…" state [V]. Fixed camera points limit what needs rendering. [I] | **Real HTML content ships alongside the 3D** (nav anchors, bio, services, contact) [V]. There is no explicit low-quality mode or sound toggle [V]. | HTML text layered on the 3D scene. | **Steal:** fixed-point camera, which suits touch, reduced motion and keyboard users because each point can be a focusable button. Also steal HTML content that crawlers can read. This is the best pattern for /play. |
| 4 | **Henry Heffernan** https://henryheffernan.com/ [V] | A 90s-style 3D room. Zoom into the CRT monitor and a working "inner OS" website runs on the screen. | React + three.js with a CSS3D overlay, which puts a real DOM site inside the 3D monitor. Open source: henryjeff/portfolio-website, portfolio-inner-site [V] | Unknown. | The inner site is real DOM, so its text is selectable and readable. [I] | The 3D room is a frame around a normal site. | **Steal:** "the 3D world is a frame; the content is still HTML". **Avoid:** copying it outright. It is one of the most cloned portfolios [V: several forum clones]. |
| 5 | **WoraWork** https://worawork.vercel.app [V-3p] | You control a character through a cozy house and garden inspired by *Zelda: A Link Between Worlds* and *Animal Crossing*. | three.js [V-3p] | Unknown. | Unknown. | Whole site. | A good "inspired by, not copied from" example: the style evokes Nintendo without using its characters. |
| 6 | **Thibault Introvigne** https://thibault-introvigne.com [V-3p] | You control a spaceman in a colourful world and collect items. | three.js + React Three Fiber [V-3p] | Unknown. | Unknown. | Whole site. | Collectibles map neatly onto "collect a photo series" quests. |
| 7 | **Jay Ransijn** https://jayransijn.com [V-3p] | A 3D world with a character, a dog you can play fetch with, a bike and driving. | three.js [V-3p] | Unknown. | Unknown. | Whole site. | Small NPC-style interactions (a Penang cat? an uncle at a hawker stall?) add charm cheaply. |
| 8 | **Sébastien Lempens** https://sebastien-lempens.com [V-3p] | Scroll-driven tour through a 3D Paris: first person, riding a scooter, skydiving. | three.js [V-3p] | Scroll-driven, so the camera is on rails and the scene budget is predictable. [I] | Scroll input works with keyboard and touch. [I] | Whole site. | **A city as the portfolio**. This is the "Penang-inspired map" idea on rails, which is far cheaper than free roam. |
| 9 | **JSLegendDev 2D portfolio** https://jslegenddev.github.io/portfolio/ [V] · https://github.com/JSLegendDev/2d-portfolio-kaboom [V] | A top-down pixel-art RPG room. Walk up to objects and a dialogue box shows portfolio info. Includes a full YouTube tutorial. | Kaboom.js / KAPLAY, Tiled maps, a modified itch.io tileset (momen-games) [V] | 2D canvas and tiny assets. | Canvas only. [I] | Whole site. | **Steal:** the Tiled-map-plus-dialogue-box RPG pattern. It is the lowest-effort way to get "MMORPG vibes" and a good first learning project. Tutorial: https://jslegenddev.substack.com/p/how-to-use-tiled-with-kaboomjs [V] |
| 10 | **TheYellowDuck pixel museum** https://github.com/TheYellowDuck/portfolio-website [V] | A pixel-art museum you walk through. Exhibits open projects. "Ghost" multiplayer presence shows other visitors. | Custom HTML5 Canvas engine (y-sorted 2.5D draw, collision, A*, particles) + Next.js 16 [V] | Canvas 2D. | **"Content-first web portfolio + game"**: a normal site plus the game [V]. | Separate game layer over content-first pages. | **Steal:** content-first plus game, and "ghost" presence (asynchronous, so no realtime server is needed). This is the model to copy. |
| 11 | **Robby Leonardi interactive résumé** https://rleonardi.com/interactive-resume/ [V] | A Super Mario-style side-scroller. Scrolling runs, jumps and swims through his career. Won FWA and Awwwards [V]. | Canvas/DOM animation. Making-of: https://thefwa.com/article/the-making-of-robby-leonardi-s-interactive-resume [V] | Scroll-driven. | Scroll works for everyone. [I] | Lives at a sub-path of a normal designer site, so the **main site stays conventional** [V: separate `/interactive-resume/` path]. | **Precedent for pattern (a):** a calm main site plus a separate playful route. |
| 12 | **Maxime Heckel's blog** https://blog.maximeheckel.com/ [V] | Long-form articles with embedded interactive R3F/shader playgrounds, e.g. "The Study of Shaders with R3F" (8 scenes) and "Field Guide to TSL and WebGPU" [V]. | React Three Fiber, GLSL/TSL, Sandpack live code [V] | Scenes sit inside articles. Lazy mounting is inferred [I]. | Prose carries the meaning and the 3D illustrates it. [I] | Scoped widgets inside editorial text. | **Model for pattern (d):** AI concepts explained with interactive figures, with the essay staying calm and readable. |
| 13 | **Bartosz Ciechanowski** https://ciechanow.ski/ [V] | Long explanatory essays (e.g. "Moon", Dec 2024) with draggable, slider-driven 3D figures [V]. | Custom WebGL (implementation not documented on the page) [V: not stated] | Figures appear inline. | Text-first. Every figure is optional to the argument. [I] | Editorial page with figures. | **Gold standard for calm + interactive**: minimal chrome, figures earn their place. It matches "Calm · Editorial" better than any game portfolio. |
| 14 | **Rauno Freiberg — /craft** https://rauno.me/craft [V] | A minimal personal site with a separate "craft" playground of experiments (gooey shader, spatial tooltip, radial menu) and essays [V]. | Mixed web + SwiftUI [V] | Unknown. | Unknown. | **Separate section** of an otherwise quiet site [V]. | **Model for the isolation strategy:** quiet homepage, an opt-in lab. Label /play the same way ("Lab" / "游乐场"). |

**Technique references (not portfolios)**
- three.js official pixel post-process example (isometric pixel scene with edge highlights): https://threejs.org/examples/webgl_postprocessing_pixel.html [V]. Docs: `RenderPixelatedPass(pixelSize, scene, camera)` with `normalEdgeStrength` (default 0.3) and `depthEdgeStrength` (default 0.4) [V]. The WebGPU/TSL equivalent is `PixelationPassNode` [V].
- David Holland, "3D Pixel Art Rendering": low-res render (e.g. 640×360), camera snapped to a texel grid with a screen-space shift to kill "pixel creep", 4-texel depth/normal edge outlines with convex-edge highlights, cel shading, upscale. Built in Godot, but the maths ports to three.js. https://www.davidhol.land/articles/3d-pixel-art-rendering/ [V]
- KodyJKing/hello-threejs: t3ssel8r-style 3D pixel-art shader with outlines in three.js. https://github.com/KodyJKing/hello-threejs [V]
- Anime shading: `MeshToonMaterial` with a `gradientMap` https://threejs.org/docs/pages/MeshToonMaterial.html [V]; Maya Ndljk's custom toon shader tutorial https://www.maya-ndljk.com/blog/threejs-basic-toon-shader [V]; anime shading demo https://zaneatega.github.io/Three-js-Anime-Shader/ [V]. Outlines use the inverted-hull method: render again with front-face culling, extrude along normals, draw black [V].
- VRM anime avatars: `@pixiv/three-vrm` (MIT) loads VRM models into three.js [V]. It is useful if the owner builds a VRoid-style self-avatar. Each VRM file carries its own usage licence, so check that separately [I].
- The Three.js Journey "Isometric Room" challenge (community examples): https://threejs-journey.com/challenges/009-isometric-room [V]

---

## 2. Integration patterns, ranked

Scores run 1–5, where 5 is best for this site. "Brand" means fit with Calm · Cinematic · Editorial.

| Rank | Pattern | Brand | SEO | A11y | Perf (main pages) | Effort (5 = least) | Learning | Verdict |
|------|---------|-------|-----|------|-------------------|--------------------|----------|---------|
| 1 | **(c) Small ambient touches**, done carefully: a pixel loading sprite on /play only, a real 404 page with a tiny optional mini-game, a pixel "signature" favicon on hover | 4 | 5 | 4 | 5 (if CSS/tiny canvas, no three.js) | 5 | 2 | **Do first.** Sets up the visual language. Skip a cursor trail on photo pages: it competes with the photos and is noise for screen-magnifier users. |
| 2 | **(b) Hidden easter egg** (Konami code, or click the signature 5×) that reveals a door to /play | 4 | 5 (no content hidden from crawlers) | 3 (discoverability; must also have a visible link somewhere, e.g. footer "Lab") | 5 (listener ~0.5 kB; everything lazy) | 5 | 2 | **Do with (c).** It rewards curious visitors, the MMORPG "secret area" feeling. It must not be the *only* entry point. |
| 3 | **(d) Interactive figures in AI blog posts** (agent loop as a game loop: sense → think → act tick; tokens as items; tool calls as skills with cooldowns) | 5 | 5 (prose is prerendered; figure is enhancement) | 4 (figure needs text alt + step controls) | 4 (`@defer (on viewport)`; posts only) | 3 | 5 | **Highest value to the "AI builder" identity.** Posts are indexable and AEO-friendly. It can start as 2D canvas/SVG with pixel sprites and needs no three.js. |
| 4 | **(a) Separate lazy `/play` route** ("Penang pixel world": walk an avatar around a George Town-inspired map where the clock tower is About, a shophouse gallery is Photos, a kopitiam is Blog, a jetty is Contact) | 3 (isolated, so it doesn't harm) | 3 (the route itself is thin for SEO; give it a prerendered text shell + `noindex` or a proper descriptive page) | 3 (must provide a "list view" / skip link to every portal) | 5 (separate chunk; zero cost unless visited) | 1–2 | 5 | **The long-term dream. Build it last**, after the engine skills have grown through (c) and (d). Start as 2D (KAPLAY/Pixi), then consider a 3D pixel-shaded version. |
| 5 | **(e) Photo series in a 3D gallery space** | 2 (3D frames usually make photos look *worse*: perspective, compression, lighting shifts colour) | 2 (duplicate of the real gallery) | 2 | 3 | 2 | 4 | **Lowest priority.** The photo is the protagonist, and a flat, colour-accurate grid respects it more. If done, make it one themed exhibition (e.g. a "Night Market" series in a pixel shophouse) that links out to the real gallery, not a replacement. |

Notes per pattern [I]:
- **(a) SEO:** prerender `/play` as a real HTML page ("Explore Penang World: an interactive pixel map of Wei Khang's work") with a `<noscript>` and a normal link list to Photos, Blog, About and Contact. The canvas mounts only on the client. Decide whether it should be indexed; indexing is fine if the text shell is genuinely useful.
- **(a) Bilingual:** keep in-game dialogue in the same i18n files as the site, and use a pixel font that has CJK glyphs. Many pixel fonts are Latin-only. Fusion Pixel / Ark Pixel cover CJK but their licences were not checked here, so verify before use.
- **(b):** skip the Konami listener when focus is in inputs, and never hijack arrow keys on the main pages.
- **(d):** each figure needs Play/Pause/Step buttons, a text caption that states the whole idea, and a static SVG poster frame shown under `prefers-reduced-motion`.

---

## 3. Technical guidance: Angular 21 + SSG + Cloudflare

### 3.1 Bundle sizes (measured locally)
I measured these on 2026-09-16 with esbuild 0.28 `--bundle --minify --format=esm`, reporting `gzip -9` sizes. Each test was a realistic minimal usage file, not a bare import. Angular's builder uses esbuild too, so real numbers will be close.

| Library (version) | What was imported | min | **gzip** |
|---|---|---|---|
| three 0.186.0 | WebGLRenderer, Scene, Camera, Mesh, BoxGeometry, MeshToonMaterial, DirectionalLight | 535 kB | **134 kB** |
| three 0.186.0 | above + EffectComposer + RenderPixelatedPass + GLTFLoader + Meshopt decoder | 657 kB | **167 kB** |
| three 0.186.0 | `import * as THREE` (whole namespace) | 746 kB | **191 kB** |
| ogl 1.0.11 | Renderer, Camera, Transform, Program, Mesh, Box | 49 kB | **14 kB** |
| pixi.js 8.20.1 | Application, AnimatedSprite, Assets, nearest scale mode | 571 kB | **167 kB** total (split into many chunks when code-splitting; largest ≈22 kB gz) |
| kaplay 3001.0.19 | kaplay(), loadSprite, sprite/pos/area/body | 189 kB | **69 kB** |
| phaser 4.2.1 | `new Phaser.Game()` | 1,395 kB | **369 kB** |

Takeaways [I]:
- **three.js tree-shakes poorly.** The WebGLRenderer pulls in most of the core, so budget about 130–170 kB gz for any 3D. That is fine for a lazy route and not fine for the homepage.
- **OGL (14 kB)** suits tiny shader toys: an ambient hero effect, a single pixelation shader, a figure in a blog post. It has no loaders or post-processing ecosystem.
- **KAPLAY (69 kB)** is the sweet spot for a 2D pixel RPG /play v1 (Tiled maps, sprites, collision, dialogue).
- **Pixi v8** is a strong 2D renderer (you add your own game logic). It is heavier than KAPLAY once assembled.
- **Phaser** is the fullest 2D engine but 5× KAPLAY. It is only worth it if /play becomes a real game.
- WASM physics (Rapier) adds hundreds of kB. A top-down RPG does not need it; use tile or AABB collision.

### 3.2 Keeping three.js off the main pages
1. **Route-level:** `{ path: 'play', loadComponent: () => import('./app/play/play.component') }`. This matches the existing `src/main.ts` pattern, and three.js lands in that route's chunk only [V pattern in repo].
2. **Inside the component, import the engine dynamically** after mount, not at the top of the file, so even the /play HTML shell renders before the engine downloads:
   ```ts
   afterNextRender(async () => {
     if (!canWebGL() || reduceMotion()) return showStaticMap();
     const { startWorld } = await import('./engine/world'); // three/kaplay live only here
     startWorld(this.canvas().nativeElement, { signal: this.abort.signal });
   });
   ```
   `afterNextRender` only runs in the browser, so prerender never touches `window`/WebGL [I, standard Angular SSR guidance]. Tear down on destroy: `renderer.dispose()`, geometries, textures, `renderer.forceContextLoss()`, and cancel the rAF loop.
3. **`@defer` for embedded figures (d) and the easter egg (b).** Per the Angular docs, during SSR/SSG `@defer` blocks render only their `@placeholder`, and triggers are not invoked [V]. So:
   ```html
   @defer (on viewport; prefetch on idle) {
     <app-agent-loop-figure />
   } @placeholder {
     <img src="/assets/figures/agent-loop-poster.svg" alt="Agent loop: observe → plan → act → observe" />
   }
   ```
   Put the real explanatory text *outside* the defer block so crawlers and LLMs read it. Triggers: `viewport`, `interaction`, `hover`, `idle`, `immediate`, `timer`, `when` [V]. For the "Enter world" button use `@defer (on interaction)`.
4. **Guard with budgets.** Add an `anyScript` or bundle-size check in CI so a stray `import 'three'` in a shared service fails the build. Run Lighthouse CI on `/` and `/about` to confirm no regression [I].
5. **Don't preload** the /play chunk from the main nav. Angular's default router preloading is off unless configured; keep it that way, or use a custom strategy that excludes `play` [I].

### 3.3 Pixel-art rendering techniques
- **2D pixel art (KAPLAY/Pixi):** author at native resolution (16×16 or 32×32 tiles), then render to a fixed low-res canvas (e.g. 320×180 or 480×270) and scale by an integer factor. Use CSS `image-rendering: pixelated`, nearest-neighbour sampling (Pixi: `TextureStyle.defaultOptions.scaleMode = 'nearest'`; KAPLAY: `crisp`/`letterbox` options), and round the camera to whole pixels to avoid shimmering [I].
- **3D rendered as pixel art (three.js):**
  - Cheapest: render into a small `WebGLRenderTarget` (e.g. width/4) with `NearestFilter`, then draw it full-screen. Or call `renderer.setPixelRatio(1/4)` and apply CSS `image-rendering: pixelated` on the canvas [I].
  - Better: `RenderPixelatedPass`, which adds pixelation plus depth/normal edge outlines [V].
  - Best (t3ssel8r look): orthographic camera snapped to the texel grid with sub-pixel screen offset, convex-edge highlights, cel lighting, limited palette [V Holland].
  - **Dithering:** an ordered Bayer-matrix dither in the final pass, plus quantising to a palette LUT texture. This gives a cohesive "SNES" palette and pairs with Penang's colours (shophouse pastels, teal sea, sunset orange) [I].
- **Anime / cel look:** `MeshToonMaterial` with a 3–4 step `gradientMap` (NearestFilter) [V docs], inverted-hull outlines [V], flat rim light, and a painterly sky gradient. Use Messenger as the tonal reference [V-3p].
- **Sprite sheets:** Aseprite exports a JSON + PNG atlas that Pixi (`Assets.load` of spritesheet JSON) and KAPLAY (`loadAseprite`) consume directly [I; the KAPLAY animation article https://jslegenddev.substack.com/p/how-animations-work-in-kaplay is V]. Keep each atlas ≤ 2048² for mobile GPUs [I].
- **Maps:** Tiled (`.tmj` JSON) works with KAPLAY [V JSLegendDev tutorial] and with Pixi via community loaders [I].

### 3.4 Asset pipeline [I unless noted]
- **2D:** Aseprite (paid, or build from source) or LibreSprite/Pixelorama (free) → PNG atlas + JSON → `oxipng` lossless. Pixel art compresses very well as PNG; avoid lossy WebP or AVIF, which smear the pixels.
- **3D:** Blender → glTF 2.0 (`.glb`) → `gltf-transform optimize --compress meshopt --texture-compress ktx2` (Meshopt decodes faster than Draco and its decoder is small; KTX2/Basis cuts GPU memory). For pixel-3D, use tiny palette textures (e.g. a 32×1 px palette strip that every mesh UV-maps into), which is the same trick Bruno Simon's palette texture uses [V: "palette texture" loaded in phase 1].
- **Budgets:** /play initial download ≤ 1 MB (engine + first map), total ≤ 5 MB. Messenger ships 5.7 MB initial and 17.5 MB total with a pro studio [V-3p], so a solo project should aim well under that.
- **Hosting:** serve game assets from R2 behind a custom domain or a Worker route with long `Cache-Control: public, max-age=31536000, immutable` and hashed filenames, so they are cached at the edge and reads stay within free-tier limits. See `docs/cloudflare-free-tier.md` for the exact limits, which were not re-verified here. Small atlases (under ~200 kB) can just live in the Workers static assets.
- **Audio:** off by default, with a visible mute toggle. Use Opus/OGG with an MP3 fallback and load only after the user presses "Enter world" (browsers block autoplay anyway).

### 3.5 Motion, accessibility, fallback [I]
- **`prefers-reduced-motion: reduce`:** do not auto-start the world. Show a static illustrated pixel map (a prerendered PNG) where the buildings are ordinary links, and offer an explicit "Play anyway" button. In-game, disable camera shake, parallax and screen flashes, and use cuts instead of camera flights.
- **No WebGL / low-end device / Save-Data:** fall back to the same static map. Detect with `canvas.getContext('webgl2')`, `navigator.connection?.saveData` and `deviceMemory < 4`.
- **Keyboard:** WASD/arrows to move, Enter to "talk"/enter, Esc for the menu. Provide a **"Fast travel" menu**, an HTML list of all portals that works with a screen reader. It is also diegetic MMORPG UI, a teleport list.
- **Focus & live regions:** dialogue boxes go in an `aria-live="polite"` DOM element, not only canvas text. The canvas gets `role="img"` + `aria-label`, or `aria-hidden` when the DOM alternative exists.
- **Touch:** tap-to-move with pathfinding (A* on the tile grid) is kinder than a virtual joystick and more "MMORPG click-to-move". Add a floating "Menu" button. Use `touch-action: none` only on the canvas, and pause when the tab is hidden (`visibilitychange`).
- **Seizure safety:** no flashes above 3 per second (WCAG 2.3.1).
- **Exit:** a persistent "← Back to site" button in the top-left, plus the language switcher.

---

## 4. Copyright and licensing

**Style is fine; specific expression is not [I, general copyright principle, not legal advice].**
- **OK:** "inspired by" 16-bit JRPG/MMORPG UI (HP bars, quest logs, minimaps), anime cel shading, chibi proportions, and Ghibli-like warmth, all drawn by you or from licensed packs.
- **Not OK:** characters, sprites, logos, UI rips, music or sound effects from Ragnarok Online, MapleStory, Final Fantasy, Pokémon, Studio Ghibli films and the like. This includes "fan art" of those characters, fonts ripped from games, and screenshots used as textures. Avoid names that imply endorsement too.
- **AI-generated sprites:** usable, but check the tool's terms, and don't prompt for named copyrighted characters or specific living artists' styles [I].
- **Self-avatar:** a chibi Wei Khang with a camera is the best mascot. It is ownable and personal.
- **Penang landmarks:** drawing public buildings (the clock tower, clan jetties, shophouses) is generally fine as art. Avoid trademarked logos and signage of real businesses [I].

**Licensed asset sources**

| Source | Licence (verified) | Attribution | Notes |
|---|---|---|---|
| **Kenney** https://kenney.nl | CC0: "all game assets on the asset pages are public domain licensed (CC0) … even in commercial projects" [V kenney.nl/support] | Not required; "Kenney" credit welcome. **Don't use the Kenney logo** [V] | Huge pixel, UI, tiny-town and 3D packs. Safest starting point. |
| **KayKit (Kay Lousberg)** https://kaylousberg.itch.io | CC0, free for personal/commercial use, no attribution; don't resell unmodified or claim as your own [V search/itch pages] | No | Low-poly 3D, rigged and animated adventurers, glTF included. Works with toon shading. |
| **Quaternius** https://quaternius.itch.io | CC0 [V quaternius itch pages + poly.pizza bundles; the licence text itself was not opened] | No | Low-poly nature, buildings, animated characters. Re-check the licence file in each download. |
| **itch.io, filtered by licence** https://itch.io/game-assets/assets-cc0/tag-pixel-art [V] | Per-asset. Use the **"assets under CC0" licence filter** (`/assets-cc0/`), not the user tag `/tag-cc0/`, which is only a tag [V both URLs exist; the distinction is I] | Varies | Always open the asset page and save a screenshot of the licence at download time. |
| **OpenGameArt: Liberated Pixel Cup (LPC)** https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles [V] | Dual **CC-BY-SA 3.0 / GPL 3.0**; some contributors have CC-BY versions; per-image authors listed in CREDITS.TXT [V] | **Required** (title, author, licence, link, changes) [V] | ShareAlike: your derivative *art* must be CC-BY-SA as well. Workable, but keep a credits page. The LPC character generator is great for RPG avatars. |
| **Poly Pizza** https://poly.pizza | Not stated on the homepage [V]. Individual models are a mix of CC0 and CC-BY [I, check per model] | Varies | Convenient glTF downloads. |
| **Mixamo (Adobe)** https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html | Royalty-free for personal/commercial/non-profit projects including games; **no redistribution of raw character/animation files** [V] | Not required [V] | Fine inside a shipped /play. Don't publish raw FBX in a public repo or R2 bucket listing. Ship baked `.glb` only [I]. |
| **Bruno Simon folio-2025 music** | CC0 tracks by Kounine [V search result] | No | A calm, adventurous soundtrack option. |

Keep a `CREDITS.md` or a `/play/credits` page with each asset, its URL, licence and download date. It's cheap insurance [I].

---

## 5. Phased roadmap (tiny → full world)

| Phase | Deliverable | Tech | Size budget | Learning goal |
|---|---|---|---|---|
| **0 (after core site + SSG ship)** | Define the "Pixel Penang" visual language: a 16-colour palette derived from existing brand tokens, a 32×32 chibi self-avatar with a camera (idle + walk, 4 directions), one pixel font with CJK support. Nothing shipped. | Aseprite / Pixelorama | — | Pixel art fundamentals, sprite sheets |
| **1** | **Real 404 page** (Worker returns status 404) with the avatar idling and a tiny "catch the shutter" mini-game. Reduced motion shows a static sprite. | Canvas 2D, no library (or OGL) | ≤ 15 kB gz JS | Game loop, input, rAF lifecycle in Angular |
| **2** | **Easter egg:** Konami code or 5 clicks on the signature → avatar walks across the footer → "A secret door appeared" → link to `/lab`. Also add a visible footer "Lab / 游乐场" link. | Plain TS + CSS sprite animation | ≤ 3 kB gz | Event handling, reduced-motion branching |
| **3** | **First AI blog figure:** "The agent loop is a game loop". A pixel agent runs observe → think → tool → observe ticks with Step/Play controls and prerendered text. | `@defer (on viewport)`, Canvas 2D or KAPLAY | ≤ 80 kB gz, lazy | Explaining through interaction, a11y for figures |
| **4** | **`/play` v1: 2D pixel George Town.** One Tiled map (Armenian Street → clock tower → jetty), 4 portal buildings, NPC dialogue in EN/中文, Fast-travel menu, static-map fallback, prerendered text shell. | KAPLAY + Tiled; assets in Workers static or R2 | ≤ 250 kB initial, ≤ 2 MB total | Scene management, tile collision, i18n in games, touch tap-to-move |
| **5** | **Game-y layer:** achievements ("Visited all 4 districts", "Found the hidden cat"), stamp-card quest tied to real photo series, asynchronous "ghost" visitors or guestbook whispers stored in D1. | Existing Worker + D1 | Rate-limited API | Backend + game state; MMORPG-lite social without realtime |
| **6 (stretch)** | **`/play` v2: 3D pixel-shaded Penang.** Low-poly Blender shophouses (KayKit/Quaternius + custom), orthographic camera, `RenderPixelatedPass` or custom TSL pixel/dither/cel pipeline, fixed-point camera option (Jordan Breton style). Optional single themed 3D exhibition room (pattern e). | three.js (WebGPU/TSL with WebGL fallback), glTF + Meshopt/KTX2 from R2 | ≤ 1 MB initial, ≤ 5 MB total, 60 fps on a mid-range Android | Shaders, post-processing, 3D asset pipeline |

**Go/no-go checks before each phase ships [I]:** Lighthouse on `/` and `/about` is unchanged (±2 points, LCP delta < 100 ms); no `three`/`kaplay` in the initial chunk (`ng build --stats-json` + an esbuild analyzer); full reduced-motion walkthrough; keyboard-only walkthrough; iPhone SE-class device test.

---

## 6. Open questions for the owner
1. **Name and framing:** "Play", "Lab", "World" or "游乐场"? Should the nav show it, or only the footer plus the easter egg?
2. **2D or 3D first?** I recommend 2D (KAPLAY) for v1. Is the 3D look the actual dream, or is the MMORPG *feeling* (exploration, quests, secrets) what matters?
3. **Which MMORPG/anime *feeling* specifically?** Cozy (Animal Crossing / Messenger), nostalgic 2D (Ragnarok / MapleStory era), or cinematic cel-shaded (Ghibli / Genshin-like)? Each points to a different pipeline.
4. **Avatar:** a chibi self-portrait you draw, commissioned art, or a generic licensed character?
5. **Art time:** will you draw the pixel art yourself (bigger learning value, slower) or start with Kenney/KayKit CC0 and replace it later?
6. **Social features:** is asynchronous "ghost"/guestbook presence wanted? It needs moderation, rate limiting and privacy text.
7. **Indexing:** should `/play` be indexed with a descriptive text shell, or `noindex` so it never competes with Photos/Blog in search?
8. **Sound:** music at all? If so, CC0 or commissioned?
9. **Blog-figure priority:** do AI explainer figures (pattern d) matter more to your professional goals than the /play world? If yes, swap phases 3 and 4 for priority.
10. **Photos in 3D:** are you comfortable *not* putting the main gallery in 3D, and using at most one themed exhibition room that links to the real gallery?

---

## Sources
- Bruno Simon: https://bruno-simon.com/ · https://github.com/brunosimon/folio-2025 · https://deepwiki.com/brunosimon/folio-2025 · https://www.awwwards.com/brunos-portfolio-case-study.html
- Showcase roundup: https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025
- Messenger: https://80.lv/articles/deliver-mail-on-tiny-colorful-planet-in-this-relaxing-web-game · https://www.webgpu.com/showcase/messenger/
- Jordan Breton: https://jordan-breton.com/ · https://discourse.threejs.org/t/floating-islands-portfolio/70674
- Henry Heffernan: https://henryheffernan.com/ · https://threejs-journey.com/selection/henry-heffernan-portfolio
- JSLegendDev: https://github.com/JSLegendDev/2d-portfolio-kaboom · https://jslegenddev.substack.com/p/how-to-use-tiled-with-kaboomjs · https://jslegenddev.substack.com/p/how-animations-work-in-kaplay
- TheYellowDuck: https://github.com/TheYellowDuck/portfolio-website
- Robby Leonardi: https://rleonardi.com/interactive-resume/ · https://thefwa.com/article/the-making-of-robby-leonardi-s-interactive-resume
- Maxime Heckel: https://blog.maximeheckel.com/ · https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
- Bartosz Ciechanowski: https://ciechanow.ski/
- Rauno Freiberg: https://rauno.me/craft
- Pixel rendering: https://threejs.org/examples/webgl_postprocessing_pixel.html · https://threejs.org/docs/pages/RenderPixelatedPass.html · https://threejs.org/docs/pages/PixelationPassNode.html · https://www.davidhol.land/articles/3d-pixel-art-rendering/ · https://github.com/KodyJKing/hello-threejs
- Toon/anime: https://threejs.org/docs/pages/MeshToonMaterial.html · https://www.maya-ndljk.com/blog/threejs-basic-toon-shader · https://zaneatega.github.io/Three-js-Anime-Shader/ · https://github.com/pixiv/three-vrm
- Angular defer: https://angular.dev/guide/templates/defer
- Licences: https://kenney.nl/support · https://kaylousberg.itch.io/kaykit-adventurers · https://quaternius.itch.io/150-lowpoly-nature-models · https://itch.io/game-assets/assets-cc0/tag-pixel-art · https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles · https://lpc.opengameart.org/content/faq · https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html · https://poly.pizza/
- Bundle sizes: measured locally (esbuild 0.28.2, gzip -9) in the scratchpad `bundle/` folder.
