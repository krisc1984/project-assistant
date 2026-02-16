import pool from '../config/db'

type QueryResult<T> = [T[], any]

export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await (pool as any).execute(sql, params ?? [])
  return rows as T[]
}

export async function queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
  const res = await query<T>(sql, params)
  return res.length ? res[0] as T : null
}

export async function execute(sql: string, params?: any[]): Promise<any> {
  const [result] = await (pool as any).execute(sql, params ?? [])
  return result
}

// Execute within a transaction using a dedicated connection
export async function withTransaction<T>(fn: (conn: any) => Promise<T>): Promise<T> {
  const conn = await (pool as any).getConnection()
  try {
    await (conn as any).beginTransaction()
    const res = await fn(conn)
    await (conn as any).commit()
    conn.release()
    return res
  } catch (e) {
    await (conn as any).rollback()
    conn.release()
    throw e
  }
}
