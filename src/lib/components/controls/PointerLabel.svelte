<!--
  The small label that follows the pointer over a button, on a see-through dark background edged in a profile's
  colour ("One start/stop button and a profile list"). It shows at once when the pointer enters, follows it, and goes
  when it leaves; with keyboard focus it shows under the button instead. Used by the undo ("Ångra: stopp 15:40"), and
  by the start button's warning in Profiles: <PointerLabel text="Ångra: start 08:02" {point} anchor={focused ? button
  : null} />
-->
<script lang="ts">
  // === Props ===

  let {
    text,
    point,
    anchor,
    colour = 'var(--profile-over)',
  }: {
    /** What the label says; empty hides it */
    text: string
    /** Where the pointer is over the button, or null when it is not */
    point: { x: number; y: number } | null
    /** The button with keyboard focus, to show the label under it when the pointer is away, or null */
    anchor: HTMLElement | null
    /** The edge's colour: the profile on screen's over colour unless another is given */
    colour?: string
  } = $props()

  // === State ===

  // By the pointer when it is over the button, else under the focused button, else nowhere
  let place = $derived.by(() => {
    if (point)
      return { left: `calc(${point.x}px + var(--tip-offset-x))`, top: `calc(${point.y}px + var(--tip-offset-y))` }
    if (anchor) {
      const box = anchor.getBoundingClientRect()
      return { left: `${box.left}px`, top: `calc(${box.bottom}px + var(--tip-focus-gap))` }
    }
    return null
  })
</script>

<div
  class="label"
  class:show={text !== '' && place !== null}
  role="tooltip"
  style:left={place?.left}
  style:top={place?.top}
  style:--edge={colour}
>
  {text}
</div>

<style>
  /* === Layout === */

  .label {
    position: fixed;
    z-index: 50;
    padding: var(--tip-padding);
    border: var(--tip-border-width) solid var(--edge);
    border-radius: var(--radius-small);
    background: var(--tip-background);
    backdrop-filter: blur(var(--tip-blur));
    color: var(--tip-text);
    font-size: var(--tip-text-size);
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
