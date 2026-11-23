<script lang="ts">
  import { onMount } from 'svelte'
  import { app } from '$lib/app.svelte'
  import Controls from '$lib/components/controls/Controls.svelte'
  import Dashboard from '$lib/components/dashboard/Dashboard.svelte'
  import EditPopup from '$lib/components/edit/EditPopup.svelte'
  import { neonColour } from '$lib/modules/shared/colours'
  import { localDay } from '$lib/modules/shared/counting'
  import { standsOver } from '$lib/modules/dashboard/figures'

  // Where the profile on screen stands, as a colour: its neon past its line, its base before it. The profile
  // letter and every focus ring wear it
  let stateColour = $derived.by(() => {
    const record = app.record
    const profile = record?.profiles.find((p) => p.id === app.onScreen)
    if (!record || !profile) return undefined
    return standsOver(record, profile.id, localDay(Date.now())) ? neonColour(profile.hue) : profile.base
  })

  onMount(() => {
    void app.load()
  })
</script>

<!-- The main screen, also behind the locked panel of the onboarding and the recovery; it takes no input in their
     endings -->
{#if app.phase !== 'loading'}
  <main class="screen" style:--profile-state={stateColour} inert={app.panel?.ending ?? false}>
    <Controls />
    <Dashboard />
    <EditPopup />
  </main>
{/if}

<style>
  /* === Layout === */

  .screen {
    display: grid;
    /* 3 : 2, the dashboard stopping at its launch width */
    grid-template-columns: minmax(0, 1fr) minmax(0, min(40%, var(--dashboard-max-width)));
    min-height: 100vh;
  }

  /* A narrow window stacks the dashboard over the controls (Dashboard.svelte); CSS cannot read a token here */
  @media (max-width: 640px) {
    .screen {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
