<!--
  The profile popup ("One start/stop button and a profile list"): centred on the controls side over a scrim, it lists
  the profiles in use, each with its small circle wearing where it stands, the profile on screen marked, and the one
  running followed by a dot. Picking one puts it on screen; a running entry goes on. With only one profile in use it
  holds "Skapa ny profil" alone, which opens the menu on Profiler with the name field ready. A click on the scrim or Esc
  closes it, picking nothing. Opened through `app.profilesOpen`: <ProfilePopup />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { standsOver } from '$lib/modules/dashboard/figures'
  import { neonColour } from '$lib/modules/shared/colours'
  import { localDay } from '$lib/modules/shared/counting'
  import { popupClosed, popupOpened, type Input } from '$lib/modules/shared/focusRing'
  import { activeProfiles } from '$lib/modules/shared/profiles'
  import type { Profile } from '$lib/modules/shared/record'

  // === State ===

  let profiles = $derived(app.record ? activeProfiles(app.record) : [])
  let list: HTMLElement | undefined = $state()
  /** How it was opened, for the focus ring when it closes, and whether it was open */
  let openedBy: Input = null
  let wasOpen = false

  // === Logic ===

  // Opened, the focus lands on the profile on screen, or on "Skapa ny profil"; closed, it goes back as any popup's does
  $effect(() => {
    const isOpen = app.profilesOpen
    if (isOpen && !wasOpen) {
      openedBy = popupOpened()
      queueMicrotask(() => list?.querySelector<HTMLElement>('[aria-current="true"], button')?.focus())
    }
    if (!isOpen && wasOpen) popupClosed(openedBy)
    wasOpen = isOpen
  })

  // === Helpers ===

  /** A profile's circle: its letter in the neon past its line and the base before it, its ring in the other */
  function circle(profile: Profile): { letter: string; ring: string } {
    const over = app.record !== null && standsOver(app.record, profile.id, localDay(Date.now()))
    const neon = neonColour(profile.hue)
    return over ? { letter: neon, ring: profile.base } : { letter: profile.base, ring: neon }
  }

  /** Esc closes the popup, picking nothing */
  function onKey(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !app.profilesOpen) return
    event.stopPropagation()
    app.profilesOpen = false
  }

  /** A press outside the popup, on the scrim, closes it, picking nothing */
  function onPress(event: PointerEvent): void {
    if (app.profilesOpen && list && !list.contains(event.target as Node)) app.profilesOpen = false
  }
</script>

<svelte:window onkeydown={onKey} onpointerdown={onPress} />

{#if app.profilesOpen}
  <div class="scrim">
    <div
      class="popup"
      data-surface="popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiles-heading"
      bind:this={list}
    >
      <h3 class="caps" id="profiles-heading">Profil</h3>
      {#if profiles.length < 2}
        <button type="button" onclick={() => app.askNewProfile()}>Skapa ny profil</button>
      {:else}
        {#each profiles as profile (profile.id)}
          {@const colours = circle(profile)}
          <button type="button" aria-current={profile.id === app.onScreen} onclick={() => app.pickProfile(profile.id)}>
            <span class="circle" style:color={colours.letter} style:border-color={colours.ring}>
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <span class="name">{profile.name}</span>{#if app.running?.profile === profile.id}<span
                class="runs"
                aria-label="pågår">●</span
              >{/if}
          </button>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  /* === Layout === */

  .scrim {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: grid;
    place-items: center;
    background: var(--scrim);
  }

  /* One column that may shrink to the popup's greatest width, so a long name is cut rather than widening it */
  .popup {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-xs);
    min-width: 220px; /* wide enough for a name, before it is cut */
    padding: var(--spacing-md);
    border: 1px solid var(--button-line);
    border-radius: var(--radius-lg);
    background: var(--popup-background);
    color: var(--popup-text);
  }

  h3 {
    margin: var(--spacing-xs) var(--spacing-md) var(--spacing-sm);
  }

  button {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: 0;
    border-radius: var(--radius-md);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  /* A long name is cut with "…"; the popup never grows past the controls side */
  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .popup {
    max-width: 300px; /* a long profile name is cut with "…" past it */
  }

  .circle {
    flex: none;
    display: grid;
    place-items: center;
    width: var(--mini-disc-size);
    height: var(--mini-disc-size);
    border: var(--mini-disc-ring) solid;
    border-radius: var(--radius-full);
    font-size: var(--text-size-label);
    font-weight: var(--font-weight-semibold);
    text-box: trim-both cap alphabetic;
  }

  /* === States === */

  button:hover,
  button[aria-current='true'] {
    background: var(--popup-pick);
  }
</style>
