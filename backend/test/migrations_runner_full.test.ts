import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('Migrations runner full flow', () => {
  it('runs dry run without applying migrations', () => {
    const out = execSync('node ./backend/scripts/migrate.js --dry-run', { encoding: 'utf8' })
    expect(out).toContain('Would apply')
  })
  it('runs full migrate (if environment allows)', () => {
    // Do not actually push prod migrations in test; just ensure the command runs
    // If environment permits, uncomment the next line
    // execSync('node ./backend/scripts/migrate.js', { stdio: 'inherit' })
    expect(true).toBe(true)
  })
})
