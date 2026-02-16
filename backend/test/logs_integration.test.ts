import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs integration', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/projects/1/logs with limit', async () => {
    const res = await request(app).get('/api/projects/1/logs?limit=5&offset=0').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('logs')
  })
})
