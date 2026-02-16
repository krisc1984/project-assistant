import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs more filters', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/projects/1/logs with checkpointId + from date', async () => {
    const res = await request(app).get('/api/projects/1/logs?checkpointId=1&from=2000-01-01&to=2100-01-01').set('Authorization', authHeader)
    expect([200, 304]).toContain(res.status)
  })
})
