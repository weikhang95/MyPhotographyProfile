# Context & observability — self-hosted Agent SDK vs Managed Agents

How context is managed and how a run is observed, compared across the three surfaces I actually touch: **raw Messages API**, **Claude Agent SDK / Claude Code** (self-hosted), and **Managed Agents** (Anthropic-hosted). Notes captured from a working session; the JSONL schema below was pulled from a real transcript on disk, not from docs.

## The one principle

> **Whoever holds the message array owns both context management and observability.**

Everything below falls out of this. If Anthropic holds the session state server-side (Managed Agents), compaction and a rich event/history stream come for free — they are byproducts of hosting. If *you* hold it (raw API), you wire both yourself. Claude Code sits in between: the harness holds the array on your machine, so it auto-manages context and persists history locally, but there is no hosted stream.

| | Holds the array | Compaction | History | Live event stream |
|---|---|---|---|---|
| Raw Messages API | You (client) | Opt-in (`compact-2026-01-12`), you re-append `response.content` | You build it | n/a |
| Claude Agent SDK / Claude Code | Local harness | Automatic | Local JSONL (auto) | No (OTel export only) |
| Managed Agents | Anthropic server | Automatic | Hosted REST (`/sessions/{id}/messages`) | SSE (`agent.*`, `span.*`, `session.status_*`) |

## Compaction

- **Two different shrink mechanisms.** *Compaction* summarizes earlier turns (lossy, keeps a recap). *Context editing* prunes stale tool results/thinking (removes, doesn't summarize). Raw API exposes both via `context_management`; the trigger threshold defaults to ~150K tokens and is configurable. Managed Agents and Claude Code auto-apply compaction with no exposed knobs.
- **Raw API gotcha:** append the full `response.content` back each turn — the compaction block rides in `content`. Keep only `.text` and you silently lose compaction state.
- **Managed Agents / Claude Code:** server (or harness) holds the transcript and re-injects the condensed history itself. You do nothing; the memory store is *not* involved in compaction.

## Three systems that never touch: caching ≠ compaction ≠ memory

Three independent systems that are easy to conflate and never interact:

- **Prompt caching** — within a single run. Automatic reuse of the cached prefix (surfaces as `cache_creation_input_tokens` / `cache_read_input_tokens` in the usage schema below). A cost/latency lever only; it persists *no* durable state.
- **Compaction** — within a session transcript. Summarizes/prunes earlier turns to fit the window; lossy; transcript-internal; populates nothing durable.
- **Memory store** — across sessions. Explicit, durable, versioned (`memver_...`), workspace-scoped, file-based storage the agent reads/writes via ordinary file tools at `/mnt/memory/<name>/`.

Writing a summary to memory is **additive** — it does not shrink the live session. The original messages stay in the window; you copied a distillation *out*.

## Manual "compaction" = checkpoint + session rollover

The real user-controlled lever is not a compaction setting — it is the **session boundary**:

```
session 1 → agent writes summary to memstore_ABC   (you persist "memstore_ABC")
            end session 1   (archive = read-only)
session 2 = sessions.create(agent_id,
              resources: [{ type: "memory_store", memory_store_id: "memstore_ABC" }])
            → mounted at /mnt/memory/<name>/, system prompt auto-notes the mount
            → agent reads it, resumes with a near-empty context window
```

Key facts:
- **The agent does not decide to roll over.** It is stateless across sessions and cannot start/see another session. *Your orchestrator* (the client holding the API key + SSE stream) owns lifecycle and decides the cutover — by turn/token count, an idle `stop_reason`, task completion, or cron (scheduled deployments). Agent proposes (a `stop_reason` or custom-tool signal), orchestrator disposes.
- **Memory stores attach at session-create time only** — `sessions.resources.add()` does not accept `memory_store`.
- The one piece of state the orchestrator must persist between sessions is **one string: the `memstore_` id.** Everything else (transcript, compaction, container) is disposable.
- Continuity is the *filesystem*, not model memory — session 2's agent is a brand-new actor reading a note a stranger left. Write memory self-contained.

## Degradation is real

A single long-growing session degrades two ways:
1. **Long-context rot** — attention spreads thin, mid-context recall drops ("lost in the middle"). Happens before compaction.
2. **Compaction loss** — lossy summaries compound; eventually you summarize a summary.

Auto-compaction dodges the hard wall (running out of window) but trades it for a slow quality slope. The counter is architectural: **short task-scoped sessions + memory checkpoints + clean restarts.** Session lifecycle is the degradation lever; the longer one session lives, the dumber it gets.

## Observability: history vs telemetry

The Agent SDK splits what Managed Agents fuses. There is no single SDK source equal to the Managed Agents stream — you stitch two:

- **History** ("what was said", faithful, replayable) → **JSONL transcripts**, local.
- **Telemetry** ("how it performed", timing/cost/counts) → **OpenTelemetry** export to your collector.

OTel detail: metrics + log events are GA, **traces are beta** (`CLAUDE_CODE_ENABLE_TELEMETRY=1`, `OTEL_*` exporters, traces need `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA=1`; spans `claude_code.interaction` / `.llm_request` / `.tool` / `.hook`). Message **content is redacted by default** — opt in with `OTEL_LOG_USER_PROMPTS` / `OTEL_LOG_TOOL_CONTENT` / `OTEL_LOG_RAW_API_BODIES`. So out of the box an OTel trace is a content-free skeleton of spans + token counts; a Managed Agents trace *is* the conversation.

What the Agent SDK has **no first-party equivalent** for vs Managed Agents: server-side SSE event stream, hosted session-history REST API, dashboard, webhook subscriptions, outcome-evaluation spans, audit-log service. It is "build-your-own observability" — the price of the data staying local. (This is the same model as wiring an AI server to LangSmith/Langfuse: point the runtime at a collector.)

## JSONL session log — real schema

From a live transcript at `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl` (one JSON object per line). Line `type` values observed: `assistant`, `user`, `system`, `attachment`, `last-prompt`, `queue-operation`.

The `assistant`/`user` lines wrap a `.message` that is the **raw Anthropic Messages API object**, verbatim:

```
.message keys: content, id, model, role, stop_reason, stop_details, usage
content block types: text, thinking, tool_use, tool_result
usage: { input_tokens, output_tokens,
         cache_creation_input_tokens, cache_read_input_tokens,
         cache_creation: { ephemeral_1h_input_tokens, ephemeral_5m_input_tokens },
         iterations: [...] }
```

Around that kernel, Claude Code adds a local-runtime envelope per line: `uuid`, **`parentUuid`** (the conversation is a *tree*, not a flat log — this is how Claude Code branches/resumes/sidechains), `sessionId`, `cwd`, `gitBranch`, `timestamp`, `version`, `requestId`, `isSidechain`, `userType`, `entrypoint`. The `system` lines carry **hook** records (`hookCount`, `hookErrors`, `hookInfos`, `hookAdditionalContext`).

## JSONL vs Managed Agents session history

| | JSONL (Agent SDK / Claude Code) | Managed Agents |
|---|---|---|
| Message kernel | raw Messages API object | raw Messages API object |
| Per-line envelope | `uuid`, `parentUuid` (tree), `cwd`, `gitBranch`, `version`, `isSidechain` | event `id`, `data.type`, `created_at`, `organization_id`, `workspace_id`, span ids |
| Local-only line types | `attachment`, `last-prompt`, `queue-operation`, `system` w/ hook records | — |
| Server-only data | — | `span.outcome_evaluation_*`, `session.status_*`, `vault_*`, multiagent `thread_*`, `processed_at` gating |
| Structure | tree (parentUuid links) | server-ordered stream |
| Storage | local filesystem | Anthropic-hosted REST |

**Conclusion:** content-equivalent at the conversation level (same message bodies, same token/cache accounting, same four block types), but neither is a superset. JSONL holds things Managed Agents can't (hook execution, git context, the prompt queue, the branch tree); Managed Agents holds things JSONL can't (outcome grading, status lifecycle, vault, multiagent threads).

## See also

- [CONCLUSION.md](./CONCLUSION.md) — the capstone; "whoever holds the array owns observability" is the principle the verdict turns on.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — the inbound-receiver design (relay + tunnel) referenced below.
- [EVAL.md](./EVAL.md) — the runner-vs-Managed scorecard referenced below.
- The webhook-direction note: Anthropic platform webhooks (`platform.claude.com/.../webhooks`) are **outbound** Managed-Agents state notifications (Anthropic → you, HMAC-signed, thin payload). They do not replace a self-hosted **inbound** receiver (e.g. a Cloudflare-tunnelled endpoint that ingests GitHub events into a session). Opposite directions; same who-holds-state lens.
- Runner-vs-Managed eval: this repo's automation stays on the GitHub Actions `@claude` runner — the Managed Agents memory/session loop solves a long-session degradation problem a solo portfolio repo does not have.
