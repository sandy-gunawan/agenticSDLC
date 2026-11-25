import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';

const blocked = [
  /WORKSHOP_DEMO_BLOCK/i,
  /(?:^|[\s/\\'"])\.env(?:[.\s/\\'"]|$)/i,
  /(?:^|[\s/\\'"])\.auth(?:[\s/\\'"]|$)/i,
  /\bprintenv\b|\bGet-ChildItem\s+Env:/i,
  /\bgit\s+(?:push|reset)\b/i,
  /\b(?:rm|Remove-Item|git\s+clean)\b[^\r\n]*(?:--recursive|\s-[a-z]*r|Recurse)/i,
  /\b(?:curl|wget|Invoke-WebRequest)\b[^|]*\|\s*(?:bash|sh|iex)\b/i,
];

export function evaluate(input) {
  let event;
  try { event = JSON.parse(input); } catch { return { allowed: false, kind: 'invalid' }; }
  if (!event || typeof event.toolName !== 'string') return { allowed: false, kind: 'invalid' };
  let args = event.toolArgs;
  if (typeof args === 'string') {
    try { args = JSON.parse(args); } catch { return { allowed: false, kind: 'invalid' }; }
  }
  if (!args || typeof args !== 'object') return { allowed: false, kind: 'invalid' };
  return {
    allowed: !blocked.some((pattern) => pattern.test(JSON.stringify(args).replaceAll('\\\\', '\\').replaceAll('\\"', '"'))),
    kind: ['bash', 'powershell', 'execute'].includes(event.toolName.toLowerCase()) ? 'shell' : 'tool',
  };
}

if (process.argv[2]) {
  const phase = process.argv[2];
  if (!['session', 'pre', 'post'].includes(phase)) throw new Error('Unsupported hook phase.');
  const result = phase === 'session' ? { kind: 'session' } : evaluate(readFileSync(0, 'utf8'));
  try {
    mkdirSync('audit', { recursive: true });
    appendFileSync('audit/tools.log', `${JSON.stringify({
      at: new Date().toISOString(), phase, kind: result.kind, decision: phase === 'pre' ? (result.allowed ? 'allow' : 'deny') : undefined,
    })}\n`);
  } catch {
    process.stderr.write('Audit latihan tidak dapat ditulis.\n');
    if (phase === 'pre') result.allowed = false;
  }
  if (phase === 'pre') {
    process.stdout.write(`${JSON.stringify(result.allowed ? { permissionDecision: 'allow' }
      : { permissionDecision: 'deny', permissionDecisionReason: 'Ditolak oleh guardrail latihan; lihat audit/tools.log.' })}\n`);
  }
}
