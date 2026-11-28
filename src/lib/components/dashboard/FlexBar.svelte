<!--
  The flex bar ("The flex bar"): the janitor balance as a number, centred, over a bar from a 0 line, minus to the left
  in the balance profile's base colour and plus to the right in its neon; exactly 0 is a dimmed marker that
  slowly breathes. Ten marks a side run to the scale's end, whose mark and label wear that side's colour. The number
  and the bar count to a new balance together, and the scale grows or shrinks with a short animation; on opening, both
  show at once. Drawn as the prototype draws it, on a 400 × 48 board. It reads nothing of the app: it draws the
  balance and colours it is handed, so the dashboard, or a report, places it:
  <FlexBar seconds={bar.seconds} colours={colourRoles(bar.profile, panel)} still={app.still} />
-->
<script lang="ts" module>
  /**
   * The board the bar is drawn on, in its own units, as the prototype has it: the 0 line in the middle of a 400 wide
   * board, each side 180 long, the line from 2 to 36 and the marks hanging from it, the labels under them
   */
  const BOARD = {
    width: 400,
    height: 48,
    centre: 200,
    half: 180,
    middle: 19,
    lineTop: 2,
    lineBottom: 36,
    markTop: 32,
    endMarkTop: 30,
    labelBaseline: 47,
    zeroWidth: 16,
    corner: 9,
    least: 2,
  }

  /** The ten marks of a side, as shares of it from the 0 line out */
  const MARKS = Array.from({ length: 10 }, (_, i) => (i + 1) / 10)
</script>

<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { balanceText, barReach, barScale, barSide } from '$lib/modules/dashboard/figures'

  // === Props ===

  let {
    seconds,
    colours: roles,
    still,
  }: {
    /** The balance, in seconds */
    seconds: number
    /** The balance profile's colours: base for minus, neon for plus, dimmed for the marker at 0 */
    colours: { base: string; neon: string; dimmed: string }
    /** Whether motion is off, so a new balance shows at once */
    still: boolean
  } = $props()

  // === State ===

  let scale = $state<number | null>(null)

  // What is drawn: the balance and the scale on their way to their new values
  const shown = new Tween(0, { easing: cubicOut })
  const shownScale = new Tween(0, { easing: cubicOut })
  let motion = { count: 0, scale: 0 }

  /** The bar's thickness on the board: the wheel's band times --bar-share, read from the tokens once mounted */
  let thickness = $state(0)
  let value = $derived(shown.current)
  let side = $derived(barSide(value))
  let reach = $derived(shownScale.current > 0 ? barReach(value, shownScale.current) * BOARD.half : 0)
  let numberColour = $derived(side === 'minus' ? roles.base : side === 'plus' ? roles.neon : 'var(--dashboard-text)')
  let top = $derived(BOARD.middle - thickness / 2)

  // === Logic ===

  onMount(() => {
    const tokens = getComputedStyle(document.documentElement)
    const time = (name: string): number => parseFloat(tokens.getPropertyValue(name)) * 1000 || 0
    motion = { count: time('--balance-count'), scale: time('--bar-scale-change') }
    thickness = parseFloat(tokens.getPropertyValue('--wheel-band')) * parseFloat(tokens.getPropertyValue('--bar-share'))
  })

  // A new balance: the scale follows it, and the number and the bar count to it; the first one shows at once
  let first = true
  $effect(() => {
    const next = barScale(
      seconds,
      untrack(() => scale),
    )
    const opening = first || untrack(() => still)
    first = false
    scale = next
    void shown.set(seconds, { duration: opening ? 0 : motion.count })
    void shownScale.set(next, { duration: opening ? 0 : motion.scale })
  })

  // === Helpers ===

  /**
   * The bar from the 0 line to its reach, rounded only at its outer end, square against the line. Used to draw a
   * balance off 0
   */
  function barPath(length: number, toRight: boolean): string {
    const s = toRight ? 1 : -1
    const len = Math.max(length, BOARD.least)
    const r = Math.min(BOARD.corner, len, thickness / 2)
    const x0 = BOARD.centre
    const x1 = BOARD.centre + s * len
    const sweep = toRight ? 1 : 0
    const bottom = top + thickness
    return (
      `M${x0},${top} L${x1 - s * r},${top} A${r},${r} 0 0 ${sweep} ${x1},${top + r} ` +
      `L${x1},${bottom - r} A${r},${r} 0 0 ${sweep} ${x1 - s * r},${bottom} L${x0},${bottom} Z`
    )
  }
</script>

{#if thickness > 0}
  <div class="balance">
    <div class="number" style:color={numberColour}>{balanceText(value)}</div>
    <svg viewBox="0 0 {BOARD.width} {BOARD.height}" role="img" aria-label="Saldostapel">
      {#if side === 'zero'}
        <rect
          class="zero"
          x={BOARD.centre - BOARD.zeroWidth / 2}
          y={top}
          width={BOARD.zeroWidth}
          height={thickness}
          rx={Math.min(BOARD.zeroWidth / 2, thickness / 2)}
          fill={roles.dimmed}
        />
      {:else}
        <path d={barPath(reach, side === 'plus')} fill={side === 'plus' ? roles.neon : roles.base} />
      {/if}
      <line class="zero-line" x1={BOARD.centre} x2={BOARD.centre} y1={BOARD.lineTop} y2={BOARD.lineBottom} />
      {#each [-1, 1] as s (s)}
        {@const colour = s < 0 ? roles.base : roles.neon}
        {#each MARKS as share (share)}
          <line
            class="mark"
            x1={BOARD.centre + s * BOARD.half * share}
            x2={BOARD.centre + s * BOARD.half * share}
            y1={share === 1 ? BOARD.endMarkTop : BOARD.markTop}
            y2={BOARD.lineBottom}
            style:stroke={share === 1 ? colour : undefined}
          />
        {/each}
        <text class="label" x={BOARD.centre + s * BOARD.half} y={BOARD.labelBaseline} style:fill={colour}>
          {s < 0 ? '−' : '+'}{Math.round((scale ?? 0) / 3600)}h
        </text>
      {/each}
    </svg>
  </div>
{/if}

<style>
  /* === Layout === */

  .balance {
    display: grid;
    gap: var(--spacing-sm);
  }

  .number {
    font-family: var(--font-display);
    font-size: var(--text-size-display-lg);
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    font-variant-numeric: tabular-nums;
    letter-spacing: var(--tracking-wide);
    line-height: var(--leading-none);
    text-align: center;
  }

  svg {
    display: block;
    width: 100%;
    height: 48px; /* the bar with its scale */
    overflow: visible;
  }

  .zero-line {
    stroke: var(--bar-zero);
    stroke-width: 1.5px;
  }

  .mark {
    stroke: var(--dashboard-ink);
    stroke-width: 1;
  }

  .label {
    font-family: var(--font-text);
    font-size: var(--text-size-label);
    text-anchor: middle;
  }

  /* === States === */

  /* Exactly 0: the marker slowly widens and narrows, at rest */
  .zero {
    transform-box: fill-box;
    transform-origin: center;
    animation: breathe 3.2s ease-in-out infinite; /* the marker at exactly 0 widens and narrows over this */
  }

  @keyframes breathe {
    0%,
    100% {
      transform: scaleX(1);
    }

    50% {
      transform: scaleX(1.6); /* how wide it gets, against its rest */
    }
  }
</style>
