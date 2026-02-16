import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Health Score end-to-end (2a)', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('POST /api/projects/1/scores then GET', async () => {
    const post = await request(app).post('/api/projects/1/scores').set('Authorization', authHeader).send({ checkpointId: 1, originalScore: 8, finalScore: 8 })
    expect([201, 200]).toContain(post.status)
    const get = await request(app).get('/api/projects/1/scores').set('Authorization', authHeader)
    expect(get.status).toBe(200)
  })
})
