<!--
  The button block: "Starta jobb" or "Stoppa jobb" over "Exportera" and "Importera", with the profile button beside
  both ("One start/stop button and a profile list"). While the profile on screen runs, a ring in its neon
  surrounds the start button; while another profile runs, the tip over the start button says what pressing it will
  stop ("stoppar Utveckling"), edged in that profile's neon. The profile button opens the profile popup; its letter
  wears where the profile stands, its neon past its line and its base before it. Export and import are greyed out
  until Handover.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from '$lib/components/shared/Disc.svelte'
  import { neonColour } from '$lib/modules/shared/colours'
  import TipLabel from './TipLabel.svelte'

  // === State ===

  let profile = $derived(app.record?.profiles.find((p) => p.id === app.onScreen))
  let mine = $derived(app.running !== null && app.running.profile === app.onScreen)
  /** The profile another entry runs on, which pressing start will stop, or none */
  let other = $derived(
    app.running !== null && !mine ? app.record?.profiles.find((p) => p.id === app.running?.profile) : undefined,
  )
  let start: HTMLButtonElement | undefined = $state()
  let point = $state<{ x: number; y: number } | null>(null)
  let focused = $state(false)

  // === Helpers ===

  /** The tip follows the pointer over the start button, but not a finger */
  function follow(event: PointerEvent): void {
    if (event.pointerType !== 'touch') point = { x: event.clientX, y: event.clientY }
  }
</script>

<div class="block">
  <button
    class="start plastic"
    class:running={mine}
    type="button"
    bind:this={start}
    onclick={() => app.press()}
    onpointerenter={follow}
    onpointermove={follow}
    onpointerleave={() => (point = null)}
    onfocus={() => (focused = start?.matches(':focus-visible') ?? false)}
    onblur={() => (focused = false)}
  >
    <span class="label">{mine ? 'Stoppa jobb' : 'Starta jobb'}</span>
  </button>
  <TipLabel
    text={other ? `stoppar ${other.name}` : ''}
    {point}
    anchor={focused ? (start ?? null) : null}
    colour={other ? neonColour(other.hue) : undefined}
  />

  <div class="pair">
    <!-- TODO: export and import work in Handover; until then greyed out -->
    <button class="plastic" type="button" disabled>Exportera</button>
    <button class="plastic" type="button" disabled>Importera</button>
  </div>

  <button class="profile plastic" type="button" aria-label="Byt profil" onclick={() => (app.profilesOpen = true)}>
    <Disc size="42px" dent="6px" light="0.7">
      <span class="letter" class:waiting={app.phase === 'welcome' && app.panel !== null && !app.panel.letter}>
        {profile?.name.charAt(0).toUpperCase()}
      </span>
    </Disc>
  </button>
</div>

<style>
  /* === Layout === */

  .block {
    display: grid;
    grid-template-columns: 214px 76px; /* "Starta jobb"'s width, the profile button's */
    grid-template-rows: var(--start-height) 34px; /* "Exportera" and "Importera" */
    grid-template-areas:
      'start profile'
      'pair profile';
    gap: var(--spacing-md);
  }

  .start {
    grid-area: start;
  }

  .label {
    font-family: var(--font-display);
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    font-size: var(--text-size-display-md);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    line-height: var(--leading-none);
  }

  .pair {
    grid-area: pair;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .pair button {
    font-size: var(--text-size-body);
    font-weight: var(--font-weight-semibold);
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
    font-size: var(--text-size-display-sm);
    line-height: var(--leading-none);
    /* Trimmed to the capital, so centring the box centres the letter itself */
    text-box: trim-both cap alphabetic;
    color: var(--profile-state);
  }

  /* === States === */

  /* At the first start the letter waits, and arrives last, slowly ("A first install starts fresh or imports") */
  .letter {
    transition: opacity var(--onboarding-letter-fade) ease;
  }

  .letter.waiting {
    opacity: 0;
  }

  .start.running {
    box-shadow: 0 0 0 2px var(--profile-neon); /* in the profile's colour while it runs */
  }
</style>
