<!--
  The theme button beside the menu's heading, and the label naming the theme in force ("A light or dark theme,
  following the system"): a small disc in its dent, with a half-filled circle for System, a sun for Ljust and a moon
  for Mörkt. Each click moves to the next theme and saves it.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from '$lib/components/shared/Disc.svelte'
  import { themeName } from '$lib/modules/settings'

  // === State ===

  let name = $derived(themeName(app.theme))

  // The sun's eight rays, as line ends around its centre
  const RAYS = Array.from({ length: 8 }, (_, k) => {
    const angle = (k * Math.PI) / 4
    return {
      x1: 12 + 7 * Math.cos(angle),
      y1: 12 + 7 * Math.sin(angle),
      x2: 12 + 9.5 * Math.cos(angle),
      y2: 12 + 9.5 * Math.sin(angle),
    }
  })
</script>

<button class="theme" type="button" aria-label="Tema: {name}. Klicka för nästa." onclick={() => app.cycleTheme()}>
  <Disc size="var(--small-disc-size)" dent="var(--small-disc-dent)">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      {#if app.theme === 'light'}
        <circle cx="12" cy="12" r="4" />
        {#each RAYS as ray, k (k)}
          <line {...ray} />
        {/each}
      {:else if app.theme === 'dark'}
        <path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.4A7 7 0 0 1 15.5 3.5z" />
      {:else}
        <circle cx="12" cy="12" r="8" />
        <path class="filled" d="M12 4a8 8 0 0 1 0 16z" />
      {/if}
    </svg>
  </Disc>
</button>
<span class="name">{name}</span>

<style>
  /* === Layout === */

  .theme {
    display: grid;
    place-items: center;
    width: var(--button-icon-size);
    height: var(--button-icon-size);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--button-text);
    cursor: pointer;
  }

  .icon {
    position: relative;
    width: var(--theme-icon-size);
    height: var(--theme-icon-size);
    fill: none;
    stroke: currentColor;
    stroke-width: var(--theme-icon-stroke);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .filled {
    fill: currentColor;
    stroke: none;
  }

  .name {
    font-size: var(--text-size-note);
    color: var(--menu-text-muted);
  }
</style>
