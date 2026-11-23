/**
 * The scale under the entry line: at most eight labels across the view, in the smallest unit and step that fits
 * ("The line's view holds still while a handle is dragged"): minutes every 5, 10, 15 or 30 ("10:05"), hours every 1, 2,
 * 3, 6 or 12 ("08", midnight as its day, "tor"), days every 1 or 2 ("tor 20"), weeks on Mondays ("v. 47"), months
 * every 1, 3 or 6 ("nov", January as its year), years every 1, 2, 5 or 10, and wider steps beyond. Labels fall on this
 * machine's clock.
 */

import { localDay } from '$lib/modules/shared/counting'
import { dayShort, monthShort, weekdayShort } from '$lib/modules/shared/dates'
import { type View } from '$lib/modules/edit/line'

// ======================================
//                 API
// ======================================

/** One label of the scale and where it stands */
export interface Tick {
  at: number
  label: string
}

/** The most labels the scale shows across the view */
export const MOST_TICKS = 8

/**
 * The scale's labels for a view. Used under the line, at every redraw: a view of 9 h gives a label every 2 hours, of 5
 * days one a day ("lör 21"), of 20 days one a week ("v. 48").
 */
export function ticks(view: View): Tick[] {
  const width = view.to - view.from
  let unit = UNITS.find(([kind, step]) => width / (LENGTH[kind] * step) <= MOST_TICKS)
  for (let years = 20; !unit; years *= 2) if (width / (LENGTH.y * years) <= MOST_TICKS) unit = ['y', years]
  const [kind, step] = unit
  const t = new Date(view.from)
  if (kind === 'n') t.setSeconds(0, 0)
  else if (kind === 'h') t.setMinutes(0, 0, 0)
  else t.setHours(0, 0, 0, 0)
  if (kind === 'm' || kind === 'y') t.setDate(1)
  if (kind === 'y') t.setMonth(0)
  if (kind === 'w') t.setDate(t.getDate() - ((t.getDay() + 6) % 7))
  const out: Tick[] = []
  for (let i = 0; t.getTime() <= view.to && i < 2000; i++) {
    if (t.getTime() >= view.from && falls(t, kind, step)) out.push({ at: t.getTime(), label: label(t, kind) })
    advance(t, kind)
  }
  return out
}

// ======================================
//               Helpers
// ======================================

/** A unit of the scale: minutes, hours, days, weeks, months or years */
type Kind = 'n' | 'h' | 'd' | 'w' | 'm' | 'y'

const HOUR = 3_600_000
const DAY = 24 * HOUR

/** Each unit's length, roughly, to judge how many labels a step gives */
const LENGTH: Record<Kind, number> = { n: 60_000, h: HOUR, d: DAY, w: 7 * DAY, m: 30.44 * DAY, y: 365.25 * DAY }

/** The steps tried, smallest first */
const UNITS: [Kind, number][] = [
  ['n', 5],
  ['n', 10],
  ['n', 15],
  ['n', 30],
  ['h', 1],
  ['h', 2],
  ['h', 3],
  ['h', 6],
  ['h', 12],
  ['d', 1],
  ['d', 2],
  ['w', 1],
  ['m', 1],
  ['m', 3],
  ['m', 6],
  ['y', 1],
  ['y', 2],
  ['y', 5],
  ['y', 10],
]

/** Whether a moment of the unit falls on the step. Used by `ticks` for each moment it walks */
function falls(t: Date, kind: Kind, step: number): boolean {
  if (kind === 'n') return t.getMinutes() % step === 0
  if (kind === 'h') return t.getHours() % step === 0
  if (kind === 'd') return Math.round(t.getTime() / DAY) % step === 0
  if (kind === 'm') return t.getMonth() % step === 0
  if (kind === 'y') return t.getFullYear() % step === 0
  return true
}

/** A moment's label in its unit. Used by `ticks` */
function label(t: Date, kind: Kind): string {
  const day = localDay(t.getTime())
  const midnight = t.getHours() === 0 && t.getMinutes() === 0
  const two = (n: number): string => String(n).padStart(2, '0')
  if (kind === 'n') return midnight ? weekdayShort(day) : `${two(t.getHours())}:${two(t.getMinutes())}`
  if (kind === 'h') return midnight ? weekdayShort(day) : two(t.getHours())
  if (kind === 'd') return dayShort(day)
  if (kind === 'w') return `v. ${isoWeek(t)}`
  if (kind === 'm') return t.getMonth() === 0 ? String(t.getFullYear()) : monthShort(day)
  return String(t.getFullYear())
}

/** A moment moved on by one of its unit. Used by `ticks` */
function advance(t: Date, kind: Kind): void {
  if (kind === 'n') t.setMinutes(t.getMinutes() + 1)
  else if (kind === 'h') t.setHours(t.getHours() + 1)
  else if (kind === 'd') t.setDate(t.getDate() + 1)
  else if (kind === 'w') t.setDate(t.getDate() + 7)
  else if (kind === 'm') t.setMonth(t.getMonth() + 1)
  else t.setFullYear(t.getFullYear() + 1)
}

/** A day's ISO week number. Used for the weeks' labels: Monday 23 November 2026 is week 48 */
function isoWeek(d: Date): number {
  const thursday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const jan4 = new Date(thursday.getFullYear(), 0, 4)
  return 1 + Math.round(((thursday.getTime() - jan4.getTime()) / DAY - 3 + ((jan4.getDay() + 6) % 7)) / 7)
}
