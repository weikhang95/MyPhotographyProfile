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

// Persistent memory store — mounted at /mnt/memory/<name>/ on every session, so the
// agent carries durable repo knowledge + accumulated lessons ACROSS runs (sessions
// are otherwise amnesiac). Created once, cached in .state.json like the agent/env.
const MEMORY_STORE_NAME = "issue-fixer-lessons";
const SEED_LESSONS = `# Repository knowledge — weikhang95/MyPhotographyProfile

Durable facts about this repo. Read before starting an issue — they save you from
re-discovering the project each run.

## Stack
- Angular 21 photography-portfolio site, TypeScript, SCSS styles.
- Package manager: npm (Node 22). Tests: Jest (jsdom).

## Commands (from repo root)
- Install: \`npm ci\`
- Test: \`npm test\`   (must be green before you push)
- Build: \`npm run build\`

## Workflow rules
- Branch from the default branch as \`agent/issue-<n>\`. NEVER push to main.
- Do NOT run \`gh pr create\` — the relay opens the PR after you push. Pushing the
  branch is your final step.
- Keep changes minimal and scoped to the issue.

## Common locations
- App shell / page titles: \`src/index.html\`
- Components: \`src/app/<feature>/\`
- Global styles: \`src/styles.scss\`

## Lessons
Append durable, reusable lessons to \`/mnt/memory/${MEMORY_STORE_NAME}/lessons/<topic>.md\`
(build/test gotchas, conventions). Do NOT store secrets or one-off issue details.
`;

type State = { agentId?: string; environmentId?: string; memoryStoreId?: string };

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

  if (!state.memoryStoreId) {
    const store = await client.beta.memoryStores.create({
      name: MEMORY_STORE_NAME,
      // description is injected into the agent's system prompt — write it for the model.
      description:
        "Durable knowledge about the MyPhotographyProfile repo (stack, test/build " +
        "commands, branch + PR conventions, file map) plus lessons from past issues. " +
        "Read /repo.md and skim /lessons/ before starting; append reusable lessons after.",
    });
    state.memoryStoreId = store.id;
    // Seed reference material once. 409 = path already exists (re-run) — ignore.
    try {
      await client.beta.memoryStores.memories.create(store.id, {
        path: "/repo.md",
        content: SEED_LESSONS,
      });
    } catch {
      /* already seeded */
    }
    console.log(`Created memory store: ${store.id}`);
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

// Verify the agent actually pushed its branch before opening a PR. `end_turn` only
// means the agent stopped talking — NOT that it produced commits. Gating on the
// branch existing on origin turns "agent finished" into "agent finished AND shipped",
// and avoids firing a PR (→ confusing 422) on a branch that was never pushed.
async function branchPushed(repo: string, branch: string, ghToken: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/branches/${encodeURIComponent(branch)}`,
      {
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "claude-managed-agent-relay",
        },
      },
    );
    return res.ok; // 200 = branch exists (something was pushed); 404 = nothing pushed
  } catch {
    return false; // network error → treat as "not verified", don't open a blind PR
  }
}

// Cost hygiene: once a run ends, free the session's container so an idle-but-alive
// session doesn't keep accruing session-hours. Archive (not delete) keeps the event
// log readable for the eval loop. Poll past the post-idle status-write race first —
// the stream emits `idle` slightly before the queryable status settles, so an
// immediate archive can 400 with "cannot archive while running".
async function archiveWhenSettled(
  client: Anthropic,
  sessionId: string,
  issueNumber: number | string,
): Promise<void> {
  try {
    let status = "running";
    for (let i = 0; i < 10; i++) {
      status = (await client.beta.sessions.retrieve(sessionId)).status;
      if (status !== "running") break;
      await new Promise((r) => setTimeout(r, 200));
    }
    if (status === "running") {
      console.log(`[#${issueNumber}] still running after ~2s — left unarchived`);
      return;
    }
    await client.beta.sessions.archive(sessionId);
    console.log(`[#${issueNumber}] session archived — container freed`);
  } catch (err) {
    console.error(`[#${issueNumber}] archive skipped:`, err);
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
  const { agentId, environmentId, memoryStoreId } = await ensureAgentAndEnv(client);

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
      // Persistent cross-session memory (mounts at /mnt/memory/<name>/). Attach is
      // session-create-only — it cannot be added later via resources.add().
      {
        type: "memory_store",
        memory_store_id: memoryStoreId,
        access: "read_write",
        instructions:
          "Repo knowledge + lessons from past issues. Read /repo.md and skim " +
          "/lessons/ before starting; after finishing, append any durable, reusable " +
          "lesson to /lessons/<topic>.md. Never store secrets or issue-specific trivia.",
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

  // Open the PR host-side ONLY if the agent both finished cleanly (end_turn) AND
  // actually pushed the branch. `end_turn` alone is "agent stopped", not "work
  // shipped" — verifying the artifact exists keeps us from opening empty/false PRs.
  const branch = `agent/issue-${issueNumber}`;
  if (succeeded && (await branchPushed(repo, branch, ghToken))) {
    await openPullRequest({ repo, branch, issueNumber, ghToken, title });
  } else if (succeeded) {
    console.log(`[#${issueNumber}] end_turn but ${branch} not on origin — nothing pushed, skipping PR`);
  } else {
    console.log(`[#${issueNumber}] no terminal end_turn — skipping PR`);
  }

  // Run's done — free the container so it stops accruing session-hours.
  await archiveWhenSettled(client, session.id, issueNumber);
}
