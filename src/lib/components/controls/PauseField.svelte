<!--
  "Lägg till paus" ("Time away is a gap or an added break"): a quiet button, greyed out unless the profile on screen
  runs, whose length field opens in its place, text from the left ("Entering a length of time"). The field holds the
  running entry's whole break: it opens on what is there so far, selected, so typing replaces it. A plain number is
  minutes, "1:20" hours and minutes; a keystroke that breaks the shape does not appear, and how the field reads what is
  typed shows just under it, so the field stays where it is. Enter, or a click away, sets the new total, a lower one
  taking time back; Esc closes the field. A total longer than its entry is refused, and the reading says so, the field
  left open.
-->
<script lang="ts">
  import { tick } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { breakSoFar } from '$lib/modules/controls/breaks'
  import { durationShape } from '$lib/modules/shared/durationShape'
  import { BREAK, durationInField, durationText, readDuration } from '$lib/modules/shared/timeInput'

  // === State ===

  let mine = $derived(app.running !== null && app.running.profile === app.onScreen)
  let open = $state(false)
  let text = $state('')
  let refused = $state(false)
  let input: HTMLInputElement | undefined = $state()
  let minutes = $derived(readDuration(text, BREAK))
  let reading = $derived(refused ? 'för lång paus' : minutes === null ? '' : durationText(minutes))

  // === Logic ===

  // The field closes when its entry stops or another profile comes on screen, so no break waits for an entry that is gone
  $effect(() => {
    if (!mine) close()
  })

  // === Helpers ===

  /** The button pressed: the field opens in its place on the break so far, selected, or empty with none */
  async function openField(): Promise<void> {
    text = app.record ? durationInField(breakSoFar(app.record, app.onScreen)) : ''
    open = true
    await tick()
    input?.focus()
    input?.select()
  }

  /** The field closes, empty, and the button is back. Used on Esc, a click away, and once a total is set */
  function close(): void {
    open = false
    text = ''
    refused = false
  }

  /** A text the field's shape lets through. Used by the field's attachment */
  function typed(next: string): void {
    text = next
    refused = false
  }

  /**
   * A whole length set as the total, and the field closes; one too long is refused, the field left open with the
   * reading saying so. Nothing whole typed closes the field as it was. Used by Enter and a click away
   */
  async function keep(): Promise<void> {
    if (!open) return
    if (minutes === null) {
      close()
      return
    }
    const why = await app.setBreak(minutes)
    if (why === null || why === 'no-change') close()
    else if (why === 'too-long') refused = true
  }

  /** Enter keeps, Esc closes. Used on the field's keys */
  function keys(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation()
      close()
    }
    if (event.key === 'Enter') void keep()
  }
</script>

{#if open}
  <div class="field">
    <input
      bind:this={input}
      value={text}
      type="text"
      inputmode="numeric"
      placeholder="00:00"
      autocomplete="off"
      spellcheck="false"
      aria-label="Pausens längd, Enter lägger till, Esc avbryter"
      {@attach durationShape(BREAK, typed)}
      onkeydown={keys}
      onblur={keep}
    />
    <span class="reading" aria-live="polite">{reading}</span>
  </div>
{:else}
  <button class="pause" type="button" disabled={!mine} onclick={openField}>Lägg till paus</button>
{/if}

<style>
  /* === Layout === */

  .field {
    position: relative;
    display: grid;
    place-items: center;
    height: var(--pause-height);
  }

  input {
    width: var(--pause-field-width);
    height: var(--field-height);
    padding: var(--pause-field-padding);
    border: 1px solid var(--button-line);
    border-radius: var(--radius-small);
    background: var(--field-background);
    color: var(--controls-text);
    font: inherit;
    font-size: var(--pause-text-size);
    letter-spacing: var(--pause-field-tracking);
    text-align: left;
  }

  /* Under the field, out of the row's flow, so the field never moves as the reading comes and goes */
  .reading {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: var(--pause-reading-gap);
    font-size: var(--controls-text-size-small);
    color: var(--controls-text-muted);
    white-space: nowrap;
    pointer-events: none;
  }

  .pause {
    background-attachment: fixed;
    height: var(--pause-height);
    padding: var(--pause-padding);
    border: 0;
    border-radius: var(--radius-button);
    background: var(--button-background);
    color: var(--button-text);
    box-shadow: var(--shadow-button);
    font: inherit;
    font-size: var(--pause-text-size);
    font-weight: var(--pause-font-weight);
  }

  /* === States === */

  /* The field's focus wears the running profile's neon, as the start button's ring does */
  input:focus,
  input:focus-visible {
    outline: var(--focus-width) solid var(--profile-neon);
    outline-offset: var(--pause-field-focus-offset);
    border-color: var(--profile-neon);
  }

  .pause:not(:disabled) {
    background-image: var(--pointer-light);
  }

  .pause:not(:disabled):hover {
    background-color: var(--button-background-hover);
  }

  .pause:not(:disabled):active {
    background-image: linear-gradient(180deg, var(--button-press-shade), transparent 70%), var(--pointer-light);
    background-attachment: scroll, fixed;
    box-shadow: none;
  }

  .pause:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }
</style>
