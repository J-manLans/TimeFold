<!--
  The pay estimate ("A pay estimate per profile"): the month's pay over every profile, quiet, with no label, counting to
  a new value as the balance does; on opening it shows at once. It belongs to no figure, so it is a part of its own,
  shown only when some profile has pay. It reads nothing of the app: <PayEstimate pay={pay} still={app.still} />
-->
<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  // === Props ===

  let {
    pay,
    still,
  }: {
    /** The month's pay, in euros */
    pay: number
    /** Whether motion is off, so a new amount shows at once */
    still: boolean
  } = $props()

  // === State ===

  /** The amount on its way to its new value */
  const shown = new Tween(0, { easing: cubicOut })
  let count = 0

  // === Logic ===

  onMount(() => {
    count = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--balance-count')) * 1000 || 0
  })

  // A new amount: it counts to it; the first shows at once
  let first = true
  $effect(() => {
    const next = pay
    const duration = first || untrack(() => still) ? 0 : count
    first = false
    void shown.set(next, { duration })
  })
</script>

<span class="pay">≈ {Math.round(shown.current).toLocaleString('sv-SE')} €</span>

<style>
  /* === Layout === */

  .pay {
    justify-self: center;
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-body);
    font-variant-numeric: tabular-nums;
  }
</style>
