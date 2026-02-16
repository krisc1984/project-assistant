import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('Migrations runner full flow (dry-run)', () => {
  it('should list migrations without applying', () => {
    const out = execSync('node backend/scripts/migrate.js --dry-run', { encoding: 'utf8' })
    expect(out).toContain('Would apply')
  })
})
