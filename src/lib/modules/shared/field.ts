/**
 * The fields' one behaviour ("Shared looks are written once"): a field opens with the focus in and its text selected,
 * Enter keeps it, Esc drops it, and leaving it, a press elsewhere or the focus moving on inside the app, keeps or drops
 * it as the field says. Switching to another window leaves it as it is. A Svelte attachment on the plain input; what
 * surrounds each field, a reading, a note or a refusal, stays in its component.
 */

import { type Attachment } from 'svelte/attachments'

/** What a field does on its keys and when it is left */
export interface FieldMoves {
  /** Enter, and leaving when `away` is 'keep': the text kept, or refused with the field left open */
  keep: () => void
  /**
   * Esc, and leaving when `away` is 'drop': the field closed as it was. `byEsc` says the focus should go back to what
   * the field replaced; left, the focus stays where it went
   */
  drop: (byEsc: boolean) => void
  /** What leaving the field does; 'drop' unless the field says otherwise */
  away?: 'keep' | 'drop'
}

/**
 * The width of what a field replaces, which the field opens at and keeps while it is typed in. Used as a button or tag
 * is clicked, before it turns into its field: `width = widthOf(event.currentTarget)`.
 */
export function widthOf(element: EventTarget | null): string {
  return element instanceof HTMLElement ? `${element.getBoundingClientRect().width}px` : ''
}

/**
 * Gives a plain input the fields' behaviour. Used as `<input {@attach field({ keep, drop })} />`: opened on "25",
 * typing "30" and Enter keeps 30; Esc puts the tag back on 25.
 */
export function field({ keep, drop, away = 'drop' }: FieldMoves): Attachment<HTMLInputElement> {
  return (input) => {
    /** Enter or Esc has just answered, so the focus leaving with the field asks nothing more */
    let answered = false

    queueMicrotask(() => {
      input.focus()
      input.select()
    })

    const keys = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        event.preventDefault()
        answered = true
        keep()
        // A refused text leaves the field open, and leaving it later answers again
        queueMicrotask(() => (answered = false))
      } else if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        answered = true
        drop(true)
      }
    }

    const leave = (): void => {
      if (answered || !input.isConnected || !document.hasFocus()) return
      if (away === 'keep') keep()
      else drop(false)
    }

    input.addEventListener('keydown', keys)
    input.addEventListener('focusout', leave)
    return () => {
      input.removeEventListener('keydown', keys)
      input.removeEventListener('focusout', leave)
    }
  }
}
