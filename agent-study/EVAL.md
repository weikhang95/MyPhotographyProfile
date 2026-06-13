# Evaluation — GitHub Actions runner vs Claude Managed Agents

After **building and running both** `@claude` automation paths in this repo (the
Managed Agents relay produced [PR #15](https://github.com/weikhang95/MyPhotographyProfile/pull/15)
end-to-end), we ran a 12-dimension comparison. Each dimension was analysed and then
**adversarially fact-checked** by a separate pass; all 12 winners survived.

- **System A — GitHub Actions runner**: `.github/workflows/claude.yml` + `anthropics/claude-code-action` on a GitHub-hosted runner.
- **System B — Claude Managed Agents relay**: `agent-study/relay.ts` + `agent.ts` (local webhook relay → Anthropic-hosted agent).

## Verdict: Runner 7 · Tie 3 · Managed 2

For **this** repo (solo dev, public, low `@claude` volume) the GitHub Actions
runner is the better fit. Managed Agents is the right tool at a different scale.

| # | Dimension | Winner | Why |
|---|-----------|--------|-----|
| 1 | Hosting & infra | **Runner** | Zero infra to operate vs an always-on relay **+** tunnel. |
| 2 | Setup & onboarding | **Runner** | Drop-in YAML vs PAT + webhook secret + tunnel + webhook-registration chain. |
| 3 | Trigger & integration | **Runner** | Native Actions events; Anthropic has **no** inbound GitHub webhook, so the relay glue is unavoidable. |
| 4 | Cost | Tie | Same model/tokens; Actions minutes free on a **public** repo; **both** prompt-cache. Real run ≈ $0.031. |
| 5 | Latency to PR | **Managed** | No runner cold start; acks <10s, opens the PR immediately, defers the heavy build to async CI. |
| 6 | Persistence | **Managed** | Only path that keeps state across invocations (cached agent + append-only session log). |
| 7 | Reliability (test gate) | **Runner** | **Enforced** 3-attempt build/test gate vs the relay's advisory "please test" + `ci.yml` after the fact. |
| 8 | Security & secrets | **Runner** | GitHub-managed secrets + per-run auto-minted token vs local `.env` + a public tunnel as attack surface. |
| 9 | Observability | **Runner** | Built-in step logs + Recent Deliveries + re-run, vs roll-your-own session inspection (`inspect-session.ts`). |
| 10 | Scalability | Tie | Managed = more parallel capacity; Runner = better concurrency **control** (`cancel-in-progress`). |
| 11 | Capabilities (here) | Tie | Managed's memory/multiagent/outcomes exist but are **unused** here; the runner's enforced gate is the one capability this workload needs. |
| 12 | Maintenance & uptime | **Runner** | Always available vs dies when the laptop sleeps / the tunnel URL rotates. |

## Honest corrections from the adversarial pass

The fact-check caught several claims that would have unfairly favored Managed Agents:

1. **Prompt caching is not Managed-exclusive.** `claude-code-action` caches too, so the ~75% saving and the cheap ~$0.031/run apply to **both** → Cost is a tie, not a Managed win.
2. **The 3× build/test only fires on *failure*.** On the happy path the runner builds **once**; the triple-gate is worst-case, not every run.
3. **The "Managed has a strictly larger capability surface" claim was overstated** (one analyst cited non-existent doc lines). The extras are real but irrelevant for one small repo → tie.
4. **"Notion ran 30+ concurrent sessions" is an unverified external claim** — noted, not treated as load-bearing.

## When to use which

| Pick the **GitHub Actions runner** when… | Pick **Managed Agents** when… |
|---|---|
| Solo / small team, one repo, low volume | Many repos or a team; high concurrent volume |
| Public repo (free) or you want zero infra | You need persistent sessions, memory, multiagent, or outcomes |
| You want enforced green-PR gating out of the box | Triggers beyond GitHub, or long-running agent tasks |
| You can't run an always-on server | You'll run **real** infra (stable tunnel/server, not a laptop) |

## Recommendation for `MyPhotographyProfile`

**Use the GitHub Actions runner (`claude.yml`) for day-to-day `@claude`** — free,
always-on, enforced test gate, nothing to babysit. **Keep `agent-study/` as the
study artifact** — it works (PR #15), it taught the architecture, and it's where to
start when this outgrows a single repo.

## How Anthropic's customers use Managed Agents

The companies in Anthropic's case studies pick Managed Agents for the exact reasons
it *loses* here — they operate at the scale where "don't build/maintain agent infra"
is the whole point. Our study is the small-scale mirror image of theirs.

| Customer | Trigger → agent pattern | Why Managed Agents | Ties to our study |
|----------|------------------------|--------------------|-------------------|
| **Sentry** (Seer) | Background **RCA** on telemetry → hands off to a Managed Agent that writes the fix and **opens a PR**. ~1M RCAs/yr, 600k+ PRs/mo reviewed. | "Eliminated the operational overhead of maintaining bespoke agent infrastructure." One engineer shipped in **weeks, not months**. Ran via Vertex AI for data residency. | Same shape as ours (event → agent → fix → PR); their trigger is an internal RCA event instead of `@claude`. Validates our #1/#12 findings: infra burden is the deciding cost — worth paying at their volume, not at ours. |
| **Notion** | Move a task to "ready to start" on a board → invokes a Claude session; **30+ concurrent** agent tasks, results routed to reviewers. | Long-running sessions, memory, parallel fan-out across a team. 90% cost / 85% latency cut via prompt caching. | Their "status change → session" **is** our "`@claude` comment → `sessions.create()`". Their concurrency need is exactly our **tie on scalability**. |
| **Rakuten** | Specialist agents per department (eng/product/sales/marketing/finance), tasks assigned from Slack/Teams. | Deployed all departments in **one week** by *not* building custom infra; isolated sandboxes for non-technical staff. | The multi-team, many-trigger case where our "always-on relay" burden is absorbed by a real platform — the right side of our When-to-use-which table. |
| **Vibecode** | An **end-user** prompt in a mobile app → a Managed Agent builds a production React Native/Expo app (Claude Code is the engine). Multi-tenant: per-user sessions + sandboxes at scale. | CEO Ansh Nanda: pre-Managed-Agents users had to "manually run LLMs in sandboxes, manage their lifecycle, equip them with tools… weeks or months"; now **10× quicker** to spin up. $50k→$100/app, months→<1hr, 3×→$10M ARR. | The **agent-as-product** variant (vs the others' internal automation), and the most explicit statement anywhere of our infra-burden thesis — the exact axis our eval turns on. |

**The throughline:** every customer chose Managed Agents to *avoid owning agent
infrastructure* at scale — the same axis on which the runner beats it for one small
repo. Same trade-off, opposite ends of the volume curve. Vibecode's CEO says it
most plainly: building the sandbox/lifecycle/tooling yourself is "weeks or months,"
and Managed Agents makes it **10× faster** — which is exactly the burden GitHub
Actions hands *us* for free at one-repo scale, and exactly the burden worth paying
down at theirs.

Two sub-patterns sit on the spine: **internal automation** (Sentry, Notion, Rakuten —
the agent serves the company's own developers/staff) and **agent-as-product**
(Vibecode — the agent *is* the product, run multi-tenant for paying end-users, with
per-end-user sessions and sandboxes). Our `@claude` relay is the smallest possible
instance of the first.

---

### Methodology

12 dimensions, each analysed by one agent then independently fact-checked by an
adversarial verifier (24 agents total). Winners are reported only after the
verifier upheld them; corrections above reflect issues the verifier caught. Cost
figures use the real session usage (`cache_read_input_tokens=103676`, etc.) at
`claude-haiku-4-5` rates. Repo confirmed **public** (Actions minutes free).
