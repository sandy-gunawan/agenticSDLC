import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const hook = (args) => spawnSync(process.execPath, ['scripts/hooks/policy.mjs', 'pre'], {
  input: JSON.stringify({ toolName: 'bash', toolArgs: JSON.stringify(args) }),
  encoding: 'utf8',
});

it('allows a benign request and denies an inert policy fixture without echoing its arguments', () => {
  expect(JSON.parse(hook({ command: 'git status' }).stdout)).toEqual({ permissionDecision: 'allow' });
  const denied = hook({ command: 'WORKSHOP_DEMO_BLOCK' });
  expect(JSON.parse(denied.stdout).permissionDecision).toBe('deny');
  expect(denied.stdout).not.toContain('WORKSHOP_DEMO_BLOCK');
});
