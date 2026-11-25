import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { root, readJson, config, repo } from './demo-lib.mjs';

export const scenarios = readJson('scripts/scenarios.json');
const runbook = readFileSync(join(root, 'agentic-sdlc-workshop-docs', 'RUNBOOK.md'), 'utf8');
const context = readFileSync(join(root, 'agentic-sdlc-workshop-docs', 'CONTEXT.md'), 'utf8').replaceAll('\r', '');
export const screenshotDir = join(root, config.screenshotDir);
export const url = `https://github.com/${repo}`;
export const verifiedLinks = {
  S04: [['Draft Copilot (belum ada perubahan)', 'pull/18'], ['Run coding agent berhenti sebelum kerja', 'actions/runs/45554824363']],
  S08: [['Draft PR test lokal', 'pull/19'], ['Issue bug yang ditemukan', 'issues/20']],
  S09: [['Draft stok review', 'pull/17']],
  S10: [['Run setup CodeQL; belum memindai', 'actions/runs/45554378322']],
};

export function evidenceItems() {
  const found = new Set(readdirSync(screenshotDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.isSymbolicLink()).map((entry) => entry.name));
  return Object.entries(scenarios).map(([id, value], index) => {
    const section = context.split(`#### ${id} — `)[1].split(/^\s*(?:#### |### |---)/m)[0];
    const fields = Object.fromEntries([...section.matchAll(/^- \*\*([^*]+):\*\* (.+)$/gm)].map(([, key, text]) => [key, text]));
    const shots = [...new Set([`${id}-before.png`, `${id}-after.png`, ...runbook.matchAll(new RegExp(`${id}-[a-z0-9-]+\\.png`, 'g'))].map(String))]
      .map((name) => ({ name, present: found.has(name) }));
    return { id, ...value, narrative: { story: fields.Cerita, cost: fields.Kerugian, seed: fields.Ditanam, solution: fields.Solusi, advantage: fields.Advantage },
      issue: `${url}/issues/${index + (index < 7 ? 1 : 2)}`, shots,
      evidence: (verifiedLinks[id] ?? []).map(([label, path]) => ({ label, href: `${url}/${path}` })) };
  });
}
