import { describe, expect, it } from 'vitest'
import { colourRoles, dimmed, faded, FIRST_HUE, hueOfStrip, neonBase, overColour } from '$lib/modules/colours'

// === Constants ===

// The dashboard's panel in each theme (design-tokens.css, --dashboard-background)
const DARK_PANEL = '#0d1014'
const LIGHT_PANEL = '#2c3e5c'

// === Tests ===

describe('the balance profile starts on a cyan that nobody picked', () => {
  it('has hue 195°, base #7ed6d5 and over #fc0055', () => {
    expect(FIRST_HUE).toBe(195)
    expect(neonBase(FIRST_HUE)).toBe('#7ed6d5')
    expect(overColour(FIRST_HUE)).toBe('#fc0055')
  })

  it('gives a new profile at 105° or 285° its muted base and opposite over colour', () => {
    expect([neonBase(105), overColour(105)]).toEqual(['#d4ce78', '#6400fd'])
    expect([neonBase(285), overColour(285)]).toEqual(['#7368d4', '#fdee00'])
  })
})

describe('the over colour is the hue opposite the strip’s colour, at its most vivid', () => {
  it('gives the decision’s colours for the strip at red, yellow, green, cyan, blue and magenta', () => {
    const overs = [0, 60, 120, 180, 240, 300].map((strip) => overColour(hueOfStrip(strip)))

    expect(overs).toEqual(['#00e4fd', '#740aff', '#e400fe', '#fc0056', '#ffbf00', '#00fe6c'])
  })
})

describe('the dimmed colour is the base mixed 70% toward the panel', () => {
  it('dims the cyan base on the dark and on the light panel, as the prototype does', () => {
    expect(dimmed('#7ed6d5', DARK_PANEL)).toBe('#2c4346')
    expect(dimmed('#7ed6d5', LIGHT_PANEL)).toBe('#43697f')
  })

  it('sits 0.15 past the panel instead when mixing would leave it too close to the base', () => {
    expect(dimmed('#1e2630', DARK_PANEL)).toBe('#12161c')
  })
})

describe('a faded colour keeps its hue, with 45% of its chroma gone and its lightness a fifth toward the panel', () => {
  it('fades the violet base on the dark and on the light panel, as the prototype does', () => {
    expect(faded('#7368d4', DARK_PANEL)).toBe('#5e5b93')
    expect(faded('#7368d4', LIGHT_PANEL)).toBe('#68669f')
  })
})

describe('a profile’s colours by role', () => {
  it('gives the base, the dimmed and the over colour from the profile and the panel', () => {
    const profile = { id: 'p1', name: 'Vaktmästare', hue: 195, base: '#7ed6d5' }

    expect(colourRoles(profile, DARK_PANEL)).toEqual({ base: '#7ed6d5', dimmed: '#2c4346', over: '#fc0055' })
  })
})
