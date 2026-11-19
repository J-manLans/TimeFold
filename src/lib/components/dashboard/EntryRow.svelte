<!--
  One entry's row, as both entry lists show it: its day, its times (with a small "+1" when it stops a day later), its
  profile's letter in the profile's base colour, its added breaks as a tag, and its length worked, on a row a step darker than the
  panel. A fresh row, the entry just stopped, lights in the wheel's base colour and fades. A blank row holds a row's height with nothing in it, so a short list keeps its room:
  <EntryRow entry={e} fresh />, <EntryRow />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { entryRow } from '$lib/modules/dashboard/entries'
  import { type Entry } from '$lib/modules/shared/record'

  // === Props ===

  let {
    entry = null,
    fresh = false,
  }: {
    /** The stopped entry the row reads, or null for a blank row */
    entry?: Entry | null
    /** Whether the entry just stopped, which lights the row as it appears */
    fresh?: boolean
  } = $props()

  // === State ===

  let row = $derived(entry && app.record ? entryRow(entry, app.record) : null)
</script>

{#if row}
  <li class:fresh>
    <span>{row.day}</span>
    <span
      >{row.times}{#if row.later > 0}<sup class="later">+{row.later}</sup>{/if}</span
    >
    <span style:color={row.base}>{row.letter}</span>
    <span
      >{#if row.tag}<span class="tag">{row.tag}</span>{/if}</span
    >
    <span class="length">{row.length}</span>
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
    border-radius: var(--radius-small);
    background: var(--dashboard-row);
    font-size: var(--entry-text-size);
    font-variant-numeric: tabular-nums;
  }

  .length {
    text-align: right;
  }

  /* The added breaks: a label, which a click passes through to the row ("Time away is a gap or an added break") */
  .tag {
    padding: var(--entry-tag-padding);
    border: 1px solid var(--dashboard-line);
    border-radius: var(--entry-tag-radius);
    color: var(--dashboard-text);
    font-size: var(--entry-tag-size);
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
