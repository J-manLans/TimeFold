/**
 * The focus ring as a popup opens and closes ("The main screen has a controls side and a dashboard"): the focus moves
 * into it and back as always, but its ring shows on opening only after a keyboard open, and on closing only after a
 * keyboard open and close; otherwise the focused element is quiet until it loses the focus or a key is pressed. Keeps the
 * last input, a key or a pointer, for every popup: "Visa alla", the edit, the menu and the late-stop question.
 */

// ======================================
//                 API
// ======================================

/** How the last input came: a key, a pointer, or none yet, as when the app opens a popup by itself */
export type Input = 'key' | 'pointer' | null

/**
 * Whether the element the focus lands on after a popup closes shows its ring: only after a keyboard open and a keyboard
 * close, so a click, or Esc after a click, leaves none. Used by `popupClosed`: opened with Enter and closed with Esc
 * keeps it; clicked open and closed with Esc does not.
 */
export function ringAfterClose(openedBy: Input, closedBy: Input): boolean {
  return openedBy === 'key' && closedBy === 'key'
}

/**
 * Whether the first focus inside a popup shows its ring: only when it was opened with the keyboard, so a click, or the
 * app opening it by itself, leaves none. Used by `popupOpened`: "Visa alla" opened with Enter rings its first row; clicked,
 * it does not.
 */
export function ringOnOpen(openedBy: Input): boolean {
  return openedBy === 'key'
}

/**
 * A popup opening: how, to keep until it closes; and unless with the keyboard, the element the focus moves to inside
 * it (or the popup itself) shows no ring until it loses the focus or a key is pressed. Used by each popup as it opens.
 */
export function popupOpened(): Input {
  const openedBy = last
  // The popup moves the focus in as it opens; the next frame finds it wherever it landed
  if (!ringOnOpen(openedBy)) requestAnimationFrame(() => quiet(document.activeElement))
  return openedBy
}

/**
 * A popup closed: unless it was opened and closed with the keyboard, the element the focus lands on (handed back by a
 * dialog, or kept, as the menu's button) shows no ring until it loses the focus or a key is pressed. Used by each
 * popup as it closes.
 * @param openedBy - what `popupOpened` gave when it opened
 */
export function popupClosed(openedBy: Input): void {
  if (ringAfterClose(openedBy, last)) return
  // A dialog hands the focus back as it closes; the next frame finds it wherever it landed
  requestAnimationFrame(() => quiet(document.activeElement))
}

// ======================================
//               Helpers
// ======================================

/** The last input, a key or a pointer, caught before anything else hears it */
let last: Input = null

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', () => (last = 'key'), true)
  window.addEventListener('pointerdown', () => (last = 'pointer'), true)
}

/** An element's ring hidden (`data-quiet-focus`, in base.css) until it loses the focus or a key is pressed */
function quiet(element: Element | null): void {
  if (!(element instanceof HTMLElement) || element === document.body) return
  element.dataset.quietFocus = ''
  const wake = (): void => {
    delete element.dataset.quietFocus
    element.removeEventListener('blur', wake)
    window.removeEventListener('keydown', wake, true)
  }
  element.addEventListener('blur', wake)
  window.addEventListener('keydown', wake, true)
}
