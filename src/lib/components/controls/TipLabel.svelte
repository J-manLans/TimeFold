<!--
  The tip: the small label that follows the pointer over a button, to its right, on a see-through dark background
  edged in a profile's colour ("One start/stop button and a profile list"). It shows at once when the pointer enters,
  follows it, and goes when it leaves; with keyboard focus it shows under the button instead. Used by the undo
  ("Ångra: stopp 15:40"), and by the start button's warning in Profiles: <TipLabel text="Ångra: start 08:02" {point}
  anchor={focused ? button : null} />
-->
<script lang="ts">
  // === Props ===

  let {
    text,
    point,
    anchor,
    colour = 'var(--profile-neon)',
  }: {
    /** What the label says; empty hides it */
    text: string
    /** Where the pointer is over the button, or null when it is not */
    point: { x: number; y: number } | null
    /** The button with keyboard focus, to show the label under it when the pointer is away, or null */
    anchor: HTMLElement | null
    /** The edge's colour: the profile on screen's neon unless another is given */
    colour?: string
  } = $props()

  // === State ===

  // Right of the pointer and centred on its height when it is over the button, else under the focused button, else
  // nowhere
  let place = $derived.by(() => {
    if (point)
      return {
        left: `calc(${point.x}px + var(--tip-offset-x))`,
        top: `calc(${point.y}px + var(--tip-offset-y))`,
        shift: '-50%',
      }
    if (anchor) {
      const box = anchor.getBoundingClientRect()
      return { left: `${box.left}px`, top: `calc(${box.bottom}px + var(--spacing-1-5))`, shift: '0' }
    }
    return null
  })
  let shown = $derived(text !== '' && place !== null)

  // While hidden, the label keeps its last place and text, so it fades out where it stood rather than jumping to the
  // page's flow and fading there empty
  let kept: { text: string; place: { left: string; top: string; shift: string } | null } = { text: '', place: null }
  let held = $derived.by(() => {
    if (shown) kept = { text, place }
    return kept
  })
</script>

<div
  class="label"
  class:show={shown}
  role="tooltip"
  style:left={held.place?.left}
  style:top={held.place?.top}
  style:translate={held.place ? `0 ${held.place.shift}` : undefined}
  style:--edge={colour}
>
  {held.text}
</div>

<style>
  /* === Layout === */

  .label {
    position: fixed;
    z-index: 50;
    padding: var(--spacing-1) var(--spacing-2);
    border: var(--tip-border-width) solid var(--edge);
    border-radius: var(--radius-md);
    background: var(--tip-background);
    backdrop-filter: blur(var(--tip-blur));
    color: var(--tip-text);
    font-size: var(--text-size-body);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  /* === States === */

  .label.show {
    opacity: 1;
  }
</style>
