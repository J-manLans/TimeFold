<!--
  A profile's row in Profiler ("The menu has tabs, with every value locked behind "Ändra""): its small circle wearing
  where it stands, its name and a chevron. It unfolds in place, its height growing and its content fading in, and
  folds back the same way. Inside: its colours first, compact on one line, then its name, its pay (a monthly salary for the profile with the balance, a rate per
  hour for the others), each behind "Ändra", and its last button ("A profile with hours is archived, one without is
  deleted"): "Arkivera" while it has hours, "Ta bort" in red while it has none, each asking once; "Stoppa jobbet först"
  under it while it runs; "Återställ" once archived. The janitor's row has none: <ProfileRow {profile} {open} {onToggle} />
-->
<script lang="ts">
  import { app } from '$lib/app.svelte'
  import { standsOver } from '$lib/modules/dashboard/figures'
  import { earlierValues, savePay } from '$lib/modules/menu/workTime'
  import { neonColour } from '$lib/modules/shared/colours'
  import { localDay } from '$lib/modules/shared/counting'
  import { nameRefusal, removalOf, renameProfile, restoreProfile } from '$lib/modules/shared/profiles'
  import type { Day, Pay, Profile } from '$lib/modules/shared/record'
  import ColourField from './ColourField.svelte'
  import LockedValue from './LockedValue.svelte'

  // === Props ===

  let {
    profile,
    open,
    onToggle,
  }: {
    profile: Profile
    /** Whether its row is unfolded */
    open: boolean
    /** Asks for the row to unfold or fold; opening one folds any other */
    onToggle: () => void
  } = $props()

  // === State ===

  let today = $derived(localDay(Date.now()))
  let salaried = $derived(profile.expectedMinutes !== undefined)
  let pay = $derived([...(profile.pay ?? [])].sort((a, b) => (a.from < b.from ? -1 : 1)).at(-1))
  let removal = $derived(app.record ? removalOf(app.record, profile.id) : null)
  let asking = $state(false)
  let stopFirst = $state(false)
  let circle = $derived.by(() => {
    const over = app.record !== null && standsOver(app.record, profile.id, today)
    const neon = neonColour(profile.hue)
    return over ? { letter: neon, ring: profile.base } : { letter: profile.base, ring: neon }
  })

  // === Helpers ===

  /** Pay as the row shows it: "2 000 € / månad" or "24 € / h" */
  function payText(item: Pay): string {
    return `${item.amount.toLocaleString('sv-SE')} ${salaried ? '€ / månad' : '€ / h'}`
  }

  /** A typed amount, a comma or a point, zero or more; null while it is not one */
  function readAmount(typed: string): number | null {
    const text = typed.replace(',', '.').replace(/\s/g, '')
    const amount = Number(text)
    return text !== '' && Number.isFinite(amount) && amount >= 0 ? amount : null
  }

  /** The name saved, or the words for why it is refused */
  function saveName(name: string): string | null {
    if (!app.record) return null
    const result = renameProfile(app.record, profile.id, name)
    if ('refusal' in result)
      return result.refusal === 'archived' ? 'Namnet finns bland arkiverade' : 'Namnet finns redan'
    void app.saveSettings(result)
    return null
  }

  /** The pay saved from its date */
  function savePayFrom(amount: number, from: Day): string | null {
    if (app.record) void app.saveSettings(savePay(app.record, profile.id, amount, from))
    return null
  }

  /** The last button: "Återställ" at once; "Arkivera" and "Ta bort" on their second click; refused while it runs */
  function lastButton(): void {
    if (!app.record) return
    if (removal === 'restore') return void app.saveSettings(restoreProfile(app.record, profile.id))
    if (removal === 'running') {
      stopFirst = true
      return
    }
    if (!asking) {
      asking = true
      return
    }
    void app.takeAwayProfile(profile.id)
  }
</script>

<li class="row" class:open class:archived={profile.archived}>
  <button class="head" type="button" aria-expanded={open} onclick={onToggle}>
    <span class="circle" style:color={circle.letter} style:border-color={circle.ring}>
      {profile.name.charAt(0).toUpperCase()}
    </span>
    <span>{profile.name}</span>
    <span class="chevron" aria-hidden="true">›</span>
  </button>
  <div class="wrap" inert={!open}>
    <div class="clip">
      <div class="body">
        <ColourField {profile} />
        <LockedValue
          label="Namn"
          text={profile.name}
          fieldText={profile.name}
          read={(typed) => (app.record && nameRefusal(app.record, typed, profile.id) === 'empty' ? null : typed)}
          save={saveName}
          capital
        />
        <LockedValue
          label={salaried ? 'Månadslön' : 'Timpris'}
          text={pay ? payText(pay) : 'Inget satt'}
          fieldText={pay ? String(pay.amount).replace('.', ',') : ''}
          read={readAmount}
          waiting={(amount) => payText({ kind: salaried ? 'salary' : 'rate', amount })}
          save={savePayFrom}
          dated
          opensOn={today}
          earlier={earlierValues(profile.pay ?? []).map((e) => ({
            text: payText(e.value),
            from: e.from,
            until: e.until,
          }))}
        />
        {#if removal !== null}
          <div class="last">
            <button
              class="small"
              class:remove={removal === 'delete'}
              class:asking
              type="button"
              onclick={lastButton}
              onfocusout={() => {
                asking = false
                stopFirst = false
              }}
            >
              {removal === 'restore'
                ? 'Återställ'
                : removal === 'delete'
                  ? 'Ta bort'
                  : 'Arkivera'}{#if removal !== 'restore'}<span class="q">?</span>{/if}
            </button>
            {#if stopFirst}<span class="warn">Stoppa jobbet först</span>{/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</li>

<style>
  /* === Layout === */

  .row {
    border: 1px solid var(--menu-line);
    border-radius: var(--radius-small);
  }

  .head {
    display: flex;
    align-items: center;
    gap: var(--menu-value-gap-inline);
    width: 100%;
    padding: var(--menu-row-padding);
    border: 0;
    background: none;
    color: var(--menu-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .circle {
    display: grid;
    place-items: center;
    width: var(--mini-disc-size);
    height: var(--mini-disc-size);
    border: var(--mini-disc-ring) solid;
    border-radius: 50%;
    font-size: var(--text-size-label);
    font-weight: var(--mini-disc-weight);
    text-box: trim-both cap alphabetic;
  }

  .chevron {
    margin-left: auto;
    color: var(--menu-text-muted);
    transition: transform var(--speed-ui) ease;
  }

  /* A row unfolds and folds: its body's height grows from 0 to its own size, and fades */
  .wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--speed-ui) var(--ease-grow);
  }

  .clip {
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity var(--speed-ui) ease;
  }

  .body {
    display: grid;
    padding: var(--menu-row-body-padding);
  }

  .last {
    display: grid;
    justify-items: start;
    gap: var(--menu-value-gap);
    padding: var(--menu-value-padding);
    margin-left: calc(var(--menu-label-width) + var(--menu-value-gap-inline));
  }

  .small {
    padding: var(--menu-small-padding);
    border: 1px solid var(--menu-button-line);
    border-radius: var(--radius-small);
    background: none;
    color: var(--menu-text);
    font: inherit;
    font-size: var(--text-size-small);
    cursor: pointer;
  }

  .q {
    visibility: hidden;
  }

  .warn {
    color: var(--edit-remove);
    font-size: var(--text-size-note);
  }

  /* === States === */

  .open .chevron {
    transform: rotate(90deg);
  }

  .open .wrap {
    grid-template-rows: 1fr;
  }

  .open .clip {
    opacity: 1;
  }

  .archived .head {
    opacity: var(--menu-archived-opacity);
  }

  /* Asking once: the word gets its "?" and a border; "Ta bort" in the removal red throughout */
  .asking .q {
    visibility: visible;
  }

  .asking {
    border-color: var(--menu-text);
  }

  .remove {
    border-color: transparent;
    color: var(--edit-remove);
  }

  .remove.asking {
    border-color: var(--edit-remove);
  }
</style>
