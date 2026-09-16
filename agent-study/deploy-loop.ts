#!/usr/bin/env bun
// Method 3 study (hybrid): webhook = DISCOVERY, Deployment = the VERIFIED LOOP.
//
// Loop-engineering split. relay.ts opens a fresh session per @claude mention
// (event-driven, per-issue, you stream the loop by hand). A Deployment instead
// bundles agent + env + repo + memory + a standing `define_outcome` rubric into ONE
// autonomous unit that Anthropic RUNS and GRADES (eval -> revise up to max_iterations)
// with zero streaming code from us.
//
// Trigger model (verified against @anthropic-ai/sdk 0.104.1):
//   A deployment fires two ways only -- `schedule` (cron) or `manual`.
//   Manual === client.beta.deployments.run(id). DeploymentRunParams = { betas } only,
//   i.e. NO per-fire payload, so every fire REPLAYS the deployment's initial_events.
//   Consequence: the webhook can only say "go" -- it cannot hand the run an issue
//   number. So "discover work" has to live INSIDE the agent: it scans the repo and
//   picks what to fix each fire. That is the loop-engineering "discover work" pillar.
//
//   webhook (decide which deliveries deserve a paid fire) -> deployments.run()
//     -> agent scans open issues, fixes one, pushes a branch, self-grades vs rubric.

import Anthropic from "@anthropic-ai/sdk";
import { ensureAgentAndEnv } from "./agent.ts";

const STATE_FILE = new URL(".state.json", import.meta.url).pathname;
const REPO = "weikhang95/MyPhotographyProfile";

// The standing task EVERY fire runs (deployment.initial_events). Because run() takes
// no payload, this prompt -- not the webhook -- is what tells the agent what to do.
const OUTCOME_DESCRIPTION =
  `Scan the open issues in ${REPO} labeled \`agent-fix\`. Choose the oldest one that ` +
  `has no \`agent/issue-<n>\` branch yet, implement a minimal fix on that branch, run ` +
  `\`npm ci && npm test\` until green, then push the branch. Do NOT open a PR (the host ` +
  `relay does that). If no such issue exists, do nothing and end the turn.`;

// The VERIFY pillar: the grader scores the agent's work against this each iteration and
// sends it back to revise until satisfied or max_iterations. Plain text / markdown.
const RUBRIC = `# Done means
- A branch \`agent/issue-<n>\` exists and is pushed, n = the issue number addressed.
- \`npm test\` passes on that branch (no skipped/failing specs).
- The diff is MINIMAL and scoped to the issue -- no drive-by refactors, no formatting churn.
- No changes to main; no secrets committed; commit authored as "Claude Agent".
# Not done
- Tests red, branch unpushed, or the fix touches unrelated files.`;

type State = { agentId?: string; environmentId?: string; memoryStoreId?: string; deploymentId?: string };

// Create the deployment once, cache its id in .state.json next to agent/env/memory.
// Reuses the SAME cached agent + environment + memory store as relay.ts, so the graded
// loop and your @claude relay share one agent definition and one accumulating memory.
export async function ensureDeployment(client: Anthropic): Promise<string> {
  // ensureAgentAndEnv writes agent/env/memory into .state.json first.
  const { agentId, environmentId, memoryStoreId } = await ensureAgentAndEnv(client);

  const state: State = (await Bun.file(STATE_FILE).exists())
    ? await Bun.file(STATE_FILE).json()
    : {};
  if (state.deploymentId) return state.deploymentId;

  // The repo token is baked into the deployment at create time (resources are fixed for
  // the deployment's life). It is write-only -- never returned by the API -- but it does
  // live server-side until you rotate it via deployments.update(). Use a repo-scoped PAT.
  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) throw new Error("set GITHUB_TOKEN (repo-scoped PAT) to bake into the deployment");

  const dep = await client.beta.deployments.create({
    name: "issue-fixer-loop",
    description: "Webhook-kicked, self-discovering issue fixer with a graded outcome loop.",
    agent: agentId, // bare id = latest version
    environment_id: environmentId,
    initial_events: [
      {
        type: "user.define_outcome",
        description: OUTCOME_DESCRIPTION,
        rubric: { type: "text", content: RUBRIC },
        max_iterations: 5, // eval -> revise cycles before giving up (default 3, max 20)
      },
    ],
    resources: [
      { type: "github_repository", url: `https://github.com/${REPO}`, mount_path: "/workspace/repo", authorization_token: ghToken },
      { type: "memory_store", memory_store_id: memoryStoreId, access: "read_write",
        instructions: "Repo knowledge + lessons. Read /repo.md and skim /lessons/ before starting; append durable lessons after." },
    ],
    // schedule: OMITTED on purpose -- webhook-driven. Add a cron here later for a nightly
    // safety sweep (belt-and-braces: catch issues the webhook missed). e.g.
    // schedule: { type: "cron", expression: "0 3 * * *", timezone: "Asia/Kuala_Lumpur" },
  });

  await Bun.write(STATE_FILE, JSON.stringify({ ...state, deploymentId: dep.id }, null, 2));
  console.log(`Created deployment: ${dep.id}`);
  return dep.id;
}

// THE SEAM. relay.ts already parses & verifies GitHub deliveries; call this instead of
// runIssue() when you want the graded deployment loop to own the work rather than
// streaming a per-issue session yourself.
export async function onWebhookEvent(client: Anthropic, payload: GitHubEvent): Promise<void> {
  if (!shouldFire(payload)) return; // <-- your discovery gate decides

  const deploymentId = await ensureDeployment(client);
  const run = await client.beta.deployments.run(deploymentId); // manual fire, no payload

  if (run.session_id) {
    console.log(`fired -> run ${run.id}, session ${run.session_id}`);
    // run.session_id is a normal session: stream it and open the PR host-side exactly
    // like agent.ts:runIssue does once the branch is pushed.
  } else {
    // error set instead of session_id (exactly one is non-null). A failed scheduled run
    // just RECORDS error.type and retries at the next occurrence -- it does NOT auto-pause
    // (only the AGENT being archived/deleted auto-ARCHIVES the deployment). A manual fire
    // has no next occurrence, so it just reports here.
    console.error(`fire failed: ${run.error?.type} -- ${run.error?.message}`);
  }
}

// Minimal shape of the GitHub webhook fields the gate needs. relay.ts produces this.
export type GitHubEvent = {
  event: string;            // "issues" | "issue_comment" | ...
  action?: string;          // "opened" | "labeled" | "created" | ...
  issueNumber?: number;
  labels?: string[];
  commentBody?: string;
  deliveryId?: string;      // X-GitHub-Delivery -- unique per delivery, but RETRIED on failure
};

// ─────────────────────────────────────────────────────────────────────────────
// YOUR CONTRIBUTION  ·  the "discover work" gate
// ─────────────────────────────────────────────────────────────────────────────
// Every `true` here costs a managed-agent run. GitHub webhooks are AT-LEAST-ONCE
// (the same delivery is retried on non-2xx, and a human can re-label an issue), so a
// naive "fire on every event" both wastes money and races two agents onto one issue.
//
// TODO(you): return true ONLY for deliveries that represent real, NEW work.
// Decisions that are genuinely yours (domain knowledge + cost/UX trade-off):
//   1. Which (event, action) pairs count?  e.g. issues/labeled with `agent-fix`,
//      issue_comment/created containing "@claude" -- and which to ignore.
//   2. Dedup: how do you avoid firing twice for the same underlying issue? The agent
//      self-selects "oldest issue with no agent/issue-<n> branch", so a double-fire is
//      mostly harmless (second agent finds the branch taken) -- but a fire still costs.
//      Cheap guards: a label gate, an in-memory Set of recently-fired issue numbers,
//      or trusting the branch-exists check. Your call on how strict.
//   3. Should a fire be unconditional-but-debounced (always fire, at most 1/min) since
//      the agent picks its own work anyway? That trades a little cost for zero gate logic.
function shouldFire(payload: GitHubEvent): boolean {
  // TODO: implement. ~5-10 lines.
  return false;
}
