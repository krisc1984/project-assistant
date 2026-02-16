import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('Migrations runner end-to-end 3 (dry-run + status)', () => {
  it('dry run should list migrations', () => {
    const out = execSync('node backend/scripts/migrate.js --dry-run', { encoding: 'utf8' })
    expect(out).toContain('Would apply')
  })
  it('migration status should display latest version', () => {
    const out = execSync('node backend/scripts/migrate_status.js', { encoding: 'utf8' })
    expect(out).toMatch(/Latest migration version|latest migration version/)
  })
})
