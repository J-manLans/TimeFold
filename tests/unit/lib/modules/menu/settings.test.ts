import { describe, expect, it } from 'vitest'
import {
  motionName,
  nextMotion,
  nextTheme,
  readSettings,
  shownMotion,
  shownTheme,
  themeName,
} from '$lib/modules/menu/settings'

// === Tests ===

describe('the settings file gives the theme and the motion it holds', () => {
  it('gives a dark theme and Stilla from a file that says so', () => {
    expect(readSettings('{"theme":"dark","motion":"off"}')).toEqual({ theme: 'dark', motion: 'off' })
  })

  it('reads each setting apart, so a file from before the motion switch keeps its theme', () => {
    expect(readSettings('{"theme":"dark"}')).toEqual({ theme: 'dark', motion: 'system' })
    expect(readSettings('{"theme":"purple","motion":"on"}')).toEqual({ theme: 'system', motion: 'on' })
  })
})

describe('"Inte nu" on the prune line is kept with the machine, as the day the line comes back', () => {
  it('reads the day, and leaves out one not written YYYY-MM-DD', () => {
    expect(readSettings('{"theme":"dark","motion":"off","pruneLater":"2030-03-01"}')).toEqual({
      theme: 'dark',
      motion: 'off',
      pruneLater: '2030-03-01',
    })
    expect(readSettings('{"pruneLater":"1.3.2030"}')).toEqual({ theme: 'system', motion: 'system' })
  })
})

describe('the profile on screen at close is kept with the machine', () => {
  it('reads it, and leaves out one that is not text', () => {
    expect(readSettings('{"onScreen":"p2"}')).toEqual({ theme: 'system', motion: 'system', onScreen: 'p2' })
    expect(readSettings('{"onScreen":2}')).toEqual({ theme: 'system', motion: 'system' })
  })
})

describe('"Fortfarande igång" is kept with the machine, as the entry and the day it was answered', () => {
  it('reads it, and leaves out one of the wrong shape', () => {
    expect(readSettings('{"lateKept":{"entry":"e1","day":"2026-11-17"}}')).toEqual({
      theme: 'system',
      motion: 'system',
      lateKept: { entry: 'e1', day: '2026-11-17' },
    })
    expect(readSettings('{"lateKept":{"entry":"e1"}}')).toEqual({ theme: 'system', motion: 'system' })
  })
})

describe('no settings file, or one that cannot be read, means System for both', () => {
  it('gives System when there is no file yet', () => {
    expect(readSettings(null)).toEqual({ theme: 'system', motion: 'system' })
  })

  it('gives System for a file that is not JSON, or holds nothing it knows', () => {
    expect(readSettings('{"theme":')).toEqual({ theme: 'system', motion: 'system' })
    expect(readSettings('{"theme":"purple","motion":"fast"}')).toEqual({ theme: 'system', motion: 'system' })
    expect(readSettings('[1, 2, 3]')).toEqual({ theme: 'system', motion: 'system' })
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

describe('motion follows the system until the switch is clicked, then Animerat or Stilla holds', () => {
  it('is Stilla on a system with reduced motion, and Animerat without, until clicked', () => {
    expect([shownMotion('system', true), shownMotion('system', false)]).toEqual(['off', 'on'])
  })

  it('holds the state chosen whatever the system asks', () => {
    expect([shownMotion('on', true), shownMotion('off', false)]).toEqual(['on', 'off'])
  })

  it('switches to the other of the state shown, and names each one', () => {
    expect([nextMotion('system', true), nextMotion('system', false)]).toEqual(['on', 'off'])
    expect([nextMotion('on', false), nextMotion('off', true)]).toEqual(['off', 'on'])
    expect([motionName('on'), motionName('off')]).toEqual(['Animerat', 'Stilla'])
  })
})
