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

// === Constants ===

const THIRDS = 3

// === Tests ===

describe("today's pie has a slice for each expected hour, filled as each is worked", () => {
  it('fills three of six slices at 3:52, the last one marked in thirds', () => {
    const today = [entry(at('2026-11-18', '07:00'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '10:52'), THIRDS)).toEqual({
      slices: 6,
      lap: 0,
      filled: 3,
      split: 5,
      parts: 3,
      partsFilled: 0,
    })
  })

  it('counts the running entry to now, so a slice clicks in on the hour', () => {
    const today = [entry(at('2026-11-18', '08:00'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '11:05'), THIRDS)).toMatchObject({ filled: 3 })
    expect(todaySlices(record(today), moment('2026-11-18', '12:00'), THIRDS)).toMatchObject({ filled: 4 })
  })

  it('fills the last slice a third at a time', () => {
    const today = [entry(at('2026-11-18', '07:00'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '12:20'), THIRDS)).toMatchObject({
      filled: 5,
      split: 5,
      partsFilled: 1,
    })
  })

  it('divides expected hours that are not whole into even slices: 6:30 is seven of 55:43', () => {
    const today = [entry(at('2026-11-18', '07:00'), null)]

    expect(todaySlices(record(today, 390), moment('2026-11-18', '09:00'), THIRDS)).toMatchObject({
      slices: 7,
      filled: 2,
    })
    expect(todaySlices(record(today, 390), moment('2026-11-18', '09:52'), THIRDS)).toMatchObject({ filled: 3 })
  })
})

describe('past the expected hours the next lap fills over the last, in thirds as it goes', () => {
  it('fills the second lap over the first at 7:20, the slice filling now in thirds', () => {
    const today = [entry(at('2026-11-18', '07:00'), at('2026-11-18', '12:00')), entry(at('2026-11-18', '12:30'), null)]

    expect(todaySlices(record(today), moment('2026-11-18', '14:50'), THIRDS)).toEqual({
      slices: 6,
      lap: 1,
      filled: 1,
      split: 1,
      parts: 3,
      partsFilled: 1,
    })
  })

  it('runs on into a third lap when the overtime passes a whole lap: 5 h worked of 2 h', () => {
    const today = [entry(at('2026-11-18', '07:00'), null)]

    expect(todaySlices(record(today, 120), moment('2026-11-18', '12:00'), THIRDS)).toMatchObject({
      slices: 2,
      lap: 2,
      filled: 1,
    })
  })
})

describe("today's pie shows only while the janitor works, and counts only today", () => {
  it('shows nothing when nothing runs, or another profile does', () => {
    const stopped = [entry(at('2026-11-18', '07:00'), at('2026-11-18', '10:00'))]
    const other = [entry(at('2026-11-18', '11:00'), null, { profile: 'p2' })]

    expect(todaySlices(record(stopped), moment('2026-11-18', '12:00'), THIRDS)).toBeNull()
    expect(todaySlices(record(other), moment('2026-11-18', '12:00'), THIRDS)).toBeNull()
  })

  it('leaves out yesterday, and the part of an entry before midnight', () => {
    const worked = [entry(at('2026-11-17', '08:00'), at('2026-11-17', '14:00')), entry(at('2026-11-17', '22:00'), null)]

    expect(todaySlices(record(worked), moment('2026-11-18', '02:10'), THIRDS)).toMatchObject({ filled: 2 })
  })

  it('shows no pie on a Saturday', () => {
    const saturday = [entry(at('2026-11-21', '09:00'), null)]

    expect(todaySlices(record(saturday), moment('2026-11-21', '10:00'), THIRDS)).toBeNull()
  })
})
