/**
 * The dashboard's entry lists: which entries they hold and what a row says ("The main screen has a controls side and a
 * dashboard"). The five most recent and the "Visa alla" popup read the same rows.
 */

import { localDay, secondsByDay, shownMinutes, timeOfDay } from '$lib/modules/shared/counting'
import { dayShort, monthInWords } from '$lib/modules/shared/dates'
import { neonColour } from '$lib/modules/shared/colours'
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
  /** Its added break, as a tag: "paus 20min"; empty with none */
  tag: string
  /** Its length worked in hours and minutes, its break taken off: "3:32"; "--:--" while it runs */
  length: string
  /** Whether it runs, which shows its start alone and the whole row in its profile's neon */
  running: boolean
  /** Its profile's neon, which a running row wears */
  neon: string
  /** Whether it was edited or written by hand, not clicked, which tags it "e" ("Entries remember how they were made") */
  edited: boolean
  /** Its reason as "Visa alla" shows it under the row: "ändrad: …", "tillagd: …", or a clicked entry's alone; empty with none */
  reason: string
}

/**
 * The record's stopped entries, newest first by start. Used by both lists: the first five are the recent entries,
 * and the popup shows them all. An entry that runs is left out until it stops.
 */
export function stoppedEntries(record: TimeRecord): Entry[] {
  return record.entries.filter((entry) => entry.stop !== null).sort((a, b) => Date.parse(b.start) - Date.parse(a.start))
}

/**
 * The entries the lists show: the running one first, then the stopped ones newest first ("A running entry is edited
 * at its start"). Used by both lists: the first five are the recent entries, and "Visa alla" shows them all.
 */
export function listedEntries(record: TimeRecord): Entry[] {
  const running = record.entries.filter((e) => e.stop === null)
  return [...running, ...stoppedEntries(record)]
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
 * A gap in "Visa alla", just above its row: the free time between that entry's stop and the next one's start
 * ("A forgotten entry is written in the gap where it belongs"). `top` is the one whose "+" always shows, `open` shows
 * its "+" on hover, and `shut` has no room for an entry and nothing to click.
 */
export interface Gap {
  /** The older entry's stop, in milliseconds */
  from: number
  /** The newer entry's start, or for the newest row the moment given */
  to: number
  kind: 'top' | 'open' | 'shut'
}

/** The smallest entry a gap must hold for its "+", the edit line's snap */
const GAP_ROOM = 5 * 60_000

/**
 * The gap above each of the stopped entries, given newest first, in the same order. The newest one's gap runs up to
 * `upTo`: a running entry's start, or now. Used by "Visa alla": 11:40–13:05 at 15:20 gives [{ from: 13:05, to: 15:20,
 * kind: 'top' }]. A gap has a "+" with 5 minutes' room or more; the first such gap from the top is the always-shown one.
 */
export function gapsAbove(entries: Entry[], upTo: number): Gap[] {
  let topFound = false
  return entries.map((entry, i) => {
    const from = Date.parse(entry.stop ?? entry.start)
    const to = i === 0 ? upTo : Date.parse(entries[i - 1].start)
    if (to - from < GAP_ROOM) return { from, to, kind: 'shut' }
    if (topFound) return { from, to, kind: 'open' }
    topFound = true
    return { from, to, kind: 'top' }
  })
}

/**
 * What a stopped entry's row says. Used by every row in both lists: Monday 16 November 07:58 to 11:30 for the janitor
 * gives { day: 'mån 16', times: '07:58–11:30', later: 0, letter: 'V', base: '#7ed6d5', tag: '', length: '3:32' }. An
 * entry across midnight reads on the day it started, with its whole length, and says how many days later it stops;
 * its added break comes off the length and shows as a tag.
 */
export function entryRow(entry: Entry, record: TimeRecord): EntryRow {
  const start = new Date(entry.start)
  const running = entry.stop === null
  const stop = entry.stop ?? entry.start
  const profile = record.profiles.find((p) => p.id === entry.profile)
  const name = profile?.name ?? ''
  const worked = [...secondsByDay({ ...entry, stop })].reduce((sum, [, seconds]) => sum + seconds, 0)
  const minutes = shownMinutes(worked)
  const breakMinutes = entry.breakMinutes
  return {
    day: dayShort(localDay(start.getTime())),
    times: running ? timeOfDay(entry.start) : `${timeOfDay(entry.start)}–${timeOfDay(stop)}`,
    later: daysBetween(localDay(start.getTime()), localDay(Date.parse(stop))),
    letter: name.charAt(0).toUpperCase(),
    base: profile?.base ?? '',
    tag: breakMinutes > 0 ? `paus ${durationText(breakMinutes)}` : '',
    length: running ? '--:--' : `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`,
    running,
    neon: profile ? neonColour(profile.hue) : '',
    edited: entry.made !== 'clicked',
    reason: entry.reason ? `${REASON_PREFIX[entry.made]}${entry.reason}` : '',
  }
}

// ======================================
//               Helpers
// ======================================

/** What a reason opens with under its row in "Visa alla", by how the entry was made */
const REASON_PREFIX: Record<Entry['made'], string> = { clicked: '', edited: 'ändrad: ', hand: 'tillagd: ' }

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
