import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { RUNS } from '$tests/helpers/properties'
import { at, entry } from '$tests/helpers/records'
import { prune, pruneOffer, pruneWords } from '$lib/modules/controls/prune'
import { balanceOnScreen, ceilingMonth, ceilingTrend, payShown } from '$lib/modules/shared/counting'
import { freshRecord, type Entry, type Profile, type TimeRecord } from '$lib/modules/shared/record'

// === Constants ===

const DEV: Profile = {
  id: 'p2',
  name: 'Utveckling',
  hue: 285,
  base: '#a99cf0',
  pay: [{ from: '2027-01-01', kind: 'rate', amount: 24 }],
}

// === Helpers ===

/** Installed on 1 January 2027, the janitor at 6 h of 7 h 39 min, with Utveckling, and any `entries` */
function installed(entries: Entry[] = [], change?: { from: string; minutes: number }): TimeRecord {
  const fresh = freshRecord('Vaktmästare', 0, '2027-01-01')
  const janitor = fresh.profiles[0]
  const expected = [...(janitor.expectedMinutes ?? []), ...(change ? [change] : [])]
  return { ...fresh, profiles: [{ ...janitor, expectedMinutes: expected }, DEV], entries }
}

/** `minutes` of a profile's work from 08:00 on a day */
function work(day: string, minutes: number, profile = DEV.id): Entry {
  const [y, m, d] = day.split('-').map(Number)
  const end = new Date(y, m - 1, d, 8, minutes)
  const two = (n: number): string => String(n).padStart(2, '0')
  const endDay = `${end.getFullYear()}-${two(end.getMonth() + 1)}-${two(end.getDate())}`
  return entry(at(day, '08:00'), at(endDay, `${end.getHours()}:${two(end.getMinutes())}`), { profile })
}

/** Every number the screen shows on a day */
function figures(record: TimeRecord, day: string): number[] {
  const month = ceilingMonth(record, day)
  return [
    balanceOnScreen(record, 'p1', day),
    ceilingTrend(record, day),
    month.used,
    month.ceiling,
    payShown(record, day),
  ]
}

// === Tests ===

describe('a quiet line offers to prune the whole months more than three years old', () => {
  it.each([
    ['2030-01-31', null],
    ['2030-02-01', { cut: '2027-02-01', months: 1 }],
    ['2030-03-03', { cut: '2027-03-01', months: 2 }],
  ])('on %s offers %j', (today, offer) => {
    expect(pruneOffer(installed(), today)).toEqual(offer)
  })

  it.each([
    [1, 'Du har över tre års historik. Rensa den äldsta månaden?'],
    [3, 'Du har över tre års historik. Rensa de äldsta 3 månaderna?'],
  ])('names %i months: %s', (months, words) => {
    expect(pruneWords(months)).toBe(words)
  })
})

describe('a prune cuts at the start of a month, freezing the balance and the trend as openings', () => {
  it("freezes January 2027's balance and deletes its entries", () => {
    const record = installed([work('2027-01-04', 7 * 60, 'p1'), work('2027-02-01', 6 * 60, 'p1')])
    const pruned = prune(record, '2030-02-01')

    expect(pruned.entries).toHaveLength(1)
    expect(pruned.openings).toHaveLength(1)
    expect(pruned.openings[0]).toMatchObject({ profile: 'p1', day: '2027-02-01', balanceMinutes: 60, seconds: 0 })
  })

  it('keeps an entry across the cut whole, its January hour inside the opening', () => {
    const across = entry(at('2027-01-31', '23:00'), at('2027-02-01', '01:00'), { profile: DEV.id })

    expect(prune(installed([across]), '2030-02-01').entries).toEqual([across])
  })

  it('drops the flex days before the cut with the rest', () => {
    const record = installed()
    record.profiles[0].flexDays = ['2027-01-15', '2027-02-15']

    expect(prune(record, '2030-02-01').profiles[0].flexDays).toEqual(['2027-02-15'])
  })

  it.each([
    // January 2027 has 21 weekdays: its ceiling is 21 × 1 h 39 min, 34 h 39 min, so 36 h 39 min is +2:00
    ['the ceiling unchanged, January +2:00', [work('2027-01-04', 36 * 60 + 39)], undefined, '2030-02-01', 2 * 3600],
    [
      'the split changed from 1 September 2028',
      [work('2027-01-04', 36 * 60 + 39)],
      { from: '2028-09-01', minutes: 300 },
      '2030-02-01',
      undefined,
    ],
    [
      'the split changed from 1 February 2027, where the cut falls',
      [work('2027-01-04', 36 * 60 + 39)],
      { from: '2027-02-01', minutes: 300 },
      '2030-02-01',
      undefined,
    ],
  ])('stores the trend when %s: %s', (_case, entries, change, today, trend) => {
    expect(prune(installed(entries, change), today).openings[0].trendSeconds).toBe(trend)
  })

  it('stops counting a stored trend once the split changes after the cut', () => {
    const pruned = prune(installed([work('2027-01-04', 36 * 60 + 39)]), '2030-02-01')
    const changed = {
      ...pruned,
      profiles: pruned.profiles.map((p) =>
        p.id === 'p1'
          ? { ...p, expectedMinutes: [...(p.expectedMinutes ?? []), { from: '2030-03-01', minutes: 300 }] }
          : p,
      ),
    }

    expect(ceilingTrend(changed, '2030-03-10')).toBe(0)
  })
})

describe('a prune never changes a number on screen', () => {
  const DAYS = fc.integer({ min: 0, max: 1300 }).map((n) => {
    const d = new Date(2027, 0, 1 + n)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  const WORK = fc.record({
    day: DAYS,
    minutes: fc.integer({ min: 30, max: 20 * 60 }),
    profile: fc.constantFrom('p1', 'p2'),
  })
  const CASE = fc.record({
    work: fc.array(WORK, { maxLength: 30 }),
    flex: fc.array(DAYS, { maxLength: 4 }),
    change: fc.option(fc.record({ from: DAYS, minutes: fc.integer({ min: 240, max: 420 }) })),
    today: fc.integer({ min: 1125, max: 1400 }).map((n) => {
      const d = new Date(2027, 0, 1 + n)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }),
  })

  it(
    'holds for any record and any day a prune is offered',
    () => {
      fc.assert(
        fc.property(CASE, ({ work: done, flex, change, today }) => {
          const entries = [...done]
            .sort((a, b) => (a.day < b.day ? -1 : 1))
            .reduce<Entry[]>((list, w) => {
              const last = list.at(-1)
              const made = work(w.day, w.minutes, w.profile)
              return last && last.stop && Date.parse(made.start) < Date.parse(last.stop) ? list : [...list, made]
            }, [])
          const record = installed(entries, change ?? undefined)
          record.profiles[0].flexDays = [...new Set(flex)].sort()
          if (pruneOffer(record, today) === null) return
          expect(figures(prune(record, today), today)).toEqual(figures(record, today))
        }),
        { numRuns: RUNS },
      )
    },
    Math.max(5000, RUNS * 5),
  )
})
