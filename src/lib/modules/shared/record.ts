/**
 * The record's shape: everything the app keeps, as it is written to record.json and to a handover file
 * ("The record is one JSON file"). Times of day are timestamps with their offset; amounts of time are whole minutes.
 */

import { FIRST_HUE, neonBase } from '$lib/modules/shared/colours'

// ======================================
//                 API
// ======================================

/** Marks a file as a TimeFold record, so a wrong file is named as such */
export const RECORD_FORMAT = 'timefold-record'

/** The shape's version; it goes up whenever the shape changes */
export const RECORD_VERSION = 2

/** The janitor's expected minutes a working day, as a fresh record starts them ("Expected hours: 6 a day, Monday to Friday") */
const EXPECTED_MINUTES = 6 * 60

/** Full time in minutes a working day, as a fresh or upgraded record starts it ("The other profiles share a ceiling") */
const FULL_TIME_MINUTES = 8 * 60

/** A calendar day, written YYYY-MM-DD */
export type Day = string

/** A moment, written as ISO 8601 with its offset, such as 2026-11-16T07:58:00+02:00 */
export type Timestamp = string

/** A value that applies from a day on, until a later one replaces it ("Settings change from a date") */
export type FromDay<T> = T & { from: Day }

/** A kind of work, such as janitor work; every entry belongs to one ("Profiles label the hours") */
export interface Profile {
  id: string
  name: string
  /** The profile's OKLCH hue, 0–359; its over colour follows from it ("Each profile carries its colours") */
  hue: number
  /** The base colour, a nuance of the hue, as #rrggbb */
  base: string
  /** Only the profile with a balance has expected minutes per working day */
  expectedMinutes?: FromDay<{ minutes: number }>[]
  /** A monthly salary or a rate per hour, for the pay estimate ("A pay estimate per profile"); none leaves it out */
  pay?: FromDay<Pay>[]
}

/** What a profile pays, in euros: a salary once a month, or a rate for each hour worked */
export interface Pay {
  kind: PayKind
  amount: number
}

/** A salary counts once a month whatever the hours; a rate counts the hours */
export type PayKind = 'salary' | 'rate'

/** A balance brought over from before the app, dated the first day ("A first install starts fresh or imports") */
export interface Opening {
  profile: string
  day: Day
  balanceMinutes: number
}

/** How an entry was made ("Entries remember how they were made") */
export type Made = 'clicked' | 'hand' | 'edited'

/** One stretch of work, from a start to a stop; `stop` is null while it runs */
export interface Entry {
  id: string
  profile: string
  start: Timestamp
  stop: Timestamp | null
  made: Made
}

/** The whole record */
export interface TimeRecord {
  format: typeof RECORD_FORMAT
  version: number
  profiles: Profile[]
  openings: Opening[]
  /** Full time a working day, whose rest after the janitor's expected hours is the other profiles' ceiling */
  fullTime: FromDay<{ minutes: number }>[]
  entries: Entry[]
}

/** Why a file could not be read as a record */
export type Problem =
  | { kind: 'not-json'; detail: string }
  | { kind: 'not-a-record' }
  | { kind: 'newer-version'; version: number }
  | { kind: 'wrong-shape'; where: string }

/**
 * What the screen for a record that cannot be read offers: the newest copy, a fresh start when there is none, or an
 * update when the record is from a newer version
 */
export type Recovery = 'copy' | 'bare' | 'newer'

/**
 * What a problem with the record leads to ("A record that cannot be read offers the newest copy"). Used when the app
 * starts on a record it cannot read: a broken file with a copy offers the copy, one without a fresh start, and a newer
 * record, copy or not, an update.
 * @param hasCopy - whether a readable copy exists
 */
export function recoveryFor(problem: Problem, hasCopy: boolean): Recovery {
  if (problem.kind === 'newer-version') return 'newer'
  return hasCopy ? 'copy' : 'bare'
}

/** What reading a file gives: the record, or the problem with it */
export type ReadResult = { ok: true; record: TimeRecord } | { ok: false; problem: Problem }

/**
 * Reads a file's text as a record, checking it on the way ("The record is one JSON file"). Names what is wrong
 * rather than guessing; a record from a newer version of the app is refused, so it is never saved back without what
 * this version does not know. Used when the app starts, through `loadRecord`, and for a handover file at import.
 * @param text - the file's text, as the disk gave it
 * @returns the record, or the problem with the text
 */
export function readRecord(text: string): ReadResult {
  let data: unknown

  try {
    data = JSON.parse(text)
  } catch (error) {
    return { ok: false, problem: { kind: 'not-json', detail: error instanceof Error ? error.message : String(error) } }
  }

  if (!isObject(data) || data.format !== RECORD_FORMAT) return { ok: false, problem: { kind: 'not-a-record' } }

  // The version is read before anything else: a newer shape is not this version's to judge
  if (typeof data.version === 'number' && data.version > RECORD_VERSION) {
    return { ok: false, problem: { kind: 'newer-version', version: data.version } }
  }

  try {
    if (data.version === 1) upgradeFromOne(data)
    checkRecord(data)
  } catch (error) {
    if (error instanceof ShapeError) return { ok: false, problem: { kind: 'wrong-shape', where: error.where } }
    throw error
  }

  return { ok: true, record: data as unknown as TimeRecord }
}

/**
 * A new record for "Starta nytt": one profile, the one with the balance, expected to work 6 h a day of a full time of 8
 * h from the first day, and the balance brought over from before, dated that day ("A first install starts fresh or
 * imports"). Used by the onboarding, which names it and sets its balance before the first save, and when a broken
 * record with no copy starts fresh: freshRecord('Vaktmästare', 750, '2026-11-16').
 * @param openingMinutes - the balance from the Excel file as it stood the evening before, in minutes; minus is owed
 * @param firstDay - the first day in the app, written YYYY-MM-DD
 */
export function freshRecord(profileName: string, openingMinutes: number, firstDay: Day): TimeRecord {
  return {
    format: RECORD_FORMAT,
    version: RECORD_VERSION,
    profiles: [
      {
        id: 'p1',
        name: profileName,
        hue: FIRST_HUE,
        base: neonBase(FIRST_HUE),
        expectedMinutes: [{ from: firstDay, minutes: EXPECTED_MINUTES }],
      },
    ],
    openings: [{ profile: 'p1', day: firstDay, balanceMinutes: openingMinutes }],
    fullTime: [{ from: firstDay, minutes: FULL_TIME_MINUTES }],
    entries: [],
  }
}

// ======================================
//               Helpers
// ======================================

/**
 * Thrown inside the check; carries where the shape went wrong. Used by the checks below, and caught in
 * `readRecord`: a missing start gives entries[1].start
 */
class ShapeError extends Error {
  readonly where: string

  constructor(where: string) {
    super(`The record's shape is wrong at ${where}`)
    this.where = where
  }
}

type Fields = { [key: string]: unknown }

const DAY = /^\d{4}-\d{2}-\d{2}$/
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?([+-]\d{2}:\d{2}|Z)$/
const MADE: readonly Made[] = ['clicked', 'hand', 'edited']
const PAY_KINDS: readonly PayKind[] = ['salary', 'rate']
const MINUTES_A_DAY = 24 * 60

/**
 * Brings a version 1 record to this version: full time, which it did not have, starts at 8 h from its first opening.
 * Used by `readRecord` before the check, which then judges the result; a record with no opening is left for it to name
 */
function upgradeFromOne(data: Fields): void {
  const openings = Array.isArray(data.openings) ? (data.openings as unknown[]) : []
  const days = openings
    .map((opening) => (isObject(opening) ? opening.day : undefined))
    .filter(isText)
    .sort()
  if (days.length === 0) throw new ShapeError('openings')
  data.fullTime = [{ from: days[0], minutes: FULL_TIME_MINUTES }]
  data.version = RECORD_VERSION
}

/** Whether a value is a string. Used by `upgradeFromOne` to keep only the openings' days */
function isText(value: unknown): value is string {
  return typeof value === 'string'
}

/** Whether a value is a plain object. Used by `readRecord` for the whole file, and by `fields` */
function isObject(value: unknown): value is Fields {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Checks every part of the record, throwing a ShapeError at the first that is wrong. Used by `readRecord` once
 * the format and version have passed
 */
function checkRecord(data: Fields): void {
  whole(data.version, 'version', RECORD_VERSION, RECORD_VERSION)
  list(data.profiles, 'profiles', (profile, at) => {
    text(profile.id, `${at}.id`)
    text(profile.name, `${at}.name`)
    whole(profile.hue, `${at}.hue`, 0, 359)
    text(profile.base, `${at}.base`)
    if (profile.expectedMinutes !== undefined) {
      list(profile.expectedMinutes, `${at}.expectedMinutes`, (item, where) => {
        day(item.from, `${where}.from`)
        whole(item.minutes, `${where}.minutes`, 0)
      })
    }
    if (profile.pay !== undefined) {
      list(profile.pay, `${at}.pay`, (item, where) => {
        day(item.from, `${where}.from`)
        if (!PAY_KINDS.includes(item.kind as PayKind)) throw new ShapeError(`${where}.kind`)
        amount(item.amount, `${where}.amount`)
      })
    }
  })
  list(data.openings, 'openings', (opening, at) => {
    text(opening.profile, `${at}.profile`)
    day(opening.day, `${at}.day`)
    whole(opening.balanceMinutes, `${at}.balanceMinutes`)
  })
  list(data.fullTime, 'fullTime', (item, at) => {
    day(item.from, `${at}.from`)
    whole(item.minutes, `${at}.minutes`, 0, MINUTES_A_DAY)
  })
  list(data.entries, 'entries', (entry, at) => {
    text(entry.id, `${at}.id`)
    text(entry.profile, `${at}.profile`)
    timestamp(entry.start, `${at}.start`)
    if (entry.stop !== null) timestamp(entry.stop, `${at}.stop`)
    if (!MADE.includes(entry.made as Made)) throw new ShapeError(`${at}.made`)
  })
}

/** A whole number within `min` and `max`, or a ShapeError at `where`. Used for minutes, the hue and the version */
function whole(value: unknown, where: string, min = -Infinity, max = Infinity): void {
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) throw new ShapeError(where)
}

/** A sum of money, zero or more and not necessarily whole, or a ShapeError at `where`. Used for salaries and rates */
function amount(value: unknown, where: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new ShapeError(where)
}

/**
 * A value as a list, each item checked by `check` with its place, such as entries[1]. Used for profiles,
 * openings, entries, expected minutes, pay and full time
 */
function list(value: unknown, where: string, check: (item: Fields, at: string) => void): void {
  if (!Array.isArray(value)) throw new ShapeError(where)
  value.forEach((item, i) => check(fields(item, `${where}[${i}]`), `${where}[${i}]`))
}

/** A string with something in it, or a ShapeError at `where`. Used for ids, names and colours */
function text(value: unknown, where: string): void {
  if (typeof value !== 'string' || value === '') throw new ShapeError(where)
}

/** A real day written YYYY-MM-DD, or a ShapeError at `where`. Used for openings and from-dates: 16.11.2026 fails */
function day(value: unknown, where: string): void {
  if (typeof value !== 'string' || !DAY.test(value) || Number.isNaN(Date.parse(value))) throw new ShapeError(where)
}

/** A value as an object, or a ShapeError at `where`. Used for each profile, opening and entry */
function fields(value: unknown, where: string): Fields {
  if (!isObject(value)) throw new ShapeError(where)
  return value
}

/** A real moment written ISO 8601 with its offset, or a ShapeError at `where`. Used for an entry's start and stop */
function timestamp(value: unknown, where: string): void {
  if (typeof value !== 'string' || !TIMESTAMP.test(value) || Number.isNaN(Date.parse(value))) {
    throw new ShapeError(where)
  }
}
