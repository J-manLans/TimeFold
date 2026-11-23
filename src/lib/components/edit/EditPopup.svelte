<!--
  The edit popup ("Editing an entry on its line"): an entry chosen from a list, or a gap of "Visa alla" for a
  forgotten entry, edited on its line in a popup of its own, centred. From "Senaste" it sits over the dimmed screen;
  from "Visa alla" on top of the list, which dims a little further. Resting the pointer on the list behind is a peek:
  after a moment the edit fades and the extra dimming lifts. Under the day and the profile, the result reads in words;
  under the line, the reason; "Spara" waits for one. "Avbryt", Esc or a click outside cancels, nothing saved. Opened
  and closed through `app.editing`: <EditPopup />
-->
<script lang="ts">
  import { untrack } from 'svelte'
  import { app } from '$lib/app.svelte'
  import EditLine from './EditLine.svelte'
  import ReasonPicker from './ReasonPicker.svelte'
  import { canSave, lineForEntry, lineForGap, resultWords } from '$lib/modules/edit/edit'
  import { atLimit, pickProfile, type LineState } from '$lib/modules/edit/line'
  import { localDay } from '$lib/modules/shared/counting'
  import { dayInWords } from '$lib/modules/shared/dates'
  import { durationText } from '$lib/modules/shared/timeInput'

  // === State ===

  let popup: HTMLDialogElement | undefined = $state()
  // Raw: every move returns a whole new state, so nothing inside it needs watching
  let line = $state.raw<LineState | null>(null)
  let reason = $state('')
  let peek = $state(false)
  let peeking: ReturnType<typeof setTimeout> | null = null
  /** Whether the last press began outside the card, so only a click begun there closes the popup */
  let pressedOutside = false

  let profiles = $derived(app.record?.profiles ?? [])
  let words = $derived(line ? resultWords(line, profiles) : [])
  let warn = $derived(line ? atLimit(line) : false)
  let day = $derived.by(() => {
    if (!line) return ''
    const at = line.isNew && line.placing ? line.view.to : line.isNew ? line.start : line.entry.start
    return dayInWords(localDay(at))
  })

  // === Logic ===

  // The popup opens on what `app.editing` names, read once from the record and now, and closes when it is cleared
  $effect(() => {
    const opened = app.editing
    untrack(() => {
      if (opened && app.record && popup) {
        const now = Date.now()
        line = opened.entryId
          ? lineForEntry(app.record, opened.entryId, now)
          : opened.gap
            ? lineForGap(app.record, opened.gap, app.onScreen, now)
            : null
        reason = ''
        peek = false
        if (line && !popup.open) popup.showModal()
      } else {
        line = null
        if (popup?.open) popup.close()
      }
    })
  })

  // === Helpers ===

  /** The pointer over the popup: resting on the list behind, outside the card, fades the edit after a moment */
  function moved(event: PointerEvent): void {
    const behind = event.target === popup && app.editing?.stacked === true
    if (!behind) {
      rest()
      return
    }
    if (peek || peeking) return
    peeking = setTimeout(
      () => {
        peeking = null
        peek = true
      },
      app.still ? 0 : peekDelay(),
    )
  }

  /** The pointer back on the edit, or gone: the edit shows again */
  function rest(): void {
    if (peeking) clearTimeout(peeking)
    peeking = null
    peek = false
  }

  /** A press: whether it began outside the card */
  function pressed(event: PointerEvent): void {
    pressedOutside = event.target === popup
  }

  /** A click outside the card, begun there too, cancels the edit, as any popup closes */
  function clicked(event: MouseEvent): void {
    if (event.target === popup && pressedOutside) popup?.close()
    pressedOutside = false
  }

  /** The popup closed, by any way: the edit is over. Used by the dialog's close */
  function closed(): void {
    rest()
    if (app.editing) app.closeEdit()
  }

  /** A profile picked: it fills a gap, or moves the whole entry; the picker then names what is in colour */
  function picked(event: Event & { currentTarget: HTMLSelectElement }): void {
    if (!line) return
    line = pickProfile(line, event.currentTarget.value)
    event.currentTarget.value = line.fill ?? line.profile
  }

  /** "Spara": what the line shows goes into the record */
  function save(): void {
    if (line && canSave(line, reason)) void app.saveEdit(line, reason)
  }

  /** The peek's wait, from the tokens. Used by `moved` */
  function peekDelay(): number {
    return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--peek-delay')) || 0.25) * 1000
  }
</script>

<dialog
  bind:this={popup}
  aria-label="Ändra posten"
  class:stacked={app.editing?.stacked}
  class:peek
  onpointermove={moved}
  onpointerleave={rest}
  onpointerdown={pressed}
  onclick={clicked}
  onclose={closed}
>
  {#if line}
    <div class="card">
      <div class="head">
        <span>{day}</span>
        <select aria-label="Profil" value={line.fill ?? line.profile} onchange={picked}>
          {#each profiles as profile (profile.id)}
            <option value={profile.id}>{profile.name}</option>
          {/each}
        </select>
      </div>

      <div class="words">
        {#if line.placing}
          <span>Klicka där posten ska ligga</span>
        {:else}
          {#each words as word, i (i)}
            {#if i > 0}<span class="dot"> · </span>{/if}
            <span class:grey={word.kind === 'grey'}
              ><b class:changed={word.bold} style:color={word.kind === 'fill' ? word.colour : undefined}>{word.times}</b
              >{#if word.tag !== null}<span
                  class="tag"
                  class:warn={warn && word.kind === 'own'}
                  class:still={word.kind === 'grey'}>paus {durationText(word.tag)}</span
                >{/if}</span
            >
          {/each}
        {/if}
      </div>

      <EditLine bind:line {profiles} />

      {#key app.editing}
        <ReasonPicker bind:reason />
      {/key}

      <div class="actions">
        <button type="button" onclick={() => popup?.close()}>Avbryt</button>
        <button class="save" type="button" disabled={!canSave(line, reason)} onclick={save}>Spara</button>
      </div>
    </div>
  {/if}
</dialog>

<style>
  /* === Layout === */

  dialog {
    width: min(var(--edit-width), var(--edit-share));
    max-width: none;
    max-height: var(--all-entries-height);
    padding: 0;
    overflow: auto;
    border: 1px solid var(--dashboard-line);
    border-radius: var(--radius-panel);
    background: var(--dashboard-background);
    color: var(--dashboard-text);
    transition: opacity var(--speed-ui) ease;
  }

  dialog::backdrop {
    background: var(--all-entries-scrim);
    transition: background-color var(--speed-ui) ease;
  }

  .card {
    display: grid;
    gap: var(--all-entries-gap);
    padding: var(--all-entries-padding);
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--all-entries-gap);
    font-size: var(--edit-head-size);
  }

  select {
    padding: var(--edit-picker-padding);
    border: 1px solid var(--dashboard-line);
    border-radius: var(--radius-tag);
    background: var(--dashboard-background);
    color: var(--dashboard-text);
    font: inherit;
  }

  .words {
    min-height: 1.3em;
    color: var(--dashboard-text-muted);
    font-size: var(--edit-words-size);
  }

  b {
    font-weight: var(--dashboard-font-weight);
  }

  .tag {
    margin-left: var(--edit-tag-gap);
    padding: var(--entry-tag-padding);
    border: 1px solid var(--dashboard-line);
    border-radius: var(--entry-tag-radius);
    color: var(--dashboard-text);
    font-size: var(--entry-tag-size);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--edit-button-gap);
  }

  .actions button {
    padding: var(--edit-button-padding);
    border: 1px solid var(--dashboard-line);
    border-radius: var(--radius-small);
    background: none;
    color: var(--dashboard-text);
    font: inherit;
    font-size: var(--edit-button-size);
    cursor: pointer;
  }

  .actions .save {
    border-color: var(--dashboard-text);
    background: var(--dashboard-text);
    color: var(--dashboard-background);
  }

  /* === States === */

  /* Over "Alla poster", a lighter dimming of its own; peeking, the dimming lifts and the edit fades */
  .stacked::backdrop {
    background: var(--edit-stack-dim);
  }

  .peek::backdrop {
    background: transparent;
  }

  .peek {
    opacity: var(--edit-peek);
  }

  .changed {
    color: var(--dashboard-text);
  }

  .grey,
  .grey .tag,
  .still {
    color: var(--dashboard-text-muted);
  }

  .warn {
    border-color: var(--edit-remove);
    color: var(--edit-remove);
  }

  .actions .save:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }
</style>
