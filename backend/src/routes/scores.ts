import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { query, queryOne, execute, withTransaction } from '../services/db'

const router = Router()
router.use(authMiddleware)

type ScoreRecord = {
  id: number
  projectId: number
  checkpointId: number
  originalScore: number
  deductedScore: number
  finalScore: number
  scoredAt: Date
  scoredBy: number
}

// DB-backed storage (initialized empty until seeded)

router.get('/:projectId', async (req, res) => {
  const pid = parseInt(req.params.projectId, 10)
  if (Number.isNaN(pid)) {
    return res.status(400).json({ error: 'Invalid projectId' })
  }
  // verify project exists
  const exists = await query<{ id: number }>('SELECT id FROM projects WHERE id = ?', [pid])
  if (!exists || exists.length === 0) return res.status(404).json({ error: 'Project not found' })
  try {
    const rows = await query<ScoreRecord>(
    `SELECT id, project_id AS projectId, checkpoint_id AS checkpointId, original_score AS originalScore, deducted_score AS deductedScore, final_score AS finalScore, scored_at AS scoredAt, scored_by AS scoredBy FROM project_scores WHERE project_id = ?`,
    [pid]
    )
    res.json({ scores: rows })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch scores' })
  }
})

router.post('/:projectId', async (req, res) => {
  const pid = parseInt(req.params.projectId, 10)
  if (Number.isNaN(pid)) {
    return res.status(400).json({ error: 'Invalid projectId' })
  }
  const { checkpointId, originalScore, deductedScore, finalScore } = req.body
  if (Number.isNaN(pid)) {
    return res.status(400).json({ error: 'Invalid projectId' })
  }
  if (typeof checkpointId !== 'number' || (originalScore == null && finalScore == null)) {
    return res.status(400).json({ error: 'Missing required fields: checkpointId and at least one score (originalScore or finalScore)' })
  }
  try {
    const result: any = await withTransaction(async (conn: any) => {
    const [r]: any = await conn.execute('INSERT INTO project_scores (project_id, checkpoint_id, original_score, deducted_score, final_score, scored_by) VALUES (?, ?, ?, ?, ?, ?)', [pid, checkpointId, originalScore ?? finalScore, deductedScore ?? 0, finalScore ?? originalScore, req.user?.id ?? 0])
    return r
    
    })
    const insertId = result?.insertId ?? undefined
    const score: ScoreRecord = {
    id: insertId ?? Date.now(),
    projectId: pid,
    checkpointId,
    originalScore: originalScore ?? finalScore ?? 0,
    deductedScore: deductedScore ?? 0,
    finalScore: finalScore ?? originalScore ?? 0,
    scoredAt: new Date(),
    scoredBy: req.user?.id ?? 0
  }
  res.status(201).json({ score })
  } catch (e) {
    res.status(500).json({ error: 'Failed to create score' })
  }
})

router.put('/:projectId/:scoreId', async (req, res) => {
  const pid = parseInt(req.params.projectId, 10)
  const sid = parseInt(req.params.scoreId, 10)
  if (Number.isNaN(pid) || Number.isNaN(sid)) {
    return res.status(400).json({ error: 'Invalid IDs' })
  }
  try {
  // Update in DB with logs in a transaction
  const { originalScore, deductedScore, finalScore, checkpointId } = req.body
  const existing = await query<{ id: number; checkpointId?: number; originalScore?: number; finalScore?: number; deductedScore?: number }>('SELECT id AS id, checkpoint_id AS checkpointId, original_score AS originalScore, final_score AS finalScore, deducted_score AS deductedScore FROM project_scores WHERE id = ? AND project_id = ?', [sid, pid])
  if (!existing || existing.length === 0) return res.status(404).json({ error: 'Score not found' })
  const cur = existing[0]
  const newOriginal = originalScore ?? cur.originalScore ?? 0
  const newFinal = finalScore ?? cur.finalScore ?? 0
  const newDeducted = deductedScore ?? cur.deductedScore ?? 0
  const cpId = checkpointId ?? cur.checkpointId ?? null

  await withTransaction(async (conn: any) => {
    await conn.execute('UPDATE project_scores SET original_score = ?, deducted_score = ?, final_score = ? WHERE id = ? AND project_id = ?', [newOriginal, newDeducted, newFinal, sid, pid])
    const oldScore = cur.originalScore ?? 0
    const newScoreForLog = newFinal
    await conn.execute(
      'INSERT INTO score_logs (project_id, checkpoint_id, action, old_score, new_score, reason, operated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [pid, cpId, 'update', oldScore, newScoreForLog, req.body.reason ?? null, req.user?.id ?? 0]
    )
  })

  const updated = { id: sid, projectId: pid, checkpointId: cpId, originalScore: newOriginal, deductedScore: newDeducted, finalScore: newFinal, scoredAt: new Date(), scoredBy: req.user?.id ?? 0 }
  res.json({ score: updated })
  } catch (e) {
    res.status(500).json({ error: 'Failed to update score' })
  }
})

export default router
