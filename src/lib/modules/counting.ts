/**
 * The counting: the balance and the app's month, worked out from the record each time it is needed. Works in seconds;
 * figures are rounded to the minute only when shown ("Time is counted to the second and shown to the minute").
 */

import { type Day, type Entry, type Profile, type Timestamp, type TimeRecord } from './record'

// ======================================
//                 API
// ======================================

/** A month of the app's counting, from its first day to its last */
export interface Month {
  first: Day
  last: Day
}

/**
 * An entry's seconds on each calendar day it touches, split at this machine's midnight ("Time counts on the day it
 * was worked"). Used for every day's hours: Tuesday 22:00 to Wednesday 01:00 gives Tuesday 2 h and Wednesday 1 h.
 * @param entry - a stopped entry; a running one has no seconds yet
 * @returns seconds by day, in order
 */
export function secondsByDay(entry: Entry): Map<Day, number> {
  const split = new Map<Day, number>()
  if (entry.stop === null) return split
  const end = Date.parse(entry.stop)
  let from = Date.parse(entry.start)
  while (from < end) {
    const to = Math.min(end, nextMidnight(from))
    split.set(localDay(from), Math.round((to - from) / 1000))
    from = to
  }
  return split
}

/**
 * The seconds a profile is expected to work on a day: its expected minutes in force that day, Monday to Friday
 * ("Expected hours: 6 a day, Monday to Friday"; "Settings change from a date"). Used for what a started day owes: a
 * Monday the janitor starts owes 6 h, a Saturday nothing.
 * @returns 0 on weekends, and for a profile without expected minutes in force
 */
export function expectedSecondsOn(day: Day, profile: Profile): number {
  const weekday = new Date(dayToTime(day)).getUTCDay()
  if (weekday === 0 || weekday === 6) return 0
  const minutes = inForce(profile.expectedMinutes ?? [], day)?.minutes ?? 0
  return minutes * 60
}

/**
 * What a day adds to a profile's balance: the seconds worked on it, less its expected seconds if one of the
 * profile's entries started on it ("A day owes its expected hours only when work started on it"). Used to show what
 * today added at a stop: 7 h worked on a Monday adds +1:00.
 * @param entries - all entries; other profiles' and running ones are left out
 */
export function dayResult(day: Day, profile: Profile, entries: Entry[]): number {
  const { worked, started } = workedDays(profile.id, entries)
  return (worked.get(day) ?? 0) - (started.has(day) ? expectedSecondsOn(day, profile) : 0)
}

/**
 * A profile's balance in seconds: its openings, plus every day's result up to and including `today`. Running entries
 * count only once stopped. Used for the flex bar, when the app starts and at each stop: an opening of +12:30 and a 7 h
 * Monday give +13:30.
 * @throws if the record has no profile `profileId`
 */
export function balance(record: TimeRecord, profileId: string, today: Day): number {
  const profile = record.profiles.find((p) => p.id === profileId)
  if (profile === undefined) throw new Error(`No profile ${profileId} in the record`)
  const { worked, started } = workedDays(profileId, record.entries)

  let total = 0
  for (const opening of record.openings) {
    if (opening.profile === profileId && opening.day <= today) total += opening.balanceMinutes * 60
  }
  for (const [day, seconds] of worked) {
    if (day <= today) total += seconds
  }
  for (const day of started) {
    if (day <= today) total -= expectedSecondsOn(day, profile)
  }
  return total
}

/**
 * The app's month that a day falls in: its calendar month ("The app's month is the calendar month"). Used wherever a
 * month is counted, the ceiling, the report and the pay estimate: 16 November gives 1–30 November.
 */
export function monthOf(day: Day): Month {
  const [year, month] = day.split('-').map(Number)
  const lastDate = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return { first: formatDay(year, month, 1), last: formatDay(year, month, lastDate) }
}

/**
 * Seconds as the whole minutes shown, rounded to the nearest; a half minute rounds away from zero. Used for every
 * figure on screen, such as the balance or an entry's length: 3:31:30 shows as 3:32.
 */
export function shownMinutes(seconds: number): number {
  return Math.sign(seconds) * Math.round(Math.abs(seconds) / 60)
}

/**
 * A moment's time of day on this machine's clock, as hours and minutes. Used wherever a time is shown, such as
 * "pågår sedan 07:58" and the undo's "stopp 15:40": timeOfDay('2026-11-16T07:58:30+01:00') is "07:58" in Stockholm
 */
export function timeOfDay(stamp: Timestamp): string {
  const date = new Date(stamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// ======================================
//               Helpers
// ======================================

/**
 * A profile's stopped entries, as seconds worked per day and the days work started on. Used by `dayResult` and
 * `balance`, so the two count alike.
 */
function workedDays(profileId: string, entries: Entry[]): { worked: Map<Day, number>; started: Set<Day> } {
  const worked = new Map<Day, number>()
  const started = new Set<Day>()
  for (const entry of entries) {
    if (entry.profile !== profileId || entry.stop === null) continue
    started.add(localDay(Date.parse(entry.start)))
    for (const [day, seconds] of secondsByDay(entry)) worked.set(day, (worked.get(day) ?? 0) + seconds)
  }
  return { worked, started }
}

/**
 * The value in force on a day: the one with the latest `from` on or before it. Used for every value that changes
 * from a date, such as expected hours set to 5 from 1 September.
 */
function inForce<T extends { from: Day }>(values: T[], day: Day): T | undefined {
  let found: T | undefined
  for (const value of values) {
    if (value.from <= day && (found === undefined || value.from > found.from)) found = value
  }
  return found
}

// === Days and moments ===

/**
 * The day a moment falls on, on this machine's calendar. Used to find the day an entry starts on and each day it
 * touches as it is split, the day a save names its copy by, and today: localDay(Date.now())
 */
export function localDay(time: number): Day {
  const date = new Date(time)
  return formatDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/**
 * The first moment of the day after the one `time` falls on, on this machine's clock. Used by `secondsByDay` to
 * split an entry at midnight
 */
function nextMidnight(time: number): number {
  const date = new Date(time)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime()
}

/**
 * A day as noon UTC, for reading its calendar facts with no clock or summer time in the way. Used by
 * `expectedSecondsOn` for the day of the week
 */
function dayToTime(day: Day): number {
  const [y, m, d] = day.split('-').map(Number)
  return Date.UTC(y, m - 1, d, 12)
}

/** A date written YYYY-MM-DD. Used by `localDay` and `monthOf` */
function formatDay(year: number, month: number, date: number): Day {
  const two = (n: number): string => String(n).padStart(2, '0')
  return `${year}-${two(month)}-${two(date)}`
}
