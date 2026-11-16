<!--
  The undo: a small disc beside "Lägg till paus" that wakes for --undo-time after a start or a stop, under an afterglow in
  the profile's colour fading to nothing, and reverses that click when pressed ("The last click can be undone for a
  few seconds"). Faded when there is nothing to undo. Awake or not is read from the clock, so a window hidden past the
  time shows it faded on return.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from './Disc.svelte'

  // === State ===

  let awake = $state(false)

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

  // === Helpers ===

  /** How long a click can be undone, from the --undo-time token. Used to know when the undo falls asleep */
  function undoSeconds(): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--undo-time')) || 15
  }
</script>

<button class="undo" type="button" disabled={!awake} aria-label="Ångra senaste klicket" onclick={() => app.undo()}>
  <Disc size="var(--small-disc-size)" dent="var(--small-disc-dent)">
    {#key app.lastClick}
      <span class="afterglow" class:live={awake}></span>
    {/key}
    <span class="arrow" aria-hidden="true">↶</span>
  </Disc>
</button>

<style>
  /* === Layout === */

  .undo {
    display: grid;
    place-items: center;
    width: var(--undo-button-size);
    height: var(--undo-button-size);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--button-text);
    cursor: pointer;
    transition: opacity var(--speed-ui) ease;
  }

  /* The afterglow in the profile's colour, over the disc only, under the arrow */
  .afterglow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--profile-over);
    opacity: 0;
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

  @keyframes fade {
    from {
      opacity: var(--undo-afterglow);
    }

    to {
      opacity: 0;
    }
  }
</style>
