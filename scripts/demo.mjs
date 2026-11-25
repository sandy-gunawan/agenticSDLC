import { prepareTree, config, root, worktrees, worktreeList, git } from './demo-lib.mjs';
import { basename, dirname } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { chromium } from 'playwright';

const [action, branch] = process.argv.slice(2);
if (action === 'reset') {
  const paths = worktreeList().filter((path) => dirname(path) === worktrees && /^demo-[a-z\d]{12}$/.test(basename(path)));
  const confirm = createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (paths.length && (await confirm.question(`Hapus ${paths.length} worktree latihan yang bersih? Ketik RESET: `)) === 'RESET') {
      for (const path of paths) {
        if (git(['status', '--porcelain'], path)) throw new Error(`Worktree berubah; tidak dihapus: ${path}`);
        git(['worktree', 'remove', path], root);
      }
    }
    console.log(`Mulai ulang dengan npm run demo:before (${config.baseBranch}). GitHub tidak diubah.`);
  } finally { confirm.close(); }
} else if (action === 'stop') {
  console.log('Tekan Ctrl+C di terminal demo yang berjalan. Skrip tidak menghentikan proses lain berdasarkan port.');
} else {
  const refs = {
    before: [[config.baseBranch, config.beforePort]],
    after: [[branch, config.afterPort]],
    compare: [[config.baseBranch, config.beforePort], [branch, config.afterPort]],
  }[action];
  if (!refs || refs.some(([ref]) => !ref)) throw new Error('Penggunaan: demo before | after <ref> | compare <ref> | stop | reset.');
  const { serve } = await import('./demo-lib.mjs');
  const servers = [];
  let browser;
  const stop = () => servers.forEach((server) => server.stop());
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  try {
    const urls = [];
    for (const [ref, port] of refs) {
      const server = serve(prepareTree(ref), port);
      servers.push(server);
      urls.push(await server.ready);
    }
    console.log(urls.join('\n'));
    if (action === 'compare') {
      browser = await chromium.launch({ headless: false });
      for (const url of urls) await (await browser.newPage()).goto(url);
    }
    await Promise.race(servers.map((server) => server.closed));
  } finally {
    stop();
    await browser?.close();
  }
}
