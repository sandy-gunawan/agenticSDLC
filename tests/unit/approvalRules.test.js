import { expect, it } from 'vitest';
import { nextApprovalStatus } from '../../src/services/approvalRules.js';

const manager = { id: 3, role: 'manager', department: 'Operasional' };
const initial = { employeeId: 1, department: 'Operasional', status: 'pending' };

it.each([[999_999, 'approved'], [1_000_000, 'pending_finance'], [1_000_001, 'pending_finance']])(
  'uses the correct approval path at %s IDR', (amount, status) => {
    expect(nextApprovalStatus({ ...initial, amount }, manager, 'approve')).toBe(status);
  },
);

it('allows Finance to complete the second approval', () => {
  expect(nextApprovalStatus({ ...initial, status: 'pending_finance' }, { id: 5, role: 'finance' }, 'approve')).toBe('approved');
});

it('forbids self approval', () => {
  expect(() => nextApprovalStatus(initial, { ...manager, id: 1 }, 'approve')).toThrow('Pengaju tidak boleh');
});
