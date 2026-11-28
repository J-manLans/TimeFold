import { describe, expect, it } from 'vitest'
import { centreOn } from '$lib/modules/shared/popup'

// === Tests ===

const window = { width: 1100, height: 660 }

describe('a popup over a side sits centred on the part of that side in view', () => {
  it('centres on the controls side beside the dashboard', () => {
    expect(centreOn({ left: 0, top: 0, width: 660, height: 660 }, window)).toEqual({ x: 330, y: 330 })
  })

  it('centres on the part in view when the stacked page is scrolled and the side runs past the window', () => {
    expect(centreOn({ left: 0, top: 400, width: 440, height: 600 }, { width: 440, height: 660 })).toEqual({
      x: 220,
      y: 530,
    })
  })

  it('centres on the window when the side is out of view', () => {
    expect(centreOn({ left: 0, top: 900, width: 440, height: 300 }, { width: 440, height: 660 })).toEqual({
      x: 220,
      y: 330,
    })
  })
})
