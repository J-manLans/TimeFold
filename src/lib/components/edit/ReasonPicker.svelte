<script lang="ts" module>
  /** What `picked` holds while the typed text is the reason */
  const OTHER = '\u0000annan'

  /** The typed field's text while it is empty */
  const PLACEHOLDER = 'Annan orsak'
</script>

<!--
  The reason an edit needs ("Every edit carries a reason"): one closed field, "Välj orsak", that opens the list of
  reasons, which grows open and then fades its reasons in. The list ends with "Annan orsak", itself a field, underlined
  exactly as long as its text: typed into, the text is the reason from its first letter; Enter or a click elsewhere
  keeps it, Esc puts back what it had. The chosen reason stays greyed in its place. A reason longer than "Glömde stämpla
  ut" is cut with "…" in the closed field. Under the pointer each reason's line shows a pen, drawn as the calendar's
  padlock, which turns the line into a field drawn as "Annan orsak", without choosing it: Enter keeps a new name, one
  already in the list refused with "Orsaken finns redan" under it; emptied, Enter asks "Ta bort?" in red and a second
  Enter removes the reason; Esc or a click elsewhere puts the line back. The list shows at most seven lines, "Annan
  orsak" one of them, and scrolls past them. While "Annan orsak" holds text, a "+" after it adds the text to the list at
  once and chooses it there, refused with "Orsaken finns redan" when it is already a reason. The reason given comes out
  through `reason`, empty for none:
  <ReasonPicker bind:reason />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { addReason, reasonList, removeReason, renameReason } from '$lib/modules/edit/reasons'
  import Dropdown from '$lib/components/shared/Dropdown.svelte'

  // === Props ===

  let {
    reason = $bindable(),
  }: {
    /** The reason given: one from the list, or the typed text trimmed; empty for none */
    reason: string
  } = $props()

  // === State ===

  let REASONS = $derived(app.record ? reasonList(app.record) : [])

  let open = $state(false)
  /** The reason picked: one from the list, the typed one, or none */
  let picked = $state<string | null>(null)
  let typed = $state('')
  let typing = $state(false)
  /** What the typed field had when it was clicked, which Esc puts back */
  let was: { typed: string; picked: string | null } = { typed: '', picked: null }
  let field: HTMLInputElement | undefined = $state()

  /** The longest a typed reason shows at rest, in characters: the longest reason's, the text being monospaced */
  let cap = $derived(Math.max(1, ...REASONS.map((r) => r.length)))
  /** The reason open under its pen, its text as typed, whether its emptying asked once, and why it was refused */
  let editing = $state<string | null>(null)
  let renamed = $state('')
  let askedRemove = $state(false)
  let renameRefused = $state(false)
  /** Whether "+" was refused, the text already a reason */
  let addRefused = $state(false)

  // === Logic ===

  $effect(() => {
    reason = picked === OTHER ? typed.trim() : (picked ?? '')
  })

  // === Helpers ===

  /** A reason from the list chosen; the list closes. Used by each reason */
  function choose(chosen: string): void {
    picked = chosen
    open = false
  }

  /** The typed field clicked: what it had is kept for Esc, and the caret goes to its end */
  function focused(): void {
    was = { typed, picked }
    typing = true
    requestAnimationFrame(() => {
      if (!field) return
      field.setSelectionRange(field.value.length, field.value.length)
      field.scrollLeft = field.scrollWidth
    })
  }

  /** A letter typed or taken away: the text is the reason from its first letter, and none once it is empty */
  function input(): void {
    addRefused = false
    if (typed.trim()) picked = OTHER
    else if (picked === OTHER) picked = null
  }

  /** The typed text kept: trimmed, the reason if anything is left. Used by Enter and a click elsewhere */
  function keep(): void {
    typed = typed.trim()
    if (typed) picked = OTHER
    else if (picked === OTHER) picked = null
  }

  /** Enter keeps the text and closes the list; Esc puts back what it had, and closes the list, not the edit */
  function key(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      open = false
      keep()
      field?.blur()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      typed = was.typed
      picked = was.picked
      open = false
      field?.blur()
    }
  }

  /** The typed field left: back to its start, and kept if the list is still open */
  function left(): void {
    typing = false
    if (field) field.scrollLeft = 0
    if (open) keep()
  }

  /** The typed field's width in characters: its text's, or the placeholder's while empty, capped at rest */
  function width(): string {
    const length = typed ? typed.length : PLACEHOLDER.length
    // A pixel more than its characters, so the engine's rounding never cuts the last one
    return `calc(${typing ? length : Math.min(length, cap)}ch + 1px)`
  }

  /** "+": the typed text added to the list at once and chosen from it, or refused when it is already a reason */
  function add(): void {
    if (!app.record) return
    const result = addReason(app.record, typed)
    if ('refusal' in result) {
      addRefused = result.refusal === 'taken'
      return
    }
    const added = result.reasons.list.at(-1) ?? ''
    void app.saveSettings(result)
    typed = ''
    picked = added
  }

  /** A reason's pen: its line turned into a field holding its name */
  function edit(option: string): void {
    editing = option
    renamed = option
    askedRemove = false
    renameRefused = false
  }

  /** The line back as it was. Used by Esc, a click elsewhere, and a name kept */
  function back(): void {
    editing = null
  }

  /** Enter under the pen: a new name kept, a taken one refused; emptied, it asks once, then removes the reason */
  function keepName(event: KeyboardEvent, option: string): void {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      back()
      return
    }
    if (event.key !== 'Enter' || !app.record) return
    event.preventDefault()
    if (renamed.trim() === '') {
      if (!askedRemove) {
        askedRemove = true
        return
      }
      if (picked === option) picked = null
      void app.saveSettings(removeReason(app.record, option))
      back()
      return
    }
    const result = renameReason(app.record, option, renamed)
    if ('refusal' in result) {
      renameRefused = true
      return
    }
    if (picked === option) picked = renamed.trim()
    void app.saveSettings(result)
    back()
  }

  /** A name typed under the pen: its first letter a capital, the caret left where it was; the refusal and the ask go */
  function typeName(event: Event & { currentTarget: HTMLInputElement }): void {
    const input = event.currentTarget
    askedRemove = false
    renameRefused = false
    const at = input.value.search(/\S/)
    if (at < 0 || input.value.charAt(at) === input.value.charAt(at).toUpperCase()) return
    const [a, b] = [input.selectionStart, input.selectionEnd]
    input.value = input.value.slice(0, at) + input.value.charAt(at).toUpperCase() + input.value.slice(at + 1)
    input.setSelectionRange(a, b)
    renamed = input.value
  }

  /** Focuses the field under the pen once drawn, the caret at its end */
  function focusEnd(input: HTMLInputElement): void {
    queueMicrotask(() => {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    })
  }
</script>

<Dropdown
  text={picked === null ? 'Välj orsak' : picked === OTHER ? typed : picked}
  choices={['Välj orsak', ...REASONS]}
  chosen={picked !== null}
  bind:open
>
  {#each REASONS as option (option)}
    <div class="line">
      {#if editing === option}
        <input
          class="other rename"
          class:asking={askedRemove}
          type="text"
          autocomplete="off"
          aria-label="Ändra {option}"
          placeholder={askedRemove ? 'Ta bort?' : ''}
          style:width="{Math.max(1, renamed.length || (askedRemove ? 8 : 1))}ch"
          bind:value={renamed}
          oninput={typeName}
          onkeydown={(event) => keepName(event, option)}
          onblur={back}
          {@attach focusEnd}
        />
        {#if renameRefused}<span class="refused">Orsaken finns redan</span>{/if}
      {:else}
        <button class="dropdown-choice" type="button" disabled={picked === option} onclick={() => choose(option)}
          >{option}</button
        >
        <button class="pen" type="button" aria-label="Ändra {option}" onclick={() => edit(option)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h4L19 9l-4-4L4 16z" />
            <path d="M13 7l4 4" />
          </svg>
        </button>
      {/if}
    </div>
  {/each}
  <div class="line">
    <input
      class="other"
      class:current={picked === OTHER}
      class:cut={!typing && typed.length > cap}
      type="text"
      autocomplete="off"
      placeholder={PLACEHOLDER}
      aria-label={PLACEHOLDER}
      style:width={width()}
      bind:value={typed}
      bind:this={field}
      onfocus={focused}
      oninput={input}
      onkeydown={key}
      onblur={left}
    />
    {#if typed.trim()}
      <button class="pen plus" type="button" aria-label="Lägg till {typed.trim()} i listan" onclick={add}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    {/if}
    {#if addRefused}<span class="refused">Orsaken finns redan</span>{/if}
  </div>
</Dropdown>

<style>
  /* === Layout === */

  /* A reason's line: the reason, cut with "…" past its room, then its pen beside it, shown while the pointer is on the
     line; a refusal under both */
  .line {
    display: grid;
    grid-template-columns: minmax(0, max-content) auto;
    align-items: center;
    column-gap: var(--edit-pen-gap);
    max-width: 100%;
  }

  .pen {
    display: grid;
    place-items: center;
    padding: var(--edit-pen-padding);
    border: 0;
    border-radius: var(--radius-tag);
    background: none;
    color: var(--dashboard-text-muted);
    cursor: pointer;
    opacity: 0;
  }

  .pen svg {
    width: var(--edit-pen);
    height: var(--edit-pen);
    fill: none;
    stroke: currentColor;
    stroke-width: var(--calendar-lock-stroke);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* Under the pen: the line as a field drawn as "Annan orsak"; asking "Ta bort?" in the removal red, focused or not,
     so the focused field's muted placeholder never wins */
  .rename.asking,
  .rename.asking:focus {
    border-bottom-color: var(--edit-remove);
  }

  .rename.asking::placeholder,
  .rename.asking:focus::placeholder {
    color: var(--edit-remove);
  }

  .refused {
    grid-column: 1 / -1;
    margin-left: var(--edit-other-inset);
    color: var(--edit-remove);
    font-size: var(--text-size-label);
  }

  /* "Annan orsak": looks like the other reasons, with a faint underline exactly as long as its text */
  .other {
    box-sizing: content-box;
    max-width: calc(100% - var(--edit-other-inset));
    margin: var(--edit-other-margin);
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--dashboard-line);
    border-radius: 0;
    background: none;
    color: var(--dashboard-text);
    font: inherit;
    font-size: var(--edit-words-size);
    cursor: text;
  }

  /* A typed reason longer than "Glömde stämpla ut" at rest: cut with "…"; nothing shorter is ever cut */
  .cut {
    text-overflow: ellipsis;
  }

  .other::placeholder {
    color: var(--dashboard-text);
    opacity: 1;
  }

  /* === States === */

  .line:hover .pen,
  .pen:focus-visible,
  .plus {
    opacity: 1;
  }

  .pen:hover {
    color: var(--dashboard-text);
  }

  .other:focus {
    outline: none;
    border-bottom-color: var(--dashboard-text);
  }

  .other:focus::placeholder {
    color: var(--dashboard-text-muted);
  }

  .current:not(:focus) {
    opacity: var(--opacity-disabled);
  }
</style>
