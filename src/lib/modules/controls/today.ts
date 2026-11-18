/**
 * Today's pie: how much of today's expected hours the profile with the balance has worked, as whole slices, while it
 * works ("Today's pie"). Counted live, the running entry up to now.
 */

import { expectedSecondsOn, localDay, secondsByDay } from '$lib/modules/shared/counting'
import { type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** What the pie shows: its slices, how many are filled, and how many of them the neon laps over */
export interface TodaySlices {
  /** The expected hours today, rounded to whole hours, at least one; the expected time divides evenly among them */
  slices: number
  /** Filled in the base colour: each slice's worth worked, all of them once the expected hours are reached */
  done: number
  /** Lapped over in the neon: each slice's worth past the expected hours, at most every slice */
  over: number
}

/**
 * The pie at `now`, for the profile with the balance while an entry of it runs; null when none runs, or the profile
 * has no expected hours today, as on a weekend. Used by the pie at every start and stop and once a minute: 3:52
 * worked of 6 h gives { slices: 6, done: 3, over: 0 }; 6:30 expected gives seven slices of 55:43.
 */
export function todaySlices(record: TimeRecord, now: Date): TodaySlices | null {
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

  const slices = Math.max(1, Math.round(expected / HOUR))
  const each = expected / slices
  const done = worked >= expected ? slices : Math.floor(worked / each)
  const over = worked > expected ? Math.min(slices, Math.floor((worked - expected) / each)) : 0
  return { slices, done, over }
}

// ======================================
//               Helpers
// ======================================

const HOUR = 3600
