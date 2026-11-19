/**
 * The dashboard's entry lists: which entries they hold and what a row says ("The main screen has a controls side and a
 * dashboard"). The five most recent and the "Visa alla" popup read the same rows.
 */

import { localDay, secondsByDay, shownMinutes, timeOfDay } from '$lib/modules/shared/counting'
import { dayShort, monthInWords } from '$lib/modules/shared/dates'
import { durationText } from '$lib/modules/shared/timeInput'
import { type Day, type Entry, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** What an entry's row says, cell by cell */
export interface EntryRow {
  /** The weekday and date it started: "mån 16" */
  day: string
  /** Its start and stop: "07:58–11:30" */
  times: string
  /** How many calendar days after its start it stops, shown as "+1" after the times; 0 on the same day */
  later: number
  /** Its profile's first letter, capitalised */
  letter: string
  /** Its profile's base colour, which the letter wears so each profile's rows are found at a glance */
  base: string
  /** Its added breaks together, as a tag: "paus 20min"; empty with none */
  tag: string
  /** Its length worked in hours and minutes, its breaks taken off: "3:32" */
  length: string
}

/**
 * The record's stopped entries, newest first by start. Used by both lists: the first five are the recent entries,
 * and the popup shows them all. An entry that runs is left out until it stops.
 */
export function stoppedEntries(record: TimeRecord): Entry[] {
  return record.entries.filter((entry) => entry.stop !== null).sort((a, b) => Date.parse(b.start) - Date.parse(a.start))
}

/** A line of "Visa alla": a month's line, naming it, or an entry's row */
export type ListItem = { kind: 'month'; key: string; label: string } | { kind: 'entry'; entry: Entry }

/**
 * Entries with a line opening each month they fall in, by the day each started, in the order given. Used by "Visa
 * alla", newest first: entries from November back to September give "november 2026", its rows, "oktober 2026", and so
 * on. The recent list has no month lines.
 */
export function withMonthLines(entries: Entry[]): ListItem[] {
  const items: ListItem[] = []
  let last = ''
  for (const entry of entries) {
    const day = localDay(Date.parse(entry.start))
    const month = day.slice(0, 7)
    if (month !== last) items.push({ kind: 'month', key: month, label: monthInWords(day) })
    last = month
    items.push({ kind: 'entry', entry })
  }
  return items
}

/**
 * What a stopped entry's row says. Used by every row in both lists: Monday 16 November 07:58 to 11:30 for the janitor
 * gives { day: 'mån 16', times: '07:58–11:30', later: 0, letter: 'V', base: '#7ed6d5', tag: '', length: '3:32' }. An
 * entry across midnight reads on the day it started, with its whole length, and says how many days later it stops;
 * its added breaks come off the length and show together as one tag.
 */
export function entryRow(entry: Entry, record: TimeRecord): EntryRow {
  const start = new Date(entry.start)
  const stop = entry.stop ?? entry.start
  const profile = record.profiles.find((p) => p.id === entry.profile)
  const name = profile?.name ?? ''
  const worked = [...secondsByDay({ ...entry, stop })].reduce((sum, [, seconds]) => sum + seconds, 0)
  const minutes = shownMinutes(worked)
  const breakMinutes = entry.breaks.reduce((sum, b) => sum + b.minutes, 0)
  return {
    day: dayShort(localDay(start.getTime())),
    times: `${timeOfDay(entry.start)}–${timeOfDay(stop)}`,
    later: daysBetween(localDay(start.getTime()), localDay(Date.parse(stop))),
    letter: name.charAt(0).toUpperCase(),
    base: profile?.base ?? '',
    tag: breakMinutes > 0 ? `paus ${durationText(breakMinutes)}` : '',
    length: `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`,
  }
}

// ======================================
//               Helpers
// ======================================

/**
 * The calendar days from one day to a later one, counted on the dates alone, so no clock or summer time can move it.
 * Used by `entryRow` for "+1": daysBetween('2026-11-14', '2026-11-16') is 2
 */
function daysBetween(from: Day, to: Day): number {
  const noon = (day: Day): number => {
    const [y, m, d] = day.split('-').map(Number)
    return Date.UTC(y, m - 1, d, 12)
  }
  return Math.round((noon(to) - noon(from)) / 86_400_000)
}
