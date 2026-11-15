import { describe, expect, it } from 'vitest'
import { readRecord, RECORD_VERSION } from '$lib/modules/record'
import { RECORD } from '$tests/helpers/records'

// === Helpers ===

/**
 * The record as JSON text, with `change` applied to a copy first. Used by every readRecord test:
 * text((r) => { r.version = 2 }) is the record one version on
 */
function text(change: (record: Record<string, unknown>) => void = () => {}): string {
  const copy = structuredClone(RECORD) as unknown as Record<string, unknown>
  change(copy)
  return JSON.stringify(copy)
}

// === Tests ===

describe('a record of this version is read as it was written', () => {
  it('gives back the same record', () => {
    expect(readRecord(text())).toEqual({ ok: true, record: RECORD })
  })
})

describe('text that is not JSON is named as such', () => {
  it('reports not-json', () => {
    // A record cut off midway, as a bad hand edit leaves it: no closing brace, so JSON.parse fails before any check
    const result = readRecord('{"format": "timefold-record", "version": 1,')
    expect(result.ok).toBe(false)
    expect(!result.ok && result.problem.kind).toBe('not-json')
  })
})

describe('JSON that is not a TimeFold record is named as such', () => {
  it('reports not-a-record for a file of something else', () => {
    expect(readRecord('{"burger-joint": "mcdonalds", "cows": 256}')).toEqual({
      ok: false,
      problem: { kind: 'not-a-record' },
    })
  })
})

describe('a record of a newer version is refused', () => {
  it('reports the version and reads nothing else', () => {
    const newer_version = RECORD_VERSION + 1
    const newer = text((r) => {
      r.version = newer_version
      r.entries = 'a shape this version does not know'
    })

    expect(readRecord(newer)).toEqual({ ok: false, problem: { kind: 'newer-version', version: newer_version } })
  })
})

describe('a record of the wrong shape names where', () => {
  it('names an entry missing its start', () => {
    const broken = text((r) => {
      delete (r.entries as Record<string, unknown>[])[1].start
    })
    expect(readRecord(broken)).toEqual({ ok: false, problem: { kind: 'wrong-shape', where: 'entries[1].start' } })
  })

  it('names a day not written YYYY-MM-DD', () => {
    const broken = text((r) => {
      ;(r.openings as Record<string, unknown>[])[0].day = '16.11.2026'
    })
    expect(readRecord(broken)).toEqual({ ok: false, problem: { kind: 'wrong-shape', where: 'openings[0].day' } })
  })

  it('names a way of making an entry the app does not know', () => {
    const broken = text((r) => {
      ;(r.entries as Record<string, unknown>[])[0].made = 'guessed'
    })
    expect(readRecord(broken)).toEqual({ ok: false, problem: { kind: 'wrong-shape', where: 'entries[0].made' } })
  })
})
