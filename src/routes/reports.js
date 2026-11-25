import { Router } from 'express';
import { auditLog } from '../logger.js';
import { InputError, reportMonth, todayUtc } from '../services/validation.js';

export function reportsRouter(store, now) {
  const router = Router();
  router.get('/', (req, res) => {
    if (req.actor.role !== 'finance') throw new InputError('FINANCE_REQUIRED', 'Hanya Finance yang dapat membuka laporan.', 403);
    const month = reportMonth(req.query.month, todayUtc(now()));
    const rows = store.report(month);
    auditLog('info', 'reports.list', { month, count: rows.length });
    res.json({ month, rows });
  });
  return router;
}
