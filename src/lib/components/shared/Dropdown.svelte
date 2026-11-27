<!--
  A dropdown ("Shared looks are written once"): the closed field, its text quiet until something is chosen and cut with
  "…" past its greatest length, then its list. The list grows open and then fades its lines in; closing, they fade out
  first and it shrinks. Unfolding, it grows in place and pushes what is under it down; floating, it lies over what is
  under it right under the field, on a surface of its own. It stops at its greatest number of lines and scrolls past
  them, and closes on Esc, the focus back on the field, or on a click outside it. The lines are the caller's, each
  choice a `.dropdown-choice` button (base.css), with whatever the caller sets beside them:
  <Dropdown text="Välj orsak" chosen={false} bind:open>{#each …}<button class="dropdown-choice">…</button>{/each}</Dropdown>
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  // === Props ===

  let {
    text,
    chosen,
    float = false,
    open = $bindable(false),
    children,
  }: {
    /** What the closed field says */
    text: string
    /** Whether something is chosen, which shows the field's text in full colour */
    chosen: boolean
    /** Whether the list floats over what is under it, instead of unfolding in place */
    float?: boolean
    open?: boolean
    /** The list's lines */
    children: Snippet
  } = $props()

  // === State ===

  let root: HTMLDivElement | undefined = $state()
  let pick: HTMLButtonElement | undefined = $state()
  let list: HTMLDivElement | undefined = $state()
  /** The list's greatest height, so it stops after its lines; none while it holds fewer */
  let tallest = $state<number | null>(null)

  // === Logic ===

  // The list stops after its greatest number of lines: its height is where the next line starts, measured again as
  // lines come and go
  $effect(() => {
    const box = list
    if (!box) return
    const measure = (): void => {
      const rows = parseInt(getComputedStyle(box).getPropertyValue('--dropdown-list-rows'), 10) || 7
      const lines = [...box.children] as HTMLElement[]
      const top = parseFloat(getComputedStyle(box).paddingTop) || 0
      tallest = lines.length > rows ? lines[rows].offsetTop - lines[0].offsetTop + top : null
    }
    measure()
    const watch = new MutationObserver(measure)
    watch.observe(box, { childList: true })
    return () => watch.disconnect()
  })

  // === Helpers ===

  /** Esc closes the open list, the focus back on the field; a field in the list answers its own Esc first */
  function keys(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !open) return
    event.preventDefault()
    event.stopPropagation()
    open = false
    pick?.focus()
  }

  /** A click outside closes the open list; one on a line the list redrew, gone from the page, is still inside */
  function clickedAway(event: MouseEvent): void {
    const target = event.target as Node
    if (open && target.isConnected && root && !root.contains(target)) open = false
  }
</script>

<svelte:window onclick={clickedAway} />

<!-- Esc from the field or a line closes the list -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dropdown-box" class:open class:float bind:this={root} onkeydown={keys}>
  <button
    class="pick field dropdown"
    class:chosen
    type="button"
    aria-expanded={open}
    bind:this={pick}
    onclick={() => (open = !open)}
  >
    {text}
  </button>
  <div class="grow">
    <div class="clip">
      <div class="list" bind:this={list} style:max-height={tallest === null ? undefined : `${tallest}px`}>
        {@render children()}
      </div>
    </div>
  </div>
</div>

<style>
  /* === Layout === */

  .dropdown-box {
    position: relative;
    display: grid;
    justify-items: start;
  }

  /* The closed field: a text past its greatest length stops at "…" before the chevron; quiet until one is chosen */
  .pick {
    box-sizing: content-box;
    max-width: calc(var(--dropdown-pick-max) + 1px); /* a pixel's slack, so a text of exactly the cap is never cut */
    overflow: hidden;
    color: var(--surface-muted);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The list grows open at the interface's speed, then its lines fade in after the same time; closing, they fade out
     first, then it shrinks */
  .grow {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 0fr;
    justify-self: stretch;
    min-width: 0;
    transition: grid-template-rows var(--speed-ui) var(--ease-grow) var(--speed-ui);
  }

  .clip {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity var(--speed-ui) ease,
      visibility 0s linear var(--speed-ui);
  }

  .list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--dropdown-list-gap);
    justify-items: start;
    padding-top: var(--dropdown-list-top);
    overflow-y: auto;
  }

  /* Floating: out of the flow, right under the field and in line with its right edge, on its own surface */
  .float .grow {
    position: absolute;
    top: calc(100% + var(--dropdown-float-gap));
    right: 0;
    z-index: 2;
    width: max-content;
    min-width: 100%;
  }

  .float .clip {
    padding: var(--dropdown-float-padding);
    border: 1px solid var(--surface-line);
    border-radius: var(--radius-small);
    background: var(--dropdown-float-background);
    box-shadow: var(--dropdown-float-shadow);
  }

  /* === States === */

  .chosen {
    color: var(--surface-text);
  }

  .open .grow {
    grid-template-rows: 1fr;
    transition-delay: 0s;
  }

  .open .clip {
    opacity: 1;
    visibility: visible;
    transition:
      opacity var(--speed-ui) ease var(--speed-ui),
      visibility 0s;
  }
</style>
