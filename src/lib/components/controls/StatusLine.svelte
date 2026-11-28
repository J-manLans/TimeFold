<!--
  The status line under the button block: what runs and since when, such as "● Vaktmästare pågår sedan 07:58"
  ("The main screen has a controls side and a dashboard"), with today's pie right of it. It keeps its room when nothing
  runs, so nothing below moves.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { timeOfDay } from '$lib/modules/shared/counting'
  import TodayPie from './TodayPie.svelte'

  // === State ===

  let running = $derived(app.running)
  let profile = $derived(app.record?.profiles.find((p) => p.id === running?.profile))
</script>

<p class="status">
  {#if running && profile}
    <span><span class="dot">●</span> {profile.name} pågår sedan {timeOfDay(running.start)}</span>
  {/if}
  <TodayPie />
</p>

<style>
  /* === Layout === */

  /* The text and today's pie are one row, centred together; it keeps the pie's room, so nothing moves when it shows */
  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    margin: 0;
    height: max(var(--status-height), var(--pie-size));
    line-height: var(--status-height);
    font-size: var(--text-size-label);
    color: var(--controls-text-muted);
  }

  .dot {
    color: var(--profile-neon);
  }
</style>
