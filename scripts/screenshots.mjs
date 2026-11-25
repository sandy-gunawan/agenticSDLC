import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { chromium } from 'playwright';
import { config, root, prepareTree, serve, git, repo } from './demo-lib.mjs';
import { evidenceItems, scenarios, screenshotDir, url } from './evidence.mjs';
import { execFileSync } from 'node:child_process';

const [target = 'all', afterOverride] = process.argv.slice(2);
const authFile = join(root, '.auth', 'github.json');
const profile = { viewport: config.viewport, colorScheme: config.darkMode ? 'dark' : 'light' };

async function login() {
  const browser = await chromium.launch({ headless: false });
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const session = await browser.newContext(profile);
    await (await session.newPage()).goto('https://github.com/login');
    await prompt.question('Masuk sendiri, lalu tekan Enter. File sesi hanya disimpan lokal. ');
    mkdirSync(join(root, '.auth'), { recursive: true });
    await session.storageState({ path: authFile });
  } finally { prompt.close(); await browser.close(); }
}

async function capture(browser, id, scene, kind, ref) {
  const path = prepareTree(ref);
  const page = await browser.newPage(profile);
  const server = serve(path);
  try {
    await page.goto(`${await server.ready}${scene.path ?? '/'}`);
    await page.locator('#submit').waitFor();
    if (kind === 'after' && scene.afterAction === 'reject-future-date') {
      await page.locator('#title').fill('Taksi bandara');
      await page.locator('#amount').fill('250000');
      if (await page.locator('#category').count()) await page.locator('#category').selectOption('Travel');
      const date = page.locator('#claimDate');
      await date.waitFor();
      const today = await date.inputValue();
      const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
      await date.fill(tomorrow);
      await page.locator('#submit').click();
      await page.locator('.error').filter({ hasText: /masa depan/ }).waitFor();
    } else {
      await page.locator('#results tr').first().waitFor();
    }
    const shot = join(screenshotDir, `${id}-${kind}.png`);
    await page.screenshot({ path: shot, fullPage: true, animations: 'disabled' });
    if (id === 'S04' && kind === 'after') {
      const annotated = await page.locator('.error').boundingBox();
      if (annotated) {
        await page.locator('.error').evaluate((element) => {
          element.style.outline = '3px solid #a21caf';
          element.style.outlineOffset = '3px';
          element.style.position = 'relative';
          const label = element.ownerDocument.createElement('span');
          label.textContent = '1';
          label.style.cssText = 'position:absolute;right:4px;top:-14px;background:#a21caf;color:white;border:2px solid white;padding:0 6px;border-radius:20px;';
          element.append(label);
        });
        await page.screenshot({ path: join(screenshotDir, 'S04-after-annotated.png'), fullPage: true, animations: 'disabled' });
      }
    }
    console.log(`${id}-${kind}.png · ${git(['rev-parse', '--short', 'HEAD'], path)}`);
  } finally {
    server.stop();
    await server.closed;
    await page.close();
  }
}

async function publicIssue(browser, item) {
  const page = await browser.newPage(profile);
  try {
    const response = await page.goto(item.issue, { timeout: 12_000 });
    if (!response?.ok() || !page.url().startsWith(`${url}/issues/`)) throw new Error('Issue publik tidak tersedia di browser.');
    const body = page.getByText('Acceptance criteria', { exact: true }).first();
    await body.waitFor({ timeout: 12_000 });
    await body.locator('..').screenshot({ path: join(screenshotDir, 'S04-01-issue.png'), animations: 'disabled' });
  } finally { await page.close(); }
}

function linkedBranch(issue) {
  if (!process.env.WORKSHOP_CAPTURE_COPILOT) return undefined;
  try {
    const raw = execFileSync('gh', ['pr', 'list', '-R', repo, '--author', 'app/copilot-swe-agent',
      '--search', `"${issue}" in:body`, '--json', 'headRefName', '--limit', '1'], { encoding: 'utf8' });
    return JSON.parse(raw)[0]?.headRefName;
  } catch (error) {
    console.warn(`Tidak dapat menemukan branch PR: ${error.message}`);
    return undefined;
  }
}

function report() {
  const items = evidenceItems();
  const missing = Object.fromEntries(items.map(({ id, shots }) => [id, shots.filter((shot) => !shot.present).map((shot) => shot.name)]));
  writeFileSync(join(screenshotDir, '_missing.json'), `${JSON.stringify(missing, null, 2)}\n`);
  const row = (shot) => shot.present ? `[${shot.name}](screenshots/${shot.name})` : 'Belum di-capture';
  writeFileSync(join(root, 'docs', 'BEFORE-AFTER.md'), [
    '# Before / After workshop', '',
    'Bukti lokal S02, S04, dan S06 membandingkan baseline latihan dengan branch aplikasi bersih, bukan PR Copilot. S04 setelah menunjukkan penolakan tanggal masa depan; baseline belum mempunyai input tanggal.',
    '', '| Skenario | Before | After | Bukti langkah |', '|---|---|---|---|',
    ...items.map(({ id, title, shots, issue }) => `| [${id} — ${title}](${issue}) | ${row(shots[0])} | ${row(shots[1])} | ${shots.slice(2).filter((shot) => shot.present).map(row).join(', ') || 'Belum di-capture'} |`),
    '', 'Daftar nama bukti yang masih kurang ada di [`screenshots/_missing.json`](screenshots/_missing.json).', '',
  ].join('\n'));
}

if (target === 'login') {
  await login();
} else {
  if (target !== 'all' && !Object.hasOwn(scenarios, target)) throw new Error('Gunakan S01 sampai S15, atau all.');
  mkdirSync(screenshotDir, { recursive: true });
  const browser = await chromium.launch();
  let failures = 0;
  try {
    for (const item of evidenceItems().filter(({ id }) => target === 'all' || id === target)) {
      const after = afterOverride ?? (item.id === 'S04' ? linkedBranch(item.issue) : undefined) ?? item.after;
      for (const [kind, ref] of [['before', item.before], ['after', after]]) {
        if (!ref) continue;
        try { await capture(browser, item.id, item, kind, ref); }
        catch (error) { failures++; console.warn(`${item.id}-${kind}: ${error.message}`); }
      }
      if (item.id === 'S04' && !existsSync(join(screenshotDir, 'S04-01-issue.png'))) {
        try { await publicIssue(browser, item); }
        catch (error) { console.warn(`S04-01-issue: ${error.message}`); }
      }
    }
  } finally { await browser.close(); }
  report();
  if (failures) process.exitCode = 1;
}
