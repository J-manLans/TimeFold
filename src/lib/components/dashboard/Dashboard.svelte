<!--
  The dashboard ("The main screen has a controls side and a dashboard"): the living side, a dark panel in both themes,
  laying out its figures from the top: the balance with the flex bar, then the recent entries. A thin line divides it
  from the controls side; in a narrow window it stacks on top, the line under it. It gives its figures the panel's
  colour, which the dimmed colours are worked out against, and the wheel's base, which a new row lights in.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import FlexBar from './FlexBar.svelte'
  import RecentEntries from './RecentEntries.svelte'

  // === State ===

  let side: HTMLElement | undefined = $state()
  /** Whether the computer asks for the dark theme, which "System" follows */
  let systemDark = $state(matchMedia('(prefers-color-scheme: dark)').matches)

  // The panel's colour as the theme shows it now: read again whenever the theme or the computer's choice changes
  let panel = $derived.by(() => {
    void app.theme
    void systemDark
    return side ? hexOf(getComputedStyle(side).backgroundColor) : null
  })

  // The wheel's base: grey while the balance profile is on screen, else the profile on screen's base ("The ceiling
  // wheel")
  let onScreen = $derived(app.record?.profiles.find((p) => p.id === app.onScreen))
  let wheelBase = $derived(
    onScreen === undefined || onScreen.expectedMinutes !== undefined ? 'var(--wheel-balance)' : onScreen.base,
  )

  // === Logic ===

  $effect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)')
    const follow = (): void => {
      systemDark = query.matches
    }
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  })

  // === Helpers ===

  /**
   * A computed colour, rgb() or color(srgb …), as #rrggbb. Used to hand the panel's colour to the colour rule;
   * null when the engine writes it some other way
   */
  function hexOf(colour: string): string | null {
    const srgb = colour.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
    const rgb = colour.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
    const channels = srgb ? srgb.slice(1).map((v) => Number(v) * 255) : rgb ? rgb.slice(1).map(Number) : null
    if (channels === null) return null
    return `#${channels.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
  }
</script>

<section class="dashboard" aria-label="Översikt" style:--wheel-base={wheelBase} bind:this={side}>
  <div class="divider"></div>
  {#if panel}
    <FlexBar {panel} />
  {/if}
  <RecentEntries />
</section>

<style>
  /* === Layout === */

  .dashboard {
    position: relative;
    display: grid;
    align-content: start;
    gap: var(--dashboard-gap);
    padding: var(--dashboard-padding);
    overflow-y: auto;
    background: var(--dashboard-background);
    color: var(--dashboard-text);
    font-family: var(--font-text);
    font-weight: var(--dashboard-font-weight);
    letter-spacing: normal;
  }

  .divider {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--divider-width);
    background: var(--dashboard-line);
    pointer-events: none;
  }

  /* A narrow window stacks the dashboard over the controls, the line under it; CSS cannot read a token here */
  @media (max-width: 640px) {
    .dashboard {
      order: -1;
      min-height: 50vh;
    }

    .divider {
      top: auto;
      right: 0;
      width: auto;
      height: var(--divider-width);
    }
  }
</style>
