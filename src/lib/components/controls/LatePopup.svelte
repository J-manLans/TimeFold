<!--
  The popup for a running entry from an earlier day ("A running entry from an earlier day asks"): in the popups'
  frame over the controls side, it says when the entry started and which profile runs since when, with a quiet note on
  putting a mistake right, and offers "Stoppa", which stops it as the start/stop button does, undo included, and
  "Fortfarande igång", which closes it. Only the app's opening asks; a click outside or Esc answers nothing.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import ChoiceButton from '$lib/components/shared/ChoiceButton.svelte'
  import { lateWords } from '$lib/modules/controls/clock'
  import Popup from '$lib/components/shared/Popup.svelte'

  // === State ===

  let stop: ChoiceButton | undefined = $state()
  let words = $derived(app.record && app.late ? lateWords(app.record, app.late, new Date()) : null)

  // === Logic ===

  // The focus starts on "Stoppa", the answer most mornings
  $effect(() => {
    stop?.focus()
  })
</script>

<Popup open={words !== null} heading={words?.heading} surface="popup" over="side" dismiss={false}>
  {#if words}
    <div class="body">
      <p class="line">{words.line}</p>
      <p class="note">Glömde du stoppa? Tryck Stoppa och rätta posten i listan.</p>
      <div class="buttons">
        <ChoiceButton label="Stoppa" onclick={() => app.stopLate()} bind:this={stop} />
        <ChoiceButton label="Fortfarande igång" onclick={() => app.keepLate()} />
      </div>
    </div>
  {/if}
</Popup>

<style>
  /* === Layout === */

  .body {
    --choice-scale: 0.42; /* "Stoppa" and "Fortfarande igång" against "Starta jobb", as the locked panel's choices */
    display: grid;
    justify-items: center;
    gap: var(--spacing-lg);
    text-align: center;
  }

  p {
    max-width: 30ch; /* the most the words take before they wrap */
    margin: 0;
    text-wrap: balance;
  }

  .line {
    font-size: var(--text-size-body);
  }

  .note {
    font-size: var(--text-size-label);
    color: var(--surface-muted);
  }

  .buttons {
    display: flex;
    gap: var(--spacing-md);
  }
</style>
