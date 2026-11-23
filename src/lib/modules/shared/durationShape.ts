/**
 * A length field that keeps its shape ("Entering a length of time"): a keystroke or paste that would break it is
 * undone, the caret kept where it was, so only a duration's shape can be typed. A Svelte attachment, used by every
 * length field: "Lägg till paus", the onboarding's balance and the break's tag in an edit.
 */

import { type Attachment } from 'svelte/attachments'
import { fitsShape, type DurationField } from '$lib/modules/shared/timeInput'

/**
 * Keeps an input to a duration's shape, telling `onText` each text it accepts. Used as
 * `<input {@attach durationShape(BREAK, (text) => (typed = text))} />`: "12:7" typed into a break's field leaves "12:".
 * @param field - the shape: whether a sign may lead, and how many digits of hours and of minutes
 * @param onText - given the field's text after every keystroke it lets through
 */
export function durationShape(field: DurationField, onText: (text: string) => void): Attachment<HTMLInputElement> {
  return (input) => {
    let kept = input.value
    const remember = (): void => {
      kept = input.value
    }
    const check = (): void => {
      if (fitsShape(input.value, field)) {
        kept = input.value
        onText(kept)
        return
      }
      const caret = Math.max(0, (input.selectionStart ?? 0) - (input.value.length - kept.length))
      input.value = kept
      input.setSelectionRange(caret, caret)
    }
    input.addEventListener('focus', remember)
    input.addEventListener('input', check)
    return () => {
      input.removeEventListener('focus', remember)
      input.removeEventListener('input', check)
    }
  }
}
