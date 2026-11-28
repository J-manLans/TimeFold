<!--
  The dashboard ("The main screen has a controls side and a dashboard"): the living side, a dark panel in both themes,
  laying out its figures from the top: the balance with the flex bar, the ceiling wheel with the pay estimate, then the
  recent entries; while a copy is offered at recovery, a breathing "KOPIA" label above them. A thin line divides it
  from the controls side; in a narrow window it stacks on top, the line under it. It gives its figures the panel's
  colour, which the dimmed colours are worked out against, and the wheel's base, which a new row lights in.
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { dayLabel } from '$lib/modules/shared/dates'
  import CeilingWheel from './CeilingWheel.svelte'
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

<section
  class="dashboard"
  data-surface="dashboard"
  aria-label="Översikt"
  style:--wheel-base={wheelBase}
  inert={app.panel !== null || app.late !== null}
  bind:this={side}
>
  <div class="divider"></div>
  {#if app.recovery === 'copy' && app.copyDay !== null && !app.panel?.folded}
    <!-- While the copy is offered, the dashboard shows it ("A record that cannot be read offers the newest copy") -->
    <span class="copy caps">Kopia · {dayLabel(app.copyDay)}</span>
  {/if}
  {#if panel}
    <FlexBar {panel} />
    <CeilingWheel {panel} />
  {/if}
  <RecentEntries />
</section>

<style>
  /* === Layout === */

  .dashboard {
    position: relative;
    display: grid;
    align-content: var(--dashboard-spread);
    gap: 0;
    padding: var(--spacing-6) var(--spacing-6) var(--spacing-4) var(--spacing-8);
    overflow-y: auto;
    background: var(--dashboard-background);
    color: var(--dashboard-text);
    font-family: var(--font-text);
    font-weight: var(--dashboard-font-weight);
    letter-spacing: normal;
  }

  /* The copy's label, breathing into the colour of where the profile stands in it and back */
  .copy {
    justify-self: center;
    animation: breathe var(--recovery-breath) ease-in-out infinite;
  }

  /* Stilla: the label holds still in the colour it breathes into */
  :global(:root[data-still]) .copy {
    animation: none;
    color: var(--profile-state);
  }

  @keyframes breathe {
    50% {
      color: var(--profile-state);
    }
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

  /* Stacked (App.svelte), the dashboard sits over the controls, the line under it */
  :global(:where(:root[data-stacked])) .dashboard {
    order: -1;
  }

  :global(:where(:root[data-stacked])) .divider {
    top: auto;
    right: 0;
    width: auto;
    height: var(--divider-width);
  }
</style>
