# Managed Agents study — local `@claude` relay

Drive Claude Managed Agents to fix GitHub issues, **without** GitHub Actions.
The agent loop runs in Anthropic's cloud; only a thin trigger relay runs on your
machine, exposed to GitHub via a tunnel.

```
GitHub @claude comment ──tunnel──▶ relay.ts (local) ──sessions.create()──▶ Managed Agent (Anthropic cloud) ──opens PR──▶ repo
```

> For the full design — zone diagram, request-lifecycle sequence, relay decision
> flow, session state machine, and security model — see [ARCHITECTURE.md](./ARCHITECTURE.md).
>
> For the **evaluation** — this relay vs the GitHub Actions runner across 12
> dimensions, plus how Anthropic's customers (Sentry, Notion, Rakuten) use Managed
> Agents — see [EVAL.md](./EVAL.md). **TL;DR: for one small repo, the runner wins;
> Managed Agents pays off at scale.**

| File | Role |
|------|------|
| `agent.ts` | Shared driver: cached agent + cloud env, runs one session per issue. |
| `fix-issue.ts` | Manual CLI: `bun run fix-issue <n>`. |
| `relay.ts` | Webhook server: verifies signature, detects `@claude`, starts a session. |
| `.state.json` | Cached `agentId` / `environmentId` (gitignored, created on first run). |

## 1. Setup

```bash
cd agent-study
bun install
cp .env.example .env   # then fill in the three values
```

- **`GITHUB_TOKEN`** — create a *fine-grained* PAT scoped to this repo with
  **Contents: RW, Pull requests: RW, Issues: RW**. This is what the agent pushes with.
- **`GITHUB_WEBHOOK_SECRET`** — invent a long random string; you paste the same
  value into GitHub in step 4.

## 2. Run the relay

```bash
bun run relay          # listens on http://127.0.0.1:8788
```

## 3. Tunnel (pick one)

```bash
# ngrok — quickest, random URL each run (free tier)
ngrok http 8788

# cloudflared — stable, no signup for a quick tunnel
cloudflared tunnel --url http://localhost:8788
```

Copy the public **https://…** URL it prints.

## 4. Configure the GitHub webhook

Repo → **Settings → Webhooks → Add webhook**:

- **Payload URL**: the tunnel URL from step 3 (e.g. `https://abc123.ngrok-free.app`)
- **Content type**: `application/json`
- **Secret**: same value as `GITHUB_WEBHOOK_SECRET`
- **Events**: *Let me select individual events* → check **Issues**,
  **Issue comments**, **Pull request review comments**

Save. GitHub sends a `ping` (relay returns 200, ignored).

## 5. Test

Open an issue (or comment) containing `@claude`. You should see:

- a 👀 reaction on the comment within a second,
- `▶ issue_comment #N … @claude` in the relay log,
- the agent stream, then a PR opened by your PAT.

## 6. Cut over from GitHub Actions — do this LAST

Only after a successful test, stop the old runner so `@claude` doesn't fire twice.
Edit `.github/workflows/claude.yml` and gate the job, or restrict its triggers:

```yaml
on:
  workflow_dispatch:   # manual only — relay now owns @claude
```

**Keep** `.github/workflows/ci.yml` — it's still the required build/test check on
the agent's PRs. **Keep** `gemini.yml` and `gemini-triage.yml` — unrelated.

## Notes / limits (study scope)

- **Port**: defaults to `8788`. If that's taken (e.g. by another local MCP server),
  set `PORT` in `.env` and point the tunnel + webhook at it — this machine used `8790`.
- **Dedupe** is in-memory; restarting the relay forgets delivery IDs.
- **No enforced test gate / retry loop.** `claude.yml` enforced 3 attempts + a
  build/test gate in *workflow* logic. Here the agent is only *told* to run tests;
  the hard gate is `ci.yml` on the resulting PR. Rebuild the loop in the relay if
  you need it enforced before the PR opens.
- The model **agent loop cannot run locally** — "self-hosted" only moves *tool
  execution* to your machine. This relay keeps tools in Anthropic's cloud env.
- Loops are guarded: bot-sent events and non-`@claude` bodies are ignored.
