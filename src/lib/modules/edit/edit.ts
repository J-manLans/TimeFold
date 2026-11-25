/**
 * An edit between the record and the entry line: an entry or a gap opened on the line, and what the line shows saved
 * back into the record with its mark and its reason ("Editing an entry on its line", "An edited entry's break", "Every
 * edit carries a reason", "Entries remember how they were made"). Pure: the save returns a new record.
 */

import {
  atLimit,
  breakShares,
  docked,
  isChanged,
  openGap,
  openLine,
  resultParts,
  type LineState,
  type Span,
  type View,
} from '$lib/modules/edit/line'
import { timeOfDay } from '$lib/modules/shared/counting'
import { nextId, toTimestamp, type Entry, type Made, type Profile, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/**
 * The line for an entry of the record, every other entry its walls, a running one stopping at now. Used when a row is
 * chosen in either list.
 * @returns the line, or null when the entry is not in the record
 */
export function lineForEntry(record: TimeRecord, entryId: string, now: number): LineState | null {
  const entry = record.entries.find((e) => e.id === entryId)
  if (!entry) return null
  return openLine(spanOf(entry, now), othersThan(record, entryId, now), now, entry.stop === null)
}

/**
 * The line for a forgotten entry, opened on a gap of "Visa alla", starting on the active profile. Used by the gap's
 * "+": the always-shown one runs up to `now`.
 */
export function lineForGap(record: TimeRecord, gap: View, profile: string, now: number): LineState {
  return openGap(gap, othersThan(record, '', now), profile, now)
}

/**
 * Whether the confirm can save: an entry placed, a reason given, and something changed, or on an entry already
 * written a reason alone. Used by "Spara", greyed out until it is true.
 * @param reason - the reason chosen or typed; empty for none
 */
export function canSave(line: LineState, reason: string): boolean {
  return !line.placing && reason.trim() !== '' && (isChanged(line) || !line.isNew)
}

/**
 * What the line shows, saved into the record. The entry and every neighbour it took in become the result's parts,
 * each marked edited (a new entry written by hand) with the reason, its break shared as on the line; a gap filled by
 * another profile becomes that profile's entry with the reason, the parts around it saying what divided them ("Delad
 * av Utveckling"). A running entry runs on, its last part with no stop. Entries of a profile left touching are saved as one. With
 * nothing changed, the reason alone is kept, the entry's times and mark as they were. Used by "Spara": 08:00–12:00,
 * its end dragged to 12:30 with "Glömde stämpla ut", becomes 08:00–12:30, edited.
 */
export function saveLine(record: TimeRecord, line: LineState, reason: string): TimeRecord {
  const why = reason.trim()
  if (!line.isNew && !isChanged(line)) {
    return { ...record, entries: record.entries.map((e) => (e.id === line.entry.id ? { ...e, reason: why } : e)) }
  }
  const made: Made = line.isNew ? 'hand' : 'edited'
  const docks = docked(line)
  const takenIds = new Set(
    [
      line.isNew ? null : line.entry.id,
      docks.before ? line.prev?.id : null,
      docks.after ? line.next?.id : null,
      ...line.joinsBefore.map((j) => j.id),
      ...line.joinsAfter.map((j) => j.id),
    ].filter((id): id is string => typeof id === 'string'),
  )
  const taken = record.entries.filter((e) => takenIds.has(e.id))
  const kept = record.entries.filter((e) => !takenIds.has(e.id))
  const runs = taken.some((e) => e.stop === null)
  const fillName = record.profiles.find((p) => p.id === line.fill)?.name ?? ''
  const partWhy = line.fill ? `Delad av ${fillName}` : why
  const parts = resultParts(line)
  const shares = breakShares(line)
  const added: Entry[] = []
  const newId = (): string => nextId([...record.entries, ...added])

  parts.forEach((part, i) => {
    added.push({
      id: i === 0 && !line.isNew ? line.entry.id : newId(),
      profile: line.profile,
      start: toTimestamp(new Date(part.from)),
      stop: runs && i === parts.length - 1 ? null : toTimestamp(new Date(part.to)),
      made,
      breakMinutes: shares[i],
      reason: partWhy,
    })
  })
  if (line.fill) {
    added.push({
      id: newId(),
      profile: line.fill,
      start: toTimestamp(new Date(line.start)),
      stop: toTimestamp(new Date(line.end)),
      made,
      breakMinutes: 0,
      reason: why,
    })
  }
  return { ...record, entries: joinedTouching([...kept, ...added], added) }
}

/**
 * Which entry a save leaves outlined in "Visa alla": the one edited, or for a forgotten entry the one written, by the id
 * it was given, its first part when it was divided ("Editing an entry on its line"). Used by the app after a save from
 * "Visa alla", which outlines that row and scrolls to it if it is out of view.
 * @returns null when the record holds no such entry
 */
export function savedEntryId(before: TimeRecord, after: TimeRecord, line: LineState): string | null {
  if (!line.isNew) return after.entries.some((e) => e.id === line.entry.id) ? line.entry.id : null
  const known = new Set(before.entries.map((e) => e.id))
  const added = after.entries.filter((e) => !known.has(e.id) && e.profile === line.profile)
  return added.sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0]?.id ?? null
}

/**
 * The entry taken out of the record ("An entry is deleted from its edit"); no reason is kept, since nothing is left to
 * carry it. Used by "Ta bort" on its second click.
 */
export function deleteEntry(record: TimeRecord, entryId: string): TimeRecord {
  return { ...record, entries: record.entries.filter((e) => e.id !== entryId) }
}

/** One stretch of the words under the day: its times, then its break as the list's tag */
export interface WordPiece {
  /** "07:58–12:10", or for a running entry its start alone */
  times: string
  /** Its own part (in white), a part left around a filled gap (grey), or the gap's new entry (in its profile's colour) */
  kind: 'own' | 'grey' | 'fill'
  /** In the text colour, as a change: a changed or divided entry's parts, and the gap's new entry */
  bold: boolean
  /** The new entry's base colour, for the fill */
  colour: string
  /** The break this part carries, shown as "paus 20min"; null for none */
  tag: number | null
  /** Whether its tag is red: a handle at the limit this part's break sets, or a switch refused */
  warn: boolean
  /** Whether a quiet "Lägg till paus" offers a break: on each part with none, while no gap is filled */
  addBreak: boolean
  /** Which of the result's parts it is, for its tag's field; null for the gap's new entry */
  part: number | null
}

/**
 * The result in words, under the day: each part's times and break, or the offer of one, the parts set apart, and with
 * a gap filled the new entry's times in its profile's colour between the grey parts. Used by the edit popup: 07:58–12:10 with 20 min reads
 * "07:58–12:10 paus 20min".
 */
export function resultWords(line: LineState, profiles: Profile[]): WordPiece[] {
  const parts = resultParts(line)
  const shares = breakShares(line)
  const changed = isChanged(line)
  const words: WordPiece[] = parts.map((part, i) => ({
    times: line.running ? clock(part.from) : `${clock(part.from)}–${clock(part.to)}`,
    kind: line.fill ? 'grey' : 'own',
    bold: !line.fill && (parts.length > 1 || changed),
    colour: '',
    tag: shares[i] > 0 ? shares[i] : null,
    warn: atLimit(line, i),
    addBreak: shares[i] === 0 && !line.fill,
    part: i,
  }))
  if (line.fill) {
    words.splice(line.start > line.originalStart ? 1 : 0, 0, {
      times: `${clock(line.start)}–${clock(line.end)}`,
      kind: 'fill',
      bold: true,
      colour: profiles.find((p) => p.id === line.fill)?.base ?? '',
      tag: null,
      warn: false,
      addBreak: false,
      part: null,
    })
  }
  return words
}

/** The reasons an edit can be given, before "Annan orsak" ("Every edit carries a reason") */
const REASONS = ['Glömde stämpla in', 'Glömde stämpla ut', 'Fel profil', 'Ärende', 'Glömd paus', 'Glömd post']

/**
 * The reasons as the list shows them, in Swedish alphabetical order, Å, Ä and Ö after Z, so one is where it can be
 * guessed. Used by the reason's list, which ends with "Annan orsak".
 */
export function reasonList(): string[] {
  return [...REASONS].sort((a, b) => a.localeCompare(b, 'sv'))
}

// ======================================
//               Helpers
// ======================================

/** A moment's time of day as the app shows it: "07:58". Used by the words */
function clock(time: number): string {
  return timeOfDay(toTimestamp(new Date(time)))
}

/** An entry as the line sees it, a running one stopping at now. Used for the entry and its walls */
function spanOf(entry: Entry, now: number): Span {
  return {
    id: entry.id,
    profile: entry.profile,
    start: Date.parse(entry.start),
    stop: entry.stop === null ? now : Date.parse(entry.stop),
    breakMinutes: entry.breakMinutes,
    running: entry.stop === null,
  }
}

/** Every entry but one, as the line's walls. Used to open a line */
function othersThan(record: TimeRecord, entryId: string, now: number): Span[] {
  return record.entries.filter((e) => e.id !== entryId).map((e) => spanOf(e, now))
}

/**
 * The entries with each one just saved made one with any entry of its profile it touches, as many times as it does:
 * its times reach over both, their breaks add up, a running one keeps it running, and its id, mark and reason stay.
 * Used by `saveLine`, so no two entries of a profile touch ("Two entries join by docking")
 */
function joinedTouching(entries: Entry[], saved: Entry[]): Entry[] {
  let all = entries
  for (const own of saved) {
    let merged = all.find((e) => e.id === own.id)
    if (!merged) continue
    for (;;) {
      const current: Entry = merged
      const touching = all.find((e) => e.id !== current.id && e.profile === current.profile && touches(current, e))
      if (!touching) break
      merged = {
        ...current,
        start: Date.parse(touching.start) < Date.parse(current.start) ? touching.start : current.start,
        stop: current.stop === null || touching.stop === null ? null : later(current.stop, touching.stop),
        breakMinutes: current.breakMinutes + touching.breakMinutes,
      }
      const done: Entry = merged
      all = all.filter((e) => e.id !== touching.id).map((e) => (e.id === done.id ? done : e))
    }
  }
  return all
}

/** Whether two entries meet end to start with no time between. Used by `joinedTouching`; a running one has no end */
function touches(a: Entry, b: Entry): boolean {
  return (
    (a.stop !== null && Date.parse(a.stop) === Date.parse(b.start)) ||
    (b.stop !== null && Date.parse(b.stop) === Date.parse(a.start))
  )
}

/** The later of two moments. Used by `joinedTouching` for the merged end */
function later(a: string, b: string): string {
  return Date.parse(a) >= Date.parse(b) ? a : b
}
