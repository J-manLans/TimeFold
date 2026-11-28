<!--
  The ceiling wheel ("The ceiling wheel"), with the pay estimate under it ("A pay estimate per profile") and the
  ceiling's trend beside that ("The ceiling's trend"), both quiet, with no labels. A ring whose
  full lap is the month's ceiling: used hours fill it clockwise from 12 o'clock in the order they were worked, the
  profile on screen's pieces lit and the others' faded, the rest dimmed; hours over the ceiling lie on a second lap in
  the neon. Grey, one piece, while the balance profile is on screen. The used hours sit in the middle, "AV 42:00
  H" under them. With the pointer on the band, the over lap winds back so the first lap shows whole. The figures count
  to a new value as the balance does; on opening they show at once. Drawn as the prototype draws it, on a 200 board.
-->
<script lang="ts" module>
  /**
   * The board the wheel is drawn on, in its own units, as the prototype has it: the ring's middle 75 from the centre,
   * the ticks inside it, the number and its label under the centre
   */
  const BOARD = {
    size: 200,
    centre: 100,
    radius: 75,
    tickOuter: 52,
    tickInner: 49,
    tickInnerLong: 46,
    numberBaseline: 106,
    labelBaseline: 126,
  }

  /** The wheel's 40 ticks, a long one every ten, as angles from 12 o'clock */
  const TICKS = Array.from({ length: 40 }, (_, i) => ({ angle: (i / 40) * 2 * Math.PI, long: i % 10 === 0 }))

  /** How far each piece of the ring starts early, tucked under the one before, so no gap shows where two meet */
  const TUCK = 3 * 60
</script>

<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { app } from '$lib/app.svelte'
  import { colourRoles, dimmed, faded } from '$lib/modules/shared/colours'
  import { balanceText } from '$lib/modules/dashboard/figures'
  import { ceilingMonth, ceilingTrend, localDay, payShown, shownMinutes } from '$lib/modules/shared/counting'

  // === Props ===

  let {
    panel,
  }: {
    /** The dashboard's background as #rrggbb, which the dimmed and faded colours are worked out against */
    panel: string
  } = $props()

  // === State ===

  let today = $derived(localDay(Date.now()))
  let month = $derived(app.record ? ceilingMonth(app.record, today) : { ceiling: 0, pieces: [], used: 0 })
  let pay = $derived(app.record ? payShown(app.record, today) : 0)
  let trend = $derived(app.record ? ceilingTrend(app.record, today) : 0)

  // The wheel wears the profile on screen's colours, or the greys while that is the balance profile
  // While a profile's colour picker is open, the wheel is that profile's ("Each profile carries its colours")
  let wheelProfile = $derived(app.picking ?? app.onScreen)
  let onScreen = $derived(app.record?.profiles.find((p) => p.id === wheelProfile))
  let grey = $derived(onScreen === undefined || onScreen.expectedMinutes !== undefined)
  let greys = $state<{ base: string; neon: string } | null>(null)
  let colours = $derived.by(() => {
    if (grey) return greys ? { ...greys, dimmed: dimmed(greys.base, panel) } : null
    return onScreen ? colourRoles(onScreen, panel) : null
  })

  // What is drawn: the used hours and the pay on their way to their new values, and the peek, 0 to 1
  const shownUsed = new Tween(0, { easing: cubicOut })
  const shownPay = new Tween(0, { easing: cubicOut })
  const peek = new Tween(0, { easing: cubicOut })
  let peeking = $state(false)
  let motion = { count: 0, peek: 0 }
  let band = $state(0)

  let circumference = $derived(2 * Math.PI * BOARD.radius)
  let pieces = $derived(colours ? ring(colours) : [])
  let past = $derived(month.ceiling > 0 && shownUsed.current > month.ceiling && !peeking)

  // === Logic ===

  onMount(() => {
    const tokens = getComputedStyle(document.documentElement)
    const time = (name: string): number => parseFloat(tokens.getPropertyValue(name)) * 1000 || 0
    motion = { count: time('--balance-count'), peek: time('--wheel-peek') }
    band = parseFloat(tokens.getPropertyValue('--wheel-band'))
    greys = {
      base: tokens.getPropertyValue('--wheel-balance').trim(),
      neon: tokens.getPropertyValue('--wheel-balance-over').trim(),
    }
  })

  // New figures: the used hours and the pay count to them; the first show at once
  let first = true
  $effect(() => {
    const used = month.used
    const estimate = pay
    const duration = first ? 0 : untrack(() => moving(motion.count))
    first = false
    void shownUsed.set(used, { duration })
    void shownPay.set(estimate, { duration })
  })

  // === Helpers ===

  /**
   * What shows round the ring, as pieces that do not overlap, in the order drawn: the over lap, what is left of the
   * first lap, then the unused part. Used to draw the ring
   */
  function ring(c: { base: string; dimmed: string; neon: string }): { from: number; to: number; colour: string }[] {
    const ceiling = month.ceiling
    if (ceiling <= 0) return [{ from: 0, to: 1, colour: c.dimmed }]
    const top = Math.min(shownUsed.current, 2 * ceiling)
    const overEnd = Math.max(top - ceiling, 0) * (1 - peek.current)
    const runs = grey ? [{ from: 0, to: top, lit: true }] : litRuns(top)
    const fadedBase = faded(c.base, panel)
    const fadedNeon = faded(c.neon, panel)
    const drawn: { from: number; to: number; colour: string }[] = []
    const add = (from: number, to: number, colour: string): void => {
      if (to <= from) return
      const last = drawn[drawn.length - 1]
      if (last?.colour === colour && last.to === from) last.to = to
      else drawn.push({ from, to, colour })
    }
    for (const run of runs)
      add(Math.max(run.from, ceiling) - ceiling, Math.min(run.to - ceiling, overEnd), run.lit ? c.neon : fadedNeon)
    for (const run of runs) add(Math.max(run.from, overEnd), Math.min(run.to, ceiling), run.lit ? c.base : fadedBase)
    add(Math.min(top, ceiling), ceiling, c.dimmed)
    return drawn.map((piece) => ({ from: piece.from / ceiling, to: piece.to / ceiling, colour: piece.colour }))
  }

  /** The month's pieces up to `top`, lit where the profile on screen worked them. Used by `ring` */
  function litRuns(top: number): { from: number; to: number; lit: boolean }[] {
    const runs: { from: number; to: number; lit: boolean }[] = []
    let at = 0
    for (const piece of month.pieces) {
      const from = at
      const to = Math.min(at + piece.seconds, top)
      const lit = piece.profile === wheelProfile
      at += piece.seconds
      if (to <= from) continue
      const last = runs[runs.length - 1]
      if (last?.lit === lit) last.to = to
      else runs.push({ from, to, lit })
    }
    return runs
  }

  /** The pointer on the ring's band, not its corners or its middle, winds the over lap back. Used on pointer moves */
  function follow(event: PointerEvent): void {
    const box = (event.currentTarget as SVGElement).getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width) * BOARD.size - BOARD.centre
    const y = ((event.clientY - box.top) / box.height) * BOARD.size - BOARD.centre
    setPeek(Math.abs(Math.hypot(x, y) - BOARD.radius) <= band / 2)
  }

  /** Winds the over lap back or forward over --wheel-peek. Used by `follow` and when the pointer leaves */
  function setPeek(on: boolean): void {
    if (on === peeking) return
    peeking = on
    void peek.set(on ? 1 : 0, { duration: moving(motion.peek) })
  }

  /**
   * A motion time in milliseconds, or 0 in Stilla, read at each use so a change made with the app open counts at once.
   * Used for every Tween here
   */
  function moving(ms: number): number {
    return app.still ? 0 : ms
  }

  /** Seconds as hours and minutes with no sign. Used for the used hours and the ceiling: 42:00 */
  function hours(seconds: number): string {
    const minutes = Math.max(0, shownMinutes(seconds))
    return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`
  }
</script>

{#if colours && band > 0}
  <div class="wheel">
    <svg
      viewBox="0 0 {BOARD.size} {BOARD.size}"
      role="img"
      aria-label="Takhjul"
      onpointermove={follow}
      onpointerleave={() => setPeek(false)}
    >
      <g transform="rotate(-90 {BOARD.centre} {BOARD.centre})">
        {#if pieces.length === 1}
          <circle cx={BOARD.centre} cy={BOARD.centre} r={BOARD.radius} stroke={pieces[0].colour} stroke-width={band} />
        {:else}
          {#each pieces as piece, i (i)}
            {@const from = piece.from - TUCK / Math.max(month.ceiling, 1)}
            <circle
              cx={BOARD.centre}
              cy={BOARD.centre}
              r={BOARD.radius}
              stroke={piece.colour}
              stroke-width={band}
              stroke-dasharray="{(piece.to - from) * circumference} {circumference}"
              stroke-dashoffset={-from * circumference}
            />
          {/each}
        {/if}
      </g>
      {#each TICKS as tick (tick.angle)}
        <line
          class="tick"
          x1={BOARD.centre + BOARD.tickOuter * Math.sin(tick.angle)}
          y1={BOARD.centre - BOARD.tickOuter * Math.cos(tick.angle)}
          x2={BOARD.centre + (tick.long ? BOARD.tickInnerLong : BOARD.tickInner) * Math.sin(tick.angle)}
          y2={BOARD.centre - (tick.long ? BOARD.tickInnerLong : BOARD.tickInner) * Math.cos(tick.angle)}
        />
      {/each}
      <text class="number" x={BOARD.centre} y={BOARD.numberBaseline} fill={past ? colours.neon : colours.base}>
        {hours(shownUsed.current)}
      </text>
      <text class="label" x={BOARD.centre} y={BOARD.labelBaseline}>AV {hours(month.ceiling)} H</text>
    </svg>
    <div class="pay">
      <span>≈ {Math.round(shownPay.current).toLocaleString('sv-SE')} €</span>
      <span>{balanceText(trend)}</span>
    </div>
  </div>
{/if}

<style>
  /* === Layout === */

  .wheel {
    display: grid;
    justify-items: center;
    gap: var(--spacing-1-5);
  }

  svg {
    display: block;
    width: var(--wheel-diameter);
    height: var(--wheel-diameter);
  }

  circle {
    fill: none;
  }

  .tick {
    stroke: var(--wheel-tick);
    stroke-width: 1;
  }

  .number {
    font-family: var(--font-display);
    font-size: var(--wheel-text-size);
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    text-anchor: middle;
  }

  .label {
    fill: var(--dashboard-ink);
    font-family: var(--font-text);
    font-size: var(--wheel-label-size);
    letter-spacing: var(--wheel-label-tracking);
    text-anchor: middle;
  }

  .pay {
    display: flex;
    gap: var(--spacing-3);
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-body);
    font-variant-numeric: tabular-nums;
  }
</style>
