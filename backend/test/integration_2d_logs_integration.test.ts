import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from '../src/app';

describe('2d-02: Logs endpoints integration with scores (scaffold)', () => {
  const app = createApp({ useMockDb: !process.env.DATABASE_URL });
  it('creates logs for a score and retrieves them with pagination', async () => {
    // Create two logs for score 1
    await request(app).post('/api/health/scores/1').send({ value: 61, logs: [{ change: 'inc' }] });
    await request(app).post('/api/health/scores/1').send({ value: 62, logs: [{ change: 'inc' }] });
    // Retrieve logs with limit
    const res = await request(app).get('/api/health/scores/1/logs?limit=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Limit should cap the results to 1
    if (Array.isArray(res.body)) {
      expect(res.body.length).toBeLessThanOrEqual(1);
    }
  });
});
