import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { readJson, root } from './demo-lib.mjs';
import { evidenceItems, screenshotDir, url } from './evidence.mjs';
import { capstone, diagrams, faq, glossary } from './site-content.mjs';

const base = join(root, 'site');
mkdirSync(screenshotDir, { recursive: true });
const scenes = evidenceItems();
const metrics = readJson('docs/metrics.json');
const esc = (text = '') => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const inline = (text = '') => esc(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/(^|[^a-z])_(?= )/g, '$1');
const write = (target, value) => {
  const path = join(base, target);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
};
const json = (target, value) => write(target, `${JSON.stringify(value, null, 2)}\n`);
const steps = (items) => `<ol class="steps">${items.map((item) => `<li>${item}</li>`).join('')}</ol>`;
const cmd = (text) => `<div class="command"><pre><code>${esc(text)}</code></pre><button type="button" class="copy" hidden>Salin</button></div>`;
const pngSize = (name) => {
  const file = readFileSync(join(screenshotDir, name));
  return `width="${file.readUInt32BE(16)}" height="${file.readUInt32BE(20)}"`;
};
const fig = (shot, prefix, alt) => `<a class="zoom" href="${prefix}assets/screenshots/${esc(shot)}"><img src="${prefix}assets/screenshots/${esc(shot)}" alt="${esc(alt)}" ${pngSize(shot)} loading="lazy"></a>`;
const links = [
  ['index.html', 'Mulai'], ['scenarios/index.html', 'Skenario'], ['architecture.html', 'Arsitektur'],
  ['setup.html', 'Cara Demo'], ['capstone.html', 'Capstone'], ['governance.html', 'Kontrol'],
];

function page(path, title, lead, content, eyebrow = 'WORKSHOP / AGENTIC SDLC') {
  const prefix = path.startsWith('scenarios/') ? '../' : '';
  write(path, `<!doctype html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#101827" media="(prefers-color-scheme: dark)"><title>${esc(title)} · Workshop Agentic SDLC</title>
<link rel="stylesheet" href="${prefix}assets/workshop.css"><script defer src="${prefix}assets/vendor/chart.umd.js"></script><script defer src="${prefix}js/app.js"></script></head>
<body><a class="skip" href="#konten">Lompat ke konten</a>
<header class="top"><div class="top-inner"><a class="brand" href="${prefix}index.html"><span class="brand-icon" aria-hidden="true">A</span> Agentic SDLC</a>
<nav aria-label="Halaman workshop">${links.map(([href, label]) => `<a href="${prefix}${href}"${path === href || (href.startsWith('scenarios/') && prefix) ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></div></header>
<main id="konten" tabindex="-1"><header class="intro"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p></header>
${content}
</main><footer><div><a href="${url}">Repo GitHub</a> <span>·</span> <a href="${prefix}glossary.html">Glosarium &amp; FAQ</a> <span>·</span> <a href="${url}/blob/main/PROGRESS.md">Status verifikasi</a></div>
<p>Contoh fiktif. Aplikasi hanya untuk latihan lokal; screenshot yang belum tersedia tidak dianggap bukti.</p></footer>
<p class="visually-hidden" id="announcement" role="status"></p></body></html>`);
}

function diagram(id, prefix = '') {
  const [title, edges] = diagrams[id];
  const box = readFileSync(join(base, 'assets', 'diagrams', `${id}.svg`), 'utf8').match(/viewBox="[-.\d]+ [-.\d]+ ([.\d]+) ([.\d]+)"/);
  if (!box) throw new Error(`Diagram ${id} tidak memiliki viewBox.`);
  return `<figure class="diagram">
<img src="${prefix}assets/diagrams/${id}.svg" alt="${esc(title)}; rincian tersedia pada uraian diagram." width="${Math.ceil(Number(box[1]))}" height="${Math.ceil(Number(box[2]))}" loading="lazy">
<figcaption><span class="eyebrow">${id}</span> ${esc(title)} · <a href="${prefix}assets/diagrams/${id}.mmd">Sumber Mermaid</a></figcaption>
${id === 'D12' ? `<ol class="flow-track">${capstone.map(([number, label]) => `<li data-timeline-node="${number}"><strong>${number}</strong> ${esc(label)}</li>`).join('')}</ol>` : ''}
<details><summary>Baca alur sebagai teks</summary>${steps(edges.map(([from, action, to]) => `<strong>${esc(from)}</strong> → ${esc(action)} → <strong>${esc(to)}</strong>`))}</details>
</figure>`;
}

function chart(id, title, labels, values, type = 'bar', unit = '', caption = '') {
  const known = values.some(Number.isFinite);
  const payload = esc(JSON.stringify({ type, labels, values }));
  return `<figure class="chart"><figcaption><span class="eyebrow">${id}</span> ${esc(title)}</figcaption>
${known ? `<div class="canvas-wrap" data-chart="${payload}" hidden><canvas aria-hidden="true"></canvas></div>` : '<p class="pending">Data belum tersedia. Belum ada nilai untuk diplot.</p>'}
<dl class="chart-data">${labels.map((label, index) => `<div><dt>${esc(label)}</dt><dd>${Number.isFinite(values[index]) ? `${values[index]} ${esc(unit)}`.trim() : 'Belum diukur'}</dd></div>`).join('')}</dl>
<p class="caption">${esc(caption)}</p></figure>`;
}

function slider(scene) {
  const [before, after] = scene.shots;
  const both = before.present && after.present;
  const compare = both
    ? `<div class="compare" data-compare><div class="planes"><img src="../assets/screenshots/${before.name}" alt="" ${pngSize(before.name)} loading="lazy"><img class="after-plane" src="../assets/screenshots/${after.name}" alt="" ${pngSize(after.name)} loading="lazy"></div>
<div class="slider-controls" hidden><label for="mix">Geser tampilan Before → After</label><input id="mix" type="range" min="0" max="100" value="50" aria-describedby="compare-text"></div></div>`
    : '';
  return `${compare}<div class="grid evidence-grid" id="compare-text">
${[[before, 'Before', scene.beforeLabel], [after, 'After', scene.afterLabel]].map(([shot, name, label]) => `<figure class="evidence">
<figcaption><span class="eyebrow">${name}</span> ${esc(label)}</figcaption>
${shot.present ? fig(shot.name, '../', `${name}: ${label}`) : `<p class="pending">Belum di-capture · <code>${shot.name}</code></p>`}
</figure>`).join('')}</div>
<dl class="chart-data"><div><dt>Baseline</dt><dd>${esc(scene.beforeLabel)}</dd></div><div><dt>Target setelah latihan</dt><dd>${esc(scene.afterLabel)}</dd></div><div><dt>Verifikasi</dt><dd>${esc(scene.check)}</dd></div></dl>`;
}

const tags = (scene) => `<div class="chips"><span class="chip">Level ${scene.level}</span>${scene.people.map((person) => `<span class="chip">${esc(person)}</span>`).join('')}${scene.org ? '<span class="chip gate">Sebagian butuh org</span>' : ''}</div>`;
const sceneLink = (id, label, prefix = '') => `<a href="${prefix}scenarios/${id}.html">${esc(label)}</a>`;
const byScenario = { S04: 'D6', S09: 'D7', S10: 'D8', S11: 'D9', S12: 'D10', S13: 'D10', S14: 'D11', S15: 'D12' };
const roleCounts = [...new Set(scenes.flatMap(({ people }) => people))].map((person) => [person, scenes.filter(({ people }) => people.includes(person)).length]);
const s08 = metrics.S08.approvalCoverage;
const s10 = metrics.S10.alertCounts;

page('index.html', 'Dari issue ke keputusan merge', 'Pelajari cara membagi pekerjaan antara manusia dan agent dengan satu aplikasi klaim biaya.', `
<section class="summary panel"><h2>Mulai dengan satu klaim</h2><p>PT Nusantara Finansial (fiktif) membutuhkan alur yang mudah ditelusuri: Rani mengajukan biaya, manager memeriksa, dan Finance membaca laporan.</p>
${steps(['Tulis kriteria untuk satu perubahan: tanggal klaim.', 'Delegasikan ke Copilot agar membuat draft PR, bukan mengubah main.', 'Periksa test, perubahan UI, dan review.', 'Manusia memutuskan lanjut, revisi, atau berhenti.'])}
<a class="primary" href="scenarios/S04.html">Ikuti S04 · tanggal klaim</a></section>
${diagram('D1')}
<section><h2>Mulai dari peranmu</h2><div class="grid chapters">
${[['Dev','S01','Aturan kerja untuk agent'], ['EM / PM','S04','Issue ke draft PR'], ['QA','S08','Temukan kasus batas'], ['AppSec','S10','Baca hasil CodeQL'], ['CISO','S14','Izin, audit, biaya']].map(([persona, id, label]) => `<article class="card"><p class="eyebrow">${persona}</p><h3>${sceneLink(id, label)}</h3></article>`).join('')}
<article class="card"><p class="eyebrow">EKSEKUTIF</p><h3><a href="capstone.html">Capstone</a></h3></article></div></section>
<section><h2>Titik kontrol manusia</h2>${diagram('D2')}${chart('C1', 'Ilustrasi tingkat otonomi, bukan data hasil ukur', ['Inner loop','Delegasi','Tim virtual','Workflow','Governance'], [1,2,3,4,5], 'bar', '/ 5', 'Skala ilustrasi urutan materi. Review manusia dan izin minimum tetap berlaku pada semua level.')}</section>`);

page('scenarios/index.html', '15 skenario, lima tingkat', 'Pilih sesuai peran dan tingkat. Tanpa internet, semua halaman dan alur tetap bisa dibaca.', `
<section class="panel filters" hidden><h2>Saring skenario</h2><div class="grid compact">
<label>Tingkat<select id="level"><option value="">Semua</option>${[1,2,3,4,5].map((level) => `<option>${level}</option>`).join('')}</select></label>
<label>Persona<select id="person"><option value="">Semua</option>${roleCounts.map(([name]) => `<option>${esc(name)}</option>`).join('')}</select></label>
<label class="check"><input type="checkbox" id="org"> Memerlukan organisasi di sebagian langkah</label></div><p id="count" role="status"></p></section>
<div class="grid chapters">${scenes.map((scene) => `<article class="card" data-level="${scene.level}" data-people="${esc(scene.people.join('|'))}" data-org="${Boolean(scene.org)}"><p class="eyebrow">${scene.id} / LEVEL ${scene.level}</p><h2><a href="${scene.id}.html">${esc(scene.title)}</a></h2>${tags(scene)}</article>`).join('')}</div>
${chart('C2', 'Kemunculan persona di 15 skenario', roleCounts.map(([name]) => name), roleCounts.map(([, count]) => count), 'doughnut', 'skenario', 'Dihitung dari peta skenario. Satu skenario bisa memiliki lebih dari satu persona.')}`);

for (const [index, scene] of scenes.entries()) {
  const previous = scenes[index - 1];
  const next = scenes[index + 1];
  const sample = scene.id === 'S04' ? '<p class="caption">1. Perhatikan pesan di atas form. Kotak dan nomor menandai hasil dari API.</p>' : '';
  const annotated = scene.id === 'S04' && existsSync(join(screenshotDir, 'S04-after-annotated.png'))
    ? `<figure class="evidence">${fig('S04-after-annotated.png', '../', 'Sorotan 1: API menolak tanggal klaim masa depan.')}${sample}</figure>` : '';
  const sourceIssue = scene.id === 'S07' ? 'S07a' : scene.id;
  page(`scenarios/${scene.id}.html`, scene.title, scene.check, `
${tags(scene)}<p class="caption">Durasi ${esc(scene.minutes)} · estimasi latihan</p>
<fieldset class="audience" hidden><legend>Sudut pandang</legend><label><input type="radio" name="audience" value="all" checked> Semua</label><label><input type="radio" name="audience" value="business"> Bisnis</label><label><input type="radio" name="audience" value="technical"> Teknis</label></fieldset>
<section data-audience="business"><h2>Cerita tim</h2><p>${inline(scene.narrative.story)}</p><aside class="callout"><strong>Kerugian</strong><p>${inline(scene.narrative.cost)}</p><p class="caption">Angka dalam cerita adalah ilustrasi, bukan hasil dry-run.</p></aside></section>
<section data-audience="technical"><h2>Yang disiapkan di repo</h2><p>${inline(scene.narrative.seed)}</p><details><summary>Lihat file dan kontrak</summary><p><a href="${url}/blob/main/${encodeURI(scene.file)}"><code>${esc(scene.file)}</code></a></p><p>${esc(scene.beforeLabel)} → ${esc(scene.afterLabel)}</p></details></section>
<section><h2>Pilihan solusi</h2><p>${inline(scene.narrative.solution)}</p>
${byScenario[scene.id] ? diagram(byScenario[scene.id], '../') : steps([`<strong>${esc(scene.people[0])}</strong> menyiapkan konteks.`, `Agent mengerjakan latihan ${scene.id}.`, `Manusia memeriksa: ${esc(scene.check)}`])}</section>
<section data-audience="technical"><h2>Langkah demo</h2>${steps([`Baca <a href="${scene.issue}">issue latihan</a> dan kriteria selesai.`, `Gunakan prompt atau perintah berikut.<span class="visually-hidden"> Prompt atau perintah</span>${cmd(scene.command)}`, `Periksa hasil: ${esc(scene.check)}`])}
<p><a href="${url}/blob/main/agentic-sdlc-workshop-docs/RUNBOOK.md">Runbook presenter</a> · <a href="${url}/blob/main/issues/${sourceIssue}.md">Template issue</a></p></section>
<section><h2>Before / After</h2>${slider(scene)}${annotated}
${scene.id === 'S08' ? chart('C3', 'Coverage approvalRules.js', ['Before', 'After'], [s08.before,s08.after], 'bar', '% baris', s08.source) : ''}
${scene.id === 'S10' ? chart('C4', 'Alert terbuka sebelum dan sesudah', ['Before', 'After'], [s10.before,s10.after], 'bar', 'alert', 'Fixture keamanan bukan alert dan tidak masuk hitungan.') : ''}</section>
<section data-audience="business"><h2>Manfaat untuk tim</h2><ul><li>${inline(scene.narrative.advantage)}</li></ul></section>
<section><h2>Bukti yang bisa diperiksa</h2><ul><li><a href="${scene.issue}">Issue GitHub · ${scene.id}</a></li>${scene.id === 'S07' ? `<li><a href="${url}/issues/8">Issue tahap migrasi</a></li>` : ''}
${scene.shots.slice(2).map(({ name, present }) => `<li>${present ? `<a class="zoom" href="../assets/screenshots/${name}">${name}</a>` : `<code>${name}</code> · belum di-capture`}</li>`).join('')}</ul>
<p class="caption">${['S02', 'S04', 'S06'].includes(scene.id) ? 'Screenshot aplikasi adalah perbandingan dua branch lokal, bukan bukti output dari Copilot cloud.' : 'Screenshot dan metrik yang tidak tersedia tidak dianggap sebagai hasil live.'}</p></section>
<section data-audience="technical"><h2>Ulangi latihan</h2><p>Jalankan dari root repo latihan. Reset hanya menyentuh worktree lokal yang bersih.</p>${cmd('npm run reset')}</section>
<nav class="step-nav" aria-label="Skenario terkait">${previous ? `<a href="${previous.id}.html">← ${previous.id}</a>` : ''}<a href="../capstone.html">Capstone</a>${next ? `<a href="${next.id}.html">${next.id} →</a>` : ''}</nav>`, `${scene.id} / SKENARIO`);
}

page('architecture.html', 'Siapa mengerjakan apa?', 'Pisahkan request aplikasi, pipeline GitHub, dan keputusan manusia.', `
<section><h2>Satu request: Taksi bandara</h2>${diagram('D3')}
${steps(['Browser mengirim judul Taksi bandara dan IDR 250.000 ke <code>POST /claims</code>, dengan ID akun latihan.', 'Express mengecek akses karyawan dan jumlah. Baseline mencatat hari UTC saat input. Pada hasil latihan S04, tanggal masa depan berhenti di API dengan HTTP 400 dan tidak mencapai SQLite.', 'Jika valid, SQLite menyimpan klaim <code>pending</code>. Browser membaca tampilan terbaru dan menampilkan bahwa klaim menunggu manager.'])}
<p><a href="${url}/blob/main/docs/api.md">Kontrak API</a> · <a href="${url}/blob/main/src/server.js">Bootstrap Express</a></p></section>
<section><h2>Alur agentic</h2>${diagram('D4')}<p>CI dan CodeQL berjalan terpisah dari lalu lintas aplikasi. Billing dan audit juga bukan bagian dari transaksi SQLite.</p></section>
<section><h2>Peta file .github/</h2>${diagram('D5')}<dl class="chart-data">
${[['copilot-instructions.md','Konvensi kode dan test.'], ['agents/*.agent.md','Profil tujuh spesialis.'], ['skills/new-endpoint/SKILL.md','Prosedur menambah endpoint.'], ['hooks/guardrails.json','Contoh allow/deny dan audit metadata.'], ['workflows/ci.yml','Lint, test dua timezone, dan browser.'], ['workflows/copilot-setup-steps.yml','Persiapan runner coding agent.'], ['workflows/*.lock.yml','Workflow AI yang sudah dikompilasi.'], ['workflows/pages.yml','Publikasi situs statis, bukan server Express.']].map(([file, note]) => `<div><dt><code>${file}</code></dt><dd>${note}</dd></div>`).join('')}</dl></section>`);

page('setup.html', 'Cara demo', 'Siapkan satu repo latihan, satu browser, dan bukti yang bisa diperiksa.', `
<section><h2>Personal atau organisasi?</h2>${diagram('D13')}<p>Gunakan <a href="${url}">full</a> untuk presenter dan <a href="https://github.com/sandy-gunawan/expense-app-bare">bare</a> untuk peserta. Aktifkan Jira/Teams atau dashboard organisasi hanya di tenant yang mengizinkan.</p></section>
<section class="panel"><h2>Persiapan lokal</h2>${steps([`Clone repo dan pasang dependensi. Node 20 dipakai khusus untuk lab (bukan produksi).${cmd(`git clone ${url}.git\ncd agenticSDLC\nnpm ci\nnpx playwright install chromium`)}`, `Ambil tag dan jalankan baseline. Buka <a href="http://127.0.0.1:3000">localhost:3000</a>.${cmd('git fetch origin --tags\nnpm run demo:before')}`, `Verifikasi contoh sebelum presentasi.${cmd('npm run shots -- S04')}`])}</section>
<section><h2>Periksa GitHub sebelum sesi</h2><ul><li>Pastikan Actions dapat menjalankan jobs, Copilot tersedia, dan issue S04 terlihat.</li><li>Periksa draft PR stok, penegakan review, dan CodeQL di tab Security.</li><li>Untuk gh-aw, pemilik simpan secret <code>COPILOT_GITHUB_TOKEN</code> sesuai dokumentasi resmi; set <code>WORKSHOP_AI_ENABLED=true</code> hanya saat latihan. Jangan tempel token ke terminal yang dicatat.</li><li>Ambil screenshot GitHub/VS Code hanya dari sesi berizin. Gunakan bukti lokal bila runner belum tersedia.</li></ul>
<p><a href="https://github.github.com/gh-aw/reference/auth/">Referensi autentikasi gh-aw</a> · <a href="${url}/blob/main/agentic-sdlc-workshop-docs/RUNBOOK.md">Runbook semua skenario</a></p></section>
<section><h2>Reset tanpa mengubah GitHub</h2>${cmd('npm run reset')}<p>Hentikan server demo dari terminalnya dulu. Jika ada perubahan di worktree, pindahkan atau simpan perubahan sebelum membersihkannya. Tidak ada force-push.</p></section>`);

page('capstone.html', 'Capstone: klaim multi-currency', 'Ikuti epik IDR, USD, dan SGD dari issue sampai manusia siap memutuskan merge.', `
${diagram('D12')}
<section data-timeline><h2>Delapan tahap</h2><ol class="timeline">${capstone.map(([number, title, who, task, shot]) => `<li><button type="button" class="stage" data-stage="${number}" aria-controls="stage-${number}" hidden><span>${number}.</span> ${esc(title)}</button><article id="stage-${number}"><h3>${esc(title)}</h3><p class="eyebrow">${esc(who)}</p><p>${esc(task)}</p>${existsSync(join(screenshotDir, shot)) ? fig(shot, '', title) : `<p class="pending">Belum di-capture · <code>${shot}</code></p>`}</article></li>`).join('')}</ol></section>
${chart('C5', 'Waktu per tahap: cara lama (ilustrasi) vs agentic (belum diukur)', ['Rencana','Build','Test dan review','Rilis'], [null,null,null,null], 'bar', 'menit', 'Belum ada data tahap yang terukur. Durasi talk track bukan hasil pengukuran proses.')}`);

page('governance.html', 'Jaga izin, audit, dan biaya', 'Kontrol bukan hanya instruksi di prompt. Gunakan izin minimum dan tunjukkan siapa yang dapat menyetujui perubahan.', `
${diagram('D11')}
<section class="panel"><h2>Buktikan keputusan, bukan isi rahasia</h2><p>Fixture <code>WORKSHOP_DEMO_BLOCK</code> menguji penolakan. Periksa <code>audit/tools.log</code>: keputusan, waktu, dan jenis tool. Hook latihan tidak menggantikan sandbox atau aturan organisasi.</p>${cmd('npm test -- tests/unit/guard.test.js')}</section>
<section><h2>Contoh biaya yang bisa dicek</h2><p><strong>Ilustrasi:</strong> 3 run docs-sync × batas konfigurasi 2 AI credits per run = batas rencana 6 AI credits. Ini bukan pengukuran pemakaian atau konversi ke rupiah. Harga bergantung paket dan billing akun; tarif dalam mata uang akun belum diverifikasi.</p>
<p class="caption">Sumber angka ilustrasi: <a href="${url}/blob/main/.github/workflows/docs-sync.md">batas di konfigurasi</a>. Referensi tarif dan satuan: <a href="https://docs.github.com/en/billing/concepts/product-billing/github-copilot">GitHub Copilot billing</a>. Catatan workshop: November 2026.</p>
${chart('C6', 'AI credits per dry-run', ['S04','S14','S15'], ['S04','S14','S15'].map((id) => metrics[id].runs.at(-1)?.aiCredits ?? null), 'line', 'AI credits', 'Catat angka dari dashboard yang berizin. Data yang tidak ada bukan nol.')}</section>`);

page('glossary.html', 'Glosarium & FAQ', 'Istilah yang diperlukan untuk mengikuti workshop, dan jawaban untuk PM, dev, serta CISO.', `
<section><h2>Glosarium</h2><dl class="chart-data">${glossary.map(([name, text]) => `<div><dt>${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></section>
<section><h2>Pertanyaan umum</h2>${faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</section>`);

for (const scene of scenes) {
  for (const { name, present } of scene.shots) {
    if (!present) continue;
    mkdirSync(join(base, 'assets', 'screenshots'), { recursive: true });
    copyFileSync(join(screenshotDir, name), join(base, 'assets', 'screenshots', name));
  }
}
if (existsSync(join(screenshotDir, 'S04-after-annotated.png'))) {
  copyFileSync(join(screenshotDir, 'S04-after-annotated.png'), join(base, 'assets', 'screenshots', 'S04-after-annotated.png'));
}
json('assets/data/scenarios.json', scenes);
json('assets/data/metrics.json', metrics);
write('.nojekyll', '');
if (!existsSync(join(base, 'assets', 'vendor', 'chart.umd.js'))) {
  throw new Error('Chart.js lokal belum tersedia di site/assets/vendor.');
}
for (const id of Object.keys(diagrams)) {
  const svg = join(base, 'assets', 'diagrams', `${id}.svg`);
  if (!existsSync(svg) || !readFileSync(svg, 'utf8').startsWith('<svg')) throw new Error(`SVG ${id} belum dirender.`);
}
console.log(`Situs: ${scenes.length} skenario dan ${Object.keys(diagrams).length} diagram.`);
