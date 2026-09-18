# 08 — samalive.co teardown (measured)

**Date:** 2026-09-18
**Why:** the owner wants the photo half to look like samalive.co. Report 01 only read its HTML; this one loads the real pages and measures them.
**Method:** headless Chrome (153) driven over the DevTools protocol; every number below comes from `getComputedStyle` / `getBoundingClientRect` at a 1440×900 and 390×844 viewport. Pages visited: `/` (= Portrait), `/landscape`, `/life`, `/presets`, `/about`, `/japan-25` (a series), and a lightbox URL (`/?itemId=…`). Our own home page was measured with the same script for comparison.

---

## 1. Measured facts

### Shell
| Thing | Value |
|---|---|
| Page background | `rgb(26,26,26)` — neutral dark grey, **not** black and not warm |
| Body text colour | `rgba(233,232,232,0.7)` |
| Header | 109px tall, **transparent**, `position: absolute` (floats over the gallery) |
| Nav font | proxima-nova, **11.93px**, weight 600, **letter-spacing 2px, UPPERCASE**, `rgb(235,235,235)` |
| Nav items | Portrait · Landscape · Automotive · Commissions · Cityscape · Life · About · Presets (+ Instagram, mail, cart icons on the right) |
| Logo | a script wordmark **image**, 152×66 |
| Headings on gallery pages | **none at all** (no `h1`/`h2`) |
| First photo starts at | **y ≈ 22px** — the grid begins above the header, which floats on top |

### Gallery
| Thing | Value |
|---|---|
| Grid width | 1240px of 1440 = **86.1%** of the viewport, centred |
| Gutters | **~5px** horizontal and vertical (measured 4.8–5.4) |
| Row heights | **569 / 616 / 825px** — rows vary; a single wide photo can be 825px tall |
| Row composition | 1 or 2 photos per row (occasionally 3), sized by aspect ratio, **no cropping** (`object-fit: fill` on exact-ratio boxes) |
| Corner radius / shadow | **0 / none** |
| Hover | `transition: all`, no transform, no zoom |
| Image sizes served | Squarespace `?format=500w / 1000w / 1500w`, **no `srcset`** — the size is picked per slot |
| Loading | mixed `eager` / `lazy` |
| Alt text | filenames (`20260510-IMG_2857 copy.webp`); the logo uses "SamAlive". **Report 01's "197 empty alts" was wrong** — they're not empty, they're just useless |
| Home page length | **112,293px**, 198 photos on one page, no pagination |

### Lightbox
- Near-black overlay over the page; the header stays visible on top.
- Photo fitted with wide margins (~1160×775 in a 1440×900 window).
- Thin `‹ ›` chevrons at the far left and right edges, `✕` top-right.
- **No caption, no counter, no thumbnails.**
- Each photo has its own URL (`/?itemId=…`), so photos are linkable.

### Page types
| Page | What it is | Measured |
|---|---|---|
| `/` = Portrait | One endless justified grid | 198 photos, no text |
| `/life` | Same, another stream | 114 photos, 74,744px tall |
| `/landscape` | **A series index**, not a grid of photos | 2-column cover cards ~600×310, ~4px gutters, the place/year label centred over the image in small uppercase letterspaced white: `JAPAN 26'`, `JAPAN 25'`, `EUROPE 23'`, `SWITZERLAND`, `DOLOMITES`, `AUSTRIA`, … |
| `/japan-25` | A series page | 74 photos, justified rows, **no title, no intro text, no captions** — 357 characters of text on the whole page |
| `/about` | Bio | Round portrait left, text right, **EN then 日本語 stacked on the same page** (no language switcher), lists clients and publications |
| `/presets` | A product page | Before/after images, buys through a Squarespace cart |

---

## 2. What that means (my read)

**Why it feels good:** there is almost nothing on screen but photographs. No headings, no captions, no cards, no radius, no shadows, no hover tricks, 5px gutters, and a nav that's 12px tall in a corner. The photos are also large (570–825px tall) and consistent in grade, so the wall of images reads as one body of work.

**Two structures worth stealing:**
1. **Stream pages** (Portrait, Life): an endless justified grid, no text.
2. **Series index** (Landscape): cover cards with `PLACE YEAR` labels, one per trip. That's exactly the series model you chose in Q15, and it proves the label format (place + year) works visually.

**What is weak, and where you can be better:**
- **Text is nearly absent:** a 74-photo series page has 357 characters. Search engines and AI answer engines have nothing to work with. Your plan (80–200 words of intro per series, real captions) beats it without changing the visual feel, if the text sits *after* the photos or in a quiet block above them.
- **Alt text is filenames.** Free win for you.
- **No `srcset`**, and a 112,000px page loads hundreds of images. Your R2 pipeline plus `srcset` will be faster.
- **No captions anywhere.** For your mixed subjects (Penang, Slovenia, coffee, tofu, the moon), a viewer will want a place and a year, so add it on hover or in the lightbox.
- **The dark grey is neutral (`#1a1a1a`)**, and your brief calls for a warm near-black (`#121110`). Keep yours; it's better with warm photography.

---

## 3. Your site vs samalive, measured the same way

| | samalive | yours (2026-09-18) |
|---|---|---|
| Background | `#1a1a1a` neutral | `#121110` warm (good) |
| Grid width | 86.1% of viewport (1240/1440) | **82.2%** (1184/1440) |
| Column structure | Justified rows sized by aspect ratio | **3 fixed 384px columns** (masonry) |
| Photo heights | 569–825px | 256–683px |
| Gutters | ~5px | **16px** |
| First photo at | y = 22px | **y = 248px** (an H1 "PORTFOLIO" and padding sit above) |
| Nav type | 11.9px, 600, uppercase, 2px tracking | **20px, bold, mixed case** |
| Body font | — | **Roboto 14px** (the brief says Roboto should be gone; Material is still pulling it in) |
| Image transitions | none | `transform/scale/rotate 0.5s` on hover, plus a scroll fade-in |
| Image sizes | 500/1000/1500w per slot | Cloudinary `w_450,h_800` with a `srcset` |
| Photos on page | 198 | 12 |

**So the gap isn't the palette. It's: fixed columns instead of justified rows, gutters 3× too wide, a heading and padding pushing photos below the fold, a nav that's ~70% too large, small images, and hover/scroll effects that samalive doesn't have.**

---

## 4. Concrete spec for your photo pages ("samalive grammar, your voice")

1. **Layout:** justified rows, computed from each photo's aspect ratio (no cropping). Target row height ~520–620px on desktop, ~380px at 1024px, single column on phones.
2. **Width:** 86–90% of viewport, capped at ~1700px.
3. **Gutters:** 5–8px. (I'd take 8px: your subjects vary more than samalive's portrait series, so a slightly wider gutter keeps them from bleeding together.)
4. **No radius, no shadow, no hover zoom, no scroll fade.** Photos appear immediately.
5. **Stage:** warm near-black `#121110` for all photo pages, independent of the light/dark toggle (the writing side still follows the toggle).
6. **Header:** transparent, floating, small uppercase nav at 12–13px with ~1.5–2px tracking, clay for the active item. Wordmark as text in Signika, not an image.
7. **No page heading on the gallery.** Keep an `h1` visually hidden for SEO; the first photo starts within ~24px of the top.
8. **Identity line** (your Q2 decision): one short sentence, 12–13px, muted, directly under the nav or at the foot of the first screen, so a first-time visitor still learns who you are. samalive skips this because the logo is the brand; you need it.
9. **Captions:** hidden by default; show `Place, Year` on hover/focus and in the lightbox. Real alt text on every photo, always.
10. **Lightbox:** near-black overlay, photo fitted with margin, edge chevrons, ✕ top-right, keyboard + swipe, one URL per photo. **Add** what samalive lacks: a small `3 / 14` counter and the caption line.
11. **Series:** `/photos` index of cover cards, 2 columns on desktop, ~4–8px gutters, label `PENANG 2026` centred over the image in small uppercase tracking. Series pages then run the same justified rows.
12. **Your advantage over samalive:** 80–200 words of intro per series (place, when, why), captions and alt text, `srcset` from R2, and pages that don't run to 112,000px — paginate or cap a stream at ~60 photos.

## 5. Open questions for you

1. **Gutter:** 5px (samalive-tight) or 8px?
2. **Photo pages always dark**, even when the writing side is light? (I recommend yes.)
3. **Where does the identity sentence go:** above the grid (costs ~40px of first screen) or under the first row?
4. **Series labels:** place + year like samalive (`PENANG 2026`), or thematic names?
5. **Stream length:** one endless page, or 40–60 photos with "load more"?
6. **Captions on hover:** yes for everything, or lightbox only?
7. **About page:** samalive stacks EN then 日本語 on one page. Do you want your About stacked EN + 中文 like that, instead of separate locale pages?
