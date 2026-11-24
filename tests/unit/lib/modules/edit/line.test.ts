import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { applyMove, DAY_OF_SPANS, MOVE, RUNS } from '$tests/helpers/lines'
import { at } from '$tests/helpers/records'
import {
  atLimit,
  breakShares,
  breakTotal,
  clickMiddle,
  dragTo,
  fittedView,
  grab,
  keptMinutes as keptMinutesOf,
  leaving,
  letGo,
  meetingPoints,
  openGap,
  openLine,
  pickProfile,
  place,
  resultParts,
  segments,
  setBreak,
  stepHandle,
  walls,
  type Grip,
  type LineState,
  type Span,
} from '$lib/modules/edit/line'

// === Constants ===

const THURSDAY = '2026-11-19'
const FRIDAY = '2026-11-20'
const HOUR = 3_600_000

// === Helpers ===

/** A moment on Thursday, or on a given day. Used by every test */
function t(time: string, day = THURSDAY): number {
  return Date.parse(at(day, time))
}

/** A stopped entry as the line sees it, of the janitor unless another profile is given. Used by every test */
function span(from: string, to: string, { profile = 'p1', breakMinutes = 0, id = `${from}-${to}` } = {}): Span {
  return { id, profile, start: t(from), stop: t(to), breakMinutes }
}

/** One drag: grabbed where the grip is (the middle at its centre), moved through each time, and let go. Used by the view's tests */
function turn(state: LineState, grip: Grip, ...to: number[]): LineState {
  const from = grip === 'end' ? state.end : grip === 'start' ? state.start : (state.start + state.end) / 2
  const held = grab(state, grip, from)
  if (!held) return state
  let moved = state
  for (const time of to) moved = dragTo(moved, held, time)
  return letGo(moved)
}

/**
 * A handle dragged to a time in as many turns as the view needs, as a hand does: to the edge, let go, and again. Used
 * by most tests
 */
function drag(state: LineState, grip: 'start' | 'end', to: number): LineState {
  let line = state
  for (let n = 0; n < 10; n++) {
    const held = grab(line, grip, grip === 'end' ? line.end : line.start)
    if (!held) return line
    const moved = dragTo(line, held, to)
    const reached = (grip === 'end' ? moved.end : moved.start) === to
    const still = grip === 'end' ? moved.end === line.end : moved.start === line.start
    line = letGo(moved)
    if (reached || still) return line
  }
  return line
}

/** Stretches as clock times, for reading. Used by the result and colour tests */
function times(stretches: { from: number; to: number }[]): string[] {
  const clock = (time: number): string =>
    new Date(time).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
  return stretches.map((s) => `${clock(s.from)}–${clock(s.to)}`)
}

/** The line's colours as "kind 10:00–10:40", in order. Used by the colour tests */
function colours(state: LineState): string[] {
  return [...segments(state)].sort((a, b) => a.from - b.from).map((g) => `${g.kind} ${times([g])[0]}`)
}

// === Tests ===

describe('a handle moves its end, snapped to 5 minutes, and stops at walls', () => {
  it('08:00–12:00, its start dragged to 08:21, gives 08:20–12:00', () => {
    const line = drag(openLine(span('08:00', '12:00'), [], t('17:00')), 'start', t('08:21'))

    expect(times(resultParts(line))).toEqual(['08:20–12:00'])
  })

  it("stops at the view's edge, and reaches 16:00 in further drags as the view refits wider", () => {
    const first = turn(openLine(span('08:00', '12:00'), [], t('17:00')), 'end', t('16:00'))
    const second = turn(first, 'end', t('16:00'))

    expect(first.end).toBe(t('13:00'))
    expect(second.end).toBeGreaterThan(first.end + HOUR)
    expect(drag(first, 'end', t('16:00')).end).toBe(t('16:00'))
  })

  it('stops at the next entry: 12:30 is reached, 14:00 stops at 13:00', () => {
    const line = openLine(span('08:00', '12:00'), [span('13:00', '14:00', { profile: 'p2' })], t('17:00'))

    expect(drag(line, 'end', t('12:30')).end).toBe(t('12:30'))
    expect(drag(line, 'end', t('14:00')).end).toBe(t('13:00'))
  })

  it('stops at the previous entry ending 07:30', () => {
    const line = openLine(span('08:00', '12:00'), [span('06:00', '07:30', { profile: 'p2' })], t('17:00'))

    expect(drag(line, 'start', t('06:30')).start).toBe(t('07:30'))
  })

  it('never passes now to keep 5 minutes: 06:00–06:05 ending now, its start stepped to 06:01, its end dragged in', () => {
    const stepped = stepHandle(openLine(span('06:00', '06:05'), [], t('06:05')), 'start', 1)
    const dragged = turn(stepped, 'end', stepped.view.from)

    expect(dragged.end).toBe(t('06:05'))
  })

  it("is never pushed by the view's edge: 06:02–06:07 against 06:07–06:12 of another profile, dragged by its middle", () => {
    const line = openLine(span('06:02', '06:07'), [span('06:07', '06:12', { profile: 'p2' })], t('17:00'))
    const moved = turn(line, 'middle', line.view.from)

    expect(moved.end).toBeLessThanOrEqual(t('06:07'))
  })

  it('stops at now', () => {
    const line = openLine(span('08:00', '12:00'), [], t('12:10'))

    expect(drag(line, 'end', t('13:00')).end).toBe(t('12:10'))
  })

  it('moves the whole entry by its middle: 30 minutes later gives 08:30–12:30', () => {
    const line = openLine(span('08:00', '12:00'), [], t('17:00'))
    const moved = turn(line, 'middle', t('10:30'))

    expect(times(resultParts(moved))).toEqual(['08:30–12:30'])
  })

  it('crosses midnight freely: 22:00–23:30, its end dragged on to 00:30', () => {
    const line = openLine(span('22:00', '23:30'), [], t('09:00', FRIDAY))

    expect(drag(line, 'end', t('00:30', FRIDAY)).end).toBe(t('00:30', FRIDAY))
  })
})

describe('both handles inward shorten, and a click on the middle makes a gap', () => {
  const inward = drag(drag(openLine(span('08:00', '12:00'), [], t('17:00')), 'start', t('10:00')), 'end', t('10:40'))

  it('shortens 08:00–12:00 to 10:00–10:40, both ends red', () => {
    expect(times(resultParts(inward))).toEqual(['10:00–10:40'])
    expect(colours(inward)).toEqual(['cut 08:00–10:00', 'keep 10:00–10:40', 'cut 10:40–12:00'])
  })

  it('makes a gap when the middle is clicked, and shortens again on a second click', () => {
    const gap = clickMiddle(inward)

    expect(times(resultParts(gap))).toEqual(['08:00–10:00', '10:40–12:00'])
    expect(colours(gap)).toEqual(['keep 08:00–10:00', 'cut 10:00–10:40', 'keep 10:40–12:00'])
    expect(times(resultParts(clickMiddle(gap)))).toEqual(['10:00–10:40'])
  })

  it("shortens again once an edge is let go at the entry's end, so an old gap never comes back", () => {
    const gap = clickMiddle(inward)
    const out = drag(gap, 'end', t('12:00'))

    expect(out.mode).toBe('shorten')
    expect(times(resultParts(out))).toEqual(['08:00–10:00'])
    expect(drag(out, 'end', t('11:00')).mode).toBe('shorten')
  })
})

/**
 * 08:00–12:00 with a 1 h break, a gap made at 09:00–10:00 (the shortening before it must hold the break), its left
 * edge then dragged to 09:50: 10:00–12:00, the larger part at the click, carries the hour. Used by the gap's tests
 */
function made(): LineState {
  const line = openLine(span('08:00', '12:00', { breakMinutes: 60 }), [], t('17:00'))
  return drag(clickMiddle(drag(drag(line, 'start', t('09:00')), 'end', t('10:00'))), 'start', t('09:50'))
}

describe('a gap is left only on purpose', () => {
  /** A drag held, not let go. Used to see the outline */
  function held(state: LineState, grip: Grip, to: number): LineState {
    const grabbed = grab(state, grip, grip === 'end' ? state.end : state.start)
    return grabbed ? dragTo(state, grabbed, to) : state
  }

  it("closes when its edges meet: 08:00–09:50 outlined, dragged back out the gap returns, let go it's whole", () => {
    const gap = made()
    const meeting = held(gap, 'end', t('09:50'))

    expect(times(resultParts(meeting))).toEqual(['08:00–12:00'])
    expect(times([leaving(meeting, 'end') ?? { from: 0, to: 0 }])).toEqual(['08:00–09:50'])
    expect(leaving(held(gap, 'end', t('09:55')), 'end')).toBeNull()
    const whole = letGo(meeting)
    expect([whole.start, whole.end, whole.mode]).toEqual([t('08:00'), t('12:00'), 'shorten'])
    expect(breakShares(whole)).toEqual([60])
  })

  it('snaps an edge onto the other off the 5-minute marks: 09:52–10:00, dragged left, meets 09:52', () => {
    const gap = stepHandle(stepHandle(made(), 'start', 1), 'start', 1)

    expect(gap.start).toBe(t('09:52'))
    expect(held(gap, 'end', t('09:56')).end).toBe(t('09:55'))
    expect(held(gap, 'end', t('09:53')).end).toBe(t('09:52'))
  })

  it("stops an edge at the entry's start, and let go there leaves 10:00–12:00 as a shortening", () => {
    const pulled = held(made(), 'start', t('07:00'))

    expect(pulled.start).toBe(t('08:00'))
    expect(pulled.mode).toBe('gap')
    expect(times([leaving(pulled, 'start') ?? { from: 0, to: 0 }])).toEqual(['10:00–12:00'])
    const left = letGo(pulled)
    expect([left.start, left.end, left.mode]).toEqual([t('10:00'), t('12:00'), 'shorten'])
    expect(breakTotal(left)).toBe(60)
  })

  it("holds when a set break stops the edge short of the entry's start: 10:50–11:00, the left part's tag kept", () => {
    const line = openLine(span('08:00', '12:00', { breakMinutes: 60 }), [], t('17:00'))
    const gap = drag(clickMiddle(drag(drag(line, 'start', t('10:00')), 'end', t('11:00'))), 'start', t('10:50'))
    const set = setBreak(gap, 60, 0)
    const pulled = set && held(set, 'start', t('07:00'))

    expect(pulled?.start).toBe(t('09:00'))
    expect(pulled?.mode).toBe('gap')
    expect(pulled && atLimit(pulled, 0)).toBe(true)
  })

  it('closes when an edge is stepped onto the other by the minute', () => {
    let gap = made()
    for (let i = 0; i < 10; i++) gap = stepHandle(gap, 'end', -1)

    expect([gap.start, gap.end, gap.mode]).toEqual([t('08:00'), t('12:00'), 'shorten'])
  })

  it("lets a filled gap's edge go past the entry: no break, its start dragged to 07:45", () => {
    const line = openLine(span('08:00', '12:00'), [], t('17:00'))
    const filled = pickProfile(clickMiddle(drag(drag(line, 'start', t('09:50')), 'end', t('10:00'))), 'p2')
    const past = drag(filled, 'start', t('07:45'))

    expect([past.start, past.end]).toEqual([t('07:45'), t('10:00')])
    expect(times(resultParts(past))).toEqual(['10:00–12:00'])
  })
})

describe('another profile fills a gap', () => {
  const gap = clickMiddle(
    drag(
      drag(openLine(span('08:00', '12:00', { breakMinutes: 20 }), [], t('17:00')), 'start', t('10:00')),
      'end',
      t('10:40'),
    ),
  )
  const filled = pickProfile(gap, 'p2')

  it('makes 10:00–10:40 development work, the parts grey', () => {
    expect(filled.fill).toBe('p2')
    expect(colours(filled)).toEqual(['grey 08:00–10:00', 'fill 10:00–10:40', 'grey 10:40–12:00'])
  })

  it("does nothing when its middle is clicked, and empties when the entry's own profile is picked", () => {
    expect(clickMiddle(filled)).toBe(filled)
    const emptied = pickProfile(filled, 'p1')
    expect(emptied.fill).toBeNull()
    expect(emptied.mode).toBe('gap')
  })

  it('takes the end it is dragged to, and time past it is added', () => {
    const noBreak = pickProfile(
      clickMiddle(drag(drag(openLine(span('08:00', '12:00'), [], t('17:00')), 'start', t('10:00')), 'end', t('10:40'))),
      'p2',
    )
    const toEdge = drag(noBreak, 'end', t('12:00'))
    const past = drag(toEdge, 'end', t('12:30'))

    expect(times(resultParts(toEdge))).toEqual(['08:00–10:00'])
    expect(colours(past)).toContain('add 12:00–12:30')
  })

  it("stops with the break's 20 minutes left when dragged toward both edges, the tag red", () => {
    const wide = drag(drag(filled, 'start', t('08:00')), 'end', t('12:00'))

    expect(resultParts(wide).reduce((sum, p) => sum + (p.to - p.from), 0)).toBe(20 * 60_000)
    expect(atLimit(wide)).toBe(true)
  })

  it('is refused when the break would not fit: 06:00–06:05 touching 06:05–06:10, 6 min, moved to another profile', () => {
    const line = setBreak(openLine(span('06:00', '06:05'), [span('06:05', '06:10')], t('17:00')), 6)
    const moved = line && pickProfile(line, 'p3')

    expect(moved?.profile).toBe('p1')
    expect(moved && atLimit(moved)).toBe(true)
  })

  it('shortens, not gaps, once dragged out to both edges, emptied, and moved in again', () => {
    const noBreak = pickProfile(
      clickMiddle(drag(drag(openLine(span('08:00', '12:00'), [], t('17:00')), 'start', t('10:00')), 'end', t('10:40'))),
      'p2',
    )
    const out = pickProfile(drag(drag(noBreak, 'start', t('08:00')), 'end', t('12:00')), 'p1')
    const back = drag(drag(out, 'start', t('09:00')), 'end', t('11:00'))

    expect(back.mode).toBe('shorten')
  })
})

describe('the break is a wall, and divided it goes to the larger part first', () => {
  it('stops 10:00–11:00 with 30 min at 10:30, the tag red', () => {
    const line = drag(openLine(span('10:00', '11:00', { breakMinutes: 30 }), [], t('17:00')), 'start', t('10:45'))

    expect(line.start).toBe(t('10:30'))
    expect(atLimit(line)).toBe(true)
  })

  it('keeps a gap whose start, dragged out, is stopped by the break: 06:00–06:14, a gap 06:01–06:05, 1 and 9 min', () => {
    const line = openLine(span('06:00', '06:14'), [span('06:14', '06:19', { profile: 'p2' })], t('17:00'))
    const gap = clickMiddle(stepHandle(turn(line, 'end', line.view.from), 'start', 1))
    const both = setBreak(gap, 1, 0)
    const held = both && setBreak(both, 9, 1)
    const tried = held && turn(held, 'start', held.view.from)

    expect(tried?.mode).toBe('gap')
    expect(tried?.start).toBe(t('06:01'))
  })

  it('refuses 90 min on 10:00–11:00', () => {
    expect(setBreak(openLine(span('10:00', '11:00'), [], t('17:00')), 90)).toBeNull()
  })

  it('gives 08:00–12:00 with 30 min, a gap at 10:00–10:40, all 30 on 08:00–10:00', () => {
    const line = openLine(span('08:00', '12:00', { breakMinutes: 30 }), [], t('17:00'))
    const gap = clickMiddle(drag(drag(line, 'start', t('10:00')), 'end', t('10:40')))

    expect(breakShares(gap)).toEqual([30, 0])
  })

  it('shares 30 min over 10:00–10:20 and 10:40–11:00 as 20 and 10', () => {
    const line = openLine(span('10:00', '11:00', { breakMinutes: 30 }), [], t('17:00'))
    const gap = drag(clickMiddle(drag(drag(line, 'start', t('10:20')), 'end', t('10:50'))), 'end', t('10:40'))

    expect(times(resultParts(gap))).toEqual(['10:00–10:20', '10:40–11:00'])
    expect(breakShares(gap)).toEqual([20, 10])
  })

  it('keeps a gap that a shortening could not hold: 10:00–11:00 with 20 min, a 15 min middle', () => {
    const line = openLine(span('10:00', '11:00', { breakMinutes: 20 }), [], t('17:00'))
    const gap = drag(clickMiddle(drag(drag(line, 'start', t('10:20')), 'end', t('10:40'))), 'end', t('10:35'))
    const tried = clickMiddle(gap)

    expect(tried.mode).toBe('gap')
    expect(atLimit(tried)).toBe(true)
  })
})

describe('each part of a divided entry owns its break, spilling only until a tag is set', () => {
  it('offers each part its own break: 08:00–12:00 divided into 08:00–10:00 and 10:30–12:00 has none on either', () => {
    const line = openLine(span('08:00', '12:00'), [], t('17:00'))
    const gap = clickMiddle(drag(drag(line, 'start', t('10:00')), 'end', t('10:30')))

    expect(breakShares(gap)).toEqual([0, 0])
    const added = setBreak(gap, 15, 1)
    expect(added && breakShares(added)).toEqual([0, 15])
  })

  it('sets a part alone, never the sum: 1 h and 15 min, the 15 made 20, the other still 1 h', () => {
    const line = openLine(span('08:00', '11:00'), [], t('17:00'))
    const gap = clickMiddle(drag(drag(line, 'start', t('10:00')), 'end', t('10:30')))
    const parts = setBreak(setBreak(gap, 60, 0) ?? gap, 15, 1) ?? gap

    expect(breakShares(parts)).toEqual([60, 15])
    expect(breakShares(setBreak(parts, 20, 1) ?? parts)).toEqual([60, 20])
    expect(setBreak(parts, 45, 1)).toBeNull()
  })

  it('spills only the overflow while no tag is set, and takes it back when dragged back', () => {
    const gap = made()

    expect(breakShares(gap)).toEqual([0, 60])
    const spilled = drag(gap, 'end', t('11:30'))
    expect(breakShares(spilled)).toEqual([30, 30])
    expect(breakShares(drag(spilled, 'end', t('10:00')))).toEqual([0, 60])
  })

  it('lets a part hold nothing but break, red only at the limit: 08:00–10:00 with 50 min, a gap made at 08:40–09:40', () => {
    const line = openLine(span('08:00', '10:00', { breakMinutes: 50 }), [], t('17:00'))
    const gap = clickMiddle(drag(drag(line, 'start', t('08:40')), 'end', t('09:40')))

    expect(breakShares(gap)).toEqual([40, 10])
    expect(atLimit(gap, 0)).toBe(false)
  })

  it("stops at a set part's own limit, nothing spilling: the right part kept at 1 h stops its edge at 11:00", () => {
    const set = setBreak(made(), 60, 1) ?? made()
    const pushed = drag(set, 'end', t('11:30'))

    expect(pushed.end).toBe(t('11:00'))
    expect(breakShares(pushed)).toEqual([0, 60])
    expect(atLimit(pushed, 1)).toBe(true)
  })

  it('still spills with the gap filled while no tag is set', () => {
    const filled = pickProfile(made(), 'p2')

    expect(breakShares(drag(filled, 'end', t('11:30')))).toEqual([30, 30])
  })

  it('splits afresh after the gap closes, the lock gone', () => {
    const gap = made()
    const set = setBreak(setBreak(gap, 30, 0) ?? gap, 30, 1) ?? gap
    const whole = drag(set, 'end', t('09:50'))
    const again = clickMiddle(drag(drag(whole, 'start', t('10:00')), 'end', t('11:00')))

    expect(breakShares(whole)).toEqual([60])
    expect(again.breakSplit).toEqual({ minutes: [60, 0], set: false })
  })
})

describe("a clicked handle's pill steps by the minute", () => {
  it('steps 10:05 three times to 10:08', () => {
    let line = openLine(span('10:05', '11:00'), [], t('17:00'))
    for (let i = 0; i < 3; i++) line = stepHandle(line, 'start', 1)

    expect(line.start).toBe(t('10:08'))
  })

  it('sets the seconds to :00: 07:58:40 stepped back gives 07:57', () => {
    expect(stepHandle(openLine(span('07:58:40', '11:00'), [], t('17:00')), 'start', -1).start).toBe(t('07:57'))
  })

  it("does not move at the next entry's start", () => {
    const line = openLine(span('08:00', '13:00'), [span('13:00', '14:00', { profile: 'p2' })], t('17:00'))

    expect(stepHandle(line, 'end', 1).end).toBe(t('13:00'))
  })
})

describe("the line's view fits what is being edited", () => {
  it('gives a 2 h entry a view of about 3 h', () => {
    const view = openLine(span('08:00', '10:00'), [], t('17:00')).view

    expect((view.to - view.from) / HOUR).toBeCloseTo(2 / 0.65)
  })

  it('stays wide enough for an 8 h entry shortened to 1 h', () => {
    const short = turn(openLine(span('08:00', '16:00'), [], t('17:00')), 'end', t('09:00'))

    expect(short.view.to - short.view.from).toBeCloseTo((8 * HOUR) / 0.65)
  })

  it('fits an entry walked clear of where it started alone', () => {
    const line = openLine(span('08:00', '08:30'), [], t('17:00'))
    const walked = drag(drag(line, 'end', t('09:30')), 'start', t('09:05'))

    expect(walked.view).toEqual(fittedView({ ...walked, originalStart: walked.start, originalEnd: walked.end }))
  })
})

describe('entries of a profile that touch are one', () => {
  it('joins 08:00–10:00 docked on 10:25–12:00: the handle at 12:00, the gap green', () => {
    const line = openLine(span('08:00', '10:00'), [span('10:25', '12:00')], t('17:00'))
    const joined = drag(line, 'end', t('10:25'))

    expect(joined.end).toBe(t('12:00'))
    expect(times(resultParts(joined))).toEqual(['08:00–12:00'])
    expect(colours(joined)).toEqual(['keep 08:00–10:00', 'add 10:00–10:25', 'keep 10:25–12:00'])
  })

  it('trims the joined neighbour dragged back, and lets it go whole past its start', () => {
    const joined = drag(openLine(span('08:00', '10:00'), [span('10:25', '12:00')], t('17:00')), 'end', t('10:25'))
    const trimmed = drag(joined, 'end', t('11:00'))
    const released = drag(trimmed, 'end', t('10:20'))

    expect(colours(trimmed)).toContain('cut 11:00–12:00')
    expect(released.end).toBe(t('10:20'))
    expect(released.joinsAfter).toEqual([])
    expect(colours(released)).toContain('add 10:00–10:20')
  })

  it('takes a neighbour in again when let go on its far edge: 12:45–15:20 on 08:02–12:00, back to 12:00', () => {
    const line = openLine(span('12:45', '15:20'), [span('08:02', '12:00')], t('17:00'))
    const joined = drag(line, 'start', t('12:00'))
    const back = drag(joined, 'start', t('12:00'))

    expect(back.start).toBe(t('08:02'))
    expect(back.joinsBefore).toHaveLength(1)
  })

  it('leaves it whole and apart when let go a step past: at 12:05', () => {
    const joined = drag(openLine(span('12:45', '15:20'), [span('08:02', '12:00')], t('17:00')), 'start', t('12:00'))
    const apart = drag(joined, 'start', t('12:05'))

    expect(apart.start).toBe(t('12:05'))
    expect(apart.joinsBefore).toEqual([])
  })

  it('takes it in again when the pill steps onto its edge: from 11:55, + five times', () => {
    const joined = drag(openLine(span('12:45', '15:20'), [span('08:02', '12:00')], t('17:00')), 'start', t('12:00'))
    let line = drag(joined, 'start', t('11:55'))
    for (let i = 0; i < 5; i++) line = stepHandle(line, 'start', 1)

    expect(line.start).toBe(t('08:02'))
  })

  it('joins along a chain: 10:00–11:00 onto 11:00–12:00, then on onto 13:00–14:00', () => {
    const line = openLine(span('10:00', '11:00'), [span('11:00', '12:00'), span('13:00', '14:00')], t('17:00'))
    const chain = drag(drag(line, 'end', t('11:00')), 'end', t('13:00'))

    expect(chain.end).toBe(t('14:00'))
    expect(meetingPoints(chain)).toEqual([t('11:00')])
    expect(colours(chain)).toContain('add 12:00–13:00')
  })

  it('lets a chain go outermost first as the handle is dragged back: 13:30, 12:30, 11:30, 10:50', () => {
    const line = openLine(span('10:00', '11:00'), [span('11:00', '12:00'), span('13:00', '14:00')], t('17:00'))
    const chain = drag(drag(line, 'end', t('11:00')), 'end', t('13:00'))
    const steps = ['13:30', '12:30', '11:30', '10:50'].map((time) => t(time))
    const seen: string[][] = []
    let back = chain
    for (const time of steps) {
      back = drag(back, 'end', time)
      seen.push([...colours(back).filter((c) => c.startsWith('cut')), `joined ${back.joinsAfter.length}`])
    }

    expect(seen).toEqual([
      ['cut 13:30–14:00', 'joined 2'],
      ['joined 1'],
      ['cut 11:30–12:00', 'joined 1'],
      ['cut 10:50–11:00', 'joined 0'],
    ])
    expect(back.end).toBe(t('10:50'))
  })

  it('joins on both sides: 10:00–11:00 between 08:00–09:00 and 12:00–13:00 gives 08:00–13:00', () => {
    const line = openLine(span('10:00', '11:00'), [span('08:00', '09:00'), span('12:00', '13:00')], t('17:00'))
    const both = drag(drag(line, 'start', t('09:00')), 'end', t('12:00'))

    expect(times(resultParts(both))).toEqual(['08:00–13:00'])
  })

  it('lets a neighbour go whole as the other handle walks past it', () => {
    const line = openGap({ from: t('08:00'), to: t('09:30') }, [span('09:10', '10:00')], 'p1', t('17:00'))
    const placed = place(line, t('09:05'))
    const joined = drag(placed, 'end', t('09:10'))
    const stretched = drag(joined, 'end', t('10:30'))
    const walked = drag(stretched, 'start', t('10:05'))

    expect(times(resultParts(walked))).toEqual(['10:05–10:30'])
    expect(walls(walked).map((w) => w.id)).toEqual(['09:10-10:00'])
  })

  it('leaves a neighbour of another profile a wall', () => {
    const line = drag(
      openLine(span('08:00', '10:00'), [span('10:25', '12:00', { profile: 'p2' })], t('17:00')),
      'end',
      t('10:25'),
    )

    expect(line.end).toBe(t('10:25'))
    expect(line.joinsAfter).toEqual([])
  })

  it("sums the joined entries' breaks: 20 and 15 make 35", () => {
    const line = openLine(
      span('08:00', '10:00', { breakMinutes: 20 }),
      [span('10:25', '12:00', { breakMinutes: 15 })],
      t('17:00'),
    )

    expect(breakShares(drag(line, 'end', t('10:25')))).toEqual([35])
  })
})

describe('a running entry is edited at its start', () => {
  it('has no end handle and no middle to drag, and its start docks onto an earlier entry', () => {
    const running = openLine(span('13:00', '13:00'), [span('11:00', '12:30')], t('15:00'), true)
    const docked = drag(running, 'start', t('12:30'))

    expect(grab(running, 'end', t('15:00'))).toBeNull()
    expect(grab(running, 'middle', t('14:00'))).toBeNull()
    expect(running.end).toBe(t('15:00'))
    expect(docked.start).toBe(t('11:00'))
  })
})

describe('a forgotten entry is placed by its first click', () => {
  const gap = openGap(
    { from: t('11:40'), to: t('13:05') },
    [span('08:00', '11:40'), span('13:05', '16:00')],
    'p1',
    t('17:00'),
  )

  it('drops 10 minutes centred on 12:30', () => {
    expect(times(resultParts(place(gap, t('12:30'))))).toEqual(['12:25–12:35'])
  })

  it('cuts it at the wall for a click at 11:42, docked to the janitor entry it touches', () => {
    const placed = place(gap, t('11:42'))

    expect(times([{ from: placed.start, to: placed.end }])).toEqual(['11:40–11:50'])
    expect(times(resultParts(placed))).toEqual(['08:00–11:50'])
  })

  it('places nothing inside an entry, and a second click does nothing', () => {
    const placed = place(gap, t('12:30'))

    expect(place(gap, t('09:00'))).toBe(gap)
    expect(place(placed, t('12:50'))).toBe(placed)
  })
})

describe('whatever is dragged, stepped or picked, the line keeps its rules', () => {
  /** The rules every state of the line keeps. Used after every move */
  function keepsItsRules(line: LineState): void {
    expect(line.end - line.start).toBeGreaterThanOrEqual(60_000)
    expect(line.end).toBeLessThanOrEqual(line.now)
    for (const wall of walls(line)) expect(wall.stop <= line.start || wall.start >= line.end).toBe(true)
    expect(keptMinutesOf(line)).toBeGreaterThanOrEqual(breakTotal(line))
    const shares = breakShares(line)
    expect(shares.reduce((sum, m) => sum + m, 0)).toBe(breakTotal(line))
    resultParts(line).forEach((part, i) =>
      expect(shares[i]).toBeLessThanOrEqual(Math.round((part.to - part.from) / 60_000)),
    )
    for (const joined of line.joinsBefore) expect(joined.stop).toBeGreaterThan(line.start)
    for (const joined of line.joinsAfter) expect(joined.start).toBeLessThan(line.end)
    if (line.running) expect(line.end).toBe(line.now)
  }

  it(
    'never overlaps another entry, passes now, outgrows its break or trims a joined neighbour away',
    () => {
      fc.assert(
        fc.property(
          DAY_OF_SPANS,
          fc.nat(),
          fc.boolean(),
          fc.integer({ min: 0, max: 120 }),
          fc.array(MOVE, { maxLength: 25 }),
          (entries, pick, running, after, moves) => {
            const chosen = entries[pick % entries.length]
            const last = entries[entries.length - 1]
            const runs = running && chosen === last
            const now = last.stop + after * 60_000
            const others = entries
              .filter((e) => e !== chosen)
              .map((e) => (e === last && running ? { ...e, stop: now } : e))
            const before = structuredClone(others)
            let line = openLine(chosen, others, now, runs)
            keepsItsRules(line)
            for (const m of moves) {
              line = applyMove(line, m)
              keepsItsRules(line)
            }
            expect(others).toEqual(before)
          },
        ),
        { numRuns: RUNS },
      )
    },
    Math.max(5000, RUNS),
  )
})
