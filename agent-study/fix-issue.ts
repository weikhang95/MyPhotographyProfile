#!/usr/bin/env bun
// Method 2 study: fix a GitHub issue via Claude Managed Agents (manual CLI).
// Usage: ANTHROPIC_API_KEY=... bun run fix-issue.ts <issue-number>
//
// Thin wrapper over agent.ts (shared with relay.ts). Fetches the issue with gh,
// resolves a repo token, then runs one Managed Agent session.

import Anthropic from "@anthropic-ai/sdk";
import { $ } from "bun";
import { runIssue } from "./agent.ts";

const REPO = "weikhang95/MyPhotographyProfile";

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
console.log(`Issue #${issueNumber}: ${issue.title}\n---`);

await runIssue({
  client: new Anthropic(),
  repo: REPO,
  issueNumber,
  ghToken,
  title: issue.title,
  instruction: issue.body,
});
