#!/usr/bin/env bun
// Debug helper: dump a session's status + any events mentioning push/403 errors.
// Usage: bun run inspect-session.ts <session-id>
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const sid = process.argv[2];
if (!sid) { console.error("usage: bun run inspect-session.ts <session-id>"); process.exit(1); }

const session = await client.beta.sessions.retrieve(sid);
console.log("STATUS:", session.status, "| stop:", JSON.stringify((session as any).stop_reason ?? null));
console.log("---");

const re = /403|denied|forbidden|remote:|fatal|protected|not permitted|permission|refusing/i;
for await (const e of client.beta.sessions.events.list(sid)) {
  const s = JSON.stringify(e);
  if (re.test(s)) {
    console.log(`\n==== ${e.type} (${e.id}) ====`);
    console.log(s.length > 2000 ? s.slice(0, 2000) + " …[truncated]" : s);
  }
}
