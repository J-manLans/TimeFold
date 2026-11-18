<!--
  A raised disc in the button's colour, lit by a soft glow toward its top, set in a see-through dent ("The look: a
  fresh display face, mono text and soft buttons"). Used by the profile button, the undo and the theme button, at
  their sizes. A disc on a button that can be used catches the pointer light, at the share `light` gives:
  <Disc size="var(--small-disc-size)" dent="var(--small-disc-dent)" light="1">↶</Disc>
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  // === Props ===

  let {
    size,
    dent,
    light,
    children,
  }: {
    size: string
    dent: string
    /** How much of the pointer light the disc catches, 0 to 1; none when not given */
    light?: string
    children?: Snippet
  } = $props()
</script>

<span class="disc" class:lit={light !== undefined} style:--size={size} style:--dent={dent} style:--glow-share={light}
  >{@render children?.()}</span
>

<style>
  /* === Layout === */

  .disc {
    position: relative;
    isolation: isolate;
    display: grid;
    place-items: center;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: var(--disc-face);
    background-image: var(--disc-glow);
    box-shadow:
      0 2px 5px var(--disc-drop),
      var(--disc-rim);
  }

  /* === States === */

  .disc.lit {
    background-image: var(--pointer-light), var(--disc-glow);
    background-attachment: fixed, scroll;
  }

  /* The dent around the disc */
  .disc::before {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--dent));
    z-index: -1;
    border-radius: 50%;
    border-top: 1px solid var(--dent-edge);
    background: var(--dent-background);
    box-shadow:
      inset 0 4px 14px var(--dent-shade),
      0 1px 0 var(--dent-lip);
  }
</style>
