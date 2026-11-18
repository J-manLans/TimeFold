import { describe, expect, it } from 'vitest'
import { todaySlices } from '$lib/modules/controls/today'
import { type Entry, type TimeRecord } from '$lib/modules/shared/record'
import { at, entry, RECORD } from '$tests/helpers/records'

// === Helpers ===

/** The shared record, its janitor expected `minutes` a day (6 h unless given), with the given entries */
function record(entries: Entry[], minutes = 360): TimeRecord {
  const [janitor] = RECORD.profiles
  return {
    ...RECORD,
    profiles: [
      { ...janitor, expectedMinutes: [{ from: '2026-11-16', minutes }] },
      { id: 'p2', name: 'Utvecklingsgruppen', hue: 285, base: '#7368d4' },
    ],
    entries,
  }
}

/** A moment as a Date: moment('2026-11-18', '11:05'). Used as "now" in every test */
function moment(day: string, time: string): Date {
  return new Date(at(day, time))
}

// === Tests ===

describe("today's pie has a slice for each expected hour, filled as each is worked", () => {
  it('fills three of six slices at 3:52, the entry still running', () => {
    const today = [entry(at('2026-11-18', '07:00'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '10:52'))).toEqual({ slices: 6, done: 3, over: 0 })
  })

  it('counts the running entry to now, so a slice clicks in on the hour', () => {
    const today = [entry(at('2026-11-18', '08:00'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '11:05'))).toMatchObject({ done: 3 })
    expect(todaySlices(record(today), moment('2026-11-18', '12:00'))).toMatchObject({ done: 4 })
  })

  it('fills all six past the expected hours, and laps the neon over them', () => {
    const today = [entry(at('2026-11-18', '07:00'), at('2026-11-18', '12:00')), entry(at('2026-11-18', '12:30'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '14:50'))).toEqual({ slices: 6, done: 6, over: 1 })
  })

  it('divides expected hours that are not whole into even slices: 6:30 is seven of 55:43', () => {
    const today = [entry(at('2026-11-18', '07:00'), null)]

    expect(todaySlices(record(today, 390), moment('2026-11-18', '09:00'))).toEqual({ slices: 7, done: 2, over: 0 })
    expect(todaySlices(record(today, 390), moment('2026-11-18', '09:52'))).toMatchObject({ done: 3 })
  })
})

describe("today's pie shows only while the janitor works, and counts only today", () => {
  it('shows nothing when nothing runs, or another profile does', () => {
    const stopped = [entry(at('2026-11-18', '07:00'), at('2026-11-18', '10:00'))]
    const other = [entry(at('2026-11-18', '11:00'), null, { profile: 'p2' })]

    expect(todaySlices(record(stopped), moment('2026-11-18', '12:00'))).toBeNull()
    expect(todaySlices(record(other), moment('2026-11-18', '12:00'))).toBeNull()
  })

  it('leaves out yesterday, and the part of an entry before midnight', () => {
    const worked = [entry(at('2026-11-17', '08:00'), at('2026-11-17', '14:00')), entry(at('2026-11-17', '22:00'), null)]

    expect(todaySlices(record(worked), moment('2026-11-18', '02:10'))).toMatchObject({ done: 2 })
  })

  it('shows no pie on a Saturday', () => {
    expect(todaySlices(record([entry(at('2026-11-21', '09:00'), null)]), moment('2026-11-21', '10:00'))).toBeNull()
  })
})
