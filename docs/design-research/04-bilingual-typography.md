# 04 — Bilingual EN / 简体中文 typography and layout

Research date: 2026-09-16. Scope: Angular 21 + Tailwind 4, prerendered, Cloudflare Workers, `/en/…` and `/zh/…`.
Current repo state (read-only check): `src/styles.scss` `@theme` has `--font-display: 'Signika', system-ui, sans-serif`, `--font-script`, `--font-mono`; `src/index.html` has `<html lang="en">` and loads `Signika:wght@300..700` + `Nothing You Could Do` from Google Fonts.

**Legend:** **[V]** = I checked it myself (fetched the page, CSS, MDN browser-compat-data JSON or Google Fonts CSS). **[I]** = inferred, common practice, or not re-checked. Test these before relying on them.

---

## 0. TL;DR

1. **Chinese font: use system fonts first, with no Chinese web font by default.** Stack: `PingFang SC` → `Hiragino Sans GB` → `Microsoft YaHei` → `Noto Sans CJK SC` / `Source Han Sans SC` → `sans-serif`, with Signika first so Latin letters and numbers keep the brand face. That's what sspai, Matters and Apple China do [V]. A Chinese web font costs ~2.4 MB per weight in total. Even with Google's 101 unicode-range slices, one article still pulls dozens of ~25–35 KB slices [V].
2. **Chinese body text:** 17px, `line-height: 1.8`, measure `max-width: ~36em` (34–38 Han characters), `letter-spacing: 0`. This matches sspai [V]: 17px / 1.8 / ~592px text column. Apple resets `letter-spacing: 0` and adjusts line-height under `:lang(zh)` [V].
3. **Only Signika-first gotcha:** in Chinese text, curly quotes “ ” ‘ ’, the em dash — and the ellipsis … render in Signika's narrow Latin shapes. Signika's `latin` subset covers U+2000–206F [V]. Fix it with a `local()` + `unicode-range` "CJK punctuation" face placed before Signika in the zh stack. Initium (端传媒) uses the mirror-image trick ("Latin Quotes Fix") [V].
4. **New CSS:** `text-autospace: normal` is supported in Chrome 140 / Safari 18.4 / Firefox 145 (Baseline 2025) [V]. Use it. `text-spacing-trim` is Chrome-only (123+) [V], so it's a progressive extra. `hanging-punctuation` is Safari-only [V], so skip it or treat it as a bonus.
5. **No italics in Chinese.** Set `em:lang(zh) { font-style: normal }` (Notion does exactly this [V]), plus weight or `text-emphasis` dots under the text.
6. **Switcher:** a text link labelled in the target language ("中文" on EN pages, "EN" on ZH pages), top-right, that keeps the same path. Add hreflang `en` / `zh-Hans` / `x-default`, bidirectional and self-referencing [V Google]. Don't auto-redirect by Accept-Language [V Google].

---

## 1. Reference sites studied

| Site | What I found | Status |
|---|---|---|
| **少数派 sspai.com** (zh-CN) | Article body stack: `-apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft Yahei, Arial, sans-serif`. Tokens: `--size-ArticleBody: 15px / 17px`, `--line-height-ArticleBody: 1.8`, `--line-height-ArticleH2/H3/H4: 1.4`, `--size-ArticleH1: 28px / 38px`, H2 24/32px, H3 20/24px, weight 600, `--space-ArticleElement: 24px / 32px`, `--line-height-ArticleCaption: 1.6`. Wrappers: `.article__subsection__wrapper>div { max-width: 640px; padding: 0 24px }`, so the text column is 592px ≈ 35 Han characters at 17px. `:root { text-autospace: normal }`. Code: `Source Code Pro, Consolas, …`. Latin display numerals use a web font (`Outfit`). No Chinese web font. | [V] CSS files from `post.sspai.com` (fetched with a Referer header) |
| **端传媒 Initium theinitium.com** (zh-Hant default, zh-Hans at `/zh-hans/`) | `--font-sans: "Latin Quotes Fix","Noto Sans TC","Noto Sans SC",system-ui,"Microsoft JhengHei",sans-serif`. `--font-serif: "Latin Quotes Fix","Noto Serif TC","Noto Serif SC",…` (serif headings, sans body). `@font-face{src:local(Helvetica Neue),local(Helvetica),local(Arial);font-family:Latin Quotes Fix;unicode-range:U+27,U+2018-201A,U+22,U+201C-201E}`, which forces straight/curly quotes into Latin shapes. `--leading-body: 1.5` (UI level). Tracking tokens `tight -.025em … widest .1em`. hreflang `zh-Hans` → `https://theinitium.com/zh-hans/`, `zh-Hant` → root. | [V] homepage HTML/CSS |
| **Matters matters.town** (`lang="zh-Hans"`) | Separate tokens per script: `--font-sans-sc: -apple-system, blinkmacsystemfont, "Helvetica Neue", "Segoe UI", roboto, arial, "PingFang SC", "PingFang TC", "Microsoft YaHei", "Microsoft JhengHei", "Noto Sans SC", "WenQuanYi Micro Hei", sans-serif, emoji…`. `--font-serif-sc: "Songti SC","Songti TC","NSimSun","SimSun",serif, var(--font-sans-sc)`. `--font-size-article-base: 1.0625rem` (17px), article title 32px, weight 600. Latin fonts come first, then CJK system fonts: the same pattern this site would use with Signika. | [V] homepage CSS |
| **Apple China apple.com.cn** (`lang="zh-CN"`) | Per-language overrides everywhere: `:lang(zh-CN){font-family:SF Pro SC,SF Pro Text,SF Pro Icons,PingFang SC,Helvetica Neue,Helvetica,Arial,sans-serif}`, `:lang(zh){letter-spacing:0em}` (42 rules undo Latin negative tracking), `:lang(zh){line-height:1.25 / 1.2917 / 1.3334}` headline line-height tweaks. English `.typography-body` is 17px / 1.47 / -0.022em. Japanese gets its own `line-height` and `letter-spacing:0`. | [V] `/v/iphone/home/…/overview.built.css` |
| **Notion notion.com/zh-cn** (`lang="zh-cn"`) | `html[lang=zh-cn]{--tatami-font-family-serif: var(--tatami-font-family-serif-chinese-simplified)}`: the font token is swapped at the root by lang. `em…:lang(zh), em…:lang(ja), em…:lang(ko) { font-style: normal }`. hreflang `zh` → `/zh-cn`, `zh-tw` → `/zh-tw`, `en` → `/`. | [V] CSS + HTML |
| **Vercel vercel.com/zh** | Returns 200 but `<html lang="en-US">`, with no zh hreflang found in the served HTML. A counter-example: don't ship localized pages with the wrong `lang`. | [V] HTML (may be client-rendered later) |
| **The Type 字谈字畅 thetype.com** (typeisbeautiful.com) | Bilingual type-design publication: `lang="zh-Hans"`, `<link rel="alternate" href="https://www.thetype.com/" hreflang="zh">` + `https://www.thetype.com/en/` `hreflang="en"`, so Chinese at the root and English under `/en/`. Styles are bundled, and I didn't extract type values. | [V] hreflang only |
| **justfont justfont.com** (zh-Hant-TW foundry) | Uses its own web font `jf-lanyangming`, `letter-spacing: .2em` on display text. Traditional-Chinese foundry, useful as a display-tracking reference only. | [V] partial CSS |
| **sparanoid/chinese-copywriting-guidelines** | Spaces between Chinese and English, and between Chinese and numbers. A space between number and unit (except ° and %). Full-width Chinese punctuation, no repeated punctuation (！！！), half-width digits, correct proper-noun capitalization (GitHub, TypeScript), no casual abbreviations. https://github.com/sparanoid/chinese-copywriting-guidelines | [V] |
| **W3C clreq** (Group Note Draft, 01 Sep 2026) | Han and punctuation are 1:1 squares set solid. **Mainland (zh-Hans) punctuation sits in the lower-left corner of the character frame** (Taiwan/HK centered), §2.1.2. Emphasis marks 着重号 use ●/• **below** the text in horizontal writing, §5.3.1 (italics aren't a Chinese emphasis device). Line-start/line-end prohibition rules, §6.1. https://www.w3.org/TR/clreq/ | [V] |
| **W3C i18n "Managing inline spaces in Chinese & Japanese"** | Recommends **not typing space characters** between Han and Latin (a word space is too wide), and using `text-autospace` instead. clreq suggests up to ¼em. Notes Blink/Gecko/WebKit still differ (WebKit only adds space before alphanumerics). https://www.w3.org/International/articles/styling/inline-space | [V] |

Not fetched (named in the brief): 36kr.com returned a 17 KB JS shell with `lang="en"`, so nothing to extract. Figma `/zh-cn/` returned 404. I didn't use Chrome to inspect client-rendered switchers, so the switcher UI details in §4 are marked [I] unless noted.

**Pattern across the good sites [V]:** (a) Latin font first, Chinese system fonts after. (b) Different tokens per script, switched by `lang`. (c) Chinese body around 17px with line-height 1.75–1.8. (d) Chinese letter-spacing reset to 0. (e) No Chinese web font for body text on mainstream sites. Initium, the exception, loads Noto via Google.

---

## 2. Font options for zh-Hans

### 2.1 System stack (recommended default)

| Platform | Font | Notes |
|---|---|---|
| macOS / iOS | **PingFang SC** (苹方) | 6 weights, modern humanist-ish grotesque, sits well with Signika's soft terminals [I]. Used by sspai, Matters, Apple [V]. |
| older macOS | Hiragino Sans GB | fallback [V in sspai stack] |
| Windows | **Microsoft YaHei** (微软雅黑) | Regular + Bold (plus Light) only [I]. Weights 500/600 snap to bold or regular, so test headings at 600. |
| Android / ChromeOS / Linux | **Noto Sans CJK SC** / Source Han Sans SC | Usually what the generic `sans-serif` resolves to with `lang="zh-Hans"` [I]. |
| HarmonyOS / MIUI devices | HarmonyOS Sans SC / MiSans | appear through `sans-serif` on those devices [I] |

Cost: 0 bytes, no CLS, no FOUT. Downside: looks different per OS (YaHei on Windows is the weakest). That's acceptable for a photo-first site.

### 2.2 Web font options

| Font | License | Delivery | Size / perf | Fit with Signika |
|---|---|---|---|---|
| **Noto Sans SC** (= Source Han Sans) | SIL OFL 1.1 [I] | Google Fonts: variable `wght 100..900` available [V]. **101 unicode-range slices per weight** [V] | Regular: 101 woff2 slices, min 1.4 KB / median 25.8 KB / max 41 KB, **total 2.41 MB** [V measured]. A long article touches many slices, likely 300 KB – 1 MB+ per weight [I]. Add a second weight and it doubles. | Neutral. Adds nothing over PingFang on Apple devices, but improves Windows. |
| **Noto Serif SC** (= Source Han Serif) | OFL [I] | Google Fonts, variable `wght 200..900` [V], 101 slices [V] | first 60 slices avg 33.7 KB [V], so heavier than Sans | For an editorial serif **display** layer (headings, pull quotes), like Initium's serif headings [V]. |
| **LXGW WenKai 霞鹜文楷** | OFL 1.1 [V] | Derived from Fontworks Klee One. 3 weights. Google Fonts serves **"LXGW WenKai TC"** (115 slices) and "LXGW WenKai Mono TC"; plain "LXGW WenKai" returns 400 on Google Fonts [V]. The SC build must be self-hosted and split (e.g. `cn-font-split`) [V repo] | multi-MB source, split to slices | Warm, calligraphic, literary: very "calm/editorial", but a strong voice. Maybe for Chinese pull quotes or captions. The TC build uses Traditional glyph conventions, so don't use it for zh-Hans body text [I]. |
| **HarmonyOS Sans SC** | Huawei licence: free commercial use, **must display a notice that the font is used, no modification, no stand-alone redistribution** [V via search summary of licence text]. Unofficial pre-split webfont repos exist [V] | Self-host only | large | Geometric-neutral. The notice and no-modification rules (does subsetting count as modification?) make it a poor choice [I]. |
| **MiSans** | Xiaomi licence: royalty-free, **revocable**, embedding requires noting MiSans is used [V search summary; PDF at hyperos.mi.com] | Self-host only | large | Same concern: revocable, attribution. |
| **Alibaba PuHuiTi 3.0 阿里巴巴普惠体** | "Free commercial use" per Alibaba (official source alibabafonts.com). Read the legal statement for web-embedding terms [I] | Self-host only | 9 weights, GB18030-2022 [V search] | Rounded-ish, commercial feel. Less editorial. |

**Self-hosting on Cloudflare [I]:** if a Chinese web font is ever adopted, split it with `cn-font-split` (Apache-2.0, outputs woff2 slices + unicode-range CSS [V]) and serve from the same origin with `Cache-Control: immutable`. That avoids a third-party connection to `fonts.gstatic.com`, and gstatic has historically been unreliable in mainland China [I]. Readers in mainland China may matter for a zh site: an open question.

**font-display [I]:** for Chinese body text use `swap` only if metrics are close. Otherwise `optional`, so a first visit with a slow slice falls back to PingFang/YaHei with no reflow. Never `block` for CJK.

### 2.3 Recommendation

- **zh body/UI:** system stack (§5). No Chinese web font in v1.
- **Optional zh editorial accent (owner decision):** Noto Serif SC 600/700 for **article titles only**, loaded only on `/zh/blog/*`, with `display=optional` + `&text=` subsetting of the actual title characters (Google Fonts `text=` param [I]). Or skip it.
- **Script font "Nothing You Could Do":** Latin only. On `/zh/` keep the signature in Latin ("Wei Khang") rather than trying to find a Chinese handwriting face [I, owner decision].

### 2.4 Signika for long reading, or add a text serif? (owner decision)

- Signika is a low-contrast humanist sans made for signage/wayfinding. It's fine for UI and captions, adequate for short essays, and a little soft and wide for 2,000-word posts [I].
- Options on Google Fonts (checked present [V]): **Newsreader** (opsz 6–72, 3 blocks), **Source Serif 4** (opsz 8–60, 6 blocks), **Literata** (opsz 7–72, 7 blocks). Newsreader matches "cinematic/editorial" best. Source Serif 4 pairs by design with Source Han Serif / Noto Serif SC, so if the zh accent serif is adopted, Source Serif 4 + Noto Serif SC is the most coherent serif pair [I].
- Cost: roughly one more ~20–40 KB variable woff2 for the Latin subset [I].
- **Key bilingual point:** if EN body becomes serif, ZH body is still sans (system Songti on Windows/Android is poor or missing [I]; Matters' serif stack drops back to sans [V]). The two locales then look different in body text. That's acceptable (Initium does serif headings + sans body in both [V]), but it's a brand choice.

---

## 3. Mixed CJK/Latin typography rules

| Topic | Rule | Support / evidence |
|---|---|---|
| **lang attribute** | `<html lang="en">` on `/en/`, `<html lang="zh-Hans">` on `/zh/`. Mark inline switches: `<span lang="en">Leica M11</span>` isn't needed inside zh text, but `<blockquote lang="en">` is, as are English photo EXIF blocks inside zh pages and `lang` on the switcher link. Angular SSR must set `document.documentElement.lang` per route at prerender time. | `:lang(zh)` matches `zh-Hans`, `zh-Hant`, `zh-TW` by prefix and inherits from ancestors, unlike `[lang|=]` [V W3C]. `lang` also drives Han glyph choice (SC vs TC/JP forms) in fonts like Noto CJK [I]. |
| **Line-height** | EN body 1.6–1.65. **ZH body 1.8** (range 1.75–1.9). ZH headings 1.35–1.4. Captions: EN 1.45, ZH 1.6. | sspai 1.8 body, 1.4 headings, 1.6 caption [V]. Apple adds zh-specific heading line-heights [V]. |
| **Font size** | ZH body 17px (1.0625rem) at desktop, 16px mobile. EN body 17–18px. Keep the Chinese size ≥ English: Han at the same px looks denser but has no x-height to rescue small sizes [I]. | sspai 15→17px, Matters 17px [V] |
| **Measure** | EN `max-width: 66ch` (60–72). **ZH `max-width: 36em`**: 1em = one Han character, so 36em ≈ 34–36 characters after punctuation; keep within 30–40. Use `em` not `ch` for zh, because `ch` is the width of "0" in the first font (Signika), not the Han em square. | sspai ≈ 592px / 17px ≈ 35 [V computed]. `ch` definition [I, CSS spec]. |
| **Letter-spacing** | ZH body `0` (or +0.02em max). **Reset any negative Latin tracking** on headings to `0` under `:lang(zh)`. Small-caps/uppercase tracking on EN labels must not carry over to zh labels. | Apple `:lang(zh){letter-spacing:0em}` ×42 [V] |
| **CJK↔Latin spacing** | `text-autospace: normal` on `:root`. Content convention: **pick one** (open question). (a) sparanoid style: type spaces ("用 Angular 构建"). Portable to RSS, OG descriptions, search snippets, copy-paste. The autospace rule doesn't add space next to a real space [I, spec "insert" behaviour]. (b) W3C i18n style: no typed spaces, CSS adds ~⅛–¼em. Typographically better, but lost in plain-text contexts. **Leaning (a)**, because meta descriptions and OG cards matter for SEO/social. | `text-autospace` Chrome 140 (`normal`/`no-autospace` only), Safari 18.4, Firefox 145, Baseline 2025 [V BCD/MDN]. sspai ships it on `:root` [V]. W3C says avoid typed spaces [V]. sparanoid says type them [V]. |
| **Punctuation width** | Use full-width Chinese punctuation （，。：；！？「」or “ ”）in zh text and half-width in English phrases. zh-Hans marks sit in the lower-left corner (PingFang SC/Noto SC handle this with `lang="zh-Hans"`) [V clreq / I font]. | clreq §2.1.2 [V] |
| **Quotes / dashes gotcha** | With `'Signika', 'PingFang SC'`, the characters “ ” ‘ ’ — … · come from **Signika** (its latin subset covers U+2000–206F [V]), so they render proportional and narrow inside Chinese. Fix: a `local()` face with `unicode-range: U+00B7, U+2014-2015, U+2018-2019, U+201C-201D, U+2026` pointing at PingFang SC / Microsoft YaHei / Noto Sans CJK SC, listed **before** Signika in the zh stack only. Or tell authors to use 「」 corner brackets. | Initium does the inverse on its zh-Hant site ("Latin Quotes Fix") [V]. `local()` names need device testing [I]. |
| **Punctuation kerning** | `text-spacing-trim: normal` is the default where supported. Chrome 123+ compresses adjacent CJK punctuation（e.g. `。」`）if the font has `halt`/`chws`. Nothing to do. Use `space-all` only for tabular text. | Chrome 123 only. Safari and Firefox: no [V BCD] |
| **Hanging punctuation** | Skip, or `hanging-punctuation: allow-end` as a Safari-only bonus on justified text. Don't justify zh body text in v1 (`text-align: start`); many Chinese sites justify, but it needs hyphen-free trimming to look good [I]. | Safari only (values since 10). Chrome/Firefox: false [V BCD] |
| **Emphasis** | **No italics** for zh: `em:lang(zh), i:lang(zh), cite:lang(zh) { font-style: normal }` + `font-synthesis-style: none`. Use `strong` → weight 600 and/or `em:lang(zh) { text-emphasis: filled dot; text-emphasis-position: under right; }` (clreq: dots below in horizontal text). Book titles: 《》 punctuation, not italics. | Notion `em:lang(zh){font-style:normal}` [V]. clreq §5.3.1 [V]. `text-emphasis` Chrome 99 unprefixed, Safari 7, Firefox 46. `over/under` Chrome 99, Safari 7, Firefox 108; needs both keywords [V BCD]. |
| **Line breaking** | Defaults are right for Chinese: breaks between any Han characters, with basic kinsoku (no `。，」` at line start) handled by `line-break: auto` [I]. Add `overflow-wrap: anywhere` for long URLs/code. **Don't** use `word-break: break-all` (breaks English words in mixed text) or `keep-all` (stops Han breaking). `word-break: auto-phrase` is Japanese/Korean only in Chrome 119+, not Chinese [V BCD]. | [V]/[I] as marked |
| **Wrapping polish** | `text-wrap: balance` on h1–h3 (Chrome 130 / Firefox 124 / Safari 17.5 for `text-wrap-style`). `text-wrap: pretty` on body (Chrome 130 longhand, Safari 26, Firefox none) to avoid a single orphan Han character on the last line. | [V BCD text-wrap-style] |
| **Headings** | ZH headings a step **smaller** than EN (Han at 38px+ is heavy), weight 600, not 700. Windows YaHei renders 600 as Bold [I]. sspai H1 38 / H2 32 / H3 24 at desktop, all 600 [V]. | |
| **Faux styles** | `:lang(zh) { font-synthesis: weight; }`: allow synthetic bold (YaHei), forbid synthetic oblique. | [I] |
| **Numbers** | Half-width Arabic digits in zh [V sparanoid]. They render in Signika, which keeps the brand in dates, EXIF and prices. | |

---

## 4. Language switcher UX

**Recommended pattern:**
- **Label in the target language, text not flags:** on EN pages show `中文`, on ZH pages show `EN` (or `English`). Flags are wrong for languages (zh isn't one country, and this site is in Malaysia) [I, common i18n guidance]. W3C: show options in their own language, place near top-right for LTR pages, and use direct text links when there are only a few languages rather than a dropdown [V W3C qa-navigation-select]. W3C also suggests a globe icon; optional. A two-language toggle doesn't need it [I].
- **Placement:** top-right of the header, after "Contact", with a matching entry in the footer and mobile menu [I].
- **Markup:** `<a href="/zh/blog/slug" hreflang="zh-Hans" lang="zh-Hans">中文</a>`. `lang` makes screen readers pronounce it correctly, and `hreflang` hints the target language [I]. Add `aria-label="切换到中文"` / `"Switch to English"` if the visible label is only "EN" [I].
- **Preserve path:** map `/en/<route>` ↔ `/zh/<route>` 1:1. If a post has no translation, link to the other locale's listing page with a note ("本文暂无中文版" / "Not yet translated"). Don't send people to a 404 [I].
- **Remember choice:** on click, set a first-party cookie (e.g. `lang=zh; Path=/; Max-Age=31536000; SameSite=Lax`). Use it **only at `/`** (the bare root) in the Worker to 302 to `/en/` or `/zh/`, falling back to Accept-Language and then `/en/`. **Never redirect a localized URL** based on cookie or Accept-Language: Google says "Avoid automatically redirecting users from one language version of a site to a different language version" [V]. The root redirect should be `Vary: Cookie, Accept-Language` or uncached [I].
- **hreflang (in prerendered `<head>`):** on every page, self + alternate + x-default, fully-qualified URLs, bidirectional [V Google]:
  ```html
  <link rel="alternate" hreflang="en" href="https://example.com/en/blog/slug">
  <link rel="alternate" hreflang="zh-Hans" href="https://example.com/zh/blog/slug">
  <link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/slug">
  ```
  `zh-Hans` is valid for Google [V]. Initium uses `zh-Hans`/`zh-Hant` [V], Notion `zh`/`zh-tw` [V], The Type `zh`/`en` [V]. Omit the zh alternate on untranslated posts. `og:locale` `en_US` / `zh_CN`, with `og:locale:alternate` [I].
- **Examples seen:** URL structures and hreflang for Initium (`/zh-hans/`), Notion (`/zh-cn`), The Type (`/en/`) [V]. I didn't render their switcher UI (client-side), so their labels aren't verified.

---

## 5. Token proposal (Tailwind 4 `@theme` + `:lang()` overrides)

Design: one set of **semantic tokens** (`--font-body`, `--leading-body`, `--measure-prose`, …) used by utilities and components, with values swapped under `:lang(zh)`. Components never branch on locale. This is the Apple/Notion pattern [V].

```css
/* ---------- CJK punctuation fix: only used by the zh stack ---------- */
/* Forces quotes/dashes/ellipsis/middle-dot to CJK full-width shapes inside Chinese text. [I – test local() names on macOS, Windows, Android] */
@font-face {
  font-family: "CJK Punct";
  src: local("PingFang SC Regular"), local("PingFangSC-Regular"),
       local("Microsoft YaHei"), local("Noto Sans CJK SC"), local("Source Han Sans SC");
  unicode-range: U+00B7, U+2014-2015, U+2018-2019, U+201C-201D, U+2026;
}

@theme {
  /* Families (EN defaults) */
  --font-display: "Signika", ui-sans-serif, system-ui, sans-serif;
  --font-body:    "Signika", ui-sans-serif, system-ui, sans-serif;   /* or "Newsreader", Georgia, serif — owner decision */
  --font-script:  "Nothing You Could Do", cursive;
  --font-mono:    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;

  /* CJK fallback chain, reused below */
  --font-cjk-sans: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", "Noto Sans SC";

  /* Type scale — EN */
  --text-caption: 0.875rem;  --text-caption--line-height: 1.45;
  --text-body:    1.125rem;  --text-body--line-height: 1.65;       /* 18px */
  --text-lede:    1.3125rem; --text-lede--line-height: 1.5;
  --text-h3:      1.5rem;    --text-h3--line-height: 1.3;
  --text-h2:      2rem;      --text-h2--line-height: 1.2;
  --text-h1:      clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem); --text-h1--line-height: 1.1;

  /* Tracking */
  --tracking-display: -0.015em;
  --tracking-label: 0.08em;       /* uppercase EN labels */

  /* Measure */
  --measure-prose: 66ch;
}

/* Semantic hooks consumed by components (not Tailwind-generated) */
:root {
  --leading-prose: 1.65;
  --prose-size: var(--text-body);
  --emphasis-style: italic;
  text-autospace: normal;          /* Chrome 140 / Safari 18.4 / Firefox 145 */
}

/* ---------- zh-Hans overrides ---------- */
:root:lang(zh) {
  --font-display: "CJK Punct", "Signika", var(--font-cjk-sans), sans-serif;
  --font-body:    "CJK Punct", "Signika", var(--font-cjk-sans), sans-serif;  /* stays sans even if EN goes serif */
  --font-mono:    ui-monospace, SFMono-Regular, Menlo, Consolas, var(--font-cjk-sans), monospace;

  --text-body: 1.0625rem;  --text-body--line-height: 1.8;   /* 17px, sspai-aligned */
  --text-caption: 0.875rem; --text-caption--line-height: 1.6;
  --text-lede: 1.1875rem;  --text-lede--line-height: 1.7;
  --text-h3: 1.375rem;     --text-h3--line-height: 1.4;
  --text-h2: 1.75rem;      --text-h2--line-height: 1.4;
  --text-h1: clamp(1.875rem, 1.4rem + 2vw, 2.75rem); --text-h1--line-height: 1.35;

  --tracking-display: 0;
  --tracking-label: 0.04em;       /* no uppercase in Han; keep a little air for small labels */

  --measure-prose: 36em;          /* ≈ 34–36 Han characters */
  --leading-prose: 1.8;
  --prose-size: 1.0625rem;
  font-synthesis: weight;         /* allow faux bold (YaHei), forbid faux italic */
}

/* Emphasis without italics */
:lang(zh) :is(em, i, cite, dfn) { font-style: normal; }
:lang(zh) em {
  text-emphasis: filled dot;
  text-emphasis-position: under right;
}
:lang(zh) :is(h1, h2, h3, h4) { font-weight: 600; }

/* Prose container */
.prose-body {
  max-inline-size: var(--measure-prose);
  font-family: var(--font-body);
  font-size: var(--prose-size);
  line-height: var(--leading-prose);
  overflow-wrap: anywhere;
  text-wrap: pretty;
}
.prose-body :is(h1, h2, h3) { text-wrap: balance; letter-spacing: var(--tracking-display); }

/* The signature script stays Latin in both locales */
.font-script { font-family: "Nothing You Could Do", cursive; }
```

Implementation notes [I]:
- Tailwind 4 tokens are CSS custom properties, so overriding them inside `:root:lang(zh)` flows into `font-display`, `text-h2` and other utilities. Test that Tailwind's `--text-*--line-height` companion vars are read through `var()` at use time (they are in v4's generated utilities, but confirm in the build).
- The existing `.font-signika` helper classes in `styles.scss` hard-code `font-family: "Signika"`. Those would skip the zh stack's `CJK Punct` layer and should switch to `var(--font-display)`.
- Google Fonts request stays Latin-only (`Signika` + script). No zh preload. Add `&display=swap` as now.
- Don't add `unicode-range` CJK slices for Signika. It has none, and per-glyph fallback to PingFang is automatic.
- Check CLS: the zh stack uses local fonts only, so no font-swap CLS on zh pages beyond Signika's Latin digits/words.

---

## 6. Open questions for the owner

1. **Mixed-script spacing convention:** type spaces between Chinese and English/numbers (sparanoid; portable to RSS/OG/SEO snippets), or no typed spaces and rely on `text-autospace` (W3C i18n; typographically finer)? Recommendation: type spaces.
2. **Body face for long reads:** keep Signika for EN articles, or add a text serif (Newsreader / Source Serif 4 / Literata)? If serif, accept that ZH body stays sans?
3. **Chinese display accent:** none (system only), Noto Serif SC for zh article titles, or LXGW WenKai (self-hosted SC build) for pull quotes/captions? Each adds weight and a new voice.
4. **Readers in mainland China:** does reachability from mainland China matter? If yes, avoid `fonts.googleapis.com`/`gstatic` for any zh-page asset and self-host Signika too.
5. **Quote style in zh-Hans:** curly “ ” (needs the `CJK Punct` fix) or corner brackets 「 」 (sidesteps it, more common in Traditional/Japanese, less usual in mainland Simplified)?
6. **Switcher label:** `中文 / EN` shown as a pair with the current one highlighted, or only the other language (`中文` on EN pages, `EN` on ZH pages)? Also: text link only, or globe icon + label?
7. **Untranslated posts:** hide them from `/zh/` listings, show them with an "English only" tag, or machine-translate as a draft?
8. **Root URL `/`:** cookie/Accept-Language 302 to a locale, or a static EN landing with the switcher (simplest for caching and SEO)?
9. **Signature in zh:** keep the Latin "Nothing You Could Do" signature on Chinese pages, or add the Chinese name as plain text beside it?
10. **Justification:** left-aligned Chinese (recommended v1), or justified like print (needs care with `text-spacing-trim`, which is Chrome-only)?

---

## Sources

- sspai: https://sspai.com (CSS at https://post.sspai.com/…, needs a Referer header)
- Initium: https://theinitium.com , https://theinitium.com/zh-hans/
- Matters: https://matters.town
- Apple China: https://www.apple.com.cn/iphone/
- Notion zh-cn: https://www.notion.com/zh-cn
- Vercel zh: https://vercel.com/zh
- The Type: https://www.thetype.com/ , https://www.thetype.com/en/
- justfont: https://www.justfont.com
- Chinese copywriting guidelines: https://github.com/sparanoid/chinese-copywriting-guidelines
- W3C clreq: https://www.w3.org/TR/clreq/
- W3C i18n inline space: https://www.w3.org/International/articles/styling/inline-space
- W3C `:lang` vs `[lang]`: https://www.w3.org/International/questions/qa-css-lang
- W3C language selector: https://www.w3.org/International/questions/qa-navigation-select
- MDN text-autospace: https://developer.mozilla.org/en-US/docs/Web/CSS/text-autospace
- MDN text-spacing-trim: https://developer.mozilla.org/en-US/docs/Web/CSS/text-spacing-trim
- MDN hanging-punctuation: https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation
- MDN BCD JSON: https://github.com/mdn/browser-compat-data (css/properties/text-autospace.json, text-spacing-trim.json, hanging-punctuation.json, text-emphasis.json, text-emphasis-position.json, word-break.json, text-wrap-style.json)
- Chrome i18n CSS features blog (older; text-autospace status there is out of date): https://developer.chrome.com/blog/css-i18n-features
- Blink intent to ship text-autospace: https://groups.google.com/a/chromium.org/g/blink-dev/c/gwRvkPJ5pws/m/F3r-VeGoBAAJ
- Google hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google multi-regional (no auto-redirect): https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Google Fonts CSS API (slice counts measured): https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400
- Google Fonts ML slicing research: https://google.github.io/speaker-id/publications/MLFont/ ; Korean launch: https://developers.googleblog.com/en/google-fonts-launches-korean-support/
- LXGW WenKai: https://github.com/lxgw/LxgwWenKai
- cn-font-split: https://github.com/KonghaYao/cn-font-split
- HarmonyOS Sans licence mirror: https://sheep-realms.github.io/Document/archive/license/harmonyos-sans-fonts/ ; split webfont: https://github.com/SunsetMkt/HarmonyOS_Sans_SC_Webfont_Splitted
- MiSans: https://hyperos.mi.com/font (licence PDF linked there)
- Alibaba PuHuiTi: https://www.alibabafonts.com/#/font
