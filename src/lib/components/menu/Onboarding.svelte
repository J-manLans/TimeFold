<!--
  The onboarding ("A first install starts fresh or imports"), in the menu's panel locked open: one centred prompt at a
  time, the one leaving fading out before the next fades in. First "Starta nytt" and "Importera", the latter greyed out until Handover with its
  tip, "från fil", and under them, when the app opens the onboarding in Stilla, a note with the motion switch ("Motion
  can be switched off in the app"); once its switch is clicked, the sentence gives way to the switch's label, as in
  the menu; then "Nuvarande flextimmar?" and "Profilnamn?", typed with no field, only the caret. The balance
  takes only a duration's shape and wears where it stands; the dashboard counts to it on Enter. The name is typed in
  the balance's colour. Esc goes back a step. After the name the record is saved and the ending plays: the text fades,
  the panel turns to frost and folds, the light sweeps across the buttons, and the letter arrives last.
-->
<script lang="ts">
  import { onMount, tick, untrack } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { neonColour } from '$lib/modules/shared/colours'
  import { BALANCE, durationText, fitsShape, readDuration } from '$lib/modules/shared/timeInput'
  import ChoiceButton from '$lib/components/shared/ChoiceButton.svelte'
  import MotionButton from './MotionButton.svelte'

  // === Props ===

  type Step = 'choice' | 'balance' | 'name'

  let {
    from = 'choice',
  }: {
    /** The step it opens on: the two buttons, or the balance when the recovery screen's "Starta nytt" led here */
    from?: Step
  } = $props()

  // === State ===

  // The step it opened on is read once; from then on the keys and buttons move it
  let step = $state<Step | null>(untrack(() => from))
  let balanceText = $state('')
  let name = $state('')
  let fresh: ChoiceButton | undefined = $state()
  let balanceInput: HTMLInputElement | undefined = $state()
  let nameInput: HTMLInputElement | undefined = $state()
  // Read once, as the onboarding opens, so the note stays when its switch is clicked
  const stillAtStart = untrack(() => app.still)
  // Whether the note's switch has been clicked, which turns its sentence into the switch's label for good
  let clicked = $state(false)

  let profile = $derived(app.record?.profiles[0])
  let minutes = $derived(readDuration(balanceText, BALANCE))
  let reading = $derived(minutes === null ? '' : durationText(minutes, true))
  // The colour of where the balance stands: the neon in plus, the base at 0 or below; while it is half typed,
  // a leading minus is below and any other digit but 0 is plus
  let plus = $derived(minutes !== null ? minutes > 0 : !balanceText.startsWith('-') && /[1-9]/.test(balanceText))
  let colour = $derived(profile ? (plus ? neonColour(profile.hue) : profile.base) : undefined)

  // === Logic ===

  onMount(() => {
    void show(step)
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
    const gone = time('--onboarding-sweep') + time('--onboarding-sweep-fade')
    const sweepAt = fade + time('--onboarding-frost-in') + fade + time('--onboarding-sweep-delay')
    const letterAt = sweepAt + Math.max(0, gone + time('--onboarding-letter-delay'))
    const readyAt = Math.max(sweepAt + gone + 2 * fade, letterAt + time('--onboarding-letter-fade'))
    setTimeout(() => app.stepPanel({ frosted: true }), fade)
    setTimeout(() => app.stepPanel({ folded: true }), fade + time('--onboarding-frost-in'))
    setTimeout(() => app.stepPanel({ sweeping: true }), sweepAt)
    setTimeout(() => app.stepPanel({ letter: true }), letterAt)
    setTimeout(() => app.unlock(), readyAt)
  }

  /**
   * A time token in milliseconds; negative times are kept. 0 in Stilla, so the ending's
   * steps all land at once, in order. Used by `finish`
   */
  function time(name: string): number {
    if (app.still) return 0
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) * 1000 || 0
  }
</script>

<div class="onboarding">
  <div class="step choices" class:on={step === 'choice'} inert={step !== 'choice'}>
    <ChoiceButton label="Starta nytt" onclick={() => show('balance')} bind:this={fresh} />
    <!-- TODO: Importera works in Handover; until then greyed out, its tip still showing -->
    <ChoiceButton label="Importera" greyed tip="från fil" />
    {#if stillAtStart}
      <div class="note">
        <MotionButton label={clicked} onswitch={() => (clicked = true)} />
        <p class:gone={clicked}>
          Appen är i stilla läge och fungerar precis som den ska. Vill du ha lite mer flair, slå på knappen.
        </p>
      </div>
    {/if}
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
    visibility: hidden;
    transition:
      opacity var(--onboarding-step-fade) ease,
      visibility 0s linear var(--onboarding-step-fade);
  }

  .choices {
    grid-template-columns: max-content max-content;
    justify-content: center;
    gap: var(--block-gap);
    width: auto;
  }

  /* The motion note: as wide as the two choices together, the switch centred on the words' height */
  .note {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: var(--onboarding-note-gap);
    width: 0;
    min-width: 100%;
    margin-top: calc(var(--onboarding-note-space) - var(--block-gap));
  }

  /* The sentence and, once clicked, the switch's label share a cell; the sentence keeps its room, so nothing moves */
  .note p,
  .note :global(.name) {
    grid-area: 1 / 2;
    justify-self: start;
  }

  .note p {
    margin: 0;
    color: var(--menu-text-muted);
    font-size: var(--text-size-note);
    line-height: var(--onboarding-note-line);
    text-wrap: pretty;
  }

  .note p.gone {
    visibility: hidden;
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

  /* The step shown waits for the one leaving to be gone, then fades in: no cross-fade. The one leaving turns hidden
     as its fade ends, which makes the window redraw it: on Linux the last frame of a fade can otherwise stay on
     screen. The one shown turns visible at once, still at opacity 0, so its field can take the focus */
  /* A step leaving drops its buttons' pointer light and its fixed attachment, which WebKitGTK draws apart and
     otherwise leaves on screen on Linux after the fade */
  .step:not(.on) :global(.choice) {
    background-image: none;
    background-attachment: scroll;
  }

  /* The two buttons leave at once, with no fade: WebKitGTK on Linux leaves the focus ring's spot undrawn after a fade,
     and a change with no animation it always draws in full */
  .step.choices:not(.on) {
    transition: none;
  }

  .step.on {
    opacity: 1;
    visibility: visible;
    transition:
      opacity var(--onboarding-step-fade) ease var(--onboarding-step-fade),
      visibility 0s;
  }

  .lone:focus,
  .lone:focus-visible {
    outline: none;
  }
</style>
