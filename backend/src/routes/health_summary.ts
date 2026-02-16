import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import pool from '../config/db'

const router = Router()
router.use(authMiddleware)

// Summary endpoint for health scores across all projects
router.get('/summary', async (_req, res) => {
  try {
    const [rows] = await (pool as any).execute(
      'SELECT AVG(total_score) AS avg_score, MAX(total_score) AS max_score, MIN(total_score) AS min_score, COUNT(*) AS count FROM projects'
    )
    res.json({ summary: rows[0] ?? { avg_score: null, max_score: null, min_score: null, count: 0 } })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch health summary' })
  }
})

export default router
