import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { root } from './demo-lib.mjs';

const base = join(root, 'site');
const local = (file) => pathToFileURL(join(base, file)).href;
const pages = [
  ...readdirSync(base).filter((name) => name.endsWith('.html')),
  ...readdirSync(join(base, 'scenarios')).filter((name) => name.endsWith('.html')).map((name) => join('scenarios', name)),
];
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ offline: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const failed = [];
  page.on('pageerror', (error) => failed.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') failed.push(message.text()); });
  page.on('request', (req) => { if (/^https?:/.test(req.url())) failed.push(`Request eksternal: ${req.url()}`); });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: width === 390 ? 'dark' : 'light' });
    for (const file of pages) {
      await page.goto(local(file));
      assert.equal(await page.locator('h1').count(), 1, file);
      assert.ok(await page.locator('main').isVisible(), file);
      assert.ok(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth), `Overflow: ${file} at ${width}px`);
      if (width === 1440) {
        const refs = await page.locator('a[href], img[src], script[src], link[href]').evaluateAll((nodes) =>
          nodes.map((node) => node.href || node.src).filter((href) => href.startsWith('file:')));
        for (const ref of refs) assert.ok(existsSync(fileURLToPath(ref)), `Tautan putus: ${ref}`);
      }
    }
  }
  await page.goto(local('scenarios/index.html'));
  await page.locator('#level').selectOption('2');
  await page.locator('#org').check();
  assert.equal(await page.locator('#count').textContent(), '1 dari 15 skenario');
  await page.goto(local('scenarios/S04.html'));
  await page.getByLabel('Bisnis', { exact: true }).check();
  assert.equal(await page.getByRole('heading', { name: 'Langkah demo' }).count(), 0);
  await page.getByLabel('Semua', { exact: true }).check();
  await page.locator('#mix').focus();
  await page.keyboard.press('End');
  assert.equal(await page.locator('#mix').getAttribute('aria-valuetext'), '100% bagian After');
  await page.locator('a.zoom').first().focus();
  await page.keyboard.press('Enter');
  assert.ok(await page.getByRole('dialog').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.getByRole('button', { name: 'Salin' }).first().click();
  await page.waitForFunction(() => /Disalin|Teks dipilih/.test(globalThis.document.querySelector('#announcement').textContent));
  assert.match(await page.locator('#announcement').textContent(), /Disalin|Teks dipilih/);
  await page.goto(local('capstone.html'));
  await page.getByRole('button', { name: /Setujui desain/ }).click();
  assert.ok(await page.locator('#stage-2').isVisible());
  assert.ok(await page.locator('[data-timeline-node="2"]').evaluate((node) => node.classList.contains('current')));
  const noJavaScript = await browser.newPage({ javaScriptEnabled: false, offline: true, viewport: { width: 390, height: 900 } });
  await noJavaScript.goto(local('scenarios/S04.html'));
  assert.ok(await noJavaScript.getByRole('heading', { name: 'Langkah demo' }).isVisible());
  assert.ok(await noJavaScript.getByRole('img', { name: /^After:/ }).isVisible());
  await noJavaScript.close();
  assert.deepEqual(failed, []);
} finally {
  await browser.close();
}
console.log(`${pages.length} halaman offline × 4 viewport; filter, toggle, slider, dialog, copy, timeline, dan versi tanpa JS lulus.`);
