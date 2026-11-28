/**
 * Where a popup that belongs to one side sits ("Shared looks are written once"): centred in the part of that side in
 * the window, so a stacked, scrolled page still shows it where its side is. The part is given as insets on whole
 * pixels, and the popup centres itself inside them by layout, so it is never drawn between two pixels.
 */

// ======================================
//                 API
// ======================================

/** A box on screen, as `getBoundingClientRect` gives it */
export interface Box {
  left: number
  top: number
  width: number
  height: number
}

/** How far in from each edge of the window a box lies, in whole pixels */
export interface Insets {
  top: number
  left: number
  right: number
  bottom: number
}

/**
 * The part of a box inside the window, as insets from the window's edges on whole pixels, or the whole window when
 * none of it is in view. Used by the popups' frame for a popup over a side: visiblePart(controls side, window) is the
 * box the popup centres in
 */
export function visiblePart(box: Box, view: { width: number; height: number }): Insets {
  const left = Math.round(Math.max(box.left, 0))
  const right = Math.round(Math.min(box.left + box.width, view.width))
  const top = Math.round(Math.max(box.top, 0))
  const bottom = Math.round(Math.min(box.top + box.height, view.height))
  if (right <= left || bottom <= top) return { top: 0, left: 0, right: 0, bottom: 0 }
  return { top, left, right: view.width - right, bottom: view.height - bottom }
}
