import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Scores edge cases', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/projects/0/scores should 400 or 404', async () => {
    const res = await request(app).get('/api/projects/0/scores').set('Authorization', authHeader)
    expect([400, 404]).toContain(res.status)
  })

  it('POST /api/projects/9999/scores with missing fields should 400', async () => {
    const res = await request(app).post('/api/projects/9999/scores').set('Authorization', authHeader).send({ checkpointId: 1 })
    expect(res.status).toBe(400)
  })
})
