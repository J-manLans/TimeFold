<!--
  The popups' frame ("Shared looks are written once"): every popup is this native <dialog>, opened modal, so it lies on
  top, keeps the focus inside it and gives it back when it closes. One look for all: the surface's background and line,
  the large corners, one padding, the caps heading at the top left with anything beside it, over the dialog's own light dim. It closes
  on Esc or a click outside, a click begun outside too, unless it must be answered. A popup of one side sits centred on
  that side, its parent; the others on the window. Opened while `open` holds; closed by the user, it calls `onclose`:
  <Popup open={app.profilesOpen} heading="Profil" surface="popup" over="side" onclose={() => (app.profilesOpen = false)}>
-->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import { popupClosed, popupOpened, type Input } from '$lib/modules/shared/focusRing'
  import { centreOn } from '$lib/modules/shared/popup'

  // === Props ===

  let {
    open,
    heading,
    label,
    surface,
    over = 'window',
    width,
    dismiss = true,
    onclose,
    dialog = $bindable(),
    aside,
    children,
    class: extra = '',
    onpointerdown,
    onclick,
    ...rest
  }: Omit<HTMLDialogAttributes, 'open' | 'class'> & {
    /** Whether it shows */
    open: boolean
    /** The caps heading at its top left; none for a popup with a head of its own */
    heading?: string
    /** Its name for a screen reader, when it has no heading */
    label?: string
    /** The surface it is, whose colours it and the shared looks in it wear */
    surface: 'popup' | 'dashboard'
    /** Centred on its side, the element it sits in, or on the window */
    over?: 'side' | 'window'
    /** Its width, for a popup whose content does not set it */
    width?: string
    /** Whether Esc and a click outside close it; false for one that must be answered */
    dismiss?: boolean
    /** Closed by the user: Esc, a click outside, or a close inside it */
    onclose?: () => void
    /** The dialog itself, for a popup that looks at what the pointer is over */
    dialog?: HTMLDialogElement
    /** What sits beside the heading, at the top right, such as "Stäng" */
    aside?: Snippet
    children: Snippet
    class?: string
  } = $props()

  // === State ===

  /** How it was opened, for the focus ring when it closes */
  let openedBy: Input = null
  /** Whether the press of a click began outside it, which alone closes it */
  let pressedOutside = false
  let centre = $state<{ x: number; y: number } | null>(null)

  // === Logic ===

  // It opens and closes with `open`; over a side, it is placed before it shows
  $effect(() => {
    if (!dialog) return
    if (open && !dialog.open) {
      place()
      openedBy = popupOpened()
      dialog.showModal()
    } else if (!open && dialog.open) dialog.close()
  })

  // === Helpers ===

  /** Over a side, its centre on the part of that side in view. Used as it opens and when the window resizes */
  function place(): void {
    const side = dialog?.parentElement
    if (over !== 'side' || !side) return
    centre = centreOn(side.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight })
  }

  /** Esc: closes it, or for one that must be answered, does nothing */
  function cancelled(event: Event): void {
    if (!dismiss) event.preventDefault()
  }

  /** Closed by any way; closed by the user, the popup that wears it is told */
  function closed(): void {
    popupClosed(openedBy)
    if (open) onclose?.()
  }

  /** A press: whether it began outside, on the scrim */
  function pressed(event: PointerEvent & { currentTarget: HTMLDialogElement }): void {
    pressedOutside = event.target === dialog
    onpointerdown?.(event)
  }

  /** A click outside, begun there too, closes it, as Esc does */
  function clicked(event: MouseEvent & { currentTarget: HTMLDialogElement }): void {
    if (dismiss && event.target === dialog && pressedOutside) dialog?.close()
    pressedOutside = false
    onclick?.(event)
  }
</script>

<svelte:window onresize={() => dialog?.open && place()} />

<dialog
  bind:this={dialog}
  class="popup {extra}"
  class:on-side={centre !== null}
  style:--x={centre ? `${centre.x}px` : undefined}
  style:--y={centre ? `${centre.y}px` : undefined}
  style:width
  data-surface={surface}
  aria-label={heading ? undefined : label}
  oncancel={cancelled}
  onclose={closed}
  onpointerdown={pressed}
  onclick={clicked}
  {...rest}
>
  <div class="frame">
    {#if heading}
      <header>
        <h3 class="caps">{heading}</h3>
        {@render aside?.()}
      </header>
    {/if}
    {@render children()}
  </div>
</dialog>

<style>
  /* === Layout === */

  dialog {
    max-width: calc(100% - 2 * var(--spacing-xl));
    max-height: 80vh; /* the most it takes before it scrolls */
    padding: 0;
    overflow: auto;
    border: 1px solid var(--surface-line);
    border-radius: var(--radius-lg);
    background: var(--surface-background);
    color: var(--surface-text);
  }

  /* Over its side: centred on the part of it in view, not on the window */
  .on-side {
    position: fixed;
    inset: auto;
    top: var(--y);
    left: var(--x);
    margin: 0;
    translate: -50% -50%;
  }

  .frame {
    display: grid;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  h3 {
    margin: 0;
  }
</style>
