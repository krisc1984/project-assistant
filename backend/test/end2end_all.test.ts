import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('End-to-end small integration (2a-2e)', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('Create and fetch score, logs, and templates export', async () => {
    // Create score
    let res = await request(app).post('/api/projects/1/scores').set('Authorization', authHeader).send({ checkpointId: 1, originalScore: 8, finalScore: 8 })
    expect([200, 201]).toContain(res.status)
    // Fetch scores
    res = await request(app).get('/api/projects/1/scores').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    // Get logs
    res = await request(app).get('/api/projects/1/logs').set('Authorization', authHeader)
    expect(res.status).toBe(200)
    // Templates
    res = await request(app).get('/api/reports/templates').set('Authorization', authHeader)
    expect([200, 304, 404]).toContain(res.status)
  })
})
