/**
 * The entry line's rules: an entry edited on its line, as plain state and moves ("Editing an entry on its line", "The
 * line's view holds still while a handle is dragged", "A clicked handle steps by the minute", "Two entries join by
 * docking", "A running entry is edited at its start", "A forgotten entry is written in the gap where it belongs", "A gap
 * divides an entry", "An edited entry's break").
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
  /** A divided entry's break per side, or null while the entry is whole */
  breakSplit: BreakSplit | null
  /** A switch refused since the break could not fit, shown in red until the next change */
  refused: boolean
  view: View
}

/**
 * A divided entry's break, one length per side of the gap (0 before it, 1 after), split when the gap is made. Until a
 * tag is set it is the app's, and a drag spills only what no longer fits; set, each side keeps its own.
 */
export interface BreakSplit {
  minutes: [number, number]
  set: boolean
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

/** A forgotten entry is placed this many minutes long, or shorter to fill less free time */
export const NEW_MINUTES = 30

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
    breakSplit: null,
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
    breakSplit: null,
    refused: false,
    view: { from: centre - width / 2, to: centre + width / 2 },
  }
}

/**
 * The first click on a new entry's line: a 30-minute entry centred on it, snapped to 5 minutes, sliding away from a
 * wall it meets so it keeps its length, and filling the free time exactly when that is shorter; the view then fits it
 * alone. Touching a neighbour of its profile, it is docked but not taken in, its handles on its own edges. Used by the
 * line while placing: a click at 12:30 gives 12:15–12:45, at 11:42 next to an entry ending 11:40 gives 11:40–12:10. A
 * click inside an entry, or where less than 5 minutes are free, places nothing.
 */
export function place(state: LineState, at: number): LineState {
  if (!state.placing || at > state.now) return state
  if (state.others.some((o) => o.start < at && o.stop > at)) return state
  const before = nearestBefore(state.others, at)
  const after = nearestAfter(state.others, at)
  const low = before ? before.stop : -Infinity
  const high = after ? after.start : state.now
  const length = NEW_MINUTES * MINUTE
  let start = snap(at - length / 2)
  let end = start + length
  if (start < low) {
    start = low
    end = low + length
  }
  if (end > high) {
    end = high
    start = Math.max(low, high - length)
  }
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
 * no longer hold the break; dragged back to a joined neighbour's far end, it lets the neighbour go whole. A gap's edges
 * stay inside the entry and keep no distance: the dragged one snaps onto the other, even off the 5-minute marks. Used
 * on every pointer move of a drag: 08:00–12:00, its start dragged to 08:20, gives 08:20–12:00.
 */
export function dragTo(state: LineState, drag: Drag, at: number): LineState {
  const step = SNAP_MINUTES * MINUTE
  // The view's edges stop a handle on the 5-minute mark just inside them, as a drag always lands on one, but never
  // push one that is already further out; and a handle always reaches the next mark past it, even just outside the
  // view, so a short entry with no mark between its handle and the edge can still grow, the view refitting on let go
  let low = Math.max(wallBefore(state), Math.min(snap(state.view.from, 'up'), markPast(state.start, -1)))
  let high = Math.min(wallAfter(state), Math.max(snap(state.view.to, 'down'), markPast(state.end, 1)))
  // An entry moved clear of where it started meets its original as a neighbour of its own profile
  if (!state.isNew && drag.grip === 'start' && drag.startWas >= state.originalEnd)
    low = Math.max(low, state.originalEnd)
  if (!state.isNew && drag.grip === 'end' && drag.endWas <= state.originalStart)
    high = Math.min(high, state.originalStart)
  // An open gap's edges stay inside the entry; one reaches the entry's end only while the other part keeps a minute,
  // so what a let go there leaves is an entry
  const open = isGapOpen(state)
  if (open) {
    const afterShort = state.originalEnd - state.end < MINUTE
    const beforeShort = state.start - state.originalStart < MINUTE
    low = Math.max(low, afterShort && drag.grip === 'start' ? state.originalStart + step : state.originalStart)
    high = Math.min(high, beforeShort && drag.grip === 'end' ? state.originalEnd - step : state.originalEnd)
  }
  const apart = open ? 0 : step
  let start = state.start
  let end = state.end
  // While shortening, a handle keeps 5 minutes from the other, unless a wall is nearer, as after minute steps; it never
  // passes a wall. A gap's edge snaps onto the other where that is nearer than a 5-minute mark, or the mark is past it
  if (drag.grip === 'start') {
    const target =
      open && (snap(at) > state.end || Math.abs(at - state.end) < Math.abs(at - snap(at))) ? state.end : snap(at)
    start = Math.max(Math.min(target, state.end - apart), Math.min(low, state.start))
  } else if (drag.grip === 'end') {
    const target =
      open && (snap(at) < state.start || Math.abs(at - state.start) < Math.abs(at - snap(at))) ? state.start : snap(at)
    end = Math.min(Math.max(target, state.start + apart), Math.max(high, state.end))
  } else {
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
 * A drag let go: a gap whose edges meet, or with an edge at the entry's end, is left ("A gap divides an entry"); a
 * handle on the edge of a neighbour of the entry's profile takes it in, whichever way it moved; and the view refits to
 * what is being edited. Used by the line's pointer up after a drag: 08:00–10:00 let go at 10:25 on 10:25–12:00 gives
 * one entry to 12:00, its handle at 12:00.
 */
export function letGo(state: LineState): LineState {
  const joined = normalised(absorb(leaveGap(state)))
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
  // An open gap's edges stay inside the entry and may meet, as in a drag
  const open = isGapOpen(state)
  const apart = open ? 0 : MINUTE
  if (handle === 'start') {
    const moved = minuteOf(state.start) + by * MINUTE
    // An open gap's edge reaches the entry's start only while the other part keeps a minute, and is never pushed by it
    const inside = !open
      ? -Infinity
      : state.originalEnd - state.end < MINUTE
        ? Math.min(state.originalStart + MINUTE, state.start)
        : state.originalStart
    next.start = Math.min(Math.max(moved, wallBefore(state), inside), state.end - apart)
  } else {
    const moved = minuteOf(state.end) + by * MINUTE
    const inside = !open
      ? Infinity
      : state.start - state.originalStart < MINUTE
        ? Math.max(state.originalEnd - MINUTE, state.end)
        : state.originalEnd
    next.end = Math.max(Math.min(moved, wallAfter(state), inside), state.start + apart)
  }
  next = normalised(next)
  if (!fits(next)) return { ...state, refused: true }
  return letGo(normalised(releaseJoins(next)))
}

/**
 * A click on the middle with both handles inward: a shortening becomes a gap, its break split whole on the larger
 * part if it fits there, the rest on the other; a gap becomes a shortening, its parts' breaks one again. Refused, with
 * the tag red, when the break would not fit what is left; a filled gap does nothing. Used by the line's pointer up on
 * the red middle: 08:00–12:00 shortened to 10:00–10:40, clicked, keeps 08:00–10:00 and 10:40–12:00.
 */
export function clickMiddle(state: LineState): LineState {
  if (state.fill || !isInward(state)) return state
  const switched =
    state.mode === 'gap'
      ? normalised(foldSplit({ ...state, mode: 'shorten', refused: false }))
      : normalised(withNewSplit({ ...state, mode: 'gap', refused: false }))
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
 * A part's break set with its tag's field; whole, the entry's one break. Divided, a length kept sets both parts'
 * breaks where they stand, so neither spills from then on. Used when the field is kept: 0 takes it away.
 * @param part - which of the result's parts, in order
 * @returns the next state, or null when it is longer than the time that part keeps, which leaves the field open in red
 */
export function setBreak(state: LineState, minutes: number, part = 0): LineState | null {
  const parts = sidedParts(state)
  const chosen = parts[part] ?? parts[0]
  if (state.breakSplit && chosen && chosen.side !== null) {
    if (minutes > minutesOf(chosen)) return null
    const split: [number, number] = [...splitShares(state)]
    split[chosen.side] = minutes
    return { ...state, breakSplit: { minutes: split, set: true }, refused: false }
  }
  if (minutes > keptMinutes(state)) return null
  return { ...foldSplit(state), breakSet: minutes, refused: false }
}

/**
 * What the entry becomes: one stretch, or two when divided, each taking in the neighbours docked to it. Used for the
 * words under the day and for the save: 08:00–12:00 with a gap at 10:00–10:40 gives 08:00–10:00 and 10:40–12:00.
 */
export function resultParts(state: LineState): View[] {
  return sidedParts(state).map(({ from, to }) => ({ from, to }))
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
  if (isInward(state) || isGap(state)) {
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
  // A new entry docked to or joined with a neighbour of its profile is time added to it: its own stretch is green. Alone
  // it has no original, so nothing of it shows as added
  const docks = docked(state)
  const addsToNeighbour =
    state.isNew && (docks.before || docks.after || state.joinsBefore.length > 0 || state.joinsAfter.length > 0)
  let shown = addsToNeighbour
    ? out.map((g): Segment => (g.kind === 'keep' && g.from >= o1 && g.to <= o2 ? { ...g, kind: 'add' } : g))
    : out
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
 * The break the result carries: divided, both parts' together; else the one set with the tag, or the entry's own plus
 * every neighbour's it takes in. Used by the tag and the save: two joined entries with 20 and 15 min carry 35.
 */
export function breakTotal(state: LineState): number {
  if (state.breakSplit) return state.breakSplit.minutes[0] + state.breakSplit.minutes[1]
  if (state.breakSet !== null) return state.breakSet
  const docks = docked(state)
  const docked_ = [docks.before ? state.prev : null, docks.after ? state.next : null]
  return [state.entry, ...docked_, ...state.joinsBefore, ...state.joinsAfter].reduce(
    (sum, s) => sum + (s?.breakMinutes ?? 0),
    0,
  )
}

/**
 * The break each of the result's parts carries: whole, the entry's one break; divided, each part its own side of the
 * split, which while no tag is set has spilled what no longer fits to the other side. Used for each part's tag and the
 * save: 10:00–11:00 with 30 min and a gap made at 10:20–10:50 gives 20 and 10.
 */
export function breakShares(state: LineState): number[] {
  const parts = sidedParts(state)
  if (!state.breakSplit || parts.every((p) => p.side === null))
    return parts.map((_, i) => (i === 0 ? breakTotal(state) : 0))
  const shares = splitShares(state)
  return parts.map((p) => (p.side === null ? 0 : shares[p.side]))
}

/** The minutes the result keeps, every part together. Used for the break's limit */
export function keptMinutes(state: LineState): number {
  return resultParts(state).reduce((sum, part) => sum + minutesOf(part), 0)
}

/**
 * Whether a part's tag shows red: a switch refused, or a handle at the limit, on the part full of break that holds it
 * there; while a divided entry's split is the app's, only once both parts together are full. Used by the tags:
 * 10:00–11:00 with 30 min, its start at 10:30, is red.
 * @param part - which of the result's parts, in order
 */
export function atLimit(state: LineState, part = 0): boolean {
  if (state.refused) return true
  const parts = resultParts(state)
  const share = breakShares(state)[part] ?? 0
  const divided = state.breakSplit !== null && parts.length > 1
  const full = divided && !state.breakSplit?.set ? keptMinutes(state) === breakTotal(state) : true
  return share > 0 && full && share === minutesOf(parts[part])
}

/**
 * The stretch to outline while a let go would leave the gap: its edges meeting, or an edge at the entry's end. It is
 * the part not dragged, outlined in the entry's base colour as a docked neighbour is in the colour of the stretch
 * reaching it ("A gap divides an entry"). Used by the line while a drag is held.
 * @returns the stretch, or null when a let go leaves the gap as it is
 */
export function leaving(state: LineState, grip: Grip): View | null {
  if (!isGapOpen(state)) return null
  const before = { from: state.originalStart, to: state.start }
  const after = { from: state.end, to: state.originalEnd }
  if (state.start === state.originalStart) return after
  if (state.end === state.originalEnd) return before
  if (state.start === state.end) return grip === 'start' ? after : before
  return null
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
    state.breakSplit !== null ||
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

/**
 * Whether a gap holds: made, and its edges inside the entry with at least one part left. Once made it holds until it
 * is left on purpose (a click on it, its edges let go together, or an edge let go at the entry's end), so a drag alone
 * never turns it into a shortening. Used by the result, the colours and the drags
 */
export function isGap(state: LineState): boolean {
  return (
    state.mode === 'gap' &&
    state.start >= state.originalStart &&
    state.end <= state.originalEnd &&
    !(state.start === state.originalStart && state.end === state.originalEnd)
  )
}

/** Whether the result is two parts with a gap or a filled gap between. Used by the result and the middle's pointer */
export function isDivided(state: LineState): boolean {
  return isGap(state) || isFilling(state)
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

/** Whether a neighbour has been taken in, by its id. Used for the walls and the save */
function isJoined(state: LineState, span: Span): boolean {
  return state.joinsBefore.some((j) => j.id === span.id) || state.joinsAfter.some((j) => j.id === span.id)
}

/**
 * Whether the time kept still holds the break. Used as the break's wall: divided, each part its own once a tag is set,
 * else both parts together
 */
function fits(state: LineState): boolean {
  const split = state.breakSplit
  if (!split || !isDivided(state)) return keptMinutes(state) >= breakTotal(state)
  const lengths = sideMinutes(state)
  return split.set
    ? split.minutes[0] <= lengths[0] && split.minutes[1] <= lengths[1]
    : split.minutes[0] + split.minutes[1] <= lengths[0] + lengths[1]
}

/** Whether a gap holds with edges of its own to drag, not filled by another profile. Used by drags, steps and let go */
function isGapOpen(state: LineState): boolean {
  return isGap(state) && !state.fill
}

/**
 * The result's parts, each with the side of the gap it lies on (0 before, 1 after), or null while the entry is whole;
 * a gap whose edges meet shows as the whole entry. Used by the result, the break's shares and its field
 */
function sidedParts(state: LineState): (View & { side: 0 | 1 | null })[] {
  if (isGapOpen(state) && state.start === state.end)
    return [{ from: state.originalStart, to: state.originalEnd, side: null }]
  const parts: (View & { side: 0 | 1 | null })[] = isDivided(state)
    ? [
        { from: state.originalStart, to: state.start, side: 0 as const },
        { from: state.end, to: state.originalEnd, side: 1 as const },
      ].filter((p) => p.to > p.from)
    : [{ from: state.start, to: state.end, side: null }]
  const docks = docked(state)
  if (docks.before && state.prev && parts.length > 0) parts[0].from = state.prev.start
  if (docks.after && state.next && parts.length > 0) parts[parts.length - 1].to = state.next.stop
  return parts
}

/** The minutes each side of the gap keeps, 0 for a side gone. Used by the split */
function sideMinutes(state: LineState): [number, number] {
  return [
    Math.max(0, minutesOf({ from: state.originalStart, to: state.start })),
    Math.max(0, minutesOf({ from: state.end, to: state.originalEnd })),
  ]
}

/** Each side's break: set, as set; the app's, left where it fits and only the overflow spilled. Used by the shares */
function splitShares(state: LineState): [number, number] {
  const split = state.breakSplit
  if (!split) return [breakTotal(state), 0]
  if (split.set) return [...split.minutes]
  const lengths = sideMinutes(state)
  const shares: [number, number] = [...split.minutes]
  if (shares[0] > lengths[0]) {
    shares[1] += shares[0] - lengths[0]
    shares[0] = lengths[0]
  }
  if (shares[1] > lengths[1]) {
    shares[0] += shares[1] - lengths[1]
    shares[1] = lengths[1]
  }
  return shares
}

/** The break split as the gap is made: whole on the larger side if it fits there, the rest on the other */
function withNewSplit(state: LineState): LineState {
  const total = breakTotal({ ...state, breakSplit: null })
  const lengths = sideMinutes(state)
  const larger = lengths[0] >= lengths[1] ? 0 : 1
  const minutes: [number, number] = [0, 0]
  minutes[larger] = Math.min(total, lengths[larger])
  minutes[1 - larger] = total - minutes[larger]
  return { ...state, breakSplit: { minutes, set: false } }
}

/** The split folded back into one break, the parts' sum, as the gap goes; set with the tag only where that differs */
function foldSplit(state: LineState): LineState {
  if (!state.breakSplit) return state
  const sum = state.breakSplit.minutes[0] + state.breakSplit.minutes[1]
  const whole = { ...state, breakSplit: null, breakSet: null }
  return { ...whole, breakSet: breakTotal(whole) === sum ? null : sum }
}

/**
 * A gap let go on purpose: its edges meeting make the entry whole; an edge at the entry's end drops that part and
 * leaves a shortening of the other, its handles at its ends. Either way the break folds into one. Used by let go
 */
function leaveGap(state: LineState): LineState {
  if (!isGapOpen(state)) return state
  const { originalStart: o1, originalEnd: o2, start, end } = state
  let kept: View
  if (start === end) kept = { from: o1, to: o2 }
  else if (start === o1) kept = { from: end, to: o2 }
  else if (end === o2) kept = { from: o1, to: start }
  else return state
  return foldSplit({ ...state, mode: 'shorten', start: kept.from, end: kept.to })
}

/** A stretch's whole minutes. Used for the break's sharing and its limit */
function minutesOf(part: View): number {
  return Math.round((part.to - part.from) / MINUTE)
}

/**
 * The first 5-minute mark of the clock past a time, one way: 10:02 gives 10:00 back and 10:05 on; a time on a mark gives
 * the one before or after it. Used by drags, so a handle always has a mark to reach
 */
function markPast(time: number, way: -1 | 1): number {
  const step = SNAP_MINUTES * MINUTE
  const mark = snap(time, way < 0 ? 'down' : 'up')
  return mark === time ? time + way * step : mark
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
 * an entry that runs, or has taken in one that does, ends at now; a filling profile goes once there is no gap to fill;
 * a gap no longer holding goes, its break folded into one, so an old gap never comes back unasked
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
  if (!isInward(next) && !isFilling(next) && !isGap(next)) {
    next.mode = 'shorten'
    return foldSplit(next)
  }
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
