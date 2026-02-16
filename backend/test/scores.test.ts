import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Health score API (GET/POST/PUT)', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`
  let createdScoreId: number | null = null

  it('GET /api/projects/1/scores should return 200 and scores array', async () => {
    const res = await request(app)
      .get('/api/projects/1/scores')
      .set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('scores')
  })

  it('POST /api/projects/1/scores should create a score', async () => {
    const payload = { checkpointId: 1, finalScore: 8, originalScore: 10, deductedScore: 2 }
    const res = await request(app)
      .post('/api/projects/1/scores')
      .set('Authorization', authHeader)
      .send(payload)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('score')
    createdScoreId = res.body.score?.id ?? null
  })

  it('POST /api/projects/1/scores should fail with missing fields', async () => {
    const payload = { checkpointId: 2 }
    const res = await request(app)
      .post('/api/projects/1/scores')
      .set('Authorization', authHeader)
      .send(payload)
    expect([400, 422]).toContain(res.status)
  })

  it('PUT /api/projects/1/scores/:scoreId should update the score', async () => {
    if (!createdScoreId) {
      // skip if not created
      return
    }
    const res = await request(app)
      .put(`/api/projects/1/scores/${createdScoreId}`)
      .set('Authorization', authHeader)
      .send({ finalScore: 9 })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('score')
  })
})
