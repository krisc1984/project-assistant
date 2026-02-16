#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Client } from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MIGRATIONS_DIR = path.resolve(__dirname, '../database/migrations')

(async () => {
  const url = process.env.DATABASE_URL || ''
  if (!url.startsWith('mysql://')) {
    console.error(JSON.stringify({ error: 'DATABASE_URL is not mysql://' }))
    process.exit(0)
  }
  const u = new URL(url)
  const host = u.hostname
  const port = u.port || 3306
  const user = u.username
  const password = u.password
  const database = u.pathname.replace('/', '')
  const client = await new Client({ host, port: Number(port), user, password, database }).connect?.() // Type guard
  try {
    // ensure table exists
    await client.query(`CREATE TABLE IF NOT EXISTS migrations (
      version INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    )`)
    const [rows] = await client.query('SELECT version, name, applied_at FROM migrations ORDER BY version')
    const applied = rows
    const files = (fs.readdirSync(MIGRATIONS_DIR) as string[]).filter(f => f.endsWith('.sql')).sort()
    const allVersions = files.map(f => parseInt(f.split('-')[0], 10))
    const latestApplied = applied.length ? Math.max(...applied.map((r: any) => r.version)) : 0
    const pending = allVersions.filter(v => v > latestApplied)
    const status = { current_version: latestApplied, applied_count: applied.length, pending_count: pending.length, applied, pending }
    console.log(JSON.stringify(status, null, 2))
    await client.end()
  } catch (err) {
    console.error(JSON.stringify({ error: String(err) }))
    try { await client.end() } catch {}
    process.exit(2)
  }
})()
