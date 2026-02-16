#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
let mysql
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// NOTE: Do not rely on dotenv in CI; rely on environment variables instead

async function main() {
  if (!mysql) {
    try {
      // Dynamically load mysql2 if available
      const mod = await import('mysql2/promise')
      mysql = mod.default || mod
    } catch (err) {
      console.error('mysql2/promise not found. Skipping migrations since real DB path is not MySQL in this environment.');
      process.exit(0)
    }
  }
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'project_assistant',
  })
  const migrationsDir = path.resolve(__dirname, 'migrations')
  const dryRun = process.argv.includes('--dry-run')
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found.')
    await conn.end()
    return
  }
  const logFilePath = path.resolve(__dirname, 'migration_logs.txt')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()
  for (const f of files) {
    const version = f
    const [rows] = await conn.execute('SELECT 1 FROM migrations WHERE version = ?', [version]);
    const exists = rows.length > 0;
    if (exists) {
      console.log(`Skipping ${f}, already applied`)
      continue
    }
    const sql = fs.readFileSync(path.resolve(migrationsDir, f), 'utf8')
    if (dryRun) {
      console.log(`[DRY-RUN] Would apply: ${f}`)
      continue
    }
    console.log(`Applying ${f}...`)
    try {
      await conn.query(sql)
      await conn.execute('INSERT INTO migrations (version) VALUES (?)', [version])
      console.log(`Applied ${f}`)
      // Simple persistent log for migration activity
      try {
        fs.appendFileSync(logFilePath, `${new Date().toISOString()} APPLY ${version}\n`)
      } catch (logErr) {
        // ignore logging errors
      }
    } catch (e) {
      console.error(`Failed to apply ${f}:`, e)
      break
    }
  }
  await conn.end()
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
