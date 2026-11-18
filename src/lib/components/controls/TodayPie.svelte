<!--
  Today's pie ("Today's pie"): beside the status line, a ring of slices, one per hour the profile with the balance is
  expected to work today. An empty slice is marked by its border in the profile's base colour, a worked hour fills in
  it, and past the expected hours the next lap fills over the last, in the neon, then the base again, and so on. A
  slice clicks in whole and lights as it does; the one filling at the end of a lap, the last of the first, grows in
  parts. Shown only while that profile works, counted again once a minute, so it moves while the dashboard waits for the
  stop; no pie on a day with no expected hours.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { todaySlices, type TodaySlices } from '$lib/modules/controls/today'
  import { neonColour } from '$lib/modules/shared/colours'

  // === State ===

  /** The moment counted to, moved on once a minute */
  let now = $state(new Date())
  /** The ring's open middle as a share of its radius, the gap between slices, and the parts, from the tokens */
  let inner = $state(0.3)
  let gap = $state(6)
  let parts = $state(3)
  /** What has just clicked in, which lights: a slice's index, 'part' for the growing fill, or null */
  let fresh = $state<number | 'part' | null>(null)
  let shown: { lap: number; filled: number; partsFilled: number } | null = null

  let profile = $derived(app.record?.profiles.find((p) => p.expectedMinutes !== undefined))
  let pie = $derived(app.record ? todaySlices(app.record, now, parts) : null)
  let paths = $derived(pie ? Array.from({ length: pie.slices }, (_, k) => slice(k, pie.slices)) : [])
  /** The split slice's fill, as far as its full parts reach */
  let partPath = $derived(pie && pie.partsFilled > 0 ? slice(pie.split, pie.slices, pie.partsFilled / pie.parts) : '')

  // === Logic ===

  onMount(() => {
    const tokens = getComputedStyle(document.documentElement)
    inner = parseFloat(tokens.getPropertyValue('--pie-inner')) / 100 || inner
    gap = parseFloat(tokens.getPropertyValue('--pie-slice-gap')) || gap
    parts = parseFloat(tokens.getPropertyValue('--pie-parts')) || parts
    const timer = setInterval(() => (now = new Date()), MINUTE)
    return () => clearInterval(timer)
  })

  // A stop or a start counts again at once, not at the next minute
  $effect(() => {
    void app.record
    now = new Date()
  })

  // What has just clicked in lights: the slice that filled, or the split slice's newest part
  $effect(() => {
    if (!pie) return
    const before = shown
    shown = { lap: pie.lap, filled: pie.filled, partsFilled: pie.partsFilled }
    if (before === null) return
    if (pie.lap !== before.lap || pie.filled !== before.filled) fresh = (pie.filled + pie.slices - 1) % pie.slices
    else if (pie.partsFilled > before.partsFilled) fresh = 'part'
  })

  // === Helpers ===

  /** A lap's colour, as a class: the first in the base, then the neon and the base by turns */
  function lapClass(lap: number): string {
    return lap % 2 === 0 ? 'base' : 'neon'
  }

  /** A slice's class: this lap's colour once full, else the lap before's, or empty on the first. Used for every slice */
  function sliceClass(k: number, at: TodaySlices): string {
    if (k < at.filled) return lapClass(at.lap)
    return at.lap === 0 ? 'empty' : lapClass(at.lap - 1)
  }

  /**
   * Slice `k` of `n` as a path in the pie's own units, 100 across: a segment of the ring from 12 o'clock clockwise,
   * its sides set in so the gap to its neighbours is the same width all along them. With `share` below 1, only that
   * much of it from its start, ending straight inside the slice. Used for every slice and the split slice's fill
   */
  function slice(k: number, n: number, share = 1): string {
    const outer = RADIUS
    const inside = RADIUS * inner
    const step = (2 * Math.PI) / n
    const set = (r: number): number => Math.asin(Math.min(1, gap / 2 / r))
    const endSet = (r: number): number => (share < 1 ? 0 : set(r))
    const at = (angle: number, r: number): string => `${CENTRE + r * Math.sin(angle)},${CENTRE - r * Math.cos(angle)}`
    const from = k * step
    const to = from + step * share
    return [
      `M${at(from + set(outer), outer)}`,
      `A${outer} ${outer} 0 0 1 ${at(to - endSet(outer), outer)}`,
      `L${at(to - endSet(inside), inside)}`,
      `A${inside} ${inside} 0 0 0 ${at(from + set(inside), inside)}`,
      'Z',
    ].join(' ')
  }

  const MINUTE = 60_000
  const CENTRE = 50
  const RADIUS = 49
</script>

{#if pie && profile}
  <svg
    class="pie"
    viewBox="0 0 100 100"
    role="img"
    aria-label="Idag"
    style:--pie-base={profile.base}
    style:--pie-neon={neonColour(profile.hue)}
  >
    {#each paths as d, k (k)}
      <path {d} class={sliceClass(k, pie)} class:fresh={k === fresh} onanimationend={() => (fresh = null)} />
    {/each}
    {#if partPath}
      <path
        d={partPath}
        class={lapClass(pie.lap)}
        class:fresh={fresh === 'part'}
        onanimationend={() => (fresh = null)}
      />
    {/if}
  </svg>
{/if}

<style>
  /* === Layout === */

  /* Right of the status text, in the line's row */
  .pie {
    flex: none;
    width: var(--pie-size);
    height: var(--pie-size);
  }

  .empty {
    fill: none;
    stroke: var(--pie-base);
    stroke-width: var(--pie-border);
  }

  .base {
    fill: var(--pie-base);
  }

  .neon {
    fill: var(--pie-neon);
  }

  /* === States === */

  .fresh {
    animation: click var(--pie-flash) ease-out;
  }

  @keyframes click {
    from {
      filter: brightness(var(--pie-flash-brightness));
    }

    to {
      filter: brightness(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fresh {
      animation: none;
    }
  }
</style>
