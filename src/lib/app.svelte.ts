/**
 * The app's state while it runs: the record in memory, the machine's theme, and the actions that change them and save
 * them. Components read it and call its actions; nothing else changes the record. Svelte's $state makes every
 * component that reads a field follow it when it changes.
 */

import { press, undo, type Click } from '$lib/modules/controls/clock'
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
import { nextTheme, shownTheme, type ShownTheme, type Theme } from '$lib/modules/menu/settings'
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
  /** The menu's panel while it is locked open, at the first start or a record that cannot be read; null otherwise */
  panel = $state<LockedPanel | null>(null)

  /** The theme in force on screen */
  shownTheme: ShownTheme = $derived(shownTheme(this.theme, this.systemDark))
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
    this.#applyTheme((await loadSettings()).theme)
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
    await saveSettings({ theme: this.theme })
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

  /** Shows the main screen on `record`, with its first profile on screen. Used by `load` */
  #ready(record: TimeRecord): void {
    this.record = record
    this.onScreen = record.profiles[0].id
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
