#!/usr/bin/env bun
// GitHub webhook -> Claude Managed Agent relay.
//
// Replaces the @claude GitHub Actions runner (.github/workflows/claude.yml).
// GitHub delivers an issue/PR event -> we verify its signature, look for a
// "@claude" mention, and start a Managed Agent session (the agent loop runs in
// Anthropic's cloud; only this trigger relay runs locally).
//
// Anthropic has NO inbound webhook for third-party events — this is "ordinary
// application code on your side" (their words). We verify GitHub's own HMAC.
//
// Env (see .env.example):
//   ANTHROPIC_API_KEY       agent billing/auth
//   GITHUB_WEBHOOK_SECRET   the secret you set on the GitHub webhook (HMAC key)
//   GITHUB_TOKEN            repo-scoped fine-grained PAT the agent pushes with
//   PORT                    optional, default 8788
//
// Run:   bun run relay.ts
// Expose: ngrok http 8788   (or: cloudflared tunnel --url http://localhost:8788)

import Anthropic from "@anthropic-ai/sdk";
import { createHmac, timingSafeEqual } from "node:crypto";
import { ensureAgentAndEnv, runIssue } from "./agent.ts";

const PORT = Number(process.env.PORT ?? 8788);
const SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const GH_TOKEN = process.env.GITHUB_TOKEN;
const TRIGGER = "@claude";

function die(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) die("set ANTHROPIC_API_KEY");
if (!SECRET) die("set GITHUB_WEBHOOK_SECRET (must match the GitHub webhook's Secret field)");
if (!GH_TOKEN) die("set GITHUB_TOKEN (repo-scoped PAT the agent uses to push + open PRs)");

const client = new Anthropic();
const seen = new Set<string>(); // de-dupe GitHub redeliveries by X-GitHub-Delivery

// Managed Agents best practice: agents are persistent — create/load ONCE at
// startup, never in the request path. The request path only does sessions.create().
await ensureAgentAndEnv(client);
console.log("agent + environment ready");

// Verify GitHub's HMAC over the RAW body. Timing-safe; rejects on length mismatch.
function verify(raw: string, sig: string | null): boolean {
  if (!sig) return false;
  const expected = "sha256=" + createHmac("sha256", SECRET!).update(raw).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Map a GitHub event payload to an actionable target, or null to ignore.
type Hit = { number: number; body: string; title?: string };
function extract(event: string, p: any): Hit | null {
  if (event === "issue_comment" && p.action === "created")
    return { number: p.issue.number, body: p.comment.body ?? "", title: p.issue.title };
  if (event === "pull_request_review_comment" && p.action === "created")
    return { number: p.pull_request.number, body: p.comment.body ?? "", title: p.pull_request.title };
  if (event === "issues" && p.action === "opened")
    return { number: p.issue.number, body: p.issue.body ?? "", title: p.issue.title };
  return null;
}

// Best-effort 👀 so the human sees the relay picked it up (the PR is the real result).
async function ackReaction(repo: string, event: string, p: any): Promise<void> {
  try {
    const base = `https://api.github.com/repos/${repo}`;
    const url =
      event === "issue_comment"
        ? `${base}/issues/comments/${p.comment.id}/reactions`
        : event === "pull_request_review_comment"
          ? `${base}/pulls/comments/${p.comment.id}/reactions`
          : `${base}/issues/${p.issue.number}/reactions`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "claude-managed-agent-relay",
      },
      body: JSON.stringify({ content: "eyes" }),
    });
  } catch {
    /* non-fatal */
  }
}

Bun.serve({
  port: PORT,
  hostname: "127.0.0.1", // the tunnel runs locally and forwards here
  async fetch(req) {
    if (req.method !== "POST") return new Response("relay up", { status: 200 });

    const raw = await req.text();
    if (!verify(raw, req.headers.get("x-hub-signature-256")))
      return new Response("bad signature", { status: 401 });

    const event = req.headers.get("x-github-event") ?? "";
    const delivery = req.headers.get("x-github-delivery") ?? "";
    if (delivery && seen.has(delivery)) return new Response("duplicate", { status: 200 });

    let p: any;
    try {
      p = JSON.parse(raw);
    } catch {
      return new Response("bad json", { status: 400 });
    }

    if (p.sender?.type === "Bot") return new Response("ignore bot", { status: 200 }); // loop guard
    const repo: string = p.repository?.full_name ?? "";

    const hit = extract(event, p);
    if (!hit || !hit.body.toLowerCase().includes(TRIGGER))
      return new Response("no @claude", { status: 200 });

    if (delivery) seen.add(delivery);
    console.log(`▶ ${event} #${hit.number} in ${repo} — @claude`);

    // Ack fast (GitHub times out ~10s); run the multi-minute session in background.
    void (async () => {
      await ackReaction(repo, event, p);
      try {
        await runIssue({
          client,
          repo,
          issueNumber: hit.number,
          ghToken: GH_TOKEN!,
          title: hit.title,
          instruction: hit.body,
        });
      } catch (err) {
        console.error(`✗ #${hit.number} failed:`, err);
      }
    })();

    return new Response("accepted", { status: 202 });
  },
});

console.log(`relay listening on http://127.0.0.1:${PORT}  (expose with ngrok/cloudflared)`);
