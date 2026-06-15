# Conclusion — the Claude Managed Agents study

The capstone for `agent-study/`. Read this first: it states what was built, what was
learned, the verdict, and where every detail lives. The study is **concluded** — the
local relay and tunnel are torn down; this directory is the durable artifact.

> **One-line verdict:** For this repo (solo dev, one public repo, low `@claude`
> volume) keep the **GitHub Actions runner** as the daily driver. The Managed Agents
> relay works end-to-end (it opened [PR #15](https://github.com/weikhang95/MyPhotographyProfile/pull/15))
> and taught the architecture — but Managed Agents pays off at *scale*, not here.
> Full scorecard in [EVAL.md](./EVAL.md).

---

## What the study set out to do

Learn Claude Managed Agents by **building a real `@claude` issue-fixer**, then
comparing it honestly against the GitHub Actions runner it would replace. Not a toy:
it verifies GitHub's HMAC, drives an Anthropic-hosted agent loop, and opens a PR.

---

## The three methods — a ladder of *who owns the loop*

The core mental model the study produced. Each rung hands more of the loop to
Anthropic and writes less orchestration code yourself.

| # | Method | Who runs the agent loop | Who drives it | Code here |
|---|--------|------------------------|---------------|-----------|
| **1** | **GitHub Actions runner** | a GitHub-hosted runner | GitHub Actions event | `.github/workflows/claude.yml` |
| **2** | **Managed Agents relay** | **Anthropic cloud** | **you** — `relay.ts` opens a session per `@claude` and streams the loop by hand | `relay.ts` + `agent.ts` + `fix-issue.ts` |
| **3** | **Managed Agents Deployment** | **Anthropic cloud** | **Anthropic** — a standing `define_outcome` + rubric loop it *runs and grades* (eval → revise) with no streaming code from you | `deploy-loop.ts` |

Method 2 is the bulk of the study (built, run, shipped PR #15). Method 3 is the
self-grading evolution — see [PLAYBOOK.md](./PLAYBOOK.md) (the retrieve → eval →
improve loop) and `deploy-loop.ts`.

`★ The throughline:` you → you-trigger-cloud-runs → cloud-owns-everything. Climbing the
ladder trades control for "don't build/maintain agent infra" — the exact trade every
Anthropic customer in [EVAL.md](./EVAL.md) made at scale, and the exact trade the
runner wins for one small repo.

---

## What was proven end-to-end (Method 2)

```
@claude comment ─tunnel─► relay.ts (local) ─sessions.create()─► Managed Agent (cloud) ─git push─► relay opens PR (host-side)
```

- Trigger → HMAC verify → session → agent edits + `npm test` + `git push` → **host-side
  PR**. Proven by PR #15 against a real issue.
- The agent loop **never runs locally** — only the trigger relay does. "Self-hosted"
  in Managed Agents moves *tool execution* to your infra, not the model loop.
- Anthropic emits **outbound** state webhooks only; the inbound `@claude` trigger is
  *your own app code* calling `sessions.create()`. There is no inbound Anthropic
  webhook to wire GitHub into.

---

## The hard-won lessons (the ones that cost debugging)

1. **`end_turn` ≠ work shipped.** A terminal `end_turn` means the agent *stopped
   talking*, not that it produced commits. `agent.ts:branchPushed()` verifies the
   `agent/issue-<n>` branch exists on origin **before** opening a PR — otherwise you
   fire a confusing 422 on an empty branch.
2. **`session.status` lies after archive.** A clean run that finished `end_turn` and
   was then archived reports `status=terminated, stop_reason=null` — looks like a
   failure, was a success. The *real* outcome lives in the terminal
   `session.status_idle` event. `inspect-session.ts` reads that, not the status field.
3. **The sandbox cannot `gh pr create`.** The `github_repository` resource grants
   filesystem + `git push` only; the PAT is injected at egress and never enters the
   prompt. PR creation is **host-side** via the REST API with the relay's PAT — the
   sanctioned "automation creates PRs" path.
4. **Stream-first.** Open `events.stream()` *before* `events.send()`. SSE has no
   replay; open it after and you miss the agent's first events.
5. **Idle is transient.** Break only on `session.status_idle` **+** a terminal
   `stop_reason`. `requires_action` means keep going.
6. **Archive to stop the meter.** `archiveWhenSettled()` frees the container after a
   run (polling past the post-idle status-write race) so an idle-but-alive session
   doesn't accrue session-hours.

---

## Cost model (what actually bills)

| Billed | Not billed |
|--------|------------|
| Tokens — input / output / cache, at the model's rate | **Persistence at rest** — agents, environments, the memory store, archived session logs |
| **~$0.08 / session-hour** of *active* runtime | An idle agent/env/memory definition sitting in your workspace |
| Server-side tool fees (e.g. web search ~$0.01) | — |

- A real fix run ≈ **$0.031** at `claude-haiku-4-5` rates.
- **Prompt caching is automatic** for sessions and applies to **both** the runner and
  the relay — proven by `cache_read_input_tokens=103676` on session #14, ~75–90%
  saving. It is *not* a Managed-Agents-exclusive lever (a correction the adversarial
  eval pass caught).

---

## Three systems that never touch

A recurring point of confusion the study nailed down — see [OBSERVABILITY.md](./OBSERVABILITY.md):

| System | Scope | What it is |
|--------|-------|-----------|
| **Prompt caching** | within a run | automatic reuse of the cached prefix; a cost/latency lever, no durable state |
| **Compaction** | within a session transcript | summarize/prune earlier turns to fit the window; lossy; transcript-internal |
| **Memory store** | across sessions | durable, versioned, file-based state at `/mnt/memory/<name>/` the agent reads/writes |

Writing a summary to memory is **additive** — it does not shrink the live window.
Continuity across sessions is *the filesystem*, not model memory.

---

## Memory store — the one string you persist

The durable cross-session brain (`memstore_01Ay2MTbhNZuuRkE2cpTueJh`):

- Attached as a **second resource** at `sessions.create()` (attach is create-only,
  ≤8/session), mounts at `/mnt/memory/issue-fixer-lessons/`, seeded once with
  `/repo.md` (stack + commands + conventions).
- Versions are immutable (`memver_...`); the agent appends lessons after a run.
- The **only state an orchestrator must carry between sessions is one string: the
  `memstore_` id** (cached in `.state.json` alongside `agentId` / `environmentId`).
  Everything else — transcript, compaction, container — is disposable.
- Whether it *earns its keep* here is debatable (a solo repo doesn't have the
  long-session degradation problem memory solves) — it's in for **practical learning**,
  and it's free at rest.

---

## The honest comparison

The runner wins **7**, ties **3**, Managed Agents wins **2** for *this* repo. Every
dimension was adversarially fact-checked; the verifier caught and corrected claims
that unfairly favored Managed Agents (caching is not exclusive; the 3× test gate only
fires on failure; the capability surface was overstated). Full table + the
customer-scale mirror (Sentry / Notion / Rakuten / Vibecode) in [EVAL.md](./EVAL.md).

The principle that decides it: **whoever holds the message array owns context
management and observability.** Anthropic holding it (Managed Agents) buys compaction
+ hosted history + an SSE stream for free — worth paying for at scale, redundant for a
repo that GitHub Actions already serves for free.

---

## Final state (teardown)

- ✅ Relay (`:8790`) and cloudflared tunnel **stopped** — zero active session-hours.
- ✅ Memory store, agent, and environment **kept** (free at rest; the durable artifact).
- ✅ Daily `@claude` stays on the **GitHub Actions runner** (`claude.yml`); the runner
  was never disabled, per the verdict.
- Cached config (in `.state.json`, gitignored): agent `agent_01XYAPvk…`, env
  `env_01SEvve…`, memory `memstore_01Ay2MT…`.

To bring the relay back for another experiment: `bun run relay` + a tunnel + repoint
the GitHub webhook URL.

---

## Where everything lives

| Doc | What it answers |
|-----|-----------------|
| [README.md](./README.md) | Quickstart: setup, run, tunnel, webhook, test, cutover. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Deep design: zones, request lifecycle, relay decision flow, session state machine, security model. |
| [EVAL.md](./EVAL.md) | 12-dimension runner-vs-Managed scorecard + how Anthropic's customers use it. |
| [PLAYBOOK.md](./PLAYBOOK.md) | Enterprise patterns; the retrieve → eval → improve loop (Method 3's home). |
| [OBSERVABILITY.md](./OBSERVABILITY.md) | Context management + observability across raw API / Claude Code / Managed Agents. |
| **CONCLUSION.md** | This file — the capstone. |

| Code | Role |
|------|------|
| `agent.ts` | Shared driver: cached agent/env/memory, per-session run, idle-break gate, branch-verify, host-side PR, archive. |
| `relay.ts` | Webhook server (Method 2): HMAC verify, `@claude` detect, fast-ack + background session. |
| `fix-issue.ts` | Manual CLI: `bun run fix-issue <n>`. |
| `deploy-loop.ts` | Method 3: a graded `define_outcome` Deployment loop (with one deliberately-open `shouldFire()` exercise). |
| `inspect-session.ts` | Debug helper: reads the *real* outcome from the terminal event, not the lying status field. |

---

## Deliberately left open

`deploy-loop.ts:shouldFire()` is an intentional learning exercise — the "discover
work" gate that decides which webhook deliveries deserve a paid deployment fire. It's
the one genuinely-yours decision (domain + cost/UX trade-off), left as a TODO rather
than guessed at.
