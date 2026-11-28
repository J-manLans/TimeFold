<!--
  One entry's row, as both entry lists show it: its day, its times (with a small "+1" when it stops a day later), its
  profile's letter in the profile's base colour, its tags (its break, and "e" when it was set by hand), and its length
  worked, on a row a step darker than the panel. A running entry's row shows its start alone and "--:--", all in its
  profile's neon. A fresh row, the entry just stopped, lights in the wheel's base colour and fades. The row opens its
  entry in the edit popup ("Editing an entry on its line"), a step lighter on hover; the one being edited from "Visa
  alla" is outlined, and there each row with a reason shows it under itself. A blank row holds a row's height with
  nothing in it, so a short list keeps its room: <EntryRow entry={e} fresh onpick={…} />, <EntryRow />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { entryRow } from '$lib/modules/dashboard/entries'
  import { type Entry } from '$lib/modules/shared/record'

  // === Props ===

  let {
    entry = null,
    fresh = false,
    picked = false,
    withReason = false,
    onpick,
  }: {
    /** The entry the row reads, or null for a blank row */
    entry?: Entry | null
    /** Whether the entry just stopped, which lights the row as it appears */
    fresh?: boolean
    /** Whether the entry is open in the edit popup, which outlines the row */
    picked?: boolean
    /** Whether the row shows its reason under itself, as "Visa alla" does */
    withReason?: boolean
    /** What a click on the row does: opens its entry in the edit popup */
    onpick?: () => void
  } = $props()

  // === State ===

  let row = $derived(entry && app.record ? entryRow(entry, app.record) : null)
</script>

{#if row}
  <!-- The row is the button itself, so the list keeps its grid -->
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <li
    class:fresh
    class:picked
    data-entry={entry?.id}
    role="button"
    tabindex="0"
    style:color={row.running ? row.neon : undefined}
    onclick={() => onpick?.()}
    onkeydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onpick?.()
      }
    }}
  >
    <span>{row.day}</span>
    <span
      >{row.times}{#if row.later > 0}<sup class="later">+{row.later}</sup>{/if}</span
    >
    <span style:color={row.running ? row.neon : row.base}>{row.letter}</span>
    <span class="tags"
      >{#if row.tag}<span class="tag">{row.tag}</span>{/if}{#if row.edited}<span class="tag">e</span>{/if}</span
    >
    <span class="length">{row.length}</span>
    {#if withReason && row.reason}<span class="reason">{row.reason}</span>{/if}
  </li>
{:else}
  <li class="blank" aria-hidden="true"><span>&nbsp;</span></li>
{/if}

<style>
  /* === Layout === */

  li {
    display: grid;
    grid-template-columns: var(--entry-columns);
    gap: var(--entry-cell-gap);
    align-items: center;
    padding: var(--entry-padding);
    border-radius: var(--radius-md);
    background: var(--dashboard-row);
    font-size: var(--text-size-body);
    font-variant-numeric: tabular-nums;
  }

  .length {
    text-align: right;
  }

  .tags {
    display: flex;
    gap: var(--entry-tag-gap);
    justify-self: start;
  }

  /* Its reason, under the row in "Visa alla": "ändrad: Glömd paus" */
  .reason {
    grid-column: 1 / -1;
    margin-top: var(--entry-reason-lift);
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-label);
  }

  .later {
    margin-left: var(--entry-later-gap);
    font-size: var(--entry-later-size);
    line-height: 0;
    color: var(--dashboard-text-muted);
    vertical-align: super;
  }

  /* === States === */

  .blank {
    visibility: hidden;
  }

  /* A row opens its entry: a step lighter on hover, a hand pointer; the one being edited outlined */
  li[role='button'] {
    cursor: pointer;
    /* transform too: "Visa alla" slides its rows as a gap opens, and this rule would otherwise replace that */
    transition:
      background-color var(--speed-ui) ease,
      transform var(--speed-ui) ease;
  }

  li[role='button']:hover,
  li[role='button']:focus-visible {
    outline: none;
    background: color-mix(in srgb, var(--dashboard-row), var(--dashboard-text) var(--entry-hover));
  }

  .picked {
    box-shadow: inset 0 0 0 1px var(--dashboard-text-muted);
  }

  .fresh {
    animation: flash var(--entry-flash) ease-out;
  }

  @keyframes flash {
    from {
      background: color-mix(in srgb, var(--wheel-base) var(--entry-flash-strength), var(--dashboard-row));
    }

    to {
      background: var(--dashboard-row);
    }
  }
</style>
