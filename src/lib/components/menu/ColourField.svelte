<!--
  A profile's colours in its row ("Each profile carries its colours"): "Färg", the pair it wears, the base and the neon
  as two small swatches, and "Ändra", which opens the app's own colour picker; a second press closes it. The picker,
  placed to fit inside the menu, opens onto a hue strip showing each hue as its base colour, the circle on it filled with
  the neon of where it sits; under it a swatch and a code for the base, then the neon, which can be selected and copied
  but not typed in. Dragging changes only the preview; the colour is taken and kept when the pointer is released. Esc,
  a press outside or the menu scrolling only closes it. While it is open the wheel wears that profile's colours:
  <ColourField {profile} />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { baseColour, hueOfStrip, neonColour, stripOfHue } from '$lib/modules/shared/colours'
  import type { Profile } from '$lib/modules/shared/record'

  // === Props ===

  let { profile }: { profile: Profile } = $props()

  // === State ===

  const key = crypto.randomUUID()
  let open = $derived(app.openValue === key)
  let strip = $state(0)
  let hue = $derived(Math.round(hueOfStrip(strip)) % 360)
  let preview = $derived({ base: baseColour(hue), neon: neonColour(hue) })
  /** The strip drawn as each hue's base colour, every 30 degrees */
  const STRIP = `linear-gradient(to right, ${Array.from({ length: 13 }, (_, i) => baseColour(Math.round(hueOfStrip(i * 30)) % 360)).join(', ')})`
  let button: HTMLButtonElement | undefined = $state()
  let picker: HTMLDivElement | undefined = $state()
  let place = $state({ left: 0, top: 0 })

  // === Logic ===

  // Open, the wheel is this profile's; closed from anywhere, it goes back to the profile on screen
  $effect(() => {
    if (open) app.picking = profile.id
    else if (app.picking === profile.id) app.picking = null
  })

  // The menu's tab scrolling closes it: a scroll does not bubble, so it is caught on its way down
  $effect(() => {
    if (!open) return
    const onScroll = (event: Event): void => {
      if (!picker?.contains(event.target as Node)) close()
    }
    document.addEventListener('scroll', onScroll, true)
    return () => document.removeEventListener('scroll', onScroll, true)
  })

  // === Helpers ===

  /** "Ändra": the picker opened where the strip was left, or closed on a second press */
  function toggle(): void {
    if (open) return close()
    strip = profile.strip ?? Math.round(stripOfHue(profile.hue)) % 360
    app.openValue = key
    queueMicrotask(placePicker)
  }

  function close(): void {
    if (app.openValue === key) app.openValue = null
  }

  /** Under the button, or above it when there is no room below, always inside the menu */
  function placePicker(): void {
    const menu = button?.closest('.menu')?.getBoundingClientRect()
    const at = button?.getBoundingClientRect()
    if (!menu || !at || !picker) return
    const edge = 8
    const left = Math.min(Math.max(edge, at.left - menu.left), menu.width - picker.offsetWidth - edge)
    let top = at.bottom - menu.top + edge
    if (top + picker.offsetHeight > menu.height - edge)
      top = Math.max(edge, at.top - menu.top - picker.offsetHeight - edge)
    place = { left, top }
  }

  /** The pointer released: the colour taken and kept */
  function keep(): void {
    if (!app.record) return
    const profiles = app.record.profiles.map((p) =>
      p.id === profile.id ? { ...p, hue, base: preview.base, strip: Math.round(strip) % 360 } : p,
    )
    void app.saveSettings({ ...app.record, profiles })
  }

  function onKey(event: KeyboardEvent): void {
    if (open && event.key === 'Escape') {
      event.stopPropagation()
      close()
      button?.focus()
    }
  }

  /** A press outside the picker and its button closes it */
  function onPress(event: PointerEvent): void {
    const target = event.target as Node
    if (open && !picker?.contains(target) && !button?.contains(target)) close()
  }
</script>

<svelte:window onkeydown={onKey} onpointerdown={onPress} />

<div class="line">
  <span class="label">Färg</span>
  <span class="pair">
    <span style:background={profile.base}></span>
    <span style:background={neonColour(profile.hue)}></span>
  </span>
  <button class="button-small" type="button" bind:this={button} onclick={toggle}>Ändra</button>
</div>

{#if open}
  <div
    class="picker"
    bind:this={picker}
    style:left="{place.left}px"
    style:top="{place.top}px"
    style:--strip={STRIP}
    style:--thumb={preview.neon}
  >
    <input
      class="hue"
      type="range"
      aria-label="Färgton"
      min="0"
      max="359"
      step="1"
      bind:value={strip}
      onchange={keep}
    />
    {#each [preview.base, preview.neon] as colour (colour)}
      <div class="code">
        <span class="swatch" style:background={colour}></span>
        <input
          class="field"
          type="text"
          readonly
          value={colour}
          aria-label="Färgkod"
          onfocus={(event) => event.currentTarget.select()}
        />
      </div>
    {/each}
  </div>
{/if}

<style>
  /* === Layout === */

  .line {
    display: flex;
    align-items: center;
    gap: var(--menu-value-gap-inline);
    min-height: var(--menu-value-row);
    padding: var(--menu-value-padding);
    border-bottom: 1px dashed var(--menu-line);
  }

  .label {
    flex: none;
    width: var(--menu-label-width);
    color: var(--menu-text-muted);
  }

  /* "Ändra" the size of every "Ändra" in the menu */
  .line > .button-small {
    box-sizing: content-box;
    width: var(--menu-field-width);
  }

  .pair {
    display: inline-flex;
    gap: var(--picker-pair-gap);
  }

  .pair span {
    width: var(--picker-pair-swatch);
    height: var(--picker-pair-swatch);
    border: 1px solid var(--button-line);
    border-radius: var(--radius-tag);
  }

  /* Placed inside the menu by the script; the menu's frost makes it the box this is placed in */
  .picker {
    position: fixed;
    z-index: 20;
    display: grid;
    gap: var(--picker-gap);
    width: min-content;
    padding: var(--picker-padding);
    border: 1px solid var(--button-line);
    border-radius: var(--radius-small);
    background: var(--picker-background);
    color: var(--menu-text);
  }

  .hue {
    width: 100%;
    min-width: 0;
    height: var(--picker-strip-height);
    margin: 0;
    border-radius: calc(var(--picker-strip-height) / 2);
    background: var(--strip);
    appearance: none;
  }

  /* The circle dragged along it: the neon of where it sits, no border or ring, a soft shadow, as the line's handles */
  .hue::-webkit-slider-thumb {
    width: var(--knob);
    height: var(--knob);
    border: 0;
    border-radius: 50%;
    background: var(--thumb);
    box-shadow: var(--knob-shadow);
    appearance: none;
  }

  .hue::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--knob);
    height: var(--knob);
    border: 0;
    border-radius: 50%;
    background: var(--thumb);
    box-shadow: var(--knob-shadow);
  }

  .code {
    display: flex;
    align-items: center;
    gap: var(--picker-pair-gap);
  }

  .swatch {
    flex: none;
    width: var(--picker-swatch);
    height: var(--picker-swatch);
    border: 1px solid var(--button-line);
    border-radius: var(--radius-tag);
  }

  /* Room around the code's seven characters, so the picker has some presence */
  .code input {
    box-sizing: content-box;
    width: var(--picker-code-width);
  }
</style>
