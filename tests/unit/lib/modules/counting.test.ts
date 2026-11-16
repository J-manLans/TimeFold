import { describe, expect, it } from 'vitest'
import { at, entry } from '$tests/helpers/records'
import {
  balance,
  dayResult,
  expectedSecondsOn,
  monthOf,
  secondsByDay,
  shownMinutes,
  timeOfDay,
} from '$lib/modules/counting'
import { RECORD_FORMAT, RECORD_VERSION, type Entry, type Profile, type TimeRecord } from '$lib/modules/record'

// === Constants ===

const HOUR = 3600

// 16 November 2026 is a Monday
const JANITOR: Profile = {
  id: 'p1',
  name: 'Vaktmästare',
  hue: 195,
  base: '#7ed6d5',
  expectedMinutes: [{ from: '2026-01-01', minutes: 360 }],
}

// === Helpers ===

/** A record of the janitor alone, with an opening on its first day. Used by the balance tests */
function record(entries: Entry[], openingMinutes = 0): TimeRecord {
  return {
    format: RECORD_FORMAT,
    version: RECORD_VERSION,
    profiles: [JANITOR],
    openings: [{ profile: JANITOR.id, day: '2026-11-16', balanceMinutes: openingMinutes }],
    fullTime: [{ from: '2026-01-01', minutes: 480 }],
    entries,
  }
}

// === Tests ===

describe('an entry counts on the days it was worked, split at midnight', () => {
  it('gives Tuesday 2 h and Wednesday 1 h for Tuesday 22:00 to Wednesday 01:00', () => {
    const split = secondsByDay(entry(at('2026-11-17', '22:00'), at('2026-11-18', '01:00')))

    expect([...split]).toEqual([
      ['2026-11-17', 2 * HOUR],
      ['2026-11-18', 1 * HOUR],
    ])
  })

  it('keeps the seconds of the clicks', () => {
    const split = secondsByDay(entry(at('2026-11-16', '07:58:40'), at('2026-11-16', '11:30:10')))

    expect([...split]).toEqual([['2026-11-16', 3 * HOUR + 31 * 60 + 30]])
  })

  it('gives nothing for a running entry', () => {
    expect(secondsByDay(entry(at('2026-11-16', '08:00'), null)).size).toBe(0)
  })
})

describe('a profile owes its expected hours Monday to Friday, as set on that day', () => {
  it('owes 6 h on a Monday and nothing on a Saturday', () => {
    expect(expectedSecondsOn('2026-11-16', JANITOR)).toBe(6 * HOUR)
    expect(expectedSecondsOn('2026-11-21', JANITOR)).toBe(0)
  })

  it('owes 6 h in August and 5 h in September when set to 5 from 1 September', () => {
    const changed: Profile = {
      ...JANITOR,
      expectedMinutes: [
        { from: '2026-01-01', minutes: 360 },
        { from: '2026-09-01', minutes: 300 },
      ],
    }

    expect(expectedSecondsOn('2026-08-31', changed)).toBe(6 * HOUR)
    expect(expectedSecondsOn('2026-09-01', changed)).toBe(5 * HOUR)
  })

  it('owes nothing for a profile without expected hours', () => {
    const other: Profile = { id: 'p2', name: 'Utvecklingsgruppen', hue: 200, base: '#4f8fd6' }

    expect(expectedSecondsOn('2026-11-16', other)).toBe(0)
  })
})

describe('a day owes its expected hours only when work started on it', () => {
  it('adds +1 to a Saturday reached from Friday 22:00 to Saturday 01:00', () => {
    const entries = [entry(at('2026-11-20', '22:00'), at('2026-11-21', '01:00'))]

    expect(dayResult('2026-11-21', JANITOR, entries)).toBe(1 * HOUR)
  })

  it('adds +1, not 1 − 6, to a Friday of leave reached from Thursday 22:00', () => {
    const entries = [entry(at('2026-11-19', '22:00'), at('2026-11-20', '01:00'))]

    expect(dayResult('2026-11-20', JANITOR, entries)).toBe(1 * HOUR)
  })

  it('adds 1 + 6 − 6 = +1 to a Monday reached from Sunday night and worked 11:00–17:00', () => {
    const entries = [
      entry(at('2026-11-15', '22:00'), at('2026-11-16', '01:00')),
      entry(at('2026-11-16', '11:00'), at('2026-11-16', '17:00')),
    ]

    expect(dayResult('2026-11-16', JANITOR, entries)).toBe(1 * HOUR)
  })

  it('adds nothing for an empty weekday', () => {
    expect(dayResult('2026-11-18', JANITOR, [])).toBe(0)
  })

  it('leaves out another profile’s work', () => {
    const entries = [entry(at('2026-11-16', '08:00'), at('2026-11-16', '10:00'), { profile: 'p2' })]

    expect(dayResult('2026-11-16', JANITOR, entries)).toBe(0)
  })
})

describe('the balance is the opening plus every day since', () => {
  it('makes +12:30 and a 7 h Monday into +13:30', () => {
    const r = record([entry(at('2026-11-16', '08:00'), at('2026-11-16', '15:00'))], 12 * 60 + 30)

    expect(balance(r, JANITOR.id, '2026-11-16')).toBe(13 * HOUR + 30 * 60)
  })

  it('leaves a running entry out until it stops', () => {
    const r = record([entry(at('2026-11-16', '08:00'), null)], 12 * 60 + 30)

    expect(balance(r, JANITOR.id, '2026-11-16')).toBe(12 * HOUR + 30 * 60)
  })

  it('counts days with no work as nothing, and days of work at their result', () => {
    const r = record(
      [
        entry(at('2026-11-16', '08:00'), at('2026-11-16', '15:00')), // Monday +1
        entry(at('2026-11-18', '08:00'), at('2026-11-18', '13:00')), // Wednesday −1; Tuesday empty
      ],
      0,
    )

    expect(balance(r, JANITOR.id, '2026-11-20')).toBe(0)
  })
})

describe('the app’s month is the calendar month', () => {
  it('runs 1–30 November for 16 November', () => {
    expect(monthOf('2026-11-16')).toEqual({ first: '2026-11-01', last: '2026-11-30' })
  })

  it('ends on 29 February in a leap year', () => {
    expect(monthOf('2028-02-29')).toEqual({ first: '2028-02-01', last: '2028-02-29' })
  })
})

describe('figures are shown to the nearest minute', () => {
  it('shows 3:31:30 as 3:32', () => {
    expect(shownMinutes(3 * HOUR + 31 * 60 + 30)).toBe(3 * 60 + 32)
  })

  it('shows four entries of 1:59:40 as 7:59, not 8:00', () => {
    expect(shownMinutes(4 * (HOUR + 59 * 60 + 40))).toBe(7 * 60 + 59)
  })

  it('rounds a minus balance the same way, away from zero', () => {
    expect(shownMinutes(-(3 * HOUR + 31 * 60 + 30))).toBe(-(3 * 60 + 32))
  })
})

describe('a moment is shown as its time of day on this machine’s clock', () => {
  it('shows hours and minutes, two digits each', () => {
    expect(timeOfDay(at('2026-11-16', '07:58'))).toBe('07:58')
    expect(timeOfDay(at('2026-11-16', '23:05:40'))).toBe('23:05')
  })
})
