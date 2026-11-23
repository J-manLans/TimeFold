<!--
  "Visa alla" and the popup it opens: every stopped entry, newest first, in a card centred on the window over a dark
  scrim ("The main screen has a controls side and a dashboard"), with a quiet line naming each month and its year
  where the list crosses into it, and a gap above each row where a forgotten entry is written ("A forgotten entry is
  written in the gap where it belongs"). "Stäng", a click on the scrim or Esc closes it, and the
  focus goes back to "Visa alla". With no entry yet, "Visa alla" is greyed out: <AllEntries disabled={entries.length === 0} />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { gapsAbove, stoppedEntries, withMonthLines } from '$lib/modules/dashboard/entries'
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
  let entries = $derived(open && app.record ? stoppedEntries(app.record) : [])
  let items = $derived(withMonthLines(entries))
  // The newest gap runs up to a running entry's start, or to the moment the popup opened
  let gaps = $derived.by(() => {
    const found = gapsAbove(entries, app.running ? Date.parse(app.running.start) : Date.now())
    return Object.fromEntries(entries.map((entry, i) => [entry.id, found[i]]))
  })

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

<!-- It keeps an open menu open, so closing the popup comes back to it -->
<button class="more" type="button" data-keeps-menu {disabled} onclick={show}>Visa alla</button>

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
          {@const kind = gaps[item.entry.id].kind}
          <!-- TODO: a click on a gap with a "+" opens the edit popup on its stretch of time, once that popup exists -->
          <li
            class="gap"
            class:top={kind === 'top'}
            class:open={kind === 'open'}
            class:shut={kind === 'shut'}
            aria-hidden="true"
          >
            <span class="rule left"></span><span class="plus">+</span><span class="rule right"></span>
          </li>
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

  /* A gap: --insert-rest tall between the rows, its hover strip taller and reaching over their edges, with a "+" at its
     centre and a line on each side, hidden until it is hovered */
  .gap {
    display: flex;
    gap: var(--insert-spacing);
    align-items: center;
    height: var(--insert-hit);
    margin: calc((var(--insert-rest) - var(--insert-hit)) / 2) 0;
    padding: var(--insert-inset);
    cursor: pointer;
  }

  .rule {
    flex: 1;
    height: 1px;
    background: var(--dashboard-text-muted);
    transform: scaleX(0);
    transition: transform var(--speed-ui) ease;
  }

  .rule.left {
    transform-origin: right;
  }

  .rule.right {
    transform-origin: left;
  }

  .plus {
    color: var(--dashboard-text-muted);
    font-size: var(--insert-plus-size);
    line-height: 1;
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  /* The always-shown "+" sits in a gap always open, so nothing moves around it */
  .gap.top {
    height: calc(var(--insert-rest) + var(--insert-open));
    margin: 0;
  }

  .gap.top .plus {
    opacity: 1;
    transition:
      opacity var(--speed-ui) ease,
      color var(--speed-ui) ease;
  }

  /* With no room for an entry, a gap only keeps the rows' spacing */
  .gap.shut {
    cursor: default;
  }

  .gap.shut > * {
    visibility: hidden;
  }

  /* Every line of the list slides as a gap opens: a shift of its look only, so the list's height stays put */
  ol > :global(li) {
    transition: transform var(--speed-ui) ease;
  }

  /* === States === */

  .more:hover:enabled {
    border-color: var(--dashboard-text-muted);
  }

  .more:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }

  /* A rested pointer opens a gap: its line grows out of the "+", and the rows above shift up and those below down by
     half of --insert-open each, so it opens evenly around the pointer. The always-shown gap only lights, at once. */
  .gap:is(.top, .open):hover .rule {
    transform: scaleX(1);
    transition-delay: var(--peek-delay);
  }

  .gap.open:hover .plus {
    opacity: 1;
    transition-delay: var(--peek-delay);
  }

  .gap.top:hover .plus {
    color: var(--dashboard-text);
  }

  .gap.top:hover .rule {
    transition-delay: 0s;
  }

  ol > :global(li:has(~ li.open:hover)) {
    transform: translateY(calc(var(--insert-open) / -2));
    transition-delay: var(--peek-delay);
  }

  ol > .gap.open:hover ~ :global(li) {
    transform: translateY(calc(var(--insert-open) / 2));
    transition-delay: var(--peek-delay);
  }
</style>
