import type { Pool, PoolClient } from 'pg';

export type PgPoolLike = {
  getClient: () => Promise<{ query: (text: string, params?: any[]) => Promise<any>; release: () => void }>;
  end?: () => Promise<void>;
};

export function createPgPool(connectionString: string): PgPoolLike {
  // Lazy require to keep TypeScript happy in environments without pg installed at type-level
  const { Pool } = require('pg') as { Pool: any };
  const pool = new Pool({ connectionString });
  return {
    getClient: async () => {
      const client: PoolClient = await pool.connect();
      return {
        query: (text: string, params?: any[]) => client.query(text, params),
        release: () => client.release(),
      };
    },
    end: async () => {
      await pool.end();
    },
  };
}
