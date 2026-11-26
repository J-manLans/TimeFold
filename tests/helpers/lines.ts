/** Random days of entries and random moves on the entry line, for the property tests of the edit */

import fc from 'fast-check'
import {
  clickMiddle,
  dragTo,
  grab,
  letGo,
  pickProfile,
  setBreak,
  stepHandle,
  type Grip,
  type LineState,
  type Span,
} from '$lib/modules/edit/line'

/** How many random edits each property tries; a millisecond each at most */
export { RUNS } from '$tests/helpers/properties'

/** Thursday 19 November 2026 at 06:00 on this machine's clock, where every random day starts */
const MORNING = new Date(2026, 10, 19, 6, 0, 0).getTime()

/**
 * A day of entries back to back with gaps from none to two hours, some to the second, of two profiles, each with a
 * break it can hold, ids e0, e1 and on
 */
export const DAY_OF_SPANS: fc.Arbitrary<Span[]> = fc
  .array(
    fc.record({
      gap: fc.integer({ min: 0, max: 120 }),
      length: fc.integer({ min: 5, max: 240 }),
      seconds: fc.integer({ min: 0, max: 59 }),
      profile: fc.constantFrom('p1', 'p2'),
      breakShare: fc.double({ min: 0, max: 0.6, noNaN: true }),
    }),
    { minLength: 1, maxLength: 6 },
  )
  .map((rows) => {
    let time = MORNING
    return rows.map((row, i) => {
      const start = time + row.gap * 60_000 + (i % 2 === 0 ? row.seconds * 1000 : 0)
      const stop = start + row.length * 60_000
      time = stop
      return { id: `e${i}`, profile: row.profile, start, stop, breakMinutes: Math.floor(row.length * row.breakShare) }
    })
  })

/** One move on the line, a drag's times as shares of the view */
export const MOVE = fc.oneof(
  fc.record({
    kind: fc.constant('drag' as const),
    grip: fc.constantFrom<Grip>('start', 'end', 'middle'),
    to: fc.array(fc.double({ min: -0.2, max: 1.2, noNaN: true }), { minLength: 1, maxLength: 3 }),
  }),
  fc.record({
    kind: fc.constant('step' as const),
    handle: fc.constantFrom('start' as const, 'end' as const),
    by: fc.constantFrom(-1 as const, 1 as const),
  }),
  fc.record({ kind: fc.constant('middle' as const) }),
  fc.record({ kind: fc.constant('pick' as const), profile: fc.constantFrom('p1', 'p2', 'p3') }),
  fc.record({
    kind: fc.constant('break' as const),
    minutes: fc.integer({ min: 0, max: 120 }),
    part: fc.constantFrom(0, 1),
  }),
)

/** A move on the line */
export type Move = typeof MOVE extends fc.Arbitrary<infer M> ? M : never

/** A move done on the line, a drag grabbed where its grip is and let go at the end. Used by the properties */
export function applyMove(line: LineState, move: Move): LineState {
  if (move.kind === 'step') return stepHandle(line, move.handle, move.by)
  if (move.kind === 'middle') return clickMiddle(line)
  if (move.kind === 'pick') return pickProfile(line, move.profile)
  if (move.kind === 'break') return setBreak(line, move.minutes, move.part) ?? line
  const from = move.grip === 'end' ? line.end : move.grip === 'start' ? line.start : (line.start + line.end) / 2
  const held = grab(line, move.grip, from)
  if (!held) return line
  let moved = line
  for (const share of move.to) moved = dragTo(moved, held, line.view.from + share * (line.view.to - line.view.from))
  return letGo(moved)
}
