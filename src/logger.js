export function auditLog(level, event, fields = {}) {
  const record = { level, event, at: new Date().toISOString(), ...fields };
  (level === 'error' ? process.stderr : process.stdout).write(`${JSON.stringify(record)}\n`);
}
