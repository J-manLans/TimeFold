/** Records several test files share */

import { RECORD_FORMAT, RECORD_VERSION, type Entry, type TimeRecord } from '$lib/modules/shared/record'

/**
 * A sound record of this version: full time, one profile with a balance and a salary, an opening, a stopped entry and
 * a running one
 */
export const RECORD: TimeRecord = {
  format: RECORD_FORMAT,
  version: RECORD_VERSION,
  profiles: [
    {
      id: 'p1',
      name: 'Vaktis',
      hue: 195,
      base: '#7ed6d5',
      expectedMinutes: [{ from: '2026-11-16', minutes: 360 }],
      pay: [{ from: '2026-11-16', kind: 'salary', amount: 2000 }],
      flexDays: [],
    },
  ],
  fullTime: [{ from: '2026-11-16', minutes: 480 }],
  openings: [{ profile: 'p1', day: '2026-11-16', balanceMinutes: 750 }],
  entries: [
    {
      id: 'e1',
      profile: 'p1',
      start: '2026-11-16T07:58:00+02:00',
      stop: '2026-11-16T11:30:00+02:00',
      made: 'clicked',
      breakMinutes: 20,
      reason: 'Glömd paus',
    },
    { id: 'e2', profile: 'p1', start: '2026-11-17T08:01:00+02:00', stop: null, made: 'clicked', breakMinutes: 0 },
  ],
}

/**
 * A moment on this machine's clock, written as the app writes it: to the second, with the local offset. Used for
 * every entry's start and stop in tests: at('2026-11-17', '22:00')
 */
export function at(day: string, time: string): string {
  const [y, mo, d] = day.split('-').map(Number)
  const [h, mi, s = 0] = time.split(':').map(Number)
  const local = new Date(y, mo - 1, d, h, mi, s)
  const offset = -local.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const two = (n: number): string => String(Math.floor(Math.abs(n))).padStart(2, '0')
  return `${day}T${two(h)}:${two(mi)}:${two(s)}${sign}${two(offset / 60)}:${two(offset % 60)}`
}

let ids = 0

/**
 * A clicked entry, of the janitor unless another profile is given, running when there is no stop, with any added
 * break. Used by every test that needs work: entry(at('2026-11-16', '08:00'), null) is still running
 */
export function entry(
  start: string,
  stop: string | null,
  { profile = 'p1', id, breakMinutes = 0 }: { profile?: string; id?: string; breakMinutes?: number } = {},
): Entry {
  ids += 1
  return { id: id ?? `t${ids}`, profile, start, stop, made: 'clicked', breakMinutes }
}
