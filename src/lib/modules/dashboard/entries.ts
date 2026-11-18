/**
 * The dashboard's entry lists: which entries they hold and what a row says ("The main screen has a controls side and a
 * dashboard"). The five most recent and the "Visa alla" popup read the same rows.
 */

import { localDay, shownMinutes, timeOfDay } from '$lib/modules/shared/counting'
import { dayShort } from '$lib/modules/shared/dates'
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
  /** Its length in hours and minutes: "3:32" */
  length: string
}

/**
 * The record's stopped entries, newest first by start. Used by both lists: the first five are the recent entries,
 * and the popup shows them all. An entry that runs is left out until it stops.
 */
export function stoppedEntries(record: TimeRecord): Entry[] {
  return record.entries.filter((entry) => entry.stop !== null).sort((a, b) => Date.parse(b.start) - Date.parse(a.start))
}

/**
 * What a stopped entry's row says. Used by every row in both lists: Monday 16 November 07:58 to 11:30 for the janitor
 * gives { day: 'mån 16', times: '07:58–11:30', later: 0, letter: 'V', base: '#7ed6d5', length: '3:32' }. An entry
 * across midnight reads on the day it started, with its whole length, and says how many days later it stops.
 */
export function entryRow(entry: Entry, record: TimeRecord): EntryRow {
  const start = new Date(entry.start)
  const stop = entry.stop ?? entry.start
  const profile = record.profiles.find((p) => p.id === entry.profile)
  const name = profile?.name ?? ''
  const minutes = shownMinutes((Date.parse(stop) - start.getTime()) / 1000)
  return {
    day: dayShort(localDay(start.getTime())),
    times: `${timeOfDay(entry.start)}–${timeOfDay(stop)}`,
    later: daysBetween(localDay(start.getTime()), localDay(Date.parse(stop))),
    letter: name.charAt(0).toUpperCase(),
    base: profile?.base ?? '',
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
