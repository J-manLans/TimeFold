/**
 * The counting: the balance and the app's month, worked out from the record each time it is needed. Works in seconds;
 * figures are rounded to the minute only when shown ("Time is counted to the second and shown to the minute").
 */

import { type Day, type Entry, type Profile, type Timestamp, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** A month of the app's counting, from its first day to its last */
export interface Month {
  first: Day
  last: Day
}

/** A stretch of the ceiling's hours worked by one profile, in the order they were worked */
export interface Piece {
  profile: string
  seconds: number
}

/** A month of the ceiling: its size, its hours as pieces in the order worked (carried ones first), and their sum */
export interface CeilingMonth {
  ceiling: number
  pieces: Piece[]
  used: number
}

/**
 * An entry's seconds worked on each calendar day it touches, split at this machine's midnight ("Time counts on the day
 * it was worked"), less its added breaks: each comes off the day it was added, and any rest off the days before
 * ("Time away is a gap or an added break"). Used for every day's hours: Tuesday 22:00 to Wednesday 01:00 gives Tuesday
 * 2 h and Wednesday 1 h; with 30 min added on Wednesday, Wednesday 30 min.
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
  for (const taken of entry.breaks) takeBreak(split, taken.day, taken.minutes * 60)
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
 * profile's entries started on it or it is a flex day, charged once either way ("A day owes its expected hours only
 * when work started on it"). Used to show what a day added: 7 h worked on a Monday adds +1:00, a flex day −6:00, and
 * a flex day worked 6 h 0.
 * @param entries - all entries; other profiles' and running ones are left out
 */
export function dayResult(day: Day, profile: Profile, entries: Entry[]): number {
  const { worked, charged } = workedDays(profile, entries)
  return (worked.get(day) ?? 0) - (charged.has(day) ? expectedSecondsOn(day, profile) : 0)
}

/**
 * A profile's balance in seconds: its openings, plus every day's result up to and including `last`. Running entries
 * count only once stopped. Used by `balanceOnScreen`, and for any count that ends on a day, such as a report's: an
 * opening of +12:30 and a 7 h Monday give +13:30.
 * @throws if the record has no profile `profileId`
 */
export function balance(record: TimeRecord, profileId: string, last: Day): number {
  const profile = record.profiles.find((p) => p.id === profileId)
  if (profile === undefined) throw new Error(`No profile ${profileId} in the record`)
  const { worked, charged } = workedDays(profile, record.entries)

  let total = 0
  for (const opening of record.openings) {
    if (opening.profile === profileId && opening.day <= last) total += opening.balanceMinutes * 60
  }
  for (const [day, seconds] of worked) {
    if (day <= last) total += seconds
  }
  for (const day of charged) {
    if (day <= last) total -= expectedSecondsOn(day, profile)
  }
  return total
}

/**
 * The balance as the main screen shows it: up to today, and every flex day marked ahead taken at once ("A flex day can
 * be marked ahead, and the screen counts it at once"). Used for the flex bar and where the profile stands: +4:37 on
 * 17 November with a flex day on 11 December shows −1:23.
 * @throws if the record has no profile `profileId`
 */
export function balanceOnScreen(record: TimeRecord, profileId: string, today: Day): number {
  const flexDays = record.profiles.find((p) => p.id === profileId)?.flexDays ?? []
  const last = flexDays.reduce((latest, day) => (day > latest ? day : latest), today)
  return balance(record, profileId, last)
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
 * The other profiles' ceiling for the month a day falls in ("The other profiles share a ceiling"): the rest of full time
 * after the janitor's expected hours, on each weekday, and the hours worked against it, carried ones first. Hours
 * over a month's ceiling carry into the next with their profile; unused hours do not. Running entries count once
 * stopped. Used by the ceiling wheel: 46 h in a 42 h May start June with 4 h used.
 * @returns seconds; the ceiling is 0 for a record with no balance profile
 */
export function ceilingMonth(record: TimeRecord, day: Day): CeilingMonth {
  const janitor = record.profiles.find((p) => p.expectedMinutes !== undefined)
  const worked = otherWork(record, janitor?.id)
  const target = monthOf(day)
  let month = monthOf(firstDay(record, worked) ?? day)
  if (month.first > target.first) month = target

  let carried: Piece[] = []
  for (;;) {
    const ceiling = ceilingOf(record, janitor, month)
    const pieces = joined([...carried, ...worked.filter((piece) => monthOf(piece.day).first === month.first)])
    if (month.first === target.first) return { ceiling, pieces, used: pieces.reduce((sum, p) => sum + p.seconds, 0) }
    carried = beyond(pieces, ceiling)
    month = monthOf(dayAfter(month.last))
  }
}

/**
 * A rough figure of the month's pay, in euros ("A pay estimate per profile"): each salary in force in the month once,
 * plus each rated profile's hours times the rate in force the day they were worked. Running entries count once
 * stopped. Used for the pay estimate under the ceiling wheel: a 2 000 € salary and 10 h at 24 €/h give 2 240.
 */
export function payEstimate(record: TimeRecord, day: Day): number {
  const month = monthOf(day)
  let total = 0
  for (const profile of record.profiles) {
    const pay = profile.pay ?? []
    const salary = inForce(pay, month.last)
    if (salary?.kind === 'salary') total += salary.amount
    for (const entry of record.entries) {
      if (entry.profile !== profile.id) continue
      for (const [worked, seconds] of secondsByDay(entry)) {
        const rate = worked >= month.first && worked <= month.last ? inForce(pay, worked) : undefined
        if (rate?.kind === 'rate') total += (seconds / 3600) * rate.amount
      }
    }
  }
  return total
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
 * A profile's stopped entries, as seconds worked per day, and the days charged their expected hours: those work
 * started on, and its flex days, each once. Used by `dayResult` and `balance`, so the two count alike.
 */
function workedDays(profile: Profile, entries: Entry[]): { worked: Map<Day, number>; charged: Set<Day> } {
  const worked = new Map<Day, number>()
  const charged = new Set<Day>(profile.flexDays ?? [])
  for (const entry of entries) {
    if (entry.profile !== profile.id || entry.stop === null) continue
    charged.add(localDay(Date.parse(entry.start)))
    for (const [day, seconds] of secondsByDay(entry)) worked.set(day, (worked.get(day) ?? 0) + seconds)
  }
  return { worked, charged }
}

/**
 * An added break taken off an entry's days: off `day` first, then off each day before it, never below 0. Used by
 * `secondsByDay` for each break in turn; a break added on a day the entry did not reach starts from its last day
 */
function takeBreak(split: Map<Day, number>, day: Day, seconds: number): void {
  let left = seconds
  const days = [...split.keys()].filter((d) => d <= day).reverse()
  for (const d of days) {
    if (left <= 0) return
    const taken = Math.min(left, split.get(d) ?? 0)
    split.set(d, (split.get(d) ?? 0) - taken)
    left -= taken
  }
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

// === The ceiling ===

/** Seconds worked by a profile on a day, for laying the ceiling's hours in order. Used by `ceilingMonth` */
interface DayPiece extends Piece {
  day: Day
}

/**
 * The stopped work of every profile but the janitor, day by day in the order it was worked. Used by `ceilingMonth`
 */
function otherWork(record: TimeRecord, janitorId: string | undefined): DayPiece[] {
  const pieces: DayPiece[] = []
  const entries = record.entries
    .filter((entry) => entry.profile !== janitorId)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
  for (const entry of entries) {
    for (const [day, seconds] of secondsByDay(entry)) pieces.push({ profile: entry.profile, day, seconds })
  }
  return pieces
}

/** The first day the ceiling has anything to count from: the first opening or work. Used by `ceilingMonth` */
function firstDay(record: TimeRecord, worked: DayPiece[]): Day | undefined {
  const days = [...record.openings.map((o) => o.day), ...worked.map((p) => p.day)].sort()
  return days[0]
}

/**
 * A month's ceiling in seconds: full time less the janitor's expected hours, on each weekday. The month the app was
 * first started in has its whole ceiling: its weekdays before the first setting take the first setting. Used by
 * `ceilingMonth`
 */
function ceilingOf(record: TimeRecord, janitor: Profile | undefined, month: Month): number {
  if (janitor === undefined) return 0
  let total = 0
  for (let day = month.first; day <= month.last; day = dayAfter(day)) {
    if (!isWeekday(day)) continue
    const full = (settingOn(record.fullTime, day)?.minutes ?? 0) * 60
    const expected = (settingOn(janitor.expectedMinutes ?? [], day)?.minutes ?? 0) * 60
    total += Math.max(0, full - expected)
  }
  return total
}

/**
 * The value in force on a day, or the first value for a day before any, so the first month's ceiling is whole. Used
 * by `ceilingOf` only: the balance owes nothing before the first day
 */
function settingOn<T extends { from: Day }>(values: T[], day: Day): T | undefined {
  return inForce(values, day) ?? [...values].sort((a, b) => (a.from < b.from ? -1 : 1))[0]
}

/** Pieces with neighbours of the same profile joined into one. Used by `ceilingMonth` */
function joined(pieces: Piece[]): Piece[] {
  const result: Piece[] = []
  for (const { profile, seconds } of pieces) {
    const last = result[result.length - 1]
    if (last?.profile === profile) last.seconds += seconds
    else result.push({ profile, seconds })
  }
  return result
}

/** What of a month's pieces lies past its ceiling, cut where the ceiling falls. Used for the carry into the next month */
function beyond(pieces: Piece[], ceiling: number): Piece[] {
  const over: Piece[] = []
  let at = 0
  for (const { profile, seconds } of pieces) {
    const cut = Math.max(at, ceiling)
    if (at + seconds > cut) over.push({ profile, seconds: at + seconds - cut })
    at += seconds
  }
  return over
}

// === Days and moments ===

/** The day after a day. Used to walk a month day by day, and from one month to the next */
function dayAfter(day: Day): Day {
  const next = new Date(dayToTime(day) + 24 * 3600 * 1000)
  return formatDay(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())
}

/** Whether a day is Monday to Friday. Used for the ceiling's days */
function isWeekday(day: Day): boolean {
  const weekday = new Date(dayToTime(day)).getUTCDay()
  return weekday !== 0 && weekday !== 6
}

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
