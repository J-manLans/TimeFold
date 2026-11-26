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
  ut" is cut with "…" in the closed field. The reason given comes out through `reason`, empty for none:
  <ReasonPicker bind:reason />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { reasonList } from '$lib/modules/edit/reasons'

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

  /** The longest a reason shows at rest, in characters, from the tokens */
  let cap = $state(17)

  // === Logic ===

  $effect(() => {
    reason = picked === OTHER ? typed.trim() : (picked ?? '')
  })

  $effect(() => {
    if (field) cap = parseFloat(getComputedStyle(field).getPropertyValue('--edit-pick-max')) || 17
  })

  // === Helpers ===

  /** Opens or closes the list. Used by the closed field */
  function toggle(): void {
    open = !open
  }

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
    return `${typing ? length : Math.min(length, cap)}ch`
  }
</script>

<div class="reason" class:open>
  <button class="pick" class:chosen={picked !== null} type="button" onclick={toggle}>
    {picked === null ? 'Välj orsak' : picked === OTHER ? typed : picked}
  </button>
  <div class="grow">
    <div class="clip">
      <div class="list">
        {#each REASONS as option (option)}
          <button type="button" disabled={picked === option} onclick={() => choose(option)}>{option}</button>
        {/each}
        <input
          class="other"
          class:current={picked === OTHER}
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
      </div>
    </div>
  </div>
</div>

<style>
  /* === Layout === */

  .reason {
    display: grid;
    justify-items: start;
  }

  .pick {
    box-sizing: content-box;
    max-width: var(--edit-pick-max);
    overflow: hidden;
    padding: var(--edit-pick-padding);
    border: 1px solid var(--dashboard-line);
    border-radius: var(--radius-tag);
    background: var(--dashboard-background);
    color: var(--dashboard-text-muted);
    font: inherit;
    font-size: var(--edit-words-size);
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  /* The list grows open at the interface's speed, then its reasons fade in after the same time; closing, they fade
     out first, then it shrinks */
  .grow {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 0fr;
    justify-self: stretch;
    min-width: 0;
    transition: grid-template-rows var(--speed-ui) var(--ease-grow) var(--speed-ui);
  }

  .clip {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity var(--speed-ui) ease,
      visibility 0s linear var(--speed-ui);
  }

  .list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--edit-list-gap);
    justify-items: start;
    padding-top: var(--edit-list-top);
  }

  .list button {
    padding: var(--edit-reason-padding);
    border: 0;
    border-radius: var(--radius-tag);
    background: none;
    color: var(--dashboard-text);
    font: inherit;
    font-size: var(--edit-words-size);
    cursor: pointer;
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
    text-overflow: ellipsis;
    cursor: text;
  }

  .other::placeholder {
    color: var(--dashboard-text);
    opacity: 1;
  }

  /* === States === */

  .chosen {
    color: var(--dashboard-text);
  }

  .open .grow {
    grid-template-rows: 1fr;
    transition-delay: 0s;
  }

  .open .clip {
    opacity: 1;
    visibility: visible;
    transition:
      opacity var(--speed-ui) ease var(--speed-ui),
      visibility 0s;
  }

  .list button:hover:enabled {
    background: var(--dashboard-background);
  }

  .list button:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
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
