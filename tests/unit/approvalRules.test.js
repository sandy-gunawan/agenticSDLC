import { expect, it } from 'vitest';
import { nextApprovalStatus } from '../../src/services/approvalRules.js';

const manager = { id: 3, role: 'manager', department: 'Operasional' };
const claim = { employeeId: 1, department: 'Operasional', status: 'pending', amount: 1_000_000 };

it.each([[999_999, 'approved'], [1_000_000, 'pending_finance'], [1_000_001, 'pending_finance']])(
  'follows the approval policy for %s IDR',
  (amount, status) => expect(nextApprovalStatus({ ...claim, amount }, manager, 'approve')).toBe(status),
);

it('blocks self approval and refuses an unknown decision', () => {
  expect(() => nextApprovalStatus({ ...claim, employeeId: manager.id }, manager, 'approve')).toThrow('Pengaju');
  expect(() => nextApprovalStatus(claim, manager, 'retry')).toThrow('Pilih approve');
});

it('requires Finance to decide a claim that already passed manager review', () => {
  const pending = { ...claim, status: 'pending_finance' };
  expect(() => nextApprovalStatus(pending, manager, 'approve')).toThrow('menunggu persetujuan Finance');
  expect(nextApprovalStatus(pending, { id: 5, role: 'finance' }, 'reject')).toBe('rejected');
});
