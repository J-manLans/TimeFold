<script lang="ts">
  import { onMount } from 'svelte'
  import { app } from '$lib/app.svelte'
  import Controls from '$lib/components/controls/Controls.svelte'

  onMount(() => {
    void app.load()
  })
</script>

{#if app.phase === 'ready'}
  <main class="screen">
    <Controls />
    <!-- TODO: the dashboard, in its own component -->
    <section class="dashboard" aria-label="Översikt"></section>
  </main>
{/if}

<style>
  /* === Layout === */

  .screen {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    min-height: 100vh;
  }

  .dashboard {
    background: var(--dashboard-background);
  }

  /* A narrow window stacks the dashboard over the controls; CSS cannot read a token here */
  @media (max-width: 640px) {
    .screen {
      grid-template-columns: minmax(0, 1fr);
    }

    .dashboard {
      order: -1;
      min-height: 50vh;
    }
  }
</style>
