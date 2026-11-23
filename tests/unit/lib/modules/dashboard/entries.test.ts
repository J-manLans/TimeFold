import { describe, expect, it } from 'vitest'
import { at, entry, RECORD } from '$tests/helpers/records'
import { entryRow, gapsAbove, stoppedEntries, withMonthLines } from '$lib/modules/dashboard/entries'
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

    expect(row).toEqual({
      day: 'mån 16',
      times: '07:58–11:30',
      later: 0,
      letter: 'V',
      base: '#7ed6d5',
      tag: '',
      length: '3:32',
    })
  })

  it('reads an entry across midnight on the day it started, with its whole length', () => {
    const row = entryRow(entry(at('2026-11-17', '22:00'), at('2026-11-18', '01:00')), RECORD)

    expect(row).toMatchObject({ day: 'tis 17', times: '22:00–01:00', later: 1, length: '3:00' })
  })

  it('takes its added break off its length, and tags it: 08:00–12:00 with 45 min', () => {
    const row = entryRow(entry(at('2026-11-16', '08:00'), at('2026-11-16', '12:00'), { breakMinutes: 45 }), RECORD)

    expect(row).toMatchObject({ tag: 'paus 45min', length: '3:15' })
  })

  it('says how many days later an entry ends that runs over several midnights', () => {
    const row = entryRow(entry(at('2026-11-14', '21:30'), at('2026-11-16', '07:00')), RECORD)

    expect(row).toMatchObject({ day: 'lör 14', times: '21:30–07:00', later: 2 })
  })
})

describe('"Visa alla" opens each month with a line naming it and its year', () => {
  it('puts november, oktober and september 2026 above their entries, newest first', () => {
    const nov = entry(at('2026-11-17', '08:00'), at('2026-11-17', '12:00'), { id: 'nov' })
    const oct = entry(at('2026-10-21', '08:00'), at('2026-10-21', '12:00'), { id: 'oct' })
    const oct2 = entry(at('2026-10-20', '08:00'), at('2026-10-20', '12:00'), { id: 'oct2' })
    const sep = entry(at('2026-09-28', '08:00'), at('2026-09-28', '12:00'), { id: 'sep' })

    const items = withMonthLines([nov, oct, oct2, sep]).map((item) =>
      item.kind === 'month' ? item.label : item.entry.id,
    )

    expect(items).toEqual(['november 2026', 'nov', 'oktober 2026', 'oct', 'oct2', 'september 2026', 'sep'])
  })

  it('names the year again where the list crosses into another', () => {
    const jan = entry(at('2027-01-04', '08:00'), at('2027-01-04', '12:00'), { id: 'jan' })
    const dec = entry(at('2026-12-30', '08:00'), at('2026-12-30', '12:00'), { id: 'dec' })

    const labels = withMonthLines([jan, dec]).filter((item) => item.kind === 'month')

    expect(labels.map((item) => item.kind === 'month' && item.label)).toEqual(['januari 2027', 'december 2026'])
  })

  it('gives an empty list nothing', () => {
    expect(withMonthLines([])).toEqual([])
  })
})

describe('"Visa alla" has a gap above each row, with a "+" where an entry fits', () => {
  it('opens the always-shown gap from the newest entry up to now: 11:40–13:05 at 15:20', () => {
    const newest = entry(at('2026-11-19', '11:40'), at('2026-11-19', '13:05'))

    const [gap] = gapsAbove([newest], Date.parse(at('2026-11-19', '15:20')))

    expect(gap).toEqual({ from: Date.parse(newest.stop!), to: Date.parse(at('2026-11-19', '15:20')), kind: 'top' })
  })

  it('ends the always-shown gap at a running entry: 13:05–14:00 under work running since 14:00', () => {
    const newest = entry(at('2026-11-19', '11:40'), at('2026-11-19', '13:05'))

    const [gap] = gapsAbove([newest], Date.parse(at('2026-11-19', '14:00')))

    expect(gap).toMatchObject({ to: Date.parse(at('2026-11-19', '14:00')), kind: 'top' })
  })

  it('gives the gap between 08:00–11:40 and 13:05–16:00 a "+" shown on hover, on 11:40–13:05', () => {
    const late = entry(at('2026-11-19', '13:05'), at('2026-11-19', '16:00'))
    const early = entry(at('2026-11-19', '08:00'), at('2026-11-19', '11:40'))

    const gaps = gapsAbove([late, early], Date.parse(at('2026-11-19', '17:00')))

    expect(gaps.map((g) => g.kind)).toEqual(['top', 'open'])
    expect(gaps[1]).toMatchObject({ from: Date.parse(early.stop!), to: Date.parse(late.start) })
  })

  it('shuts gaps of seconds, and shows the "+" on the first gap below them with 5 minutes\' room', () => {
    const third = entry(at('2026-11-19', '10:00:20'), at('2026-11-19', '10:00:30'))
    const second = entry(at('2026-11-19', '10:00:05'), at('2026-11-19', '10:00:15'))
    const first = entry(at('2026-11-19', '08:00'), at('2026-11-19', '09:00'))

    const gaps = gapsAbove([third, second, first], Date.parse(at('2026-11-19', '10:00:40')))

    expect(gaps.map((g) => g.kind)).toEqual(['shut', 'shut', 'top'])
  })

  it('gives exactly 5 minutes a "+", and 4:59 none', () => {
    const newer = entry(at('2026-11-19', '10:05'), at('2026-11-19', '11:00'))
    const older = entry(at('2026-11-19', '09:00'), at('2026-11-19', '10:00'))
    const oldest = entry(at('2026-11-19', '08:00'), at('2026-11-19', '08:55:01'))

    const gaps = gapsAbove([newer, older, oldest], Date.parse(at('2026-11-19', '11:00')))

    expect(gaps.map((g) => g.kind)).toEqual(['shut', 'top', 'shut'])
  })
})
