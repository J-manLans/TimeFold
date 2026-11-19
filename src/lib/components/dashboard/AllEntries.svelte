<!--
  "Visa alla" and the popup it opens: every stopped entry, newest first, in a card centred on the window over a dark
  scrim ("The main screen has a controls side and a dashboard"), with a quiet line naming each month and its year
  where the list crosses into it. "Stäng", a click on the scrim or Esc closes it, and the
  focus goes back to "Visa alla". The rows only show their entries until editing comes ("Editing an entry on its
  line"). With no entry yet, "Visa alla" is greyed out: <AllEntries disabled={entries.length === 0} />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { stoppedEntries, withMonthLines } from '$lib/modules/dashboard/entries'
  import EntryRow from './EntryRow.svelte'

  // === Props ===

  let {
    disabled,
  }: {
    /** Whether there is nothing to show, which greys out "Visa alla" */
    disabled: boolean
  } = $props()

  // === State ===

  let popup: HTMLDialogElement | undefined = $state()
  let open = $state(false)
  let items = $derived(open && app.record ? withMonthLines(stoppedEntries(app.record)) : [])

  // === Helpers ===

  /** Opens the popup over everything, its focus inside it. Used by "Visa alla" */
  function show(): void {
    open = true
    popup?.showModal()
  }

  /** A click on the scrim, outside the card, closes the popup. Used by the popup's click */
  function closeOutside(event: MouseEvent): void {
    if (event.target === popup) popup?.close()
  }
</script>

<button class="more" type="button" {disabled} onclick={show}>Visa alla</button>

<dialog bind:this={popup} aria-label="Alla poster" onclick={closeOutside} onclose={() => (open = false)}>
  <div class="card">
    <header>
      <span class="label">Alla poster</span>
      <button class="more" type="button" onclick={() => popup?.close()}>Stäng</button>
    </header>
    <ol>
      {#each items as item (item.kind === 'month' ? item.key : item.entry.id)}
        {#if item.kind === 'month'}
          <li class="month">{item.label}</li>
        {:else}
          <EntryRow entry={item.entry} />
        {/if}
      {/each}
    </ol>
  </div>
</dialog>

<style>
  /* === Layout === */

  .more {
    justify-self: start;
    padding: var(--entries-button-padding);
    border: 1px solid var(--dashboard-line);
    border-radius: var(--radius-small);
    background: none;
    color: var(--dashboard-text-muted);
    font: inherit;
    font-size: var(--entries-button-size);
    letter-spacing: normal;
    cursor: pointer;
    transition: border-color var(--speed-ui) ease;
  }

  dialog {
    width: min(var(--all-entries-width), var(--all-entries-share));
    max-width: none;
    max-height: var(--all-entries-height);
    padding: 0;
    overflow: auto;
    border: 1px solid var(--dashboard-line);
    border-radius: var(--radius-panel);
    background: var(--dashboard-background);
    color: var(--dashboard-text);
  }

  dialog::backdrop {
    background: var(--all-entries-scrim);
  }

  .card {
    display: grid;
    gap: var(--all-entries-gap);
    padding: var(--all-entries-padding);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .label {
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-note);
    letter-spacing: var(--dashboard-label-tracking);
    text-transform: uppercase;
  }

  ol {
    display: grid;
    gap: var(--entry-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* A month's line: no row behind it, a little room above, the rows under it as in the recent list */
  .month {
    padding: var(--entry-month-gap) var(--entry-month-inset) var(--entry-month-under);
    color: var(--dashboard-text-muted);
    font-size: var(--entry-month-size);
    font-weight: var(--entry-month-weight);
  }

  .month:first-child {
    padding-top: 0;
  }

  /* === States === */

  .more:hover:enabled {
    border-color: var(--dashboard-text-muted);
  }

  .more:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }
</style>
