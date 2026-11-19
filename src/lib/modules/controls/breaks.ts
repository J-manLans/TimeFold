/**
 * An added break: time away during a running entry, added when back ("Time away is a gap or an added break"). The
 * field holds the running entry's whole break, and setting a new total adds the difference, dated the day it is
 * added, or takes time back, off the latest break first. It goes to the running entry of the profile on screen, and
 * can be undone as the last click ("The last click can be undone for a few seconds"). Pure: each function returns a
 * new record.
 */

import { toTimestamp, type Click } from '$lib/modules/controls/clock'
import { localDay } from '$lib/modules/shared/counting'
import { type Break, type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/**
 * Why a total could not be set: nothing runs on the profile on screen, it is longer than its entry so far, or it is
 * the total already there
 */
export type BreakRefusal = 'nothing-runs' | 'too-long' | 'no-change'

/** What setting a total gives: the changed record and the click for the undo, or why it was refused */
export type BreakResult = { ok: true; record: TimeRecord; click: Click } | { ok: false; why: BreakRefusal }

/**
 * The running entry's whole break so far, in minutes, for the profile on screen; 0 when none runs. Used by "Lägg till
 * paus", whose field opens on it: one break of 20 and one of 25 give 45.
 */
export function breakSoFar(record: TimeRecord, profileId: string): number {
  const running = record.entries.find((e) => e.stop === null && e.profile === profileId)
  return running === undefined ? 0 : total(running.breaks)
}

/**
 * The running entry of `profileId` given a whole break of `minutes`, at `now`. A higher total adds the difference,
 * dated the day it is added; a lower one takes time back, off the latest break first, and 0 takes it all. Refused
 * when that profile has nothing running, when the total would pass the entry's whole length so far, or when it is the
 * total already there. Used by "Lägg till paus" on Enter: 20 set to 30 adds 10 dated today; 5 h on an entry that has
 * run 2 h is refused.
 */
export function setBreak(record: TimeRecord, profileId: string, minutes: number, now: Date): BreakResult {
  const running = record.entries.find((e) => e.stop === null && e.profile === profileId)
  if (running === undefined) return { ok: false, why: 'nothing-runs' }
  const from = total(running.breaks)
  if (minutes === from) return { ok: false, why: 'no-change' }
  if (minutes > (now.getTime() - Date.parse(running.start)) / 60_000) return { ok: false, why: 'too-long' }

  const breaks =
    minutes > from
      ? [...running.breaks, { day: localDay(now.getTime()), minutes: minutes - from }]
      : takenBack(running.breaks, from - minutes)
  const entries = record.entries.map((e) => (e.id === running.id ? { ...e, breaks } : e))
  return {
    ok: true,
    record: { ...record, entries },
    click: { kind: 'break', at: toTimestamp(now), entry: running.id, before: running.breaks, from, to: minutes },
  }
}

// ======================================
//               Helpers
// ======================================

/** The minutes of a list of breaks together. Used by `breakSoFar` and `setBreak` */
function total(breaks: Break[]): number {
  return breaks.reduce((sum, b) => sum + b.minutes, 0)
}

/**
 * Breaks with `minutes` taken back, off the latest first; a break taken down to nothing goes. Used by `setBreak` for
 * a lower total: 30 Tuesday and 15 Wednesday, 25 taken back, leave 20 Tuesday
 */
function takenBack(breaks: Break[], minutes: number): Break[] {
  const kept = [...breaks]
  let left = minutes
  while (left > 0 && kept.length > 0) {
    const last = kept[kept.length - 1]
    const cut = Math.min(left, last.minutes)
    left -= cut
    if (cut === last.minutes) kept.pop()
    else kept[kept.length - 1] = { ...last, minutes: last.minutes - cut }
  }
  return kept
}
