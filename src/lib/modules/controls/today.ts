/**
 * Today's pie: how much of today's expected hours the profile with the balance has worked, as whole slices, while it
 * works ("Today's pie"). Counted live, the running entry up to now.
 */

import { expectedSecondsOn, localDay, secondsByDay } from '$lib/modules/shared/counting'
import { type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/**
 * What the pie shows. Each lap of slices is a slice's worth of the expected hours per slice; the first lap is in the
 * base colour, the second in the neon over it, the third in the base again, and so on.
 */
export interface TodaySlices {
  /** The expected hours today, rounded to whole hours, at least one; the expected time divides evenly among them */
  slices: number
  /** The lap filling now: 0 the first, in the base colour; odd laps in the neon, even ones in the base */
  lap: number
  /** How many slices of this lap are full, from 12 o'clock; the rest show the lap before, or are empty on the first */
  filled: number
  /** The slice drawn in parts: on the first lap always the last, marked from the start; later, the one filling now */
  split: number
  /** How many parts that slice fills in */
  parts: number
  /** How many of its parts are full, in this lap's colour */
  partsFilled: number
}

/**
 * The pie at `now`, for the profile with the balance while an entry of it runs; null when none runs, or the profile
 * has no expected hours today, as on a weekend. Used by the pie at every start and stop and once a minute: 3:52
 * worked of 6 h in thirds gives { slices: 6, lap: 0, filled: 3, split: 5, parts: 3, partsFilled: 0 }; 6:30
 * expected gives seven slices of 55:43.
 * @param parts - how many parts the slice filling at the end of a lap is drawn in
 */
export function todaySlices(record: TimeRecord, now: Date, parts: number): TodaySlices | null {
  const profile = record.profiles.find((p) => p.expectedMinutes !== undefined)
  if (profile === undefined) return null
  if (!record.entries.some((e) => e.profile === profile.id && e.stop === null)) return null
  const today = localDay(now.getTime())
  const expected = expectedSecondsOn(today, profile)
  if (expected === 0) return null

  const nowStamp = now.toISOString()
  let worked = 0
  for (const entry of record.entries) {
    if (entry.profile !== profile.id) continue
    worked += secondsByDay({ ...entry, stop: entry.stop ?? nowStamp }).get(today) ?? 0
  }

  // Counted in seconds times slices and parts, so a part clicks in on its exact second, with no rounding drift
  const slices = Math.max(1, Math.round(expected / HOUR))
  const whole = Math.floor((worked * slices) / expected)
  const lap = Math.floor(whole / slices)
  const filled = whole % slices
  const split = lap === 0 ? slices - 1 : filled
  const into = worked * slices * parts - (lap * slices + split) * expected * parts
  const partsFilled = into > 0 ? Math.min(parts - 1, Math.floor(into / expected)) : 0
  return { slices, lap, filled, split, parts, partsFilled }
}

// ======================================
//               Helpers
// ======================================

const HOUR = 3600
