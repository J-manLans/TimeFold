import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { RUNS } from '$tests/helpers/properties'
import { RECORD } from '$tests/helpers/records'
import { addReason, learnReason, matchForm, reasonList, removeReason, renameReason } from '$lib/modules/edit/reasons'
import type { TimeRecord } from '$lib/modules/shared/record'

// === Helpers ===

/** The record after each text is written in "Annan orsak", in turn */
function writing(...texts: string[]): TimeRecord {
  return texts.reduce((record, text) => learnReason(record, text), RECORD)
}

// === Tests ===

describe('the reasons are listed in Swedish alphabetical order, Å, Ä and Ö after Z', () => {
  it('lists the six the record starts with', () => {
    expect(reasonList(RECORD)).toEqual([
      'Fel profil',
      'Glömd paus',
      'Glömd post',
      'Glömde stämpla in',
      'Glömde stämpla ut',
      'Ärende',
    ])
  })
})

describe('texts are matched lowercased, without punctuation or extra spaces', () => {
  it.each([
    ['Möte med rektor.', 'möte med rektor'],
    ['  möte   med rektor ', 'möte med rektor'],
    ['Möte, med rektor!', 'möte med rektor'],
  ])('reads "%s" as "%s"', (text, form) => {
    expect(matchForm(text)).toBe(form)
  })
})

describe('an "Annan orsak" text written three times joins the list', () => {
  it('adds "Möte med rektor" after three ways of writing it, in its alphabetical place', () => {
    const record = writing('Möte med rektor.', 'möte med rektor', 'Möte  med rektor')

    expect(reasonList(record)).toEqual([
      'Fel profil',
      'Glömd paus',
      'Glömd post',
      'Glömde stämpla in',
      'Glömde stämpla ut',
      'Möte med rektor',
      'Ärende',
    ])
  })

  it('takes the third writing, its first letter a capital', () => {
    expect(reasonList(writing('Möte', 'möte', 'möte.'))).toContain('Möte.')
  })

  it('waits at two', () => {
    expect(reasonList(writing('Möte', 'möte'))).toHaveLength(6)
  })

  it('never counts a text that is already a reason', () => {
    expect(writing('fel profil', 'Fel profil', 'FEL PROFIL').reasons.written).toEqual([])
  })
})

describe('a reason is renamed under its pen, a name already in the list refused', () => {
  it('renames "Glömde stämpla ut" to "Glömt stoppa"', () => {
    const renamed = renameReason(RECORD, 'Glömde stämpla ut', 'Glömt stoppa')

    expect('reasons' in renamed && reasonList(renamed)).toContain('Glömt stoppa')
    expect('reasons' in renamed && reasonList(renamed)).not.toContain('Glömde stämpla ut')
  })

  it('refuses "fel profil" for "Ärende"', () => {
    expect(renameReason(RECORD, 'Ärende', 'fel profil')).toEqual({ refusal: 'taken' })
  })

  it('keeps entries as they were', () => {
    const renamed = renameReason(RECORD, 'Glömd paus', 'Paus glömd')

    expect('entries' in renamed && renamed.entries).toEqual(RECORD.entries)
  })
})

describe('"+" adds a typed text to the list at once', () => {
  it('adds "hämtade  nycklar" as "Hämtade nycklar", in its alphabetical place', () => {
    const added = addReason(RECORD, 'hämtade  nycklar')

    expect('reasons' in added && reasonList(added)).toContain('Hämtade nycklar')
  })

  it('refuses "fel profil", already a reason', () => {
    expect(addReason(RECORD, 'fel profil')).toEqual({ refusal: 'taken' })
  })

  it('lets a removed reason back in, no longer forgotten', () => {
    const added = addReason(removeReason(RECORD, 'Glömd post'), 'Glömd post')

    expect('reasons' in added && [reasonList(added).includes('Glömd post'), added.reasons.forgotten]).toEqual([
      true,
      [],
    ])
  })

  it('clears the count of a text half learned', () => {
    const added = addReason(learnReason(RECORD, 'Möte'), 'möte')

    expect('reasons' in added && added.reasons.written).toEqual([])
  })
})

describe('a removed reason is gone, and never learned again', () => {
  it('removes "Glömd post"', () => {
    expect(reasonList(removeReason(RECORD, 'Glömd post'))).not.toContain('Glömd post')
  })

  it('does not learn "Möte med rektor" again after it was removed', () => {
    const removed = removeReason(writing('Möte med rektor', 'Möte med rektor', 'Möte med rektor'), 'Möte med rektor')
    const again = ['Möte med rektor', 'möte med rektor', 'Möte med rektor'].reduce(learnReason, removed)

    expect(reasonList(again)).not.toContain('Möte med rektor')
  })
})

describe('the list never holds two reasons of one form, nor one it has forgotten', () => {
  const TEXTS = fc.constantFrom('Möte', 'möte.', 'Fel profil', 'Hämtade nycklar', 'hämtade  nycklar', 'Ärende', 'Kurs')
  const ACTION = fc.oneof(
    fc.record({ kind: fc.constant('write' as const), text: TEXTS }),
    fc.record({ kind: fc.constant('rename' as const), at: fc.nat(10), text: TEXTS }),
    fc.record({ kind: fc.constant('remove' as const), at: fc.nat(10) }),
  )

  it(
    'holds after any run of writing, renaming and removing',
    () => {
      fc.assert(
        fc.property(fc.array(ACTION, { maxLength: 30 }), (actions) => {
          let record = RECORD
          for (const action of actions) {
            const list = record.reasons.list
            if (action.kind === 'write') record = learnReason(record, action.text)
            else if (list.length === 0) continue
            else if (action.kind === 'rename') {
              const renamed = renameReason(record, list[action.at % list.length], action.text)
              if ('reasons' in renamed) record = renamed
            } else record = removeReason(record, list[action.at % list.length])
          }
          const forms = record.reasons.list.map(matchForm)
          expect(new Set(forms).size).toBe(forms.length)
          expect(forms.filter((f) => record.reasons.forgotten.includes(f))).toEqual([])
        }),
        { numRuns: RUNS },
      )
    },
    Math.max(5000, RUNS),
  )
})
