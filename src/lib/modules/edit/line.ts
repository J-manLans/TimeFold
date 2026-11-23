/**
 * The entry line's rules: an entry edited on its line, as plain state and moves ("Editing an entry on its line", "The
 * line's view holds still while a handle is dragged", "A clicked handle steps by the minute", "Two entries join by
 * docking", "A running entry is edited at its start", "A forgotten entry is written in the gap where it belongs").
 * Every move takes a state and returns the next one; nothing here touches the record or the screen. Times are
 * milliseconds since the epoch.
 */

// ======================================
//                 API
// ======================================

/** One entry as the line sees it: its stretch, its profile and its added break; a running one stops at now */
export interface Span {
  id: string
  profile: string
  start: number
  stop: number
  breakMinutes: number
  running?: boolean
}

/** The stretch of time the line shows, from its left edge to its right */
export interface View {
  from: number
  to: number
}

/** A stretch of the line and what it means against the entry as it was */
export interface Segment {
  from: number
  to: number
  /** `keep` the entry's own, `add` time added, `cut` time taken away, `grey` parts left around a filled gap, `fill` the gap's new entry */
  kind: 'keep' | 'add' | 'cut' | 'grey' | 'fill'
}

/** The line while an entry is edited on it */
export interface LineState {
  /** The entry being edited, as it was; a new entry's is empty until placed */
  entry: Span
  /** A forgotten entry being written, not yet saved */
  isNew: boolean
  /** A new entry not yet placed: the first click on free time places it */
  placing: boolean
  /** The entry runs, or has taken in one that does: its end is now, with no handle */
  running: boolean
  /** Every other entry, a running one stopping at now */
  others: Span[]
  now: number
  /** Where the handles are */
  start: number
  end: number
  /** The entry as it was, or for a new one what it is besides its joins */
  originalStart: number
  originalEnd: number
  profile: string
  /** Both handles inward shorten by default; a click on the middle makes it a gap */
  mode: 'shorten' | 'gap'
  /** The profile filling the gap, or null */
  fill: string | null
  /** The nearest entries outside the edit, the walls */
  prev: Span | null
  next: Span | null
  /** Neighbours taken in on each side, the nearest first */
  joinsBefore: Span[]
  joinsAfter: Span[]
  /** The break set with the tag, or null while it is the entries' own */
  breakSet: number | null
  /** A switch refused since the break could not fit, shown in red until the next change */
  refused: boolean
  view: View
}

/** Which part of the line a drag holds */
export type Grip = 'start' | 'end' | 'middle'

/** A drag under way: what it holds, where the handles were and the time first grabbed */
export interface Drag {
  grip: Grip
  grabbedAt: number
  startWas: number
  endWas: number
}

/** A minute */
export const MINUTE = 60_000

/** A dragged handle snaps to this many minutes of the clock */
export const SNAP_MINUTES = 5

/** What is being edited fills this share of the line, centred */
export const VIEW_FILL = 0.65

/** A forgotten entry is placed this many minutes long */
export const NEW_MINUTES = 10

/**
 * The line for an entry opened from a list. Used by the edit popup: 08:00–12:00 opens centred on 10:00, filling 65% of
 * the line. A running entry opens with its end at now.
 * @param entry - the entry chosen; for a running one, its stop is ignored
 * @param others - every other entry; a running one with its stop at now
 */
export function openLine(entry: Span, others: Span[], now: number, running = false): LineState {
  const end = running ? now : entry.stop
  const state: LineState = {
    entry: { ...entry, stop: end, running },
    isNew: false,
    placing: false,
    running,
    others,
    now,
    start: entry.start,
    end,
    originalStart: entry.start,
    originalEnd: end,
    profile: entry.profile,
    mode: 'shorten',
    fill: null,
    prev: nearestBefore(others, entry.start),
    next: nearestAfter(others, end),
    joinsBefore: [],
    joinsAfter: [],
    breakSet: null,
    refused: false,
    view: { from: 0, to: 0 },
  }
  return { ...state, view: fittedView(state) }
}

/**
 * The line for a forgotten entry, opened on a gap of "Visa alla", waiting for its place. Used by the gap's "+": the
 * gap 11:40–13:05 fills the line, and a click on it places the entry.
 * @param gap - the free time clicked, from the older entry's stop to the newer one's start or now
 * @param profile - the active profile, which the new entry starts on
 */
export function openGap(gap: View, others: Span[], profile: string, now: number): LineState {
  const width = (gap.to - gap.from) / VIEW_FILL
  const centre = (gap.from + gap.to) / 2
  return {
    entry: { id: '', profile, start: gap.from, stop: gap.from, breakMinutes: 0 },
    isNew: true,
    placing: true,
    running: false,
    others,
    now,
    start: gap.from,
    end: gap.from,
    originalStart: gap.from,
    originalEnd: gap.from,
    profile,
    mode: 'shorten',
    fill: null,
    prev: nearestBefore(others, gap.from),
    next: nearestAfter(others, gap.to),
    joinsBefore: [],
    joinsAfter: [],
    breakSet: null,
    refused: false,
    view: { from: centre - width / 2, to: centre + width / 2 },
  }
}

/**
 * The first click on a new entry's line: a 10-minute entry centred on it, snapped to 5 minutes and cut short by any
 * wall; the view then fits it. Used by the line while placing: a click at 12:30 gives 12:25–12:35, at 11:42 next to an
 * entry ending 11:40 gives 11:40–11:50. A click inside an entry, or where less than 5 minutes are free, places nothing.
 */
export function place(state: LineState, at: number): LineState {
  if (!state.placing || at > state.now) return state
  if (state.others.some((o) => o.start < at && o.stop > at)) return state
  const before = nearestBefore(state.others, at)
  const after = nearestAfter(state.others, at)
  const low = before ? before.stop : -Infinity
  const high = after ? after.start : state.now
  const start = Math.max(snap(at - (NEW_MINUTES * MINUTE) / 2), low)
  const end = Math.min(start + NEW_MINUTES * MINUTE, high)
  if (end - start < SNAP_MINUTES * MINUTE) return state
  const placed: LineState = {
    ...state,
    placing: false,
    start,
    end,
    originalStart: start,
    originalEnd: end,
    prev: nearestBefore(state.others, start),
    next: nearestAfter(state.others, end),
  }
  return { ...placed, view: fittedView(placed) }
}

/**
 * A drag begun on the line. Used by the line's pointer down: a handle, or the entry's own bar to move it whole. A
 * running entry has no end handle and its middle does not move.
 * @returns null where nothing can be dragged
 */
export function grab(state: LineState, grip: Grip, at: number): Drag | null {
  if (state.placing) return null
  if (state.running && grip !== 'start') return null
  return { grip, grabbedAt: at, startWas: state.start, endWas: state.end }
}

/**
 * The handle (or the whole entry) dragged to the time under the pointer, snapped to 5 minutes of the clock. It stops
 * at another entry, at now, at the view's edges, at its original when moved clear of it, and where the time kept could
 * no longer hold the break; dragged back to a joined neighbour's far end, it lets the neighbour go whole. Used on every
 * pointer move of a drag: 08:00–12:00, its start dragged to 08:20, gives 08:20–12:00.
 */
export function dragTo(state: LineState, drag: Drag, at: number): LineState {
  const step = SNAP_MINUTES * MINUTE
  // The view's edges stop a handle on the 5-minute mark just inside them, as a drag always lands on one, but never
  // push one that is already further out
  let low = Math.max(wallBefore(state), Math.min(snap(state.view.from, 'up'), state.start))
  let high = Math.min(wallAfter(state), Math.max(snap(state.view.to, 'down'), state.end))
  // An entry moved clear of where it started meets its original as a neighbour of its own profile
  if (!state.isNew && drag.grip === 'start' && drag.startWas >= state.originalEnd)
    low = Math.max(low, state.originalEnd)
  if (!state.isNew && drag.grip === 'end' && drag.endWas <= state.originalStart)
    high = Math.min(high, state.originalStart)
  let start = state.start
  let end = state.end
  // A handle keeps 5 minutes from the other, unless a wall is nearer, as after minute steps; it never passes a wall
  if (drag.grip === 'start') start = Math.max(Math.min(snap(at), state.end - step), Math.min(low, state.start))
  else if (drag.grip === 'end') end = Math.min(Math.max(snap(at), state.start + step), Math.max(high, state.end))
  else {
    const shift = Math.round((at - drag.grabbedAt) / step) * step
    const kept = Math.max(low - drag.startWas, Math.min(high - drag.endWas, shift))
    start = drag.startWas + kept
    end = drag.endWas + kept
  }
  // Each try starts from the state before the move, so a gap is judged as a gap until the move is done
  const tried = (from: number, to: number): LineState => normalised({ ...state, refused: false, start: from, end: to })
  let next = tried(start, end)
  // The break is a wall too: back toward where the handle was, a step at a time, until the parts can hold it
  for (let n = 0; !fits(next) && n < 5000; n++) {
    if (drag.grip === 'start' && start !== state.start) start += towards(start, state.start, step)
    else if (drag.grip === 'end' && end !== state.end) end += towards(end, state.end, step)
    else return { ...state, refused: false }
    next = tried(start, end)
  }
  return normalised(releaseJoins(next))
}

/**
 * A drag let go: a handle on the edge of a neighbour of the entry's profile takes it in, whichever way it moved, and
 * the view refits to what is being edited. Used by the line's pointer up after a drag: 08:00–10:00 let go at 10:25 on
 * 10:25–12:00 gives one entry to 12:00, its handle at 12:00.
 */
export function letGo(state: LineState): LineState {
  const joined = normalised(absorb(state))
  return { ...joined, view: fittedView(joined) }
}

/**
 * A handle stepped one minute by its pill, or by an arrow key while the pill is open ("A clicked handle steps by the
 * minute"). It meets the same walls as a drag (another entry, now, the break) but not the view's edges, which refit
 * after; its seconds go to :00. Stepped onto a neighbour of its profile, it takes it in. Used by the pill's − and +:
 * 10:05 and + three times gives 10:08.
 * @param by - -1 for −, 1 for +
 */
export function stepHandle(state: LineState, handle: 'start' | 'end', by: -1 | 1): LineState {
  if (state.placing || (state.running && handle === 'end')) return state
  let next = { ...state, refused: false }
  if (handle === 'start') {
    const moved = minuteOf(state.start) + by * MINUTE
    next.start = Math.min(Math.max(moved, wallBefore(state)), state.end - MINUTE)
  } else {
    const moved = minuteOf(state.end) + by * MINUTE
    next.end = Math.max(Math.min(moved, wallAfter(state)), state.start + MINUTE)
  }
  next = normalised(next)
  if (!fits(next)) return { ...state, refused: true }
  return letGo(normalised(releaseJoins(next)))
}

/**
 * A click on the middle with both handles inward: a shortening becomes a gap, and a gap a shortening. Refused, with
 * the tag red, when the break would not fit what is left; a filled gap does nothing. Used by the line's pointer up on
 * the red middle: 08:00–12:00 shortened to 10:00–10:40, clicked, keeps 08:00–10:00 and 10:40–12:00.
 */
export function clickMiddle(state: LineState): LineState {
  if (state.fill || !isInward(state)) return state
  const switched = normalised({ ...state, mode: state.mode === 'gap' ? 'shorten' : 'gap', refused: false })
  return fits(switched) ? switched : { ...state, refused: true }
}

/**
 * A profile picked in the edit's head. With a gap, another profile fills it and the entry's own empties it again;
 * otherwise the whole entry moves to that profile, its times unchanged. Refused, with the tag red, when the break would
 * no longer fit, as when the switch lets go of a neighbour it touched. Used by the profile picker: a gap at
 * 10:00–10:40 and "Utveckling" makes 10:00–10:40 development work.
 */
export function pickProfile(state: LineState, profile: string): LineState {
  const picked =
    (isInward(state) || state.fill) && state.mode === 'gap'
      ? normalised({ ...state, fill: profile === state.profile ? null : profile, refused: false })
      : normalised({ ...state, profile, fill: null, refused: false })
  return fits(picked) ? picked : { ...state, refused: true }
}

/**
 * The whole break set with the tag's field. Used when the field is kept: 0 takes it away.
 * @returns the next state, or null when it is longer than the time kept, which leaves the field open in red
 */
export function setBreak(state: LineState, minutes: number): LineState | null {
  if (minutes > keptMinutes(state)) return null
  return { ...state, breakSet: minutes, refused: false }
}

/**
 * What the entry becomes: one stretch, or two when divided, each taking in the neighbours docked to it. Used for the
 * words under the day and for the save: 08:00–12:00 with a gap at 10:00–10:40 gives 08:00–10:00 and 10:40–12:00.
 */
export function resultParts(state: LineState): View[] {
  const parts = isDivided(state)
    ? [
        { from: state.originalStart, to: state.start },
        { from: state.end, to: state.originalEnd },
      ].filter((p) => p.to > p.from)
    : [{ from: state.start, to: state.end }]
  const docks = docked(state)
  if (docks.before && state.prev && parts.length > 0) parts[0].from = state.prev.start
  if (docks.after && state.next && parts.length > 0) parts[parts.length - 1].to = state.next.stop
  return parts
}

/**
 * The line's colours: kept, added (green), taken away (red), and with a filled gap the parts grey and the gap in the
 * new profile. Used to draw the bar: 08:00–12:00 with its start dragged to 08:20 keeps 08:20–12:00 and cuts
 * 08:00–08:20. A joined neighbour's own time is kept, not added; only the stretch dragged across to it is green.
 */
export function segments(state: LineState): Segment[] {
  const { originalStart: o1, originalEnd: o2, start: s, end: e } = state
  const out: Segment[] = []
  const add = (from: number, to: number, kind: Segment['kind']): void => {
    if (to > from) out.push({ from, to, kind })
  }
  if (isFilling(state)) {
    add(o1, s, 'grey')
    add(Math.max(s, o1), Math.min(e, o2), 'fill')
    add(e, o2, 'grey')
    add(s, o1, 'add')
    add(o2, e, 'add')
    return out
  }
  if (isInward(state)) {
    if (state.mode === 'gap') {
      add(o1, s, 'keep')
      add(s, e, 'cut')
      add(e, o2, 'keep')
    } else {
      add(o1, s, 'cut')
      add(s, e, 'keep')
      add(e, o2, 'cut')
    }
    return out
  }
  const keptFrom = Math.max(o1, s)
  const keptTo = Math.min(o2, e)
  if (keptTo > keptFrom) {
    add(keptFrom, keptTo, 'keep')
    add(s, o1, 'add')
    add(o2, e, 'add')
    add(o1, s, 'cut')
    add(e, o2, 'cut')
  } else {
    add(o1, o2, 'cut')
    add(s, e, 'add')
  }
  let shown = out
  for (const joined of [...state.joinsBefore, ...state.joinsAfter]) {
    const from = Math.max(joined.start, s)
    const to = Math.min(joined.stop, e)
    shown = shown.flatMap((g) => {
      if (g.kind !== 'add' || g.to <= from || g.from >= to) return [g]
      const left: Segment[] = g.from < from ? [{ from: g.from, to: from, kind: 'add' }] : []
      const right: Segment[] = g.to > to ? [{ from: to, to: g.to, kind: 'add' }] : []
      return [...left, ...right]
    })
    if (to > from) shown.push({ from, to, kind: 'keep' })
    if (Math.min(from, joined.stop) > joined.start)
      shown.push({ from: joined.start, to: Math.min(from, joined.stop), kind: 'cut' })
    if (joined.stop > Math.max(to, joined.start))
      shown.push({ from: Math.max(to, joined.start), to: joined.stop, kind: 'cut' })
  }
  return shown
}

/**
 * Where a joined neighbour meets the entry, or the next joined one, with no gap between: the thin lines in the bar.
 * Used to draw them: 10:00–11:00 docked onto 11:00–12:00 gives [11:00].
 */
export function meetingPoints(state: LineState): number[] {
  const points: number[] = []
  state.joinsBefore.forEach((j, i) => {
    if (j.stop === (i > 0 ? state.joinsBefore[i - 1].start : state.originalStart)) points.push(j.stop)
  })
  state.joinsAfter.forEach((j, i) => {
    if (j.start === (i > 0 ? state.joinsAfter[i - 1].stop : state.originalEnd)) points.push(j.start)
  })
  return points
}

/**
 * The entries outside the edit that show on the line, as blocked time. Used to draw them: everything but the entry
 * and what it has taken in.
 */
export function walls(state: LineState): Span[] {
  return state.others.filter((o) => !isJoined(state, o))
}

/**
 * The break the result carries: the one set with the tag, or else the entry's own plus every neighbour's it takes in.
 * Used by the tag and the save: two joined entries with 20 and 15 min carry 35.
 */
export function breakTotal(state: LineState): number {
  if (state.breakSet !== null) return state.breakSet
  const docks = docked(state)
  const docked_ = [docks.before ? state.prev : null, docks.after ? state.next : null]
  return [state.entry, ...docked_, ...state.joinsBefore, ...state.joinsAfter].reduce(
    (sum, s) => sum + (s?.breakMinutes ?? 0),
    0,
  )
}

/**
 * The break shared over the result's parts: whole on the larger part if it fits there; if not, the larger part full and
 * the rest on the other. Used for each part's tag: 10:00–11:00 with 30 min and a gap at 10:20–10:40 gives 20 and 10.
 */
export function breakShares(state: LineState): number[] {
  const lengths = resultParts(state).map(minutesOf)
  const total = breakTotal(state)
  const shares = lengths.map(() => 0)
  if (lengths.length === 0) return shares
  const larger = lengths.indexOf(Math.max(...lengths))
  shares[larger] = Math.min(total, lengths[larger])
  if (total > lengths[larger] && lengths.length > 1) shares[1 - larger] = total - lengths[larger]
  return shares
}

/** The minutes the result keeps, every part together. Used for the break's limit */
export function keptMinutes(state: LineState): number {
  return resultParts(state).reduce((sum, part) => sum + minutesOf(part), 0)
}

/**
 * Whether the tag shows red: a switch refused, or a handle at the limit where the time kept just holds the break. Used
 * by the tag: 10:00–11:00 with 30 min, its start at 10:30, is red.
 */
export function atLimit(state: LineState): boolean {
  const total = breakTotal(state)
  return state.refused || (total > 0 && keptMinutes(state) === total)
}

/**
 * Whether anything that needs a reason has changed: a time, the profile, the break, a filled gap, or a neighbour of
 * its profile it touches, which the line shows as one with it. Used by the confirm, with the reason; a new entry counts
 * once placed.
 */
export function isChanged(state: LineState): boolean {
  if (state.isNew) return !state.placing
  const docks = docked(state)
  return (
    docks.before ||
    docks.after ||
    state.start !== state.originalStart ||
    state.end !== state.originalEnd ||
    state.profile !== state.entry.profile ||
    (state.breakSet !== null && state.breakSet !== state.entry.breakMinutes) ||
    state.fill !== null
  )
}

/** Whether both handles are inward of the entry as it was. Used by the line's middle and the words under the day */
export function isInward(state: LineState): boolean {
  return state.start > state.originalStart && state.end < state.originalEnd
}

/** Whether another profile fills a gap. Used by the colours and the words under the day */
export function isFilling(state: LineState): boolean {
  return state.fill !== null && state.mode === 'gap'
}

/** Whether the result is two parts with a gap or a filled gap between. Used by the result and the middle's pointer */
export function isDivided(state: LineState): boolean {
  return (isInward(state) && state.mode === 'gap') || isFilling(state)
}

/**
 * Which ends touch a neighbour of the entry's profile, so the two show as one. Used by the colours and the result;
 * never while placing or with a filled gap.
 */
export function docked(state: LineState): { before: boolean; after: boolean } {
  if (state.fill || state.placing) return { before: false, after: false }
  return {
    before: state.prev !== null && state.start === state.prev.stop && state.prev.profile === state.profile,
    after: state.next !== null && state.end === state.next.start && state.next.profile === state.profile,
  }
}

/**
 * The view that fits what is being edited, centred and filling 65% of the line: the entry as it was and as it is
 * becoming while the two overlap, the entry alone once it has left its original or never had one. Used after every
 * let go and step: a 2 h entry gets a view of about 3 h.
 */
export function fittedView(state: LineState): View {
  const overlaps = !state.isNew && state.start < state.originalEnd && state.end > state.originalStart
  const from = overlaps ? Math.min(state.start, state.originalStart) : state.start
  const to = overlaps ? Math.max(state.end, state.originalEnd) : state.end
  const width = (to - from) / VIEW_FILL
  const centre = (from + to) / 2
  return { from: centre - width / 2, to: centre + width / 2 }
}

/**
 * A time snapped to 5 minutes of this machine's clock, to the nearest mark or the next one up or down. Used by drags,
 * placing and the view's edges: 10:07:40 gives 10:10, or 10:05 down.
 */
export function snap(time: number, way: 'nearest' | 'up' | 'down' = 'nearest'): number {
  const step = SNAP_MINUTES * MINUTE
  const offset = new Date(time).getTimezoneOffset() * MINUTE
  const round = way === 'up' ? Math.ceil : way === 'down' ? Math.floor : Math.round
  return round((time - offset) / step) * step + offset
}

// ======================================
//               Helpers
// ======================================

// === API ===

/** The latest entry ending at or before a time. Used for the walls */
function nearestBefore(others: Span[], time: number): Span | null {
  return others.filter((o) => o.stop <= time).reduce<Span | null>((n, o) => (!n || o.stop > n.stop ? o : n), null)
}

/** The earliest entry starting at or after a time. Used for the walls */
function nearestAfter(others: Span[], time: number): Span | null {
  return others.filter((o) => o.start >= time).reduce<Span | null>((n, o) => (!n || o.start < n.start ? o : n), null)
}

/** How far the start handle may go back: the wall before. Used by drags and steps */
function wallBefore(state: LineState): number {
  return state.prev ? state.prev.stop : -Infinity
}

/** How far the end handle may go: the wall after, or now */
function wallAfter(state: LineState): number {
  return state.next ? state.next.start : state.now
}

/** Whether a neighbour has been taken in. Used for the walls and the save */
function isJoined(state: LineState, span: Span): boolean {
  return state.joinsBefore.includes(span) || state.joinsAfter.includes(span)
}

/** Whether the time kept still holds the break. Used as the break's wall */
function fits(state: LineState): boolean {
  return keptMinutes(state) >= breakTotal(state)
}

/** A stretch's whole minutes. Used for the break's sharing and its limit */
function minutesOf(part: View): number {
  return Math.round((part.to - part.from) / MINUTE)
}

/** A time with its seconds dropped. Used by the minute steps, so a stepped time is at :00 */
function minuteOf(time: number): number {
  return Math.floor(time / MINUTE) * MINUTE
}

/** One step from a time toward another, never past it. Used by the break's wall */
function towards(from: number, to: number, step: number): number {
  return from < to ? Math.min(step, to - from) : -Math.min(step, from - to)
}

/**
 * What every move ends with, as the prototype's drawing did: a new entry's own time is what lies between its joins;
 * an entry that runs, or has taken in one that does, ends at now; a filling profile goes once there is no gap to fill; a gap goes once both handles are no longer inward, so an old gap
 * never comes back unasked
 */
function normalised(state: LineState): LineState {
  const next = { ...state }
  if (next.isNew && !next.placing) {
    next.originalStart = next.joinsBefore.length > 0 ? next.joinsBefore[0].stop : next.start
    next.originalEnd = next.joinsAfter.length > 0 ? next.joinsAfter[0].start : next.end
  }
  next.running = next.entry.running === true || next.joinsAfter.some((j) => j.running === true)
  if (next.running) next.end = next.now
  if (next.fill && !isFilling(next)) next.fill = null
  if (!isInward(next) && !isFilling(next)) next.mode = 'shorten'
  return next
}

/**
 * Joined neighbours let go: a handle back at a joined neighbour's far end or past it lets it go whole, outermost first,
 * a wall again; the other handle passing over all of one lets it go too, nearest first, and the entry walks on past it
 */
function releaseJoins(state: LineState): LineState {
  const next = { ...state, joinsBefore: [...state.joinsBefore], joinsAfter: [...state.joinsAfter] }
  const before = next.joinsBefore
  const after = next.joinsAfter
  while (before.length > 0 && next.start >= before[before.length - 1].stop) {
    next.prev = before.pop() ?? null
    if (next.prev) next.start = Math.max(next.start, next.prev.stop)
  }
  while (after.length > 0 && next.end <= after[after.length - 1].start) {
    next.next = after.pop() ?? null
    if (next.next) next.end = Math.min(next.end, next.next.start)
  }
  while (after.length > 0 && next.start >= after[0].stop) next.prev = after.shift() ?? null
  while (before.length > 0 && next.end <= before[0].start) next.next = before.shift() ?? null
  return next
}

/**
 * Neighbours taken in: back on its original, the entry takes its original time back; on the edge of a neighbour of
 * its profile, it takes that neighbour in, its handle moving to the neighbour's far end
 */
function absorb(state: LineState): LineState {
  if (!state.isNew && state.start === state.originalEnd && !state.running)
    return { ...state, start: state.originalStart }
  if (!state.isNew && state.end === state.originalStart) return { ...state, end: state.originalEnd }
  const docks = docked(state)
  const next = { ...state, joinsBefore: [...state.joinsBefore], joinsAfter: [...state.joinsAfter] }
  if (docks.before && state.prev) {
    next.joinsBefore.push(state.prev)
    next.start = state.prev.start
    next.prev = nearestOutside(
      next,
      (o) => o.stop <= next.start,
      (a, b) => b.stop - a.stop,
    )
  }
  if (docks.after && state.next) {
    next.joinsAfter.push(state.next)
    next.end = state.next.stop
    next.next = nearestOutside(
      next,
      (o) => o.start >= next.end,
      (a, b) => a.start - b.start,
    )
  }
  return next
}

/** The nearest entry not taken in on one side, by a filter and an order. Used by `absorb` for the next wall */
function nearestOutside(
  state: LineState,
  side: (o: Span) => boolean,
  order: (a: Span, b: Span) => number,
): Span | null {
  return state.others.filter((o) => side(o) && !isJoined(state, o)).sort(order)[0] ?? null
}
