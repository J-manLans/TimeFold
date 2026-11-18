import { describe, expect, it } from 'vitest'
import { freshRecord, readRecord, RECORD_FORMAT, RECORD_VERSION, recoveryFor } from '$lib/modules/shared/record'
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

describe('a record of version 1 is upgraded to this version', () => {
  it('gains full time, 8 h from its first opening, and keeps the rest', () => {
    const result = readRecord(
      text((r) => {
        r.version = 1
        delete r.fullTime
      }),
    )

    expect(result).toEqual({ ok: true, record: RECORD })
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

  it('names pay that is neither a salary nor a rate', () => {
    const result = readRecord(
      text((r) => {
        ;(r.profiles as { pay: { kind: string }[] }[])[0].pay[0].kind = 'bonus'
      }),
    )

    expect(result).toEqual({ ok: false, problem: { kind: 'wrong-shape', where: 'profiles[0].pay[0].kind' } })
  })

  it('names a way of making an entry the app does not know', () => {
    const broken = text((r) => {
      ;(r.entries as Record<string, unknown>[])[0].made = 'guessed'
    })
    expect(readRecord(broken)).toEqual({ ok: false, problem: { kind: 'wrong-shape', where: 'entries[0].made' } })
  })
})

describe('a fresh start makes a record of one profile with its opening', () => {
  it('holds the profile with 6 h a day and full time of 8 h from the first day, the opening that day, no entries', () => {
    expect(freshRecord('Vaktmästare', 12 * 60 + 30, '2026-11-16')).toMatchObject({
      format: RECORD_FORMAT,
      version: RECORD_VERSION,
      profiles: [{ id: 'p1', name: 'Vaktmästare', expectedMinutes: [{ from: '2026-11-16', minutes: 360 }] }],
      openings: [{ profile: 'p1', day: '2026-11-16', balanceMinutes: 750 }],
      fullTime: [{ from: '2026-11-16', minutes: 480 }],
      entries: [],
    })
  })

  it('passes the check on opening', () => {
    expect(readRecord(JSON.stringify(freshRecord('Vaktmästare', -90, '2026-11-16'))).ok).toBe(true)
  })
})

describe('a record that cannot be read leads to the copy, a fresh start, or an update', () => {
  it('offers the copy for a broken file when there is one, and a fresh start when there is not', () => {
    const broken = { kind: 'not-json', detail: 'Unexpected end' } as const

    expect([recoveryFor(broken, true), recoveryFor({ kind: 'wrong-shape', where: 'entries[1].start' }, false)]).toEqual(
      ['copy', 'bare'],
    )
  })

  it('asks for an update for a newer record, copy or not', () => {
    expect(recoveryFor({ kind: 'newer-version', version: 3 }, true)).toBe('newer')
  })
})
