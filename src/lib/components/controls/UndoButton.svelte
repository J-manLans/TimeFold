<!--
  The undo: a small disc beside "Lägg till paus" that wakes for --undo-time after a start or a stop, under an afterglow in
  the profile's colour fading to nothing, and reverses that click when pressed ("The last click can be undone for a
  few seconds"). Hovered or focused while awake, its tip says what it would undo ("Ångra: stopp 15:40").
  Faded when there is nothing to undo. Awake or not is read from the clock, so a window hidden past the
  time shows it faded on return.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from '$lib/components/shared/Disc.svelte'
  import { clickLabel } from '$lib/modules/controls/clock'
  import TipLabel from './TipLabel.svelte'

  // === State ===

  let awake = $state(false)
  let button: HTMLButtonElement | undefined = $state()
  /** Where the pointer is over the button, for the label */
  let point = $state<{ x: number; y: number } | null>(null)
  /** Whether the button has keyboard focus, which shows the label under it */
  let focused = $state(false)
  let label = $derived(awake && app.record && app.lastClick ? `Ångra: ${clickLabel(app.record, app.lastClick)}` : '')

  // === Logic ===

  // A new click wakes the undo until its time is up; returning to a hidden window checks the clock again
  $effect(() => {
    const click = app.lastClick
    if (click === null) {
      awake = false
      return
    }
    const until = Date.parse(click.at) + undoSeconds() * 1000
    const check = (): void => {
      awake = Date.now() < until
    }
    check()
    const timer = setTimeout(check, Math.max(0, until - Date.now()))
    document.addEventListener('visibilitychange', check)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', check)
    }
  })

  // A button that falls asleep may miss the pointer leaving it, so the label's place is dropped with it
  $effect(() => {
    if (!awake) point = null
  })

  // === Helpers ===

  /** The pointer over the button, for the label; a touch shows none. Used on pointer enter and move */
  function follow(event: PointerEvent): void {
    if (event.pointerType !== 'touch') point = { x: event.clientX, y: event.clientY }
  }

  /** Keyboard focus anchors the label under the button; a mouse click does not. Used on focus */
  function focus(): void {
    focused = button?.matches(':focus-visible') ?? false
  }

  /** How long a click can be undone, from the --undo-time token. Used to know when the undo falls asleep */
  function undoSeconds(): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--undo-time')) || 15
  }
</script>

<button
  class="undo"
  type="button"
  disabled={!awake}
  aria-label="Ångra senaste klicket"
  bind:this={button}
  onclick={() => app.undo()}
  onpointerenter={follow}
  onpointermove={follow}
  onpointerleave={() => (point = null)}
  onfocus={focus}
  onblur={() => (focused = false)}
>
  <Disc size="var(--small-disc-size)" dent="var(--small-disc-dent)" light={awake ? '1' : undefined}>
    {#key app.lastClick}
      <span class="afterglow" class:live={awake}></span>
    {/key}
    {#if awake}
      <span class="light"></span>
    {/if}
    <span class="arrow" aria-hidden="true">↶</span>
  </Disc>
</button>
<TipLabel text={label} {point} anchor={focused ? (button ?? null) : null} />

<style>
  /* === Layout === */

  .undo {
    --button-size: 36px;
    --afterglow: 0.65; /* how strong the neon's afterglow is when the undo wakes; it fades to nothing */

    display: grid;
    place-items: center;
    width: var(--button-size);
    height: var(--button-size);
    padding: 0;
    border: 0;
    border-radius: var(--radius-full);
    background: none;
    color: var(--button-text);
    cursor: pointer;
    transition: opacity var(--speed-ui) ease;
  }

  /* The afterglow in the profile's colour, over the disc only, under the arrow */
  .afterglow {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-full);
    background: var(--profile-neon);
    opacity: 0;
    pointer-events: none;
  }

  /* The afterglow would hide the light on the disc, so the light lies on top of it too, under the arrow */
  .light {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-full);
    background-image: var(--pointer-light);
    background-attachment: fixed;
    pointer-events: none;
  }

  .arrow {
    position: relative;
  }

  /* === States === */

  .undo:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }

  .afterglow.live {
    animation: fade var(--undo-time) linear forwards;
  }

  /* Stilla: the afterglow holds at its strength for as long as the undo is live */
  :global(:root[data-still]) .afterglow.live {
    animation: none;
    opacity: var(--afterglow);
  }

  @keyframes fade {
    from {
      opacity: var(--afterglow);
    }

    to {
      opacity: 0;
    }
  }
</style>
