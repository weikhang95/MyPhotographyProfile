# PRD 7 — Backend on Cloudflare

**Label:** `in-progress` (Phase A shipped 2026-09-16)
**Depends on:** — (parallel track; does not block PRDs 2–6)
**Source of truth:** [`docs/cloudflare-free-tier.md`](../cloudflare-free-tier.md) for limits; `wrangler.jsonc` for bindings

## Problem Statement

The site was a static portfolio with no way for visitors to reach the owner other than social links, and the owner wants to learn backend development on a real, deployed project. The backend must stay on Cloudflare's free tier, live in this repo, and be built step by step with each concept explained.

## Solution

One Cloudflare Worker (`chong`) serves both the Angular build (static assets, SPA fallback) and the API (`run_worker_first: ["/api/*"]`). Data lives in D1 (`chong-db`). Features ship in small phases, each teaching one new Cloudflare concept.

```
Browser ──► chong.weikhang.workers.dev
              ├─ /api/*  ──► worker/index.ts ──► D1 (chong-db)
              └─ else    ──► static assets (dist/.../browser), SPA fallback
```

## User Stories

1. As a visitor, I want to send an enquiry from the Contact page so that I don't need to open my mail client.
2. As a visitor, I want clear inline errors when a field is invalid so that I can fix it without guessing.
3. As the owner, I want a private `/admin` inbox so that I can read, archive, and delete enquiries.
4. As the owner, I want the admin area protected by my own password with rate limiting so that nobody else can read enquiries.
5. As the owner, I want spam kept out without annoying real visitors.
6. As the owner, I want to know when a new enquiry arrives so that I don't have to keep checking `/admin`.
7. As the owner, I want deploys to happen on push to `main` so that I don't deploy from my laptop by hand.
8. As the owner, I want Worker code covered by tests so that I can change it with confidence.

## Phases

### Phase A — Enquiries + admin (shipped)

- `POST /api/enquiries` with validation (`shared/api-types.ts` limits), honeypot, 422 field details.
- Admin auth: `ADMIN_PASSWORD` Worker secret, constant-time compare, random session token with only its SHA-256 hash in D1, `HttpOnly; SameSite=Strict; Secure` cookie scoped to `/api/admin`, 5 failures / 15 min per IP.
- Admin API: session check, list with status tabs + pagination, PATCH status, DELETE.
- Angular: Contact form, `/admin/login`, `/admin` inbox behind `adminGuard`.
- Migrations: `0001_enquiries.sql`, `0002_admin_auth.sql`.
- **Concepts learned:** Workers + static assets, routing, D1 + migrations, secrets, sessions/cookies, CSRF via SameSite + JSON-only bodies.

### Phase B — Quality and delivery

- Worker tests with `@cloudflare/vitest-pool-workers` (real D1 in Miniflare): validation, honeypot, auth success/failure/rate limit, admin routes 401 without session, 404/405 routing.
- CI: GitHub Actions runs build, Jest, worker typecheck and tests on PRs; deploys on push to `main` with a scoped Cloudflare API token (or Workers Builds via dashboard Git integration — pick one).
- Remote migrations applied as a deploy step, never silently.
- **Concepts:** Miniflare, test isolation, CI secrets, deploy pipelines.

### Phase C — Spam protection and notifications

- Cloudflare Turnstile on the Contact form; verify the token server-side in `createEnquiry` before insert. Keep the honeypot.
- Email notification on new enquiry (Cloudflare Email Routing `send_email` binding to a verified address, or a free-tier provider such as Resend). Send after the insert succeeds, inside `ctx.waitUntil` so the visitor's response isn't delayed.
- **Concepts:** third-party verification, `waitUntil`, email bindings, secrets for API keys.

### Phase D — Explore (optional, pick per interest)

- Workers AI: auto-label enquiries (e.g. booking / collaboration / spam) with a small model; store the label; show it in the inbox. Budget in `cloudflare-free-tier.md`.
- R2: photo uploads from `/admin` for the portfolio, replacing manual asset commits.
- KV or D1 counters: simple, cookie-free page view counts.
- Cron Triggers: weekly digest of unread enquiries; purge archived enquiries older than N days.
- Custom domain for the Worker.

## Implementation Decisions

- **Same repo, same Worker.** Frontend and API deploy together; one origin means no CORS and first-party cookies.
- **Shared types** in `shared/api-types.ts` are imported by both `worker/` and `src/`.
- **Free plan only.** Every phase must fit the free limits; free-plan overages error instead of billing. R2 requires a billing notification before enabling.
- **No framework in the Worker** (plain `URLPattern` router) until routes outgrow it; revisit Hono if Phase C/D doubles the route count.
- **Secrets never in git or chat.** Set with `wrangler secret put` or the dashboard; local values in `.dev.vars` (gitignored).

## Testing Decisions

- Phase A was verified with curl against `wrangler dev` and in the browser; Angular Contact tests exist (Jest).
- Phase B adds automated Worker tests; after Phase B every new route ships with tests.
- Admin UI tests (`AdminApiService`, `adminGuard`) added in Phase B.

## Out of Scope

- Multi-user admin accounts, OAuth, or roles.
- Public user accounts or comments.
- Paid Cloudflare plans.
- A separate backend repository.

## Further Notes

- Live URL: https://chong.weikhang.workers.dev
- Local dev: `npm run dev:api` (Worker on :8787) + `ng serve` (proxies `/api`); or `npm run preview` for a production-like build.
- `vercel.json` still exists; remove once Cloudflare is confirmed as the only host.
