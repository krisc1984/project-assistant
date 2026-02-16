import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { query, execute } from '../services/db'

const router = Router()

// Authenticate users (no explicit permission checks per Phase 2)
// router.use(authMiddleware)

type ProjectRow = {
  id: number
  projectNo: string
  name: string
  currentStage: string
  totalScore: number
  status: string
}

// In-memory sample data as fallback until DB is wired
const sampleProjects: ProjectRow[] = [
  { id: 1, projectNo: 'PRJ-2026-001', name: '智能双录健康度系统', currentStage: '远程开发', totalScore: 85, status: 'in_progress' },
  { id: 2, projectNo: 'PRJ-2026-002', name: '数据治理平台', currentStage: '项目测试', totalScore: 78, status: 'in_progress' }
]

router.get('/', async (req, res) => {
  const rows = await query<{ id: number; projectNo: string; name: string; currentStage: string; totalScore: number; status: string }>(
    'SELECT id, project_no AS projectNo, name, current_stage AS currentStage, total_score AS totalScore, status FROM projects',
    []
  )
  res.json({ projects: rows })
})

// Get project by id
router.get('/:id', async (req, res) => {
  const pid = parseInt(req.params.id, 10)
  const row = await query<{ id: number; projectNo: string; name: string; currentStage: string; totalScore: number; status: string }>(
    'SELECT id, project_no AS projectNo, name, current_stage AS currentStage, total_score AS totalScore, status FROM projects WHERE id = ?',
    [pid]
  )
  if (!row || row.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ project: row[0] })
})

router.post('/', async (req, res) => {
  // Simple create; in real app, validate and insert into DB
  const { projectNo, name } = req.body
  const result = await execute(
    'INSERT INTO projects (project_no, name, current_stage, total_score, status) VALUES (?, ?, ?, ?, ?)',
    [projectNo ?? `PRJ-${Date.now()}`, name ?? '新建项目', '需求分析', 100, 'draft']
  )
  const insertedId = result?.insertId ?? 0
  const newProject = {
    id: insertedId,
    projectNo: projectNo ?? `PRJ-${Date.now()}`,
    name: name ?? '新建项目',
    currentStage: '需求分析',
    totalScore: 100,
    status: 'draft'
  }
  res.status(201).json({ project: newProject })
})

export default router
