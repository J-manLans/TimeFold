<!--
  A value saved for a later day, as a quiet note in the note size after the value in force ("2 100 € från 1 dec"), with
  a small "×" that takes it back. The "×" asks once: the first click turns it red, back when the focus goes elsewhere;
  the second takes the value back, or shows in the warning red why it is refused:
  <ComingNote text="2 100 € från 1 dec" cancel={() => null} />
-->
<script lang="ts">
  // === Props ===

  let {
    text,
    cancel,
  }: {
    /** The coming value and its day: "40h / vecka från 1 dec" */
    text: string
    /** Takes it back; gives the reason it is refused, or null once taken back */
    cancel: () => string | null
  } = $props()

  // === State ===

  let asking = $state(false)
  let refusal = $state('')

  // === Helpers ===

  /** First click asks, second takes it back */
  function click(): void {
    if (!asking) {
      asking = true
      return
    }
    asking = false
    refusal = cancel() ?? ''
  }
</script>

<span class="coming">
  {text}
  <button
    class:asking
    type="button"
    aria-label="Ta bort {text}"
    onclick={click}
    onfocusout={() => {
      asking = false
      refusal = ''
    }}>×</button
  >
  {#if refusal}<span class="warn">{refusal}</span>{/if}
</span>

<style>
  /* === Layout === */

  .coming {
    color: var(--menu-text-muted);
    font-size: var(--text-size-label);
    white-space: nowrap;
  }

  button {
    padding: 0 var(--spacing-xs);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    background: none;
    color: var(--menu-text-muted);
    font: inherit;
    cursor: pointer;
  }

  .warn {
    margin-left: var(--spacing-lg);
    color: var(--edit-remove);
    font-size: var(--text-size-label);
  }

  /* === States === */

  button:hover {
    color: var(--menu-text);
  }

  /* Asking once: the "×" in the removal red, in a red border */
  .asking,
  .asking:hover {
    border-color: var(--edit-remove);
    color: var(--edit-remove);
  }
</style>
