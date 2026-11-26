import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { RUNS } from '$tests/helpers/properties'
import { RECORD } from '$tests/helpers/records'
import {
  earlierValues,
  firstOfNextMonth,
  savePay,
  saveFullTime,
  saveSplit,
  saveTax,
  splitWeek,
  fullTimeWeek,
} from '$lib/modules/menu/workTime'
import type { TimeRecord } from '$lib/modules/shared/record'

// === Helpers ===

/** The janitor Vaktmästare at `split` a week of a full time of `full` a week, both since 1 January 2026 */
function weeks(full: number, split: number): TimeRecord {
  return {
    ...RECORD,
    profiles: [
      { ...RECORD.profiles[0], name: 'Vaktmästare', expectedMinutes: [{ from: '2026-01-01', minutes: split / 5 }] },
    ],
    fullTime: [{ from: '2026-01-01', minutes: full / 5 }],
  }
}

const H = 60
const FULL = 38 * H + 15
const SPLIT = 30 * H

/** The record after a save, failing the test when it is refused */
function saved(result: TimeRecord | { refusal: string }): TimeRecord {
  if ('refusal' in result) throw new Error(result.refusal)
  return result
}

// === Tests ===

describe('full time and the split are entered as a week and counted as a fifth of it each weekday', () => {
  it('reads 38 h 15 min and 30 h back as weeks, 7 h 39 min and 6 h a weekday', () => {
    const record = weeks(FULL, SPLIT)

    expect([fullTimeWeek(record, '2026-11-26'), splitWeek(record, '2026-11-26')]).toEqual([FULL, SPLIT])
    expect([record.fullTime[0].minutes, record.profiles[0].expectedMinutes?.[0].minutes]).toEqual([459, 360])
  })

  it.each([38 * H + 16, 38 * H + 10])('refuses a week of %i minutes, not in quarter hours', (week) => {
    expect(saveFullTime(weeks(FULL, SPLIT), week, '2026-12-01')).toEqual({
      refusal: 'Ange veckan i steg om 15 minuter',
    })
  })
})

describe("janitor's hours are never more than full time, on any day from a change's date", () => {
  it.each([
    [
      'Heltid 28 h from today',
      (r: TimeRecord) => saveFullTime(r, 28 * H, '2026-11-26'),
      'Vaktmästare har 30h. Minska fördelningen först.',
    ],
    [
      'Heltid first, 28 h from 1 December',
      (r: TimeRecord) => saveFullTime(r, 28 * H, '2026-12-01'),
      'Vaktmästare har 30h. Minska fördelningen först.',
    ],
    [
      'the split 25 h from 1 December, then Heltid 28 h from 1 November',
      (r: TimeRecord) => saveFullTime(saved(saveSplit(r, 25 * H, '2026-12-01')), 28 * H, '2026-11-01'),
      'Vaktmästare har 30h. Minska fördelningen först.',
    ],
  ])('refuses %s', (_case, change, refusal) => {
    expect(change(weeks(FULL, SPLIT))).toEqual({ refusal })
  })

  it('saves the split 25 h from 1 December, then Heltid 28 h from 1 December: 25 h | 3 h', () => {
    const record = saved(saveFullTime(saved(saveSplit(weeks(FULL, SPLIT), 25 * H, '2026-12-01')), 28 * H, '2026-12-01'))

    expect([fullTimeWeek(record, '2026-12-01'), splitWeek(record, '2026-12-01')]).toEqual([28 * H, 25 * H])
  })

  it('saves Heltid 30 h, leaving a ceiling of 0, and never refuses a raise', () => {
    expect('refusal' in saveFullTime(weeks(FULL, SPLIT), 30 * H, '2026-12-01')).toBe(false)
    expect('refusal' in saveFullTime(weeks(FULL, SPLIT), 45 * H, '2026-12-01')).toBe(false)
  })

  it('names a later change in the way: "Vaktmästare har 35h från 1 januari 2027"', () => {
    const record = saved(saveSplit(weeks(40 * H, SPLIT), 35 * H, '2027-01-01'))

    expect(saveFullTime(record, 32 * H, '2026-12-01')).toEqual({
      refusal: 'Vaktmästare har 35h från 1 januari 2027. Minska fördelningen först.',
    })
  })

  it('refuses the split above an earlier full time: "Heltid är bara 28h från 1 juli 2026."', () => {
    const short = {
      ...weeks(28 * H, 25 * H),
      fullTime: [
        { from: '2026-01-01', minutes: (28 * H) / 5 },
        { from: '2026-09-01', minutes: FULL / 5 },
      ],
    }

    expect(saveSplit(short, SPLIT, '2026-07-01')).toEqual({ refusal: 'Heltid är bara 28h från 1 juli 2026.' })
    expect('refusal' in saveSplit(short, SPLIT, '2026-09-01')).toBe(false)
  })

  it('replaces a value saved from the same date', () => {
    const twice = saved(
      saveFullTime(saved(saveFullTime(weeks(FULL, SPLIT), 40 * H, '2026-12-01')), 42 * H, '2026-12-01'),
    )

    expect(twice.fullTime).toEqual([
      { from: '2026-01-01', minutes: 459 },
      { from: '2026-12-01', minutes: 504 },
    ])
  })

  it(
    'holds after any run of saved changes',
    () => {
      const CHANGE = fc.record({
        what: fc.constantFrom('full', 'split'),
        hours: fc.integer({ min: 20, max: 45 }),
        month: fc.integer({ min: 1, max: 12 }),
        day: fc.integer({ min: 1, max: 28 }),
      })
      fc.assert(
        fc.property(fc.array(CHANGE, { maxLength: 12 }), (changes) => {
          let record = weeks(FULL, SPLIT)
          for (const { what, hours, month, day } of changes) {
            const from = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const result = what === 'full' ? saveFullTime(record, hours * H, from) : saveSplit(record, hours * H, from)
            if (!('refusal' in result)) record = result
          }
          for (let m = 1; m <= 12; m++) {
            for (const d of [1, 15, 28]) {
              const day = `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
              expect(splitWeek(record, day)).toBeLessThanOrEqual(fullTimeWeek(record, day))
            }
          }
        }),
        { numRuns: RUNS },
      )
    },
    Math.max(5000, RUNS),
  )
})

describe('full time and the split open their date on the first of next month', () => {
  it.each([
    ['2026-11-26', '2026-12-01'],
    ['2026-12-01', '2027-01-01'],
  ])('from %s gives %s', (today, first) => {
    expect(firstOfNextMonth(today)).toBe(first)
  })
})

describe('pay is a salary for the profile with the balance and a rate for the others, from a date', () => {
  it('saves 2 100 € as the janitor’s salary from 1 December', () => {
    const record = savePay(RECORD, 'p1', 2100, '2026-12-01')

    expect(record.profiles[0].pay?.at(-1)).toEqual({ from: '2026-12-01', kind: 'salary', amount: 2100 })
  })

  it('saves 24 €/h as another profile’s rate', () => {
    const dev = {
      ...RECORD,
      profiles: [...RECORD.profiles, { id: 'p2', name: 'Utveckling', hue: 285, base: '#a99cf0' }],
    }

    expect(savePay(dev, 'p2', 24, '2026-11-01').profiles[1].pay).toEqual([
      { from: '2026-11-01', kind: 'rate', amount: 24 },
    ])
  })
})

describe('"Skatt och avgifter" is a percentage from 0 to under 100, saved at once', () => {
  it.each([
    [27.5, true],
    [0, true],
    [100, false],
    [-1, false],
    [Number.NaN, false],
  ])('takes %d: %s', (percent, ok) => {
    expect('refusal' in saveTax(RECORD, { after: true, percent })).toBe(!ok)
  })
})

describe('"Tidigare värden" lists every value but the latest saved, newest first, with the days each held', () => {
  it('gives 38 h from 1 January until 30 November, under 40 h from 1 December', () => {
    const values = [
      { from: '2026-12-01', minutes: 480 },
      { from: '2026-01-01', minutes: 456 },
    ]

    expect(earlierValues(values)).toEqual([
      { value: { from: '2026-01-01', minutes: 456 }, from: '2026-01-01', until: '2026-11-30' },
    ])
  })
})
