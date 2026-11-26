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

/** The record as an older version wrote it: no added breaks on its entries and no flex days. Used by the upgrades */
function beforeBreaks(r: Record<string, unknown>): void {
  for (const e of r.entries as Record<string, unknown>[]) delete e.breakMinutes
  for (const p of r.profiles as Record<string, unknown>[]) delete p.flexDays
}

/** The record as version 4 wrote it, before the reasons were the record's own. Used by every upgrade */
function beforeReasons(r: Record<string, unknown>): void {
  delete r.reasons
  delete r.tax
}

/** The test record with its breaks gone, as an upgrade leaves a record that had none */
const UPGRADED = {
  ...RECORD,
  entries: RECORD.entries.map((e) => ({ ...e, breakMinutes: 0 })),
}

describe('a record of version 1 is upgraded to this version', () => {
  it('gains full time, 7 h 39 min from its first opening, no breaks and no flex days, and keeps the rest', () => {
    const result = readRecord(
      text((r) => {
        r.version = 1
        delete r.fullTime
        beforeBreaks(r)
        beforeReasons(r)
      }),
    )

    expect(result).toEqual({ ok: true, record: { ...UPGRADED, fullTime: [{ from: '2026-11-16', minutes: 459 }] } })
  })
})

describe('a record of version 2, as the owner keeps it, is upgraded to this version', () => {
  it('gains no breaks and no flex days, and keeps every entry, profile and setting as it was', () => {
    const result = readRecord(
      text((r) => {
        r.version = 2
        beforeBreaks(r)
        beforeReasons(r)
      }),
    )

    expect(result).toEqual({ ok: true, record: UPGRADED })
  })
})

describe('a record of version 3 is upgraded to this version', () => {
  /** The record as version 3 wrote it, its first entry with breaks of 20 min Monday and 15 min Tuesday */
  const versionThree = (minutes: number): string =>
    text((r) => {
      r.version = 3
      beforeReasons(r)
      const entries = r.entries as Record<string, unknown>[]
      for (const e of entries) {
        delete e.breakMinutes
        e.breaks = []
      }
      entries[0].breaks = [
        { day: '2026-11-16', minutes: 20 },
        { day: '2026-11-17', minutes },
      ]
    })

  it('sums each entry’s breaks into one, 20 and 15 into 35, and keeps the rest', () => {
    const upgraded = { ...RECORD, entries: RECORD.entries.map((e, i) => ({ ...e, breakMinutes: i === 0 ? 35 : 0 })) }

    expect(readRecord(versionThree(15))).toEqual({ ok: true, record: upgraded })
  })

  it('names an added break of no length', () => {
    expect(readRecord(versionThree(0))).toEqual({
      ok: false,
      problem: { kind: 'wrong-shape', where: 'entries[0].breaks[1].minutes' },
    })
  })
})

describe('a record of version 4 is upgraded to this version', () => {
  it('gains the reasons the list started with, nothing learned or forgotten, the estimate before tax with 25%, and keeps the rest', () => {
    expect(
      readRecord(
        text((r) => {
          r.version = 4
          beforeReasons(r)
        }),
      ),
    ).toEqual({ ok: true, record: RECORD })
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

  it('names a break of minus minutes, and a reason with nothing in it', () => {
    const minus = text((r) => {
      ;(r.entries as { breakMinutes: number }[])[0].breakMinutes = -5
    })
    const empty = text((r) => {
      ;(r.entries as { reason: string }[])[0].reason = ''
    })

    expect([readRecord(minus), readRecord(empty)]).toEqual([
      { ok: false, problem: { kind: 'wrong-shape', where: 'entries[0].breakMinutes' } },
      { ok: false, problem: { kind: 'wrong-shape', where: 'entries[0].reason' } },
    ])
  })

  it('names a flex day not written YYYY-MM-DD', () => {
    const broken = text((r) => {
      ;(r.profiles as { flexDays: string[] }[])[0].flexDays = ['11.12.2026']
    })
    expect(readRecord(broken)).toEqual({
      ok: false,
      problem: { kind: 'wrong-shape', where: 'profiles[0].flexDays[0]' },
    })
  })

  it('names an archived mark that is not true, a trend opening of part seconds, and a reason with nothing in it', () => {
    const results = [
      text((r) => {
        ;(r.profiles as Record<string, unknown>[])[0].archived = false
      }),
      text((r) => {
        ;(r.openings as Record<string, unknown>[])[0].trendSeconds = 1.5
      }),
      text((r) => {
        ;(r.reasons as { list: string[] }).list[2] = ''
      }),
      text((r) => {
        ;(r.reasons as { written: unknown[] }).written = [{ text: 'möte', times: 0 }]
      }),
      text((r) => {
        ;(r.tax as { percent: number }).percent = 100
      }),
    ].map(readRecord)

    expect(results).toEqual([
      { ok: false, problem: { kind: 'wrong-shape', where: 'profiles[0].archived' } },
      { ok: false, problem: { kind: 'wrong-shape', where: 'openings[0].trendSeconds' } },
      { ok: false, problem: { kind: 'wrong-shape', where: 'reasons.list[2]' } },
      { ok: false, problem: { kind: 'wrong-shape', where: 'reasons.written[0].times' } },
      { ok: false, problem: { kind: 'wrong-shape', where: 'tax.percent' } },
    ])
  })

  it('names a way of making an entry the app does not know', () => {
    const broken = text((r) => {
      ;(r.entries as Record<string, unknown>[])[0].made = 'guessed'
    })
    expect(readRecord(broken)).toEqual({ ok: false, problem: { kind: 'wrong-shape', where: 'entries[0].made' } })
  })
})

describe('a fresh start makes a record of one profile with its opening', () => {
  it('holds the profile with 6 h a day and no flex days, full time of 7 h 39 min from the first day, the opening that day, no entries', () => {
    expect(freshRecord('Vaktmästare', 12 * 60 + 30, '2026-11-16')).toMatchObject({
      format: RECORD_FORMAT,
      version: RECORD_VERSION,
      profiles: [
        { id: 'p1', name: 'Vaktmästare', expectedMinutes: [{ from: '2026-11-16', minutes: 360 }], flexDays: [] },
      ],
      openings: [{ profile: 'p1', day: '2026-11-16', balanceMinutes: 750 }],
      fullTime: [{ from: '2026-11-16', minutes: 459 }],
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
