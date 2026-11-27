<!--
  The edit popup ("Editing an entry on its line"): an entry chosen from a list, or a gap of "Visa alla" for a
  forgotten entry, edited on its line in a popup of its own, centred. From "Senaste" it sits over the dimmed screen;
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
  import { canSave, lineForEntry, lineForGap, resultWords } from '$lib/modules/edit/edit'
  import { blockedProfile, pickProfile, setBreak, type LineState } from '$lib/modules/edit/line'
  import { durationShape } from '$lib/modules/shared/durationShape'
  import { field, widthOf } from '$lib/modules/shared/field'
  import { popupClosed, popupOpened, type Input } from '$lib/modules/shared/focusRing'
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
  /** Whether the last press began outside the card, so only a click begun there closes the popup */
  let pressedOutside = false
  /** The break's field, open where its tag was clicked: which part's, what it holds, and whether it was refused */
  let tagAt = $state<number | null>(null)
  let tagText = $state('')
  let tagRefused = $state(false)
  /** The width of the tag the field replaced, which the field keeps while it is typed in */
  let tagWidth = $state('')
  /** How the popup was opened, a key or a pointer, for the focus ring when it closes */
  let openedBy: Input = null
  /** "Ta bort" asking "Ta bort?", after its first click */
  let asking = $state(false)
  /** Whether the profile picker's list is open */
  let picking = $state(false)

  let profiles = $derived(app.record?.profiles ?? [])
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
        if (line && !popup.open) {
          openedBy = popupOpened()
          popup.showModal()
        }
      } else {
        line = null
        if (popup?.open) popup.close()
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

  /** A press: whether it began outside the card; anywhere but on "Ta bort" turns its question back */
  function pressed(event: PointerEvent): void {
    pressedOutside = event.target === popup
    if (!(event.target as HTMLElement).closest('.remove')) asking = false
  }

  /** "Ta bort": the first click asks, the second deletes the entry */
  function remove(): void {
    if (asking) void app.deleteEdited()
    else asking = true
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
    popupClosed(openedBy)
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
   * with Esc. Used by Enter and leaving the field
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

<dialog
  bind:this={popup}
  aria-label="Ändra posten"
  data-surface="dashboard"
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
        <Dropdown
          text={profiles.find((p) => p.id === shown)?.name ?? ''}
          choices={profiles.map((p) => p.name)}
          chosen={true}
          float={true}
          bind:open={picking}
        >
          {#each profiles as profile (profile.id)}
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
                  {@attach field({ keep: keepTag, drop: () => (tagAt = null), away: 'keep' })}
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
        <button class="button-small" type="button" onclick={() => popup?.close()}>Avbryt</button>
        <button class="button-small main" type="button" disabled={!canSave(line, reason)} onclick={save}>Spara</button>
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
    align-items: baseline;
    justify-content: space-between;
    gap: var(--all-entries-gap);
    font-size: var(--edit-head-size);
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
  }

  .actions {
    display: flex;
    gap: var(--edit-button-gap);
  }

  .spacer {
    flex: 1;
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
