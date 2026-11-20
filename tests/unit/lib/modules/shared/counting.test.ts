import { describe, expect, it } from 'vitest'
import { at, entry } from '$tests/helpers/records'
import {
  balance,
  balanceOnScreen,
  ceilingMonth,
  dayResult,
  expectedSecondsOn,
  monthOf,
  payEstimate,
  secondsByDay,
  shownMinutes,
  timeOfDay,
} from '$lib/modules/shared/counting'
import {
  freshRecord,
  RECORD_FORMAT,
  RECORD_VERSION,
  type Entry,
  type Profile,
  type TimeRecord,
} from '$lib/modules/shared/record'

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
function record(entries: Entry[], openingMinutes = 0, flexDays: string[] = []): TimeRecord {
  return {
    format: RECORD_FORMAT,
    version: RECORD_VERSION,
    profiles: [{ ...JANITOR, flexDays }],
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

// === The ceiling and the pay ===

// May 2026 has 21 weekdays, 10 of them before the 15th; 3 May is a Sunday
const SINCE_NEW_YEAR = '2026-01-01'
const DEV: Profile = { id: 'p2', name: 'Utveckling', hue: 285, base: '#a99cf0' }
const SUPPORT: Profile = { id: 'p3', name: 'Support', hue: 105, base: '#9fc77e' }

/** A record of the janitor, 6 of a full time of 8, and two other profiles. Used by the ceiling and pay tests */
function workRecord(entries: Entry[], janitor: Profile = JANITOR, others: Profile[] = [DEV, SUPPORT]): TimeRecord {
  return {
    format: RECORD_FORMAT,
    version: RECORD_VERSION,
    profiles: [janitor, ...others],
    openings: [{ profile: janitor.id, day: SINCE_NEW_YEAR, balanceMinutes: 0 }],
    fullTime: [{ from: SINCE_NEW_YEAR, minutes: 480 }],
    entries,
  }
}

/** `hours` of work by a profile from 08:00 on a day, running into the next days if long. Used by the ceiling and pay tests */
function work(day: string, hours: number, profile: string): Entry {
  const [y, m, d] = day.split('-').map(Number)
  const end = new Date(y, m - 1, d, 8 + hours)
  const two = (n: number): string => String(n).padStart(2, '0')
  const endDay = `${end.getFullYear()}-${two(end.getMonth() + 1)}-${two(end.getDate())}`
  return entry(at(day, '08:00'), at(endDay, `${end.getHours()}:${two(end.getMinutes())}`), { profile })
}

describe('the other profiles share a ceiling: the rest of full time, on each weekday', () => {
  it('gives 42 h for a month of 21 weekdays at 6 of 8', () => {
    expect(ceilingMonth(workRecord([]), '2026-05-10').ceiling).toBe(42 * HOUR)
  })

  it('gives 10 × 2 + 11 × 3 = 53 h when the split moves to 5 | 3 from the 15th', () => {
    const janitor = {
      ...JANITOR,
      expectedMinutes: [
        { from: SINCE_NEW_YEAR, minutes: 360 },
        { from: '2026-05-15', minutes: 300 },
      ],
    }

    expect(ceilingMonth(workRecord([], janitor), '2026-05-10').ceiling).toBe(53 * HOUR)
  })

  it('uses 2 h of it for two hours of development work on a Sunday', () => {
    expect(ceilingMonth(workRecord([work('2026-05-03', 2, DEV.id)]), '2026-05-10').used).toBe(2 * HOUR)
  })
})

describe('the month the app is first started in has its whole ceiling, whatever day that is', () => {
  // 19 November 2026 is a Thursday, eight weekdays from the month's end
  const FIRST_DAY = '2026-11-19'

  it('gives November its 42 h, its 21 weekdays times 2 h, not the 16 h of the eight left', () => {
    expect(ceilingMonth(freshRecord('Vaktmästare', 0, FIRST_DAY), FIRST_DAY).ceiling).toBe(42 * HOUR)
  })

  it('carries nothing into December after 20 h of other work, which starts at 0 of its 46 h', () => {
    const fresh = freshRecord('Vaktmästare', 0, FIRST_DAY)
    const withDev = { ...fresh, profiles: [...fresh.profiles, DEV], entries: [work(FIRST_DAY, 20, DEV.id)] }

    expect(ceilingMonth(withDev, '2026-12-10')).toMatchObject({ ceiling: 46 * HOUR, used: 0 })
  })

  it('leaves the balance alone: a day before the first owes nothing', () => {
    const janitor = freshRecord('Vaktmästare', 0, FIRST_DAY).profiles[0]

    expect(expectedSecondsOn('2026-11-16', janitor)).toBe(0)
  })
})

describe("the ceiling's hours lie in the order they were worked, each with its profile", () => {
  it('keeps A, B, then A again as three pieces', () => {
    const entries = [work('2026-05-04', 2, DEV.id), work('2026-05-05', 2, SUPPORT.id), work('2026-05-06', 2, DEV.id)]

    expect(ceilingMonth(workRecord(entries), '2026-05-10').pieces).toEqual([
      { profile: DEV.id, seconds: 2 * HOUR },
      { profile: SUPPORT.id, seconds: 2 * HOUR },
      { profile: DEV.id, seconds: 2 * HOUR },
    ])
  })
})

describe('hours over a month’s ceiling carry into the next, first and with their profile', () => {
  it('starts June at 0 used after 30 h in May', () => {
    expect(ceilingMonth(workRecord([work('2026-05-04', 30, DEV.id)]), '2026-06-10').used).toBe(0)
  })

  it('starts June with 4 h used after 46 h in May, the carried hours first', () => {
    const entries = [work('2026-05-04', 10, DEV.id), work('2026-05-11', 36, SUPPORT.id), work('2026-06-02', 1, DEV.id)]

    expect(ceilingMonth(workRecord(entries), '2026-06-10').pieces).toEqual([
      { profile: SUPPORT.id, seconds: 4 * HOUR },
      { profile: DEV.id, seconds: 1 * HOUR },
    ])
  })
})

describe("the pay estimate is the month's salaries plus its hours times their rates", () => {
  const salaried = { ...JANITOR, pay: [{ from: '2026-05-16', kind: 'salary' as const, amount: 1700 }] }
  const rated = { ...DEV, pay: [{ from: SINCE_NEW_YEAR, kind: 'rate' as const, amount: 26 }] }

  it('gives 1 700 € for the janitor salary alone, from the middle of the month', () => {
    expect(payEstimate(workRecord([], salaried, [rated]), '2026-05-20')).toBe(1700)
  })

  it('gives 1 960 € after 10 h of development at 26 €/h, and no more for an 8 h janitor day', () => {
    const entries = [work('2026-05-18', 10, DEV.id), work('2026-05-19', 8, JANITOR.id)]

    expect(payEstimate(workRecord(entries, salaried, [rated]), '2026-05-20')).toBe(1960)
  })

  it('keeps February’s hours at 20 €/h when the rate rises to 22 from 1 March', () => {
    const raised = {
      ...DEV,
      pay: [
        { from: SINCE_NEW_YEAR, kind: 'rate' as const, amount: 20 },
        { from: '2026-03-01', kind: 'rate' as const, amount: 22 },
      ],
    }
    const entries = [work('2026-02-27', 3, DEV.id)]

    expect(payEstimate(workRecord(entries, JANITOR, [raised]), '2026-02-28')).toBe(60)
  })

  it('gives June 1 726 € after 46 h in May and 1 h in June: the 4 h carried on the wheel were paid in May', () => {
    const entries = [work('2026-05-04', 46, DEV.id), work('2026-06-02', 1, DEV.id)]
    const june = workRecord(entries, salaried, [rated])

    expect(ceilingMonth(june, '2026-06-10').used).toBe(5 * HOUR)
    expect(payEstimate(june, '2026-06-10')).toBe(1726)
  })
})

describe('an added break comes off its entry on the day it was added, and any rest off the day before', () => {
  it('leaves 3 h 15 min of 08:00–12:00 with a 45 min break', () => {
    const e = entry(at('2026-11-16', '08:00'), at('2026-11-16', '12:00'), {
      breaks: [{ day: '2026-11-16', minutes: 45 }],
    })

    expect(secondsByDay(e)).toEqual(new Map([['2026-11-16', 3 * HOUR + 15 * 60]]))
  })

  it('gives Tuesday 2 h and Wednesday 30 min for Tuesday 22:00 to Wednesday 01:00 with 30 min added on Wednesday', () => {
    const e = entry(at('2026-11-17', '22:00'), at('2026-11-18', '01:00'), {
      breaks: [{ day: '2026-11-18', minutes: 30 }],
    })

    expect(secondsByDay(e)).toEqual(
      new Map([
        ['2026-11-17', 2 * HOUR],
        ['2026-11-18', 30 * 60],
      ]),
    )
  })

  it('gives Wednesday 0 and Tuesday 1 h 35 min for 45 min added at Wednesday 00:20 to an entry since Tuesday 22:00', () => {
    const e = entry(at('2026-11-17', '22:00'), at('2026-11-18', '00:20'), {
      breaks: [{ day: '2026-11-18', minutes: 45 }],
    })

    expect(secondsByDay(e)).toEqual(
      new Map([
        ['2026-11-17', HOUR + 35 * 60],
        ['2026-11-18', 0],
      ]),
    )
  })

  it('counts 10 min more for a break of 35 min than one of 45', () => {
    const day = (minutes: number): number =>
      secondsByDay(
        entry(at('2026-11-16', '08:00'), at('2026-11-16', '12:00'), { breaks: [{ day: '2026-11-16', minutes }] }),
      ).get('2026-11-16') ?? 0

    expect(day(35) - day(45)).toBe(10 * 60)
  })
})

describe('a flex day takes off the full expected hours, and is charged once even when worked', () => {
  const flex = { ...JANITOR, flexDays: ['2026-11-18'] }

  it('adds −6 for a flex day with nothing worked', () => {
    expect(dayResult('2026-11-18', flex, [])).toBe(-6 * HOUR)
  })

  it('adds 3 − 6 = −3 for three hours worked on a flex day', () => {
    const entries = [entry(at('2026-11-18', '08:00'), at('2026-11-18', '11:00'))]

    expect(dayResult('2026-11-18', flex, entries)).toBe(-3 * HOUR)
  })

  it('adds 6 − 6 = 0 for a flex day still marked and worked 6 h, as any workday', () => {
    const entries = [entry(at('2026-11-18', '08:00'), at('2026-11-18', '14:00'))]

    expect(dayResult('2026-11-18', flex, entries)).toBe(0)
  })
})

describe('the balance on screen counts every flex day at once, ahead ones included', () => {
  // +4:37 on 17 November, from the opening alone
  const opening = 4 * 60 + 37

  it('shows −1:23 at once for a flex day on 11 December marked on 17 November', () => {
    const r = record([], opening, ['2026-12-11'])

    expect(balanceOnScreen(r, JANITOR.id, '2026-11-17')).toBe(-(HOUR + 23 * 60))
  })

  it('is back at +4:37 once the day is unmarked', () => {
    expect(balanceOnScreen(record([], opening), JANITOR.id, '2026-11-17')).toBe(opening * 60)
  })

  it('stays −1:23 after the day when nothing more was worked beyond the expected hours', () => {
    const r = record([], opening, ['2026-12-11'])

    expect(balanceOnScreen(r, JANITOR.id, '2026-12-14')).toBe(-(HOUR + 23 * 60))
  })

  it('costs 5 h for a day marked ahead when expected hours change to 5 from 1 December', () => {
    const r = record([], 0, ['2026-12-11'])
    r.profiles[0].expectedMinutes = [
      { from: '2026-01-01', minutes: 360 },
      { from: '2026-12-01', minutes: 300 },
    ]

    expect(balanceOnScreen(r, JANITOR.id, '2026-11-17')).toBe(-5 * HOUR)
  })

  it('leaves a flex day ahead out of a balance counted to an earlier day', () => {
    const r = record([], opening, ['2026-12-11'])

    expect(balance(r, JANITOR.id, '2026-11-30')).toBe(opening * 60)
  })
})
