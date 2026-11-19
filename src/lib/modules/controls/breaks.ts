/**
 * An added break: time away during a running entry, added when back ("Time away is a gap or an added break"). It goes
 * to the running entry of the profile on screen, holds its length and the day it was added, and can be undone as the
 * last click ("The last click can be undone for a few seconds"). Pure: each function returns a new record.
 */

import { toTimestamp, type Click } from '$lib/modules/controls/clock'
import { localDay } from '$lib/modules/shared/counting'
import { type TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** Why a break could not be added: nothing runs on the profile on screen, it is longer than its entry, or it is 0 */
export type BreakRefusal = 'nothing-runs' | 'too-long' | 'no-length'

/** What adding a break gives: the changed record and the click for the undo, or why it was refused */
export type BreakResult = { ok: true; record: TimeRecord; click: Click } | { ok: false; why: BreakRefusal }

/**
 * A break of `minutes` added at `now` to the running entry of `profileId`, dated the day it was added. Refused when
 * that profile has nothing running, when the entry's breaks would pass its whole length so far, or for no length.
 * Used by "Lägg till paus" on Enter: 45 min added at Wednesday 00:20 to an entry since Tuesday 22:00 is dated
 * Wednesday; 5 h on an entry that has run 2 h is refused.
 */
export function addBreak(record: TimeRecord, profileId: string, minutes: number, now: Date): BreakResult {
  if (minutes <= 0) return { ok: false, why: 'no-length' }
  const running = record.entries.find((e) => e.stop === null && e.profile === profileId)
  if (running === undefined) return { ok: false, why: 'nothing-runs' }

  const ranMinutes = (now.getTime() - Date.parse(running.start)) / 60_000
  const taken = running.breaks.reduce((sum, b) => sum + b.minutes, 0)
  if (taken + minutes > ranMinutes) return { ok: false, why: 'too-long' }

  const added = { day: localDay(now.getTime()), minutes }
  const entries = record.entries.map((e) => (e.id === running.id ? { ...e, breaks: [...e.breaks, added] } : e))
  return {
    ok: true,
    record: { ...record, entries },
    click: { kind: 'break', at: toTimestamp(now), entry: running.id, minutes },
  }
}
