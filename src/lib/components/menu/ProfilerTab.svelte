<!--
  The menu's Profiler tab ("The menu has tabs, with every value locked behind "Ändra""): the row of settings for every
  profile, then a row per profile in use, one unfolded at a time, then "Ny profil", a button that turns into the name
  field in its own place: Enter makes the profile, its colours at the largest gap, and unfolds its row; a name another
  profile has is refused with a note centred under the field in the removal red; Esc or a press outside turns it back.
  Under it, "Arkiverade" with its count folds the archived profiles away, opening as a row does, absent while none is
  ("A profile with hours is archived, one without is deleted"): <ProfilerTab />
-->
<script lang="ts">
  import { app, NEW_PROFILE } from '$lib/app.svelte'
  import { activeProfiles, addProfile, archivedProfiles } from '$lib/modules/shared/profiles'
  import ProfileRow from './ProfileRow.svelte'
  import TaxRow from './TaxRow.svelte'

  // === State ===

  const key = NEW_PROFILE
  let active = $derived(app.record ? activeProfiles(app.record) : [])
  let archived = $derived(app.record ? archivedProfiles(app.record) : [])
  let openRow = $state<string | null>(null)
  let archiveOpen = $state(false)
  let naming = $derived(app.openValue === key)
  let name = $state('')
  let refusal = $state('')
  let line: HTMLDivElement | undefined = $state()
  let newButton: HTMLButtonElement | undefined = $state()

  // === Logic ===

  // The name field opens empty, from "Ny profil" here or "Skapa ny profil" in the profile popup
  $effect(() => {
    if (naming) {
      name = ''
      refusal = ''
    }
  })

  // With nothing archived, "Arkiverade" goes, and is shut when it comes back
  $effect(() => {
    if (archived.length === 0) archiveOpen = false
  })

  // === Helpers ===

  /** "Ny profil" turned into its field */
  function openNew(): void {
    app.openValue = key
  }

  /** The field back to "Ny profil" */
  function closeNew(): void {
    if (app.openValue === key) app.openValue = null
    queueMicrotask(() => newButton?.focus())
  }

  /** Enter: the profile made and its row unfolded, or the name refused with its note */
  function make(): void {
    if (!app.record || name.trim() === '') return
    const made = addProfile(app.record, name)
    if ('refusal' in made) {
      refusal = made.refusal === 'archived' ? 'Namnet finns bland arkiverade' : 'Namnet finns redan'
      return
    }
    void app.saveSettings(made.record)
    openRow = made.id
    if (app.openValue === key) app.openValue = null
  }

  function onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      make()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeNew()
    }
  }

  /** A press outside the open field turns it back */
  function onPress(event: PointerEvent): void {
    if (naming && line && !line.contains(event.target as Node)) closeNew()
  }

  /** The first letter a capital as it is typed, the caret left where it was; a typed key clears the note */
  function onInput(event: Event & { currentTarget: HTMLInputElement }): void {
    const input = event.currentTarget
    refusal = ''
    const at = input.value.search(/\S/)
    if (at < 0 || input.value.charAt(at) === input.value.charAt(at).toUpperCase()) return
    const [a, b] = [input.selectionStart, input.selectionEnd]
    input.value = input.value.slice(0, at) + input.value.charAt(at).toUpperCase() + input.value.slice(at + 1)
    input.setSelectionRange(a, b)
    name = input.value
  }

  /** Opening one row folds any other */
  function toggle(id: string): void {
    openRow = openRow === id ? null : id
    app.openValue = null
  }

  /** Focuses the field once drawn */
  function focus(input: HTMLInputElement): void {
    queueMicrotask(() => input.focus())
  }
</script>

<svelte:window onpointerdown={onPress} />

<TaxRow />

<ul class="rows">
  {#each active as profile (profile.id)}
    <ProfileRow {profile} open={openRow === profile.id} onToggle={() => toggle(profile.id)} />
  {/each}
</ul>

<div class="new" bind:this={line}>
  {#if naming}
    <span class="field">
      <input
        type="text"
        placeholder="Namn på profil"
        aria-label="Namn på ny profil"
        bind:value={name}
        oninput={onInput}
        onkeydown={onKey}
        {@attach focus}
      />
      {#if refusal}<span class="warn">{refusal}</span>{/if}
    </span>
    <span class="keys">Enter lägger till · Esc avbryter</span>
  {:else}
    <button class="small" type="button" bind:this={newButton} onclick={openNew}>Ny profil</button>
  {/if}
</div>

{#if archived.length > 0}
  <div class="archive" class:open={archiveOpen}>
    <button class="archive-head" type="button" aria-expanded={archiveOpen} onclick={() => (archiveOpen = !archiveOpen)}>
      Arkiverade ({archived.length})<span class="chevron" aria-hidden="true">›</span>
    </button>
    <div class="wrap" inert={!archiveOpen}>
      <div class="clip">
        <ul class="rows">
          {#each archived as profile (profile.id)}
            <ProfileRow {profile} open={openRow === profile.id} onToggle={() => toggle(profile.id)} />
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}

<style>
  /* === Layout === */

  .rows {
    display: grid;
    gap: var(--menu-rows-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* The keys beside the field stay level with it while its note sits under it */
  .new {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--menu-value-gap-inline);
  }

  .field {
    display: inline-grid;
    row-gap: var(--menu-name-warn-gap);
  }

  input {
    width: var(--menu-name-width);
    padding: var(--menu-field-padding);
    border: 1px solid var(--menu-button-line);
    border-radius: var(--radius-small);
    background: var(--field-background);
    color: var(--menu-text);
    font: inherit;
  }

  /* Centred under the field, wider than it if it must be, without moving it */
  .warn {
    display: flex;
    justify-self: center;
    justify-content: center;
    width: 0;
    white-space: nowrap;
    color: var(--edit-remove);
    font-size: var(--text-size-note);
  }

  .keys {
    color: var(--menu-text-muted);
    font-size: var(--text-size-label);
  }

  .small {
    padding: var(--menu-small-padding);
    border: 1px solid var(--menu-button-line);
    border-radius: var(--radius-small);
    background: none;
    color: var(--menu-text);
    font: inherit;
    font-size: var(--text-size-small);
    cursor: pointer;
  }

  .archive {
    margin-top: var(--menu-archived-gap);
  }

  .archive-head {
    display: flex;
    align-items: center;
    gap: var(--menu-check-gap);
    width: 100%;
    padding: var(--menu-archive-head-padding);
    border: 0;
    background: none;
    color: var(--menu-text-muted);
    font: inherit;
    font-size: var(--menu-section-size);
    font-weight: var(--menu-heading-weight);
    letter-spacing: var(--menu-section-tracking);
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
  }

  .chevron {
    transition: transform var(--speed-ui) ease;
  }

  .wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--speed-ui) var(--ease-grow);
  }

  .clip {
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  .archive .rows {
    padding-top: var(--menu-rows-gap);
  }

  /* === States === */

  .archive.open .chevron {
    transform: rotate(90deg);
  }

  .archive.open .wrap {
    grid-template-rows: 1fr;
  }

  .archive.open .clip {
    opacity: 1;
  }
</style>
