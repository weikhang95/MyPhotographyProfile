#!/usr/bin/env bun
// Method 2 study: fix a GitHub issue via Claude Managed Agents.
// Usage: ANTHROPIC_API_KEY=... bun run fix-issue.ts <issue-number>
//
// Flow: fetch issue (gh) -> reuse/create agent + environment -> create session
// -> send prompt with repo token -> stream events until idle.
// Agent/environment IDs are cached in .state.json so they're created once.

import Anthropic from "@anthropic-ai/sdk";
import { $ } from "bun";

const REPO = "weikhang95/MyPhotographyProfile";
const STATE_FILE = new URL(".state.json", import.meta.url).pathname;

const issueNumber = process.argv[2];
if (!issueNumber || !process.env.ANTHROPIC_API_KEY) {
  console.error("Usage: ANTHROPIC_API_KEY=... bun run fix-issue.ts <issue-number>");
  process.exit(1);
}

// GITHUB_TOKEN: prefer a fine-grained PAT scoped to this repo. Falls back to
// `gh auth token` — that token is broad-scope and leaves your machine, study only.
const ghToken =
  process.env.GITHUB_TOKEN ?? (await $`gh auth token`.text()).trim();
if (!process.env.GITHUB_TOKEN) {
  console.warn("⚠ using broad `gh auth token` — set GITHUB_TOKEN to a repo-scoped PAT instead");
}

const issue = await $`gh issue view ${issueNumber} --repo ${REPO} --json title,body`.json();
console.log(`Issue #${issueNumber}: ${issue.title}`);

const client = new Anthropic();

// --- agent + environment (created once, cached) ---
type State = { agentId?: string; environmentId?: string };
const state: State = (await Bun.file(STATE_FILE).exists())
  ? await Bun.file(STATE_FILE).json()
  : {};

if (!state.agentId) {
  const agent = await client.beta.agents.create({
    name: "Issue Fixer (study)",
    model: "claude-haiku-4-5-20251001",
    system:
      "You are an autonomous coding agent fixing one GitHub issue in an Angular portfolio site. " +
      "Workflow: clone the repo, create a branch named agent/issue-<n>, make the fix, " +
      "run `npm ci && npm test` and make sure tests pass, push the branch, " +
      "then open a PR with `gh pr create` that references the issue. " +
      "Never push to main. Keep changes minimal.",
    tools: [{ type: "agent_toolset_20260401" }],
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

// --- session ---
const session = await client.beta.sessions.create({
  agent: state.agentId,
  environment_id: state.environmentId,
  title: `Fix issue #${issueNumber}`,
});
console.log(`Session: ${session.id}\n---`);

const stream = await client.beta.sessions.events.stream(session.id);

await client.beta.sessions.events.send(session.id, {
  events: [
    {
      type: "user.message",
      content: [
        {
          type: "text",
          text: [
            `Fix GitHub issue #${issueNumber} in ${REPO}.`,
            ``,
            `Title: ${issue.title}`,
            `Body: ${issue.body}`,
            ``,
            `Clone with: git clone https://x-access-token:${ghToken}@github.com/${REPO}.git`,
            `Authenticate gh with: echo "${ghToken}" | gh auth login --with-token`,
            `Set git identity: git config user.name "Managed Agent (study)" && git config user.email "agent@users.noreply.github.com"`,
          ].join("\n"),
        },
      ],
    },
  ],
});

for await (const event of stream) {
  if (event.type === "agent.message") {
    for (const block of event.content) {
      if ("text" in block) process.stdout.write(block.text);
    }
    process.stdout.write("\n");
  } else if (event.type === "agent.tool_use") {
    console.log(`  [tool: ${event.name}]`);
  } else if (event.type === "session.status_idle") {
    console.log("---\nAgent idle. Done.");
    break;
  }
}
