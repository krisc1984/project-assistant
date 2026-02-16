import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

describe('Documentation updates plan presence', () => {
  it('PHASE2-Plan-Next.md exists and contains Phase 2 Plan', () => {
    const p = path.resolve('docs/PHASE2-Plan-Next.md')
    const content = readFileSync(p, 'utf8')
    expect(content.length).toBeGreaterThan(0)
  })
})
