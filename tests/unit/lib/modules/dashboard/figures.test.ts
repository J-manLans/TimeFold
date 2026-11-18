import { describe, expect, it } from 'vitest'
import { at, entry, RECORD } from '$tests/helpers/records'
import { balanceText, barReach, barScale, barSide, standsOver } from '$lib/modules/dashboard/figures'
import { type TimeRecord } from '$lib/modules/shared/record'

// === Constants ===

const HOUR = 3600

// === Tests ===

describe('the flex bar takes the smallest scale whose 90% holds the balance', () => {
  it('shows +12:00 on ±20 h, reaching 60% of its side', () => {
    const scale = barScale(12 * HOUR, null)

    expect(scale).toBe(20 * HOUR)
    expect(barReach(12 * HOUR, scale)).toBeCloseTo(0.6)
  })

  it('grows to ±40 h at +21:00, stays there at +17:00, and returns to ±20 h at +15:00', () => {
    const grown = barScale(21 * HOUR, 20 * HOUR)
    const kept = barScale(17 * HOUR, grown)
    const back = barScale(15 * HOUR, kept)

    expect([grown, kept, back]).toEqual([40 * HOUR, 40 * HOUR, 20 * HOUR])
  })

  it('stays full at its end beyond ±80 h', () => {
    const scale = barScale(-95 * HOUR, null)

    expect(scale).toBe(80 * HOUR)
    expect(barReach(-95 * HOUR, scale)).toBe(1)
  })
})

describe('the balance is a side of the bar and a number, by the minutes shown', () => {
  it('reads −3:00 on the minus side and +5:00 on the plus side', () => {
    expect([barSide(-3 * HOUR), balanceText(-3 * HOUR)]).toEqual(['minus', '−3:00'])
    expect([barSide(5 * HOUR), balanceText(5 * HOUR)]).toEqual(['plus', '+5:00'])
  })

  it('reads 0:00, at the 0 marker, for under half a minute either way', () => {
    expect([barSide(20), balanceText(20)]).toEqual(['zero', '0:00'])
    expect([barSide(-20), balanceText(-20)]).toEqual(['zero', '0:00'])
  })
})

describe('a profile stands over its line in plus, or past the ceiling; at 0 it does not', () => {
  /** The shared record with the janitor's opening at `minutes` and a development profile's work. Used below */
  function standing(minutes: number, devHours = 0): TimeRecord {
    const dev = { id: 'p2', name: 'Utveckling', hue: 285, base: '#a99cf0' }
    const work =
      devHours > 0
        ? [entry(at('2026-11-17', '08:00'), at('2026-11-18', `${8 + devHours - 24}:00`), { profile: dev.id })]
        : []
    return {
      ...RECORD,
      profiles: [...RECORD.profiles, dev],
      openings: [{ ...RECORD.openings[0], balanceMinutes: minutes }],
      entries: work,
    }
  }

  it('puts the janitor over at +5:00, and not at 0:00 or −3:00', () => {
    const day = '2026-11-16'

    expect([300, 0, -180].map((minutes) => standsOver(standing(minutes), 'p1', day))).toEqual([true, false, false])
  })

  it('puts another profile over once the month’s 22 h ceiling is passed', () => {
    const day = '2026-11-20'

    expect([standsOver(standing(0, 23), 'p2', day), standsOver(standing(0, 21), 'p2', day)]).toEqual([true, false])
  })
})
