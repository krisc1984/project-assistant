#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Client } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MIGRATIONS_DIR = path.resolve(__dirname, '../database/migrations')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error(JSON.stringify({ error: 'DATABASE_URL not set' }))
    process.exit(1)
  }
  const client = new Client({ connectionString })
  await client.connect()
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS migrations_pg (
      version INT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );`)
    const res = await client.query('SELECT version, name, applied_at FROM migrations_pg ORDER BY version')
    const applied = res.rows
    const files = (await fs.readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort()
    const allVersions = files.map(f => parseInt(f.split('-')[0], 10))
    const latestApplied = applied.length ? Math.max(...applied.map(a => a.version)) : 0
    const pending = allVersions.filter(v => v > latestApplied)
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
}

main().catch((e) => {
  console.error('pg migrate status failed:', e)
  process.exit(3)
})
