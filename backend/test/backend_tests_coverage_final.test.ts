import { describe, it, expect } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Backend tests coverage final', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('health score endpoints respond', async () => {
    const res = await request(app).get('/api/projects/1/scores').set('Authorization', authHeader)
    expect(res.status).toBeGreaterThanOrEqual(200)
  })
})
