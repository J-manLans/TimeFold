/**
 * The dashboard's figures as numbers: the flex bar's scale, how far it reaches and which side it is on, and the balance
 * as text ("The flex bar"). Works in seconds, as the counting does; what is shown goes by the whole minutes shown.
 */

import { balance, ceilingMonth, shownMinutes } from '$lib/modules/shared/counting'
import { type Day, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** A side of the flex bar's 0 line, or the marker on it */
export type BarSide = 'minus' | 'zero' | 'plus'

/** The flex bar's scales, the full width of one side, in seconds: ±10, ±20, ±40 and ±80 h */
export const BAR_SCALES = [10, 20, 40, 80].map((hours) => hours * 3600)

/**
 * The flex bar's scale for a balance: the smallest whose 90% holds it, growing at once but going back down only once
 * the balance is within 80% of the smaller scale, so it does not flicker at a boundary. Used at every balance: +21:00
 * on ±20 h grows to ±40 h, and then +17:00 stays there.
 * @param current - the scale shown now, or null when there is none yet
 * @returns seconds; ±80 h for anything beyond it
 */
export function barScale(seconds: number, current: number | null): number {
  const size = Math.abs(seconds)
  const fit = BAR_SCALES.find((scale) => size <= FIT.up * scale) ?? BAR_SCALES[BAR_SCALES.length - 1]
  if (current === null || fit >= current) return fit
  let scale = current
  for (let i = BAR_SCALES.indexOf(current); i > 0 && size <= FIT.down * BAR_SCALES[i - 1]; i--)
    scale = BAR_SCALES[i - 1]
  return scale
}

/**
 * How far the bar reaches along its side, from the 0 line to the scale's end. Used to draw the bar: +12:00 on ±20 h
 * reaches 0.6.
 * @returns 0 to 1; 1 beyond the scale
 */
export function barReach(seconds: number, scale: number): number {
  return Math.min(Math.abs(seconds), scale) / scale
}

/**
 * Which side of the 0 line a balance falls on, by the minutes shown: under half a minute either way is 0. Used for the
 * bar's colour and the number's: minus in the base colour, plus in the neon, 0 the dimmed marker.
 */
export function barSide(seconds: number): BarSide {
  const minutes = shownMinutes(seconds)
  return minutes < 0 ? 'minus' : minutes > 0 ? 'plus' : 'zero'
}

/**
 * The balance as shown above the bar: a sign, hours and minutes. Used for the balance number: −3:00, +5:00, 0:00.
 */
export function balanceText(seconds: number): string {
  const minutes = shownMinutes(seconds)
  const sign = minutes < 0 ? '−' : minutes > 0 ? '+' : ''
  const size = Math.abs(minutes)
  return `${sign}${Math.floor(size / 60)}:${String(size % 60).padStart(2, '0')}`
}

/**
 * Whether a profile stands over its line now: the balance profile when its balance shows plus, any other when the
 * month's ceiling is passed; exactly 0, or the ceiling just reached, is not over. Used for the colours that follow where
 * the profile stands, its letter, its circle and the focus rings: +5:00 is over, 0:00 and −3:00 are not.
 * @throws if the record has no profile `profileId`
 */
export function standsOver(record: TimeRecord, profileId: string, day: Day): boolean {
  const profile = record.profiles.find((p) => p.id === profileId)
  if (profile === undefined) throw new Error(`No profile ${profileId} in the record`)
  if (profile.expectedMinutes !== undefined) return barSide(balance(record, profileId, day)) === 'plus'
  const month = ceilingMonth(record, day)
  return month.used > month.ceiling
}

// ======================================
//               Helpers
// ======================================

/** The share of a scale a balance may fill before the scale grows, and must be under before it shrinks */
const FIT = { up: 0.9, down: 0.8 }
