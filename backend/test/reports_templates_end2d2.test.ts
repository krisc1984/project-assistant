import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Reports templates end2d-2', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET /api/reports/templates should respond', async () => {
    const res = await request(app).get('/api/reports/templates').set('Authorization', authHeader)
    expect([200, 304, 404]).toContain(res.status)
  })
})
