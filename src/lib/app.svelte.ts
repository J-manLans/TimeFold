/**
 * The app's state while it runs: the record in memory, the machine's theme, and the actions that change them and save
 * them. Components read
 * it and call its actions; nothing else changes the record. Svelte's $state makes every component that reads a field
 * follow it when it changes.
 */

import { press, undo, type Click } from '$lib/modules/clock'
import { localDay } from '$lib/modules/counting'
import { freshRecord, type Entry, type Problem, type TimeRecord } from '$lib/modules/record'
import { nextTheme, type Theme } from '$lib/modules/settings'
import { loadRecord, loadSettings, saveRecord, saveSettings } from '$lib/modules/storage'

// ======================================
//                 API
// ======================================

/** Where the app is: loading, waiting for a fresh start, stopped by a file it cannot read, or ready to clock */
export type Phase = 'loading' | 'welcome' | 'problem' | 'ready'

/**
 * The first start's ending, step by step ("A first install starts fresh or imports"): the answers given, the panel
 * turned to frost, folded into its button, the light sweeping across the buttons, and the letter arriving
 */
export interface Welcome {
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
  /** The profile on screen, whose button the start/stop is */
  onScreen = $state('p1')
  /** The last click, for the undo; kept only while the app runs, never in the record */
  lastClick = $state<Click | null>(null)
  /** This machine's theme, from its settings file */
  theme = $state<Theme>('system')
  /** The first start, while the phase is 'welcome': where its ending has got to */
  welcome = $state<Welcome | null>(null)

  /** The entry that runs, if any; at most one does */
  running: Entry | null = $derived(this.record?.entries.find((e) => e.stop === null) ?? null)

  // === Init ===

  /**
   * Loads the machine's theme and the record, and decides where the app starts. Used once, when the app starts: no
   * record opens the onboarding, on a fresh record kept only in memory until it is finished; a broken one the problem
   * screen.
   */
  async load(): Promise<void> {
    this.#applyTheme((await loadSettings()).theme)
    const result = await loadRecord()
    if (result === null) {
      this.record = freshRecord('', 0, localDay(Date.now()))
      this.onScreen = this.record.profiles[0].id
      this.welcome = { ending: false, frosted: false, folded: false, sweeping: false, letter: false }
      this.phase = 'welcome'
      return
    }
    if (!result.ok) {
      this.problem = result.problem
      this.phase = 'problem'
      return
    }
    this.#ready(result.record)
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
    if (this.record === null || this.welcome === null) return
    const [first, ...rest] = this.record.profiles
    this.record = { ...this.record, profiles: [{ ...first, name }, ...rest] }
    this.welcome = { ...this.welcome, ending: true }
    await saveRecord(this.record)
  }

  /** The onboarding's ending moves on a step. Used by the onboarding's timeline: { frosted: true } */
  stepWelcome(step: Partial<Welcome>): void {
    if (this.welcome !== null) this.welcome = { ...this.welcome, ...step }
  }

  /** The onboarding's ending is over: the app is ready to clock. Used by the onboarding's timeline, last */
  endWelcome(): void {
    this.welcome = null
    this.phase = 'ready'
  }

  /** The theme button pressed. Used by the theme button: moves to the next theme, shows it at once, then saves it */
  async cycleTheme(): Promise<void> {
    this.#applyTheme(nextTheme(this.theme))
    await saveSettings({ theme: this.theme })
  }

  // === Helpers ===

  /**
   * Shows `theme`: color-scheme on the page picks each token's light or dark side, and "System" leaves the pick to
   * the computer. Used by `load` and `cycleTheme`
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

/** How long a click can be undone, read from the design token --undo-time. Used by `undo`: 15s gives 15 */
function undoSeconds(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--undo-time')
  return parseFloat(value) || 15
}
