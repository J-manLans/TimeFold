<!--
  The five most recent entries under the label "Senaste", newest first, with "Visa alla" under them ("The main screen
  has a controls side and a dashboard"). The list always keeps five rows' room, so "Visa alla" never moves; with no
  entry yet, "Inga poster ännu" sits centred in that room and "Visa alla" is greyed out. A running entry heads the
  list ("A running entry is edited at its start"). An entry that stops lights its row as it arrives.
-->
<script lang="ts" module>
  /** How many entries the list shows */
  const RECENT = 5

  /** A blank row for each place in the list, to keep its room */
  const PLACES = Array.from({ length: RECENT }, (_, i) => i)
</script>

<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { listedEntries, stoppedEntries } from '$lib/modules/dashboard/entries'
  import AllEntries from './AllEntries.svelte'
  import EntryRow from './EntryRow.svelte'

  // === State ===

  let recent = $derived(app.record ? listedEntries(app.record).slice(0, RECENT) : [])
  let newestStopped = $derived(app.record ? (stoppedEntries(app.record)[0]?.id ?? null) : null)
  /** The entry that arrived at the top since the list was first shown, which lights as it appears */
  let freshId = $state<string | null>(null)
  let seen: Set<string> | null = null

  // === Logic ===

  // An entry newly stopped is fresh, one not stopped before; what the list opens with is not, nor a start
  $effect(() => {
    const ids = app.record ? stoppedEntries(app.record).map((e) => e.id) : []
    if (seen !== null && newestStopped !== null && !seen.has(newestStopped)) freshId = newestStopped
    seen = new Set(ids)
  })
</script>

<div class="entries">
  <span class="caps">Senaste</span>
  <div class="room">
    <ol class="places" aria-hidden="true">
      {#each PLACES as place (place)}
        <EntryRow />
      {/each}
    </ol>
    {#if recent.length > 0}
      <ol class="list">
        {#each recent as entry (entry.id)}
          <EntryRow {entry} fresh={entry.id === freshId} onpick={() => app.openEdit(entry.id, false)} />
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
    font-size: var(--text-size-body);
  }
</style>
