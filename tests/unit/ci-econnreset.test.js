import { it } from 'vitest';

it('emits the workshop ECONNRESET fixture without using the network', () => {
  const failure = new Error('ECONNRESET sintetis: fixture S13, bukan koneksi nyata.');
  failure.code = 'ECONNRESET';
  throw failure;
});
