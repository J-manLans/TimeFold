import { describe, expect, it } from 'vitest'
import { durationShape } from '$lib/modules/shared/durationShape'
import { BREAK } from '$lib/modules/shared/timeInput'

// === Stand-ins ===

/** An input as the attachment uses it: its text, its caret, and its events */
class StandInInput extends EventTarget {
  value = ''
  selectionStart = 0

  setSelectionRange(start: number): void {
    this.selectionStart = start
  }

  /** A keystroke or paste: the text as it would stand, the caret after it, then the input event */
  type(text: string): void {
    this.value = text
    this.selectionStart = text.length
    this.dispatchEvent(new Event('input'))
  }
}

// === Tests ===

describe('a length field keeps its shape as it is typed', () => {
  it('lets "12:" through and undoes the "7" that would make "12:7", telling only what it keeps', () => {
    const input = new StandInInput()
    const told: string[] = []
    durationShape(BREAK, (text) => told.push(text))(input as unknown as HTMLInputElement)

    input.type('12:')
    input.type('12:7')

    expect([input.value, input.selectionStart, told]).toEqual(['12:', 3, ['12:']])
  })

  it('stops listening once taken away', () => {
    const input = new StandInInput()
    const told: string[] = []
    const remove = durationShape(BREAK, (text) => told.push(text))(input as unknown as HTMLInputElement)

    if (typeof remove === 'function') remove()
    input.type('45')

    expect(told).toEqual([])
  })
})
