import { describe, expect, it } from 'vitest'
import { nextTheme, readSettings, themeName } from '$lib/modules/settings'

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

describe('the theme button moves System → Ljust → Mörkt → System', () => {
  it('moves to the next theme on each click, and names each one', () => {
    expect([nextTheme('system'), nextTheme('light'), nextTheme('dark')]).toEqual(['light', 'dark', 'system'])
    expect([themeName('system'), themeName('light'), themeName('dark')]).toEqual(['System', 'Ljust', 'Mörkt'])
  })
})
