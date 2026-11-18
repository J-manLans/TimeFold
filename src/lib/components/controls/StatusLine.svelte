<!--
  The status line under the button block: what runs and since when, such as "● Vaktmästare pågår sedan 07:58"
  ("The main screen has a controls side and a dashboard"). It keeps its room when nothing runs, so nothing below moves.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { timeOfDay } from '$lib/modules/shared/counting'

  // === State ===

  let running = $derived(app.running)
  let profile = $derived(app.record?.profiles.find((p) => p.id === running?.profile))
</script>

<p class="status">
  {#if running && profile}
    <span class="dot">●</span> {profile.name} pågår sedan {timeOfDay(running.start)}
  {/if}
</p>

<style>
  /* === Layout === */

  .status {
    margin: 0;
    height: var(--status-height);
    line-height: var(--status-height);
    font-size: var(--text-size-note);
    color: var(--controls-text-muted);
  }

  .dot {
    color: var(--profile-over);
  }
</style>
