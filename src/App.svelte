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

  /** The dashboard's width side by side, and the least room each side of the button block, from the tokens */
  let dashboardWidth = $state(0)
  let blockRoom = $state(0)
  let windowWidth = $state(0)
  let blockWidth = $state(0)

  onMount(() => {
    const tokens = getComputedStyle(document.documentElement)
    dashboardWidth = parseFloat(tokens.getPropertyValue('--dashboard-width'))
    blockRoom = parseFloat(tokens.getPropertyValue('--controls-block-room'))
    void app.load()
  })

  // The sides stack once the controls, beside the dashboard, would be narrower than the button block with its room on
  // both sides. Judged by the window, not by the layout it gives, so it never flips back and forth at the edge
  $effect(() => {
    if (blockWidth) app.showStacked(windowWidth - dashboardWidth < blockWidth + 2 * blockRoom)
  })
</script>

<svelte:window bind:innerWidth={windowWidth} />

<!-- The main screen, also behind the locked panel of the onboarding and the recovery; it takes no input in their
     endings -->
{#if app.phase !== 'loading'}
  <main class="screen" style:--profile-state={stateColour} inert={app.panel?.ending ?? false}>
    <Controls bind:blockWidth />
    <Dashboard />
    <EditPopup />
  </main>
{/if}

<style>
  /* === Layout === */

  /* Side by side, exactly the window's height: each side fills it, and nothing outside a part scrolls */
  .screen {
    display: grid;
    /* The dashboard keeps its width; the controls take the rest */
    grid-template-columns: minmax(0, 1fr) var(--dashboard-width);
    height: 100vh;
  }

  /* Stacked, the dashboard over the controls (Dashboard.svelte): each side takes its own height and the two scroll
     together as one page, only once they no longer fit the window */
  :global(:where(:root[data-stacked])) .screen {
    grid-template-columns: minmax(0, 1fr);
    height: auto;
    min-height: 100vh;
  }
</style>
