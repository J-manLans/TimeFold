import { describe, expect, it } from 'vitest'
import { calendarMonth, daysAhead, firstDay, monthAfter, toggleFlexDay, workedDays } from '$lib/modules/menu/flexDays'
import { type TimeRecord } from '$lib/modules/shared/record'
import { at, entry, RECORD } from '$tests/helpers/records'

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
    const unmarked = toggleFlexDay(withFlexDays(['2026-11-18']), '2026-11-18', TODAY, true)

    expect([marked.ok && flexDaysOf(marked.record), unmarked.ok && flexDaysOf(unmarked.record)]).toEqual([
      ['2026-11-18'],
      [],
    ])
  })
})

describe("a day before the record's first day is never a flex day, padlock or not", () => {
  it('refuses Friday 13 November on a record whose janitor starts on Monday 16 November, the padlock open', () => {
    expect(toggleFlexDay(withFlexDays([]), '2026-11-13', TODAY, true)).toEqual({ ok: false, why: 'before' })
  })

  it('marks the first day itself once the padlock is open, nothing worked on it', () => {
    const done = toggleFlexDay({ ...withFlexDays([]), entries: [] }, '2026-11-16', TODAY, true)

    expect(done.ok && flexDaysOf(done.record)).toEqual(['2026-11-16'])
  })

  it("takes the first day from the janitor's earliest expected hours", () => {
    expect(firstDay(RECORD)).toBe('2026-11-16')
  })
})

describe('a day janitor work started on is never a flex day, padlock or not', () => {
  it('refuses today once a job has started on it, and a past day worked, even unlocked', () => {
    const record = {
      ...withFlexDays([]),
      entries: [entry(at('2026-11-17', '08:00'), at('2026-11-17', '14:00')), entry(at(TODAY, '08:00'), null)],
    }

    expect([toggleFlexDay(record, TODAY, TODAY, false), toggleFlexDay(record, '2026-11-17', TODAY, true)]).toEqual([
      { ok: false, why: 'worked' },
      { ok: false, why: 'worked' },
    ])
  })

  it('leaves today open until work starts, and out of the lock another profile’s work', () => {
    const record = {
      ...withFlexDays([]),
      entries: [entry(at(TODAY, '08:00'), at(TODAY, '10:00'), { profile: 'p2' })],
    }
    const done = toggleFlexDay(record, TODAY, TODAY, false)

    expect(done.ok && flexDaysOf(done.record)).toEqual([TODAY])
  })

  it('names the days janitor work started on, a running entry’s too', () => {
    const record = {
      ...RECORD,
      entries: [entry(at('2026-11-17', '22:00'), at('2026-11-18', '01:00')), entry(at(TODAY, '08:00'), null)],
    }

    expect([...workedDays(record)]).toEqual(['2026-11-17', TODAY])
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
