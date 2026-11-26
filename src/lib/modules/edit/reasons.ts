/**
 * The reasons an edit can be given, as the record keeps them ("Every edit carries a reason"): the list in its order, an
 * "Annan orsak" text learned on its third writing, and a reason renamed or removed under its pen. Pure: each change
 * returns a new record.
 */

import type { TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** How many times an "Annan orsak" text is written before it joins the list */
export const LEARNED_AT = 3

/**
 * The reasons in Swedish alphabetical order, Å, Ä and Ö after Z, so one learned or renamed is where it can be
 * guessed. Used by the reason's list, which ends with "Annan orsak".
 */
export function reasonList(record: TimeRecord): string[] {
  return [...record.reasons.list].sort((a, b) => a.localeCompare(b, 'sv'))
}

/**
 * A text as texts are matched: lowercased, without punctuation, its spaces single and none around it. Used to count
 * the writings of one text and to find a reason taken: "Möte, med rektor!" reads "möte med rektor".
 */
export function matchForm(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * One more writing of an "Annan orsak" text counted; on its third, the text joins the list as written that time, its
 * spaces single and its first letter a capital. A text that is already a reason, or one forgotten, is not counted. Used when an edit is saved
 * with a typed reason, never with the automatic "Delad av" ones.
 */
export function learnReason(record: TimeRecord, text: string): TimeRecord {
  const form = matchForm(text)
  const { list, forgotten, written } = record.reasons
  if (form === '' || forgotten.includes(form) || list.some((r) => matchForm(r) === form)) return record
  const times = (written.find((w) => w.text === form)?.times ?? 0) + 1
  const others = written.filter((w) => w.text !== form)
  if (times < LEARNED_AT) {
    return { ...record, reasons: { ...record.reasons, written: [...others, { text: form, times }] } }
  }
  const tidy = text.trim().replace(/\s+/g, ' ')
  const reason = tidy.charAt(0).toUpperCase() + tidy.slice(1)
  return { ...record, reasons: { list: [...list, reason], forgotten, written: others } }
}

/**
 * A reason under a new name, trimmed, unless another reason has its form. A forgotten text named again is a reason
 * again. Used by Enter in a reason's field under its pen; no entry changes.
 */
export function renameReason(
  record: TimeRecord,
  old: string,
  text: string,
): TimeRecord | { refusal: 'empty' | 'taken' } {
  const form = matchForm(text)
  if (form === '') return { refusal: 'empty' }
  const { list, forgotten, written } = record.reasons
  if (list.some((r) => r !== old && matchForm(r) === form)) return { refusal: 'taken' }
  return {
    ...record,
    reasons: {
      list: list.map((r) => (r === old ? text.trim() : r)),
      forgotten: forgotten.filter((f) => f !== form),
      written: written.filter((w) => w.text !== form),
    },
  }
}

/**
 * The reason taken off the list and remembered, so it is never learned again; it can still be written after "Annan
 * orsak". Used by the second Enter in an emptied reason's field; no entry changes.
 */
export function removeReason(record: TimeRecord, reason: string): TimeRecord {
  const form = matchForm(reason)
  const { list, forgotten, written } = record.reasons
  return {
    ...record,
    reasons: {
      list: list.filter((r) => r !== reason),
      forgotten: forgotten.includes(form) ? forgotten : [...forgotten, form],
      written,
    },
  }
}
