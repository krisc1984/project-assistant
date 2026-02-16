import { describe, it, expect, vi } from 'vitest';
import { persistScoreAndLogs, type DbPool } from '../src/utils/transactional';

function mockDbClient(behavior: 'ok' | 'fail') {
  const calls: string[] = [];
  return {
    query: async (text: string, _params?: any[]) => {
      calls.push(text);
      if (behavior === 'fail' && text.startsWith('UPDATE')) {
        throw new Error('update failed');
      }
      // simulate a simple successful response
      return { rows: [] };
    },
    release: vi.fn()
  };
}

function mockDbPool(behavior: 'ok' | 'fail'): DbPool {
  return {
    getClient: async () => mockDbClient(behavior) as any
  };
}

describe('persistScoreAndLogs transactional behavior (scaffold)', () => {
  it('commits when all operations succeed', async () => {
    const pool = mockDbPool('ok');
    await expect(persistScoreAndLogs(pool, { id: 1, value: 42 }, [{ change: 'inc' }])).resolves.toBeUndefined();
  });

  it('rolls back when an operation fails', async () => {
    const pool = mockDbPool('fail');
    await expect(persistScoreAndLogs(pool, { id: 1, value: 99 }, [{ change: 'dec' }])).rejects.toThrow('update failed');
  });
});
