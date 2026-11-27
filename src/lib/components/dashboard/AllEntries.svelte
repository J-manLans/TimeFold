<!--
  "Visa alla" and the popup it opens: a running entry first, then every stopped entry, newest first, in a card centred on the window over a dark
  scrim ("The main screen has a controls side and a dashboard"), with a quiet line naming each month and its year
  where the list crosses into it, and a gap above each row where a forgotten entry is written ("A forgotten entry is
  written in the gap where it belongs"). A row opens its entry in the edit popup, stacked on the list, and a gap's "+"
  opens it on that gap. "Stäng", a click on the scrim or Esc closes it, and the
  focus goes back to "Visa alla". With no entry yet, "Visa alla" is greyed out: <AllEntries disabled={entries.length === 0} />
-->
<script lang="ts">
  import { tick } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { popupClosed, popupOpened, type Input } from '$lib/modules/shared/focusRing'
  import { gapsAbove, listedEntries, withMonthLines, type Gap } from '$lib/modules/dashboard/entries'
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
  /** How the popup was opened, a key or a pointer, for the focus ring when it closes */
  let openedBy: Input = null
  let entries = $derived(open && app.record ? listedEntries(app.record) : [])
  let stopped = $derived(entries.filter((e) => e.stop !== null))
  let items = $derived(withMonthLines(entries))
  // The newest gap runs up to a running entry's start, or to the moment the popup opened
  let gaps = $derived.by(() => {
    const found = gapsAbove(stopped, app.running ? Date.parse(app.running.start) : Date.now())
    return Object.fromEntries(stopped.map((entry, i) => [entry.id, found[i]]))
  })

  // === Helpers ===

  /** Opens the popup over everything, its focus inside it. Used by "Visa alla" */
  function show(): void {
    open = true
    openedBy = popupOpened()
    popup?.showModal()
  }

  /** The popup closed: the focus back on "Visa alla", its ring only after a keyboard open and close */
  function closed(): void {
    open = false
    app.savedId = null
    popupClosed(openedBy)
  }

  // After a save from the list, the saved row, outlined, is scrolled into view if it is out of it, and only then
  $effect(() => {
    const id = app.savedId
    if (!id || !popup?.open) return
    tick().then(() => popup?.querySelector(`[data-entry="${id}"]`)?.scrollIntoView({ block: 'nearest' }))
  })

  /**
   * A gap's "+" clicked: the edit popup opens on its stretch for a forgotten entry. The gap over the newest row with
   * nothing running runs up to the moment it is clicked, since now has moved on since the list was drawn
   */
  function writeIn(gap: Gap): void {
    const upToNow = stopped.length > 0 && gap.from === Date.parse(stopped[0].stop ?? '') && !app.running
    app.openGap({ from: gap.from, to: upToNow ? Date.now() : gap.to })
  }

  /** A click on the scrim, outside the card, closes the popup. Used by the popup's click */
  function closeOutside(event: MouseEvent): void {
    if (event.target === popup) popup?.close()
  }
</script>

<!-- It keeps an open menu open, so closing the popup comes back to it -->
<button class="more" type="button" data-keeps-menu {disabled} onclick={show}>Visa alla</button>

<dialog bind:this={popup} data-surface="dashboard" aria-label="Alla poster" onclick={closeOutside} onclose={closed}>
  <!-- The edit popup stacked on it peeks only while the pointer rests on this card -->
  <div class="card" data-all-entries>
    <header>
      <span class="label">Alla poster</span>
      <button class="more" type="button" onclick={() => popup?.close()}>Stäng</button>
    </header>
    <ol>
      {#each items as item (item.kind === 'month' ? item.key : item.entry.id)}
        {#if item.kind === 'month'}
          <li class="month">{item.label}</li>
        {:else}
          {@const gap = gaps[item.entry.id] as Gap | undefined}
          {#if !gap}
            <!-- A running entry heads the list, with nothing to write above it -->
          {:else if gap.kind === 'shut'}
            <li class="gap shut" aria-hidden="true">
              <span class="rule left"></span><span class="plus">+</span><span class="rule right"></span>
            </li>
          {:else}
            <!-- Each gap stays an item of the list, as its hover's sibling rules need -->
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
            <li
              class="gap"
              class:top={gap.kind === 'top'}
              class:open={gap.kind === 'open'}
              role="button"
              tabindex="0"
              aria-label="Lägg till en glömd post här"
              onclick={() => writeIn(gap)}
              onkeydown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  writeIn(gap)
                }
              }}
            >
              <span class="rule left"></span><span class="plus">+</span><span class="rule right"></span>
            </li>
          {/if}
          <EntryRow
            entry={item.entry}
            picked={app.editing ? app.editing.entryId === item.entry.id : app.savedId === item.entry.id}
            withReason
            onpick={() => app.openEdit(item.entry.id, true)}
          />
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
    font-size: var(--text-size-label);
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
