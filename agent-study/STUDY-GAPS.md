# Study gaps — the Managed Agents surface still unexplored

The study built and verified a real slice of Managed Agents. It is **conceptually
broad but hands-on narrow**: single agent, cloud environment, no vault, no
MCP/skills, versioning never exercised. This doc maps what's left — what to learn
next if the study ever reopens.

> Capstone + verdict: [CONCLUSION.md](./CONCLUSION.md). This file is the *frontier*,
> not the conclusion — the verdict (runner wins for one small repo) still stands.

---

## What's already nailed (built + verified)

Core agent/session flow · cloud environment · memory store · SSE events · outcomes
(`define_outcome` rubric) · **deployments / cron** ([deploy-loop.ts](./deploy-loop.ts),
verified vs `@anthropic-ai/sdk` 0.104.1) · webhook relay · archiving / cost hygiene.

> The serverless trigger question answered itself here: `client.beta.deployments.run()`
> fires a session with **zero streaming code** — no tunnel needed for the cron path.
> The relay + tunnel exist only for the *per-issue event-driven* path.

## What's left (prioritized)

| Capability | Why it's worth a pass | Priority |
|------------|-----------------------|----------|
| **Self-hosted sandboxes** | Inverts the study's headline claim ("tools run in Anthropic's cloud, only the trigger is local"). Moves *tool execution* into your own infra. Direct sequel to the serverless/cost thread. | **High** |
| **Vaults / credentials** | The study *deliberately dodged* this — it used a git-proxy host-side token. Vaults are the managed pattern it skipped. | **High** |
| **MCP servers + Skills on the agent** | The study used only built-in `bash`/`edit`/`git`. Attaching `mcp_servers` + `skills` to the agent config is a core untouched lever — and where vaults plug in (MCP auth). | Medium |
| **Agent versioning in practice** | Create-once/cache-id is done, but no version was ever bumped. `agents.update()` → immutable version, pin `{type:"agent", id, version}`, rollback, A/B. Cheap to exercise. | Medium |
| **Multiagent coordinator + threads** | Whole subsystem, only theorized in [PLAYBOOK.md](./PLAYBOOK.md) (≤20 roster, ≤25 concurrent threads, depth = 1). High learning value, **overkill for a solo repo** — same verdict as the eval. | Low (this repo) |
| **Networking blast radius** | The env ran `unrestricted`. `{type:"limited", allowed_hosts:[…]}` is deny-by-default egress — a real security lever, small to add. | Low |

---

## Deep dive 1 — Self-hosted sandboxes

**`config: {type: "self_hosted"}`** keeps the **agent loop on Anthropic's orchestration
layer** but moves **tool execution to infrastructure you control** — bash, file ops,
code run in *your* container, so filesystem contents and network egress never leave
your environment. Connectivity is **outbound-only**: your worker long-polls Anthropic's
work queue; Anthropic never dials into your network.

This directly inverts the study's headline ([README.md](./README.md): *"self-hosted only
moves tool execution to your machine; this relay keeps tools in Anthropic's cloud env"*) —
it's the path the study named but never walked.

### Flow

```
1. environments.create({ config: {type: "self_hosted"} })     → env_...
2. Console → environment page → "Generate environment key"     → sk-ant-oat01-...  (ANTHROPIC_ENVIRONMENT_KEY)
3. Run a worker:  new EnvironmentWorker({...}).run()   |   ant beta:worker poll
4. sessions.create({ environment_id: env_... })  — exactly as for cloud
```

`{type: "self_hosted"}` is the *entire* config — no pool/capacity/networking sub-fields;
you own all of that on your side.

### Worker (TypeScript — this repo's language)

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { EnvironmentWorker } from "@anthropic-ai/sdk/helpers/beta/environments";

const environmentKey = process.env.ANTHROPIC_ENVIRONMENT_KEY!;
const environmentId  = process.env.ANTHROPIC_ENVIRONMENT_ID!;
const client = new Anthropic({ authToken: environmentKey });   // env key, NOT the api key
const ctrl = new AbortController();
process.once("SIGTERM", () => ctrl.abort());

await new EnvironmentWorker({
  client, environmentId, environmentKey, workdir: "/workspace", signal: ctrl.signal,
}).run();           // .runOne() for webhook-driven wake on session.status_run_started
```

### What changes vs `cloud`

| Concern | `cloud` | `self_hosted` |
|---------|---------|---------------|
| Container lifecycle, hardening, networking | Anthropic | **You** — run non-root, read-only rootfs, drop caps; egress is whatever your VPC allows |
| `file` / `github_repository` mounting | Anthropic mounts | **You** — pass pointers via `sessions.create(metadata)`, fetch/clone before dispatch |
| `memory_store` resources | Supported | **Not yet supported** |
| Vault `environment_variable` creds | Supported (egress substitution) | **Not supported** — egress is yours, nowhere to substitute. Use MCP creds or a host-side custom tool |
| Built-in tools | `agent_toolset_20260401` | Supplied by your worker (`EnvironmentWorker` default / `ant` CLI fixed set) |
| Claude Platform on AWS | Supported | **Not available** |
| SDK worker helpers | All SDKs | **Python / TypeScript / Go only** (or the `ant` CLI) |

### Gotchas

- **Control-plane calls use `x-api-key`, not the environment key — and run them from
  *outside* the worker host.** Setting `ANTHROPIC_API_KEY` on the worker host exposes an
  org-scoped credential to the agent's own tool calls.
- **TS runtime deps:** the SDK helpers need `/bin/bash` at that exact path, plus `unzip`,
  `tar`, and Node 22+ (resolved at fixed paths, ignore `PATH`).
- **Cost model flips:** the ~$0.08/session-hour active-runtime line ([CONCLUSION.md](./CONCLUSION.md))
  is for *Anthropic's* container. Self-hosted moves that compute onto your infra bill —
  you trade the session-hour meter for your own machine cost. Tokens still bill the same.

---

## Deep dive 2 — Vaults / credentials

**Vaults** store credentials Anthropic manages on your behalf. The credential **never
enters the sandbox** — Anthropic-side proxies inject it **after** a request leaves the
container, so code the agent writes can't read or exfiltrate it, even under prompt
injection. Two categories:

| Type | Keyed by | Behavior |
|------|----------|----------|
| `mcp_oauth` | `mcp_server_url` | Auto-refreshed via OAuth 2.0 `refresh_token` grant. The *only* way to auth an MCP server. |
| `static_bearer` | `mcp_server_url` | Static bearer token for an MCP server. |
| `environment_variable` | `secret_name` | Sandbox sees an **opaque placeholder**; the real value is substituted at egress, on the credential's `allowed_hosts` only. For CLIs (`aws`, `gcloud`), SDKs, or `curl` from `bash`. |

Secret fields (`token`, `access_token`, `refresh_token`, `client_secret`, `secret_value`)
are **write-only** — never returned by the API.

### Flow

```
vaults.create()  →  vaults.credentials.create()  →  sessions.create({ vault_ids: ["vlt_..."] })
                                                     (create-only — NOT settable via session update)
```

The agent's `mcp_servers` array declares `{type, name, url}` only — **no auth field**.
Auth lives in the vault, attached per session.

### How this contrasts with the study

The study handled exactly one secret — the GitHub PAT — via the `github_repository`
resource's `authorization_token`, injected by a **git proxy** at egress
([ARCHITECTURE.md §6](./ARCHITECTURE.md)). That is a *special-cased* vault for git only.
Vaults generalize the same egress-substitution model to **any** MCP server or
environment-variable secret. The study has the special case; it never built the general
one.

### Constraints

- **Unique key per vault** (`mcp_server_url` / `secret_name`); duplicates → 409.
- **Keys are immutable** — rotate the *value*, but to change the key, archive + recreate.
- **Max 20 credentials per vault.** Workspace-scoped.
- **Not validated until session runtime** — a bad credential surfaces as a downstream
  auth error mid-session, not at create time.
- **Two networking layers, both required:** `networking.allowed_hosts` on the credential
  controls which requests *use* the secret; the *environment* must independently allow the
  host. Missing from either → the request fails.

### The bridge to deep dive 1

`environment_variable` vaults **don't work with self-hosted sandboxes** — egress is yours,
so there's nowhere for Anthropic to substitute the secret. The fallback is a **host-side
custom tool**: the agent emits `agent.custom_tool_use`, your orchestrator (which already
holds the secret) executes the call and returns `user.custom_tool_result` over the
authenticated event stream. No public endpoint, sandbox never sees the secret. This is the
same instinct the study already followed by keeping the PAT host-side — the two frontiers
meet here.

---

## Verdict (unchanged)

These are *learning* gaps, not *shipping* gaps. For this solo portfolio repo the
GitHub Actions `@claude` runner still wins ([EVAL.md](./EVAL.md), 7-3-2). Walk
self-hosted sandboxes first (it closes the study's own open question and inverts its
headline), vaults second (the study has the workaround, not the real pattern). Everything
else is scale-shaped and overkill here.
