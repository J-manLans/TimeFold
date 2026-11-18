import { describe, expect, it } from 'vitest'
import { clickLabel, lateWords, press, runningSinceEarlierDay, stopRunning, undo } from '$lib/modules/controls/clock'
import { type Entry, type TimeRecord } from '$lib/modules/shared/record'
import { at, entry, RECORD } from '$tests/helpers/records'

// === Constants ===

const JANITOR = 'p1'
const DEVELOPMENT = 'p2'
const UNDO_SECONDS = 15

// === Helpers ===

/** The shared record with a second profile and the given entries. Used by every test here */
function record(entries: Entry[]): TimeRecord {
  return {
    ...RECORD,
    profiles: [...RECORD.profiles, { id: DEVELOPMENT, name: 'Utvecklingsgruppen', hue: 200, base: '#4f8fd6' }],
    entries,
  }
}

/** A moment as a Date, for pressing. Used for every press and undo: moment('2026-11-16', '13:00') */
function moment(day: string, time: string): Date {
  return new Date(at(day, time))
}

// === Tests ===

describe('pressing start with nothing running starts an entry', () => {
  it('starts a clicked entry at the press, to the second, with the next free id', () => {
    const before = record([entry(at('2026-11-13', '08:00'), at('2026-11-13', '14:00'), { id: 'e1' })])

    const { record: after, click } = press(before, JANITOR, moment('2026-11-16', '08:02:15'))

    expect(after.entries).toEqual([
      ...before.entries,
      { id: 'e2', profile: JANITOR, start: at('2026-11-16', '08:02:15'), stop: null, made: 'clicked' },
    ])
    expect(click).toEqual({ kind: 'start', at: at('2026-11-16', '08:02:15'), started: 'e2' })
  })
})

describe('pressing stop ends the running entry', () => {
  it('ends it at the press, and nothing runs', () => {
    const before = record([entry(at('2026-11-16', '07:58'), null, { id: 'e1' })])

    const { record: after, click } = press(before, JANITOR, moment('2026-11-16', '15:40'))

    expect(after.entries).toEqual([{ ...before.entries[0], stop: at('2026-11-16', '15:40') }])
    expect(click).toEqual({ kind: 'stop', at: at('2026-11-16', '15:40'), stopped: 'e1' })
  })
})

describe('starting one profile while another runs switches, so at most one runs', () => {
  it('ends A and starts B at the same moment', () => {
    const before = record([entry(at('2026-11-16', '07:58'), null, { id: 'e1' })])

    const { record: after, click } = press(before, DEVELOPMENT, moment('2026-11-16', '13:00'))

    expect(after.entries).toEqual([
      { ...before.entries[0], stop: at('2026-11-16', '13:00') },
      { id: 'e2', profile: DEVELOPMENT, start: at('2026-11-16', '13:00'), stop: null, made: 'clicked' },
    ])
    expect(click).toEqual({ kind: 'switch', at: at('2026-11-16', '13:00'), stopped: 'e1', started: 'e2' })
  })
})

describe('the undo reverses exactly the last click within its seconds', () => {
  it('lets a stop pressed by mistake run on, with no mark', () => {
    const before = record([entry(at('2026-11-16', '07:58'), null, { id: 'e1' })])
    const { record: stopped, click } = press(before, JANITOR, moment('2026-11-16', '15:40'))

    expect(undo(stopped, click, moment('2026-11-16', '15:40:10'), UNDO_SECONDS)).toEqual(before)
  })

  it('removes the entry a start created, so nothing runs', () => {
    const before = record([])
    const { record: started, click } = press(before, JANITOR, moment('2026-11-16', '08:02'))

    expect(undo(started, click, moment('2026-11-16', '08:02:09'), UNDO_SECONDS)).toEqual(before)
  })

  it('reverses both halves of a switch: B is gone and A runs on', () => {
    const before = record([entry(at('2026-11-16', '07:58'), null, { id: 'e1' })])
    const { record: switched, click } = press(before, DEVELOPMENT, moment('2026-11-16', '13:00'))

    expect(undo(switched, click, moment('2026-11-16', '13:00:14'), UNDO_SECONDS)).toEqual(before)
  })
})

describe('after its seconds the undo changes nothing, by the clock', () => {
  it('leaves a stop at 15:40 as it is when undone at 15:40:30, as after a hidden window', () => {
    const before = record([entry(at('2026-11-16', '07:58'), null, { id: 'e1' })])
    const { record: stopped, click } = press(before, JANITOR, moment('2026-11-16', '15:40'))

    expect(undo(stopped, click, moment('2026-11-16', '15:40:30'), UNDO_SECONDS)).toEqual(stopped)
  })
})

describe('the undo’s label says which click it would undo, and when', () => {
  it('names a start, a stop and a switch with their time, the switch with both profiles', () => {
    const idle = record([])
    const running = record([entry(at('2026-11-16', '07:58'), null, { id: 'e1' })])
    const started = press(idle, JANITOR, moment('2026-11-16', '08:02'))
    const stopped = press(running, JANITOR, moment('2026-11-16', '15:40'))
    const switched = press(running, DEVELOPMENT, moment('2026-11-16', '13:00'))

    expect(clickLabel(started.record, started.click)).toBe('start 08:02')
    expect(clickLabel(stopped.record, stopped.click)).toBe('stopp 15:40')
    expect(clickLabel(switched.record, switched.click)).toBe('byte 13:00 (Vaktis → Utvecklingsgruppen)')
  })
})

describe('a running entry from an earlier day is asked about when the app opens', () => {
  it('finds an entry started yesterday 21:30 and still running', () => {
    const late = entry(at('2026-11-16', '21:30'), null, { id: 'e1' })

    expect(runningSinceEarlierDay(record([late]), moment('2026-11-17', '07:00'))).toEqual(late)
  })

  it('finds nothing for an entry started today, or when nothing runs', () => {
    const today = entry(at('2026-11-17', '06:30'), null, { id: 'e1' })
    const stopped = entry(at('2026-11-16', '21:30'), at('2026-11-16', '23:10'), { id: 'e1' })

    expect(runningSinceEarlierDay(record([today]), moment('2026-11-17', '07:00'))).toBeNull()
    expect(runningSinceEarlierDay(record([stopped]), moment('2026-11-17', '07:00'))).toBeNull()
  })
})

describe('Stoppa stops the running entry, whichever profile is on screen', () => {
  it('stops the janitor entry at the press, as the button does, with a stop to undo', () => {
    const before = record([entry(at('2026-11-16', '21:30'), null, { id: 'e1' })])

    const { record: after, click } = stopRunning(before, moment('2026-11-17', '07:00'))

    expect(after.entries).toEqual([{ ...before.entries[0], stop: at('2026-11-17', '07:00') }])
    expect(click).toEqual({ kind: 'stop', at: at('2026-11-17', '07:00'), stopped: 'e1' })
    if (click === null) throw new Error('nothing was stopped')
    expect(undo(after, click, moment('2026-11-17', '07:00:05'), UNDO_SECONDS)).toEqual(before)
  })
})

describe('the popup says which profile runs and since when', () => {
  it('says yesterday as "igår", and an older day in words', () => {
    const yesterday = entry(at('2026-11-16', '21:30'), null, { id: 'e1' })
    const older = entry(at('2026-11-14', '21:30'), null, { id: 'e1' })

    expect(lateWords(record([yesterday]), yesterday, moment('2026-11-17', '07:00'))).toEqual({
      heading: 'Startad igår',
      line: 'Vaktis pågår sedan igår 21:30.',
    })
    expect(lateWords(record([older]), older, moment('2026-11-17', '07:00'))).toEqual({
      heading: 'Startad lördag 14 november',
      line: 'Vaktis pågår sedan lördag 14 november 21:30.',
    })
  })
})
