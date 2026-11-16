<!--
  The controls side: what the owner presses ("The main screen has a controls side and a dashboard"). From the top: the
  menu button's row, then centred the button block, the status line and the pause row with the undo, and at the bottom
  the prune line's room. The menu lies over it all, folded into its button until opened.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Menu from '$lib/components/menu/Menu.svelte'
  import { overColour } from '$lib/modules/colours'
  import ButtonBlock from './ButtonBlock.svelte'
  import PruneLine from './PruneLine.svelte'
  import StatusLine from './StatusLine.svelte'
  import UndoButton from './UndoButton.svelte'

  // === State ===

  // The profile on screen's accent, for its letter, the start ring, the status mark and the undo's afterglow
  let profile = $derived(app.record?.profiles.find((p) => p.id === app.onScreen))
  let over = $derived(profile ? overColour(profile.hue) : undefined)
  let menuOpen = $state(false)
</script>

<section class="controls" aria-label="Kontroller" style:--profile-over={over}>
  <!-- The menu lies over the whole side; the top row keeps the room its folded button sits in -->
  <div class="top"></div>

  <div class="centre">
    <ButtonBlock />
    <StatusLine />
    <div class="pause-row">
      <!-- TODO: "Lägg till paus" works in Phase 2 -->
      <button class="pause" type="button" disabled>Lägg till paus</button>
      <UndoButton />
    </div>
  </div>

  <PruneLine />

  <Menu bind:open={menuOpen} />
</section>

<style>
  /* === Layout === */

  .controls {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-rows: var(--controls-top-height) 1fr auto;
    background: var(--controls-background);
    color: var(--controls-text);
  }

  .centre {
    display: grid;
    place-content: center;
    justify-items: center;
    gap: var(--controls-gap);
  }

  .pause-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--pause-row-gap);
    height: var(--pause-row-height);
  }

  .pause {
    height: var(--pause-height);
    padding: var(--pause-padding);
    border: 0;
    border-radius: var(--radius-button);
    background: var(--button-background);
    color: var(--button-text);
    box-shadow: var(--shadow-button);
    font: inherit;
    font-size: var(--pause-text-size);
    font-weight: var(--pause-font-weight);
  }

  /* === States === */

  .pause:disabled {
    opacity: var(--opacity-disabled);
  }
</style>
