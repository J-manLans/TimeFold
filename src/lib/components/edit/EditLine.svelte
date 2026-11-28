<!--
  The entry line in the edit popup ("Editing an entry on its line"): the entry as a bar in its profile's colour, time
  added green and taken away red, other entries as blocked time, a handle at each end in the neon of the profile in
  colour, its time above it, and the scale under the line. A handle is dragged, snapped to 5 minutes, or clicked into a
  pill whose − and + step a minute ("A clicked handle steps by the minute"); only the handles move the entry, and
  with both handles inward its middle is clicked to switch shortening and a gap ("A gap divides an entry"); while a let go
  would leave the gap, the part not dragged is outlined in the entry's colour. The view holds still while a handle is
  dragged, the handle following the pointer past its ends too, out of sight past the popup's edges; the entries and the
  hairline run on past the view out to the popup's edges, which cut them, so the popup never scrolls sideways. Let go,
  the view eases to fit again.
  While a new entry waits for its place, a click on free time places it. The rules are the line's model; this draws
  it and turns the pointer into its moves: <EditLine bind:line profiles={record.profiles} />
-->
<script lang="ts" module>
  /** A held − or +: the wait before it repeats, the fastest it goes, and how much quicker each repeat comes */
  const STEP_DELAY = 400
  const STEP_FASTEST = 30
  const STEP_SPEEDUP = 0.85

  /** How far the pointer moves before a press on a handle is a drag, not a click */
  const DRAG_SLACK = 2
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { app } from '$lib/app.svelte'
  import {
    clickMiddle,
    docked,
    dragTo,
    grab,
    isInward,
    leaving,
    letGo,
    meetingPoints,
    originalDocked,
    place,
    segments,
    stepHandle,
    walls,
    type Drag,
    type Grip,
    type LineState,
    type View,
  } from '$lib/modules/edit/line'
  import { ticks } from '$lib/modules/edit/scale'
  import { inkOn, neonColour } from '$lib/modules/shared/colours'
  import { timeOfDay } from '$lib/modules/shared/counting'
  import { toTimestamp, type Profile } from '$lib/modules/shared/record'

  // === Props ===

  let {
    line = $bindable(),
    profiles,
  }: {
    /** The line's state, which every move replaces */
    line: LineState
    /** The record's profiles, for their colours */
    profiles: Profile[]
  } = $props()

  // === State ===

  let box: HTMLDivElement | undefined = $state()
  let boxWidth = $state(0)
  /** The view on screen, which eases to the line's own after a let go or a step */
  let shown = $state<View>(untrack(() => line.view))
  /** The handle grown into its pill, and whether it has just grown, which plays its breath */
  let pill = $state<'start' | 'end' | null>(null)
  let fresh = $state(false)
  let startLabelWidth = $state(0)
  let endLabelWidth = $state(0)
  /** A press on the line: what it holds, where it began, and whether it has moved enough to be a drag */
  let press: { drag: Drag | null; grip: Grip | null; x: number; at: number; moved: boolean } | null = null
  let holding: ReturnType<typeof setTimeout> | null = null
  /** The part outlined while a let go would leave the gap, or null */
  let closing = $state<View | null>(null)
  /** The original outlined while the entry, moved clear of it, is held on its edge, or null */
  let original = $state<View | null>(null)

  let profile = $derived(profiles.find((p) => p.id === line.profile))
  let filler = $derived(profiles.find((p) => p.id === line.fill))
  let neon = $derived(neonColour((filler ?? profile)?.hue ?? 0))
  let docks = $derived(docked(line))
  /** How far past the view's ends the line is drawn: a view's width each side, well beyond the popup's edges */
  let reach = $derived<View>({ from: 2 * shown.from - shown.to, to: 2 * shown.to - shown.from })
  let shownWalls = $derived(walls(line).filter((w) => w.stop >= reach.from && w.start <= reach.to))
  let pieces = $derived(line.placing ? [] : segments(line))
  let handles = $derived(line.placing ? [] : line.running ? (['start'] as const) : (['start', 'end'] as const))
  // Handles closer than their labels' width: the labels lean apart, the start's ending at its handle
  let lean = $derived(
    !line.running &&
      ((line.end - line.start) / (shown.to - shown.from)) * boxWidth < (startLabelWidth + endLabelWidth) / 2 + 4,
  )

  // === Logic ===

  // The view on screen eases to the line's whenever it refits, at the interface's speed, at once in Stilla
  $effect(() => {
    const to = line.view
    const from = untrack(() => ({ ...shown }))
    const ms = app.still ? 0 : speed()
    if (ms === 0 || (from.from === to.from && from.to === to.to)) {
      shown = to
      return
    }
    const begun = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - begun) / ms)
      const eased = 1 - Math.pow(1 - k, 3)
      shown = { from: from.from + (to.from - from.from) * eased, to: from.to + (to.to - from.to) * eased }
      if (k < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  })

  // === Helpers ===

  /** Where a moment stands on the line, as a share of its width. Used by everything drawn */
  function pct(time: number): string {
    return `${((time - shown.from) / (shown.to - shown.from)) * 100}%`
  }

  /** A stretch's width on the line, cut at its reach. Used by the bars */
  function span(from: number, to: number): string {
    return `calc(${pct(Math.min(to, reach.to))} - ${pct(Math.max(from, reach.from))})`
  }

  /** Whether a stretch shows anywhere the line is drawn. Used by the bars */
  function within(from: number, to: number): boolean {
    return Math.min(to, reach.to) > Math.max(from, reach.from)
  }

  /** The time under the pointer. Used by every press and drag */
  function timeAt(x: number): number {
    const rect = box?.getBoundingClientRect()
    if (!rect || rect.width === 0) return shown.from
    return shown.from + ((x - rect.left) / rect.width) * (shown.to - shown.from)
  }

  /** A moment as the labels show it: "07:58". Used by the handles' labels */
  function clock(time: number): string {
    return timeOfDay(toTimestamp(new Date(time)))
  }

  /** The interface's speed in milliseconds, from the tokens. Used by the view's easing */
  function speed(): number {
    return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--speed-ui')) || 0.2) * 1000
  }

  /** A press on the line: places a new entry, steps a pill's − or +, or begins a drag or a click */
  function down(event: PointerEvent): void {
    const target = event.target as HTMLElement
    if (line.placing) {
      line = place(line, timeAt(event.clientX))
      return
    }
    if (target.dataset.step) {
      event.preventDefault()
      hold(target.dataset.handle as 'start' | 'end', Number(target.dataset.step) as -1 | 1)
      return
    }
    const grip = (target.dataset.grip as Grip | undefined) ?? null
    const at = timeAt(event.clientX)
    const drag = grip ? grab(line, grip) : null
    press = { drag, grip, x: event.clientX, at, moved: false }
    if (drag) {
      box?.setPointerCapture(event.pointerId)
      event.preventDefault()
    }
  }

  /** The pointer moving while pressed: past a little slack it is a drag, and the pill shrinks back */
  function move(event: PointerEvent): void {
    if (!press?.drag) return
    if (Math.abs(event.clientX - press.x) > DRAG_SLACK) {
      press.moved = true
      pill = null
    }
    if (press.moved) {
      line = dragTo(line, press.drag, timeAt(event.clientX))
      closing = leaving(line, press.drag.grip)
      original = originalDocked(line)
    }
  }

  /** The press let go: a drag is let go, a click on a handle opens its pill, one on the middle switches it */
  function up(): void {
    if (!press) return
    const { moved, grip, at, drag } = press
    press = null
    closing = null
    original = null
    if (moved && drag) line = letGo(line)
    else if (!moved && grip) openPill(grip)
    else if (!moved && !line.fill && isInward(line) && at > line.start && at < line.end) line = clickMiddle(line)
  }

  /** A handle grown into its pill; the other's shrinks back. Clicking an open pill again changes nothing */
  function openPill(handle: 'start' | 'end'): void {
    if (pill === handle) return
    pill = handle
    fresh = true
  }

  /** A − or + held: one minute at once, then again after a wait, faster the longer it is held */
  function hold(handle: 'start' | 'end', by: -1 | 1): void {
    line = stepHandle(line, handle, by)
    let wait = STEP_DELAY
    const again = (): void => {
      line = stepHandle(line, handle, by)
      wait = Math.max(STEP_FASTEST, wait * STEP_SPEEDUP)
      holding = setTimeout(again, wait)
    }
    holding = setTimeout(() => {
      wait = STEP_DELAY * STEP_SPEEDUP
      again()
    }, STEP_DELAY)
  }

  /** A held − or + let go. Used on any pointer up or cancel */
  function release(): void {
    if (holding) clearTimeout(holding)
    holding = null
  }

  /** The arrow keys step the open pill; Esc shrinks it, and only it */
  function key(event: KeyboardEvent): void {
    if (!pill || (event.target as HTMLElement).tagName === 'INPUT') return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      line = stepHandle(line, pill, event.key === 'ArrowLeft' ? -1 : 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      pill = null
    }
  }

  /** A press anywhere but on a handle shrinks the pill */
  function elsewhere(event: PointerEvent): void {
    if (pill && !(event.target as HTMLElement).closest('[data-grip="start"], [data-grip="end"]')) pill = null
  }
</script>

<svelte:window
  onkeydowncapture={key}
  onpointerdowncapture={elsewhere}
  onpointerup={release}
  onpointercancel={release}
/>

<div class="lane">
  <div
    class="line"
    class:placing={line.placing}
    role="presentation"
    bind:this={box}
    bind:clientWidth={boxWidth}
    style:--own={profile?.base}
    style:--filler={filler?.base}
    onpointerdown={down}
    onpointermove={move}
    onpointerup={up}
  >
    {#each ticks(shown) as tick (tick.at)}
      <span class="tick" style:left={pct(tick.at)}>{tick.label}</span>
    {/each}

    {#each shownWalls as wall (wall.id)}
      <div
        class="wall"
        class:at-now={wall.stop >= line.now}
        class:same={wall.profile === line.profile}
        class:dock={(docks.before && wall.id === line.prev?.id) || (docks.after && wall.id === line.next?.id)}
        style:--wall={profiles.find((p) => p.id === wall.profile)?.base}
        style:left={pct(Math.max(wall.start, reach.from))}
        style:width={span(wall.start, wall.stop)}
      ></div>
    {/each}

    {#if line.now > reach.from && line.now < reach.to}
      <div class="now" style:left={pct(line.now)}></div>
    {/if}

    {#each pieces as piece (`${piece.kind}${piece.from}`)}
      {@const middle = isInward(line) && piece.from === line.start && piece.to === line.end}
      {#if within(piece.from, piece.to)}
        <div
          class="bar {piece.kind}"
          class:at-now={piece.to >= line.now}
          class:pick={middle && !line.fill && piece.kind === 'cut'}
          style:left={pct(Math.max(piece.from, reach.from))}
          style:width={span(piece.from, piece.to)}
        ></div>
      {/if}
    {/each}

    {#if original && within(original.from, original.to)}
      <div
        class="bar dock"
        style:left={pct(Math.max(original.from, reach.from))}
        style:width={span(original.from, original.to)}
      ></div>
    {/if}

    {#if closing && within(closing.from, closing.to)}
      <div
        class="bar closing"
        style:left={pct(Math.max(closing.from, reach.from))}
        style:width={span(closing.from, closing.to)}
      ></div>
    {/if}

    {#each meetingPoints(line).filter((p) => p > reach.from && p < reach.to) as point (point)}
      <div class="meet" style:left={pct(point)}></div>
    {/each}

    {#each handles as handle (handle)}
      {@const time = handle === 'start' ? line.start : line.end}
      <div
        class="handle"
        class:pill={pill === handle}
        class:fresh={pill === handle && fresh}
        data-grip={handle}
        style:left={pct(time)}
        style:background={neon}
        style:--ink={inkOn(neon)}
        onanimationend={() => (fresh = false)}
      >
        {#if pill === handle}
          <span class="sign" data-step="-1" data-handle={handle}>−</span>
          <span class="sign" data-step="1" data-handle={handle}>+</span>
        {/if}
      </div>
      {#if handle === 'start'}
        <span class="label" class:lean-start={lean} style:left={pct(time)} bind:offsetWidth={startLabelWidth}
          >{clock(time)}</span
        >
      {:else}
        <span class="label" class:lean-end={lean} style:left={pct(time)} bind:offsetWidth={endLabelWidth}
          >{clock(time)}</span
        >
      {/if}
    {/each}
  </div>
</div>

<style>
  /* === Layout === */

  /* The line's lane, out to the popup's edges through its side padding: it cuts what runs on sideways only, so the
     popup never scrolls sideways and may still grow in height */
  .lane {
    margin-inline: calc(-1 * var(--spacing-4));
    padding-inline: var(--spacing-4);
    overflow-x: clip;
  }

  .line {
    position: relative;
    height: var(--edit-line-height);
    margin: var(--edit-line-margin);
    touch-action: none;
    user-select: none;
  }

  /* The hairline, run on past the view's ends as the entries are, the lane cutting it */
  .line::before {
    content: '';
    position: absolute;
    left: -100vw;
    right: -100vw;
    top: 50%;
    height: 1px;
    background: var(--dashboard-line);
  }

  .placing {
    cursor: crosshair;
  }

  .tick {
    position: absolute;
    bottom: var(--edit-tick-below);
    transform: translateX(-50%);
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-label);
    white-space: nowrap;
    pointer-events: none;
  }

  .tick::before {
    content: '';
    position: absolute;
    left: 50%;
    top: calc(-1px - var(--edit-tick-mark));
    width: 1px;
    height: var(--edit-tick-mark);
    background: var(--dashboard-line);
  }

  .wall,
  .bar {
    position: absolute;
    top: 50%;
    height: var(--edit-bar);
    border-radius: var(--radius-sm);
    transform: translateY(-50%);
  }

  /* A bar that ends at now is cut straight by the now line */
  .at-now {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  /* Other entries: blocked time, hatched; one of the entry's profile in its colour, faintly */
  .wall {
    background: repeating-linear-gradient(
      45deg,
      var(--dashboard-line) 0 var(--edit-stripe),
      transparent var(--edit-stripe) calc(var(--edit-stripe) * 2)
    );
    pointer-events: none;
  }

  .wall.same {
    background: color-mix(in srgb, var(--wall) var(--edit-same), transparent);
  }

  /* A docked neighbour or the original docked onto, and the part left when a gap is about to be left, outlined in the
     colour of the stretch reaching it: green when docking adds time, the entry's own here */
  .wall.dock,
  .bar.dock,
  .closing {
    outline: 1px solid var(--edit-add);
    outline-offset: 1px;
  }

  .closing {
    outline-color: var(--own);
  }

  .now {
    position: absolute;
    top: var(--edit-now-inset);
    bottom: var(--edit-now-inset);
    width: 1px;
    background: var(--dashboard-text-muted);
    pointer-events: none;
  }

  /* The entry: kept in its colour, added green, taken away in red stripes, a filled gap in the new profile's colour
     and the parts around it grey */
  .bar {
    pointer-events: none;
  }

  .keep {
    background: var(--own);
  }

  .add {
    background: var(--edit-add);
  }

  .cut {
    background: repeating-linear-gradient(
      45deg,
      var(--edit-remove) 0 var(--edit-stripe),
      color-mix(in srgb, var(--edit-remove) 30%, transparent) var(--edit-stripe) calc(var(--edit-stripe) * 2)
    );
  }

  .grey {
    background: repeating-linear-gradient(
      45deg,
      var(--dashboard-line) 0 var(--edit-stripe),
      transparent var(--edit-stripe) calc(var(--edit-stripe) * 2)
    );
  }

  .fill {
    background: var(--filler);
  }

  /* A thin line where a joined neighbour meets the entry, the point past which a drag back lets it go */
  .meet {
    position: absolute;
    top: 50%;
    width: 1px;
    height: var(--edit-bar);
    transform: translate(-50%, -50%);
    background: var(--dashboard-background);
    pointer-events: none;
    z-index: 1;
  }

  /* A handle: the app's round knob in the neon of the profile in colour, its grip a little wider than its circle */
  .handle {
    position: absolute;
    top: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: var(--knob);
    height: var(--knob);
    border-radius: var(--radius-full);
    box-shadow: var(--knob-shadow);
    transform: translate(-50%, -50%);
    cursor: ew-resize;
    touch-action: none;
    transition: width var(--edit-pill-time) var(--edit-pill-ease);
  }

  .handle::after {
    content: '';
    position: absolute;
    inset: var(--knob-reach);
  }

  .sign {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: calc(var(--knob) * var(--edit-sign-share));
    height: 100%;
    color: var(--ink);
    font-size: var(--text-size-body);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    cursor: pointer;
  }

  .label {
    position: absolute;
    top: var(--edit-label-above);
    transform: translateX(-50%);
    color: var(--dashboard-text);
    font-size: var(--text-size-label);
    white-space: nowrap;
    pointer-events: none;
  }

  /* === States === */

  .pick {
    cursor: pointer;
    pointer-events: auto;
  }

  /* A clicked handle grows into its pill with a soft bounce, taking a breath as it does, its signs fading in once it
     has mostly grown; dragging it, a click elsewhere or Esc shrinks it back */
  .pill {
    z-index: 2;
    width: var(--edit-pill);
    cursor: grab;
  }

  .fresh {
    animation: breath var(--edit-pill-time) ease-out;
  }

  .fresh .sign {
    animation: signs var(--edit-pill-time) ease both;
  }

  /* Handles closer than their labels: the labels lean apart, so they never overlap */
  .lean-start {
    transform: translateX(calc(-100% + var(--edit-lean-overlap)));
  }

  .lean-end {
    transform: translateX(calc(-1 * var(--edit-lean-overlap)));
  }

  @keyframes breath {
    0%,
    100% {
      height: var(--knob);
    }

    40% {
      height: calc(var(--knob) * var(--edit-pill-breath));
    }
  }

  @keyframes signs {
    0%,
    40% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
</style>
