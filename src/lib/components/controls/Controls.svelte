<!--
  The controls side: what the owner presses ("The main screen has a controls side and a dashboard"). From the top: the
  menu button's row, then centred the button block, the status line and the pause row with the undo, and at the bottom
  the prune line's room. The menu lies over it all, folded into its button until opened. A soft light follows the
  pointer over the side's buttons and discs; with the menu open it leaves what is under the frost. At the onboarding's
  end the light sweeps once across the button block by itself ("A first install starts fresh or imports").
-->
<script lang="ts">
  import { untrack } from 'svelte'
  import { app } from '$lib/app.svelte'
  import Menu from '$lib/components/menu/Menu.svelte'
  import { neonColour } from '$lib/modules/shared/colours'
  import ButtonBlock from './ButtonBlock.svelte'
  import LatePopup from './LatePopup.svelte'
  import PruneLine from './PruneLine.svelte'
  import StatusLine from './StatusLine.svelte'
  import UndoButton from './UndoButton.svelte'

  // === State ===

  // The profile on screen's accent, for what is happening now: the start ring, the status mark and the undo's afterglow
  let profile = $derived(app.record?.profiles.find((p) => p.id === app.onScreen))
  let neon = $derived(profile ? neonColour(profile.hue) : undefined)
  let menuOpen = $state(false)
  let side: HTMLElement | undefined = $state()
  let block: HTMLDivElement | undefined = $state()
  /** Whether the pointer is over the side, which fades the light in */
  let lit = $state(false)

  // === Logic ===

  // The pointer's place goes into two CSS variables, at most once a frame; a touch lights nothing
  let queued = false
  let x = 0
  let y = 0
  function follow(event: PointerEvent): void {
    if (event.pointerType === 'touch') return
    x = event.clientX
    y = event.clientY
    lit = true
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      side?.style.setProperty('--light-x', `${x}px`)
      side?.style.setProperty('--light-y', `${y}px`)
    })
  }

  // The onboarding's ending asks for the sweep once: it runs when the ending turns to sweeping, not again at its later
  // steps, which leave sweeping on
  let swept = false
  $effect(() => {
    const sweeping = app.panel?.sweeping ?? false
    if (sweeping && !swept) untrack(sweep)
    swept = sweeping
  })

  // === Helpers ===

  /**
   * The pointer light crossing the button block once, by itself: from above its middle on the left, arcing down to
   * below it on the right, quickest at first; small at the edges and largest at the middle; then shrinking to nothing
   * where it ends, so nothing can flash as it goes. Skipped when the system asks for reduced motion. Used once, at the
   * onboarding's end
   */
  function sweep(): void {
    if (!side || !block || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const host = side
    const tokens = getComputedStyle(document.documentElement)
    const number = (name: string): number => parseFloat(tokens.getPropertyValue(name)) || 0
    const reach = number('--glow-reach')
    const ends = number('--onboarding-sweep-ends')
    const grow = number('--onboarding-sweep-grow')
    const across = number('--onboarding-sweep') * 1000
    const away = number('--onboarding-sweep-fade') * 1000
    const box = block.getBoundingClientRect()
    const from = box.left - reach * ends
    const to = box.right + reach * ends
    const top = box.top + box.height / 2 - number('--onboarding-sweep-rise')
    const bottom = box.top + box.height / 2 + number('--onboarding-sweep-drop')
    const place = (x: number, y: number, size: number): void => {
      host.style.setProperty('--light-x', `${x}px`)
      host.style.setProperty('--light-y', `${y}px`)
      host.style.setProperty('--glow-reach', `${size}px`)
    }
    lit = true
    const start = performance.now()
    const cross = (now: number): void => {
      const k = Math.min(1, (now - start) / across)
      const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      place(
        from + (to - from) * eased,
        top + (bottom - top) * (1 - Math.pow(1 - eased, 2)),
        reach * (ends + (grow - ends) * Math.sin(Math.PI * eased)),
      )
      if (k < 1) requestAnimationFrame(cross)
      else requestAnimationFrame(shrink(performance.now()))
    }
    const shrink =
      (begun: number) =>
      (now: number): void => {
        const q = away > 0 ? Math.min(1, (now - begun) / away) : 1
        host.style.setProperty('--glow-reach', `${reach * ends * (1 - q)}px`)
        if (q < 1) {
          requestAnimationFrame(shrink(begun))
          return
        }
        lit = false
        setTimeout(() => host.style.removeProperty('--glow-reach'), 2 * number('--speed-ui') * 1000)
      }
    requestAnimationFrame(cross)
  }
</script>

<section
  class="controls"
  class:lit
  class:menu-open={menuOpen}
  aria-label="Kontroller"
  style:--profile-neon={neon}
  bind:this={side}
  onpointermove={follow}
  onpointerleave={() => (lit = false)}
>
  <!-- The menu lies over the whole side; the top row keeps the room its folded button sits in -->
  <div class="top"></div>

  <div class="centre" inert={app.panel !== null || app.late !== null}>
    <div bind:this={block}>
      <ButtonBlock />
    </div>
    <StatusLine />
    <div class="pause-row">
      <!-- TODO: "Lägg till paus" works in Phase 2 -->
      <button class="pause" type="button" disabled>Lägg till paus</button>
      <UndoButton />
    </div>
  </div>

  <div inert={app.panel !== null || app.late !== null}>
    <PruneLine />
  </div>

  <Menu bind:open={menuOpen} />

  <LatePopup />
</section>

<style>
  /* === Layout === */

  .controls {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-rows: var(--controls-top-height) 1fr auto;
    background: var(--controls-background);
    color: var(--controls-text);
    --light-x: -999px;
    --light-y: -999px;
    transition: --glow-strength var(--speed-ui) ease;
  }

  /* The pointer light ("The look: a fresh display face, mono text and soft buttons"): one light, which each surface
     that catches it paints its own slice of with background-attachment: fixed, so it flows across them. Worked out
     on every element, so each takes its own --glow-share: the profile disc catches less */
  .controls,
  .controls :global(*) {
    --pointer-light: radial-gradient(
      circle var(--glow-reach) at var(--light-x) var(--light-y),
      color-mix(in srgb, var(--glow-colour) calc(var(--glow-strength) * var(--glow-share, 1) * 100%), transparent),
      transparent
    );
  }

  .centre {
    display: grid;
    place-content: center;
    justify-items: center;
    gap: var(--controls-gap);
  }

  .pause-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--pause-row-gap);
    height: var(--pause-row-height);
  }

  .pause {
    background-attachment: fixed;
    height: var(--pause-height);
    padding: var(--pause-padding);
    border: 0;
    border-radius: var(--radius-button);
    background: var(--button-background);
    color: var(--button-text);
    box-shadow: var(--shadow-button);
    font: inherit;
    font-size: var(--pause-text-size);
    font-weight: var(--pause-font-weight);
  }

  /* === States === */

  .controls.lit {
    --glow-strength: 1;
  }

  /* With the menu open, the light leaves the buttons under its frost, which it would seem to shine through */
  .controls > :global(:not(.menu)) {
    transition: --glow-strength var(--speed-ui) ease;
  }

  .controls.menu-open > :global(:not(.menu)) {
    --glow-strength: 0;
  }

  .pause:not(:disabled) {
    background-image: var(--pointer-light);
  }

  .pause:disabled {
    opacity: var(--opacity-disabled);
  }

  @media (prefers-reduced-motion: reduce) {
    .controls.lit {
      --glow-strength: 0;
    }
  }
</style>
