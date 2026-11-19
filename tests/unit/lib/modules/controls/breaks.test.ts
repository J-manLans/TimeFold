import { describe, expect, it } from 'vitest'
import { addBreak } from '$lib/modules/controls/breaks'
import { type Entry, type TimeRecord } from '$lib/modules/shared/record'
import { at, entry, RECORD } from '$tests/helpers/records'

// === Constants ===

const JANITOR = 'p1'
const DEVELOPMENT = 'p2'

// === Helpers ===

/** The shared record with a second profile and the given entries. Used by every test here */
function record(entries: Entry[]): TimeRecord {
  return {
    ...RECORD,
    profiles: [...RECORD.profiles, { id: DEVELOPMENT, name: 'Utvecklingsgruppen', hue: 200, base: '#4f8fd6' }],
    entries,
  }
}

/** A moment as a Date. Used for every break added: moment('2026-11-18', '00:20') */
function moment(day: string, time: string): Date {
  return new Date(at(day, time))
}

// === Tests ===

describe('an added break goes to the running entry of the profile on screen, with the day it was added', () => {
  it('adds 45 min dated Wednesday to an entry running since Tuesday 22:00, added at Wednesday 00:20', () => {
    const before = record([entry(at('2026-11-17', '22:00'), null, { id: 'e1' })])
    const done = addBreak(before, JANITOR, 45, moment('2026-11-18', '00:20'))

    expect(done.ok && done.record.entries[0].breaks).toEqual([{ day: '2026-11-18', minutes: 45 }])
  })

  it('adds a second break after the first, and gives the click for the undo', () => {
    const before = record([
      entry(at('2026-11-16', '08:00'), null, { id: 'e1', breaks: [{ day: '2026-11-16', minutes: 20 }] }),
    ])
    const done = addBreak(before, JANITOR, 15, moment('2026-11-16', '11:00'))

    expect(done.ok && done.record.entries[0].breaks).toEqual([
      { day: '2026-11-16', minutes: 20 },
      { day: '2026-11-16', minutes: 15 },
    ])
    expect(done.ok && done.click).toMatchObject({ kind: 'break', entry: 'e1', minutes: 15 })
  })
})

describe('a break is refused where it cannot go', () => {
  it('refuses a break when nothing runs on the profile on screen', () => {
    expect(addBreak(record([]), JANITOR, 20, moment('2026-11-16', '10:00'))).toEqual({ ok: false, why: 'nothing-runs' })
  })

  it('refuses a break for B on screen while A runs', () => {
    const running = record([entry(at('2026-11-16', '08:00'), null, { id: 'e1' })])

    expect(addBreak(running, DEVELOPMENT, 20, moment('2026-11-16', '10:00'))).toEqual({
      ok: false,
      why: 'nothing-runs',
    })
  })

  it('refuses a 5 h break on an entry that has run 2 h', () => {
    const running = record([entry(at('2026-11-16', '08:00'), null, { id: 'e1' })])

    expect(addBreak(running, JANITOR, 300, moment('2026-11-16', '10:00'))).toEqual({ ok: false, why: 'too-long' })
  })

  it('refuses a break that with the ones before would pass the whole entry', () => {
    const running = record([
      entry(at('2026-11-16', '08:00'), null, { id: 'e1', breaks: [{ day: '2026-11-16', minutes: 60 }] }),
    ])

    expect(addBreak(running, JANITOR, 70, moment('2026-11-16', '10:00'))).toEqual({ ok: false, why: 'too-long' })
  })

  it('refuses a break of no length', () => {
    const running = record([entry(at('2026-11-16', '08:00'), null, { id: 'e1' })])

    expect(addBreak(running, JANITOR, 0, moment('2026-11-16', '10:00'))).toEqual({ ok: false, why: 'no-length' })
  })
})
