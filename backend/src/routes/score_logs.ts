import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { query, execute } from '../services/db'

// Merge parent route params so we can read parent projectId from /api/projects/:projectId/logs
const router = Router({ mergeParams: true })
router.use(authMiddleware)

type LogRecord = {
  id: number
  projectId: number
  checkpointId?: number
  action?: string
  oldScore?: number
  newScore?: number
  reason?: string
  createdAt?: Date
  operatedBy?: number
  operatedAt?: Date
}

// Persisted logs in DB table score_logs
router.get('/', async (req, res) => {
  const projectId = parseInt((req.params as any).projectId as string, 10) || 0
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid projectId' })
  }
  // ensure project exists
  const exists = await query<{ id: number }>('SELECT id FROM projects WHERE id = ?', [projectId])
  if (!exists || exists.length === 0) {
    return res.status(404).json({ error: 'Project not found' })
  }
  // pagination and optional filters
  let limit = parseInt((req.query as any).limit as string, 10) || 20
  let offset = parseInt((req.query as any).offset as string, 10) || 0
  if (limit < 1) limit = 20
  if (offset < 0) offset = 0
  const { checkpointId, action, from, to } = req.query as any
  try {
    let sql = 'SELECT id, project_id AS projectId, checkpoint_id AS checkpointId, action, old_score AS oldScore, new_score AS newScore, reason, operated_by AS operatedBy, operated_at AS operatedAt FROM score_logs WHERE project_id = ?'
    const params: any[] = [projectId]
    // Additional filters for 2b: min/max new_score (log score changes)
    const minScore = (req.query as any).minScore
    const maxScore = (req.query as any).maxScore
    if (minScore !== undefined) {
      const v = Number(minScore)
      if (!Number.isNaN(v)) { sql += ' AND new_score >= ?'; params.push(v) } else { return res.status(400).json({ error: 'Invalid minScore' }) }
    }
    if (maxScore !== undefined) {
      const v2 = Number(maxScore)
      if (!Number.isNaN(v2)) { sql += ' AND new_score <= ?'; params.push(v2) } else { return res.status(400).json({ error: 'Invalid maxScore' }) }
    }
    if (checkpointId) { const cid = Number(checkpointId); if (!Number.isNaN(cid)) { sql += ' AND checkpoint_id = ?'; params.push(cid) } else { return res.status(400).json({ error: 'Invalid checkpointId' }) } }
    if (action) { sql += ' AND action = ?'; params.push(action) }
    if (from) { const d = new Date(from); if (!isNaN(d.valueOf())) { sql += ' AND operated_at >= ?'; params.push(d) } else { return res.status(400).json({ error: 'Invalid from date' }) } }
    if (to) { const d2 = new Date(to); if (!isNaN(d2.valueOf())) { sql += ' AND operated_at <= ?'; params.push(d2) } else { return res.status(400).json({ error: 'Invalid to date' }) } }
    sql += ' ORDER BY operated_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    const rows = await query<{ id: number; projectId: number; checkpointId?: number; action?: string; oldScore?: number; newScore?: number; reason?: string; operatedBy?: number; operatedAt?: Date }>(sql, params)
    res.json({ logs: rows })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

router.post('/', async (req, res) => {
  const pid = parseInt((req.params as any).projectId as string, 10) || 0
  const { checkpointId, action, oldScore, newScore, reason } = req.body
  const operatedBy = (req as any).user?.id ?? 0
  if (Number.isNaN(pid)) {
    return res.status(400).json({ error: 'Invalid projectId' })
  }
  if (typeof checkpointId !== 'number' || (oldScore == null && newScore == null)) {
    return res.status(400).json({ error: 'Missing required fields: checkpointId and at least one score' })
  }
  const result: any = await execute(
    'INSERT INTO score_logs (project_id, checkpoint_id, action, old_score, new_score, reason, operated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [pid, checkpointId, action ?? 'update', oldScore ?? null, newScore ?? null, reason ?? null, operatedBy]
  )
  const logId = result?.insertId ?? undefined
  const log: LogRecord = {
    id: logId ?? Date.now(),
    projectId: pid,
    checkpointId,
    action: action ?? 'update',
    oldScore,
    newScore,
    reason,
    operatedBy,
    operatedAt: new Date()
  }
  res.status(201).json({ log })
})

export default router
