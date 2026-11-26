<!--
  A value in the menu, locked behind "Ändra" ("The menu has tabs, with every value locked behind "Ändra""): its label,
  then its text, with "Ändra" under the text. "Ändra" turns into the value's field in its own place while the text above
  stays as it was; Enter confirms. A value that changes the counting then asks "Gäller från": the field turns into what
  waits and a date opening on `opensOn`, and a second Enter saves it. A refused value keeps its field or its date open,
  the reason in the keys' place in the warning red, until it is fixed, Esc drops it, or a click outside does. Only one
  value is open at a time. "Tidigare värden" with a count opens the earlier values and the dates they held:
  <LockedValue label="Heltid" text="38h 15min / vecka" fieldText="38:15" read={readWeek} save={saveWeek} dated />
-->
<script lang="ts" generics="T">
  import { app } from '$lib/app.svelte'
  import { dateInWords } from '$lib/modules/shared/dates'
  import { durationShape } from '$lib/modules/shared/durationShape'
  import type { Day } from '$lib/modules/shared/record'
  import type { DurationField } from '$lib/modules/shared/timeInput'

  // === Props ===

  let {
    label,
    text,
    note = '',
    fieldText,
    field,
    read,
    waiting,
    save,
    dated = false,
    opensOn,
    capital = false,
    earlier = [],
  }: {
    /** The label in the left column: "Heltid", "Namn", "Timpris" */
    label: string
    /** The value as text: "38h 15min / vecka" */
    text: string
    /** A quieter note after it, such as Heltid's day: "7h 39min / dag" */
    note?: string
    /** What the field opens with: "38:15" */
    fieldText: string
    /** A length's shape, keeping the field to it as it is typed; none for plain text */
    field?: DurationField
    /** The typed text read as a value, or null while it is not one: Enter waits */
    read: (typed: string) => T | null
    /** What waits to be saved, before "från": "38h 30min" */
    waiting?: (value: T) => string
    /** Saves the value, from a day when it is dated; gives the reason it is refused, or null once saved */
    save: (value: T, from: Day) => string | null
    /** Whether it changes the counting, and so asks "Gäller från" */
    dated?: boolean
    /** The day the date opens on: today, or the first of next month */
    opensOn?: Day
    /** Whether the first letter turns a capital as it is typed: a name */
    capital?: boolean
    /** The earlier values, newest first, each with the days it held */
    earlier?: { text: string; from: Day; until: Day }[]
  } = $props()

  // === State ===

  const key = crypto.randomUUID()
  let stage = $state<'locked' | 'edit' | 'date'>('locked')
  let typed = $state('')
  let pending = $state<T | null>(null)
  let from = $state('')
  let refusal = $state('')
  let history = $state(false)
  let wrap: HTMLDivElement | undefined = $state()
  let change: HTMLButtonElement | undefined = $state()

  // === Logic ===

  // Closed from elsewhere (another value opened, the menu closed): locked again, what was waiting dropped
  $effect(() => {
    if (app.openValue !== key && stage !== 'locked') {
      stage = 'locked'
      refusal = ''
      pending = null
    }
  })

  // === Helpers ===

  /** "Ändra": the field in its place, holding the value as it would be typed */
  function open(): void {
    typed = fieldText
    refusal = ''
    stage = 'edit'
    app.openValue = key
  }

  /** Drops what was typed or waiting and locks the value again, the focus back on "Ändra" */
  function abort(): void {
    if (app.openValue === key) app.openValue = null
    queueMicrotask(() => change?.focus())
  }

  /** Enter in the field: a value read and saved, or asked its date */
  function confirm(): void {
    const value = read(typed)
    if (value === null) return
    if (!dated) return keep(value, '')
    pending = value
    from = opensOn ?? ''
    stage = 'date'
  }

  /** The value saved, or refused with its reason in the keys' place */
  function keep(value: T, day: Day): void {
    const no = save(value, day)
    if (no !== null) {
      refusal = no
      return
    }
    abort()
  }

  function onKey(event: KeyboardEvent): void {
    if (stage === 'locked') return
    if (event.key === 'Escape') {
      event.stopPropagation()
      event.preventDefault()
      abort()
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (stage === 'edit') confirm()
      else if (pending !== null && from) keep(pending, from)
    }
  }

  /** A press anywhere outside the open value drops it, as Esc does */
  function onPress(event: PointerEvent): void {
    if (stage !== 'locked' && wrap && !wrap.contains(event.target as Node)) abort()
  }

  /** The first letter a capital as it is typed, the caret left where it was. Used by a name's field */
  function capitalise(input: HTMLInputElement): void {
    const at = input.value.search(/\S/)
    if (at < 0 || input.value.charAt(at) === input.value.charAt(at).toUpperCase()) return
    const [a, b] = [input.selectionStart, input.selectionEnd]
    input.value = input.value.slice(0, at) + input.value.charAt(at).toUpperCase() + input.value.slice(at + 1)
    input.setSelectionRange(a, b)
    typed = input.value
  }

  /** Focuses an element once it is drawn */
  function focus(element: HTMLElement): void {
    queueMicrotask(() => element.focus())
  }
</script>

<svelte:window onpointerdown={onPress} />

<!-- Enter and Esc reach the field inside -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="value" bind:this={wrap} onkeydown={onKey}>
  <div class="row">
    <span class="label">{label}</span>
    <span class="text"
      >{text}{#if note}<span class="note">{note}</span>{/if}</span
    >
  </div>
  <div class="act">
    {#if stage === 'locked'}
      <button class="small" type="button" bind:this={change} onclick={open}>Ändra</button>
    {:else if stage === 'edit'}
      {#if field}
        <input
          type="text"
          aria-label={label}
          value={typed}
          {@attach durationShape(field, (t) => (typed = t))}
          {@attach focus}
        />
      {:else}
        <input
          type="text"
          aria-label={label}
          bind:value={typed}
          oninput={(event) => {
            refusal = ''
            if (capital) capitalise(event.currentTarget)
          }}
          {@attach focus}
        />
      {/if}
      <span class="keys" class:warn={refusal !== ''}>
        {refusal || `${dated ? 'Enter fortsätter' : 'Enter sparar'} · Esc avbryter`}
      </span>
    {:else}
      <span class="pending">{pending !== null && waiting ? waiting(pending) : ''} från</span>
      <input type="date" aria-label="Gäller från" bind:value={from} oninput={() => (refusal = '')} {@attach focus} />
      <span class="keys" class:warn={refusal !== ''}>{refusal || 'Enter sparar · Esc avbryter'}</span>
    {/if}
  </div>
  {#if earlier.length > 0}
    <button class="history" type="button" onclick={() => (history = !history)}
      >Tidigare värden ({earlier.length})</button
    >
    {#if history}
      <ul>
        {#each earlier as old (old.from)}
          <li>{old.text}, från {dateInWords(old.from)} till {dateInWords(old.until)}</li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  /* === Layout === */

  .value {
    display: grid;
    gap: var(--menu-value-gap);
    padding: var(--menu-value-padding);
    border-bottom: 1px dashed var(--menu-line);
  }

  .row,
  .act {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--menu-value-gap-inline);
    min-height: var(--menu-value-row);
  }

  .label {
    flex: none;
    width: var(--menu-label-width);
    color: var(--menu-text-muted);
  }

  .text,
  .pending {
    font-variant-numeric: tabular-nums;
  }

  .note {
    margin-left: var(--menu-note-gap);
    color: var(--menu-text-muted);
  }

  /* Everything under the value lines up with it, past the label */
  .value > :not(.row) {
    margin-left: calc(var(--menu-label-width) + var(--menu-value-gap-inline));
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

  input {
    width: var(--menu-field-width);
    padding: var(--menu-field-padding);
    border: 1px solid var(--menu-button-line);
    border-radius: var(--radius-small);
    background: var(--field-background);
    color: var(--menu-text);
    font: inherit;
  }

  input[type='date'] {
    width: auto;
  }

  .keys {
    color: var(--menu-text-muted);
    font-size: var(--text-size-label);
  }

  .history {
    justify-self: start;
    padding: 0;
    border: 0;
    background: none;
    color: var(--menu-text-muted);
    font: inherit;
    font-size: var(--menu-history-size);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }

  ul {
    display: grid;
    gap: var(--menu-history-gap);
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--menu-text-muted);
    font-size: var(--text-size-small);
  }

  /* === States === */

  /* A refused value's reason, in the keys' place */
  .keys.warn {
    color: var(--edit-remove);
  }
</style>
