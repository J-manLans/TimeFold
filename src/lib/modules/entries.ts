/**
 * The dashboard's entry lists: which entries they hold and what a row says ("The main screen has a controls side and a
 * dashboard"). The five most recent and the "Visa alla" popup read the same rows.
 */

import { shownMinutes, timeOfDay } from './counting'
import { type Entry, type TimeRecord } from './record'

// ======================================
//                 API
// ======================================

/** What an entry's row says, cell by cell */
export interface EntryRow {
  /** The weekday and date it started: "mån 16" */
  day: string
  /** Its start and stop: "07:58–11:30" */
  times: string
  /** Its profile's first letter, capitalised */
  letter: string
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
 * gives { day: 'mån 16', times: '07:58–11:30', letter: 'V', length: '3:32' }. An entry across midnight reads on the
 * day it started, with its whole length.
 */
export function entryRow(entry: Entry, record: TimeRecord): EntryRow {
  const start = new Date(entry.start)
  const stop = entry.stop ?? entry.start
  const name = record.profiles.find((p) => p.id === entry.profile)?.name ?? ''
  const minutes = shownMinutes((Date.parse(stop) - start.getTime()) / 1000)
  return {
    day: `${WEEKDAYS[start.getDay()]} ${start.getDate()}`,
    times: `${timeOfDay(entry.start)}–${timeOfDay(stop)}`,
    letter: name.charAt(0).toUpperCase(),
    length: `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`,
  }
}

// ======================================
//               Helpers
// ======================================

/** The weekdays as a row shows them, from Sunday, as `Date.getDay` counts */
const WEEKDAYS = ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör']
