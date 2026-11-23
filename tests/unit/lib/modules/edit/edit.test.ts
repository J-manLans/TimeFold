import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { applyMove, DAY_OF_SPANS, MOVE, RUNS } from '$tests/helpers/lines'
import { at, entry, RECORD } from '$tests/helpers/records'
import { canSave, lineForEntry, lineForGap, reasonList, resultWords, saveLine } from '$lib/modules/edit/edit'
import {
  clickMiddle,
  dragTo,
  grab,
  letGo,
  pickProfile,
  place,
  segments,
  type LineState,
  type Span,
} from '$lib/modules/edit/line'
import { secondsByDay } from '$lib/modules/shared/counting'
import { readRecord, toTimestamp, type Entry, type TimeRecord } from '$lib/modules/shared/record'

// === Constants ===

const THURSDAY = '2026-11-19'
const JANITOR = 'p1'
const DEVELOPMENT = 'p2'

// === Helpers ===

/** A moment on Thursday, or on a given day, in milliseconds. Used by every test */
function t(time: string, day = THURSDAY): number {
  return Date.parse(at(day, time))
}

/** The shared record with development work beside the janitor's, and these entries. Used by every test */
function record(...entries: Entry[]): TimeRecord {
  return {
    ...RECORD,
    profiles: [...RECORD.profiles, { id: DEVELOPMENT, name: 'Utveckling', hue: 200, base: '#4f8fd6' }],
    entries,
  }
}

/** A stopped entry on Thursday with an id, of the janitor unless another profile is given. Used by every test */
function work(id: string, from: string, to: string | null, { profile = JANITOR, breakMinutes = 0 } = {}): Entry {
  return entry(at(THURSDAY, from), to === null ? null : at(THURSDAY, to), { id, profile, breakMinutes })
}

/** The line for one of the record's entries, at 17:00 unless another now is given. Used by most tests */
function open(r: TimeRecord, id: string, now = t('17:00')): LineState {
  const line = lineForEntry(r, id, now)
  if (!line) throw new Error(`no entry ${id}`)
  return line
}

/** A handle dragged to a time in as many turns as the view needs, and let go. Used by most tests */
function drag(line: LineState, grip: 'start' | 'end', to: number): LineState {
  let moved = line
  for (let n = 0; n < 10; n++) {
    const held = grab(moved, grip, grip === 'end' ? moved.end : moved.start)
    if (!held) return moved
    const next = dragTo(moved, held, to)
    const reached = (grip === 'end' ? next.end : next.start) === to
    const still = grip === 'end' ? next.end === moved.end : next.start === moved.start
    moved = letGo(next)
    if (reached || still) return moved
  }
  return moved
}

/** The record's entries as "profile 08:00–12:30 made: reason", by start, for reading. Used by the save tests */
function rows(r: TimeRecord): string[] {
  const clock = (stamp: string | null): string => (stamp === null ? '…' : stamp.slice(11, 16))
  return [...r.entries]
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
    .map((e) => `${e.profile} ${clock(e.start)}–${clock(e.stop)} ${e.made}${e.reason ? `: ${e.reason}` : ''}`)
}

// === Tests ===

describe('the confirm waits for a reason, and for something to save', () => {
  it('greys out an end dragged to 12:30 until a reason is given, and a placed entry until it is placed', () => {
    const r = record(work('e1', '08:00', '12:00'))
    const moved = drag(open(r, 'e1'), 'end', t('12:30'))
    const gap = lineForGap(r, { from: t('12:00'), to: t('17:00') }, JANITOR, t('17:00'))

    expect([canSave(moved, ''), canSave(moved, '  '), canSave(moved, 'Glömde stämpla ut')]).toEqual([
      false,
      false,
      true,
    ])
    expect([canSave(gap, 'Glömd post'), canSave(place(gap, t('14:00')), 'Glömd post')]).toEqual([false, true])
  })

  it('lets an entry already written be saved with a reason alone', () => {
    expect(canSave(open(record(work('e1', '08:00', '12:00')), 'e1'), 'Stannade kvar')).toBe(true)
  })
})

describe('a save writes what the line shows, marked edited, with its reason', () => {
  it('saves 08:00–12:00 with its end at 12:30 as 08:00–12:30, edited, "Glömde stämpla ut"', () => {
    const r = record(work('e1', '08:00', '12:00'))

    expect(rows(saveLine(r, drag(open(r, 'e1'), 'end', t('12:30')), 'Glömde stämpla ut'))).toEqual([
      'p1 08:00–12:30 edited: Glömde stämpla ut',
    ])
  })

  it('keeps a reason alone, with the times and the mark as they were', () => {
    const r = record(work('e1', '08:00', '12:00'))
    const saved = saveLine(r, open(r, 'e1'), 'Stannade kvar och monterade barngrind hos Bantis')

    expect(rows(saved)).toEqual(['p1 08:00–12:00 clicked: Stannade kvar och monterade barngrind hos Bantis'])
  })

  it('gives both parts of a plain gap the reason chosen', () => {
    const r = record(work('e1', '08:00', '12:00'))
    const gap = clickMiddle(drag(drag(open(r, 'e1'), 'start', t('10:00')), 'end', t('10:40')))

    expect(rows(saveLine(r, gap, 'Ärende'))).toEqual(['p1 08:00–10:00 edited: Ärende', 'p1 10:40–12:00 edited: Ärende'])
  })

  it('divides 08:00–12:00 by development work at 10:00–10:40: the new entry "Ärende", the parts "Delad av Utveckling"', () => {
    const r = record(work('e1', '08:00', '12:00'))
    const filled = pickProfile(
      clickMiddle(drag(drag(open(r, 'e1'), 'start', t('10:00')), 'end', t('10:40'))),
      DEVELOPMENT,
    )

    expect(rows(saveLine(r, filled, 'Ärende'))).toEqual([
      'p1 08:00–10:00 edited: Delad av Utveckling',
      'p2 10:00–10:40 edited: Ärende',
      'p1 10:40–12:00 edited: Delad av Utveckling',
    ])
  })

  it('moves an entry across midnight to another profile whole, both days with it', () => {
    const night = entry(at('2026-11-17', '22:00'), at('2026-11-18', '01:00'), { id: 'e1' })
    const r = record(night)
    const saved = saveLine(r, pickProfile(open(r, 'e1', t('09:00', '2026-11-18')), DEVELOPMENT), 'Fel profil')

    expect(saved.entries).toMatchObject([{ profile: DEVELOPMENT, start: night.start, stop: night.stop }])
  })

  it('saves 22:00–23:30 dragged on to 00:30 as one entry, counted 2 h and 30 min', () => {
    const r = record(entry(at('2026-11-17', '22:00'), at('2026-11-17', '23:30'), { id: 'e1' }))
    const saved = saveLine(
      r,
      drag(open(r, 'e1', t('09:00', '2026-11-18')), 'end', t('00:30', '2026-11-18')),
      'Glömde stämpla ut',
    )

    expect(saved.entries).toHaveLength(1)
    expect(secondsByDay(saved.entries[0])).toEqual(
      new Map([
        ['2026-11-17', 2 * 3600],
        ['2026-11-18', 30 * 60],
      ]),
    )
  })
})

describe('joined entries are saved as one', () => {
  it('saves 08:00–10:00 docked onto 10:25–12:00 as 08:00–12:00, their breaks added', () => {
    const r = record(
      work('e1', '08:00', '10:00', { breakMinutes: 20 }),
      work('e2', '10:25', '12:00', { breakMinutes: 15 }),
    )
    const saved = saveLine(r, drag(open(r, 'e1'), 'end', t('10:25')), 'Glömde stämpla in')

    expect(rows(saved)).toEqual(['p1 08:00–12:00 edited: Glömde stämpla in'])
    expect(saved.entries[0]).toMatchObject({ id: 'e1', breakMinutes: 35 })
  })

  it('keeps the joined entry running when the second runs', () => {
    const r = record(work('e1', '08:00', '10:00'), work('e2', '10:25', null))

    expect(rows(saveLine(r, drag(open(r, 'e1', t('11:00')), 'end', t('10:25')), 'Glömde stämpla in'))).toEqual([
      'p1 08:00–… edited: Glömde stämpla in',
    ])
  })

  it('leaves no end handle once the joined entry runs, so nothing trims its end', () => {
    const r = record(work('e1', '08:00', '10:00'), work('e2', '10:25', null))
    const joined = drag(open(r, 'e1', t('11:00')), 'end', t('10:25'))

    expect(joined.running).toBe(true)
    expect(grab(joined, 'end', joined.end)).toBeNull()
  })

  it('saves 12:45–15:20 docked onto 08:02–12:00 and dragged back to 12:00 as 08:02–15:20', () => {
    const r = record(work('e1', '08:02', '12:00'), work('e2', '12:45', '15:20'))
    const back = drag(drag(open(r, 'e2'), 'start', t('12:00')), 'start', t('12:00'))

    expect(rows(saveLine(r, back, 'Ärende'))).toEqual(['p1 08:02–15:20 edited: Ärende'])
  })

  it('leaves 09:10–10:00 as it was when 08:00–09:00 walks past it to 10:05–11:00, and 08:00–09:00 goes', () => {
    const r = record(work('e1', '08:00', '09:00'), work('e2', '09:10', '10:00'))
    const docked = drag(open(r, 'e1'), 'end', t('09:10'))
    const walked = drag(drag(docked, 'end', t('11:00')), 'start', t('10:05'))

    expect(rows(saveLine(r, walked, 'Ärende'))).toEqual(['p1 09:10–10:00 clicked', 'p1 10:05–11:00 edited: Ärende'])
  })

  it('saves a placed janitor entry touching a janitor entry as one with it', () => {
    const r = record(work('e1', '08:00', '11:40'), work('e2', '13:05', '16:00'))
    const placed = place(lineForGap(r, { from: t('11:40'), to: t('13:05') }, JANITOR, t('17:00')), t('11:42'))

    expect(rows(saveLine(r, placed, 'Glömd post'))).toEqual([
      'p1 08:00–11:50 hand: Glömd post',
      'p1 13:05–16:00 clicked',
    ])
  })
})

describe('a running entry is saved running on, from its new start', () => {
  it('runs on from 08:00 after its start is dragged from 08:25, marked edited', () => {
    const r = record(work('e1', '08:25', null))

    expect(rows(saveLine(r, drag(open(r, 'e1', t('10:00')), 'start', t('08:00')), 'Glömde stämpla in'))).toEqual([
      'p1 08:00–… edited: Glömde stämpla in',
    ])
  })

  it('runs on as janitor work from the same start when moved from development', () => {
    const r = record(work('e1', '08:25', null, { profile: DEVELOPMENT }))

    expect(rows(saveLine(r, pickProfile(open(r, 'e1', t('10:00')), JANITOR), 'Fel profil'))).toEqual([
      'p1 08:25–… edited: Fel profil',
    ])
  })

  it('runs on from 11:00 when its start docks onto 11:00–12:30', () => {
    const r = record(work('e1', '11:00', '12:30'), work('e2', '13:00', null))

    expect(rows(saveLine(r, drag(open(r, 'e2', t('15:00')), 'start', t('12:30')), 'Ärende'))).toEqual([
      'p1 11:00–… edited: Ärende',
    ])
  })
})

describe('entries of a profile found touching are saved as one', () => {
  it('saves 06:00–06:05 opened beside 06:05–06:10 as 06:00–06:10, even with nothing moved', () => {
    const r = record(work('e1', '06:00', '06:05'), work('e2', '06:05', '06:10'))

    expect(rows(saveLine(r, open(r, 'e1'), 'Ärende'))).toEqual(['p1 06:00–06:10 edited: Ärende'])
  })
})

describe('a forgotten entry is saved written by hand', () => {
  it('saves 12:25–12:35 placed in 11:40–13:05 with "Glömd post"', () => {
    const r = record(work('e1', '08:00', '11:40', { profile: DEVELOPMENT }), work('e2', '13:05', '16:00'))
    const placed = place(lineForGap(r, { from: t('11:40'), to: t('13:05') }, JANITOR, t('17:00')), t('12:30'))

    expect(rows(saveLine(r, placed, 'Glömd post'))).toContain('p1 12:25–12:35 hand: Glömd post')
  })
})

describe('whatever is saved, the record keeps its rules', () => {
  /** A span as a record's entry, written as the app writes it */
  const asEntry = (s: Span, running: boolean): Entry => ({
    id: s.id,
    profile: s.profile,
    start: toTimestamp(new Date(s.start)),
    stop: running ? null : toTimestamp(new Date(s.stop)),
    made: 'clicked',
    breakMinutes: s.breakMinutes,
  })

  /** An entry's length in milliseconds, a running one to now */
  const length = (e: Entry, now: number): number => (e.stop === null ? now : Date.parse(e.stop)) - Date.parse(e.start)

  it(
    'saves no overlap, no two touching entries of a profile it changed, and the time the line showed',
    () => {
      fc.assert(
        fc.property(
          DAY_OF_SPANS,
          fc.nat(),
          fc.boolean(),
          fc.integer({ min: 1, max: 120 }),
          fc.array(MOVE, { maxLength: 20 }),
          (spans, pick, running, after, moves) => {
            const last = spans[spans.length - 1]
            const now = last.stop + after * 60_000
            const r = record(...spans.map((s) => asEntry(s, running && s === last)))
            const id = spans[pick % spans.length].id
            let line = open(r, id, now)
            for (const m of moves) line = applyMove(line, m)
            if (!canSave(line, 'Ärende')) return

            const saved = saveLine(r, line, 'Ärende')
            const shown = segments(line).reduce(
              (sum, g) => sum + (g.kind === 'add' ? g.to - g.from : g.kind === 'cut' ? g.from - g.to : 0),
              0,
            )
            const total = (x: TimeRecord): number => x.entries.reduce((sum, e) => sum + length(e, now), 0)
            const changed = (e: Entry): boolean =>
              JSON.stringify(e) !== JSON.stringify(r.entries.find((o) => o.id === e.id))
            const sorted = [...saved.entries].sort((a, b) => Date.parse(a.start) - Date.parse(b.start))

            expect(readRecord(JSON.stringify(saved)).ok).toBe(true)
            expect(total(saved)).toBe(total(r) + shown)
            sorted.slice(1).forEach((e, i) => {
              const before = sorted[i]
              expect(Date.parse(e.start)).toBeGreaterThanOrEqual(Date.parse(before.start) + length(before, now))
              const touching = Date.parse(e.start) === Date.parse(before.start) + length(before, now)
              if (touching && e.profile === before.profile) expect(changed(e) || changed(before)).toBe(false)
            })
          },
        ),
        { numRuns: RUNS },
      )
    },
    Math.max(5000, RUNS),
  )
})

describe('the words under the day say what the entry becomes', () => {
  /** The words as text, for reading: bold in *, grey in (), the fill's colour after @, "+ paus" offered as [+] */
  const said = (line: LineState, r: TimeRecord): string =>
    resultWords(line, r.profiles)
      .map((w) => {
        const times = w.kind === 'grey' ? `(${w.times})` : w.bold ? `*${w.times}*` : w.times
        const tag = w.tag !== null ? ` paus ${w.tag}` : w.addBreak ? ' [+]' : ''
        return `${times}${w.kind === 'fill' ? `@${w.colour}` : ''}${tag}`
      })
      .join(' · ')

  it('reads "07:58–12:10 paus 20" for an entry untouched, and its times in bold once changed', () => {
    const r = record(work('e1', '07:58', '12:10', { breakMinutes: 20 }))

    expect(said(open(r, 'e1'), r)).toBe('07:58–12:10 paus 20')
    expect(said(drag(open(r, 'e1'), 'end', t('12:30')), r)).toBe('*07:58–12:30* paus 20')
  })

  it('offers "+ paus" on an entry with no break', () => {
    const r = record(work('e1', '08:00', '12:00'))

    expect(said(open(r, 'e1'), r)).toBe('08:00–12:00 [+]')
  })

  it('reads a running entry by its start alone', () => {
    const r = record(work('e1', '08:25', null))

    expect(said(open(r, 'e1', t('10:00')), r)).toBe('08:25 [+]')
  })

  it('sets divided parts apart, each with its own tag', () => {
    const r = record(work('e1', '10:00', '11:00', { breakMinutes: 30 }))
    const gap = drag(clickMiddle(drag(drag(open(r, 'e1'), 'start', t('10:20')), 'end', t('10:50'))), 'end', t('10:40'))

    expect(said(gap, r)).toBe('*10:00–10:20* paus 20 · *10:40–11:00* paus 10')
  })

  it("greys the parts around a filled gap, the new entry in its profile's colour with no tag", () => {
    const r = record(work('e1', '08:00', '12:00', { breakMinutes: 20 }))
    const filled = pickProfile(
      clickMiddle(drag(drag(open(r, 'e1'), 'start', t('10:00')), 'end', t('10:40'))),
      DEVELOPMENT,
    )

    expect(said(filled, r)).toBe('(08:00–10:00) paus 20 · *10:00–10:40*@#4f8fd6 · (10:40–12:00)')
  })
})

describe('the reasons are listed in Swedish alphabetical order', () => {
  it('lists the starting reasons with Ä after the rest', () => {
    expect(reasonList()).toEqual([
      'Fel profil',
      'Glömd paus',
      'Glömd post',
      'Glömde stämpla in',
      'Glömde stämpla ut',
      'Ärende',
    ])
  })
})
