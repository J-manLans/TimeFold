/**
 * The record and the machine's settings on the disk, through the Rust half's commands ("Rust touches the disk;
 * TypeScript knows the record"). The only module that calls invoke.
 */

import { invoke } from '@tauri-apps/api/core'
import { localDay } from './counting'
import { readRecord, type ReadResult, type TimeRecord } from './record'
import { readSettings, type Settings } from './settings'

// ======================================
//                 API
// ======================================

/**
 * Loads the record from the disk and checks it. Used once, when the app starts: null opens the welcome screen, a
 * problem opens the screen that names it, and a record opens the main screen.
 * @returns null when there is no record yet, otherwise the record or the problem with the file
 */
export async function loadRecord(): Promise<ReadResult | null> {
  const text = await invoke<string | null>('load_record')
  return text === null ? null : readRecord(text)
}

/**
 * Saves the record to the disk, safely, as readable JSON. The first save of a day first keeps a copy of the record as
 * it stood. Used after every change: the first record at onboarding, each start and stop, each correction.
 * @param record - the whole record
 * @param now - the moment of the save, whose local date names the day's copy
 */
export async function saveRecord(record: TimeRecord, now: Date = new Date()): Promise<void> {
  // Indented, so the file reads well if it is ever opened by hand
  await invoke('save_record', { json: JSON.stringify(record, null, 2), today: localDay(now.getTime()) })
}

/**
 * Loads this machine's settings. A file that is missing or cannot be read gives the defaults, with no error, since it
 * only holds the theme. Used once, when the app starts.
 */
export async function loadSettings(): Promise<Settings> {
  try {
    return readSettings(await invoke<string | null>('load_settings'))
  } catch {
    return readSettings(null)
  }
}

/**
 * Saves this machine's settings, safely. Used after each change of them, such as a click on the theme button; the next
 * change after a broken file writes a sound one.
 */
export async function saveSettings(settings: Settings): Promise<void> {
  await invoke('save_settings', { json: JSON.stringify(settings, null, 2) })
}
