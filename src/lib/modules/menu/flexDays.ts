/**
 * Flex days as the calendar in the menu's Tid tab marks them ("A flex day can be marked ahead, and the screen counts it
 * at once"): a weekday per click, today or ahead, or past once the padlock is opened; never a weekend, a day janitor
 * work started on, which is charged its hours already, nor a day before the record's first day, which owes nothing. Also the month the calendar shows and the list of marked days
 * beside it. Pure: each function returns a new record.
 */

import { localDay } from '$lib/modules/shared/counting'
import { monthShort } from '$lib/modules/shared/dates'
import { type Day, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/**
 * Why a click could not mark or unmark a day: a weekend owes no hours, a day janitor work started on is charged them
 * already, a day before the record's first day owes none, and a day gone by is locked
 */
export type FlexRefusal = 'weekend' | 'worked' | 'before' | 'past'

/** What a click on a day gives: the changed record, or why the day cannot be clicked */
export type FlexResult = { ok: true; record: TimeRecord } | { ok: false; why: FlexRefusal }

/** A month as the calendar draws it: the empty days before its 1st in a week from Monday, and its days in order */
export interface CalendarMonth {
  lead: number
  days: Day[]
}

/** A line of the list beside the calendar: a month's marked days, or a year where the list crosses into it */
export type AheadLine =
  { kind: 'month'; key: string; name: string; days: Day[] } | { kind: 'year'; key: string; year: string }

/**
 * A click on `day` in the calendar: marks it as a flex day of the profile with the balance, or unmarks it if marked.
 * A weekend, a day janitor work started on, or a day before the record's first day, is refused always; a day before
 * `today` while the padlock is shut.
 * Used by every day in the calendar: Friday 11 December clicked on 19 November is marked; Saturday 21 November is
 * refused, and so is today once a job has started on it.
 * @param unlocked - whether the padlock is open, which lets days gone by be marked or unmarked
 */
export function toggleFlexDay(record: TimeRecord, day: Day, today: Day, unlocked: boolean): FlexResult {
  if (isWeekend(day)) return { ok: false, why: 'weekend' }
  if (workedDays(record).has(day)) return { ok: false, why: 'worked' }
  const first = firstDay(record)
  if (first !== undefined && day < first) return { ok: false, why: 'before' }
  if (day < today && !unlocked) return { ok: false, why: 'past' }

  const profiles = record.profiles.map((profile) => {
    if (profile.expectedMinutes === undefined) return profile
    const marked = profile.flexDays ?? []
    const flexDays = marked.includes(day) ? marked.filter((d) => d !== day) : [...marked, day].sort()
    return { ...profile, flexDays }
  })
  return { ok: true, record: { ...record, profiles } }
}

/**
 * Whether a day is a Saturday or Sunday, which the calendar greys out. Used by `toggleFlexDay` and by each day the
 * calendar draws: 2026-11-21 is
 */
export function isWeekend(day: Day): boolean {
  const weekday = noon(day).getUTCDay()
  return weekday === 0 || weekday === 6
}

/**
 * The record's first day: where the janitor's expected hours begin, the day it was started fresh or the day an imported
 * record starts. A flex day before it would take nothing off, since those days are inside the opening balance, so the
 * calendar greys them out, padlock or not. Used by `toggleFlexDay` and by the calendar: a record started on 19
 * November gives 2026-11-19
 * @returns undefined for a record with no janitor's expected hours
 */
export function firstDay(record: TimeRecord): Day | undefined {
  const janitor = record.profiles.find((p) => p.expectedMinutes !== undefined)
  return janitor?.expectedMinutes?.map((e) => e.from).sort()[0]
}

/**
 * The days an entry of the profile with the balance started on, a running one's too: each is charged its expected
 * hours already ("A day owes its expected hours only when work started on it"), so marking it would change nothing.
 * Used by `toggleFlexDay` and by the calendar, which greys them out: Tuesday 22:00 to Wednesday 01:00 gives Tuesday
 */
export function workedDays(record: TimeRecord): Set<Day> {
  const janitor = record.profiles.find((p) => p.expectedMinutes !== undefined)
  const started = record.entries.filter((e) => e.profile === janitor?.id).map((e) => localDay(Date.parse(e.start)))
  return new Set(started)
}

/**
 * The marked days from `today` on, a line per month, with a year's own line where the list crosses into a year after
 * today's. Used by the list beside the calendar: 7 and 8 December 2026 and 19 March 2027, seen in November 2026,
 * give "dec 7 8", "2027", "mar 19".
 */
export function daysAhead(record: TimeRecord, today: Day): AheadLine[] {
  const flexDays = record.profiles.find((p) => p.expectedMinutes !== undefined)?.flexDays ?? []
  const lines: AheadLine[] = []
  let year = today.slice(0, 4)
  for (const day of flexDays.filter((d) => d >= today).sort()) {
    const key = day.slice(0, 7)
    const last = lines[lines.length - 1]
    if (last?.kind === 'month' && last.key === key) {
      last.days.push(day)
      continue
    }
    if (day.slice(0, 4) !== year) {
      year = day.slice(0, 4)
      lines.push({ kind: 'year', key: year, year })
    }
    lines.push({ kind: 'month', key, name: monthShort(day), days: [day] })
  }
  return lines
}

/**
 * The month starting on `first`, as the calendar draws it, weeks from Monday. Used by the calendar for the month it
 * shows: November 2026, whose 1st is a Sunday, has 6 empty days before it and 30 days.
 * @param first - the month's first day, YYYY-MM-01
 */
export function calendarMonth(first: Day): CalendarMonth {
  const [year, month] = first.split('-').map(Number)
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const days = Array.from({ length: count }, (_, i) => `${first.slice(0, 8)}${String(i + 1).padStart(2, '0')}`)
  return { lead: (noon(first).getUTCDay() + 6) % 7, days }
}

/**
 * The first day of the month `step` months after the one starting on `first`. Used by the calendar's arrows, ‹ and
 * ›, and to show the month of a day picked from the list: monthAfter('2026-12-01', 1) is 2027-01-01
 */
export function monthAfter(first: Day, step: number): Day {
  const [year, month] = first.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1 + step, 1))
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-01`
}

// ======================================
//               Helpers
// ======================================

/** A day at noon UTC, so no clock or summer time can move its weekday. Used by `isWeekend` and `calendarMonth` */
function noon(day: Day): Date {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12))
}
