/**
 * The record's shape: everything the app keeps, as it is written to record.json and to a handover file
 * ("The record is one JSON file"). Times of day are timestamps with their offset; amounts of time are whole minutes.
 */

// ======================================
//                 API
// ======================================

/** Marks a file as a TimeFold record, so a wrong file is named as such */
export const RECORD_FORMAT = 'timefold-record'

/** The shape's version; it goes up whenever the shape changes */
export const RECORD_VERSION = 1

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
  /** Where the hue strip sits, 0–359; the over colour follows from it ("Each profile carries its colours") */
  hue: number
  /** The base colour, a nuance of the hue, as #rrggbb */
  base: string
  /** Only the profile with a balance has expected minutes per working day */
  expectedMinutes?: FromDay<{ minutes: number }>[]
}

/** The settings that count everywhere, not per profile */
export interface Settings {
  /** The day of the month the app's month starts on, 1–28 ("A month starts on a set day") */
  monthStart: FromDay<{ day: number }>[]
}

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
  settings: Settings
  openings: Opening[]
  entries: Entry[]
}

/** Why a file could not be read as a record */
export type Problem =
  | { kind: 'not-json'; detail: string }
  | { kind: 'not-a-record' }
  | { kind: 'newer-version'; version: number }
  | { kind: 'wrong-shape'; where: string }

/** What reading a file gives: the record, or the problem with it */
export type ReadResult = { ok: true; record: TimeRecord } | { ok: false; problem: Problem }

/**
 * Reads a file's text as a record, checking it on the way ("The record is one JSON file"). Names what is wrong
 * rather than guessing; a record from a newer version of the app is refused, so it is never saved back without what
 * this version does not know.
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
    checkRecord(data)
  } catch (error) {
    if (error instanceof ShapeError) return { ok: false, problem: { kind: 'wrong-shape', where: error.where } }
    throw error
  }

  return { ok: true, record: data as unknown as TimeRecord }
}

// ======================================
//               Helpers
// ======================================

/** Thrown inside the check; carries where the shape went wrong, such as entries[1].start */
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

function isObject(value: unknown): value is Fields {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Checks every part of the record, throwing a ShapeError at the first that is wrong */
function checkRecord(data: Fields): void {
  whole(data.version, 'version', 1)
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
  })
  const settings = fields(data.settings, 'settings')
  list(settings.monthStart, 'settings.monthStart', (item, at) => {
    day(item.from, `${at}.from`)
    whole(item.day, `${at}.day`, 1, 28)
  })
  list(data.openings, 'openings', (opening, at) => {
    text(opening.profile, `${at}.profile`)
    day(opening.day, `${at}.day`)
    whole(opening.balanceMinutes, `${at}.balanceMinutes`)
  })
  list(data.entries, 'entries', (entry, at) => {
    text(entry.id, `${at}.id`)
    text(entry.profile, `${at}.profile`)
    timestamp(entry.start, `${at}.start`)
    if (entry.stop !== null) timestamp(entry.stop, `${at}.stop`)
    if (!MADE.includes(entry.made as Made)) throw new ShapeError(`${at}.made`)
  })
}

function whole(value: unknown, where: string, min = -Infinity, max = Infinity): void {
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) throw new ShapeError(where)
}

function list(value: unknown, where: string, check: (item: Fields, at: string) => void): void {
  if (!Array.isArray(value)) throw new ShapeError(where)
  value.forEach((item, i) => check(fields(item, `${where}[${i}]`), `${where}[${i}]`))
}

function text(value: unknown, where: string): void {
  if (typeof value !== 'string' || value === '') throw new ShapeError(where)
}

function day(value: unknown, where: string): void {
  if (typeof value !== 'string' || !DAY.test(value) || Number.isNaN(Date.parse(value))) throw new ShapeError(where)
}

function fields(value: unknown, where: string): Fields {
  if (!isObject(value)) throw new ShapeError(where)
  return value
}

function timestamp(value: unknown, where: string): void {
  if (typeof value !== 'string' || !TIMESTAMP.test(value) || Number.isNaN(Date.parse(value))) {
    throw new ShapeError(where)
  }
}
