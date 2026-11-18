import { describe, expect, it } from 'vitest'
import { at, entry, RECORD } from '$tests/helpers/records'
import { entryRow, stoppedEntries } from '$lib/modules/dashboard/entries'
import { type Entry, type TimeRecord } from '$lib/modules/shared/record'

// === Helpers ===

/** The shared record with these entries instead of its own. Used by the list tests */
function withEntries(entries: Entry[]): TimeRecord {
  return { ...RECORD, entries }
}

// === Tests ===

describe('the lists hold stopped entries, newest first', () => {
  it('lists the newest five of seven entries since yesterday', () => {
    const days = ['2026-11-16', '2026-11-16', '2026-11-16', '2026-11-17', '2026-11-17', '2026-11-17', '2026-11-17']
    const seven = days.map((day, i) => entry(at(day, `${8 + i}:00`), at(day, `${8 + i}:30`), { id: `e${i + 1}` }))

    const recent = stoppedEntries(withEntries(seven)).slice(0, 5)

    expect(recent.map((e) => e.id)).toEqual(['e7', 'e6', 'e5', 'e4', 'e3'])
  })

  it('leaves out the entry that runs', () => {
    const stopped = entry(at('2026-11-16', '08:00'), at('2026-11-16', '12:00'), { id: 'stopped' })
    const running = entry(at('2026-11-16', '13:00'), null, { id: 'running' })

    expect(stoppedEntries(withEntries([stopped, running])).map((e) => e.id)).toEqual(['stopped'])
  })
})

describe("an entry's row reads its day, its times, its profile and its length", () => {
  it('reads mån 16, 07:58–11:30, V and 3:32 for a Monday morning', () => {
    const row = entryRow(entry(at('2026-11-16', '07:58:40'), at('2026-11-16', '11:30:10')), RECORD)

    expect(row).toEqual({ day: 'mån 16', times: '07:58–11:30', letter: 'V', length: '3:32' })
  })

  it('reads an entry across midnight on the day it started, with its whole length', () => {
    const row = entryRow(entry(at('2026-11-17', '22:00'), at('2026-11-18', '01:00')), RECORD)

    expect(row).toMatchObject({ day: 'tis 17', times: '22:00–01:00', length: '3:00' })
  })
})
