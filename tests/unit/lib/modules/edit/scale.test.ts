import { describe, expect, it } from 'vitest'
import { at } from '$tests/helpers/records'
import { ticks } from '$lib/modules/edit/scale'

// === Helpers ===

/** The labels of a view from one moment to another. Used by every test */
function labels(fromDay: string, fromTime: string, toDay: string, toTime: string): string[] {
  return ticks({ from: Date.parse(at(fromDay, fromTime)), to: Date.parse(at(toDay, toTime)) }).map((t) => t.label)
}

// === Tests ===

describe('the scale shows at most eight labels, in the smallest unit that fits', () => {
  it('labels a 15 min view every 5 minutes', () => {
    expect(labels('2026-11-19', '10:02', '2026-11-19', '10:17')).toEqual(['10:05', '10:10', '10:15'])
  })

  it('labels a 9 h view every 2 hours, midnight as its day', () => {
    expect(labels('2026-11-19', '19:30', '2026-11-20', '04:30')).toEqual(['20', '22', 'fre', '02', '04'])
  })

  it('labels a 5-day view one a day', () => {
    expect(labels('2026-11-20', '12:00', '2026-11-25', '12:00')).toEqual([
      'lör 21',
      'sön 22',
      'mån 23',
      'tis 24',
      'ons 25',
    ])
  })

  it('labels a 20-day view by week, on Mondays', () => {
    expect(labels('2026-11-20', '00:00', '2026-12-10', '00:00')).toEqual(['v. 48', 'v. 49', 'v. 50'])
  })

  it('names January by its year among months', () => {
    expect(labels('2026-10-15', '00:00', '2027-03-15', '00:00')).toEqual(['nov', 'dec', '2027', 'feb', 'mar'])
  })
})
