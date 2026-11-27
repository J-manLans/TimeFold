<!--
  The menu ("The menu has tabs, with every value locked behind "Ändra""): folded, it is the button in the controls
  side's top-left corner; open, it grows from that corner into a frosted panel over the whole controls side, with the
  "Meny" heading, the theme button and the motion switch, and the tab row: Profiler, chosen whenever it opens, and Tid,
  holding full time, the split and the flex-day calendar. A click on the button, a
  click outside or Esc closes it; "Visa alla" and its popup keep it open, and Esc there closes the popup first. At the first start it is locked open with the onboarding in it ("A first install starts fresh or
  imports"), or with the screen for a record that cannot be read: solid while it asks, then frost, then folded into its
  button.
-->
<script lang="ts">
  import { app, NEW_PROFILE } from '$lib/app.svelte'
  import {
    cancelComing,
    firstOfNextMonth,
    saveFullTime,
    valuesOn,
    weekText,
    WEEKDAYS,
  } from '$lib/modules/menu/workTime'
  import { dayAndMonth } from '$lib/modules/shared/dates'
  import { localDay } from '$lib/modules/shared/counting'
  import { popupClosed, popupOpened, type Input } from '$lib/modules/shared/focusRing'
  import type { Day } from '$lib/modules/shared/record'
  import { durationInField, durationText, readDuration, WEEK } from '$lib/modules/shared/timeInput'
  import FlexCalendar from './FlexCalendar.svelte'
  import LockedValue from './LockedValue.svelte'
  import ProfilerTab from './ProfilerTab.svelte'
  import SplitSlider from './SplitSlider.svelte'
  import Onboarding from './Onboarding.svelte'
  import Recovery from './Recovery.svelte'
  import MotionButton from './MotionButton.svelte'
  import ThemeButton from './ThemeButton.svelte'

  // === Props ===

  /** Whether the menu is open; the controls side binds it, to take its light off the buttons under the frost */
  let { open = $bindable(false) }: { open?: boolean } = $props()

  // === State ===

  let menu: HTMLDivElement | undefined = $state()
  let locked = $derived(app.panel !== null)
  /** How the menu was opened, a key or a pointer, for the focus ring when it closes, and whether it was open */
  let openedBy: Input = null
  let wasOpen = false
  /** Whether the panel is growing or folding: its clip glides only then, so a window crossing the narrow width snaps
      the button to its corner */
  let moving = $state(false)
  let lastOpen = open
  /** The tab shown: Profiler whenever the menu opens */
  let tab = $state<'profiler' | 'tid'>('profiler')
  /** Today, read afresh whenever the menu opens, so a value saved for a later day takes over on its day */
  let today = $state(localDay(Date.now()))
  /** Full time as the menu shows it: in force today, the value saved for later as coming, the earlier ones */
  let full = $derived(
    app.record ? valuesOn(app.record.fullTime, today) : { now: undefined, coming: undefined, earlier: [] },
  )
  let fullWeek = $derived((full.now?.minutes ?? 0) * WEEKDAYS)
  let fullEarlier = $derived(
    full.earlier.map((e) => ({
      text: `${weekText(e.value.minutes * WEEKDAYS)} / vecka`,
      from: e.from,
      until: e.until,
    })),
  )

  // === Logic ===

  // Opened, it keeps how; closed, the focus left on its button shows a ring only after a keyboard open and close
  $effect(() => {
    if (open && !wasOpen) openedBy = popupOpened()
    if (!open && wasOpen) popupClosed(openedBy)
    wasOpen = open
  })

  // Opening or closing starts the glide, before the class changes reach the page; Stilla has none to wait for
  $effect.pre(() => {
    if (open !== lastOpen) moving = !app.still
    lastOpen = open
  })

  // At the first start the menu is open until the onboarding's ending folds it
  $effect(() => {
    if (app.panel !== null) open = !app.panel.folded
  })

  // Closed, nothing is left open for editing, and it opens again on Profiler, on today's date
  $effect(() => {
    if (!open) {
      app.openValue = null
      tab = 'profiler'
    } else today = localDay(Date.now())
  })

  // "Skapa ny profil" in the profile popup opens the menu on Profiler with the name field ready. The menu alone takes the
  // request up, so nothing else can clear it first
  $effect(() => {
    if (!app.newProfileAsked) return
    app.newProfileAsked = false
    tab = 'profiler'
    open = true
    app.openValue = NEW_PROFILE
  })

  // While open, a press outside the menu or Esc closes it, unless it is locked for the onboarding. "Visa alla" and its
  // popup keep it open, so closing the popup comes back to the menu; Esc in the popup closes only the popup
  $effect(() => {
    if (!open || locked) return
    const outside = (event: PointerEvent): void => {
      const target = event.target as Element
      if (target.closest('[data-keeps-menu], dialog[open]')) return
      if (menu && !menu.contains(target)) open = false
    }
    const escape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && document.querySelector('dialog[open]') === null) open = false
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  })

  // === Helpers ===

  /** The glide over, or cut short */
  function moved(event: TransitionEvent): void {
    if (event.target === menu && event.propertyName === 'clip-path') moving = false
  }

  /** A tab chosen: anything open for editing in the other is dropped */
  function pick(next: 'profiler' | 'tid'): void {
    app.openValue = null
    tab = next
  }

  /** Heltid saved for a later day taken back, or the reason it is refused */
  function cancelFull(from: Day): string | null {
    if (!app.record) return null
    const result = cancelComing(app.record, 'full', from)
    if ('refusal' in result) return result.refusal
    void app.saveSettings(result)
    return null
  }

  /** Heltid saved as a week from its date, or the reason it is refused */
  function saveFull(week: number, from: Day): string | null {
    if (!app.record) return null
    const result = saveFullTime(app.record, week, from)
    if ('refusal' in result) return result.refusal
    void app.saveSettings(result)
    return null
  }
</script>

<div
  class="menu"
  data-surface="menu"
  class:open
  class:moving
  class:solid={app.panel !== null && !app.panel.frosted}
  class:frosting={app.panel !== null && app.panel.frosted && !app.panel.folded}
  class:hidden-toggle={app.panel !== null && !app.panel.folded}
  bind:this={menu}
  ontransitionend={moved}
  ontransitioncancel={moved}
>
  <button
    class="toggle"
    type="button"
    inert={locked || app.late !== null}
    aria-label={open ? 'Stäng menyn' : 'Öppna menyn'}
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <span></span><span></span><span></span>
  </button>

  {#if locked && app.phase === 'welcome'}
    <Onboarding from={app.onboardingFrom} />
  {:else if locked && app.phase === 'problem'}
    <Recovery />
  {:else}
    <div class="body" inert={!open}>
      <div class="head">
        <h2>Meny</h2>
        <ThemeButton />
        <MotionButton />
      </div>
      <div class="tabs" role="tablist" aria-label="Menyns delar">
        <button
          class="tab"
          role="tab"
          type="button"
          aria-selected={tab === 'profiler'}
          onclick={() => pick('profiler')}
        >
          Profiler
        </button>
        <button class="tab" role="tab" type="button" aria-selected={tab === 'tid'} onclick={() => pick('tid')}>
          Tid
        </button>
      </div>
      <!-- Drawn anew when the date has changed, so each value reads today's -->
      {#key today}
        {#if tab === 'profiler'}
          <div class="panel" role="tabpanel" aria-label="Profiler">
            <ProfilerTab />
          </div>
        {:else}
          <div class="panel" role="tabpanel" aria-label="Tid">
            <div>
              <LockedValue
                label="Heltid"
                text={`${weekText(fullWeek)} / vecka`}
                note={`${durationText(fullWeek / WEEKDAYS)} / dag`}
                coming={full.coming
                  ? `${weekText(full.coming.minutes * WEEKDAYS)} från ${dayAndMonth(full.coming.from)}`
                  : ''}
                cancelComing={() => (full.coming ? cancelFull(full.coming.from) : null)}
                fieldText={durationInField(fullWeek)}
                field={WEEK}
                read={(typed) => readDuration(typed, WEEK)}
                waiting={weekText}
                save={saveFull}
                dated
                opensOn={firstOfNextMonth(today)}
                earlier={fullEarlier}
              />
              <SplitSlider />
            </div>
            <section>
              <span class="label">Flexledig</span>
              <!-- Drawn anew each time the menu opens, so the padlock is shut again and today's month shows -->
              {#key open}
                <FlexCalendar />
              {/key}
            </section>
          </div>
        {/if}
      {/key}
    </div>
  {/if}
</div>

<style>
  /* === Layout === */

  /* Folded, the clip leaves only the button's square in the corner; open, it lets the whole panel show. The clip
     glides only while the menu opens or closes */
  .menu {
    position: absolute;
    inset: 0;
    z-index: 5;
    background-color: var(--button-background);
    color: var(--menu-text);
    clip-path: inset(
      var(--menu-inset) calc(100% - var(--menu-inset) - var(--button-icon-size))
        calc(100% - var(--menu-inset) - var(--button-icon-size)) var(--menu-inset) round var(--radius-small)
    );
    transition: background-color var(--speed-ui) ease;
  }

  .menu.moving {
    transition:
      clip-path var(--speed-ui) var(--ease-grow),
      background-color var(--speed-ui) ease;
  }

  .toggle {
    transition: opacity var(--speed-ui) ease;
    position: absolute;
    top: var(--menu-inset);
    left: var(--menu-inset);
    z-index: 2;
    width: var(--button-icon-size);
    height: var(--button-icon-size);
    padding: 0;
    border: 0;
    border-radius: var(--radius-small);
    background: transparent;
    cursor: pointer;
  }

  /* The three lines, centred in the button, a line gap apart */
  .toggle span {
    position: absolute;
    left: calc((var(--button-icon-size) - var(--menu-toggle-line-width)) / 2);
    width: var(--menu-toggle-line-width);
    height: var(--menu-toggle-line-height);
    border-radius: calc(var(--menu-toggle-line-height) / 2);
    background: var(--button-text);
    transition:
      transform var(--speed-ui) ease,
      opacity var(--speed-ui) ease,
      background-color var(--speed-ui) ease;
  }

  .toggle span:nth-child(1) {
    top: calc(50% - var(--menu-toggle-line-height) / 2 - var(--menu-toggle-line-gap));
  }

  .toggle span:nth-child(2) {
    top: calc(50% - var(--menu-toggle-line-height) / 2);
  }

  .toggle span:nth-child(3) {
    top: calc(50% - var(--menu-toggle-line-height) / 2 + var(--menu-toggle-line-gap));
  }

  /* The head and the tabs stay put; only the tab's content scrolls, up to the tabs' line, so nothing passes under the
     × and the tabs are always in reach */
  .body {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    padding: var(--menu-padding);
    overflow: hidden;
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  /* The heading starts right of the menu button, level with it */
  .head {
    display: flex;
    align-items: center;
    gap: var(--menu-head-gap);
    min-height: var(--button-icon-size);
    margin: 0 0 var(--menu-head-space) calc(var(--menu-inset) + var(--button-icon-size));
  }

  h2 {
    margin: 0;
    font-size: var(--menu-heading-size);
    font-weight: var(--menu-heading-weight);
  }

  .tabs {
    display: flex;
    gap: var(--menu-tab-gap);
    border-bottom: 1px solid var(--menu-line);
  }

  .tab {
    margin-bottom: -1px;
    padding: var(--menu-tab-padding);
    border: 0;
    border-bottom: var(--menu-tab-line) solid transparent;
    background: none;
    color: var(--menu-text-muted);
    font: inherit;
    font-size: var(--menu-tab-size);
    cursor: pointer;
  }

  /* A tab's content starts its own room under the tabs' line and fades in as its tab is chosen; its edge leaves room
     for focus rings inside the panel's clip */
  .panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-content: start;
    gap: var(--menu-panel-gap);
    min-height: 0;
    margin: 0 calc(-1 * var(--menu-panel-edge)) calc(-1 * var(--menu-panel-edge));
    padding: var(--menu-gap) var(--menu-panel-edge) var(--menu-panel-edge);
    overflow-y: auto;
    scrollbar-width: none;
    animation: tab-fade var(--menu-tab-fade) ease;
  }

  /* It scrolls with the wheel, the touchpad and the keys, with no bar drawn */
  .panel::-webkit-scrollbar {
    display: none;
  }

  @keyframes tab-fade {
    from {
      opacity: 0;
    }
  }

  section {
    display: grid;
    gap: var(--menu-section-gap);
  }

  .label {
    min-width: var(--menu-label-width);
    color: var(--menu-text-muted);
  }

  /* === States === */

  .tab[aria-selected='true'] {
    border-bottom-color: var(--profile-neon, var(--menu-text));
    color: var(--menu-text);
  }

  .menu.open {
    clip-path: inset(0 round 0);
    background-color: var(--menu-frost);
    backdrop-filter: blur(var(--menu-blur));
  }

  /* Open, the lines turn into a cross in the menu's text colour */
  .open .toggle span {
    background: var(--menu-text);
  }

  .open .toggle span:nth-child(1) {
    transform: translateY(var(--menu-toggle-line-gap)) rotate(45deg);
  }

  .open .toggle span:nth-child(2) {
    opacity: 0;
  }

  .open .toggle span:nth-child(3) {
    transform: translateY(calc(-1 * var(--menu-toggle-line-gap))) rotate(-45deg);
  }

  /* The onboarding: solid while its prompts show, so nothing behind is blurred again at every blink of the caret */
  .menu.open.solid {
    background-color: var(--onboarding-panel);
    backdrop-filter: none;
  }

  /* Then frost: the blur is on at once behind the still solid tint, and only the tint fades */
  .menu.frosting {
    transition: background-color var(--onboarding-frost-in) ease;
  }

  /* No way out while it is locked open; the button shows again as the panel folds into it */
  .hidden-toggle .toggle {
    opacity: 0;
  }

  /* The content fades in once the panel has half grown */
  .open .body {
    opacity: 1;
    transition: opacity var(--speed-ui) ease calc(var(--speed-ui) / 2);
  }

  /* Stacked (App.svelte): the button sits in the lower left corner, the panel
     grows from there, and the heading takes the top row the button leaves */
  :global(:where(:root[data-stacked])) .menu {
    clip-path: inset(
      calc(100% - var(--menu-inset) - var(--button-icon-size)) calc(100% - var(--menu-inset) - var(--button-icon-size))
        var(--menu-inset) var(--menu-inset) round var(--radius-small)
    );
  }

  :global(:where(:root[data-stacked])) .toggle {
    top: auto;
    bottom: var(--menu-inset);
  }

  :global(:where(:root[data-stacked])) .head {
    margin-left: 0;
  }

  :global(:where(:root[data-stacked])) .body {
    padding-bottom: calc(var(--menu-inset) + var(--button-icon-size) + var(--menu-gap));
  }
</style>
