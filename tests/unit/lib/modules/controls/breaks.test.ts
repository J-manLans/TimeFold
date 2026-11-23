import { describe, expect, it } from 'vitest'
import { breakSoFar, setBreak } from '$lib/modules/controls/breaks'
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

/** A moment as a Date. Used for every break set: moment('2026-11-18', '00:20') */
function moment(day: string, time: string): Date {
  return new Date(at(day, time))
}

/** An entry of the janitor running since Monday 08:00, with this break. Used by most tests here */
function runningWith(breakMinutes: number): TimeRecord {
  return record([entry(at('2026-11-16', '08:00'), null, { id: 'e1', breakMinutes })])
}

// === Tests ===

describe('the field holds the running entry’s whole break so far', () => {
  it('reads 20 for a break of 20, and 0 with none or nothing running', () => {
    expect([
      breakSoFar(runningWith(20), JANITOR),
      breakSoFar(runningWith(0), JANITOR),
      breakSoFar(record([]), JANITOR),
    ]).toEqual([20, 0, 0])
  })
})

describe('a new total replaces the break: higher adds, lower takes back, 0 takes it all', () => {
  it('makes 20 into 30, and gives the click for the undo', () => {
    const done = setBreak(runningWith(20), JANITOR, 30, moment('2026-11-16', '11:00'))

    expect(done.ok && done.record.entries[0].breakMinutes).toBe(30)
    expect(done.ok && done.click).toMatchObject({ kind: 'break', entry: 'e1', from: 20, to: 30 })
  })

  it('makes 20 into 10, and 0 takes it all', () => {
    const ten = setBreak(runningWith(20), JANITOR, 10, moment('2026-11-16', '11:00'))
    const none = setBreak(runningWith(20), JANITOR, 0, moment('2026-11-16', '11:00'))

    expect([ten.ok && ten.record.entries[0].breakMinutes, none.ok && none.record.entries[0].breakMinutes]).toEqual([
      10, 0,
    ])
  })
})

describe('a total is refused where it cannot go', () => {
  it('refuses a break when nothing runs on the profile on screen, or B is on screen while A runs', () => {
    expect([
      setBreak(record([]), JANITOR, 20, moment('2026-11-16', '10:00')),
      setBreak(runningWith(0), DEVELOPMENT, 20, moment('2026-11-16', '10:00')),
    ]).toEqual([
      { ok: false, why: 'nothing-runs' },
      { ok: false, why: 'nothing-runs' },
    ])
  })

  it('refuses a total of 5 h on an entry that has run 2 h', () => {
    expect(setBreak(runningWith(0), JANITOR, 300, moment('2026-11-16', '10:00'))).toEqual({
      ok: false,
      why: 'too-long',
    })
  })

  it('changes nothing for the same total', () => {
    expect(setBreak(runningWith(20), JANITOR, 20, moment('2026-11-16', '10:00'))).toEqual({
      ok: false,
      why: 'no-change',
    })
  })
})
