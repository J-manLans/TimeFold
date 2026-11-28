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
  import { field, widthOf } from '$lib/modules/shared/field'

  // === State ===

  const key = crypto.randomUUID()
  let tax = $derived(app.record?.tax ?? { after: false, percent: 25 })
  let editing = $derived(app.openValue === key)
  let typed = $state('')
  let refused = $state(false)
  let tag: HTMLButtonElement | undefined = $state()
  /** The width of the tag the field replaced, which the field keeps while it is typed in */
  let tagWidth = $state('')

  // === Helpers ===

  /** A percentage as the Swedish write it, a comma for the point: 27.5 is "27,5" */
  function percentText(percent: number): string {
    return String(percent).replace('.', ',')
  }

  /** The tag turned into its field */
  function open(): void {
    tagWidth = widthOf(tag ?? null)
    typed = percentText(tax.percent)
    refused = false
    app.openValue = key
  }

  /** The field back to the tag; the focus on it unless the field was left for somewhere else */
  function close(refocus = true): void {
    if (app.openValue === key) app.openValue = null
    if (refocus) queueMicrotask(() => tag?.focus())
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

  /** "Efter skatt" saved at once */
  function setAfter(after: boolean): void {
    if (!app.record) return
    const result = saveTax(app.record, { ...tax, after })
    if (!('refusal' in result)) void app.saveSettings(result)
  }
</script>

<div class="row">
  <label class="check">
    <input type="checkbox" checked={tax.after} onchange={(event) => setAfter(event.currentTarget.checked)} />
    Efter skatt
  </label>
  <span class="label">Skatt och avgifter</span>
  {#if editing}
    <input
      class="tag"
      class:warn={refused}
      style:width={tagWidth}
      type="text"
      aria-label="Skatt och avgifter"
      placeholder="0"
      bind:value={typed}
      oninput={() => (refused = false)}
      {@attach field({ keep, drop: close })}
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
    gap: var(--spacing-2);
    min-height: var(--menu-value-row);
    padding: var(--spacing-2) 0;
    border-bottom: 1px dashed var(--menu-line);
  }

  .check {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
    cursor: pointer;
  }

  /* Drawn as the app's own, so every engine shows it alike (WebKitGTK's own put its mark off centre): a small square in
     the menu's line; checked, filled with the neon of the profile on screen, its mark white, cut out of a square
     centred in it */
  .check input {
    display: grid;
    flex: none;
    width: var(--menu-check-size);
    height: var(--menu-check-size);
    margin: 0;
    border: 1px solid var(--menu-button-line);
    border-radius: var(--radius-sm);
    background: none;
    cursor: pointer;
    appearance: none;
  }

  .check input:checked {
    border-color: var(--profile-neon, var(--menu-text));
    background: var(--profile-neon, var(--menu-text));
  }

  .check input:checked::after {
    content: '';
    background: var(--menu-check-ink);
    mask: var(--menu-check-mark) center / var(--menu-check-mark-size) no-repeat;
  }

  .label {
    margin-left: var(--spacing-3);
    color: var(--menu-text-muted);
  }

  /* === States === */

  input.tag.warn {
    border-color: var(--edit-remove);
    color: var(--edit-remove);
  }
</style>
