import { describe, expect, it } from 'vitest'
import { nextTheme, readSettings, shownTheme, themeName } from '$lib/modules/menu/settings'

// === Tests ===

describe('the settings file gives the theme it holds', () => {
  it('gives a dark theme from a file that says dark', () => {
    expect(readSettings('{"theme":"dark"}')).toEqual({ theme: 'dark' })
  })
})

describe('no settings file, or one that cannot be read, means System', () => {
  it('gives System when there is no file yet', () => {
    expect(readSettings(null)).toEqual({ theme: 'system' })
  })

  it('gives System for a file that is not JSON, or holds no theme it knows', () => {
    expect(readSettings('{"theme":')).toEqual({ theme: 'system' })
    expect(readSettings('{"theme":"purple"}')).toEqual({ theme: 'system' })
    expect(readSettings('[1, 2, 3]')).toEqual({ theme: 'system' })
  })
})

describe('a fresh install follows the system; the theme button switches between Ljust and Mörkt', () => {
  it('shows the system theme until the button is clicked, and the chosen one after', () => {
    expect([shownTheme('system', true), shownTheme('system', false)]).toEqual(['dark', 'light'])
    expect([shownTheme('light', true), shownTheme('dark', false)]).toEqual(['light', 'dark'])
  })

  it('switches to the other of the theme shown, and names each one', () => {
    expect([nextTheme('system', true), nextTheme('system', false)]).toEqual(['light', 'dark'])
    expect([nextTheme('light', true), nextTheme('dark', true)]).toEqual(['dark', 'light'])
    expect([themeName('light'), themeName('dark')]).toEqual(['Ljust', 'Mörkt'])
  })
})
