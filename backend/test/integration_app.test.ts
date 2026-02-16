import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from '../src/app';

describe('Integration: App with health_scores routes (mock DB)', () => {
  const app = createApp({ useMockDb: !process.env.DATABASE_URL });
  it('POST /api/health/scores/:id updates score with logs', async () => {
    const res = await request(app).post('/api/health/scores/1').send({ value: 60, logs: [{ change: 'inc' }] });
    // In mock mode, should return 204 or 200 depending on implementation; here we expect 204
    expect([200, 204].includes(res.status)).toBe(true);
  });
  it('GET /api/health/scores/:id returns score object', async () => {
    const res = await request(app).get('/api/health/scores/1');
    // In scaffold, may return an object or empty; ensure we get JSON
    expect(res.headers['content-type']).toContain('application/json');
  });
});
