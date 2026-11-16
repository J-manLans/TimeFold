<!--
  The onboarding ("A first install starts fresh or imports"), in the menu's panel locked open: one centred prompt at a
  time, fading from one to the next. First "Starta nytt" and "Importera", the latter greyed out until Handover with its
  tip, "från fil"; then "Nuvarande flextimmar?" and "Profilnamn?", typed with no field, only the caret. The balance
  takes only a duration's shape and wears where it stands; the dashboard counts to it on Enter. The name is typed in
  the balance's colour. Esc goes back a step. After the name the record is saved and the ending plays: the text fades,
  the panel turns to frost and folds, the light sweeps across the buttons, and the letter arrives last.
-->
<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { app } from '$lib/app.svelte'
  import TipLabel from '$lib/components/controls/TipLabel.svelte'
  import { overColour } from '$lib/modules/colours'
  import { BALANCE, durationText, fitsShape, readDuration } from '$lib/modules/timeInput'

  // === State ===

  type Step = 'choice' | 'balance' | 'name'

  let step = $state<Step | null>('choice')
  let balanceText = $state('')
  let name = $state('')
  let fresh: HTMLButtonElement | undefined = $state()
  let balanceInput: HTMLInputElement | undefined = $state()
  let nameInput: HTMLInputElement | undefined = $state()
  let importButton: HTMLButtonElement | undefined = $state()
  /** Where the pointer is over "Importera", and whether it has keyboard focus, for its tip */
  let point = $state<{ x: number; y: number } | null>(null)
  let importFocused = $state(false)

  let profile = $derived(app.record?.profiles[0])
  let minutes = $derived(readDuration(balanceText, BALANCE))
  let reading = $derived(minutes === null ? '' : durationText(minutes, true))
  // The colour of where the balance stands: the over colour in plus, the base at 0 or below; while it is half typed,
  // a leading minus is below and any other digit but 0 is plus
  let plus = $derived(minutes !== null ? minutes > 0 : !balanceText.startsWith('-') && /[1-9]/.test(balanceText))
  let colour = $derived(profile ? (plus ? overColour(profile.hue) : profile.base) : undefined)

  // === Logic ===

  onMount(() => {
    fresh?.focus()
  })

  // === Helpers ===

  /** Shows a step and puts the focus in it. Used by the buttons and the keys */
  async function show(next: Step | null): Promise<void> {
    step = next
    await tick()
    if (next === 'choice') fresh?.focus()
    if (next === 'balance') balanceInput?.focus()
    if (next === 'name') nameInput?.focus()
  }

  /** A keystroke or paste that would break the balance's shape is undone. Used on the balance's input */
  function keepShape(event: Event): void {
    const input = event.currentTarget as HTMLInputElement
    if (fitsShape(input.value, BALANCE)) {
      balanceText = input.value
      return
    }
    const caret = Math.max(0, (input.selectionStart ?? 0) - (input.value.length - balanceText.length))
    input.value = balanceText
    input.setSelectionRange(caret, caret)
  }

  /** Enter moves on from a whole balance, counting the dashboard to it; Esc goes back to the two buttons */
  function balanceKeys(event: KeyboardEvent): void {
    if (event.key === 'Enter' && minutes !== null) {
      app.setOpening(minutes)
      void show('name')
    }
    if (event.key === 'Escape') {
      app.setOpening(0)
      void show('choice')
    }
  }

  /** Enter finishes once a name is typed; Esc goes back to the balance, as it was */
  function nameKeys(event: KeyboardEvent): void {
    if (event.key === 'Enter' && name.trim() !== '') void finish(name.trim())
    if (event.key === 'Escape') void show('balance')
  }

  /**
   * The ending, on the tokens' times: the text fades, the panel turns to frost, folds into its button, the light
   * sweeps across the buttons, and the letter fades in --onboarding-letter-delay after the light is gone (a negative
   * delay overlaps); the app is ready once both are done. Used once the name is entered
   */
  async function finish(entered: string): Promise<void> {
    void show(null)
    await app.finishStart(entered)
    const fade = time('--speed-ui')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const gone = still ? 0 : time('--onboarding-sweep') + time('--onboarding-sweep-fade')
    const sweepAt = fade + time('--onboarding-frost-in') + fade + time('--onboarding-sweep-delay')
    const letterAt = sweepAt + Math.max(0, gone + time('--onboarding-letter-delay'))
    const readyAt = Math.max(sweepAt + gone + 2 * fade, letterAt + time('--onboarding-letter-fade'))
    setTimeout(() => app.stepWelcome({ frosted: true }), fade)
    setTimeout(() => app.stepWelcome({ folded: true }), fade + time('--onboarding-frost-in'))
    setTimeout(() => app.stepWelcome({ sweeping: true }), sweepAt)
    setTimeout(() => app.stepWelcome({ letter: true }), letterAt)
    setTimeout(() => app.endWelcome(), readyAt)
  }

  /** A time token in milliseconds; negative times are kept. Used by `finish` */
  function time(name: string): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) * 1000 || 0
  }

  /** The pointer over "Importera", for its tip; a touch shows none. Used on pointer enter and move */
  function follow(event: PointerEvent): void {
    if (event.pointerType !== 'touch') point = { x: event.clientX, y: event.clientY }
  }
</script>

<div class="onboarding">
  <div class="step choices" class:on={step === 'choice'} inert={step !== 'choice'}>
    <button class="choice" type="button" bind:this={fresh} onclick={() => show('balance')}>
      <span class="label">Starta nytt</span>
    </button>
    <!-- TODO: Importera works in Handover; until then greyed out, its tip still showing -->
    <button
      class="choice"
      type="button"
      aria-disabled="true"
      bind:this={importButton}
      onpointerenter={follow}
      onpointermove={follow}
      onpointerleave={() => (point = null)}
      onfocus={() => (importFocused = importButton?.matches(':focus-visible') ?? false)}
      onblur={() => (importFocused = false)}
    >
      <span class="label">Importera</span>
    </button>
  </div>

  <div class="step" class:on={step === 'balance'} inert={step !== 'balance'}>
    <label class="prompt" for="onboarding-balance">Nuvarande flextimmar?</label>
    <input
      id="onboarding-balance"
      class="lone balance"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      spellcheck="false"
      value={balanceText}
      style:color={colour}
      bind:this={balanceInput}
      oninput={keepShape}
      onkeydown={balanceKeys}
    />
    <span class="reading">{reading}</span>
  </div>

  <div class="step" class:on={step === 'name'} inert={step !== 'name'}>
    <label class="prompt" for="onboarding-name">Profilnamn?</label>
    <input
      id="onboarding-name"
      class="lone name"
      type="text"
      autocomplete="off"
      spellcheck="false"
      style:color={colour}
      bind:value={name}
      bind:this={nameInput}
      onkeydown={nameKeys}
    />
  </div>
</div>
<TipLabel text="från fil" {point} anchor={importFocused ? (importButton ?? null) : null} />

<style>
  /* === Layout === */

  .onboarding {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }

  /* The steps lie on one another; only the one shown takes the pointer */
  .step {
    grid-area: 1 / 1;
    display: grid;
    justify-items: center;
    gap: var(--onboarding-gap);
    width: min(var(--onboarding-width), 80%);
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  .choices {
    grid-template-columns: max-content max-content;
    justify-content: center;
    gap: var(--block-gap);
    width: auto;
  }

  /* "Starta jobb"'s height and font, scaled, each as wide as its words */
  .choice {
    background-attachment: fixed;
    height: calc(var(--start-height) * var(--onboarding-choice-scale));
    padding: 0 calc(var(--onboarding-choice-padding) * var(--onboarding-choice-scale));
    border: 0;
    border-radius: var(--radius-button);
    background-color: var(--button-background);
    color: var(--button-text);
    box-shadow: var(--shadow-button);
    cursor: pointer;
    transition: background-color var(--speed-ui) ease;
  }

  .choice .label {
    font-family: var(--font-display);
    font-size: calc(var(--start-text-size) * var(--onboarding-choice-scale));
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    letter-spacing: var(--start-tracking);
    line-height: 1;
    text-transform: uppercase;
  }

  .prompt {
    color: var(--menu-text);
    font-size: var(--onboarding-prompt-size);
    font-weight: var(--onboarding-prompt-weight);
    letter-spacing: normal;
  }

  /* No field: only the caret shows */
  .lone {
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: center;
    letter-spacing: normal;
  }

  .balance {
    font-family: var(--font-display);
    font-size: var(--balance-text-size);
    font-stretch: var(--font-display-stretch);
    font-weight: var(--font-display-weight);
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  }

  .name {
    font-family: var(--font-text);
    font-size: var(--onboarding-name-size);
  }

  .reading {
    min-height: 1.3em;
    color: var(--menu-text-muted);
    font-size: var(--onboarding-reading-size);
    letter-spacing: normal;
  }

  /* === States === */

  .step.on {
    opacity: 1;
  }

  .lone:focus,
  .lone:focus-visible {
    outline: none;
  }

  .choice:not([aria-disabled='true']):hover {
    background-color: var(--button-background-hover);
  }

  .choice[aria-disabled='true'] {
    opacity: var(--opacity-disabled);
    cursor: default;
  }
</style>
