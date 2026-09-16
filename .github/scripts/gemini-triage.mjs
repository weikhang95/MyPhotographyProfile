// Mini gemini-triage, modeled on angular/dev-infra's issue-labeling action.
// Flow: fetch repo "area:" labels + issue -> skip if already labeled ->
// one constrained Gemini call -> validate verdict -> apply labels.
// Dependency-free: Node 22 global fetch against GitHub + Gemini REST APIs.

const { GITHUB_TOKEN, GEMINI_API_KEY, ANTHROPIC_API_KEY, REPO, ISSUE_NUMBER, TRIAGE_PROVIDER } =
  process.env;
const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const CLAUDE_MODEL = 'claude-haiku-4-5';
const TRIAGED_MARKER = 'gemini-triaged';

async function github(path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function askGemini(systemPrompt, userContent) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userContent }] }],
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
}

async function askClaude(systemPrompt, userContent) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 256,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.content?.[0]?.text ?? '').trim();
}

// Provider chain: first success wins. TRIAGE_PROVIDER=gemini|claude forces a
// single provider (useful for testing each path without touching secrets).
const PROVIDERS = [
  { name: 'gemini', ask: askGemini },
  { name: 'claude', ask: askClaude },
];

async function classify(systemPrompt, userContent) {
  const chain = TRIAGE_PROVIDER
    ? PROVIDERS.filter((p) => p.name === TRIAGE_PROVIDER)
    : PROVIDERS;
  if (chain.length === 0) throw new Error(`Unknown TRIAGE_PROVIDER "${TRIAGE_PROVIDER}"`);

  for (const provider of chain) {
    try {
      const verdict = await provider.ask(systemPrompt, userContent);
      console.log(`Provider "${provider.name}" verdict: "${verdict}"`);
      return verdict;
    } catch (err) {
      console.error(`Provider "${provider.name}" failed: ${err.message}`);
    }
  }
  throw new Error('All providers failed.');
}

/**
 * Build the system prompt for the classifier.
 *
 * @param {Map<string, string>} areaLabels - label name -> description
 * @returns {string}
 */
function buildSystemPrompt(areaLabels) {
  const labelList = Array.from(areaLabels)
    .map(([name, description]) => ` - "${name}"${description ? `: ${description}` : ''}`)
    .join('\n');

  return `You are an issue classifier for a photography portfolio web app (Angular).
Your task is to pick the single best "area:" label for the issue.

Valid labels:
${labelList}

Tie-breaking rule: if the issue is about styling or layout INSIDE a specific
component (portfolio, about, topbar), prefer that component's label over
"area: design". Use "area: design" only for global styles, theming, fonts,
or visual direction not tied to one component.

Respond ONLY with the exact label name (e.g. "area: portfolio").
If you are strictly unsure or multiple labels match equally well, respond "ambiguous".
If no label applies, respond "none".`;
}

/**
 * Decide which labels to apply given the model's raw verdict.
 *
 * @param {string} verdict - trimmed text returned by Gemini
 * @param {Map<string, string>} areaLabels - valid label name -> description
 * @returns {string[]} labels to apply ([] = apply nothing)
 */
function handleVerdict(verdict, areaLabels) {
  if (areaLabels.has(verdict)) {
    return [verdict, TRIAGED_MARKER];
  }
  // "ambiguous", "none", or a hallucinated label: apply nothing, so a missing
  // area label always means "needs human triage" rather than a bad guess.
  console.log(`Verdict "${verdict}" is not a valid area label. Leaving issue untouched.`);
  return [];
}

async function main() {
  const [repoLabels, issue] = await Promise.all([
    github('/labels?per_page=100'),
    github(`/issues/${ISSUE_NUMBER}`),
  ]);

  const areaLabels = new Map(
    repoLabels
      .filter((l) => l.name.startsWith('area: '))
      .map((l) => [l.name, l.description ?? '']),
  );

  if (issue.labels.some((l) => l.name.startsWith('area: '))) {
    console.log('Issue already has an area label. Skipping.');
    return;
  }

  const verdict = await classify(
    buildSystemPrompt(areaLabels),
    `<issue_title>${issue.title}</issue_title>\n<issue_body>\n${issue.body ?? ''}\n</issue_body>`,
  );

  const labelsToApply = handleVerdict(verdict, areaLabels);
  if (labelsToApply.length === 0) {
    console.log('No labels to apply.');
    return;
  }

  await github(`/issues/${ISSUE_NUMBER}/labels`, {
    method: 'POST',
    body: JSON.stringify({ labels: labelsToApply }),
  });
  console.log(`Applied: ${labelsToApply.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
