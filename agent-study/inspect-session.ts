#!/usr/bin/env bun
// Debug helper: show a session's REAL outcome + any push/permission errors.
//
// Why not just print session.status? Because it lies after archive. A clean run that
// finished `end_turn` and was then archived reports status=terminated, stop_reason=null
// — looks like a failure, was a success. The true outcome lives in the terminal
// `session.status_idle` event, so we read THAT from the event log instead of trusting
// the status field. (Verified against a real run: session #14 showed status=terminated
// but outcome=end_turn, with PR #15 opened.)
//
// Usage: bun run inspect-session.ts <session-id>
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const sid = process.argv[2];
if (!sid) {
  console.error("usage: bun run inspect-session.ts <session-id>");
  process.exit(1);
}

const session = await client.beta.sessions.retrieve(sid);
const archivedAt = (session as any).archived_at ?? null;

// Push/permission FAILURE words — deliberately specific. Two false-positive traps the
// real #14 trace exposed: (1) model-request spans echo the system prompt + tool schemas,
// (2) every agent.tool_use carries `"evaluated_permission":"allow"`. A bare /permission/
// or /forbidden/ matches both. So we match only failure-shaped strings ("denied", "403",
// "fatal:", "remote: ", "protected branch", "refusing"), and skip model-request spans.
const re = /403|denied|forbidden|remote: |fatal:|protected branch|not permitted|refusing/i;

const types: Record<string, number> = {};
const tools: Record<string, number> = {};
let outcome = "(no terminal event in log)";
const errEvents: string[] = [];

for await (const e of client.beta.sessions.events.list(sid)) {
  const t = (e as any).type as string;
  types[t] = (types[t] ?? 0) + 1;

  if (t === "agent.tool_use") {
    const name = (e as any).name ?? "?";
    tools[name] = (tools[name] ?? 0) + 1;
  }

  // The real outcome: last terminal status event wins.
  if (t === "session.status_idle") outcome = `idle / ${(e as any).stop_reason?.type ?? "?"}`;
  if (t === "session.status_terminated") outcome = "terminated (hard error)";

  // Error scan — but never on model-request spans (system-prompt/tool-schema noise).
  if (t === "span.model_request_start" || t === "span.model_request_end") continue;
  const s = JSON.stringify(e);
  if (re.test(s)) {
    errEvents.push(
      `\n==== ${t} (${(e as any).id}) ====\n` +
        (s.length > 2000 ? s.slice(0, 2000) + " …[truncated]" : s),
    );
  }
}

console.log(`SESSION ${sid}`);
console.log(`  status field : ${session.status}${archivedAt ? `  (archived_at ${archivedAt})` : ""}`);
console.log(`  REAL outcome : ${outcome}   ← from the terminal event, not the status field`);
console.log(`  event types  : ${JSON.stringify(types)}`);
console.log(`  tools        : ${JSON.stringify(tools)}`);

if (errEvents.length) {
  console.log(`\n${errEvents.length} push/permission-flavored event(s):`);
  for (const x of errEvents) console.log(x);
} else {
  console.log(`  errors       : none (no push/permission failures found)`);
}
