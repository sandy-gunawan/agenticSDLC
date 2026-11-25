import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { root } from './demo-lib.mjs';
import { diagrams } from './site-content.mjs';

const tooling = resolve(process.argv[2] ?? 'node_modules');
const target = join(root, 'site', 'assets', 'diagrams');
const vendor = join(root, 'site', 'assets', 'vendor');
mkdirSync(target, { recursive: true });
mkdirSync(vendor, { recursive: true });
const chart = join(tooling, 'chart.js');
const chartVersion = JSON.parse(readFileSync(join(chart, 'package.json'), 'utf8')).version;
if (chartVersion !== '4.6.1') throw new Error('Gunakan Chart.js 4.6.1 agar cocok dengan notice MIT yang disertakan.');
const chartBundle = readFileSync(join(chart, 'dist', 'chart.umd.js'), 'utf8').replace(/^\/\/# sourceMappingURL=.*(?:\r?\n|$)/gm, '');
writeFileSync(join(vendor, 'chart.umd.js'), chartBundle);

function source(id, edges) {
  const nodes = [...new Set(edges.flatMap(([from, , to]) => [from, to]))];
  const nodeId = (name) => `N${nodes.indexOf(name)}`;
  if (['D6', 'D8'].includes(id)) {
    return ['sequenceDiagram', ...nodes.map((node) => `  participant ${nodeId(node)} as ${node}`),
      ...edges.map(([from, action, to]) => `  ${nodeId(from)}${action.includes('hasil') ? '-->>' : '->>'}${nodeId(to)}: ${action}`)].join('\n');
  }
  const role = (name) => /Tech Lead|Bima|Dimas|Lina|Personal|Browser/.test(name) ? 'human'
    : /agent|Copilot|Architect|Implementer|Reviewer|triage|sync|analysis/i.test(name) ? 'agent'
      : /hook|CI|CodeQL|Security|izin|Deny|Safe outputs/i.test(name) ? 'gate' : 'file';
  return [
    `flowchart ${id === 'D1' ? 'LR' : 'TB'}`,
    ...nodes.map((node) => `  ${nodeId(node)}["${node}"]:::${role(node)}`),
    ...edges.map(([from, action, to]) => `  ${nodeId(from)} -->|"${action}"| ${nodeId(to)}`),
    '  classDef human fill:#dbeafe,stroke:#1d4ed8,color:#172554',
    '  classDef agent fill:#f3e8ff,stroke:#7e22ce,color:#3b0764',
    '  classDef gate fill:#ffedd5,stroke:#c2410c,color:#431407',
    '  classDef file fill:#e2e8f0,stroke:#475569,color:#1e293b',
  ].join('\n');
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.context().setOffline(true);
  await page.setContent('<!doctype html><meta charset="utf-8"><div id="target"></div>');
  await page.addScriptTag({ path: join(tooling, 'mermaid', 'dist', 'mermaid.min.js') });
  for (const [id, [title, edges]] of Object.entries(diagrams)) {
    const diagram = source(id, edges);
    const svg = await page.evaluate(async ({ id, diagram, title }) => {
      const mermaid = globalThis.mermaid;
      mermaid.initialize({
        startOnLoad: false, securityLevel: 'strict', htmlLabels: false,
        theme: 'base', deterministicIds: true, deterministicIDSeed: id,
        themeVariables: { fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineColor: '#475569',
          textColor: '#1e293b', actorTextColor: '#172554', actorBkg: '#dbeafe', actorBorder: '#1d4ed8',
          signalColor: '#334155', signalTextColor: '#1e293b', edgeLabelBackground: '#f8fafc',
        },
        sequence: { diagramMarginX: 10, actorMargin: 28, wrap: true, useMaxWidth: false },
        flowchart: { useMaxWidth: false },
      });
      const target = globalThis.document.querySelector('#target');
      const rendered = await mermaid.render(`workshop${id}`, diagram, target);
      target.innerHTML = rendered.svg;
      const image = target.querySelector('svg');
      image.setAttribute('aria-label', title);
      const result = image.outerHTML;
      target.replaceChildren();
      return result;
    }, { id, diagram, title });
    writeFileSync(join(target, `${id}.mmd`), `${diagram}\n`);
    writeFileSync(join(target, `${id}.svg`), `${svg}\n`);
  }
} finally {
  await browser.close();
}
console.log(`Render offline: ${Object.keys(diagrams).length} SVG.`);
