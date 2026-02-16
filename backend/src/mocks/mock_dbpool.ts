// Dedicated mock DB pool for integration tests importing from tests
export function createMockDbPool() {
  const store = { scores: { '1': { value: 0 } }, logs: [] };
  return {
    getClient: async () => {
      return {
        query: async (text: string, params?: any[]) => {
          if (/BEGIN/i.test(text)) return { rows: [] };
          if (/COMMIT/i.test(text)) return { rows: [] };
          if (/ROLLBACK/i.test(text)) return { rows: [] };
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
          if (/FROM\s+score_logs|FROM\s+score_logs|SELECT\s+.*FROM\s+score_logs/i.test(text)) {
            const scoreId = params?.[0];
            const rows = store.logs
              .filter((l) => l.score_id === Number(scoreId))
              .map((l) => ({ change: l.change, created_at: l.created_at }));
            return { rows };
          }
          return { rows: [] };
        },
        release: () => {},
      } as any;
    },
    store,
  };
}
