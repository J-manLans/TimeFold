<!--
  A choice in the menu's locked panel or a popup, in "Starta jobb"'s height and font scaled by --choice-scale (the
  locked panel's --onboarding-choice-scale unless a parent sets it), as wide as its words: "Starta nytt", "Använd
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
  class="choice"
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
    background-attachment: fixed;
    height: calc(var(--start-height) * var(--choice-scale, var(--onboarding-choice-scale)));
    padding: 0 calc(var(--onboarding-choice-padding) * var(--choice-scale, var(--onboarding-choice-scale)));
    border: 0;
    border-radius: var(--radius-button);
    background-color: var(--button-background);
    color: var(--button-text);
    box-shadow: var(--shadow-button);
    cursor: pointer;
    transition: background-color var(--speed-ui) ease;
  }

  .label {
    font-family: var(--font-display);
    font-size: calc(var(--start-text-size) * var(--choice-scale, var(--onboarding-choice-scale)));
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    letter-spacing: var(--start-tracking);
    line-height: 1;
    text-transform: uppercase;
  }

  /* === States === */

  /* A choice that can be used catches the pointer light, as the controls' buttons do */
  .choice:not([aria-disabled='true']) {
    background-image: var(--pointer-light);
  }

  .choice:not([aria-disabled='true']):hover {
    background-color: var(--button-background-hover);
  }

  .choice[aria-disabled='true'] {
    opacity: var(--opacity-disabled);
    cursor: default;
  }
</style>
