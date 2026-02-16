#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Client } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MIGRATIONS_DIR = path.resolve(__dirname, '../database/migrations')

(async () => {
  const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
  if (!connectionString) {
    console.error(JSON.stringify({ error: 'DATABASE_URL not set' }))
    process.exit(1)
  }
  const client = new Client({ connectionString })
  await client.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `)
    const res = await client.query('SELECT version, name, applied_at FROM migrations ORDER BY version')
    const applied = res.rows.map((r: any) => ({ version: r.version, name: r.name, applied_at: r.applied_at }))
    const files = fs.readdirSync(MIGRATIONS_DIR).filter((f: string) => f.endsWith('.sql')).sort()
    const allVersions = files.map((f: string) => parseInt(f.split('-')[0], 10))
    const latestApplied = applied.length ? Math.max(...applied.map((a: any) => a.version)) : 0
    const pending = allVersions.filter((v) => v > latestApplied)
    const status = {
      current_version: latestApplied,
      applied_count: applied.length,
      pending_count: pending.length,
      applied,
      pending
    }
    console.log(JSON.stringify(status, null, 2))
    await client.end()
  } catch (err) {
    console.error(JSON.stringify({ error: String(err) }))
    try { await client.end() } catch {}
    process.exit(2)
  }
})()
