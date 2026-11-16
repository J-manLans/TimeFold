import { describe, expect, it } from 'vitest'
import { dayInWords, dayLabel, dayShort } from '$lib/modules/dates'

// === Tests ===

describe('a day reads in Swedish words, long, short or as a label', () => {
  it('reads 2026-11-16 as måndag 16 november, mån 16 and MÅN 16 NOV', () => {
    expect([dayInWords('2026-11-16'), dayShort('2026-11-16'), dayLabel('2026-11-16')]).toEqual([
      'måndag 16 november',
      'mån 16',
      'mån 16 nov',
    ])
  })

  it('reads a Sunday at the turn of the year', () => {
    expect(dayInWords('2027-01-03')).toBe('söndag 3 januari')
  })
})
