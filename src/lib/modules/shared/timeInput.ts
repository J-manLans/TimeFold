/**
 * Typed time: checking each keystroke of a duration, reading what was typed, and writing a duration back in words
 * ("Entering a length of time"). A plain number is minutes ("45"); hours and minutes are written "1:20", the minutes
 * at most 59. In words the unit sits against its number: "5min", "1h 20min".
 */

// ======================================
//                 API
// ======================================

/** What a duration field takes: whether a sign may lead, and how many digits of hours and of minutes alone */
export interface DurationField {
  sign: boolean
  hourDigits: number
  minuteDigits: number
}

/** The onboarding's balance: a sign, up to three digits of hours, and minutes alone up to three digits */
export const BALANCE: DurationField = { sign: true, hourDigits: 3, minuteDigits: 3 }

/** A break's length: no sign, up to two digits of hours, and minutes alone up to three digits */
export const BREAK: DurationField = { sign: false, hourDigits: 2, minuteDigits: 3 }

/**
 * Whether a field's text, as it is being typed, still has a duration's shape: a keystroke that breaks it is refused.
 * Used on every keystroke and paste: "12:7" is refused, since the minutes would pass 59, and "-12:" is let through.
 */
export function fitsShape(text: string, field: DurationField): boolean {
  return shapeWhileTyping(field).test(text)
}

/**
 * A field's text read as a whole duration, in minutes, or null while it is not one yet. Used to show the reading and
 * on Enter: "12:30" is 750, "-3:00" is −180, "45" is 45, and "12:" is null.
 */
export function readDuration(text: string, field: DurationField): number | null {
  const match = wholeShape(field).exec(text.trim())
  if (match === null) return null
  const [, sign, hours, minutes, alone] = match
  const total = alone !== undefined ? Number(alone) : Number(hours) * 60 + Number(minutes)
  return sign === '-' ? -total : total
}

/**
 * Minutes as a duration in words, the unit against its number, with a sign in front when `signed`. Used for the
 * reading under a duration field and for a break's tag: 80 is "1h 20min", 6300 is "105h", and −750 signed is
 * "−12h 30min".
 */
export function durationText(minutes: number, signed = false): string {
  const size = Math.abs(Math.round(minutes))
  const hours = Math.floor(size / 60)
  const rest = size % 60
  const words = [hours > 0 ? `${hours}h` : '', rest > 0 || hours === 0 ? `${rest}min` : ''].filter(Boolean).join(' ')
  const sign = !signed || minutes === 0 ? '' : minutes < 0 ? '−' : '+'
  return sign + words
}

/**
 * Minutes written back into a duration field as they would be typed: minutes alone under an hour, else hours and two
 * digits of minutes, and nothing for 0. Used by "Lägg till paus", whose field opens on the break so far: 20 is "20",
 * 80 is "1:20", 125 is "2:05".
 */
export function durationInField(minutes: number): string {
  if (minutes <= 0) return ''
  if (minutes < 60) return String(minutes)
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`
}

// ======================================
//               Helpers
// ======================================

/** The shape of a field's text while it is typed: every part may still be missing. Used by `fitsShape` */
function shapeWhileTyping(field: DurationField): RegExp {
  const sign = field.sign ? '[+-]?' : ''
  return new RegExp(`^${sign}(\\d{0,${field.minuteDigits}}|\\d{0,${field.hourDigits}}:([0-5]\\d?)?)$`)
}

/**
 * The shape of a whole duration: a sign where allowed, then hours and one or two digits of minutes, or minutes alone.
 * Used by `readDuration`
 */
function wholeShape(field: DurationField): RegExp {
  const sign = field.sign ? '([+-]?)' : '()'
  return new RegExp(`^${sign}(?:(\\d{1,${field.hourDigits}}):([0-5]\\d?)|(\\d{1,${field.minuteDigits}}))$`)
}
