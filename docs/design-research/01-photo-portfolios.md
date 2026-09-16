# 01 — Photo portfolio research

For: Chong Wei Khang site redesign (photo portfolio + bilingual AI blog). Brand: Calm · Cinematic · Editorial.
Researched: 2026-09-16.

## How this was done (read this first)

- Every site below was fetched as **raw HTML with curl**, and some also with WebFetch. I pulled out the title, meta description, nav links, headings, image and caption counts, class names, gallery config (`data-props`), fonts and colours from the inline or linked CSS.
- **Verified** = seen in markup or CSS: class names, gallery config JSON, nav labels, caption text, fonts in CSS, word counts.
- **Inferred** = what the page probably looks like, based on that markup (e.g. "justified rows" from Squarespace `gallery-strips`). No screenshots were taken. Inferred items are marked *(inferred)*.
- Dropped or not studied:
  - **webbnorriswebb.com** (Alex Webb): the domain now serves unrelated spam. Don't use it.
  - **readcereal.com**: the page is built in JavaScript, and the HTML only showed a search, category and year filter shell. Not studied.
  - **cargo.site/templates**: the listing only has numbered screenshot IDs, so there was no layout to analyse. Not studied.
- Squarespace demo note: the **Hester** demo right now is a pickle shop (`hester-demo.squarespace.com`), and the **Five** demo is a holiday-rental site (`five-demo.squarespace.com`). What the owner likes about them has to be their *structure*, not their demo content.

---

## Sites

### 1. SamAlive — https://www.samalive.co/ (owner's reference)
- **What:** An individual photographer's portfolio on Squarespace 7.1. Portrait, landscape, automotive, city and life work, plus a presets shop.
- **Homepage:** No hero and no intro text. The page is one full-width gallery section with **197 images** (verified), under a solid header. The footer has only an email and an Instagram icon.
- **Nav (verified via WebFetch):** Portrait · Landscape · Automotive · Commissions · Cityscape · Life · About · Presets, plus a cart. Header markup: `header-layout-nav-left`, `data-header-style="solid"`.
- **Gallery (verified):** `gallery-strips--layout-strips` with props `{"gutter": 5, "rowHeight": 500, "width": "full", "lightboxEnabled": true, "scrollAnimation": "fade-up"}` and `data-show-captions="false"`.
  - This is a **justified-row layout**: each row has a fixed height (~500px), and images keep their own aspect ratio with no cropping *(inferred from the Squarespace Strips type)*.
  - Image sizes mix landscape (1500x1000 ×176) and portrait (1000x1500 ×48, 1067x1600 ×30, etc.), and they sit together without cropping.
- **Series/categories:** Each category is a flat page (e.g. `/life` has 113 images, same strips gallery). There are no series, no dates and no text.
- **Captions/metadata:** None. Every gallery image has an empty `alt=""` (197 of 197).
- **Lightbox (verified):** Squarespace gallery lightbox with previous, next and close controls. "View fullsize" links use `?itemId=` so each image has its own URL.
- **Typography / colour:** Adobe Typekit is loaded, but the font name isn't in the inline HTML. Sections use the light and black themes. The feel is black on white and monochrome *(WebFetch)*.
- **Text vs image:** About 99% image.
- **SEO:** Weak. No alt text, no intro text on category pages, and a title of just "SamAlive" / "Life — SamAlive".
- **Steal:**
  1. **Justified rows with ~5px gutters.** Mixed landscape and portrait photos sit together without cropping and feel dense but calm.
  2. **Lightbox with its own URL per image** (`?itemId=`), so single photos can be shared.
  3. A very small header: photos start right under it.
- **Avoid:** 100+ images with no alt text or context. It looks good but gives search engines and screen readers nothing, and the sheer volume weakens the "curated" feel.

### 2. Squarespace Hester — https://hester-demo.squarespace.com/ and https://hester-fluid-demo.squarespace.com/
- **What:** A Squarespace 7.1 template. The demo is a small food shop, but the template is used for portfolios and blogs.
- **Homepage (verified text order):** Full-screen hero image with centred brand ("Pickle Perfection" / Shop Now) → short value statement ("Only the Highest Quality Ingredients…") → **3-up square product grid** with short text → newsletter block ("What's the Dill?") → footer with address.
- **Header (verified):** `header-layout-branding-center`, `data-header-style="dynamic"`, full width. There is a backdrop-blur header style in the CSS. Nav: Shop · Our Story · Blog.
- **Gallery (verified):** `gallery-grid--layout-grid`, `aspectRatio: "square"`, **gutter 60**, 3 columns (4 on the fluid demo), `width: "inset"` on fluid, captions off.
- **Typography (verified):** `font-family: 'Poppins'` (×24).
- **Colour:** Sections use `data-section-theme="bright"`. The template itself is black and white; the colour comes from the photos *(sqspthemes review)*.
- **Text vs image:** About 60/40 image. Headings are short.
- **SEO:** Normal Squarespace behaviour: real H1 and H2 headings and body paragraphs on each section.
- **Steal:**
  1. **Very wide gutters (60px) and a centred logo:** a relaxed, magazine-like rhythm.
  2. The **section sequence** (hero → one-line statement → grid → quiet sign-off) maps directly onto "identity strip → photo grid → footer".
  3. A **"Story" page** as a first-class nav item next to the work.
- **Avoid:** Forced square crops. They damage photographs, especially portrait and panoramic travel frames. Poppins also reads as generic for an editorial brand.

### 3. Squarespace Five — https://five-demo.squarespace.com/
- **What:** A Squarespace **7.0** template (Brine/Bedford era), confirmed by the Help Center. The demo is a holiday-rental site.
- **Homepage (verified body classes):**
  - The page thumbnail is used as a full-width banner, with the page title and description centred on it (`page-thumbnail-as-banner`, `stretch-page-thumbnail`, `banner-content-page-title-description`, `banner-alignment-center`).
  - Nav sits above the banner, aligned left (`top-navigation-position-above-banner`, `top-navigation-alignment-left`).
  - Then a single line of copy ("Luxury short-term accommodations in Cherbruke…"), then three alternating image-plus-text blocks with "More info" links, a testimonial quote, and "Featured In".
- **Gallery config (verified tweaks):** `gallery-design-slideshow`, `lightbox-style-dark`, `gallery-navigation-thumbnails`, `gallery-info-overlay-always-show`, `gallery-aspect-ratio-32-standard`, `gallery-transitions-fade`, `gallery-auto-crop`.
- **Nav:** Top bar with folders (Accommodations → 3 sub-pages), Testimonials, Reserve, Contact, Blog. Dropdowns open on hover *(Help Center)*.
- **Blog:** Vertical list of posts. The full-display tweak shows the featured image, date line at the top, byline at the bottom.
- **Sidebars:** Optional, one or two per page.
- **Text vs image:** Balanced, about 50/50.
- **SEO:** Good. Every page has a banner title and description, and the sidebar content is indexed.
- **Steal:**
  1. **A page banner that holds the title and a one-sentence description.** That's a ready-made series-page header (cover image + title + dek).
  2. **A dark lightbox with a thumbnail strip and a caption overlay** that's always visible.
  3. A **date line above the title** on blog lists, which suits the AI blog.
- **Avoid:** Sidebars and busy "Featured In" and testimonial blocks. They're business furniture that pulls attention away from the photos.

### 4. Matt Stuart — https://www.mattstuart.com/
- **What:** A London street photographer on Squarespace 7.0 (Index-style template).
- **Homepage (verified headings):**
  - Slideshow hero (`sqs-gallery-block-slideshow`, 17 slides, caption shown at the bottom via `sqs-gallery-block-meta-position-bottom`)
  - "photo series & commissioned work" list
  - A workshop pull-quote ("BUY A GOOD PAIR OF COMFORTABLE SHOES…")
  - "buy a Print"
  - "Photography books"
  - "FILM Her Majesty's Queue"
  - Footer with Quick Links
- **Nav (verified):** Photographs (folder: All That Life Can Afford · Into the Fire · Industrieweg · Tate of the Art · Early Work · Commissioned) · Film · Prints · Workshops · Books · Interviews · Bio · Contact.
- **Series page (verified, `/all-that-life-can-afford`):**
  - H1 title, then a **grid gallery** (`sqs-gallery-block-grid`, standard aspect ratio, 30 lightbox openers), then **about 150 words of text below the grid**: dates (2002–2015), book history, and a Geoff Dyer quote.
  - Alt text is just filenames ("Matt_Stuart_Oxford_Street.JPG").
- **Typography (verified):** Asap.
- **Text vs image:** Homepage about 286 words. Series page about 400 words in total.
- **SEO:** Good on series pages because of the real paragraph and the quote. Weak on alt text.
- **Steal:**
  1. **A series-page text block** that gives the years, place and a short statement. It's real, indexable, human text.
  2. **The "Photographs" folder lists series by name.** Series titles act as the navigation.
  3. A **single pull-quote** as a breathing space on the homepage.
- **Avoid:** A homepage that fills up with commerce (prints, workshops, books, film). It dilutes the "photo is the protagonist" idea.

### 5. Levon Biss — https://www.levonbiss.com/
- **What:** Macro and natural-history photographer (Microsculpture). Squarespace 7.1, **the same templateId as samalive.co** (verified: `5c5a519771c10ba3470d8101`).
- **Homepage:** "Overview" is one masonry gallery of **34 images** (verified `gallery-masonry-item` ×34). There's no intro text, then a newsletter block.
- **Gallery (verified):** `gallery-grid-masonry` with props `{"gutter": 60, "numColumns": 3, "width": "full", "lightboxEnabled": true}`, captions off.
- **Nav (verified):** Overview · Work (folder: Microsculpture · The Hidden Beauty of Seed & Fruits · Extinct & Endangered · Studio Curiosities · Amber series) · Shop · Books · Videos · Exhibitions · About · Contact.
- **Typography (verified):** Poppins.
- **Meta description (verified):** Hand-written and keyword-aware ("insect, seeds, fruits, botany, extinct species, amber series…"). The title is "LEVON BISS | Discover Nature's Artistry Today".
- **Text vs image:** Homepage about 136 words, nearly all of it nav.
- **SEO:** Relies on the meta description. Alt text is filenames.
- **Steal:**
  1. **A curated "Overview" homepage** (about 30 best frames) that's separate from the full series. That matches the owner's "curated grid now".
  2. **A 3-column masonry grid with 60px gutters:** airy, and nothing is cropped.
  3. **A series folder under "Work"** with descriptive series names.
- **Avoid:** Masonry reading order. Columns fill top to bottom, so the "first/best" images scatter and the sequence is lost *(inferred from how masonry works)*.

### 6. Alec Soth — https://alecsoth.com/photography
- **What:** A Magnum photographer's hand-built site (no CMS markers, no web fonts in the markup, tiny HTML). The root redirects to `/photography`.
- **Homepage (verified):**
  - Opens with a first-person line: *"My name is Alec Soth (rhymes with 'both'). I live in Minnesota. My latest book, Advice for Young Artists, is now available from MACK."*
  - Then a news and exhibitions list, then **long press lists with links** (The Guardian, New Yorker…).
  - About 1,500 words and 66 images.
- **Nav (verified):** Projects · Calendar · About · Contact.
- **Projects index (verified):** A plain text list of 11 project titles, newest first. No images and about 48 words.
- **Project page (verified, `/projects/niagara`):**
  - "< Back", project title, empty `#caption` container.
  - A **Gallery / Index toggle** (buttons).
  - Full-screen **one-at-a-time carousel** with invisible left and right click zones (`prev-card` / `next-card`) and 22 slides with a thumbnails grid for Index view. Responsive `srcset` (615–1280w).
- **Colour (verified):** Only an accent `#efa537` (amber) and white appear in the inline styles.
- **Text vs image:** Homepage is text-heavy. Project pages are about 99% image.
- **SEO:** The homepage text is strong. Project pages are thin (title only).
- **Steal:**
  1. **A first-person, one-sentence identity line** at the top of the homepage. It's exactly the "short identity intro strip" format. Human, not a marketing tagline.
  2. **A Gallery / Index toggle on the series page:** sequence view vs. thumbnail overview, as a small text toggle.
  3. **Clicking the left or right half of the image to navigate:** no visible arrows needed.
- **Avoid:** A projects index with no images, and series pages with no text. Both are bad for discovery and SEO.

### 7. Nadav Kander — https://www.nadavkander.com/
- **What:** A fine-art and portrait photographer. A custom build with Swiper and a hand-written CSS file.
- **Homepage (verified):** "Studio Feed", a Swiper carousel of about 35 slides with a `swiper-curated__caption`. Only about 32 visible words.
- **Nav (verified):** Studio Feed · Works in Series · Portraits · Commissions · Film · Archive · Monographs · Exhibitions & Talks · Essays & Reviews · News · Biography · Contact.
- **Series index (verified, `/works-in-series`):**
  - A 3-column grid (`image-grid--3x`) of bordered cover cards (`grid-single--bordered`).
  - Each caption reads **"Dark Line – The Thames Estuary · Series of 37"**, so the image count is part of the label.
- **Series page (verified, `/works-in-series/dark-line-the-thames-estuary/single`):**
  - Series title bar with a 4-dot **index icon** toggle.
  - An `image-grid--fixed-height` thumbnail grid. It tracks orientation: `grid-single--portrait` ×31, `--landscape` ×11.
  - Each thumbnail links to `…/single#N` and opens a **full-page lightbox** (`page-lightbox`, `single-lightbox`, Swiper) with a thumbnails panel.
  - **Every image has a full caption**: *"Water XVIII (Shoeburyness towards Mulberry Defences and on to Grain Power Station), England, 2015"*.
- **Typography (verified CSS):** "Univers Next W01", a neutral grotesk.
- **Colour (verified CSS):** `#fff` backgrounds, `#000` text, `#000` backgrounds for the lightbox *(inferred)*, `#d9d9d9` and `#e6e6e6` greys for placeholders and borders.
- **Text vs image:** About 90/10, but every image has meaningful text.
- **SEO:** Very good at image level. The captions are indexable plain text with place and year.
- **Steal:**
  1. **The caption formula `Title (place detail), Country, Year`.** Consistent, quiet, and packed with keywords. For Wei Khang: *"Morning ferry, Venice, Italy, 2025"* / *"Chulia Street, George Town, Penang, 2026"*.
  2. **"Series of N" on series cover cards.** It sets expectations and feels editorial.
  3. **Fixed-height rows that track orientation**, plus a **full-page lightbox with a `#N` deep link** and a thumbnail index.
- **Avoid:** A 12-item top nav. It's too much for a small site. Keep it to 4–5.

### 8. Jack Davison — https://jackdavison.co.uk/
- **What:** A London portrait and documentary photographer. A custom build; fonts from CSS.
- **Homepage (verified):**
  - Header "Jack Davison | Photographer" with **view modes: Index · Thumbs · ScreenSaver**, plus Works · Info.
  - The **index list is the navigation**: 33 entries, each with a label and an image count (`index-item-label` + `index-item-length`). Examples: "Recent 32", "26 States 45", "Kate Winslet - NYT Magazine - 2024 6".
  - Hovering a list item likely previews thumbnails in `index-thumbs` *(inferred)*.
  - 601 thumbnails in a 2-column (1 on medium) thumb grid.
- **Series URLs (verified):** `/recent-01`, `/26-states-01`. Each image has its own numbered URL (`-01`, `-02`…), so every frame has a page.
- **Typography (verified CSS):** "Untitled Sans" / "Untitled Sans Medium", with a Helvetica fallback.
- **Colour (verified CSS):** `#fff` / `#000`, grey `#a3a3a3` for secondary text, one accent `#ff8c00`.
- **Text vs image:** Text is almost all index labels (about 1,150 words).
- **SEO:** Good: descriptive series slugs and a crawlable text index. Per-image pages have no captions.
- **Steal:**
  1. **A text index with image counts** ("Venice 18", "Penang Streets 24"). It works well as a /photos landing page once there are many series, and it's cheap to build.
  2. **Grey secondary text** for counts and years next to near-black primary text. Maps onto charcoal plus a muted warm grey.
  3. **One URL per frame** (`/series/slug/03`) for sharing.
- **Avoid:** Novelty modes like "ScreenSaver". They're fun but off-brand for "calm", and they need maintenance.

### 9. Rinko Kawauchi — https://rinkokawauchi.com/ (JP) · https://rinkokawauchi.com/en/ (EN)
- **What:** A Japanese fine-art photographer on WordPress. **Bilingual EN/JP**, which makes it a direct precedent for EN/简体中文.
- **Homepage (verified):** A `cycle-slideshow` of about 9 images and just the name. About 31 visible words.
- **Nav (verified):** News · Biography · Works · Publications · Articles · Contact · Instagram · **EN / JP**.
  - The language switch is two plain text links in the nav.
  - JP is at the root and EN is at `/en/`. The switcher points to the **same page** in the other language (`/en/works/` ↔ `/works/`).
- **Works index (verified):** Series as H2 headings with year ("Halo 2017", "Ametsuchi 2013", "Illuminance 2011"…), plus Video Works and Installation Views.
- **Series page (verified, `/en/works/172/`):**
  - `<h1>Halo</h1><p class="year">2017</p>`, then images stacked **one per row in a single column** (`item-inner` → `type-01` → 1200x800 img).
  - No captions, no text, and empty alt text.
- **Typography:** Loads a Fonts.com (Monotype) web-font kit. The font name isn't visible in the HTML.
- **Text vs image:** About 95% image.
- **SEO:** Hreflang-style URL structure (EN under `/en/`) is good. Series pages are thin.
- **Steal:**
  1. **An EN / 中文 text toggle in the nav that keeps you on the same page.** No flags, no dropdown.
  2. **A single-column, one-image-per-row sequence** for series pages. It's the calmest "photo essay" reading and respects each frame.
  3. **Series title plus year as the only header.** Minimal and editorial.
- **Avoid:** Numeric IDs in URLs (`/works/172/`). Use readable slugs, which also help SEO.

### 10. Magnum Photos — https://www.magnumphotos.com/ (story: https://www.magnumphotos.com/newsroom/magnum-chronicles/magnum-chronicles-a-global-portrait-of-generation-z/)
- **What:** A photo agency and editorial magazine (WordPress, Isotope/Masonry, Swiper, Typekit).
- **Homepage (verified):** An editorial feed of story teasers under category labels (Arts & Culture · Theory & Practice · Newsroom), with headings like "9/11: Stories from Magnum Photographers". About 494 words.
- **Story page (verified):**
  - Category kicker ("Magnum Chronicles") → H1 → **standfirst/dek** paragraph.
  - Then a **large image** (`story-big-image`, `layout-centered`, 1200x800) followed by a caption block (`b-caption__text`): *"Taymour. Lebanon, Beirut. July 2025 © Myriam Boulos / Magnum Photos"*.
  - Then long-form prose, with more images and captions mixed in.
  - Each image links to its own **attachment page** (`/attachment/…`).
- **Text vs image:** About 50/50 on stories. This is the "photo essay" model.
- **SEO:** Excellent: kicker, H1, dek, long body text, captions with place and date.
- **Steal:**
  1. **The story-page template: kicker → H1 → one-paragraph dek → big image → caption → short prose → images.** It's the right structure for future series/story pages, and it lets travel essays rank.
  2. **The caption order `Subject. Country, City. Month Year`**, set below the image in a smaller, muted style.
  3. **Categories as kicker labels** above titles (e.g. "Travel", "Street", "Still life").
- **Avoid:** A mega-menu full of commerce and courses. It's the opposite of calm.

### 11. Kinfolk — https://www.kinfolk.com/
- **What:** A slow-living editorial magazine (WordPress, Flickity carousels, Lenis smooth scroll). A useful tone reference for "calm editorial".
- **Homepage (verified headings):**
  - Issue hero ("Issue 61 · THE PLAY ISSUE", "1 / 10" counter, Buy | Read)
  - "Latest Stories": category label + title + one-line dek, e.g. *"Balming Tiger — An hour with the alternative K-pop group."*
  - "Inside Issue Sixty-One"
  - Free preview
  - In Conversation
  - Subscribe
- **Pattern (verified in link text):** Every story card is a **title plus a one-sentence dek** ("Rice is Nice — One staple, five ways to rethink it.").
- **Colour (verified):** One inline sage-grey `#dbded5`. The rest is neutral *(inferred)*.
- **Text vs image:** About 60/40. Images are large, but the short text on every card does a lot of work.
- **SEO:** Strong: category archive pages, descriptive slugs, and a dek on every card.
- **Steal:**
  1. **A title plus a one-line dek on every series/post card.** That's one pattern for both the photo series and the AI blog, so the two halves feel like one site.
  2. **A slide counter like "1 / 10"** in small type instead of dots, for the lightbox and series sequences.
- **Avoid:** Carousels and smooth-scroll libraries (Flickity, Lenis). They go against "no heavy motion" and hurt scroll feel and accessibility.

### 12. Phrame (Framer template) — https://phrame.framer.website/
- **What:** A paid Framer template for photographers and agencies ("fullscreen layouts, strong typography").
- **Homepage (verified text):** A huge wordmark "PHRAME", then "Photographer & Graphic Designer", then a **numbered project list**: `00 Mirror · Branding · 2025`, `01 Blur · Branding · 2025`, `02 Fashion · Editorial · 2025`…, then a footer with (Services) and (Socials) in parentheses.
- **Nav (verified):** Work · Photos · About. Photos is separate from Work (projects).
- **Typography (verified):** Inter / Inter Display. The site supports `prefers-color-scheme`. It uses Lenis smooth scroll.
- **Alt text:** "Project Image" on every image, which is useless.
- **Steal:**
  1. **Metadata in the row `NN Title · Category · Year`**, as a tidy tabular list. Good for a series index.
  2. **Splitting "Photos" (the loose curated stream) from "Work/Series" (projects)**, which is exactly this site's plan.
  3. **Parenthesised small labels** like "(Socials)" as quiet section labels.
- **Avoid:** A giant wordmark hero plus smooth scroll. It's loud and pushes the photos down.

### 13. The Filter / "Editorial Site" (free Framer template) — https://www.framer.com/marketplace/templates/editorial-site/ · preview https://thefilter.framer.website/
- **What:** A free Framer template described as "Minimal Photography Portfolio", published June 2026. Its listed feature is a "Click-to-swap project viewer".
- **Preview page (verified text):**
  - Name "The Filter".
  - **One large image** of the active project, with title **"Low Tide"**, meta **"Photography • 2026"** and a one-line statement: *"The particular boredom of a beach in winter."*
  - A project list: Coastline Study · Static · Low Tide · Interior · Weather · Concrete · Flower.
  - Contact lines.
  - Only 47 words and 1 image in the HTML.
- **Typography (verified):** Inter plus **IBM Plex Mono** (mono for meta).
- **Colour (verified):** `#d9d7cf` (warm stone grey), `#fafcfc`, `#2f2f2f`, `#666`. The site supports `prefers-color-scheme`.
- **Steal:**
  1. **A one-line poetic statement per series** ("The particular boredom of a beach in winter."). It's cheap to write, very editorial, and fills the SEO gap on series cards.
  2. **A small monospaced or tabular meta line**, "Photography • 2026". In Signika, use tabular numbers and small caps or letter-spacing.
  3. **A warm stone-grey tone** close to the site's cream/clay palette.
- **Avoid:** A click-to-swap single viewer as the *homepage*. It hides everything except one image, and the owner has already chosen a grid.

### 14. "Photographer" (free Framer template) — https://photographers.framer.website/
- **What:** A free Framer template for freelance photographers. Included as a **counter-example**.
- **Homepage (verified):**
  - All-caps intro ("HI, FINNEGAN MONROE HERE… SHUTTERBUG…")
  - "Scroll to Explore"
  - Animated stat counters ("Hours Behind the Lens 0K+"; they read 0 in the static HTML)
  - Brands logo wall
  - Albums
  - Expertise list
  - Reviews
  - Blogs
  - "Let's Talk"
  - About 1,434 words
- **Albums (verified):** Cards labelled `Category · Type · Title`, e.g. "Travel · Collaboration · Colorful India" → `/albums/streets-of-india`.
- **Typography (verified):** Clash Display, Satoshi, Inter, Fragment Mono. Four families.
- **Alt text:** The same generic string repeated.
- **Steal:** **Album cards with a small category label above the title** (fine in moderation).
- **Avoid:** The agency sales-funnel homepage (stat counters, logo wall, testimonials, four typefaces). Everything the brand brief says not to do.

---

## Synthesis

### Recurring patterns (seen in 3+ sites)
1. **Series are the unit of organisation.** Seen at Stuart, Biss, Soth, Kander, Davison, Rinko, Phrame and The Filter. Series names act as navigation, and genre categories are rare at the top level.
2. **A curated overview is separate from the full series.** Seen at Biss (Overview), SamAlive (home), Kander (Studio Feed) and Phrame (Photos vs Work).
3. **Short nav**: roughly Work/Series · About · Contact, plus language (Soth, Rinko, Phrame). Long navs (Kander, Magnum) feel heavy.
4. **Series metadata is title plus year**, sometimes with a count: Rinko "Halo 2017", Kander "Series of 37", Davison "26 States 45", Phrame "Fashion · Editorial · 2025".
5. **Captions, when present, follow Title/Subject → Place → Year** (Kander, Magnum). Portfolio sites mostly have no captions, and the good ones do.
6. **Neutral black and white with one tiny accent**: Soth amber `#efa537`, Davison orange `#ff8c00`, The Filter warm grey. The clay `#B08968` accent fits this well.
7. **Neutral grotesk type** (Univers, Untitled Sans, Inter, Asap, Poppins), sometimes with mono for meta. Signika is fine if kept small and quiet.
8. **A dark lightbox** with thumbnails or an index toggle (Five, Kander, Soth).
9. **Alt text is almost always missing or a filename.** This is an easy place to beat all of these sites on SEO and accessibility.

### Recommended homepage structure
1. **Header:** name on the left; nav on the right: `Photos · Writing · About · Contact` plus `EN / 中文` as plain text. Solid cream background with no blur. Keep it short so photos start high.
2. **Identity intro strip** (decided). One or two first-person sentences, Soth-style, in body size or slightly larger, max ~60ch, left-aligned. For example: *"I'm Wei Khang, a photographer and AI builder in Penang, Malaysia. I photograph streets, travel and quiet still lifes, and write about AI concepts in English and 中文."* Optionally add one muted meta line: `Penang, MY · Photography · AI notes`. No portrait photo, no stat counters.
3. **Curated photo grid** (about 14 now, capped at ~24 later). Justified rows (see below), with a small caption on hover or focus only (Title · Place, Year). Each image opens the lightbox.
4. **"Series" row** (once series exist): 2–3 cover cards with **Title, one-line dek (The Filter style) and "N photos · Year"**, plus a link to all series.
5. **"Latest writing" strip**: 2–3 posts with a kicker (category), title, one-line dek and date (Kinfolk/Five). Posts in both languages appear in the current locale. This connects the two halves of the site.
6. **Quiet footer**: email, Instagram, language toggle, ©.

### Recommended series page structure (Magnum + Stuart + Kander + Rinko)
1. **Kicker**: category or location (`Travel · Croatia`), muted, small, letter-spaced.
2. **H1 series title** plus a **meta line**: `Oct 2025 · 18 photographs`.
3. **Dek**: one sentence (The Filter), at a larger reading size.
4. **Intro text**: 80–200 words (Stuart). Where, when, why. Written in EN and 中文 separately, not machine-mirrored. This is the main SEO payload.
5. **Image sequence** in single column (Rinko), with the option to break into **diptychs** for pairs of portrait frames. Each image gets a `<figure>` + `<figcaption>` in the Kander/Magnum formula `Subject, Place, Country, Year`, muted and small. Real alt text describes the content.
6. **Optional short text interludes** between images for story pages (Magnum).
7. **Gallery / Index toggle** (Soth/Kander): a small text link that switches to a thumbnail grid of the whole series.
8. **Footer nav**: "← Previous series · All series · Next series →".
9. **Structured data**: `ImageGallery` / `Article` JSON-LD, `hreflang` en/zh-Hans, and readable slugs (`/photos/venice-2025`, not IDs).

### Gallery layout for mixed landscape and portrait
- **Recommended: justified rows** (SamAlive `gallery-strips` / Kander `image-grid--fixed-height`).
  - Every row has the same height and the widths follow each photo's aspect ratio, so there's **no cropping** and it still reads left to right, row by row, in curated order (masonry breaks that).
  - Target row height is about 320–420px on desktop and about 220px on tablet. The last row stays left-aligned and isn't stretched.
  - Gutter 8–16px. That's calmer than SamAlive's 5px and less sparse than Hester's 60px.
  - Build it with a precomputed layout from known width and height (stored in the photo manifest). CSS-only option: `display:flex; flex-wrap:wrap` with `flex-grow: aspect-ratio` and `flex-basis: calc(aspect-ratio * rowHeight)`.
  - **Mobile:** a single column at full width, natural aspect ratio.
- **Avoid:** square crops (Hester) and masonry columns (Biss). Masonry loses sequence and leaves ragged bottoms.
- **Alternative for series pages:** a single column (Rinko) with optional side-by-side portrait pairs.

### Lightbox recommendation
- **Full-viewport dark overlay** in warm near-black, even in light mode (Five `lightbox-style-dark`, Kander). The photo is fitted with `object-fit: contain` and generous padding.
- **Caption below or at bottom-left** in small muted text: `Title · Place, Year`. Counter at bottom-right, `3 / 14` (Kinfolk). No dots and no thumbnail strip by default. Optionally add a small "Index" toggle that shows a thumbnail grid (Soth/Kander).
- **Navigation:**
  - Click the left or right half of the image (Soth), plus visible but faint ‹ › buttons for discoverability.
  - Keyboard: ← → Esc. Swipe on touch.
  - Focus is trapped and returned to the grid item on close.
- **Deep links:** each image has a URL, e.g. `?photo=venice-03` or `/photos/venice-2025/03` (SamAlive `?itemId`, Kander `#N`, Davison `-01`). Back or Esc closes it.
- **Motion:** 150–200ms opacity fade only. No zoom-from-thumbnail, no slide.
- Preload the neighbouring images. Serve the right size with `srcset` (Soth uses 615–1280w steps).

### Open questions for the owner
1. **Captions:** show Title · Place, Year on the homepage grid (on hover or focus), or only in the lightbox? And write a title for every photo, or just place and year?
2. **Series naming:** by place (Venice 2025, Hatyai) or by theme ("Low tide", "Morning coffee")? Mixing works if each has a dek.
3. **Photos landing page** once there are 5+ series: cover-card grid (Kander) or text index with counts (Davison/Soth)?
4. **Series page reading mode:** a single-column essay (Rinko/Magnum) or a justified grid with a lightbox (Stuart/Kander)? Recommendation: single column with an Index toggle.
5. **Chinese content depth:** full translations of series intros and captions, or English captions with Chinese intros only?
6. **Lightbox in light mode:** always dark (recommended, cinematic), or follow the site theme?
7. **Homepage grid size cap** as the archive grows: fixed ~18–24 hand-picked, or "latest N"?
8. **EXIF/gear metadata** (camera, lens, settings): show it, hide it, or put it behind a small "info" toggle? None of the studied editorial sites show it.
9. **Prints/shop** later? If yes, keep it off the homepage (the Stuart lesson).
10. Which part of **Five** and **Hester** does the owner actually like? Five: banner with title and description, dark slideshow lightbox. Hester: centred logo, wide gutters, calm section rhythm. The current demos are a rental site and a pickle shop.
