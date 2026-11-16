<script lang="ts">
  import { onMount } from 'svelte'
  import { app } from '$lib/app.svelte'
  import Controls from '$lib/components/controls/Controls.svelte'
  import Dashboard from '$lib/components/dashboard/Dashboard.svelte'

  onMount(() => {
    void app.load()
  })
</script>

{#if app.phase === 'ready'}
  <main class="screen">
    <Controls />
    <Dashboard />
  </main>
{/if}

<style>
  /* === Layout === */

  .screen {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    min-height: 100vh;
  }

  /* A narrow window stacks the dashboard over the controls (Dashboard.svelte); CSS cannot read a token here */
  @media (max-width: 640px) {
    .screen {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
