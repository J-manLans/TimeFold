<!--
  The popup for a running entry from an earlier day ("A running entry from an earlier day asks"): centred on the
  controls side over a scrim, it says when the entry started and which profile runs since when, with a quiet note on
  putting a mistake right, and offers "Stoppa", which stops it as the start/stop button does, undo included, and
  "Fortfarande igång", which closes it. Only the app's opening asks; a click on the scrim or Esc answers nothing.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import ChoiceButton from '$lib/components/shared/ChoiceButton.svelte'
  import { lateWords } from '$lib/modules/controls/clock'
  import { popupClosed, popupOpened, type Input } from '$lib/modules/shared/focusRing'

  // === State ===

  let stop: ChoiceButton | undefined = $state()
  let words = $derived(app.record && app.late ? lateWords(app.record, app.late, new Date()) : null)
  /** How it was opened (by the app itself, as a rule), for the focus ring when it closes, and whether it was open */
  let openedBy: Input = null
  let wasOpen = false

  // === Logic ===

  // The focus starts on "Stoppa", the answer most mornings
  $effect(() => {
    stop?.focus()
  })

  // Answered, the focus where it lands shows no ring unless it was opened and answered with the keyboard
  $effect(() => {
    const isOpen = words !== null
    if (isOpen && !wasOpen) openedBy = popupOpened()
    if (!isOpen && wasOpen) popupClosed(openedBy)
    wasOpen = isOpen
  })
</script>

{#if words}
  <div class="scrim">
    <div class="popup" role="dialog" aria-modal="true" aria-labelledby="late-heading">
      <h3 id="late-heading">{words.heading}</h3>
      <p class="line">{words.line}</p>
      <p class="note">Glömde du stoppa? Tryck Stoppa och rätta posten i listan.</p>
      <div class="buttons">
        <ChoiceButton label="Stoppa" onclick={() => app.stopLate()} bind:this={stop} />
        <ChoiceButton label="Fortfarande igång" onclick={() => app.keepLate()} />
      </div>
    </div>
  </div>
{/if}

<style>
  /* === Layout === */

  .scrim {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: grid;
    place-items: center;
    background: var(--scrim);
  }

  .popup {
    --choice-scale: var(--late-choice-scale);
    display: grid;
    justify-items: center;
    gap: var(--late-gap);
    padding: var(--late-padding);
    border: 1px solid var(--button-line);
    border-radius: var(--radius-panel);
    background: var(--popup-background);
    color: var(--popup-text);
    text-align: center;
  }

  h3 {
    margin: 0;
    font-size: var(--text-size-note);
    color: color-mix(in srgb, var(--popup-text) var(--popup-muted), transparent);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  p {
    max-width: var(--late-width);
    margin: 0;
    text-wrap: balance;
  }

  .line {
    font-size: var(--late-line-size);
  }

  .note {
    font-size: var(--text-size-note);
    color: color-mix(in srgb, var(--popup-text) var(--popup-muted), transparent);
  }

  .buttons {
    display: flex;
    gap: var(--block-gap);
  }
</style>
