<!--
  The edit popup ("Editing an entry on its line"): an entry chosen from a list, or a gap of "Visa alla" for a
  forgotten entry, edited on its line in the popups' frame, centred. From "Senaste" it sits over the dimmed screen;
  from "Visa alla" on top of the list, which dims a little further. Resting the pointer on the list behind is a peek:
  after a moment the edit fades and the extra dimming lifts. Under the day and the profile, the result reads in words;
  under the line, the reason; "Spara" waits for one. A part's "paus" tag, or "Lägg till paus" with none ("+ paus" where
  the longer words would wrap), opens that part's length field in its place ("An edited entry's break"). "Ta bort" asks once, "Ta bort?", and deletes on the second click. "Avbryt", Esc or a click outside cancels, nothing saved. Opened
  and closed through `app.editing`: <EditPopup />
-->
<script lang="ts">
  import { tick, untrack } from 'svelte'
  import { app } from '$lib/app.svelte'
  import EditLine from './EditLine.svelte'
  import ReasonPicker from './ReasonPicker.svelte'
  import Dropdown from '$lib/components/shared/Dropdown.svelte'
  import { canSave, lineForEntry, lineForGap, pickableProfiles, resultWords } from '$lib/modules/edit/edit'
  import { blockedProfile, pickProfile, setBreak, type LineState } from '$lib/modules/edit/line'
  import { durationShape } from '$lib/modules/shared/durationShape'
  import { field, widthOf } from '$lib/modules/shared/field'
  import Popup from '$lib/components/shared/Popup.svelte'
  import { localDay } from '$lib/modules/shared/counting'
  import { dayInWords } from '$lib/modules/shared/dates'
  import { BREAK, durationInField, durationText, readDuration } from '$lib/modules/shared/timeInput'

  // === State ===

  let popup: HTMLDialogElement | undefined = $state()
  // Raw: every move returns a whole new state, so nothing inside it needs watching
  let line = $state.raw<LineState | null>(null)
  let reason = $state('')
  let peek = $state(false)
  let peeking: ReturnType<typeof setTimeout> | null = null
  /** The break's field, open where its tag was clicked: which part's, what it holds, and whether it was refused */
  let tagAt = $state<number | null>(null)
  let tagText = $state('')
  let tagRefused = $state(false)
  /** The width of the tag the field replaced, which the field keeps while it is typed in */
  let tagWidth = $state('')
  /** "Ta bort" asking "Ta bort?", after its first click */
  let asking = $state(false)
  /** Whether the profile picker's list is open */
  let picking = $state(false)

  let profiles = $derived(app.record?.profiles ?? [])
  /** What the profile picker offers: the profiles in use, and an archived one only as the entry's own */
  let pickable = $derived(line ? pickableProfiles(profiles, line) : [])
  let words = $derived(line ? resultWords(line, profiles) : [])
  /** The running entry's profile while the entry touches it, greyed in the picker with "· pågår" */
  let blocked = $derived(line ? blockedProfile(line) : null)
  /** The profile in colour, which the picker names: a gap's filling one, or the whole entry's */
  let shown = $derived(line ? (line.fill ?? line.profile) : null)
  /** The words under the day, and whether "Lägg till paus" wrapped them, so it says "+ paus" instead */
  let wordBox: HTMLDivElement | undefined = $state()
  let addShort = $state(false)
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
        tagAt = null
        asking = false
      } else {
        line = null
        rest()
      }
    })
  })

  // === Helpers ===

  /**
   * The pointer over the popup: resting on the "Visa alla" card behind, outside the edit, fades the edit after a moment;
   * the scrim around that card is no peek, so the way out of the window never fades it
   */
  function moved(event: PointerEvent): void {
    const behind = event.target === popup && app.editing?.stacked === true && onList(event)
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

  /** Whether the pointer is over the "Visa alla" card under the edit. Used by `moved` */
  function onList(event: PointerEvent): boolean {
    const card = document.querySelector('[data-all-entries]')?.getBoundingClientRect()
    if (!card) return false
    const { clientX: x, clientY: y } = event
    return x >= card.left && x <= card.right && y >= card.top && y <= card.bottom
  }

  /** The pointer back on the edit, or gone: the edit shows again */
  function rest(): void {
    if (peeking) clearTimeout(peeking)
    peeking = null
    peek = false
  }

  /** A press anywhere but on "Ta bort" turns its question back */
  function pressed(event: PointerEvent): void {
    if (!(event.target as HTMLElement).closest('.remove')) asking = false
  }

  /** "Ta bort": the first click asks, the second deletes the entry */
  function remove(): void {
    if (asking) void app.deleteEdited()
    else asking = true
  }

  /** Cancelled by Esc, a click outside or "Avbryt": the edit is over, nothing saved */
  function cancel(): void {
    rest()
    app.closeEdit()
  }

  /** A profile picked: it fills a gap, or moves the whole entry, and the list closes */
  function picked(id: string): void {
    picking = false
    if (line) line = pickProfile(line, id)
  }

  // "Lägg till paus" where it fits on the line; "+ paus" where the longer words would wrap it, tried afresh each time the
  // words change
  $effect(() => {
    void words
    addShort = false
    tick().then(() => {
      const pieces = wordBox ? [...wordBox.children] : []
      const first = pieces[0] as HTMLElement | undefined
      const last = pieces[pieces.length - 1] as HTMLElement | undefined
      if (wordBox?.querySelector('.add') && first && last && last.offsetTop > first.offsetTop) addShort = true
    })
  })

  /** A tag clicked: the field opens in its place on that part's break, selected, or empty with none */
  function openTag(at: number, from: HTMLElement): void {
    if (!line) return
    tagWidth = widthOf(from)
    tagText = durationInField(words[at]?.tag ?? 0)
    tagRefused = false
    tagAt = at
  }

  /** A text the field's shape lets through; a refusal's red goes. Used by the field's attachment */
  function typedTag(text: string): void {
    tagText = text
    tagRefused = false
  }

  /**
   * The field kept: that part's break set to what it reads, empty taking it away, and a divided entry's breaks set
   * where they stand; longer than the time the part keeps, it is refused, red, and stays open until fixed or dropped
   * with Esc. Used by Enter
   */
  function keepTag(): void {
    if (!line || tagAt === null) return
    const minutes = readDuration(tagText || '0', BREAK)
    if (minutes === null) {
      tagAt = null
      return
    }
    const next = setBreak(line, minutes, words[tagAt]?.part ?? 0)
    if (next === null) {
      tagRefused = true
      return
    }
    line = next
    tagAt = null
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

<Popup
  open={line !== null}
  label="Ändra posten"
  surface="dashboard"
  width="min(480px, 88%)"
  class="edit {peek ? 'peek' : ''}"
  onclose={cancel}
  onpointermove={moved}
  onpointerleave={rest}
  onpointerdown={pressed}
  bind:dialog={popup}
>
  {#if line}
    <div class="card">
      <div class="head">
        <span>{day}</span>
        <Dropdown
          text={profiles.find((p) => p.id === shown)?.name ?? ''}
          choices={pickable.map((p) => p.name)}
          chosen={true}
          float={true}
          bind:open={picking}
        >
          {#each pickable as profile (profile.id)}
            <button
              class="dropdown-choice"
              type="button"
              disabled={profile.id === shown || profile.id === blocked}
              onclick={() => picked(profile.id)}>{profile.name}{profile.id === blocked ? ' · pågår' : ''}</button
            >
          {/each}
        </Dropdown>
      </div>

      <div class="words" bind:this={wordBox}>
        {#if line.placing}
          <span>Klicka där posten ska ligga</span>
        {:else}
          {#each words as word, i (i)}
            {#if i > 0}<span class="dot"> · </span>{/if}
            <span class:grey={word.kind === 'grey'}
              ><b class:changed={word.bold} style:color={word.kind === 'fill' ? word.colour : undefined}>{word.times}</b
              >{#if tagAt === i}<input
                  class="tag"
                  class:warn={tagRefused}
                  type="text"
                  inputmode="numeric"
                  placeholder="00:00"
                  autocomplete="off"
                  spellcheck="false"
                  aria-label="Pausens längd, Enter sparar, Esc avbryter"
                  value={tagText}
                  style:width={tagWidth}
                  {@attach durationShape(BREAK, typedTag)}
                  {@attach field({ keep: keepTag, drop: () => (tagAt = null) })}
                />{:else if word.tag !== null && word.kind === 'grey'}<span class="tag still"
                  >paus {durationText(word.tag)}</span
                >{:else if word.tag !== null}<button
                  class="tag"
                  class:warn={word.warn}
                  type="button"
                  onclick={(event) => openTag(i, event.currentTarget)}>paus {durationText(word.tag)}</button
                >{:else if word.addBreak}<button
                  class="tag add"
                  type="button"
                  onclick={(event) => openTag(i, event.currentTarget)}>{addShort ? '+ paus' : 'Lägg till paus'}</button
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
        {#if !line.isNew && !line.running}
          <button
            class="button-small remove"
            class:asking
            type="button"
            onclick={remove}
            onfocusout={() => (asking = false)}>Ta bort<span class="question">?</span></button
          >
        {/if}
        <span class="spacer"></span>
        <button class="button-small" type="button" onclick={cancel}>Avbryt</button>
        <button class="button-small main" type="button" disabled={!canSave(line, reason)} onclick={save}>Spara</button>
      </div>
    </div>
  {/if}
</Popup>

<style>
  /* === Layout === */

  /* The frame fades for a peek, its scrim with it */
  :global(dialog.edit) {
    transition: opacity var(--speed-ui) ease;
  }

  :global(dialog.edit)::backdrop {
    transition: background-color var(--speed-ui) ease;
  }

  .card {
    display: grid;
    gap: var(--spacing-md);
  }

  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--spacing-md);
    font-size: var(--text-size-body);
  }

  .words {
    min-height: 1.3em; /* a line's height, kept while empty */
    color: var(--dashboard-text-muted);
    font-size: var(--text-size-body);
  }

  b {
    font-weight: var(--dashboard-font-weight);
  }

  .tag {
    margin-left: var(--spacing-sm);
  }

  .actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .spacer {
    flex: 1;
  }

  /* === States === */

  /* Peeking, the dim lifts and the edit fades */
  :global(dialog.edit.peek)::backdrop {
    background: transparent;
  }

  :global(dialog.edit.peek) {
    opacity: 0.2; /* the pointer resting on the list behind: how much of the edit still shows (0 gone, 1 all) */
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

  input.tag.warn {
    color: var(--edit-remove);
  }

  /* "Ta bort" in removal red; asking, its "?" shows in the room it kept and a red border comes */
  .remove {
    border-color: transparent;
    color: var(--edit-remove);
  }

  .question {
    visibility: hidden;
  }

  .asking {
    border-color: var(--edit-remove);
  }

  .asking .question {
    visibility: visible;
  }
</style>
