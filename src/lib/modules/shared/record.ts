/**
 * The record's shape: everything the app keeps, as it is written to record.json and to a handover file
 * ("The record is one JSON file"). Times of day are timestamps with their offset; amounts of time are whole minutes.
 */

import { FIRST_HUE, baseColour } from '$lib/modules/shared/colours'

// ======================================
//                 API
// ======================================

/** Marks a file as a TimeFold record, so a wrong file is named as such */
export const RECORD_FORMAT = 'timefold-record'

/** The shape's version; it goes up whenever the shape changes */
export const RECORD_VERSION = 5

/** The janitor's expected minutes a working day, as a fresh record starts them ("Expected hours: 6 a day, Monday to Friday") */
const EXPECTED_MINUTES = 6 * 60

/**
 * Full time in minutes a working day, as a fresh or upgraded record starts it: a 38 h 15 min week over five days, 7 h 39
 * min ("The other profiles share a ceiling")
 */
const FULL_TIME_MINUTES = 7 * 60 + 39

/** The reasons an edit can be given as a record starts them, before "Annan orsak" ("Every edit carries a reason") */
export const FIRST_REASONS = [
  'Glömde stämpla in',
  'Glömde stämpla ut',
  'Fel profil',
  'Ärende',
  'Glömd paus',
  'Glömd post',
]

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
  /** The profile's OKLCH hue, 0–359; its neon follows from it ("Each profile carries its colours") */
  hue: number
  /** The base colour, a nuance of the hue, as #rrggbb */
  base: string
  /**
   * Where the colour picker's strip sits, 0–359, remembered so the picker opens where it was left; the strip and the
   * hue are not each other's exact inverse
   */
  strip?: number
  /** Only the profile with a balance has expected minutes per working day */
  expectedMinutes?: FromDay<{ minutes: number }>[]
  /** A monthly salary or a rate per hour, for the pay estimate ("A pay estimate per profile"); none leaves it out */
  pay?: FromDay<Pay>[]
  /**
   * Only the profile with a balance has flex days: weekdays off, each taking that day's expected hours off the balance
   * ("A flex day can be marked ahead, and the screen counts it at once"), in order
   */
  flexDays?: Day[]
  /** Taken out of use but kept with its hours ("A profile with hours is archived, one without is deleted"); absent while active */
  archived?: true
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
  /** Seconds over the whole minutes, 0–59, when a prune froze the balance to the second; absent when typed */
  seconds?: number
  /** The ceiling's trend up to this day in seconds, when a prune cut into it ("Old history is pruned on request") */
  trendSeconds?: number
}

/** The edit's reasons ("Every edit carries a reason"): the list, what it has forgotten, and the typed texts it counts */
export interface Reasons {
  /** The list, in the order kept; shown in Swedish alphabetical order */
  list: string[]
  /** Reasons removed from the list, in their matched form, never learned again */
  forgotten: string[]
  /** "Annan orsak" texts written, in their matched form, with how many times; one at three joins the list */
  written: { text: string; times: number }[]
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
  /** Time away taken off it, its length alone, 0 with none ("Time away is a gap or an added break") */
  breakMinutes: number
  /** Why it was last edited or written by hand, or why it ran as it did; none until one is given ("Every edit carries a reason") */
  reason?: string
}

/**
 * How the pay estimate is shown ("A pay estimate per profile"): after tax or not, and "Skatt och avgifter", everything a
 * payslip takes off, as a percentage from 0 to under 100
 */
export interface Tax {
  after: boolean
  percent: number
}

/** "Skatt och avgifter" as a record starts it, and the estimate shown before tax */
export const FIRST_TAX: Tax = { after: false, percent: 25 }

/** The whole record */
export interface TimeRecord {
  format: typeof RECORD_FORMAT
  version: number
  profiles: Profile[]
  openings: Opening[]
  /** Full time a working day, whose rest after the janitor's expected hours is the other profiles' ceiling */
  fullTime: FromDay<{ minutes: number }>[]
  entries: Entry[]
  reasons: Reasons
  tax: Tax
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
    if (data.version === 2) upgradeFromTwo(data)
    if (data.version === 3) upgradeFromThree(data)
    if (data.version === 4) upgradeFromFour(data)
    checkRecord(data)
  } catch (error) {
    if (error instanceof ShapeError) return { ok: false, problem: { kind: 'wrong-shape', where: error.where } }
    throw error
  }

  return { ok: true, record: data as unknown as TimeRecord }
}

/**
 * A new record for "Starta nytt": one profile, the one with the balance, expected to work 6 h a day of a full time of 7
 * h 39 min from the first day, and the balance brought over from before, dated that day ("A first install starts fresh or
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
        base: baseColour(FIRST_HUE),
        expectedMinutes: [{ from: firstDay, minutes: EXPECTED_MINUTES }],
        flexDays: [],
      },
    ],
    openings: [{ profile: 'p1', day: firstDay, balanceMinutes: openingMinutes }],
    fullTime: [{ from: firstDay, minutes: FULL_TIME_MINUTES }],
    entries: [],
    reasons: { list: [...FIRST_REASONS], forgotten: [], written: [] },
    tax: { ...FIRST_TAX },
  }
}

/**
 * A moment written as the record keeps it: to the second, with this machine's offset. Used for every start and stop,
 * clicked or edited, and for the moment of every click: 2026-11-16T08:02:15+02:00
 */
export function toTimestamp(now: Date): Timestamp {
  const two = (n: number): string => String(Math.floor(Math.abs(n))).padStart(2, '0')
  const offset = -now.getTimezoneOffset()
  const day = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`
  const time = `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`
  return `${day}T${time}${offset >= 0 ? '+' : '-'}${two(offset / 60)}:${two(offset % 60)}`
}

/**
 * The next free entry id after the highest `eN` among the entries. Used for every new entry, clicked or written by
 * hand: e1 and e2 give e3
 */
export function nextId(entries: Entry[]): string {
  const highest = Math.max(0, ...entries.map((e) => Number(/^e(\d+)$/.exec(e.id)?.[1] ?? 0)))
  return `e${highest + 1}`
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
 * Brings a version 1 record to version 2: full time, which it did not have, starts at 7 h 39 min from its first opening.
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
  data.version = 2
}

/**
 * Brings a version 2 record to version 3: every entry gains its added breaks and the profile with a balance its flex
 * days, none of either. Used by `readRecord` before the check; parts of the wrong shape are left for it to name
 */
function upgradeFromTwo(data: Fields): void {
  for (const entry of Array.isArray(data.entries) ? data.entries : []) {
    if (isObject(entry)) entry.breaks = []
  }
  for (const profile of Array.isArray(data.profiles) ? data.profiles : []) {
    if (isObject(profile) && profile.expectedMinutes !== undefined) profile.flexDays = []
  }
  data.version = 3
}

/**
 * Brings a version 3 record to version 4: each entry's added breaks, a list of lengths by day, become its one break,
 * their sum; no entry has a reason yet. Used by `readRecord` before the check; breaks of the wrong shape are named
 * here, since the list is gone once summed
 */
function upgradeFromThree(data: Fields): void {
  const entries = Array.isArray(data.entries) ? data.entries : []
  entries.forEach((entry, i) => {
    if (!isObject(entry)) return
    let sum = 0
    list(entry.breaks, `entries[${i}].breaks`, (item, where) => {
      day(item.day, `${where}.day`)
      whole(item.minutes, `${where}.minutes`, 1)
      sum += item.minutes as number
    })
    delete entry.breaks
    entry.breakMinutes = sum
  })
  data.version = 4
}

/**
 * Brings a version 4 record to version 5: the reasons, until now fixed, become the record's own list, with nothing
 * learned or forgotten yet; every profile stays active, and the estimate is shown before tax with 25%. Used by `readRecord` before the check
 */
function upgradeFromFour(data: Fields): void {
  data.reasons = { list: [...FIRST_REASONS], forgotten: [], written: [] }
  data.tax = { ...FIRST_TAX }
  data.version = 5
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
    if (profile.strip !== undefined) whole(profile.strip, `${at}.strip`, 0, 359)
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
    if (profile.flexDays !== undefined) {
      if (!Array.isArray(profile.flexDays)) throw new ShapeError(`${at}.flexDays`)
      profile.flexDays.forEach((flex, i) => day(flex, `${at}.flexDays[${i}]`))
    }
    if (profile.archived !== undefined && profile.archived !== true) throw new ShapeError(`${at}.archived`)
  })
  list(data.openings, 'openings', (opening, at) => {
    text(opening.profile, `${at}.profile`)
    day(opening.day, `${at}.day`)
    whole(opening.balanceMinutes, `${at}.balanceMinutes`)
    if (opening.seconds !== undefined) whole(opening.seconds, `${at}.seconds`, 0, 59)
    if (opening.trendSeconds !== undefined) whole(opening.trendSeconds, `${at}.trendSeconds`)
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
    whole(entry.breakMinutes, `${at}.breakMinutes`, 0)
    if (entry.reason !== undefined) text(entry.reason, `${at}.reason`)
  })
  const reasons = fields(data.reasons, 'reasons')
  texts(reasons.list, 'reasons.list')
  texts(reasons.forgotten, 'reasons.forgotten')
  list(reasons.written, 'reasons.written', (item, at) => {
    text(item.text, `${at}.text`)
    whole(item.times, `${at}.times`, 1)
  })
  const tax = fields(data.tax, 'tax')
  if (typeof tax.after !== 'boolean') throw new ShapeError('tax.after')
  if (typeof tax.percent !== 'number' || !(tax.percent >= 0 && tax.percent < 100)) throw new ShapeError('tax.percent')
}

/** A list of strings with something in each, or a ShapeError at `where`. Used for the reasons and those forgotten */
function texts(value: unknown, where: string): void {
  if (!Array.isArray(value)) throw new ShapeError(where)
  value.forEach((item, i) => text(item, `${where}[${i}]`))
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
 * openings, entries, expected minutes, pay, full time and a version 3 record's added breaks
 */
function list(value: unknown, where: string, check: (item: Fields, at: string) => void): void {
  if (!Array.isArray(value)) throw new ShapeError(where)
  value.forEach((item, i) => check(fields(item, `${where}[${i}]`), `${where}[${i}]`))
}

/** A string with something in it, or a ShapeError at `where`. Used for ids, names and colours */
function text(value: unknown, where: string): void {
  if (typeof value !== 'string' || value === '') throw new ShapeError(where)
}

/** A real day written YYYY-MM-DD, or a ShapeError at `where`. Used for openings, from-dates, a version 3 record's breaks and flex days: 16.11.2026 fails */
function day(value: unknown, where: string): void {
  if (typeof value !== 'string' || !DAY.test(value) || Number.isNaN(Date.parse(value))) throw new ShapeError(where)
}

/** A value as an object, or a ShapeError at `where`. Used for each profile, opening and entry, the reasons and the tax */
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
