import { describe, expect, it } from 'vitest'
import { BALANCE, BREAK, durationText, fitsShape, readDuration } from '$lib/modules/shared/timeInput'

// === Tests ===

describe('a typed duration is minutes alone or hours and minutes, with a sign where allowed', () => {
  it('reads 12:30 as 750, -3:00 as −180, +5 and 5 as 5, and 105:00 as 6300', () => {
    const typed = ['12:30', '-3:00', '+5', '5', '105:00']

    expect(typed.map((text) => readDuration(text, BALANCE))).toEqual([750, -180, 5, 5, 6300])
  })

  it('reads nothing from what is not a whole duration yet', () => {
    expect(['12:', '-', ''].map((text) => readDuration(text, BALANCE))).toEqual([null, null, null])
  })

  it('reads no sign in a break', () => {
    expect([readDuration('1:20', BREAK), readDuration('-5', BREAK)]).toEqual([80, null])
  })
})

describe('each keystroke keeps the shape: minutes at most 59, and only the digits each field allows', () => {
  it('refuses a third minute digit, a minute past 59, a fourth digit and a letter', () => {
    expect(['12:305', '12:7', '1234', '1h'].map((text) => fitsShape(text, BALANCE))).toEqual([
      false,
      false,
      false,
      false,
    ])
  })

  it('lets a duration still being typed through', () => {
    expect(['-12:', '12:5', '-', ''].map((text) => fitsShape(text, BALANCE))).toEqual([true, true, true, true])
  })

  it('allows the balance a sign and three digits of hours, and a break neither', () => {
    expect([fitsShape('-105:00', BALANCE), fitsShape('-5', BREAK), fitsShape('105:00', BREAK)]).toEqual([
      true,
      false,
      false,
    ])
  })
})

describe('a duration in words has its unit against its number', () => {
  it('writes 5 as 5min, 80 as 1h 20min, 6300 as 105h and 0 as 0min', () => {
    expect([5, 80, 6300, 0].map((minutes) => durationText(minutes))).toEqual(['5min', '1h 20min', '105h', '0min'])
  })

  it('writes the sign when asked: −12h 30min and +12h 30min', () => {
    expect([durationText(-750, true), durationText(750, true)]).toEqual(['−12h 30min', '+12h 30min'])
  })
})
