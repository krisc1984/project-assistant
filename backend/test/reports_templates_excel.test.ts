import request from 'supertest'
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../src/server'

describe('Reports templates - Excel export placeholder', () => {
  const secret = process.env.JWT_SECRET ?? 'secret'
  const token = jwt.sign({ sub: 1, username: 'tester', role: 'tech_pm' }, secret, { expiresIn: '7d' })
  const authHeader = `Bearer ${token}`

  it('GET template export (Excel placeholder)', async () => {
    const res = await request(app).get('/api/reports/templates/3/export').set('Authorization', authHeader)
    expect([200, 304, 204]).toContain(res.status)
  })
})
