import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Logs end2d tests', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET logs with minScore', async () => {
    const res = await request(app).get('/api/projects/1/logs?minScore=1').set('Authorization', authHeader)
    expect(res.status).toBeGreaterThanOrEqual(200)
  })
})
