#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MIGRATIONS_DIR = path.resolve(__dirname, '../database/migrations')
const DRY_RUN = process.argv.includes('--dry-run')

async function ensureMigrationsTable(conn) {
  await conn.query(`CREATE TABLE IF NOT EXISTS migrations (
    version INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW()
  )`)
}

async function getAppliedVersions(conn) {
  const [rows] = await conn.query('SELECT version FROM migrations ORDER BY version')
  return rows.map((r) => r.version)
}

async function getPendingMigrations(appliedVersions) {
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort()
  const pending = []
  for (const f of files) {
    const v = parseInt(f.split('-')[0], 10)
    if (!appliedVersions.includes(v)) {
      pending.push({ version: v, name: f, path: path.join(MIGRATIONS_DIR, f) })
    }
  }
  return pending
}

async function applyMigration(conn, m) {
  const sql = fs.readFileSync(m.path, 'utf8')
  await conn.query(sql)
  await conn.query('INSERT INTO migrations(version, name, applied_at) VALUES (?, ?, NOW())', [m.version, m.name])
}

(async () => {
  const url = process.env.DATABASE_URL || ''
  if (!url.startsWith('mysql://')) {
    console.error('DATABASE_URL is not a mysql:// URL. Skipping migrate_mysql.js.')
    process.exit(0)
  }
  // parse mysql url: mysql://user:pass@host:port/db
  try {
    const u = new URL(url)
    const host = u.hostname
    const port = u.port || 3306
    const user = u.username
    const password = u.password
    const database = u.pathname.replace('/', '')
    const conn = await mysql.createConnection({ host, port: Number(port), user, password, database })

    try {
      await conn.beginTransaction()
      await ensureMigrationsTable(conn)
      const applied = await getAppliedVersions(conn)
      const pending = await getPendingMigrations(applied)
      if (pending.length === 0) {
        console.log('[mysql-migrate] no pending migrations')
        await conn.end()
        process.exit(0)
      }
      if (DRY_RUN) {
        console.log('[mysql-migrate] dry-run: pending migrations:')
        pending.forEach(p => console.log(`- ${p.version} ${p.name}`))
        await conn.rollback()
        await conn.end()
        process.exit(0)
      }
      for (const m of pending) {
        await applyMigration(conn, m)
      }
      await conn.commit()
      console.log('[mysql-migrate] applied migrations:', pending.map(p => p.version))
      await conn.end()
      process.exit(0)
    } catch (err) {
      await conn.rollback()
      console.error('[mysql-migrate] error applying migrations:', err)
      await conn.end()
      process.exit(2)
    }
  } catch (err) {
    console.error('[mysql-migrate] fatal error:', err)
    process.exit(3)
  }
})()
