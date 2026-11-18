<!--
  The theme button beside the menu's heading, and the label naming the theme in force ("A light or dark theme,
  following the system"): a small disc in its dent, with a sun for Ljust and a moon for Mörkt, the theme in force
  whether chosen or followed from the computer. Each click switches to the other and saves it.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from '$lib/components/shared/Disc.svelte'
  import { themeName } from '$lib/modules/menu/settings'

  // === State ===

  let name = $derived(themeName(app.shownTheme))

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

<button class="theme" type="button" aria-label="Tema: {name}. Klicka för att byta." onclick={() => app.switchTheme()}>
  <Disc size="var(--small-disc-size)" dent="var(--small-disc-dent)" light="1">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      {#if app.shownTheme === 'light'}
        <circle cx="12" cy="12" r="4" />
        {#each RAYS as ray, k (k)}
          <line {...ray} />
        {/each}
      {:else}
        <path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.4A7 7 0 0 1 15.5 3.5z" />
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

  .name {
    font-size: var(--text-size-note);
    color: var(--menu-text-muted);
  }
</style>
