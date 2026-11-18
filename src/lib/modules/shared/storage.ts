/**
 * The record and the machine's settings on the disk, through the Rust half's commands ("Rust touches the disk;
 * TypeScript knows the record"). The only module that calls invoke.
 */

import { invoke } from '@tauri-apps/api/core'
import { localDay } from '$lib/modules/shared/counting'
import { readRecord, type Day, type ReadResult, type TimeRecord } from '$lib/modules/shared/record'
import { readSettings, type Settings } from '$lib/modules/menu/settings'

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
 * Saves the record to the disk, safely, as readable JSON; it copies nothing. Used after every change: the first record
 * at onboarding, each start and stop, each correction, and a copy taken at recovery.
 */
export async function saveRecord(record: TimeRecord): Promise<void> {
  // Indented, so the file reads well if it is ever opened by hand
  await invoke('save_record', { json: JSON.stringify(record, null, 2) })
}

/**
 * Keeps the day's copy of the record as it stands on the disk, unless the day has one or it is the same as the newest
 * ("The record is one JSON file"). Used when the app starts, once the record has passed the check, so every copy is
 * readable.
 * @param now - the moment the app started, whose local date names the copy
 */
export async function copyRecord(now: Date = new Date()): Promise<void> {
  await invoke('copy_record', { today: localDay(now.getTime()) })
}

/** The newest daily copy that can be read: its day and its record */
export interface Copy {
  day: Day
  record: TimeRecord
}

/**
 * Reads the newest daily copy and checks it. Used when the record cannot be read, to offer the copy ("A record that
 * cannot be read offers the newest copy").
 * @returns null when there is no copy, or the newest cannot be read as a record either
 */
export async function newestCopy(): Promise<Copy | null> {
  const found = await invoke<[Day, string] | null>('newest_copy')
  if (found === null) return null
  const [day, text] = found
  const result = readRecord(text)
  return result.ok ? { day, record: result.record } : null
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
