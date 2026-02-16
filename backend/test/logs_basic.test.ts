import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs basic create/get', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('POST /api/projects/1/logs should create log', async () => {
    const payload = { checkpointId: 1, action: 'update', oldScore: 9, newScore: 8, reason: 'test' }
    const res = await request(app).post('/api/projects/1/logs').set('Authorization', authHeader).send(payload)
    expect([201, 200]).toContain(res.status)
  })

  it('GET /api/projects/1/logs should return logs', async () => {
    const res = await request(app).get('/api/projects/1/logs').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('logs')
  })
})
