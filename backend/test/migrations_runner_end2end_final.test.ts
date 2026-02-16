import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('Migrations runner - final sanity (dry-run then status)', () => {
  it('dry run lists migrations', () => {
    const out = execSync('node backend/scripts/migrate.js --dry-run', { encoding: 'utf8' })
    expect(out).toContain('Would apply')
  })
  it('migration status prints latest', () => {
    const out = execSync('node backend/scripts/migrate_status.js', { encoding: 'utf8' })
    expect(out.toLowerCase()).toContain('latest')
  })
})
