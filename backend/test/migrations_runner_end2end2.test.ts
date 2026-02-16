import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('Migrations runner end-to-end (additional dry-run)', () => {
  it('dry run should list migrations', () => {
    const out = execSync('node backend/scripts/migrate.js --dry-run', { encoding: 'utf8' })
    expect(out).toContain('Would apply')
  })
})
