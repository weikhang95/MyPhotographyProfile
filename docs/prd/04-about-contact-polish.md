# PRD 4 — About and Contact Polish

**Label:** `ready-for-agent`
**Depends on:** PRD 1 (Design Foundations), PRD 2 (Shared Components)
**Source of truth:** [`.impeccable.md`](../../.impeccable.md)

## Problem Statement

The About and Contact pages were styled with the same blue-purple-gradient sensibility as the rest of the legacy site and currently fall outside the editorial direction set in `.impeccable.md`. About risks being a bullet-list bio rather than a personal, sequenced narrative; Contact now has a working enquiry form backed by the Cloudflare Worker and D1 (see PRD 7), but it was built before this redesign and needs the same editorial treatment. Both pages also load eagerly even though most visitors will spend their time on Portfolio or (after PRD 5) Blog.

## Solution

Treat About as a magazine-style essay page: a single column of long-form copy, a portrait or signature image, optional pull-quotes, and the one reserved use of the Nothing You Could Do script font as a signature accent. Treat Contact as a calm, trustworthy endpoint: a short paragraph, the existing enquiry form restyled to the design system, a direct email link (mailto with `<app-icon name="envelope">`) as the alternative, and the social icons that already live in the Footer. Lazy-load both routes.

## User Stories

1. As a visitor curious about the photographer, I want a calm, scannable About page so that I can decide whether the work resonates with me in under a minute.
2. As a visitor reading About, I want a clear narrative voice (not bullet points) so that the page feels like the person behind the camera, not a CV.
3. As a visitor, I want one tasteful signature accent (handwritten font on a name or quote) so that I see the human voice without the page feeling overdesigned.
4. As a visitor, I want the About page to honour the editorial measure (60–72 characters per line) so that the text is comfortable to read.
5. As a visitor, I want optional pull-quotes within the About copy so that long-form text has visual rhythm.
6. As a visitor, I want one portrait or signature image on About (no carousel, no gallery) so that the focus stays on the writing.
7. As a visitor who wants to reach the photographer, I want a short, clearly-labelled form and a direct email link as an alternative so that I can pick whichever I trust more.
8. As a visitor on mobile, I want About and Contact to read with the same generous spacing as Portfolio so that the site feels consistent.
9. As a visitor, I want About and Contact to render in light and dark mode using the same tokens as Portfolio so that switching theme mid-session is not jarring.
10. As the site owner, I want both routes lazy-loaded so that bundle weight is amortised across pages.
11. As the site owner, I want the Topbar nav to include both About and Contact (no commented-out links) so that visitors can find Contact without guessing.

## Implementation Decisions

- **About layout.** Single centered column at ≈ 65ch wide. `font-display` for headings, body in the same family at a smaller size or in a paired family if a secondary text font is added (defer that decision to implementation; default is Signika throughout). A portrait or signature image at the top, full-width within the column or aligned to one side. Allow `<blockquote>`-style pull-quotes at a larger type step, optionally with the script accent.
- **Script accent.** Reserve `font-script` (Nothing You Could Do) for exactly one element on About — either a signature line ("— Wei Khang") at the end of the bio, or the section name "About". Document the choice in the component file with a one-line comment.
- **About content.** Keep the existing bio content if present; rewrite for editorial voice if it currently reads as bullet points. The implementer should preserve the photographer's actual words and only adjust structure and pacing. If the current page is mostly empty, leave a clear `TODO` block in the markup so the owner can fill it in without a developer round-trip.
- **Contact layout.** A single short paragraph, the enquiry form (name, email, subject, message; hidden honeypot stays), a secondary email link rendered as `<app-link external>` style with an envelope icon, and a row of social icons (Instagram, Facebook, LinkedIn) routed through `<app-icon>`.
- **Form styling.** Replace the raw `rgb(var(--token))` SCSS and hex error colours in `contact.component.scss` with shared tokens (add an error/danger token in PRD 2 if needed). Keep the existing behaviour: `POST /api/enquiries`, 422 field errors shown inline, sending/sent/error states.
- **Spam protection.** Honeypot exists. Turnstile is tracked in PRD 7, not here.
- **Topbar wiring.** Done: CONTACT link added to Topbar (mobile + desktop). BLOG placeholder lands in PRD 5.
- **Lazy-loading.** Both routes converted to `loadComponent`-style standalone lazy routes. AboutComponent and ContactComponent are already standalone-friendly; promote them if not.
- **Footer / Contact duplication.** The Footer already exposes social icons. The Contact page repeats them deliberately — that is acceptable because Contact's purpose is to make reaching the photographer trivial. Do not extract a shared "SocialRow" component until a third surface needs it.

## Testing Decisions

- **Keep existing Contact tests passing** (`contact.component.spec.ts`: invalid form doesn't post, valid form posts, 422 details shown). Update selectors if markup changes. About needs no unit tests.
- **Manual verification checklist:**
  - About reads cleanly in light and dark, at ≈ 65ch measure, on mobile and desktop.
  - The single script-font accent appears exactly once on the page.
  - Pull-quotes (if used) render at the larger type step with appropriate ink colour.
  - Contact form submits, shows inline errors and the sent state, in light and dark.
  - The secondary mailto link opens the user's mail client.
  - Topbar exposes ABOUT and CONTACT links; both routes resolve.
  - Both routes are split out of the main bundle (verify via build output).
  - Both pages tab through cleanly with visible focus rings.

## Out of Scope

- Building a CMS-driven About or Contact (markdown is not the source here — these are component templates).
- Backend changes to enquiries (PRD 7).
- Booking or scheduling integration.
- Newsletter signup.
- Adding a Resume / CV download (revisit if the AI blog audience asks for it).

## Further Notes

- About is the place where the dual identity (photographer + AI builder) can be acknowledged in copy — one paragraph each, sequenced. Resist the urge to visually separate the two halves with different styling; the design system carries the unity.
- A future iteration could add a "Now" page (in the [nownownow.com](https://nownownow.com/) tradition) as a third static route, but that is out of scope.
- The favicon and `<title>` are already set ("Chong Wei Khang"); PRD 6 handles per-route `<title>` updates.
