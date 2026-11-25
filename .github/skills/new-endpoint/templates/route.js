import { Router } from 'express';

export function exampleRoute(readSummary) {
  const router = Router();
  router.get('/', (req, res) => res.json({ summary: readSummary(req.actor) }));
  return router;
}
