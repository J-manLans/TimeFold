import { describe, expect, it } from 'vitest'
import { ringAfterClose, ringOnOpen } from '$lib/modules/shared/focusRing'

// === Tests ===

describe('an opened popup shows a focus ring on its first focus only when it was opened with the keyboard', () => {
  it('shows it after Enter or Space, and not after a click or when the app opened it', () => {
    expect([ringOnOpen('key'), ringOnOpen('pointer'), ringOnOpen(null)]).toEqual([true, false, false])
  })
})

describe('a closed popup leaves a focus ring only when it was opened and closed with the keyboard', () => {
  it('keeps the ring after a keyboard open and a keyboard close', () => {
    expect(ringAfterClose('key', 'key')).toBe(true)
  })

  it('hides it after a mouse open, whether closed by mouse or by Esc', () => {
    expect([ringAfterClose('pointer', 'pointer'), ringAfterClose('pointer', 'key')]).toEqual([false, false])
  })

  it('hides it after a keyboard open closed by mouse', () => {
    expect(ringAfterClose('key', 'pointer')).toBe(false)
  })

  it('hides it for a popup the app opened by itself, such as the late-stop question', () => {
    expect([ringAfterClose(null, 'key'), ringAfterClose(null, 'pointer')]).toEqual([false, false])
  })
})
