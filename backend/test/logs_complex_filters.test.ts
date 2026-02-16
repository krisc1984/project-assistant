import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs complex filters', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/projects/1/logs with multiple filters', async () => {
    const res = await request(app).get('/api/projects/1/logs?limit=10&offset=0&checkpointId=1&action=update&from=2000-01-01T00:00:00Z&to=2100-01-01T00:00:00Z').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('logs')
  })
})
