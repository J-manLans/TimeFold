<!--
  The flex-day calendar in the menu's Tid tab ("A flex day can be marked ahead, and the screen counts it at once"): a
  month of outlined days, weeks from Monday, with ‹ and › to the months either side. A click on a weekday, today or
  ahead, marks it in the base colour of the profile with the balance, and a click on a marked one unmarks it; the flex
  bar follows at once. Weekends, days janitor work started on and days before the record's first day are greyed out and
  cannot be clicked; so are days gone
  by, a past flex day keeping its fill, until the padlock beside the month's name is opened. Today stays open until
  work starts on it. It locks again when the tab goes, the menu closes, or the
  calendar is shown again. Beside it, every marked day from today on, a line per month, each line level with a week;
  a number shows its month. In a narrow menu the list sits under the calendar.
-->
<script lang="ts">
  import { tick } from 'svelte'
  import { app } from '$lib/app.svelte'
  import { calendarMonth, daysAhead, firstDay, isWeekend, monthAfter, workedDays } from '$lib/modules/menu/flexDays'
  import { localDay } from '$lib/modules/shared/counting'
  import { monthInWords } from '$lib/modules/shared/dates'
  import { type Day } from '$lib/modules/shared/record'

  // === Constants ===

  const WEEKDAYS = ['mån', 'tis', 'ons', 'tor', 'fre', 'lör', 'sön']

  // === State ===

  let today = $derived(localDay(Date.now()))
  let shown = $state(`${localDay(Date.now()).slice(0, 8)}01`)
  let unlocked = $state(false)
  let grid: HTMLDivElement | undefined = $state()
  let month = $derived(calendarMonth(shown))
  let janitor = $derived(app.record?.profiles.find((p) => p.expectedMinutes !== undefined))
  let marked = $derived(new Set(janitor?.flexDays ?? []))
  let ahead = $derived(app.record ? daysAhead(app.record, today) : [])
  let worked = $derived(app.record ? workedDays(app.record) : new Set<Day>())
  let first = $derived(app.record ? firstDay(app.record) : undefined)

  // === Helpers ===

  /** A day of the grid clicked: marked or unmarked, the focus kept on it. Used by every day that can be clicked */
  async function click(day: Day): Promise<void> {
    await app.toggleFlexDay(day, unlocked)
  }

  /** A day in the list clicked: the calendar shows its month, the focus on the day */
  async function showDay(day: Day): Promise<void> {
    shown = `${day.slice(0, 8)}01`
    await tick()
    grid?.querySelector<HTMLButtonElement>(`[data-day="${day}"]`)?.focus()
  }

  /**
   * Whether a day cannot be clicked: a weekend, a day worked or a day before the record's first day always, a day gone by
   * while the padlock is shut
   */
  function locked(day: Day): boolean {
    return isWeekend(day) || worked.has(day) || (first !== undefined && day < first) || (day < today && !unlocked)
  }
</script>

<div class="calendar" style:--flex-base={janitor?.base}>
  <div class="month">
    <div class="head">
      <button class="nav" type="button" aria-label="Förra månaden" onclick={() => (shown = monthAfter(shown, -1))}
        >‹</button
      >
      <span class="title">
        {#if shown.slice(0, 7) === today.slice(0, 7)}
          {monthInWords(shown)}
        {:else}
          <!-- Away from today's month, its name wakes up: a click brings the calendar back to today's month -->
          <button class="home" type="button" onclick={() => (shown = `${today.slice(0, 8)}01`)}>
            {monthInWords(shown)}
          </button>
        {/if}
        <button
          class="lock"
          class:open={unlocked}
          type="button"
          aria-pressed={unlocked}
          aria-label={unlocked ? 'Lås passerade dagar' : 'Lås upp passerade dagar'}
          onclick={() => (unlocked = !unlocked)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d={unlocked ? 'M8 11V7a4 4 0 0 1 7.75-1.4' : 'M8 11V7a4 4 0 0 1 8 0v4'} />
          </svg>
        </button>
      </span>
      <button class="nav" type="button" aria-label="Nästa månad" onclick={() => (shown = monthAfter(shown, 1))}
        >›</button
      >
    </div>
    <div class="grid" bind:this={grid}>
      {#each WEEKDAYS as weekday (weekday)}
        <span class="weekday">{weekday}</span>
      {/each}
      {#each { length: month.lead }, i (i)}
        <span></span>
      {/each}
      {#each month.days as day (day)}
        <button
          class="day"
          class:marked={marked.has(day)}
          class:today={day === today}
          type="button"
          data-day={day}
          disabled={locked(day)}
          aria-pressed={marked.has(day)}
          onclick={() => click(day)}>{Number(day.slice(8))}</button
        >
      {/each}
    </div>
  </div>

  <div class="ahead">
    {#each ahead as line (line.key)}
      {#if line.kind === 'year'}
        <span class="year">{line.year}</span>
      {:else}
        <span class="line">
          <span>{line.name}</span>
          <span class="days">
            {#each line.days as day (day)}
              <button class="link" type="button" onclick={() => showDay(day)}>{Number(day.slice(8))}</button>
            {/each}
          </span>
        </span>
      {/if}
    {/each}
  </div>
</div>

<style>
  /* === Layout === */

  .calendar {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    gap: var(--calendar-wrap-gap) var(--calendar-side-gap);
  }

  /* As wide as its seven days */
  .month {
    display: grid;
    gap: var(--calendar-head-gap);
    width: calc(7 * var(--calendar-cell) + 6 * var(--calendar-gap));
  }

  .head {
    display: flex;
    align-items: center;
    gap: var(--calendar-nav-gap);
    height: var(--calendar-head-height);
  }

  /* The month's name away from today's month: plain until hovered, then underlined, as "Tidigare värden" is */
  .home {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-underline-offset: var(--calendar-home-underline);
    cursor: pointer;
  }

  .home:hover {
    text-decoration: underline;
  }

  .title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--calendar-nav-gap);
    font-size: var(--calendar-title-size);
  }

  .nav {
    width: var(--calendar-head-height);
    height: var(--calendar-head-height);
    padding: 0;
    border: 0;
    border-radius: var(--radius-small);
    background: none;
    color: var(--menu-text-muted);
    font: inherit;
    font-size: var(--calendar-nav-size);
    line-height: 1;
    cursor: pointer;
  }

  .lock {
    display: grid;
    place-items: center;
    width: calc(var(--calendar-lock-size) + 2 * var(--calendar-lock-pad));
    height: calc(var(--calendar-lock-size) + 2 * var(--calendar-lock-pad));
    padding: 0;
    border: 0;
    border-radius: var(--radius-small);
    background: none;
    color: var(--menu-text-muted);
    cursor: pointer;
  }

  .lock svg {
    width: var(--calendar-lock-size);
    height: var(--calendar-lock-size);
    fill: none;
    stroke: currentColor;
    stroke-width: var(--calendar-lock-stroke);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, var(--calendar-cell));
    gap: var(--calendar-gap);
  }

  .weekday {
    height: var(--calendar-weekday-height);
    line-height: var(--calendar-weekday-height);
    color: var(--menu-text-muted);
    font-size: var(--calendar-weekday-size);
    text-align: center;
  }

  .day {
    width: var(--calendar-cell);
    height: var(--calendar-cell);
    padding: 0;
    border: 1px solid var(--menu-line);
    border-radius: var(--radius-small);
    background: none;
    color: var(--menu-text);
    font: inherit;
    font-size: var(--calendar-day-size);
    font-variant-numeric: tabular-nums;
    letter-spacing: normal;
    cursor: pointer;
  }

  /* Each line of the list, a wrapped one too, is a day's height with the days' gap, so it sits level with a week */
  .ahead {
    flex: 1;
    min-width: var(--calendar-list-min-width);
    display: grid;
    align-content: start;
    gap: var(--calendar-gap);
    padding-top: calc(
      var(--calendar-head-height) + var(--calendar-head-gap) + var(--calendar-weekday-height) + var(--calendar-gap)
    );
    color: var(--menu-text-muted);
    font-size: var(--calendar-list-size);
    font-variant-numeric: tabular-nums;
    line-height: var(--calendar-cell);
  }

  .line {
    display: grid;
    grid-template-columns: var(--calendar-month-column) 1fr;
    gap: var(--calendar-list-gap);
  }

  .days {
    display: flex;
    flex-wrap: wrap;
    gap: var(--calendar-gap) var(--calendar-list-gap);
  }

  .year {
    font-size: var(--calendar-year-size);
    font-weight: var(--calendar-year-weight);
  }

  .link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--menu-text);
    font: inherit;
    cursor: pointer;
  }

  /* === States === */

  .nav:hover,
  .lock:hover,
  .lock.open {
    color: var(--menu-text);
  }

  .today {
    font-weight: var(--calendar-today-weight);
  }

  .marked {
    border-color: var(--flex-base);
    background: var(--flex-base);
    color: var(--calendar-marked-text);
  }

  .day:disabled {
    opacity: var(--opacity-disabled);
    cursor: default;
  }

  /* Stacked (App.svelte): the list sits under the calendar, straight after its
     last week */
  :global(:where(:root[data-stacked])) .calendar {
    flex-direction: column;
    gap: var(--calendar-head-gap);
  }

  :global(:where(:root[data-stacked])) .ahead {
    padding-top: 0;
  }
</style>
