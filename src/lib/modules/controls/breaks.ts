/**
 * An added break: time away during a running entry, added when back ("Time away is a gap or an added break"). The
 * field holds the running entry's whole break, its one length, and setting a new total replaces it. It goes to the
 * running entry of the profile on screen, and can be undone as the last click ("The last click can be undone for a
 * few seconds"). Pure: each function returns a new record.
 */

import { type Click } from '$lib/modules/controls/clock'
import { toTimestamp, type TimeRecord } from '$lib/modules/shared/record'

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
 * paus", whose field opens on it.
 */
export function breakSoFar(record: TimeRecord, profileId: string): number {
  const running = record.entries.find((e) => e.stop === null && e.profile === profileId)
  return running === undefined ? 0 : running.breakMinutes
}

/**
 * The running entry of `profileId` given a whole break of `minutes`, at `now`: higher adds, lower takes time back, and
 * 0 takes it all. Refused when that profile has nothing running, when the total would pass the entry's whole length so
 * far, or when it is the total already there. Used by "Lägg till paus" on Enter: 20 set to 30 gives 30; 5 h on an
 * entry that has run 2 h is refused.
 */
export function setBreak(record: TimeRecord, profileId: string, minutes: number, now: Date): BreakResult {
  const running = record.entries.find((e) => e.stop === null && e.profile === profileId)
  if (running === undefined) return { ok: false, why: 'nothing-runs' }
  const from = running.breakMinutes
  if (minutes === from) return { ok: false, why: 'no-change' }
  if (minutes > (now.getTime() - Date.parse(running.start)) / 60_000) return { ok: false, why: 'too-long' }

  const entries = record.entries.map((e) => (e.id === running.id ? { ...e, breakMinutes: minutes } : e))
  return {
    ok: true,
    record: { ...record, entries },
    click: { kind: 'break', at: toTimestamp(now), entry: running.id, from, to: minutes },
  }
}
