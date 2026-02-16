import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Health Score end-to-end extension (2a)', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('POST with missing fields should 400', async () => {
    const res = await request(app).post('/api/projects/1/scores').set('Authorization', authHeader).send({})
    expect(res.status).toBe(400)
  })
})
