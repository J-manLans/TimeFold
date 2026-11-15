/** Records several test files share */

import { RECORD_FORMAT, RECORD_VERSION, type TimeRecord } from '$lib/modules/record'

/** A sound record of this version: one profile with a balance, an opening, a stopped entry and a running one */
export const RECORD: TimeRecord = {
  format: RECORD_FORMAT,
  version: RECORD_VERSION,
  profiles: [
    {
      id: 'p1',
      name: 'Vaktis',
      hue: 28,
      base: '#d78951',
      expectedMinutes: [{ from: '2026-11-16', minutes: 360 }],
    },
  ],
  openings: [{ profile: 'p1', day: '2026-11-16', balanceMinutes: 750 }],
  entries: [
    { id: 'e1', profile: 'p1', start: '2026-11-16T07:58:00+02:00', stop: '2026-11-16T11:30:00+02:00', made: 'clicked' },
    { id: 'e2', profile: 'p1', start: '2026-11-17T08:01:00+02:00', stop: null, made: 'clicked' },
  ],
}
