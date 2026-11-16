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

  /** The entry that runs, if any; at most one does */
  running: Entry | null = $derived(this.record?.entries.find((e) => e.stop === null) ?? null)

  // === Init ===

  /**
   * Loads the machine's theme and the record, and decides where the app starts. Used once, when the app starts: no
   * record opens the welcome screen (in dev mode, a fresh record instead, until the onboarding exists), a broken one
   * the problem screen.
   */
  async load(): Promise<void> {
    this.#applyTheme((await loadSettings()).theme)
    const result = await loadRecord()
    if (result === null) {
      if (!import.meta.env.DEV) {
        this.phase = 'welcome'
        return
      }
      // TODO: dev mode's fresh record goes once the onboarding makes the first record
      const record = freshRecord('Vaktmästare', 0, localDay(Date.now()))
      await saveRecord(record)
      this.#ready(record)
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
