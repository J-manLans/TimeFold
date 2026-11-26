<!--
  Profiler's row of the settings for every profile ("A pay estimate per profile"), set apart from the profiles by a
  line: "Efter skatt", a checkbox, unchecked by default, and "Skatt och avgifter", its percentage as a tag drawn as an
  edit's "paus" tag, lighting under the pointer. The tag opens a field in its own border: Enter keeps it, Esc or a press
  outside drops it, and a value out of 0 to under 100 is refused, the field red and open. Both are saved at once:
  <TaxRow />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { saveTax } from '$lib/modules/menu/workTime'

  // === State ===

  const key = crypto.randomUUID()
  let tax = $derived(app.record?.tax ?? { after: false, percent: 25 })
  let editing = $derived(app.openValue === key)
  let typed = $state('')
  let refused = $state(false)
  let wrap: HTMLDivElement | undefined = $state()
  let tag: HTMLButtonElement | undefined = $state()

  // === Helpers ===

  /** A percentage as the Swedish write it, a comma for the point: 27.5 is "27,5" */
  function percentText(percent: number): string {
    return String(percent).replace('.', ',')
  }

  /** The tag turned into its field */
  function open(): void {
    typed = percentText(tax.percent)
    refused = false
    app.openValue = key
  }

  /** The field back to the tag, the focus on it */
  function close(): void {
    if (app.openValue === key) app.openValue = null
    queueMicrotask(() => tag?.focus())
  }

  /** Enter: the percentage saved, or refused, red and still open */
  function keep(): void {
    const text = typed.replace(',', '.').replace('%', '').trim()
    const result = app.record && text !== '' ? saveTax(app.record, { ...tax, percent: Number(text) }) : null
    if (result === null || 'refusal' in result) {
      refused = true
      return
    }
    void app.saveSettings(result)
    close()
  }

  function onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      keep()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
    }
  }

  /** A press outside the open field drops it */
  function onPress(event: PointerEvent): void {
    if (editing && wrap && !wrap.contains(event.target as Node)) close()
  }

  /** "Efter skatt" saved at once */
  function setAfter(after: boolean): void {
    if (!app.record) return
    const result = saveTax(app.record, { ...tax, after })
    if (!('refusal' in result)) void app.saveSettings(result)
  }

  /** Focuses the field once drawn, its text selected */
  function focus(input: HTMLInputElement): void {
    queueMicrotask(() => input.select())
  }
</script>

<svelte:window onpointerdown={onPress} />

<div class="row" bind:this={wrap}>
  <label class="check">
    <input type="checkbox" checked={tax.after} onchange={(event) => setAfter(event.currentTarget.checked)} />
    Efter skatt
  </label>
  <span class="label">Skatt och avgifter</span>
  {#if editing}
    <input
      class="tag field"
      class:warn={refused}
      type="text"
      aria-label="Skatt och avgifter"
      placeholder="0"
      bind:value={typed}
      oninput={() => (refused = false)}
      onkeydown={onKey}
      {@attach focus}
    />
  {:else}
    <button class="tag" type="button" bind:this={tag} onclick={open}>{percentText(tax.percent)} %</button>
  {/if}
</div>

<style>
  /* === Layout === */

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--menu-value-gap-inline);
    min-height: var(--menu-value-row);
    padding: var(--menu-value-padding);
    border-bottom: 1px dashed var(--menu-line);
  }

  .check {
    display: inline-flex;
    align-items: center;
    gap: var(--menu-check-gap);
    cursor: pointer;
  }

  .check input {
    width: var(--menu-check-size);
    height: var(--menu-check-size);
    margin: 0;
    accent-color: var(--profile-neon, var(--menu-text));
  }

  .label {
    margin-left: var(--menu-note-gap);
    color: var(--menu-text-muted);
  }

  /* The percentage as a tag, and its field in the same border, drawn as an edit's "paus" tag */
  .tag {
    padding: var(--entry-tag-padding);
    border: 1px solid var(--menu-line);
    border-radius: var(--entry-tag-radius);
    background: none;
    color: var(--menu-text);
    font: inherit;
    font-size: var(--entry-tag-size);
    font-variant-numeric: tabular-nums;
  }

  button.tag {
    cursor: pointer;
  }

  .field {
    width: 5ch;
    box-sizing: content-box;
    outline: none;
    field-sizing: content;
    min-width: 2ch;
  }

  /* === States === */

  button.tag:hover {
    border-color: var(--menu-text);
  }

  .field.warn {
    border-color: var(--edit-remove);
    color: var(--edit-remove);
  }
</style>
