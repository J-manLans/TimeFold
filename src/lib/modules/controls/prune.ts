/**
 * Pruning old history on request ("Old history is pruned on request"): the record keeps a rolling window of three
 * years, and a quiet line offers to cut the whole months older than that. A prune cuts at the start of a month and
 * freezes what those months added up to as an opening dated the cut: the janitor's balance to the second, and the
 * ceiling's trend when it reaches back past the cut, so no number on screen changes. Pure: it returns a new record.
 */

import { balance, ceilingTrend, monthOf, trendStart } from '$lib/modules/shared/counting'
import type { Day, Opening, TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** How many years of history the record keeps before it offers to prune */
export const KEPT_YEARS = 3

/** What a prune on a day would do: the day it cuts at, the first of a month, and how many months go before it */
export interface PruneOffer {
  cut: Day
  months: number
}

/**
 * The prune on offer on a day, or null: the whole months from the record's first month that ended more than three
 * years before. Used by the prune line: installed on 1 January 2027, on 1 February 2030 it offers January 2027, cutting
 * at 1 February 2027.
 */
export function pruneOffer(record: TimeRecord, today: Day): PruneOffer | null {
  const first = firstDay(record)
  if (first === null) return null
  const [y, m] = today.split('-').map(Number)
  const back = new Date(Date.UTC(y - KEPT_YEARS, m - 1, 1))
  const cut = `${back.getUTCFullYear()}-${String(back.getUTCMonth() + 1).padStart(2, '0')}-01`
  const months = monthsBetween(monthOf(first).first, cut)
  return months > 0 ? { cut, months } : null
}

/** The prune line's words for the months on offer: one, or how many */
export function pruneWords(months: number): string {
  const which = months === 1 ? 'den äldsta månaden' : `de äldsta ${months} månaderna`
  return `Du har över tre års historik. Rensa ${which}?`
}

/**
 * The record pruned at the cut on offer: the janitor's balance up to the cut, and the ceiling's trend when it started
 * before it, frozen as one opening dated the cut; every entry that ended before the cut deleted, one across it kept
 * whole; the flex days and openings before it gone. Used by "Rensa" on its second click, after a copy is saved.
 * @returns the record as it was when nothing is on offer
 */
export function prune(record: TimeRecord, today: Day): TimeRecord {
  const offer = pruneOffer(record, today)
  const janitor = record.profiles.find((p) => p.expectedMinutes !== undefined)
  if (offer === null || janitor === undefined) return record
  const { cut } = offer

  const frozen = balance(record, janitor.id, dayBefore(cut))
  const minutes = Math.floor(frozen / 60)
  const opening: Opening = { profile: janitor.id, day: cut, balanceMinutes: minutes, seconds: frozen - minutes * 60 }
  const start = trendStart(record, today)
  if (start !== null && start < cut) opening.trendSeconds = ceilingTrend(record, cut)

  const cutMoment = localMidnight(cut)
  return {
    ...record,
    openings: [opening],
    entries: record.entries.filter((e) => e.stop === null || Date.parse(e.stop) > cutMoment),
    profiles: record.profiles.map((p) =>
      p.flexDays === undefined ? p : { ...p, flexDays: p.flexDays.filter((day) => day >= cut) },
    ),
  }
}

// ======================================
//               Helpers
// ======================================

/** The record's first day: its first opening, or with none its first entry's day. Used by `pruneOffer` */
function firstDay(record: TimeRecord): Day | null {
  const days = record.openings.map((o) => o.day).sort()
  if (days.length > 0) return days[0]
  const starts = record.entries.map((e) => e.start.slice(0, 10)).sort()
  return starts[0] ?? null
}

/** The whole months from one month's first day up to another's. Used to count the months on offer */
function monthsBetween(from: Day, to: Day): number {
  const [fy, fm] = from.split('-').map(Number)
  const [ty, tm] = to.split('-').map(Number)
  return (ty - fy) * 12 + (tm - fm)
}

/** The day before a day. Used for the last day the frozen balance covers */
function dayBefore(day: Day): Day {
  const [y, m, d] = day.split('-').map(Number)
  const before = new Date(Date.UTC(y, m - 1, d - 1, 12))
  const two = (n: number): string => String(n).padStart(2, '0')
  return `${before.getUTCFullYear()}-${two(before.getUTCMonth() + 1)}-${two(before.getUTCDate())}`
}

/** A day's first moment on this machine's clock. Used to tell an entry that ended before the cut */
function localMidnight(day: Day): number {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}
