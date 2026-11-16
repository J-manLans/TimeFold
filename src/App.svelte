<script lang="ts">
  import { onMount } from 'svelte'
  import { app } from '$lib/app.svelte'
  import Controls from '$lib/components/controls/Controls.svelte'
  import Dashboard from '$lib/components/dashboard/Dashboard.svelte'
  import { overColour } from '$lib/modules/colours'
  import { localDay } from '$lib/modules/counting'
  import { standsOver } from '$lib/modules/figures'

  // Where the profile on screen stands, as a colour: its over colour past its line, its base before it. The profile
  // letter and every focus ring wear it
  let stateColour = $derived.by(() => {
    const record = app.record
    const profile = record?.profiles.find((p) => p.id === app.onScreen)
    if (!record || !profile) return undefined
    return standsOver(record, profile.id, localDay(Date.now())) ? overColour(profile.hue) : profile.base
  })

  onMount(() => {
    void app.load()
  })
</script>

{#if app.phase === 'ready'}
  <main class="screen" style:--profile-state={stateColour}>
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
