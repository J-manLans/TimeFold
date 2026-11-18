<!--
  Today's pie ("Today's pie"): beside the status line, a ring of slices, one per hour the profile with the balance is
  expected to work today. An empty slice is marked by its border in the profile's base colour, a worked hour fills in
  it, and past the expected hours a second lap fills in the neon over the first. A slice clicks in whole and lights as
  it does. Shown only while that profile works, counted again once a minute, so it moves while the dashboard waits for the
  stop; no pie on a day with no expected hours.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { todaySlices } from '$lib/modules/controls/today'
  import { neonColour } from '$lib/modules/shared/colours'

  // === State ===

  /** The moment counted to, moved on once a minute */
  let now = $state(new Date())
  /** The ring's open middle as a share of its radius, and the gap between slices, from the tokens */
  let inner = $state(0.3)
  let gap = $state(6)
  /** The slice that has just clicked in, which lights, or -1 */
  let fresh = $state(-1)
  let shown: { done: number; over: number } | null = null

  let profile = $derived(app.record?.profiles.find((p) => p.expectedMinutes !== undefined))
  let pie = $derived(app.record ? todaySlices(app.record, now) : null)
  let paths = $derived(pie ? Array.from({ length: pie.slices }, (_, k) => slice(k, pie.slices)) : [])

  // === Logic ===

  onMount(() => {
    const tokens = getComputedStyle(document.documentElement)
    inner = parseFloat(tokens.getPropertyValue('--pie-inner')) / 100 || inner
    gap = parseFloat(tokens.getPropertyValue('--pie-slice-gap')) || gap
    const timer = setInterval(() => (now = new Date()), MINUTE)
    return () => clearInterval(timer)
  })

  // A stop or a start counts again at once, not at the next minute
  $effect(() => {
    void app.record
    now = new Date()
  })

  // The slice whose hour has just completed lights: the newest base slice, or the newest neon one past the hours
  $effect(() => {
    if (!pie) return
    const before = shown
    shown = { done: pie.done, over: pie.over }
    if (before === null) return
    if (pie.over > before.over) fresh = pie.over - 1
    else if (pie.done > before.done) fresh = pie.done - 1
  })

  // === Helpers ===

  /**
   * Slice `k` of `n` as a path in the pie's own units, 100 across: a segment of the ring from 12 o'clock clockwise,
   * its sides set in so the gap to its neighbours is the same width all along them. Used for every slice
   */
  function slice(k: number, n: number): string {
    const outer = RADIUS
    const inside = RADIUS * inner
    const step = (2 * Math.PI) / n
    const set = (r: number): number => Math.asin(Math.min(1, gap / 2 / r))
    const at = (angle: number, r: number): string => `${CENTRE + r * Math.sin(angle)},${CENTRE - r * Math.cos(angle)}`
    const from = k * step
    const to = (k + 1) * step
    return [
      `M${at(from + set(outer), outer)}`,
      `A${outer} ${outer} 0 0 1 ${at(to - set(outer), outer)}`,
      `L${at(to - set(inside), inside)}`,
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
      <path
        {d}
        class={k < pie.over ? 'over' : k < pie.done ? 'done' : 'empty'}
        class:fresh={k === fresh}
        onanimationend={() => (fresh = -1)}
      />
    {/each}
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

  .done {
    fill: var(--pie-base);
  }

  .over {
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
