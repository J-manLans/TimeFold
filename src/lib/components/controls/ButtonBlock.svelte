<!--
  The button block: "Starta jobb" or "Stoppa jobb" over "Exportera" and "Importera", with the profile button beside
  both ("One start/stop button and a profile list"). While the profile on screen runs, a ring in its over colour
  surrounds the start button; the profile button's letter wears where the profile stands, its over colour past its line
  and its base before it. Export and import are greyed out until Handover.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from '$lib/components/shared/Disc.svelte'

  // === State ===

  let profile = $derived(app.record?.profiles.find((p) => p.id === app.onScreen))
  let mine = $derived(app.running !== null && app.running.profile === app.onScreen)
</script>

<div class="block">
  <button class="start" class:running={mine} type="button" onclick={() => app.press()}>
    <span class="label">{mine ? 'Stoppa jobb' : 'Starta jobb'}</span>
  </button>

  <div class="pair">
    <!-- TODO: export and import work in Handover; until then greyed out -->
    <button type="button" disabled>Exportera</button>
    <button type="button" disabled>Importera</button>
  </div>

  <!-- TODO: opens the profile popup (Profiles); until then a click does nothing -->
  <button class="profile" type="button" aria-label="Byt profil">
    <Disc size="var(--profile-disc-size)" dent="var(--profile-disc-dent)" light="var(--glow-profile-disc)">
      <span class="letter">{profile?.name.charAt(0).toUpperCase()}</span>
    </Disc>
  </button>
</div>

<style>
  /* === Layout === */

  .block {
    display: grid;
    grid-template-columns: var(--start-width) var(--profile-button-width);
    grid-template-rows: var(--start-height) var(--pair-height);
    grid-template-areas:
      'start profile'
      'pair profile';
    gap: var(--block-gap);
  }

  button {
    background-attachment: fixed;
    border: 0;
    border-radius: var(--radius-button);
    background-color: var(--button-background);
    color: var(--button-text);
    box-shadow: var(--shadow-button);
    font: inherit;
    cursor: pointer;
    transition:
      background-color var(--speed-ui) ease,
      box-shadow var(--speed-ui) ease,
      opacity var(--speed-ui) ease;
  }

  .start {
    grid-area: start;
  }

  .label {
    font-family: var(--font-display);
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    font-size: var(--start-text-size);
    letter-spacing: var(--start-tracking);
    text-transform: uppercase;
    line-height: 1;
  }

  .pair {
    grid-area: pair;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--block-gap);
  }

  .pair button {
    font-size: var(--pair-text-size);
    font-weight: var(--pair-font-weight);
  }

  .profile {
    grid-area: profile;
    display: grid;
    place-items: center;
  }

  .letter {
    font-family: var(--font-display);
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    font-size: var(--profile-letter-size);
    line-height: 1;
    color: var(--profile-state);
  }

  /* === States === */

  /* A button that can be used catches the pointer light; pressed, the press shade lies on top of it */
  button:not(:disabled) {
    background-image: var(--pointer-light);
  }

  button:not(:disabled):hover {
    background-color: var(--button-background-hover);
  }

  button:not(:disabled):active {
    background-image: linear-gradient(180deg, var(--button-press-shade), transparent 70%), var(--pointer-light);
    background-attachment: scroll, fixed;
    box-shadow: none;
  }

  button:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }

  .start.running {
    box-shadow: 0 0 0 var(--start-ring-width) var(--profile-over);
  }
</style>
