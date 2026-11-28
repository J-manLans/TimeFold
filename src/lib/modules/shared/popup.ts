/**
 * Where a popup that belongs to one side sits ("Shared looks are written once"): centred on the part of that side in
 * the window, so a stacked, scrolled page still shows it where its side is.
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

/**
 * The centre of the part of a box inside the window, or the window's own centre when none of it is in view. Used by
 * the popups' frame for a popup over a side: centreOn(controls side, window) is the point the popup centres on
 */
export function centreOn(box: Box, view: { width: number; height: number }): { x: number; y: number } {
  const left = Math.max(box.left, 0)
  const right = Math.min(box.left + box.width, view.width)
  const top = Math.max(box.top, 0)
  const bottom = Math.min(box.top + box.height, view.height)
  if (right <= left || bottom <= top) return { x: view.width / 2, y: view.height / 2 }
  return { x: (left + right) / 2, y: (top + bottom) / 2 }
}
