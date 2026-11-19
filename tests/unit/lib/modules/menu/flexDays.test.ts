import { describe, expect, it } from 'vitest'
import { calendarMonth, daysAhead, monthAfter, toggleFlexDay } from '$lib/modules/menu/flexDays'
import { type TimeRecord } from '$lib/modules/shared/record'
import { RECORD } from '$tests/helpers/records'

// === Constants ===

// 19 November 2026 is a Thursday
const TODAY = '2026-11-19'

// === Helpers ===

/** The shared record with these flex days on the janitor. Used by every test here */
function withFlexDays(flexDays: string[]): TimeRecord {
  return { ...RECORD, profiles: RECORD.profiles.map((p) => ({ ...p, flexDays })) }
}

/** The janitor's flex days in a record. Used to read what a click left */
function flexDaysOf(record: TimeRecord): string[] {
  return record.profiles[0].flexDays ?? []
}

// === Tests ===

describe('a click marks a weekday, today or ahead, and a second click unmarks it', () => {
  it('marks Friday 11 December, kept in order with the days already marked', () => {
    const done = toggleFlexDay(withFlexDays(['2026-12-14']), '2026-12-11', TODAY, false)

    expect(done.ok && flexDaysOf(done.record)).toEqual(['2026-12-11', '2026-12-14'])
  })

  it('marks today', () => {
    const done = toggleFlexDay(withFlexDays([]), TODAY, TODAY, false)

    expect(done.ok && flexDaysOf(done.record)).toEqual([TODAY])
  })

  it('unmarks a marked day, which gives its hours back', () => {
    const done = toggleFlexDay(withFlexDays(['2026-12-11']), '2026-12-11', TODAY, false)

    expect(done.ok && flexDaysOf(done.record)).toEqual([])
  })
})

describe('a weekend is never a flex day', () => {
  it('refuses Saturday 21 November, whatever the padlock', () => {
    expect(toggleFlexDay(withFlexDays([]), '2026-11-21', TODAY, true)).toEqual({ ok: false, why: 'weekend' })
  })
})

describe('days gone by are locked until the padlock is opened', () => {
  it('refuses yesterday while locked', () => {
    expect(toggleFlexDay(withFlexDays([]), '2026-11-18', TODAY, false)).toEqual({ ok: false, why: 'past' })
  })

  it('marks yesterday, and unmarks a past flex day, once unlocked', () => {
    const marked = toggleFlexDay(withFlexDays([]), '2026-11-18', TODAY, true)
    const unmarked = toggleFlexDay(withFlexDays(['2026-11-16']), '2026-11-16', TODAY, true)

    expect([marked.ok && flexDaysOf(marked.record), unmarked.ok && flexDaysOf(unmarked.record)]).toEqual([
      ['2026-11-18'],
      [],
    ])
  })
})

describe('the list beside the calendar holds every marked day from today on, a line per month', () => {
  it('reads dec 7 8, then 2027, then mar 19, seen in November 2026', () => {
    const record = withFlexDays(['2026-11-16', '2026-12-07', '2026-12-08', '2027-03-19'])

    expect(daysAhead(record, TODAY)).toEqual([
      { kind: 'month', key: '2026-12', name: 'dec', days: ['2026-12-07', '2026-12-08'] },
      { kind: 'year', key: '2027', year: '2027' },
      { kind: 'month', key: '2027-03', name: 'mar', days: ['2027-03-19'] },
    ])
  })

  it('holds today, and nothing when no day ahead is marked', () => {
    expect([daysAhead(withFlexDays([TODAY]), TODAY).length, daysAhead(withFlexDays([]), TODAY)]).toEqual([1, []])
  })
})

describe('the calendar shows a month, its weeks starting on Monday', () => {
  it('starts November 2026, whose 1st is a Sunday, after six empty days, and holds its 30 days', () => {
    const month = calendarMonth('2026-11-01')

    expect([month.lead, month.days.length, month.days[0], month.days[29]]).toEqual([6, 30, '2026-11-01', '2026-11-30'])
  })

  it('steps to the months either side, across a year', () => {
    expect([monthAfter('2026-12-01', 1), monthAfter('2026-01-01', -1)]).toEqual(['2027-01-01', '2025-12-01'])
  })
})
