import { execFileSync, spawn } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const worktrees = join(root, '.worktrees');
export const readJson = (file) => JSON.parse(readFileSync(join(root, file), 'utf8'));
export const config = readJson('scripts/demo.config.json');
export const repo = `${config.owner}/${config.repo}`;

export function git(args, cwd = root) {
  return execFileSync('git', ['--no-pager', ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function worktreeList() {
  return git(['worktree', 'list', '--porcelain', '-z']).split('\0')
    .filter((flag) => flag.startsWith('worktree ')).map((flag) => resolve(flag.slice(9)));
}

function runNpm(args, cwd) {
  if (process.env.npm_execpath) {
    execFileSync(process.execPath, [process.env.npm_execpath, ...args], { cwd, stdio: 'inherit' });
  } else if (process.platform === 'win32') {
    execFileSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/c', 'npm.cmd ci --no-audit --no-fund'], { cwd, stdio: 'inherit' });
  } else {
    execFileSync('npm', args, { cwd, stdio: 'inherit' });
  }
}

export function prepareTree(ref) {
  if (!/^[\w][\w./-]*$/.test(ref) || ref.includes('..')) throw new Error('Gunakan nama branch, tag, atau SHA Git yang valid.');
  const candidates = [ref, `refs/remotes/origin/${ref}`];
  const sha = candidates.map((name) => {
    try { return git(['rev-parse', '--verify', '--end-of-options', `${name}^{commit}`]); }
    catch (error) {
      if (error.status !== 128) throw error;
      return null;
    }
  }).find(Boolean);
  if (!sha) throw new Error(`Ref ${ref} tidak ditemukan. Jalankan git fetch origin --tags.`);
  mkdirSync(worktrees, { recursive: true });
  if (lstatSync(worktrees).isSymbolicLink()) throw new Error('.worktrees tidak boleh berupa symlink.');
  const path = join(worktrees, `demo-${sha.slice(0, 12)}`);
  if (!existsSync(path)) git(['worktree', 'add', '--detach', path, sha]);
  if (lstatSync(path).isSymbolicLink() || !worktreeList().includes(path) ||
      git(['rev-parse', 'HEAD'], path) !== sha || git(['status', '--porcelain'], path)) {
    throw new Error(`Worktree ${relative(root, path)} berisi perubahan atau bukan checkout demo yang benar.`);
  }
  const stamp = join(path, 'node_modules', '.workshop-node');
  if (!existsSync(stamp) || readFileSync(stamp, 'utf8') !== process.version) {
    runNpm(['ci', '--no-audit', '--no-fund'], path);
    writeFileSync(stamp, process.version);
  }
  return path;
}

export function serve(path, port = 0) {
  const output = [];
  const proc = spawn(process.execPath, ['src/server.js'], {
    cwd: path, env: { ...process.env, PORT: String(port), DB_FILE: ':memory:' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const closed = new Promise((done) => proc.once('close', done));
  proc.stderr.on('data', (data) => output.push(String(data)));
  const stream = createInterface({ input: proc.stdout });
  const ready = new Promise((done, reject) => {
    const timer = setTimeout(() => { proc.kill(); reject(new Error('Server demo tidak siap.')); }, 12_000);
    proc.once('error', (error) => { clearTimeout(timer); reject(error); });
    proc.once('close', (code) => {
      clearTimeout(timer);
      reject(new Error(`Server demo berhenti (${code}): ${output.slice(-3).join('')}`));
    });
    stream.on('line', (line) => {
      if (!line.startsWith('{')) return;
      const event = JSON.parse(line);
      if (event.event === 'server.started') {
        clearTimeout(timer);
        done(`http://127.0.0.1:${event.port}`);
      }
    });
  });
  return { ready, closed, stop: () => proc.kill() };
}
