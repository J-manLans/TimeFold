<!--
  The motion switch ("Motion can be switched off in the app"): a small disc in its dent, drawn as the theme button,
  with three staggered speed lines for Animerat that fold into one flat line for Stilla, and a label naming the state
  in force. Folding is instant and opening eases, since Stilla takes the transitions away in the same moment Animerat
  gives them back. Its disc catches the pointer light in Stilla too. Each click switches to the other and saves it.
  In the menu's heading with its label, and in the onboarding's note, which shows the label only once it has been
  clicked: <MotionButton label={clicked} onswitch={() => (clicked = true)} />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import Disc from '$lib/components/shared/Disc.svelte'
  import { motionName } from '$lib/modules/menu/settings'

  // === Props ===

  let {
    label = true,
    onswitch,
  }: {
    /** Whether the label naming the state in force shows after the button */
    label?: boolean
    /** Runs after each click, once the motion has switched */
    onswitch?: () => void
  } = $props()

  // === State ===

  let name = $derived(motionName(app.shownMotion))
</script>

<button
  class="motion"
  class:moving={app.shownMotion === 'on'}
  type="button"
  aria-label="Rörelse: {name}. Klicka för att byta."
  onclick={() => {
    void app.switchMotion()
    onswitch?.()
  }}
>
  <Disc size="var(--small-disc-size)" dent="var(--small-disc-dent)" light="1">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <line class="upper" x1="7" y1="12" x2="17" y2="12" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line class="lower" x1="9" y1="12" x2="20" y2="12" />
    </svg>
  </Disc>
</button>
{#if label}
  <!-- Both words lie on one another, only the one in force showing, so the label is always as wide as the longer -->
  <span class="name" aria-hidden="true">
    <span class:on={app.shownMotion === 'on'}>{motionName('on')}</span>
    <span class:on={app.shownMotion === 'off'}>{motionName('off')}</span>
  </span>
{/if}

<style>
  /* === Layout === */

  .motion {
    display: grid;
    flex: none;
    place-items: center;
    width: var(--button-icon-size);
    height: var(--button-icon-size);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--button-text);
    cursor: pointer;
  }

  .icon {
    position: relative;
    width: var(--theme-icon-size);
    height: var(--theme-icon-size);
    stroke: currentColor;
    stroke-width: var(--theme-icon-stroke);
    stroke-linecap: round;
  }

  /* Folded onto the middle line, the three read as one flat line */
  .icon line {
    transition: transform var(--speed-ui) ease;
  }

  .name {
    display: inline-grid;
    font-size: var(--text-size-label);
    color: var(--menu-text-muted);
  }

  .name > span {
    grid-area: 1 / 1;
    visibility: hidden;
  }

  /* === States === */

  .name > .on {
    visibility: visible;
  }

  /* Animerat: the lines spread out above and below, staggered */
  .moving .upper {
    transform: translate(-1px, calc(-1 * var(--motion-line-spread)));
  }

  .moving .lower {
    transform: translate(2px, var(--motion-line-spread));
  }

  /* Stilla takes the pointer light off every other button; this disc keeps it, a hint of what Animerat brings */
  :global(:root[data-still]) :global(.controls.lit) .motion {
    --glow-strength: 1;
  }
</style>
