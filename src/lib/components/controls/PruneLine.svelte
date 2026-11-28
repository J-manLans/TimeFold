<!--
  The prune line at the bottom of the controls side ("Old history is pruned on request"). Its room is kept so nothing
  above moves when it appears. While the record holds whole months more than three years old it offers to prune them,
  saying how many ("Du har över tre års historik. Rensa de äldsta 3 månaderna?"), with "Rensa", which asks once, as "Ta
  bort" does, and prunes on its second click after the day's copy, and "Inte nu", which hides the line until the first
  of next month. In a narrow window its words wrap over the left and its buttons stack on the right: <PruneLine />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { pruneOffer, pruneWords } from '$lib/modules/controls/prune'
  import { localDay } from '$lib/modules/shared/counting'

  // === State ===

  let today = $derived(localDay(Date.now()))
  let offer = $derived(app.record && app.phase === 'ready' ? pruneOffer(app.record, today) : null)
  let offering = $derived(offer !== null && (app.pruneLater === null || today >= app.pruneLater))
  let asking = $state(false)

  // === Helpers ===

  /** "Rensa": asks once, then prunes */
  function clear(): void {
    if (!asking) {
      asking = true
      return
    }
    asking = false
    void app.pruneNow()
  }
</script>

<footer class="prune" class:offering>
  {#if offering && offer}
    <span class="words">{pruneWords(offer.months)}</span>
    <span class="buttons">
      <button
        class="button-small mini clear"
        class:asking
        type="button"
        onclick={clear}
        onfocusout={() => (asking = false)}
      >
        Rensa<span class="q">?</span>
      </button>
      <button class="button-small mini" type="button" onclick={() => void app.pruneLaterOn()}>Inte nu</button>
    </span>
  {/if}
</footer>

<style>
  /* === Layout === */

  .prune {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
    height: 40px; /* the prune line's room, kept when there is nothing to offer */
    margin: var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--controls-text-muted);
    font-size: var(--text-size-label);
  }

  .words {
    flex: 1;
  }

  .buttons {
    display: flex;
    gap: var(--spacing-md);
  }

  /* "Rensa" removes, as "Ta bort" does: red words, and a red border with its "?" once clicked */
  .clear {
    border-color: transparent;
    color: var(--controls-remove);
  }

  .q {
    visibility: hidden;
  }

  /* === States === */

  .offering {
    border-top: 1px solid var(--controls-line);
  }

  .asking {
    border-color: var(--controls-remove);
  }

  .asking .q {
    visibility: visible;
  }

  /* Stacked (App.svelte): the menu button sits in the lower left corner, so the
     line starts right of it, its words wrapping over the left and its buttons stacked on the right */
  :global(:where(:root[data-stacked])) .prune {
    flex-wrap: nowrap;
    margin-left: calc(2 * var(--spacing-lg) + var(--button-icon-size));
  }

  :global(:where(:root[data-stacked])) .buttons {
    flex-direction: column;
  }
</style>
