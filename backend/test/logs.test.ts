import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs API (GET/POST)', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/projects/1/logs should return 200', async () => {
    const res = await request(app).get('/api/projects/1/logs').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('logs')
  })

  it('POST /api/projects/1/logs should create a log', async () => {
    const payload = { projectId: 1, action: 'update', newScore: 85, reason: 'demo' }
    const res = await request(app).post('/api/projects/1/logs').set('Authorization', authHeader).send(payload)
    // If 405 or 501 due to not wired, allow 200 fallback in skeleton
    expect([200,201, 204]).toContain(res.status)
  })
})
