/**
 * The app's state while it runs: the record in memory, the machine's theme and motion, and the actions that change them
 * and save them. Components read it and call its actions; nothing else changes the record. Svelte's $state makes every
 * component that reads a field follow it when it changes.
 */

import { setBreak, type BreakRefusal } from '$lib/modules/controls/breaks'
import { press, runningSinceEarlierDay, stopRunning, undo, type Click } from '$lib/modules/controls/clock'
import { localDay } from '$lib/modules/shared/counting'
import {
  freshRecord,
  recoveryFor,
  type Day,
  type Entry,
  type Problem,
  type Recovery,
  type TimeRecord,
} from '$lib/modules/shared/record'
import { deleteEntry, savedEntryId, saveLine } from '$lib/modules/edit/edit'
import { learnReason } from '$lib/modules/edit/reasons'
import { type LineState, type View } from '$lib/modules/edit/line'
import { toggleFlexDay } from '$lib/modules/menu/flexDays'
import {
  nextMotion,
  nextTheme,
  shownMotion,
  shownTheme,
  type Motion,
  type ShownMotion,
  type ShownTheme,
  type Theme,
} from '$lib/modules/menu/settings'
import {
  copyRecord,
  loadRecord,
  loadSettings,
  newestCopy,
  saveRecord,
  saveSettings,
  type Copy,
} from '$lib/modules/shared/storage'

// ======================================
//                 API
// ======================================

/** Where the app is: loading, waiting for a fresh start, stopped by a file it cannot read, or ready to clock */
export type Phase = 'loading' | 'welcome' | 'problem' | 'ready'

/**
 * The menu's panel locked open over the controls side, for the first start's onboarding ("A first install starts
 * fresh or imports") or a record that cannot be read ("A record that cannot be read offers the newest copy"), and its
 * ending step by step: the answer given, the panel turned to frost, folded into its button, and at the first start
 * the light sweeping across the buttons and the letter arriving
 */
export interface LockedPanel {
  ending: boolean
  frosted: boolean
  folded: boolean
  sweeping: boolean
  letter: boolean
}

/**
 * What the edit popup has open: an entry chosen from a list, or the gap a forgotten entry is written in, and whether it
 * opened over "Visa alla" ("Editing an entry on its line")
 */
export interface Editing {
  entryId: string | null
  gap: View | null
  stacked: boolean
}

/**
 * The computer's reduced-motion setting, which the motion follows while it is "System". Above the class, since its
 * fields read it when `app` is made
 */
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

class AppState {
  // === State ===

  phase = $state<Phase>('loading')
  record = $state<TimeRecord | null>(null)
  /** Why the record could not be read, while `phase` is 'problem' */
  problem = $state<Problem | null>(null)
  /** What the screen for a record that cannot be read offers, while `phase` is 'problem' */
  recovery = $state<Recovery | null>(null)
  /** The day of the copy it offers, whose record the dashboard shows meanwhile */
  copyDay = $state<Day | null>(null)
  /** The step the onboarding opens on: its two buttons, or its balance after the recovery screen's "Starta nytt" */
  onboardingFrom = $state<'choice' | 'balance'>('choice')
  /** The profile on screen, whose button the start/stop is */
  onScreen = $state('p1')
  /** The last click, for the undo; kept only while the app runs, never in the record */
  lastClick = $state<Click | null>(null)
  /** This machine's theme, from its settings file */
  theme = $state<Theme>('system')
  /** Whether the computer asks for the dark theme, which "System" follows */
  systemDark = $state(matchMedia('(prefers-color-scheme: dark)').matches)
  /** This machine's motion, from its settings file */
  motion = $state<Motion>('system')
  /** Whether the computer asks for reduced motion, which "System" follows */
  systemStill = $state(matchMedia(REDUCED_MOTION).matches)
  /**
   * The entry found running from an earlier day when the app opened, for its popup; null once answered, or when none
   * was ("A running entry from an earlier day asks")
   */
  late = $state<Entry | null>(null)
  /** The menu's panel while it is locked open, at the first start or a record that cannot be read; null otherwise */
  panel = $state<LockedPanel | null>(null)
  /** The edit popup's entry or gap, while it is open */
  editing = $state<Editing | null>(null)
  /** The entry a save from "Visa alla" left outlined there, until another row opens or the list closes */
  savedId = $state<string | null>(null)

  /** The theme in force on screen */
  shownTheme: ShownTheme = $derived(shownTheme(this.theme, this.systemDark))
  /** The motion in force: Animerat ('on') or Stilla ('off') */
  shownMotion: ShownMotion = $derived(shownMotion(this.motion, this.systemStill))
  /** Whether the app is in Stilla, where nothing moves ("Motion can be switched off in the app") */
  still: boolean = $derived(this.shownMotion === 'off')
  /** The entry that runs, if any; at most one does */
  running: Entry | null = $derived(this.record?.entries.find((e) => e.stop === null) ?? null)

  // === Init ===

  /**
   * Loads the machine's theme and the record, and decides where the app starts. Used once, when the app starts: no
   * record opens the onboarding, on a fresh record kept only in memory until it is finished; a broken one the problem
   * screen.
   */
  async load(): Promise<void> {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => (this.systemDark = e.matches))
    matchMedia(REDUCED_MOTION).addEventListener('change', (e) => {
      this.systemStill = e.matches
      this.#applyMotion(this.motion)
    })
    this.#applyMotion(this.motion)
    const settings = await loadSettings()
    this.#applyTheme(settings.theme)
    this.#applyMotion(settings.motion)
    const result = await loadRecord()
    if (result === null) {
      this.record = freshRecord('', 0, localDay(Date.now()))
      this.onScreen = this.record.profiles[0].id
      this.panel = { ...PANEL_OPEN }
      this.phase = 'welcome'
      return
    }
    if (!result.ok) {
      const copy = await readNewestCopy()
      this.problem = result.problem
      this.recovery = recoveryFor(result.problem, copy !== null)
      this.copyDay = this.recovery === 'copy' && copy !== null ? copy.day : null
      // The dashboard shows the copy it offers, or nothing
      this.record = this.recovery === 'copy' && copy !== null ? copy.record : freshRecord('', 0, localDay(Date.now()))
      this.onScreen = this.record.profiles[0].id
      this.panel = { ...PANEL_OPEN }
      this.phase = 'problem'
      return
    }
    this.#ready(result.record)
    // The day's copy, from the file that has just passed the check; a copy that fails does not stop the app
    try {
      await copyRecord()
    } catch (error) {
      console.error('The daily copy could not be made', error)
    }
  }

  // === API ===

  /** The start/stop button pressed for the profile on screen. Used by the button: starts, stops or switches, then saves */
  async press(): Promise<void> {
    if (this.record === null) return
    const done = press(this.record, this.onScreen, new Date())
    this.record = done.record
    this.lastClick = done.click
    await saveRecord(done.record)
  }

  /**
   * The popup's "Stoppa": the running entry stops as the start/stop button stops it, whichever profile is on screen,
   * and can be undone; the popup closes. Used by the popup for a running entry from an earlier day
   */
  async stopLate(): Promise<void> {
    this.late = null
    if (this.record === null) return
    const done = stopRunning(this.record, new Date())
    if (done.click === null) return
    this.record = done.record
    this.lastClick = done.click
    await saveRecord(done.record)
  }

  /** The popup's "Fortfarande igång": the entry runs on and the popup closes, remembering nothing. Used by the popup */
  keepLate(): void {
    this.late = null
  }

  /**
   * The running entry of the profile on screen given a whole break of `minutes`, which the undo can take back, then
   * saved. Used by "Lägg till paus" on Enter
   * @returns why it was refused, or null once set
   */
  async setBreak(minutes: number): Promise<BreakRefusal | null> {
    if (this.record === null) return 'nothing-runs'
    const done = setBreak(this.record, this.onScreen, minutes, new Date())
    if (!done.ok) return done.why
    this.record = done.record
    this.lastClick = done.click
    await saveRecord(done.record)
    return null
  }

  /**
   * A day clicked in the flex-day calendar: marked as a flex day, or unmarked, and saved; the balance on screen follows
   * at once. A weekend, or a day gone by while the padlock is shut, is left as it is. Used by each day in the calendar
   * @param unlocked - whether the calendar's padlock is open
   */
  async toggleFlexDay(day: Day, unlocked: boolean): Promise<void> {
    if (this.record === null) return
    const done = toggleFlexDay(this.record, day, localDay(Date.now()), unlocked)
    if (!done.ok) return
    this.record = done.record
    await saveRecord(done.record)
  }

  /**
   * An entry chosen from a list opens in the edit popup; the last click can no longer be undone, whether the edit is
   * saved or not ("The last click can be undone for a few seconds"). Used by every row: from "Senaste" alone, from
   * "Visa alla" stacked on the list
   */
  openEdit(entryId: string, stacked: boolean): void {
    this.lastClick = null
    this.savedId = null
    this.editing = { entryId, gap: null, stacked }
  }

  /** A gap's "+" in "Visa alla" opens the edit popup on it, for a forgotten entry, the undo put out. Used by the gaps */
  openGap(gap: View): void {
    this.lastClick = null
    this.savedId = null
    this.editing = { entryId: null, gap, stacked: true }
  }

  /** The edit popup closes, nothing saved. Used by "Avbryt", Esc and a click outside */
  closeEdit(): void {
    this.editing = null
  }

  /**
   * The edit confirmed: what the line shows goes into the record with its reason, and is saved; the popup closes. From
   * "Visa alla", the saved entry's row stays outlined there. Used by "Spara"
   */
  async saveEdit(line: LineState, reason: string): Promise<void> {
    if (this.record === null) return
    const before = this.record
    // A typed reason is counted, and joins the list on its third writing ("Every edit carries a reason")
    this.record = learnReason(saveLine(before, line, reason), reason)
    this.savedId = this.editing?.stacked ? savedEntryId(before, this.record, line) : null
    this.editing = null
    await saveRecord(this.record)
  }

  /** The entry being edited deleted and saved; the popup closes. Used by "Ta bort" on its second click */
  async deleteEdited(): Promise<void> {
    const id = this.editing?.entryId
    if (this.record === null || !id) return
    this.record = deleteEntry(this.record, id)
    this.editing = null
    await saveRecord(this.record)
  }

  /** The undo pressed. Used by the undo button: reverses the last click if its time is not up, then saves */
  async undo(): Promise<void> {
    if (this.record === null || this.lastClick === null) return
    const before = this.record
    const after = undo(before, this.lastClick, new Date(), undoSeconds())
    this.lastClick = null
    if (after === before) return
    this.record = after
    await saveRecord(after)
  }

  /**
   * The onboarding's balance entered: the opening balance, in minutes, which the dashboard counts to. Used by the
   * onboarding on Enter, and with 0 when it goes back past the balance; nothing is saved yet
   */
  setOpening(minutes: number): void {
    if (this.record === null || this.phase !== 'welcome') return
    const [opening, ...rest] = this.record.openings
    this.record = { ...this.record, openings: [{ ...opening, balanceMinutes: minutes }, ...rest] }
  }

  /**
   * The onboarding's name entered: the first profile gets it and the record is saved for the first time; the ending
   * then plays. Used by the onboarding on Enter
   */
  async finishStart(name: string): Promise<void> {
    if (this.record === null || this.panel === null) return
    const [first, ...rest] = this.record.profiles
    this.record = { ...this.record, profiles: [{ ...first, name }, ...rest] }
    this.panel = { ...this.panel, ending: true }
    await saveRecord(this.record)
  }

  /**
   * The recovery screen's "Använd kopian": the copy becomes the record and is saved over the broken file; the panel's
   * ending then plays. Used by the recovery screen
   */
  async useCopy(): Promise<void> {
    if (this.record === null || this.panel === null || this.recovery !== 'copy') return
    // The app opens on the copy, so a copy with an entry running from an earlier day asks, once the panel has folded
    this.late = runningSinceEarlierDay(this.record, new Date())
    this.panel = { ...this.panel, ending: true }
    await saveRecord(this.record)
  }

  /**
   * The recovery screen's "Starta nytt", when there is no copy: the onboarding, from its balance, on a fresh record
   * that replaces the broken file once it is finished. Used by the recovery screen
   */
  startFresh(): void {
    this.record = freshRecord('', 0, localDay(Date.now()))
    this.onScreen = this.record.profiles[0].id
    this.recovery = null
    this.copyDay = null
    this.onboardingFrom = 'balance'
    this.panel = { ...PANEL_OPEN }
    this.phase = 'welcome'
  }

  /** The locked panel's ending moves on a step. Used by the onboarding's and recovery's timelines: { folded: true } */
  stepPanel(step: Partial<LockedPanel>): void {
    if (this.panel !== null) this.panel = { ...this.panel, ...step }
  }

  /** The locked panel's ending is over: the app is ready to clock. Used by the timelines, last */
  unlock(): void {
    this.panel = null
    this.recovery = null
    this.copyDay = null
    this.problem = null
    this.phase = 'ready'
  }

  /**
   * The theme button pressed. Used by the theme button: switches to the other of the theme in force, shows it at once,
   * then saves it, so the app stops following the computer
   */
  async switchTheme(): Promise<void> {
    this.#applyTheme(nextTheme(this.theme, this.systemDark))
    await saveSettings({ theme: this.theme, motion: this.motion })
  }

  /**
   * The motion switch pressed. Used by the switch, in the menu's heading and in the onboarding's note: switches to the
   * other of the motion in force, shows it at once, then saves it, so the app stops following the computer
   */
  async switchMotion(): Promise<void> {
    this.#applyMotion(nextMotion(this.motion, this.systemStill))
    await saveSettings({ theme: this.theme, motion: this.motion })
  }

  // === Helpers ===

  /**
   * Shows `theme`: color-scheme on the page picks each token's light or dark side, and "System" leaves the pick to
   * the computer. Used by `load` and `switchTheme`
   */
  #applyTheme(theme: Theme): void {
    this.theme = theme
    document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme
  }

  /**
   * Shows `motion`: data-still on the page while it is Stilla, which takes every transition, animation and delay away
   * (base.css), in the same moment the state changes. Used by `load`, its listener and `switchMotion`
   */
  #applyMotion(motion: Motion): void {
    this.motion = motion
    document.documentElement.toggleAttribute('data-still', shownMotion(motion, this.systemStill) === 'off')
  }

  /** Shows the main screen on `record`, with its first profile on screen. Used by `load` */
  #ready(record: TimeRecord): void {
    this.record = record
    this.onScreen = record.profiles[0].id
    this.late = runningSinceEarlierDay(record, new Date())
    this.phase = 'ready'
  }
}

/** The one state of the running app. Used by every component that shows or changes the record */
export const app = new AppState()

// ======================================
//               Helpers
// ======================================

/**
 * The newest copy that can be read, or null; a failure to look counts as none, since the screen still works without
 * one. Used by `load` when the record cannot be read
 */
async function readNewestCopy(): Promise<Copy | null> {
  try {
    return await newestCopy()
  } catch (error) {
    console.error('The newest copy could not be read', error)
    return null
  }
}

/** The locked panel as it opens, before any step of its ending */
const PANEL_OPEN: LockedPanel = { ending: false, frosted: false, folded: false, sweeping: false, letter: false }

/** How long a click can be undone, read from the design token --undo-time. Used by `undo`: 15s gives 15 */
function undoSeconds(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--undo-time')
  return parseFloat(value) || 15
}
