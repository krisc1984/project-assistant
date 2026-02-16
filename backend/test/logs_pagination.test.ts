import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs pagination', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/projects/1/logs with pagination', async () => {
    const res = await request(app).get('/api/projects/1/logs').set('Authorization', authHeader).query({ limit: 5, offset: 0 })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('logs')
  })
})
