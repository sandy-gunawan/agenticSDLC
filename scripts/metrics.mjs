import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, readJson } from './demo-lib.mjs';

const [id, action] = process.argv.slice(2);
if (!/^S(0[1-9]|1[0-5])$/.test(id ?? '') || !['start', 'stop'].includes(action)) {
  throw new Error('Penggunaan: npm run metrics -- SNN start|stop');
}
const path = 'docs/metrics.json';
const metrics = readJson(path);
const entry = metrics[id] ??= {};
const runs = entry.runs ??= [];
const now = new Date();
const current = runs.at(-1);
if (action === 'start') {
  if (current && !current.stoppedAt) throw new Error('Masih ada sesi aktif. Jalankan stop dahulu.');
  runs.push({ date: now.toISOString().slice(0, 10), startedAt: now.toISOString(), aiCredits: null });
} else {
  if (!current || current.stoppedAt) throw new Error('Sesi aktif tidak ditemukan.');
  current.stoppedAt = now.toISOString();
  current.sessionMinutes = Math.round(((now - Date.parse(current.startedAt)) / 60000) * 100) / 100;
}
writeFileSync(join(root, path), `${JSON.stringify(metrics, null, 2)}\n`);
console.log(`Metrik ${id} disimpan. Isi credit dari dashboard, bukan estimasi skrip.`);
