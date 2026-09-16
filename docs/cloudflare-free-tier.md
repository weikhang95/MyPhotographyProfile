# Cloudflare free tier notes

Limits and pricing for the Cloudflare products this site uses (or may use), with our own usage estimates.

- **Last verified:** 2026-09-16, against the official docs linked in each section.
- **Prices and limits change.** Before relying on a number, re-open the source URL. See [Refreshing this file](#refreshing-this-file).
- **Plans:** "Free" = Workers Free plan (no card). "Paid" = Workers Paid plan ($5/month minimum).

## Quick summary

| Product | Free allowance | Resets | Over the free limit |
|---|---|---|---|
| Static assets (Angular site) | Unlimited requests | — | — |
| Workers (`/api/*`) | 100,000 requests/day, 10 ms CPU/request | 00:00 UTC daily | Error 1027 |
| D1 (SQL database) | 5M rows read/day, 100k rows written/day, 5 GB total (500 MB per DB) | 00:00 UTC daily | Queries return errors |
| KV (key-value) | 100k reads/day, 1,000 writes/day, 1 GB | Daily | Errors |
| R2 (object storage) | 10 GB-month, 1M Class A + 10M Class B ops/month, free egress | Monthly | Billed |
| Workers AI | 10,000 Neurons/day | 00:00 UTC daily | Errors |
| AI Gateway | Core features free, 100,000 logs total | — | — |

00:00 UTC = 08:00 Malaysia time.

On the Free plan, Workers, D1, KV and Workers AI **fail with errors instead of charging**. R2 usually needs a payment method to enable, and usage beyond its free allowance is billed, so set a billing notification before using it (Manage Account → Billing → Notifications).

---

## Workers

Sources:
- Pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Limits: https://developers.cloudflare.com/workers/platform/limits/

| | Free | Paid |
|---|---|---|
| Requests | 100,000/day (reset 00:00 UTC) | 10M/month included, then $0.30/million |
| CPU time | 10 ms per request | 30M CPU-ms/month included, then $0.02/million CPU-ms |
| Static asset requests | Free, unlimited | Free, unlimited |
| Static asset files | 20,000 per Worker version, 25 MiB each | — |
| Subrequests | 50 per request | — |
| Memory | 128 MB per isolate | — |
| Worker size | 64 MiB uncompressed | — |
| Workers per account | 100 | — |
| Over the daily limit | Error 1027 (or the Worker is bypassed, depending on route config) | Billed |

Notes:
- CPU time counts only work the code does. Time spent waiting on D1 or `fetch` does not count. Cloudflare says the average Worker uses about 2.2 ms.
- With `run_worker_first: ["/api/*"]`, page and file requests never run the Worker, so they don't count toward the 100k/day request limit.

## D1 (SQL database)

Sources:
- Pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Limits: https://developers.cloudflare.com/d1/platform/limits/

| | Free | Paid |
|---|---|---|
| Rows read | 5M/day | 25 billion/month included, then $0.001/million |
| Rows written | 100,000/day | 50M/month included, then $1.00/million |
| Storage | 5 GB total | 5 GB included, then $0.75/GB-month |
| Max size per database | 500 MB | 10 GB |
| Max storage per account | 5 GB | 1 TB |
| Databases per account | 10 | 50,000 |
| Max row / string / BLOB size | 2 MB | 2 MB |
| Queries per Worker invocation | 50 | 1,000 |
| Reset | Daily 00:00 UTC | Monthly (billing date) |
| Over the limit | Queries return errors; over storage, delete data before inserting | Billed |

What counts:
- **Rows read** = rows *scanned*, not rows returned. A full table scan or `COUNT(*)` without a covering index reads every row.
- **Rows written** = rows changed by `INSERT`, `UPDATE`, `DELETE`. Inserting 10 rows = 10 rows written.

## KV (key-value store)

Source: https://developers.cloudflare.com/workers/platform/pricing/ (Workers KV section)

| | Free | Paid |
|---|---|---|
| Reads | 100,000/day | 10M/month included, then $0.50/million |
| Writes | 1,000/day | 1M/month included, then $5.00/million |
| Storage | 1 GB | 1 GB included, then $0.50/GB-month |

The "free storage is only 1 GB" figure people quote is KV's. D1 and R2 allow more.

## R2 (object storage for files)

Source: https://developers.cloudflare.com/r2/pricing/

| | Free (Standard storage, per month) | Standard price | Infrequent Access price |
|---|---|---|---|
| Storage | 10 GB-month | $0.015/GB-month | $0.01/GB-month (30-day minimum, $0.01/GB retrieval) |
| Class A ops (writes: PutObject, CopyObject, CreateMultipartUpload, UploadPart…) | 1M | $4.50/million | $9.00/million |
| Class B ops (reads: GetObject, HeadObject…) | 10M | $0.36/million | $0.90/million |
| Delete / abort ops | Free | Free | Free |
| Egress (bandwidth to the internet) | Free | Free | Free |

**GB-month** is the average stored over the month, not the peak. For example, 1 GB for 5 days then 3 GB for 25 days = 1 × 5/30 + 3 × 25/30 = **2.66 GB-month**.

## Workers AI

Source: https://developers.cloudflare.com/workers-ai/platform/pricing/

| | Free | Paid |
|---|---|---|
| Allowance | 10,000 Neurons/day (reset 00:00 UTC) | $0.011 per 1,000 Neurons beyond the free 10k/day |
| Over the limit | Errors | Billed |

Neuron cost per model (from the source page):

| Model | Input | Output |
|---|---|---|
| Llama 3.2 1B | 2,457 neurons / M tokens | 18,252 neurons / M tokens |
| Llama 3.1 8B (FP8) | 4,119 neurons / M tokens | 34,868 neurons / M tokens |
| Llama 3.1 70B (FP8) | 26,668 neurons / M tokens | 204,805 neurons / M tokens |
| BGE-small (embeddings) | 1,841 neurons / M tokens | — |
| Whisper (speech to text) | 41.14 neurons / audio minute | — |
| Flux-1-schnell (image) | 4.80 neurons / 512×512 tile | — |

Our estimates of what 10,000 Neurons/day covers:

| Task | Model | ~Neurons per call | ~Free calls/day |
|---|---|---|---|
| Categorise an enquiry (500 tokens in, 20 out) | Llama 3.1 8B | 3 | 3,600 |
| Summarise / draft reply (2,000 in, 200 out) | Llama 3.1 8B | 15 | 650 |
| Same summary | Llama 3.1 70B | 94 | 100 |
| Simple label (500 in, 20 out) | Llama 3.2 1B | 2 | 6,000 |
| Embed a 500-token document | BGE-small | 1 | 10,000 |
| Generate a 1024×1024 image (4 tiles) | Flux-1-schnell | 19 | 500 |
| Transcribe audio | Whisper | 41 per minute | ~4 hours |

Output tokens cost much more than input tokens, so short answers are cheapest.

## AI Gateway

Source: https://developers.cloudflare.com/ai-gateway/reference/pricing/

- Core features (analytics, caching, rate limiting) are free.
- Persistent logs: **100,000 logs total across all gateways** on Free; 10M logs per gateway on Paid.
- Cloudflare notes some future features may be paid.

---

## Our usage (estimates, 2026-09-16)

| Metric | Free limit | Realistic day for this site | Share used |
|---|---|---|---|
| Worker requests | 100,000/day | ~50 | ~0.05% |
| D1 rows read | 5,000,000/day | ~2,500 | ~0.05% |
| D1 rows written | 100,000/day | ~20 | ~0.02% |
| D1 storage | 500 MB per DB | ~60 KB (1,000 enquiries ≈ 1–2 MB) | ~0% |
| Static page views | Unlimited | any | free |

Queries per action in this app:

| Action | Reads | Writes |
|---|---|---|
| Visitor sends an enquiry | — | `INSERT enquiries` |
| Open `/admin` | session check ×2, page of enquiries, `COUNT(*)`, counts per status | — |
| Open an enquiry (marks it read) | session check | `UPDATE enquiries` |
| Archive / mark unread / delete | session check | `UPDATE` or `DELETE` |
| Login, correct password | count of recent failed attempts | insert session, delete expired sessions, clear attempts |
| Login, wrong password | count of recent failed attempts | insert attempt, delete old attempts |

Check real numbers: dashboard → Workers & Pages → D1 → `chong-db` → **Metrics**, and the `chong` Worker's **Metrics** tab.

---

## Refreshing this file

1. Open each source URL above and compare the numbers.
2. Update the tables and the **Last verified** date at the top.
3. If a limit got tighter, re-check [Our usage](#our-usage-estimates-2026-09-16).

Pages with further detail:
- Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- D1 limits: https://developers.cloudflare.com/d1/platform/limits/
- R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- AI Gateway pricing: https://developers.cloudflare.com/ai-gateway/reference/pricing/
- KV limits: https://developers.cloudflare.com/kv/platform/limits/
