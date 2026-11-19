/**
 * What a click on the start/stop button does to the record, and how the last click is undone ("One start/stop button
 * and a profile list"; "The last click can be undone for a few seconds"), and the entry left running from an earlier
 * day ("A running entry from an earlier day asks"). Pure: each function returns a new record.
 */

import { localDay, timeOfDay } from '$lib/modules/shared/counting'
import { dayInWords } from '$lib/modules/shared/dates'
import { type Entry, type Timestamp, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** What a click did, kept by the app (never in the record) so it can be undone */
export type Click =
  | { kind: 'start'; at: Timestamp; started: string }
  | { kind: 'stop'; at: Timestamp; stopped: string }
  | { kind: 'switch'; at: Timestamp; stopped: string; started: string }

/**
 * The start/stop button pressed with `profileId` on screen, at `now`: stops that profile's running entry, or else
 * stops whatever runs and starts an entry for it, so at most one entry runs. Used by the button on every click.
 * @returns the changed record, and the click for the undo
 */
export function press(record: TimeRecord, profileId: string, now: Date): { record: TimeRecord; click: Click } {
  const at = toTimestamp(now)
  const running = record.entries.find((e) => e.stop === null)

  if (running?.profile === profileId) {
    const entries = record.entries.map((e) => (e.id === running.id ? { ...e, stop: at } : e))
    return { record: { ...record, entries }, click: { kind: 'stop', at, stopped: running.id } }
  }

  const stoppedFirst = record.entries.map((e) => (e === running ? { ...e, stop: at } : e))
  const started: Entry = {
    id: nextId(record.entries),
    profile: profileId,
    start: at,
    stop: null,
    made: 'clicked',
    breaks: [],
  }
  const entries = [...stoppedFirst, started]
  const click: Click = running
    ? { kind: 'switch', at, stopped: running.id, started: started.id }
    : { kind: 'start', at, started: started.id }
  return { record: { ...record, entries }, click }
}

/**
 * The running entry, if it started on an earlier day than `now`, on this machine's calendar. Used when the app opens,
 * never while it runs: an entry started 2026-11-16 21:30 and opened on 2026-11-17 is found; one started today is not.
 */
export function runningSinceEarlierDay(record: TimeRecord, now: Date): Entry | null {
  const running = record.entries.find((e) => e.stop === null)
  if (running === undefined) return null
  return localDay(Date.parse(running.start)) < localDay(now.getTime()) ? running : null
}

/**
 * The running entry stopped at `now`, as the start/stop button stops it, whichever profile is on screen. Used by
 * "Stoppa" in the popup for a running entry from an earlier day; the record is unchanged when nothing runs.
 * @returns the changed record, and the click for the undo
 */
export function stopRunning(record: TimeRecord, now: Date): { record: TimeRecord; click: Click | null } {
  const running = record.entries.find((e) => e.stop === null)
  if (running === undefined) return { record, click: null }
  return press(record, running.profile, now)
}

/**
 * What the popup for a running entry from an earlier day says: when it started, as a heading, and which profile runs
 * since when. Yesterday is "igår", an older day its words. Used by the popup: an entry of Vaktis started yesterday
 * 21:30 gives { heading: 'Startad igår', line: 'Vaktis pågår sedan igår 21:30.' }
 */
export function lateWords(record: TimeRecord, entry: Entry, now: Date): { heading: string; line: string } {
  const started = localDay(Date.parse(entry.start))
  const before = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const when = started === localDay(before.getTime()) ? 'igår' : dayInWords(started)
  const name = record.profiles.find((p) => p.id === entry.profile)?.name ?? ''
  return { heading: `Startad ${when}`, line: `${name} pågår sedan ${when} ${timeOfDay(entry.start)}.` }
}

/**
 * Reverses `click` exactly, if `now` is less than `windowSeconds` after it; otherwise the record is left as it is.
 * Compares with the clock, so a window hidden past the time cannot undo a late click. Used by the undo button:
 * a stop at 15:40 undone at 15:40:10 runs on.
 */
export function undo(record: TimeRecord, click: Click, now: Date, windowSeconds: number): TimeRecord {
  if (now.getTime() - Date.parse(click.at) >= windowSeconds * 1000) return record

  const runsOn = (e: Entry): Entry => ({ ...e, stop: null })
  let entries = record.entries
  if (click.kind !== 'stop') entries = entries.filter((e) => e.id !== click.started)
  if (click.kind !== 'start') entries = entries.map((e) => (e.id === click.stopped ? runsOn(e) : e))
  return { ...record, entries }
}

/**
 * What the undo would undo, for its label after "Ångra: ": the click's kind and time, and for a switch the profile
 * stopped and the one started. Used by the undo button's tip: "stopp 15:40", "byte 13:00 (Vaktis →
 * Utvecklingsgruppen)"
 */
export function clickLabel(record: TimeRecord, click: Click): string {
  const time = timeOfDay(click.at)
  if (click.kind === 'start') return `start ${time}`
  if (click.kind === 'stop') return `stopp ${time}`
  return `byte ${time} (${profileName(record, click.stopped)} → ${profileName(record, click.started)})`
}

// ======================================
//               Helpers
// ======================================

/** The name of the profile an entry belongs to. Used by `clickLabel` for a switch's two profiles */
function profileName(record: TimeRecord, entryId: string): string {
  const profileId = record.entries.find((e) => e.id === entryId)?.profile
  return record.profiles.find((p) => p.id === profileId)?.name ?? ''
}

/**
 * A moment written as the record keeps it: to the second, with this machine's offset. Used by `press` for every start
 * and stop: 2026-11-16T08:02:15+02:00
 */
function toTimestamp(now: Date): Timestamp {
  const two = (n: number): string => String(Math.floor(Math.abs(n))).padStart(2, '0')
  const offset = -now.getTimezoneOffset()
  const day = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`
  const time = `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`
  return `${day}T${time}${offset >= 0 ? '+' : '-'}${two(offset / 60)}:${two(offset % 60)}`
}

/** The next free entry id after the highest `eN` in the record. Used by `press` for a new entry: e1 and e2 give e3 */
function nextId(entries: Entry[]): string {
  const highest = Math.max(0, ...entries.map((e) => Number(/^e(\d+)$/.exec(e.id)?.[1] ?? 0)))
  return `e${highest + 1}`
}
