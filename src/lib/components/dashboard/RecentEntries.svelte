<!--
  The five most recent entries under the label "Senaste", newest first, with "Visa alla" under them ("The main screen
  has a controls side and a dashboard"). The list always keeps five rows' room, so "Visa alla" never moves; with no
  entry yet, "Inga poster ännu" sits centred in that room and "Visa alla" is greyed out. An entry that stops lights
  its row as it arrives; one that runs is left out until it stops.
-->
<script lang="ts" module>
  /** How many entries the list shows */
  const RECENT = 5

  /** A blank row for each place in the list, to keep its room */
  const PLACES = Array.from({ length: RECENT }, (_, i) => i)
</script>

<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { stoppedEntries } from '$lib/modules/entries'
  import AllEntries from './AllEntries.svelte'
  import EntryRow from './EntryRow.svelte'

  // === State ===

  let recent = $derived(app.record ? stoppedEntries(app.record).slice(0, RECENT) : [])
  /** The entry that arrived at the top since the list was first shown, which lights as it appears */
  let freshId = $state<string | null>(null)
  let seen: Set<string> | null = null

  // === Logic ===

  // A new entry at the top, one not seen before, is fresh; what the list opens with is not
  $effect(() => {
    const ids = recent.map((e) => e.id)
    if (seen !== null && ids.length > 0 && !seen.has(ids[0])) freshId = ids[0]
    seen = new Set(ids)
  })
</script>

<div class="entries">
  <span class="label">Senaste</span>
  <div class="room">
    <ol class="places" aria-hidden="true">
      {#each PLACES as place (place)}
        <EntryRow />
      {/each}
    </ol>
    {#if recent.length > 0}
      <ol class="list">
        {#each recent as entry (entry.id)}
          <EntryRow {entry} fresh={entry.id === freshId} />
        {/each}
      </ol>
    {:else}
      <p class="empty">Inga poster ännu</p>
    {/if}
  </div>
  <AllEntries disabled={recent.length === 0} />
</div>

<style>
  /* === Layout === */

  .entries {
    display: grid;
    gap: var(--dashboard-inner-gap);
  }

  .label {
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-note);
    letter-spacing: var(--dashboard-label-tracking);
    text-transform: uppercase;
  }

  /* The blank rows and the list share one place, so the room is five rows high whatever the list holds */
  .room {
    display: grid;
  }

  .room > * {
    grid-area: 1 / 1;
  }

  ol {
    display: grid;
    align-content: start;
    gap: var(--entry-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .empty {
    align-self: center;
    justify-self: center;
    margin: 0;
    color: var(--dashboard-text-muted);
    font-size: var(--entry-text-size);
  }
</style>
