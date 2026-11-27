<!--
  Fördelning, the slider that splits full time between the janitor's expected hours and the ceiling, a week at a time
  in quarter hours ("The other profiles share a ceiling"; "The menu has tabs, with every value locked behind "Ändra"").
  It has no "Ändra": its numbers follow it as it moves ("30h | 8h 15min"), and its first move folds open "från", the
  date (the first of next month) and "Spara" and "Avbryt" under it, which stay only while it holds a value other than
  the one saved: moved back there, they fold shut again. "Spara" or Enter saves; a refused split keeps its date open with
  the reason in the warning red. "Avbryt", Esc or a click outside drops the move, the slider going back, and folds it
  shut: <SplitSlider />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { localDay } from '$lib/modules/shared/counting'
  import { dayAndMonth } from '$lib/modules/shared/dates'
  import {
    cancelComing,
    firstOfNextMonth,
    fullTimeWeek,
    saveSplit,
    splitWeek,
    WEEK_STEP,
    weekText,
  } from '$lib/modules/menu/workTime'
  import ComingNote from './ComingNote.svelte'

  // === State ===

  const key = crypto.randomUUID()
  let today = $derived(localDay(Date.now()))
  // What is in force today; a split saved for a later day shows as coming until its day
  let full = $derived(app.record ? fullTimeWeek(app.record, today) : 0)
  let saved = $derived(app.record ? splitWeek(app.record, today) : 0)
  let coming = $derived.by(() => {
    const janitor = app.record?.profiles.find((p) => p.expectedMinutes !== undefined)
    const next = [...(janitor?.expectedMinutes ?? [])]
      .sort((a, b) => (a.from < b.from ? -1 : 1))
      .find((v) => v.from > today)
    return next ? { text: `${weekText(next.minutes * 5)} från ${dayAndMonth(next.from)}`, from: next.from } : null
  })
  let moving = $derived(app.openValue === key)
  let value = $state(0)
  let from = $state('')
  let refusal = $state('')
  let wrap: HTMLDivElement | undefined = $state()
  let slider: HTMLInputElement | undefined = $state()
  let shown = $derived(moving ? value : saved)

  // === Logic ===

  // Locked again, from here or elsewhere, the slider goes back to what is saved
  $effect(() => {
    if (!moving) {
      value = saved
      refusal = ''
    }
  })

  // === Helpers ===

  /** The first move folds open the date and the buttons; moved back to the value saved, they fold shut again */
  function move(): void {
    if (value === saved) {
      if (moving) app.openValue = null
      return
    }
    if (!moving) {
      from = firstOfNextMonth(today)
      app.openValue = key
    }
    refusal = ''
  }

  /** The split saved from its date, or refused with its reason */
  async function keep(): Promise<void> {
    if (!app.record || !from) return
    const result = saveSplit(app.record, value, from)
    if ('refusal' in result) {
      refusal = result.refusal
      return
    }
    await app.saveSettings(result)
    app.openValue = null
  }

  /** The split saved for a later day taken back, or the reason it is refused */
  function cancel(from: string): string | null {
    if (!app.record) return null
    const result = cancelComing(app.record, 'split', from)
    if ('refusal' in result) return result.refusal
    void app.saveSettings(result)
    return null
  }

  /** The move dropped and the slider back where it was */
  function drop(): void {
    app.openValue = null
    queueMicrotask(() => slider?.focus())
  }

  function onKey(event: KeyboardEvent): void {
    if (!moving) return
    if (event.key === 'Escape') {
      event.stopPropagation()
      event.preventDefault()
      drop()
    } else if (event.key === 'Enter') {
      event.preventDefault()
      void keep()
    }
  }

  /** A press anywhere outside drops the move */
  function onPress(event: PointerEvent): void {
    if (moving && wrap && !wrap.contains(event.target as Node)) drop()
  }
</script>

<svelte:window onpointerdown={onPress} />

<!-- Enter and Esc reach the slider and the date inside -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="value" class:moving bind:this={wrap} onkeydown={onKey}>
  <div class="row">
    <span class="label">Fördelning</span>
    <span class="values">
      <span class="text">{weekText(shown)} | {weekText(full - shown)}</span>
      {#if coming && !moving}<ComingNote text={coming.text} cancel={() => cancel(coming.from)} />{/if}
    </span>
  </div>
  <input
    type="range"
    aria-label="Fördelning"
    min="0"
    max={full}
    step={WEEK_STEP}
    bind:value
    bind:this={slider}
    oninput={move}
  />
  <div class="grow" inert={!moving}>
    <div class="clip">
      <div class="act">
        <span>från</span>
        <input type="date" aria-label="Gäller från" bind:value={from} oninput={() => (refusal = '')} />
        <button class="button-small" type="button" onclick={() => void keep()}>Spara</button>
        <button class="button-small" type="button" onclick={drop}>Avbryt</button>
        {#if refusal}<span class="warn">{refusal}</span>{/if}
      </div>
    </div>
  </div>
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

  .text {
    font-variant-numeric: tabular-nums;
  }

  /* The split, and under it a split saved for a later day */
  .values {
    display: grid;
    flex: 1;
    justify-items: start;
    min-width: 0;
  }

  .value > :not(.row) {
    margin-left: calc(var(--menu-label-width) + var(--menu-value-gap-inline));
  }

  /* From the value's column to the panel's edge, never past it: stretched by the grid, its margin taken off */
  input[type='range'] {
    justify-self: stretch;
    width: auto;
    min-width: 0;
    accent-color: var(--profile-neon, var(--menu-text));
  }

  /* Folded shut until the first move, then grown open, as a profile row opens; the negative margin takes back the
     group's gap while shut */
  .grow {
    display: grid;
    grid-template-rows: 0fr;
    margin-top: calc(-1 * var(--menu-value-gap));
    transition: grid-template-rows var(--speed-ui) var(--ease-grow);
  }

  .clip {
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  .act {
    padding-top: var(--menu-value-gap);
  }

  input[type='date'] {
    padding: var(--menu-field-padding);
    border: 1px solid var(--menu-button-line);
    border-radius: var(--radius-small);
    background: var(--field-background);
    color: var(--menu-text);
    font: inherit;
  }

  .warn {
    color: var(--edit-remove);
    font-size: var(--text-size-label);
  }

  /* === States === */

  .moving .grow {
    grid-template-rows: 1fr;
  }

  .moving .clip {
    opacity: 1;
  }
</style>
