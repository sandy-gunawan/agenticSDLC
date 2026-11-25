export function readOwnSummary(store, actor) {
  return { claimCount: store.listClaims(actor).length };
}
