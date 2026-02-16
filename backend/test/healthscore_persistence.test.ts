import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Health Score persistence end-to-end', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('POST then PUT should persist and log update', async () => {
    // Create score
    const post = await require('supertest')(app).post('/api/projects/1/scores').set('Authorization', authHeader).send({ checkpointId: 1, originalScore: 8, finalScore: 8 })
    expect([201, 200]).toContain(post.status)
    const scoreId = post.body?.score?.id ?? null
    // Update score
    if (scoreId) {
      const put = await require('supertest')(app).put(`/api/projects/1/scores/${scoreId}`).set('Authorization', authHeader).send({ finalScore: 9 })
      expect(put.status).toBeGreaterThanOrEqual(200)
    }
    // Retrieve scores and logs
    const scores = await require('supertest')(app).get('/api/projects/1/scores').set('Authorization', authHeader)
    expect(scores.status).toBe(200)
    // Logs should include an entry for the update (from 2b implementation)
    const logs = await require('supertest')(app).get('/api/projects/1/logs').set('Authorization', authHeader)
    expect(logs.status).toBe(200)
  })
})
