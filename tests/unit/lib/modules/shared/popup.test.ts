import { describe, expect, it } from 'vitest'
import { visiblePart } from '$lib/modules/shared/popup'

// === Tests ===

const window = { width: 1100, height: 660 }

describe('a popup over a side is centred in the part of that side in view, on whole pixels', () => {
  it('takes the whole controls side beside the dashboard', () => {
    expect(visiblePart({ left: 0, top: 0, width: 660, height: 660 }, window)).toEqual({
      top: 0,
      left: 0,
      right: 440,
      bottom: 0,
    })
  })

  it('takes the part in view when the stacked page is scrolled and the side runs past the window', () => {
    expect(visiblePart({ left: 0, top: 400, width: 440, height: 600 }, { width: 440, height: 660 })).toEqual({
      top: 400,
      left: 0,
      right: 0,
      bottom: 0,
    })
  })

  it('rounds a side at a fraction of a pixel to whole pixels, so nothing is drawn between them', () => {
    expect(visiblePart({ left: 0.5, top: 10.4, width: 659.3, height: 600.2 }, window)).toEqual({
      top: 10,
      left: 1,
      right: 440,
      bottom: 49,
    })
  })

  it('takes the whole window when the side is out of view', () => {
    expect(visiblePart({ left: 0, top: 900, width: 440, height: 300 }, { width: 440, height: 660 })).toEqual({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    })
  })
})
