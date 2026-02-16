import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Scores integration end-to-end', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('POST /api/projects/1/scores then GET', async () => {
    const payload = { checkpointId: 1, finalScore: 7, originalScore: 7 }
    const postRes = await request(app).post('/api/projects/1/scores').set('Authorization', authHeader).send(payload)
    expect([201, 200]).toContain(postRes.status)
    const getRes = await request(app).get('/api/projects/1/scores').set('Authorization', authHeader)
    expect(getRes.status).toBe(200)
    expect(getRes.body).toHaveProperty('scores')
  })
})
