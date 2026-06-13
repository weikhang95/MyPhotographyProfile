// Shared Claude Managed Agents driver.
//
// One cached agent + one cached cloud environment (ids in .state.json), then a
// fresh session per call with the repo mounted at /workspace/repo behind the
// sandbox git proxy. Used by both fix-issue.ts (manual CLI) and relay.ts
// (GitHub @claude webhook) so there is a single source of truth.

import Anthropic from "@anthropic-ai/sdk";

const STATE_FILE = new URL(".state.json", import.meta.url).pathname;

const SYSTEM =
  "You are an autonomous coding agent fixing one GitHub issue or PR request in an Angular portfolio site. " +
  "The repository is already mounted at /workspace/repo with push access via a git proxy. " +
  "Workflow: create a branch named agent/issue-<n> (n = the issue number), make the fix, " +
  "run `npm ci && npm test` and make sure tests pass, then commit and push the branch " +
  "with `git push -u origin agent/issue-<n>`. " +
  "Pushing the branch is your FINAL step. Do NOT open a pull request and do NOT use the `gh` CLI — " +
  "the sandbox can push via git but cannot create PRs; the relay opens the PR for you after you finish. " +
  "Never push to main. Keep changes minimal.";

// Commit identity. GitHub links a commit to an account by EMAIL and only displays
// the NAME — so we label commits "Claude Agent" (clearly automated) while using the
// repo owner's GitHub no-reply email, which keeps them tied to the owner's account.
const GIT_AUTHOR_NAME = "Claude Agent";
const GIT_AUTHOR_EMAIL = "33756637+weikhang95@users.noreply.github.com";

type State = { agentId?: string; environmentId?: string };

// In-process singleton: concurrent webhook deliveries share one ensure() so we
// never race to create duplicate agents/environments or to write .state.json.
let ensured: Promise<Required<State>> | null = null;

export function ensureAgentAndEnv(client: Anthropic): Promise<Required<State>> {
  return (ensured ??= _ensure(client));
}

async function _ensure(client: Anthropic): Promise<Required<State>> {
  const state: State = (await Bun.file(STATE_FILE).exists())
    ? await Bun.file(STATE_FILE).json()
    : {};

  if (!state.agentId) {
    const agent = await client.beta.agents.create({
      name: "Issue Fixer (study)",
      model: "claude-haiku-4-5",
      system: SYSTEM,
      tools: [{ type: "agent_toolset_20260401", default_config: { enabled: true } }],
    });
    state.agentId = agent.id;
    console.log(`Created agent: ${agent.id}`);
  }

  if (!state.environmentId) {
    const env = await client.beta.environments.create({
      name: "issue-fixer-env",
      config: { type: "cloud", networking: { type: "unrestricted" } },
    });
    state.environmentId = env.id;
    console.log(`Created environment: ${env.id}`);
  }

  await Bun.write(STATE_FILE, JSON.stringify(state, null, 2));
  return state as Required<State>;
}

// PR creation is NOT available inside the sandbox — the github_repository resource
// grants filesystem + git (push) only (see managed-agents-environments.md §137).
// So the agent pushes the branch and we open the PR host-side with the same repo
// PAT (this is the sanctioned "automation creates PRs" path, not Claude's gh).
async function openPullRequest(args: {
  repo: string;
  branch: string;
  issueNumber: number | string;
  ghToken: string;
  title?: string;
}): Promise<void> {
  const { repo, branch, issueNumber, ghToken, title } = args;
  const api = `https://api.github.com/repos/${repo}`;
  const headers = {
    Authorization: `Bearer ${ghToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "claude-managed-agent-relay",
  };
  try {
    const repoInfo: any = await fetch(api, { headers }).then((r) => r.json());
    const base = repoInfo.default_branch ?? "main";
    const res = await fetch(`${api}/pulls`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: title ?? `Fix issue #${issueNumber}`,
        head: branch,
        base,
        body: `🤖 Automated by **Claude** (Managed Agent). Commit authored as "Claude Agent", linked to the repo owner.\n\nCloses #${issueNumber}`,
      }),
    });
    if (res.ok) {
      const pr: any = await res.json();
      console.log(`[#${issueNumber}] ✅ PR opened: ${pr.html_url}`);
    } else {
      const e: any = await res.json().catch(() => ({}));
      // 422 commonly = PR already exists, or head branch has no commits / wasn't pushed.
      console.error(
        `[#${issueNumber}] PR create failed (${res.status}): ${e.message ?? ""} ${JSON.stringify(e.errors ?? "")}`,
      );
    }
  } catch (err) {
    console.error(`[#${issueNumber}] PR create error:`, err);
  }
}

export type RunArgs = {
  client: Anthropic;
  repo: string; // "owner/name"
  issueNumber: number | string;
  ghToken: string;
  title?: string;
  instruction?: string; // the text that mentioned @claude (issue body / comment)
};

// Open a session for one issue/PR and stream the agent's run to stdout. Resolves
// when the session goes idle (terminal stop_reason) or terminates.
export async function runIssue(args: RunArgs): Promise<void> {
  const { client, repo, issueNumber, ghToken, title, instruction } = args;
  const { agentId, environmentId } = await ensureAgentAndEnv(client);

  // Repo attached as a github_repository resource: the sandbox git proxy injects
  // the token on push / gh calls, so the token never enters the prompt or history.
  const session = await client.beta.sessions.create({
    agent: agentId, // bare id = latest version (per managed-agents README)
    environment_id: environmentId,
    title: `Fix issue #${issueNumber}`,
    resources: [
      {
        type: "github_repository",
        url: `https://github.com/${repo}`,
        mount_path: "/workspace/repo",
        authorization_token: ghToken,
      },
    ],
  });
  console.log(`[#${issueNumber}] session ${session.id}`);

  const stream = await client.beta.sessions.events.stream(session.id);

  const text = [
    `Address GitHub issue/PR #${issueNumber} in ${repo}.`,
    title ? `\nTitle: ${title}` : "",
    instruction ? `Request: ${instruction}` : "",
    `\nThe repo is mounted at /workspace/repo (push + gh access via git proxy).`,
    `Set git identity first: git config user.name "${GIT_AUTHOR_NAME}" && git config user.email "${GIT_AUTHOR_EMAIL}"`,
  ]
    .filter(Boolean)
    .join("\n");

  await client.beta.sessions.events.send(session.id, {
    events: [{ type: "user.message", content: [{ type: "text", text }] }],
  });

  let succeeded = false;
  for await (const event of stream) {
    if (event.type === "agent.message") {
      for (const block of event.content) {
        if (block.type === "text") process.stdout.write(block.text);
      }
      process.stdout.write("\n");
    } else if (event.type === "agent.tool_use") {
      console.log(`  [#${issueNumber}] tool: ${event.name}`);
    } else if (event.type === "session.status_terminated") {
      console.log(`[#${issueNumber}] terminated`);
      break;
    } else if (event.type === "session.status_idle") {
      // Idle is transient while the agent waits on us; only a terminal
      // stop_reason ends the run.
      if (event.stop_reason.type === "requires_action") continue;
      succeeded = event.stop_reason.type === "end_turn";
      console.log(`[#${issueNumber}] idle (${event.stop_reason.type}) — done`);
      break;
    }
  }

  // Agent finished cleanly → open the PR host-side from the branch it pushed.
  if (succeeded) {
    await openPullRequest({
      repo,
      branch: `agent/issue-${issueNumber}`,
      issueNumber,
      ghToken,
      title,
    });
  }
}
