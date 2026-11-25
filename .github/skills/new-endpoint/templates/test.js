import { expect, it } from 'vitest';
import { readOwnSummary } from './service.js';

it('counts only the claims visible to the selected actor', () => {
  const actor = { id: 1 };
  const store = { listClaims: (user) => user.id === actor.id ? [{ id: 8 }] : [] };
  expect(readOwnSummary(store, actor)).toEqual({ claimCount: 1 });
});
