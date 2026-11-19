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

/** An entry of the janitor running since Monday 08:00, with these breaks. Used by most tests here */
function runningWith(breaks: { day: string; minutes: number }[]): TimeRecord {
  return record([entry(at('2026-11-16', '08:00'), null, { id: 'e1', breaks })])
}

// === Tests ===

describe('the field holds the running entry’s whole break so far', () => {
  it('reads 20 for one break of 20, 45 for 20 and 25, and 0 with none or nothing running', () => {
    expect([
      breakSoFar(runningWith([{ day: '2026-11-16', minutes: 20 }]), JANITOR),
      breakSoFar(
        runningWith([
          { day: '2026-11-16', minutes: 20 },
          { day: '2026-11-16', minutes: 25 },
        ]),
        JANITOR,
      ),
      breakSoFar(runningWith([]), JANITOR),
      breakSoFar(record([]), JANITOR),
    ]).toEqual([20, 45, 0, 0])
  })
})

describe('a higher total adds the difference, dated the day it is added', () => {
  it('adds 45 min dated Wednesday to an entry running since Tuesday 22:00, set at Wednesday 00:20', () => {
    const before = record([entry(at('2026-11-17', '22:00'), null, { id: 'e1' })])
    const done = setBreak(before, JANITOR, 45, moment('2026-11-18', '00:20'))

    expect(done.ok && done.record.entries[0].breaks).toEqual([{ day: '2026-11-18', minutes: 45 }])
  })

  it('makes 20 into 30 the same day by growing that day’s break, and gives the click for the undo', () => {
    const done = setBreak(runningWith([{ day: '2026-11-16', minutes: 20 }]), JANITOR, 30, moment('2026-11-16', '11:00'))

    expect(done.ok && done.record.entries[0].breaks).toEqual([{ day: '2026-11-16', minutes: 30 }])
    expect(done.ok && done.click).toMatchObject({ kind: 'break', entry: 'e1', from: 20, to: 30 })
  })

  it('keeps Monday’s 30 apart when 45 is set on Tuesday, adding 15 dated Tuesday', () => {
    const done = setBreak(runningWith([{ day: '2026-11-16', minutes: 30 }]), JANITOR, 45, moment('2026-11-17', '09:00'))

    expect(done.ok && done.record.entries[0].breaks).toEqual([
      { day: '2026-11-16', minutes: 30 },
      { day: '2026-11-17', minutes: 15 },
    ])
  })
})

describe('a lower total takes time back, off the latest break first', () => {
  it('makes 20 into 10, and 0 takes it all', () => {
    const twenty = runningWith([{ day: '2026-11-16', minutes: 20 }])
    const ten = setBreak(twenty, JANITOR, 10, moment('2026-11-16', '11:00'))
    const none = setBreak(twenty, JANITOR, 0, moment('2026-11-16', '11:00'))

    expect([ten.ok && ten.record.entries[0].breaks, none.ok && none.record.entries[0].breaks]).toEqual([
      [{ day: '2026-11-16', minutes: 10 }],
      [],
    ])
  })

  it('takes Wednesday’s 15 off before Tuesday’s 30 when 45 is set to 30', () => {
    const before = record([
      entry(at('2026-11-17', '22:00'), null, {
        id: 'e1',
        breaks: [
          { day: '2026-11-17', minutes: 30 },
          { day: '2026-11-18', minutes: 15 },
        ],
      }),
    ])
    const done = setBreak(before, JANITOR, 20, moment('2026-11-18', '01:00'))

    expect(done.ok && done.record.entries[0].breaks).toEqual([{ day: '2026-11-17', minutes: 20 }])
  })
})

describe('a total is refused where it cannot go', () => {
  it('refuses a break when nothing runs on the profile on screen, or B is on screen while A runs', () => {
    const running = runningWith([])

    expect([
      setBreak(record([]), JANITOR, 20, moment('2026-11-16', '10:00')),
      setBreak(running, DEVELOPMENT, 20, moment('2026-11-16', '10:00')),
    ]).toEqual([
      { ok: false, why: 'nothing-runs' },
      { ok: false, why: 'nothing-runs' },
    ])
  })

  it('refuses a total of 5 h on an entry that has run 2 h, and 130 min with 60 there already', () => {
    expect([
      setBreak(runningWith([]), JANITOR, 300, moment('2026-11-16', '10:00')),
      setBreak(runningWith([{ day: '2026-11-16', minutes: 60 }]), JANITOR, 130, moment('2026-11-16', '10:00')),
    ]).toEqual([
      { ok: false, why: 'too-long' },
      { ok: false, why: 'too-long' },
    ])
  })

  it('changes nothing for the same total', () => {
    const twenty = runningWith([{ day: '2026-11-16', minutes: 20 }])

    expect(setBreak(twenty, JANITOR, 20, moment('2026-11-16', '10:00'))).toEqual({ ok: false, why: 'no-change' })
  })
})
