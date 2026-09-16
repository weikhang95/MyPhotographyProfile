# 02 — Technical & editorial blogs: design research

For: Chong Wei Khang (Penang), a single site that combines a photo portfolio with a bilingual (EN / 简体中文) blog about AI and agent concepts.
Research date: 2026-09-16. Method: WebFetch (returns text only, summarised by a small model) plus WebSearch.

**Evidence labels**
- **[V] Verified:** the fetched text showed this: nav labels, URLs, headings, metadata strings, section order.
- **[I] Inferred:** visual or typographic detail the fetch couldn't show. It comes from the text structure or general familiarity with the site, so check it in a browser before copying it.
- Every URL below came from a fetch or a search result. None are made up. Where a path is relative, it is relative to that site's domain.

---

## 0. Coverage

| # | Site | Reached? | Why it's relevant |
|---|------|----------|-------------------|
| 1 | simonwillison.net (+ til.simonwillison.net) | Yes | Owner reference. Mixes content types, has notes, TIL, series and tags |
| 2 | anthropic.com/engineering | Yes | Owner reference. Long AI/agent explainers with diagrams |
| 3 | openai.com/index/… | **Blocked (HTTP 403)** | Owner reference. Only search-result metadata is available |
| 4 | lilianweng.github.io (Lil'Log) | Yes | Explains AI concepts; TOC, figures, citations |
| 5 | huyenchip.com | Yes | AI engineering long reads, adapted from her book |
| 6 | eugeneyan.com | Yes | Applied LLM patterns; consistent section template |
| 7 | hamel.dev | Yes | Blog vs Notes split; table-style index |
| 8 | jvns.ca (Julia Evans) | Yes | Approachable explainers, TIL, category-first index |
| 9 | maggieappleton.com | Yes | Digital garden: content types, growth stages, /now |
| 10 | joshwcomeau.com | Yes | Interactive explainers, "last updated", TOC |
| 11 | gwern.net | Yes (/about) | Metadata block, sidenotes, popups, confidence labels |
| 12 | ciechanow.ski | Yes | Explainers built on interactive figures |
| 13 | leerob.com | Yes | Minimal index; evergreen topic notes plus a dated blog |
| 14 | linear.app/now | Yes | Polished company editorial index with category tabs |
| 15 | stripe.dev/blog (redirect from stripe.com/blog/engineering) | Yes | Filterable engineering index |
| 16 | vercel.com/blog | Yes | Category-filtered company blog |
| 17 | andymatuschak.org, rauno.me, paco.me, sive.rs/now | Yes (light pass) | Working notes, minimal craft sites, canonical /now page |

---

## 1. Simon Willison — https://simonwillison.net/

**Content types [V]:** Entries (long posts, with word counts), Links (at `/blogmarks/`), Quotes (at `/quotations/`), Notes, Guides, Elsewhere, Tools, Releases, Sightings (iNaturalist). TILs live on a separate subdomain, and so do Tools.

**Navigation [V]**
- Top nav: About (`/about/`), Subscribe (`/about/#subscribe`), TILs (til.simonwillison.net), Tools (tools.simonwillison.net).
- Type filters: Entries `/entries/`, Links `/blogmarks/`, Quotes `/quotations/`, Notes `/notes/`, Guides `/guides/`, Elsewhere `/elsewhere/`.
- Feed: Atom at `/atom/everything/`.

**Index (homepage) [V]**
- One reverse-chronological stream that mixes all types.
- Each item shows its date and time ("15th Sep 2026, 10:47 pm"), tag links (`/tags/llm/`), and an excerpt or the full text depending on type.
- A "Highlights" block lists curated recent posts.
- The footer has yearly archive links from 2002 to 2026.
- A "Monthly briefing" sponsorship CTA sits in the sidebar.
- [I] The layout is dense, text-first and two-column (main stream plus sidebar), with a serif-ish, unfussy look.

**Entry list (`/entries/`) [V]**
- Each item: title, optional thumbnail, preview, word count, a timestamp permalink, and tags.
- Paginated. The sidebar filters by year and tag and shows counts.

**Entry page anatomy [V]** (from `/2026/Sep/8/on-navier-stokes/`)
1. Title
2. Date and time
3. Body, with long blockquotes of the sources he's reacting to
4. Footer line: "Posted 8th September 2026 at 11:55 pm · Follow me on Mastodon, Bluesky, Twitter or subscribe to my newsletter"
5. Tags with global counts (e.g. "ai 2,235, generative-ai 1,981")
6. "Next:" and "Previous:" links, each with a title and date
7. "Monthly briefing" sponsor block
8. Yearly archive, "Disclosures", "Colophon"

**Notes (`/notes/`) [V]**
- Titled short posts, from a single paragraph to a few hundred words.
- Each has a date-time permalink (`/2026/Sep/11/wrapture/`) and tags.
- 155 notes across 6 pages. The sidebar has year filters and a tag cloud.
- Notes use the same `/YYYY/Mon/DD/slug/` URL scheme as entries, so the type is metadata and not part of the URL.

**Series (`/series/`) [V]**
- The index lists each series with a descriptive subtitle and a numbered list of its parts, each with a date.
- Examples: `/series/gpt-5/`, `/series/prompt-injection/`, `/series/how-its-trained/`.

**TIL (til.simonwillison.net) [V]**
- Headed "Browse by topic:", with tags sorted A–Z and counts (python 66, sqlite 55…).
- "Browse all 582 TILs"
- Recent TILs shown with topic, title, YYYY-MM-DD date and an excerpt.
- Atom feed at `/tils/feed.atom`. Source lives in the GitHub repo simonw/til.

**How he makes AI approachable:**
- He quotes the primary source first, then reacts to it.
- Posts are short and frequent, and link densely to his own earlier posts on the same tag.
- [I] Tag counts show how deep a topic goes on the site.

**Steal**
1. **One URL scheme and one feed for every type.** Type is a filterable facet (`/entries/`, `/notes/`) and there's an "everything" Atom feed plus per-type feeds.
2. **Series pages are numbered, dated lists with a one-line description.** It's cheap to build and makes a multi-part deep dive easy to follow.
3. **"Previous / Next" with title and date on every post.**

**Avoid:** the density. Timestamps down to the minute, eight-plus content types and a tag cloud with counts are too busy for a brand that wants to feel "Calm · Cinematic". Keep 3 types at most (Post, Note, TIL) and show dates without times.

---

## 2. Anthropic Engineering — https://www.anthropic.com/engineering

**Index [V]**
- Headed "Engineering at Anthropic: Inside the team building reliable AI systems", with "Start building" and "Developer docs" CTAs.
- One large **featured card** ("How we contain Claude across products"), then a chronological **grid** of thumbnail, title and date. The grid has **no excerpts**.
- **No category filters.** 25 posts listed.
- Slugs are human-readable: `/engineering/building-effective-agents`, `/engineering/effective-context-engineering-for-ai-agents`, `/engineering/multi-agent-research-system`, `/engineering/writing-tools-for-agents`, `/engineering/april-23-postmortem`.

**Post anatomy [V]** (building-effective-agents, effective-context-engineering-for-ai-agents)
1. Eyebrow: "Engineering at Anthropic"
2. Title
3. Published date (e.g. "Published Sep 29, 2025")
4. Lead paragraph that states the thesis in one sentence. Examples: "Context is a critical but finite resource for AI agents", and "the most successful implementations use simple, composable patterns rather than complex frameworks".
5. **No TOC** [V]. Structure comes from clear H2 and H3 headings.
6. H2 headings are framed as questions or contrasts:
   - "What are agents?"
   - "When (and when not) to use agents"
   - "When and how to use frameworks"
   - "Context engineering vs. prompt engineering"
   - "The anatomy of effective context"
7. **Explicit definitions** in the body. Example: context is "the set of tokens included when sampling from a large-language model (LLM)". Workflows and agents are defined in two contrasting sentences.
8. **One diagram per pattern, all in the same style** (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer). Captions are full explanatory sentences, e.g. "In contrast to the discrete task of writing a prompt, context engineering is iterative…"
9. Pattern sections repeat the same shape: what it is, when to use it, examples.
10. "Summary" or "Conclusion"
11. Appendices ("Appendix 1: Agents in practice", "Appendix 2: Prompt engineering your tools")
12. "Acknowledgements", which names the authors ("Written by…") and contributors. The byline sits at the **bottom**.
13. A note that the landscape has changed, linking to newer docs
14. Newsletter signup

**Typography [I]:** A large serif display title on a warm off-white background, a generous measure, and flat, restrained, monochrome-plus-clay diagrams. This is the closest match to the owner's palette.

**How it makes AI approachable:** it defines each term before using it, adds "when (and when not) to use" guidance, moves from building blocks to workflows to agents, uses the same diagram grammar throughout, and puts heavy detail in appendices.

**Steal**
1. **A consistent diagram grammar** (the same boxes, arrows and colours in every figure), with **captions that are complete sentences**.
2. **Question-style and "X vs. Y" H2s, plus an explicit one-sentence definition.** Good for readers and for answer engines.
3. **Appendices for depth** keep the main path short.

**Avoid:** credits only at the bottom and no TOC on 5,000-plus-word posts. For a personal blog, put the author and date at the top, and add a TOC once a post passes about 1,500 words.

---

## 3. OpenAI engineering/index posts — https://openai.com/index/scaling-storage-one-billion-users-part-one/

**Status: WebFetch returned HTTP 403 Forbidden.** No structure was verified.

What WebSearch showed [V, from the search snippet only]:
- Page title: "Rapidly scaling online storage to serve over 1 billion ChatGPT users".
- It's part one of a series; the snippet says "In part II of this series…".
- It's a narrative case study: Habitat went from a Python library to a service and was then rewritten in Rust, with headline metrics (6x CPU, 15x memory, 70M+ requests per second, 500+ PB).
- A related post exists: https://openai.com/index/scaling-postgresql/

**Anatomy [I]:**
- Centered hero: category, title, date. Full-bleed media, then a single narrow column.
- Big numbers pulled out early.
- The series is signalled in the slug (`-part-one`) and in the text.

**Steal:**
1. **Put the headline numbers and outcome in the first screen**, as a TL;DR in effect.
2. **Put "part one" in the slug and the title**, and add a forward reference to part II.

**Avoid:** blocking crawlers and fetchers. It makes the content invisible to AI answer engines, which works against the owner's AEO goals. Keep the owner's site fully fetchable.

---

## 4. Lilian Weng — Lil'Log — https://lilianweng.github.io/

**Navigation [V]:** Posts, Archive, Search, Tags, FAQ. Icons for Twitter, Google Scholar, RSS, GitHub and Instagram.

**Index [V]**
- A paginated list. Each item has a title, the opening paragraphs as an excerpt, the date, reading time and author ("July 4, 2026 | 31 min read").
- Example: `/posts/2023-06-23-agent/` "LLM Powered Autonomous Agents"
- Slugs follow `/posts/YYYY-MM-DD-slug/`.

**Post anatomy [V]** (`/posts/2023-06-23-agent/`)
1. Title
2. Date, reading time, author
3. **Collapsible table of contents**
4. H2 and H3 structure (overview, then component sections)
5. Figures captioned "Fig. N" with descriptive text
6. Numbered inline citations [1]
7. A **"Cited as" block with a BibTeX entry**
8. References list

[I] Tags and prev/next links at the bottom, following the Hugo PaperMod theme conventions.

**How she makes AI approachable [V]**
- Analogies to human cognition (e.g. sensory memory mapped to embeddings).
- One overview diagram of the whole system comes first, then each component gets its own section.
- Case studies (ChemCrow, Generative Agents).

**Typography [I]:** A plain sans-serif theme with a light and dark toggle. Utilitarian, so the content carries the page.

**Steal**
1. **A collapsible TOC at the top** of long posts.
2. **An overview diagram first, then one section per box in the diagram.**
3. **A "Cited as" block** (plain text plus BibTeX). It's cheap, builds credibility, and suits AEO and people who reference the posts.

**Avoid:** "31 min read" posts with no TL;DR. Readers can't tell what they'll get without committing to the whole thing.

---

## 5. Chip Huyen — https://huyenchip.com/blog/

**Navigation [V]:** Blog, Books, Events, AI Guide (ML Roadmap, Good AI List, ML Interviews), List 100, Chip's Lib, and a Vietnamese version.

**Index [V]:** Minimal. Each row is date, title and a horizontal divider. URLs follow `/{YYYY}/{MM}/{DD}/{slug}.html`, and there's an RSS feed at `/feed.xml`.

**Post anatomy [V]** (`/2025/01/07/agents.html`)
1. Title, date
2. A note that the post was adapted from the AI Engineering book
3. **Linked TOC**
4. Sections that go from overview, to tools (grouped into knowledge augmentation, capability extension and write actions), to planning, to failure modes and evaluation
5. "Figure 6-8"-style captions
6. **Sidebar callouts and tip boxes**
7. A conclusion that previews what comes next

**Approachability:** She defines terms simply before going technical, gives taxonomies (three kinds of tools), uses concrete product examples, and compares options visually (sequential vs. parallel).

**Bilingual note [V]:** The site links to a separate Vietnamese version, which is relevant to the owner's EN/中文 plan.

**Steal:**
1. **Taxonomy headings** ("three types of X"), which chunk the material well.
2. **Tip and warning callouts** that sit beside the main argument instead of interrupting it.

**Avoid:** an index with only date and title and no description. Readers can't judge a 6,000-word post from its title alone.

---

## 6. Eugene Yan — https://eugeneyan.com/

**Navigation [V]:** Start Here, Writing, Speaking, Prototyping, About, Search (`/search/`).

**Index [V]**
- A "Latest" list (date as DD Mon YYYY, title, short description).
- Curated groups: "More than 50k Reads" and "My Favourites".
- Tags at `/tag/…`. RSS at `/rss/`.
- Stats: 212 posts, 31 talks, 19 prototypes, 426,689 words.
- The fetch reported emoji tags (🔥 for popular). Treat this as likely but check it.

**Post anatomy [V]** (`/writing/llm-patterns/`)
1. Title
2. Tags (llm, engineering, production, 🔥)
3. "66 min read"
4. Discussion links (HN, Twitter, LinkedIn)
5. An epigraph quote
6. Intro, then an overview that lists the "seven key patterns" as bullets, plus an overview diagram
7. **Every pattern section repeats the same three subsections: "Why X?", "More about X", "How to apply X?"**
8. "Conclusion" with a visual
9. References

**Steal**
1. **A "Start Here" page** that curates the best posts for newcomers.
2. **A repeating Why / What / How-to-apply template** for each concept. Very AEO-friendly.
3. **An overview list of the N ideas at the top** that doubles as a TL;DR.

**Avoid:** vanity metrics ("426,689 words", "50k reads") in the nav or index. They don't fit a calm, editorial voice.

---

## 7. Hamel Husain — https://hamel.dev/

**Navigation [V]:** Blog, Notes, OSS, Teaching.

**Index [V]**
- Blog posts in a **table**: Date (M/D/YY) and Title. No reading time or categories.
- Notes is a **separate section, organised by topic** (e.g. `/notes/llm/…`). There's a newsletter subscribe link.

[I] Built on Quarto, so posts get an auto right-rail TOC, callouts and code copy buttons.

**Steal:** **Keep polished posts and working notes separate.** Notes are organised by topic, like a reference wiki, and posts by date.

**Avoid:** a date-and-title table with no summaries. It's too sparse to browse.

---

## 8. Julia Evans — https://jvns.ca/

**Navigation [V]**
- Header: About, Talks, Projects, Mastodon, Bluesky, Github.
- Secondary: Favorites, TIL (`/til/`), Zines, RSS (`/atom.xml`).
- Also `/categories/` and `/newsletter`.

**Index [V]:** The 10 most recent posts, then **long topic groupings** ("Git", "DNS", "How a computer thing works", "Linux debugging/tracing tools", career, year-in-review…).

**TIL [V]**
- A reverse-chronological list with **the full content inline**: title linked to `/til/slug/`, date ("Feb 2 2026"), prose, code and images.
- Items run from 2 to 5-plus paragraphs.
- Examples: `/til/esbuild-can-build-css/`, `/til/unbuffer/`.

**Post anatomy [V]** (`/blog/2024/02/16/popular-git-config-options/`)
1. Title, date
2. An intro that explains her motivation in the first person
3. **A TOC** whose entries are the literal option names
4. H2s that are the concrete things themselves ("merge.conflictstyle zdiff3")
5. Many code blocks, including a before/after comparison
6. Footer: category ("git"), "Want a weekly digest of this blog? Subscribe", prev/next links

**Approachability [V/I]:** A first-person "I was confused about X" framing, comics and zines, and a friendly, curious tone with no assumed expertise.

**Steal**
1. **An index grouped by topic, under a short "recent" list.** Better for evergreen concept posts than a pure date stream.
2. **Show the full TIL body in the TIL list.** No click needed; they're short.
3. **An intro that says why the post exists** ("I kept getting asked…").

**Avoid:** the very long, unstyled category dump on the homepage. It's overwhelming on mobile.

---

## 9. Maggie Appleton — https://maggieappleton.com/

**Navigation [V]:** Home, The Garden (`/garden`), Essays, Notes, Patterns, Smidgeons, Talks, Podcasts, Library, Antilibrary, Now (`/now`), About, Colophon, RSS (`/rss.xml`).

**Type definitions [V]**
- Essays: "Opinionated, long-form narrative writing with an agenda"
- Notes: "Loose notes on things I don't entirely understand yet"
- Smidgeons: curated links and brief thoughts

**Garden index [V]**
- Filters by **type** (Essays, Notes, Patterns, Talks, Podcasts, Now Updates, Smidgeons), by **topic** (AI, Language Models, Design… 20+ in all), and by **growth stage** (Seedling, Budding, Evergreen).
- Each card shows title, growth-stage icon, relative date ("about 1 year ago"), type label, and an optional thumbnail.
- Essay URLs are flat: `/ai-dark-forest`, `/tools-for-thought`.

**/now [V]**
- "Last updated August 2026".
- An **append-only log with dated sections** ("August 2026", "January 2026" … back to "September 2020").
- Narrative prose with book covers, photos and prototype screenshots. The current entry runs to about 2,000 words.

**Typography [I]:** A serif display face with hand-drawn illustrations and warm, soft colour. It's editorial and illustrated.

**Steal**
1. **A one-line definition for each content type, shown on its index page**, so readers know what a "Note" is and what to expect.
2. **A /now page kept as an append-only dated log.** Its history becomes a lightweight personal timeline.
3. **A maturity or status label** (seedling to evergreen). Useful for "notes I'm still figuring out" in fast-moving AI topics.

**Avoid:** relative dates ("almost 4 years ago") on technical AI content. Readers need absolute dates to judge whether it's stale. Also avoid 12-plus nav items.

---

## 10. Josh W. Comeau — https://www.joshwcomeau.com/css/center-a-div/

**Post anatomy [V]**
1. Site nav (categories, courses, goodies, about)
2. Title "How To Center a Div", then a **subtitle** "The Ultimate Guide to Centering in CSS"
3. A category tag (CSS), the published date (Feb 2024) and **last updated (Apr 2026)**
4. A linked TOC (12 sections)
5. Sections that each combine an explanation, **an interactive demo with sliders**, and highlighted code with a copy button
6. Callout boxes and a sidebar-style aside
7. A "Pick two" constraint diagram
8. A summary **decision tree**
9. A last-updated stamp, newsletter form and category links

[V] No comments, likes or related posts.

**Typography [I]:** A playful, high-polish look with bright colour and springy motion. That's the opposite of the owner's brand, but the **structure** carries over.

**Steal**
1. **Title plus a subtitle (dek)**. A single sentence that promises what you'll learn.
2. **Show "Published" and "Last updated" together.** Essential for AI posts that go stale.
3. **End with a decision tree or "which should I use?" summary.**

**Avoid:** heavy motion and bouncy interactions. They clash with "no heavy motion". Use static, well-captioned diagrams instead, with optional stepped (click-to-advance) figures at most.

---

## 11. Gwern — https://gwern.net/about

**Metadata block [V]**
- created and modified dates ("the last time the page was meaningfully modified")
- **status**: notes, draft, in progress, finished
- **confidence**: estimative words ("highly likely", "possible", "remote")
- **importance**: 0–10

**Structure [V]**
- An abstract at the top
- Sidenotes in the margin
- Hover popups for links and citations
- Link icons
- Collapsible sections
- An auto-generated TOC
- Backlinks and similar links
- Tags

The design is "minimalist monochrome".

**Steal:**
1. **An abstract at the top with status and confidence labels.** Honest epistemic signals suit AI speculation well.
2. **Margin sidenotes on wide screens that fall back to footnotes on mobile.** They keep the 60–72ch measure clean.

**Avoid:** popups on every link and the heavy metadata apparatus. Too much machinery for a personal blog, and it's hard to make work on touch screens and in two languages.

---

## 12. Bartosz Ciechanowski — https://ciechanow.ski/

**Structure [V]**
- Nav: Blog, Archives, Patreon, X, Instagram, email, RSS.
- The index is a date, a linked title and one descriptive paragraph (e.g. "Moon", December 17, 2024, `/moon/`).
- Articles are built around many embedded interactive simulations, with anchor-linked section headings, equations and cross-links to earlier articles.

**Steal:** **treat figures as the argument, not decoration.** Each figure answers exactly one question the preceding paragraph raised.

**Avoid:** relying on WebGL-heavy interactives for the core explanation. That's not viable for a bilingual solo blog, has accessibility costs, and needs a static fallback anyway.

---

## 13. Lee Robinson — https://leerob.com/

**Structure [V]**
- A minimal header (name, X link).
- A **"Notes"-style set of evergreen topic pages at top-level slugs**: `/ai`, `/beliefs`, `/dx`, `/devrel`, `/personal-software`, `/product-engineers`…
- Then a dated blog list, newest to oldest (e.g. "How we teach AI models", July 2026).
- One hand-painted hero illustration.

**Typography [I]:** Near-monochrome text with lots of white space.

**Steal:** **evergreen "topic hub" pages** (e.g. `/agents`) that he updates over time and that link out to the dated posts. These are ideal AEO targets.

**Avoid:** almost no metadata in the index. No descriptions, and topics aren't marked.

---

## 14. Linear — https://linear.app/now

**Index [V]**
- **Tabs**: All, Changelog, Product launches, From the team, From the community, Press.
- A featured card grid, where each card has an image, title, author, date, category label and an arrow.
- An archive section with "Load more".
- Posts at `/now/rebuilding-delta-sync-read-path` and `/now/styling-linear-for-the-future-stylex`.

**Typography [I]:** Dark and precise, with a tight grid.

**Steal:** **a single row of tabs as the type filter** (All, Posts, Notes, TIL), instead of a sidebar.

**Avoid:** an image-led card grid for text-first technical writing. It forces a thumbnail onto every post, which is a real burden for notes.

---

## 15. Stripe — https://stripe.dev/blog/topic/engineering

(Redirected from stripe.com/blog/engineering with a 301.)

**Index [V]**
- 117 posts.
- A sidebar of **27 topic filters** (AI, Agentic Commerce, Infrastructure…).
- Each item shows the date (YYYY.M.DD), title, summary paragraph, author(s), topic tags and a "Read" link.
- Example: `/blog/minions-stripes-one-shot-end-to-end-coding-agents`.

**Steal:** **list items with date, title, a one-sentence summary and tags.** It's the right amount of information for a text index.

**Avoid:** 27 filters. Cap the owner's tags at about 10 to 15 curated topics.

---

## 16. Vercel — https://vercel.com/blog

**Index [V]**
- Category filters: Customer stories, Engineering, Company News, Field Engineering, Security, Community, v0.
- Each card has title, date ("Published: 2026-09-15"), category and a 2–3 sentence excerpt.
- The fetch reported **posts available as markdown**. Worth checking; it fits the AEO goal.

**Steal:** **publish a Markdown twin of each post** (e.g. `/blog/slug.md`), plus an `llms.txt`, so agents can read posts cheaply.

**Avoid:** mixing customer and marketing content into the engineering stream.

---

## 17. Light-pass sites

**Andy Matuschak — https://andymatuschak.org/ [V]**
- Essays under "Letters from the Lab", some patron-only with a lock icon.
- Working notes live on the separate notes.andymatuschak.org, with a stacked-notes UI.
- Notes have titles that are claims ("Evergreen notes…").

**Steal:** **note titles written as a claim or concept** ("Agents are loops with tools"), not "Notes on agents".

**Avoid:** stacked panes. Complex on mobile.

**Rauno Freiberg — https://rauno.me/ [V]**
- Nav: Craft (`/craft`), Projects, Field Notes (`/notes`), plus external links to Devouring Details and History of Software Design.
- A manifesto line: "Make it fast. Make it beautiful…"

[I] Tiny, restrained type with lots of space.

**Steal:** **"Field Notes"** as a warm name for short posts, which suits a photographer.

**Paco Coursey — https://paco.me/ [V]**
- A single text page divided into sections (Building, Projects, Writing with "All writing", Now, Connect).
- There's a "Now" section right on the homepage.
- No dates on projects.

**Steal:** **a short "Now" excerpt on the homepage** that links to the full /now page.

**Derek Sivers — https://sive.rs/now (the originator of /now pages) [V]**
- "Updated September 14th, 2026, from my home in the woods in New Zealand, where…". The date comes with a location and a line about the weather or season.
- "(This is a now page, and if you have your own site, you should make one, too.)" links to nownownow.com/about.
- Seven short sections with lowercase, plain-language headings.

---

# SYNTHESIS for Chong Wei Khang's site

## A. Blog index: mixed or separate?

**Recommendation: one stream with type tabs** (Simon Willison plus Linear), shown as a calm text list rather than cards.

```
/writing                 ← index (EN)   /zh/writing ← index (中文)
[ All · Posts · Notes · TIL ]           ← tab row (Linear); each tab is a real URL
                                          /writing/posts  /writing/notes  /writing/til
(optional) Start here → 3–5 curated posts (Eugene Yan)
(optional) Series strip → 1–3 active series (Simon)

2026 ───────────────────────────────
Sep 12  POST  Title of long deep dive
              One-sentence dek/summary (Stripe)           agents · evals   14 min
Sep 10  NOTE  Title of note written as a claim
              first ~30 words inline…                     claude-code
Sep 08  TIL   How to X in Y                               cloudflare
```

Details:
- **Group by year**, with the date on the left in monospace and a small type label (POST / NOTE / TIL).
- **Posts show a dek and reading time. Notes show their opening words. TILs show only the title.** Visual weight follows depth.
- Don't use thumbnails. Save imagery for the photo portfolio side so the two halves feel different but related.
- Put a language switch (EN / 中文) in the header. **Mark posts that only exist in one language** (e.g. "EN only") instead of hiding them. Chip Huyen's separate language version is the precedent.
- Also offer a topic view (Julia Evans) at `/writing/topics`, for the evergreen AI concepts.
- **Feeds:** `/atom.xml` (everything), `/posts/atom.xml`, `/notes/atom.xml`, `/til/atom.xml`, and one set per language (`/zh/atom.xml`). Link them in the index footer as "Subscribe".

## B. Long-post anatomy (ordered blocks)

1. **Eyebrow:** Series name and part ("Agent Harnesses · Part 2 of 4"), or the primary tag. (Anthropic, OpenAI)
2. **Title (H1):** plain and specific, around 8 to 12 words.
3. **Dek (subtitle):** one sentence promising what the reader will get. (Comeau)
4. **Meta line (monospace):** Published 2026-09-12 · Updated 2026-10-01 · 14 min read · EN / 中文 link. (Comeau, Lil'Log)
   - Optional **status and confidence chip**: "Status: evolving" or "Confidence: moderate". (Gwern, Maggie)
5. **TL;DR box:** 3 to 5 bullets that answer the post's main question outright. Include the headline numbers if there are any. (OpenAI, Eugene Yan overview)
6. **TOC:** collapsible, shown when the post is over about 1,500 words. On wide screens it can sit as a sticky right rail outside the 68ch column. (Lil'Log, Chip, Julia)
7. **Intro:** why this post exists, in the first person, 1 to 2 paragraphs. (Julia Evans)
8. **Definitions:** "What is X?" as the first H2, with a single bold definition sentence. (Anthropic)
9. **Overview diagram:** the whole system in one figure. Later sections follow its boxes in order. (Lil'Log)
10. **Body sections:** question or "X vs. Y" H2s. Concept sections repeat a template: *What it is, When to use it (and when not), How to apply it, Example.* (Anthropic, Eugene Yan)
    - **Figures** use one consistent diagram grammar and are numbered "Fig. 3", with **a full-sentence caption**. Captions are bilingual on the 中文 page.
    - **Code blocks** in monospace, with language label, copy button and optional filename. No playgrounds.
    - **Callouts**: exactly two kinds, *Note* and *Watch out*. Keep them rare. (Chip)
    - **Sidenotes** in the margin at 1200px and wider, falling back to numbered footnotes on mobile. (Gwern)
11. **Summary or "Which should I use?"** as a decision list or small table. (Comeau decision tree)
12. **Appendices** (optional), where long detail goes. (Anthropic)
13. **References:** a numbered list. (Lil'Log, Eugene Yan)
14. **"Cite this" block** in plain text plus BibTeX, collapsed by default. (Lil'Log)
15. **Acknowledgements** (optional).
16. **Footer meta:** tags, and a **series nav** (numbered list with the current part highlighted, previous and next parts). (Simon series page)
17. **Previous / Next** with title and date. (Simon, Julia)
18. **Related** (2 to 3 posts that share tags), **subscribe** (Atom plus optional email), and a quiet link to /now.

## C. Note anatomy (Simon Willison style)

1. **Title**, written as a claim or topic ("Claude Code hooks are just shell scripts"). (Matuschak)
2. **Meta line:** date (no time), type label "Note", language.
3. **Optional source block:** a quoted excerpt plus its link, when reacting to something. (Simon's quote-then-react)
4. **Body:** 1 to 6 paragraphs, with code and images allowed. No TOC, TL;DR or dek.
5. **Tags** and **Previous / Next**.
6. Optional "Expanded into → [Post]" backlink when a note grows into a post. (Maggie's growth stages, lightweight version)

Notes share the post URL scheme (`/writing/2026/09/slug` or `/notes/slug`) and the same feed. The type is metadata.

## D. TIL listing

- Path: `/til`. Index header: "Today I Learned: small things I figured out, written down so I don't forget." (a Maggie-style definition line)
- **Topic groups with counts** at the top ("claude-code 12 · cloudflare 7 · angular 5"), then a **recent list** of date (YYYY-MM-DD, monospace), topic and title. (Simon TIL)
- **Show the full body inline** on topic pages, since items are short. The item page still exists for permalinks. (Julia Evans)
- TIL stays a **tag, `til`, on a note**, as the owner already decided, rather than its own content model. `/til` is just a filtered view with its own Atom feed.
- Language: TILs can be EN-only by default, with a flag.

## E. Tag and series pages

**Tag page `/tags/agents`**
1. The tag name as H1, plus **a 1 to 2 sentence definition of the concept** (AEO: this makes each tag page double as a glossary entry).
2. Optional "Start with" link to the best evergreen post (Lee Robinson's topic hub).
3. A list grouped by type: Posts (with dek), Notes, TIL.
4. A per-tag Atom feed link.
5. Keep **10 to 15 curated tags**, not a tag cloud. (Avoiding Stripe's 27 and Simon's hundreds)

**Series page `/series/agent-harnesses`**
1. Title plus a description paragraph (why the series exists and who it's for).
2. Status: "Ongoing, 3 of 5 parts published" or "Complete".
3. **A numbered list of parts** with title, dek and date. Unpublished planned parts are greyed out, which is optional. (Simon)
4. The same component appears inside each post as the series nav.
5. Series slug in part URLs: `/writing/agent-harnesses-part-2`. (OpenAI)

## F. /now page examples and recommended anatomy

- **sive.rs/now:** "Updated [date], from [place], where [season/weather]", plus the "(This is a now page…)" line linking to nownownow.com/about, then short sections with plain-language headings.
- **maggieappleton.com/now:** an append-only log of dated sections (Aug 2026 back to Sep 2020) with book covers and photos.
- **paco.me:** a short "Now" paragraph right on the homepage.

**Recommended for Wei Khang**
1. "Updated 2026-09-16 · from Penang, where [monsoon / haze / light note]". A photographer-flavoured location line.
2. 4 to 6 short sections: *Building* (AI/agents), *Shooting* (a current photo project, with one image), *Writing* (the series in progress), *Learning*, *Reading*, *Not doing*.
3. A single photo taken this month, which ties the portfolio to the blog.
4. "Past updates" as a collapsed, dated log. (Maggie)
5. A link to nownownow.com/about.
6. A short excerpt on the homepage. (Paco)

## G. What makes the structure "AEO-friendly" (answer engines and LLM retrieval)

Ranked by value for effort:
1. **A TL;DR at the top** that answers the main question in plain sentences. Don't write a teaser.
2. **Question-form H2s** that match how people ask ("What is context engineering?", "When should you not use an agent?") and "X vs. Y" headings. (Anthropic)
3. **A one-sentence definition right after the heading**, in the form "*X is …*". Put it in bold or in a `<dfn>`. (Anthropic's definition of context)
4. **The same section template for every concept:** What, Why, When not, How, Example. (Eugene Yan)
5. **Visible and machine-readable dates:** `datePublished` and `dateModified` in JSON-LD `BlogPosting` / `TechArticle`, plus a visible "Updated" line. (Comeau)
6. **Author entity:** a Person schema linking the About page, GitHub and photo portfolio. Keep the byline at the top.
7. **Tag pages that double as glossary entries.** Add `DefinedTerm` markup if wanted.
8. **Text alternatives for figures:** a full-sentence caption and alt text. Mermaid or SVG source should carry real text, not pixels.
9. **Stable, readable slugs**, plus `hreflang` pairs between EN and 中文 versions.
10. **Stay fetchable:** don't block well-behaved crawlers (OpenAI's 403 is the counter-example). Serve pre-rendered HTML (the site is Angular, so SSR or prerendering matters), add `llms.txt`, and optionally a `.md` twin of each post (Vercel).
11. **Full-content Atom feeds**, not excerpts.
12. **References and a "Cite this" block.** (Lil'Log)

## H. Open questions for the owner

1. **URL scheme:** `/writing/…` for all types, or separate `/posts/…`, `/notes/…`, `/til/…`? Dated URLs (`/2026/09/slug`) or flat slugs?
2. **Language model:** mirror every post in 中文, or allow EN-only notes and TILs with a "not translated" label? Chinese at `/zh/…` or on a subdomain? One Atom feed per language, or a combined one?
3. **Index default:** does `/writing` open on "All" (the mixed stream) or on "Posts", with notes one tab away?
4. **Status or confidence labels** (Gwern and Maggie style) on AI posts: yes or no? If yes, which vocabulary?
5. **Diagrams:** hand-built SVG in a fixed grammar, Excalidraw-style, or Mermaid? Who owns the "diagram style guide" (stroke, clay accent, monospace labels)?
6. **Sidenotes vs. footnotes:** add the complexity of margin sidenotes on desktop, or keep footnotes only?
7. **"Start here" page** (Eugene Yan): wanted at launch, or only once there are about 10 posts?
8. **Email newsletter** alongside Atom, or feeds only?
9. **Homepage:** does the landing page lead with photography or with writing, and does a /now excerpt appear there?
10. **Related posts:** chosen by hand or computed from tags?
11. **Markdown twins and `llms.txt`:** publish a machine-readable copy of each post?
12. **Photo and blog crossover:** can posts use the owner's photography as section breaks or hero images, or should the blog stay strictly image-free apart from diagrams?

---

### Caveats

- The OpenAI post couldn't be fetched (403). Only its search snippet was used.
- All "[I]" typography and visual notes are unverified, because WebFetch strips styling. Look at the real pages before copying visual details.
- WebFetch summaries come from a small model and may be approximate. Treat exact counts (e.g. "582 TILs", "117 posts", tag counts) as close but not guaranteed. Eugene Yan's emoji tag URLs and Vercel's "markdown twin" claim especially need checking.
