/**
 * An edit between the record and the entry line: an entry or a gap opened on the line, and what the line shows saved
 * back into the record with its mark and its reason ("Editing an entry on its line", "Every edit carries a reason",
 * "Entries remember how they were made"). Pure: the save returns a new record.
 */

import {
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
import { nextId, toTimestamp, type Entry, type Made, type TimeRecord } from '$lib/modules/shared/record'

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
 * av Utveckling"). A part reaching a running entry runs on. Entries of a profile left touching are saved as one. With
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

// ======================================
//               Helpers
// ======================================

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
