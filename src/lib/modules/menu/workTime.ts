/**
 * The settings the counting depends on, as the menu changes them ("Settings change from a date"; "The other profiles
 * share a ceiling"; "A pay estimate per profile"): full time and the split, entered as weeks in quarter hours and kept
 * as a fifth of the week each weekday; pay from a date; and "Skatt och avgifter". Pure: each change returns a new record,
 * or why it is refused.
 */

import { dateInWords } from '$lib/modules/shared/dates'
import type { Day, FromDay, Tax, TimeRecord } from '$lib/modules/shared/record'
import { durationText } from '$lib/modules/shared/timeInput'

// ======================================
//                 API
// ======================================

/** The step a week is set in, full time and the split alike; a quarter a week is 3 min a weekday */
export const WEEK_STEP = 15

/** A week's weekdays, each owing a fifth of it */
export const WEEKDAYS = 5

/** A change refused, with the words that say why */
export interface Refusal {
  refusal: string
}

/** Full time in force on a day, as a week in minutes. Used by Heltid and as the split's slider's end: 38 h 15 min */
export function fullTimeWeek(record: TimeRecord, day: Day): number {
  return (inForce(record.fullTime, day)?.minutes ?? 0) * WEEKDAYS
}

/** The janitor's expected hours in force on a day, as a week in minutes. Used by Fördelning: 30 h */
export function splitWeek(record: TimeRecord, day: Day): number {
  return (inForce(janitor(record)?.expectedMinutes ?? [], day)?.minutes ?? 0) * WEEKDAYS
}

/**
 * Full time saved as a week from a day, replacing a value saved from that same day. Refused when not in quarter hours,
 * or when the janitor's hours would be more than it on that day or any later one, a change already saved for later
 * included: saving one value never changes another. Used by Heltid's "Ändra".
 */
export function saveFullTime(record: TimeRecord, week: number, from: Day): TimeRecord | Refusal {
  if (week % WEEK_STEP !== 0) return { refusal: `Ange veckan i steg om ${WEEK_STEP} minuter` }
  const fullTime = withEntry(record.fullTime, from, { minutes: week / WEEKDAYS })
  const profile = janitor(record)
  const misfit = firstMisfit(fullTime, profile?.expectedMinutes ?? [], from)
  if (misfit !== null) {
    const when = misfit.day > from ? ` från ${dateInWords(misfit.day)}` : ''
    return { refusal: `${profile?.name} har ${weekText(misfit.split)}${when}. Minska fördelningen först.` }
  }
  return { ...record, fullTime }
}

/**
 * The janitor's share of full time saved as a week from a day, the ceiling getting the rest. Refused when more than
 * full time on that day or any later one. Used by Fördelning's slider.
 */
export function saveSplit(record: TimeRecord, week: number, from: Day): TimeRecord | Refusal {
  if (week % WEEK_STEP !== 0) return { refusal: `Ange veckan i steg om ${WEEK_STEP} minuter` }
  const profile = janitor(record)
  if (profile === undefined) return record
  const expected = withEntry(profile.expectedMinutes ?? [], from, { minutes: week / WEEKDAYS })
  const misfit = firstMisfit(record.fullTime, expected, from)
  if (misfit !== null) return { refusal: `Heltid är bara ${weekText(misfit.full)} från ${dateInWords(misfit.day)}.` }
  return {
    ...record,
    profiles: record.profiles.map((p) => (p.id === profile.id ? { ...p, expectedMinutes: expected } : p)),
  }
}

/**
 * A profile's pay saved from a day: a monthly salary for the profile with the balance, a rate per hour for the others.
 * Used by the pay's "Ändra" in a profile's row.
 */
export function savePay(record: TimeRecord, profileId: string, amount: number, from: Day): TimeRecord {
  return {
    ...record,
    profiles: record.profiles.map((p) => {
      if (p.id !== profileId) return p
      const kind = p.expectedMinutes !== undefined ? ('salary' as const) : ('rate' as const)
      return { ...p, pay: withEntry(p.pay ?? [], from, { kind, amount }) }
    }),
  }
}

/** "Efter skatt" and "Skatt och avgifter" saved at once, refused outside 0 to under 100. Used by Profiler's top row */
export function saveTax(record: TimeRecord, tax: Tax): TimeRecord | Refusal {
  if (!(tax.percent >= 0 && tax.percent < 100)) return { refusal: 'Ange 0 till 99' }
  return { ...record, tax }
}

/**
 * The first day of the month after a day's. Used as the date full time and the split open on, since changes to them
 * are usually agreed from a month's start: 26 November gives 1 December.
 */
export function firstOfNextMonth(day: Day): Day {
  const [y, m] = day.split('-').map(Number)
  return m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`
}

/** A week in words, as Heltid and Fördelning show it: 2295 is "38h 15min" */
export function weekText(week: number): string {
  return durationText(week)
}

// ======================================
//               Helpers
// ======================================

/** The profile with the balance, the janitor. Used for the split */
function janitor(record: TimeRecord): TimeRecord['profiles'][number] | undefined {
  return record.profiles.find((p) => p.expectedMinutes !== undefined)
}

/** The value in force on a day: the latest from on or before it. Used for the weeks shown and the check */
function inForce<T extends { from: Day }>(values: T[], day: Day): T | undefined {
  let found: T | undefined
  for (const value of values) if (value.from <= day && (found === undefined || value.from > found.from)) found = value
  return found
}

/** A history with one value put in from a day, replacing any value from that same day, in order of their days */
function withEntry<T extends object>(values: FromDay<T>[], from: Day, value: T): FromDay<T>[] {
  return [...values.filter((v) => v.from !== from), { ...value, from }].sort((a, b) => (a.from < b.from ? -1 : 1))
}

/**
 * The first day from `from` on which the janitor's hours would be more than full time, as weeks, or null when every day
 * fits: checked on `from` and on every later day either setting changes, since between those nothing moves
 */
function firstMisfit(
  fullTime: FromDay<{ minutes: number }>[],
  expected: FromDay<{ minutes: number }>[],
  from: Day,
): { day: Day; full: number; split: number } | null {
  const days = [from, ...fullTime.map((v) => v.from), ...expected.map((v) => v.from)].filter((d) => d >= from).sort()
  for (const day of days) {
    const full = inForce(fullTime, day)?.minutes
    const split = inForce(expected, day)?.minutes
    if (full !== undefined && split !== undefined && split > full) {
      return { day, full: full * WEEKDAYS, split: split * WEEKDAYS }
    }
  }
  return null
}
