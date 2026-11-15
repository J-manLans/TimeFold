/**
 * The record on the disk, through the Rust half's commands ("Rust touches the disk; TypeScript knows the record").
 * The only module that calls invoke for the record.
 */

import { invoke } from '@tauri-apps/api/core'
import { readRecord, type ReadResult, type TimeRecord } from './record'

// ======================================
//                 API
// ======================================

/**
 * Loads the record from the disk and checks it.
 * @returns null when there is no record yet, otherwise the record or the problem with the file
 */
export async function loadRecord(): Promise<ReadResult | null> {
  const text = await invoke<string | null>('load_record')
  return text === null ? null : readRecord(text)
}

/**
 * Saves the record to the disk, safely, as readable JSON. The first save of a day first keeps a copy of the record as
 * it stood.
 * @param record - the whole record
 * @param now - the moment of the save, whose local date names the day's copy
 */
export async function saveRecord(record: TimeRecord, now: Date = new Date()): Promise<void> {
  // Indented, so the file reads well if it is ever opened by hand
  await invoke('save_record', { json: JSON.stringify(record, null, 2), today: localDay(now) })
}

// ======================================
//               Helpers
// ======================================

/** The date of `now` on this machine's calendar, written YYYY-MM-DD */
function localDay(now: Date): string {
  const two = (n: number): string => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`
}
