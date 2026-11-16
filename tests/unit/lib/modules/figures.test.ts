import { describe, expect, it } from 'vitest'
import { balanceText, barReach, barScale, barSide } from '$lib/modules/figures'

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
