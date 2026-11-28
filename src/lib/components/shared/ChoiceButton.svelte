<!--
  A choice in the menu's locked panel or a popup, in "Starta jobb"'s height and font scaled by --choice-scale (the
  locked panel's own unless a parent sets it), as wide as its words: "Starta nytt", "Använd
  kopian", "Stoppa". Greyed out, it still takes the pointer and the focus,
  so its tip can say why or what: <ChoiceButton label="Importera" greyed tip="från fil" />
-->
<script lang="ts">
  import TipLabel from '$lib/components/controls/TipLabel.svelte'

  // === Props ===

  let {
    label,
    onclick,
    greyed = false,
    tip = '',
  }: {
    /** The words on the button */
    label: string
    /** What a press does; a greyed-out button does nothing */
    onclick?: () => void
    /** Whether it is greyed out until a later phase */
    greyed?: boolean
    /** The tip shown on hover and keyboard focus, or none */
    tip?: string
  } = $props()

  // === State ===

  let button: HTMLButtonElement | undefined = $state()
  /** Where the pointer is over the button, and whether it has keyboard focus, for the tip */
  let point = $state<{ x: number; y: number } | null>(null)
  let focused = $state(false)

  // === API ===

  /** Puts the focus on the button. Used by the panel when its step shows */
  export function focus(): void {
    button?.focus()
  }

  // === Helpers ===

  /** The pointer over the button, for the tip; a touch shows none. Used on pointer enter and move */
  function follow(event: PointerEvent): void {
    if (event.pointerType !== 'touch') point = { x: event.clientX, y: event.clientY }
  }
</script>

<button
  class="choice plastic"
  type="button"
  aria-disabled={greyed}
  bind:this={button}
  onclick={() => {
    if (!greyed) onclick?.()
  }}
  onpointerenter={follow}
  onpointermove={follow}
  onpointerleave={() => (point = null)}
  onfocus={() => (focused = button?.matches(':focus-visible') ?? false)}
  onblur={() => (focused = false)}
>
  <span class="label">{label}</span>
</button>
{#if tip}
  <TipLabel text={tip} {point} anchor={focused ? (button ?? null) : null} />
{/if}

<style>
  /* === Layout === */

  .choice {
    /* A parent's --choice-scale, or the locked panel's: "Starta nytt" and "Importera" against "Starta jobb" */
    --scale: var(--choice-scale, 0.8);

    display: grid;
    place-items: center;
    height: calc(var(--start-height) * var(--scale));
    padding: 0 calc(var(--spacing-xxl) * var(--scale));
  }

  .label {
    font-family: var(--font-display);
    font-size: calc(var(--text-size-display-md) * var(--scale));
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    letter-spacing: var(--tracking-wide);
    line-height: var(--leading-none);
    text-transform: uppercase;
    /* Trimmed to its capitals, so they sit dead centre in any engine, as the profile letter does */
    text-box: trim-both cap alphabetic;
  }
</style>
