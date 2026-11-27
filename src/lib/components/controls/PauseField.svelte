<!--
  "Lägg till paus" ("Time away is a gap or an added break"): a quiet button, greyed out unless the profile on screen
  runs, whose length field opens in its place, at its size, the text centred ("Shared looks are written once"). The field holds the
  running entry's whole break: it opens on what is there so far, selected, so typing replaces it. A plain number is
  minutes, "1:20" hours and minutes; a keystroke that breaks the shape does not appear, and how the field reads what is
  typed shows just under it, so the field stays where it is. Enter, or a click away, sets the new total, a lower one
  taking time back; Esc closes the field. A total longer than its entry is refused, and the reading says so, the field
  left open.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { breakSoFar } from '$lib/modules/controls/breaks'
  import { durationShape } from '$lib/modules/shared/durationShape'
  import { field, widthOf } from '$lib/modules/shared/field'
  import { BREAK, durationInField, durationText, readDuration } from '$lib/modules/shared/timeInput'

  // === State ===

  let mine = $derived(app.running !== null && app.running.profile === app.onScreen)
  let open = $state(false)
  let text = $state('')
  let refused = $state(false)
  /** The width of "Lägg till paus", which its field takes, so the field opens in the button's exact place */
  let width = $state('')
  let minutes = $derived(readDuration(text, BREAK))
  let reading = $derived(refused ? 'för lång paus' : minutes === null ? '' : durationText(minutes))

  // === Logic ===

  // The field closes when its entry stops or another profile comes on screen, so no break waits for an entry that is gone
  $effect(() => {
    if (!mine) close()
  })

  // === Helpers ===

  /** The button pressed: the field opens in its place on the break so far, selected, or empty with none */
  function openField(event: MouseEvent): void {
    width = widthOf(event.currentTarget)
    text = app.record ? durationInField(breakSoFar(app.record, app.onScreen)) : ''
    open = true
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
   * reading saying so. Nothing whole typed closes the field as it was. Used by Enter and leaving the field
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
</script>

{#if open}
  <div class="slot">
    <input
      class="field"
      style:width
      value={text}
      type="text"
      inputmode="numeric"
      placeholder="00:00"
      autocomplete="off"
      spellcheck="false"
      aria-label="Pausens längd, Enter lägger till, Esc avbryter"
      {@attach durationShape(BREAK, typed)}
      {@attach field({ keep: () => void keep(), drop: close, away: 'keep' })}
    />
    <span class="reading" aria-live="polite">{reading}</span>
  </div>
{:else}
  <button class="pause plastic" type="button" disabled={!mine} onclick={openField}>Lägg till paus</button>
{/if}

<style>
  /* === Layout === */

  .slot {
    position: relative;
    display: grid;
    place-items: center;
    height: var(--pause-height);
  }

  input {
    height: var(--pause-height);
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
    height: var(--pause-height);
    padding: var(--pause-padding);
    font-size: var(--pause-text-size);
    font-weight: var(--pause-font-weight);
  }

  /* === States === */
</style>
