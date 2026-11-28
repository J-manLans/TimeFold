<!--
  "Visa alla" and the popup it opens: a running entry first, then every stopped entry, newest first, in the popups' frame centred on the window
  ("The main screen has a controls side and a dashboard"), with a quiet line naming each month and its year
  where the list crosses into it, and a gap above each row where a forgotten entry is written ("A forgotten entry is
  written in the gap where it belongs"). A row opens its entry in the edit popup, stacked on the list, and a gap's "+"
  opens it on that gap. A click outside or Esc closes it, and the
  focus goes back to "Visa alla". With no entry yet, "Visa alla" is greyed out: <AllEntries disabled={entries.length === 0} />
-->
<script lang="ts">
  import { tick } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { gapsAbove, listedEntries, withMonthLines, type Gap } from '$lib/modules/dashboard/entries'
  import EntryRow from './EntryRow.svelte'
  import Popup from '$lib/components/shared/Popup.svelte'

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
  let entries = $derived(open && app.record ? listedEntries(app.record) : [])
  let stopped = $derived(entries.filter((e) => e.stop !== null))
  let items = $derived(withMonthLines(entries))
  // The newest gap runs up to a running entry's start, or to the moment the popup opened
  let gaps = $derived.by(() => {
    const found = gapsAbove(stopped, app.running ? Date.parse(app.running.start) : Date.now())
    return Object.fromEntries(stopped.map((entry, i) => [entry.id, found[i]]))
  })

  // === Helpers ===

  /** Closed by Esc or a click outside: the saved row's outline goes with it */
  function close(): void {
    open = false
    app.savedId = null
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
</script>

<!-- It keeps an open menu open, so closing the popup comes back to it -->
<button class="button-small more" type="button" data-keeps-menu {disabled} onclick={() => (open = true)}>
  Visa alla
</button>

<!-- The edit popup stacked on it peeks only while the pointer rests on this card -->
<Popup
  {open}
  heading="Alla poster"
  surface="dashboard"
  width="min(560px, 92%)"
  onclose={close}
  bind:dialog={popup}
  data-all-entries
>
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
</Popup>

<style>
  /* === Layout === */

  .more {
    justify-self: start;
  }

  ol {
    --gap-hit: 10px; /* its hover strip, overlapping the rows a little so a thin gap is still easy to land on */
    --gap-open: 12px; /* how much more a gap opens while hovered, half upward and half downward (0: it stays) */

    display: grid;
    gap: var(--spacing-xxs);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* A month's line: no row behind it, a little room above, the rows under it as in the recent list */
  .month {
    padding: var(--spacing-lg) var(--spacing-md) var(--spacing-xxs);
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-label);
    font-weight: var(--font-weight-bold);
  }

  .month:first-child {
    padding-top: 0;
  }

  /* A gap: --insert-rest tall between the rows, its hover strip taller and reaching over their edges, with a "+" at its
     centre and a line on each side, hidden until it is hovered */
  .gap {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
    height: var(--gap-hit);
    /* Its own room is the rows' gap, xxs; its hover strip overlaps the rows around it */
    margin: calc((var(--spacing-xxs) - var(--gap-hit)) / 2) 0;
    padding: 0 var(--spacing-md);
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
    font-size: var(--text-size-body);
    line-height: var(--leading-none);
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  /* The always-shown "+" sits in a gap always open, so nothing moves around it */
  .gap.top {
    height: calc(var(--spacing-xxs) + var(--gap-open));
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
    transform: translateY(calc(var(--gap-open) / -2));
    transition-delay: var(--peek-delay);
  }

  ol > .gap.open:hover ~ :global(li) {
    transform: translateY(calc(var(--gap-open) / 2));
    transition-delay: var(--peek-delay);
  }
</style>
