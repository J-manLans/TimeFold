/**
 * Days and months in Swedish words, as the app writes them: "måndag 16 november" in a sentence, "mån 16" on an
 * entry's row, "mån 16 nov" in a label, "november 2026" over a month, and "nov" in a short list. A day is a calendar
 * date with no clock, so no time zone can move it.
 */

import { type Day } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** A day in full, for a sentence. Used for the copy's day on the recovery screen: 2026-11-16 is "måndag 16 november" */
export function dayInWords(day: Day): string {
  const { weekday, date, month } = parts(day)
  return `${WEEKDAYS[weekday]} ${date} ${MONTHS[month]}`
}

/** A day and its month cut short, for a quiet note. Used by a value saved for a later day: 2026-12-01 is "1 dec" */
export function dayAndMonth(day: Day): string {
  const { date, month } = parts(day)
  return `${date} ${MONTHS[month].slice(0, 3)}`
}

/** A day with its year, for a sentence. Used by a refused setting's reason: 2026-07-01 is "1 juli 2026" */
export function dateInWords(day: Day): string {
  const { date, month } = parts(day)
  return `${date} ${MONTHS[month]} ${day.slice(0, 4)}`
}

/** A day as an entry's row shows it, the weekday cut short. Used by the entry lists: 2026-11-16 is "mån 16" */
export function dayShort(day: Day): string {
  const { weekday, date } = parts(day)
  return `${WEEKDAYS[weekday].slice(0, 3)} ${date}`
}

/** A day's weekday cut short. Used by the entry line's scale at midnight: 2026-11-19 is "tor" */
export function weekdayShort(day: Day): string {
  return WEEKDAYS[parts(day).weekday].slice(0, 3)
}

/** A day for a small label, weekday and month cut short. Used for the "KOPIA" label: 2026-11-16 is "mån 16 nov" */
export function dayLabel(day: Day): string {
  const { month } = parts(day)
  return `${dayShort(day)} ${MONTHS[month].slice(0, 3)}`
}

/**
 * A day's month and year, for a line naming a month. Used by the month lines in "Visa alla" and the flex-day
 * calendar's heading: 2026-11-16 is "november 2026"
 */
export function monthInWords(day: Day): string {
  return `${MONTHS[parts(day).month]} ${day.slice(0, 4)}`
}

/** A day's month cut short. Used by the flex-day calendar's list of days ahead: 2026-12-07 is "dec" */
export function monthShort(day: Day): string {
  return MONTHS[parts(day).month].slice(0, 3)
}

// ======================================
//               Helpers
// ======================================

/** The weekdays from Sunday, as `getUTCDay` counts */
const WEEKDAYS = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']

const MONTHS = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
]

/** A day's weekday, date and month (0–11), read at noon UTC so no clock moves it. Used by every function above */
function parts(day: Day): { weekday: number; date: number; month: number } {
  const [y, m, d] = day.split('-').map(Number)
  const noon = new Date(Date.UTC(y, m - 1, d, 12))
  return { weekday: noon.getUTCDay(), date: d, month: m - 1 }
}
