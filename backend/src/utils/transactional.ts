// Lightweight transactional helper interface to illustrate transactional persistence
// for Health Score updates alongside associated logs.
// This is designed to be wired into a real DB client (e.g. pg) in a production setup.

export type DbClient = {
  query: (text: string, params?: any[]) => Promise<any>;
  release?: () => void;
};

export type DbPool = {
  getClient: () => Promise<DbClient>;
};

export async function persistScoreAndLogs(dbPool: DbPool, score: { id: number; value: number }, logs: Array<{ change: string }>): Promise<void> {
  const client = await dbPool.getClient();
  try {
    await client.query('BEGIN');
    // Update score (placeholder SQL – replace with real schema)
    await client.query('UPDATE health_scores SET value = $1 WHERE id = $2', [score.value, score.id]);
    // Insert logs associated with this score
    for (const l of logs) {
      await client.query('INSERT INTO score_logs (score_id, change, created_at) VALUES ($1, $2, NOW())', [score.id, l.change]);
    }
    await client.query('COMMIT');
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {
      // ignore rollback errors
    }
    throw err;
  } finally {
    if (client.release) client.release();
  }
}
