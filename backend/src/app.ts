import express from 'express';
import healthScoresRouter from './routes/health_scores';
import { createMockDbPool } from '../mocks/mock_dbpool';
import { createPgPool } from '../db/pgPool';

// Simple in-memory mock DB pool for integration demonstration
type MockClient = {
  query: (text: string, params?: any[]) => Promise<any>;
  release?: () => void;
};
type MockDbPool = {
  getClient: () => Promise<MockClient>;
  // expose internal store for potential inspections
  store?: { scores: Record<string, { value: number }>; logs: Array<{ score_id: number; change: string; created_at: string }> };
};

function createMockDbPool(): MockDbPool {
  const store = { scores: { '1': { value: 50 } }, logs: [] as Array<{ score_id: number; change: string; created_at: string }> };
  return {
    getClient: async () => {
      return {
        query: async (text: string, params?: any[]) => {
          // very light SQL parser for demo purposes
          if (/BEGIN/i.test(text)) { return { rows: [] }; }
          if (/COMMIT/i.test(text)) { return { rows: [] }; }
          if (/ROLLBACK/i.test(text)) { return { rows: [] }; }
          if (/UPDATE\s+health_scores/i.test(text)) {
            const [value, id] = params || [];
            store.scores[String(id)] = { value: Number(value) };
            return { rows: [] };
          }
          if (/INSERT\s+INTO\s+score_logs/i.test(text)) {
            const [score_id, change] = params || [];
            store.logs.push({ score_id: Number(score_id), change: String(change), created_at: new Date().toISOString() });
            return { rows: [] };
          }
          return { rows: [] };
        },
        release: () => { /* no-op */ }
      } as MockClient;
    },
    store
  };
}

// Expose a factory for production usage as well (default to mock if not overridden)
export { createMockDbPool };

// App factory: builds an Express app with health score endpoints mounted under /api
export function createApp({ useMockDb = true }: { useMockDb?: boolean } = {}) {
  const app = express();
  app.use(express.json());
  // Attach a DB pool to be consumed by the routes
  let dbPool: any;
  const useReal = (process.env.DATABASE_URL != null) || (process.env.USE_REAL_DB === 'true');
  if (useReal) {
    const connectionString = process.env.DATABASE_URL || '';
    try {
      dbPool = createPgPool(connectionString);
    } catch {
      dbPool = createMockDbPool();
    }
  } else {
    dbPool = createMockDbPool();
  }
  app.set('dbPool', dbPool);
  app.use('/api', healthScoresRouter as any);
  // Simple health endpoint for sanity
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return app;
}

export default createApp;
