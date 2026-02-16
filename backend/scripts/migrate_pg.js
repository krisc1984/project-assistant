#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Client } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MIGRATIONS_DIR = path.resolve(__dirname, '../database/migrations')
const DRY_RUN = process.argv.includes('--dry-run')

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations_pg (
      version INT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `)
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL not set; skipping Postgres migrations.')
    process.exit(0)
  }
  const client = new Client({ connectionString })
  await client.connect()
  try {
    await ensureMigrationsTable(client)
    const res = await client.query('SELECT version FROM migrations_pg ORDER BY version')
    const appliedVersions = res.rows.map((r) => r.version)
    const files = (await fs.readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort()
    const pending = files.filter(f => {
      const v = parseInt(f.split('-')[0], 10)
      return !appliedVersions.includes(v)
    })
    if (pending.length === 0) {
      console.log('[pg-migrate] no pending migrations')
      await client.end()
      process.exit(0)
    }
    if (DRY_RUN) {
      console.log('[pg-migrate] dry-run: pending migrations:')
      pending.forEach(f => console.log(`- ${f}`))
      await client.end()
      process.exit(0)
    }
    // Apply migrations in order
    for (const f of pending) {
      const sql = await fs.readFile(path.resolve(MIGRATIONS_DIR, f), 'utf8')
      const version = parseInt(f.split('-')[0], 10)
      await client.query(sql)
      await client.query('INSERT INTO migrations_pg(version, name, applied_at) VALUES($1, $2, NOW())', [version, f])
      console.log(`[pg-migrate] applied ${f}`)
    }
    await client.end()
    process.exit(0)
  } catch (e) {
    console.error('pg migrate error:', e)
    try { await client.end() } catch {}
    process.exit(2)
  }
}

main().catch((err) => {
  console.error('pg migrate failed:', err)
  process.exit(3)
})
