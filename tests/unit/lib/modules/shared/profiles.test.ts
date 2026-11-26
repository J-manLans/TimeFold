import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { RUNS } from '$tests/helpers/properties'
import { at, entry, RECORD } from '$tests/helpers/records'
import {
  activeProfiles,
  addProfile,
  archivedProfiles,
  nameRefusal,
  removalOf,
  removeProfile,
  renameProfile,
  restoreProfile,
} from '$lib/modules/shared/profiles'
import { largestGapHue } from '$lib/modules/shared/colours'
import type { Profile, TimeRecord } from '$lib/modules/shared/record'

// === Constants ===

const DEV: Profile = { id: 'p2', name: 'Utveckling', hue: 285, base: '#a99cf0' }

// === Helpers ===

/** The test record with the janitor's entries stopped, Utveckling beside it, and any of its `entries` */
function withDev(devEntries: TimeRecord['entries'] = [], dev: Profile = DEV): TimeRecord {
  const stopped = RECORD.entries.map((e) => ({ ...e, stop: e.stop ?? '2026-11-17T12:00:00+02:00' }))
  return { ...RECORD, profiles: [...RECORD.profiles, dev], entries: [...stopped, ...devEntries] }
}

const DEV_HOURS = [entry(at('2026-11-18', '08:00'), at('2026-11-18', '10:00'), { profile: DEV.id, id: 'd1' })]

/** Picks the first of equal gaps, so the tests do not depend on chance */
const FIRST = (): number => 0

// === Tests ===

describe('a name belongs to one profile, active or archived, compared without case or the spaces around it', () => {
  it.each([
    ['utveckling', null, 'taken'],
    ['  Utveckling ', null, 'taken'],
    ['Utveckling', DEV.id, null],
    ['Utvecklingsgruppen', null, null],
  ])('"%s" is refused as %s… → %s', (name, self, refusal) => {
    expect(nameRefusal(withDev(), name, self ?? undefined)).toBe(refusal)
  })

  it('names an archived one apart, so the note points to "Arkiverade"', () => {
    expect(nameRefusal(withDev([], { ...DEV, archived: true }), 'utveckling ')).toBe('archived')
  })

  it('refuses an empty name', () => {
    expect(nameRefusal(withDev(), '   ')).toBe('empty')
  })
})

describe('"Ny profil" makes a profile with its colours at the largest gap', () => {
  it('adds Städ as p3, active, with no pay and no expected hours', () => {
    const made = addProfile(withDev(), 'Städ', FIRST)

    expect(made).toMatchObject({ id: 'p3' })
    expect('record' in made && made.record.profiles[2]).toMatchObject({ id: 'p3', name: 'Städ' })
    expect('record' in made && made.record.profiles[2].expectedMinutes).toBeUndefined()
  })

  it('refuses a taken name and changes nothing', () => {
    expect(addProfile(withDev(), 'utveckling', FIRST)).toEqual({ refusal: 'taken' })
  })

  it('trims the spaces around the name', () => {
    const made = addProfile(withDev(), '  Städ ', FIRST)

    expect('record' in made && made.record.profiles[2].name).toBe('Städ')
  })
})

describe("a new profile's hue is the middle of the largest gap between the hues in use and their opposites", () => {
  it.each([
    // 195 and its opposite 15 leave two gaps of 180: the first gives 105
    [[195], 105],
    // 195, 15, 285 and 105: four gaps of 90, the first from 15 gives 60
    [[195, 285], 60],
  ])('gives %j a hue of %i', (hues, hue) => {
    expect(largestGapHue(hues, FIRST)).toBe(hue)
  })
})

describe('a renamed profile keeps its one name among all profiles', () => {
  it('renames Utveckling to Utvecklingsgruppen', () => {
    const renamed = renameProfile(withDev(), DEV.id, 'Utvecklingsgruppen')

    expect('profiles' in renamed && renamed.profiles[1].name).toBe('Utvecklingsgruppen')
  })

  it('refuses the janitor’s name', () => {
    expect(renameProfile(withDev(), DEV.id, 'vaktis')).toEqual({ refusal: 'taken' })
  })
})

describe('a profile with hours is archived, one without is deleted, the janitor neither', () => {
  it.each([
    ['the janitor', withDev(DEV_HOURS), 'p1', null],
    ['Utveckling with hours', withDev(DEV_HOURS), DEV.id, 'archive'],
    ['Utveckling just made, no hours', withDev(), DEV.id, 'delete'],
    ['Utveckling running', withDev([entry(at('2026-11-18', '08:00'), null, { profile: DEV.id })]), DEV.id, 'running'],
    ['Utveckling archived', withDev(DEV_HOURS, { ...DEV, archived: true }), DEV.id, 'restore'],
  ])('offers %s: %s', (_case, record, id, removal) => {
    expect(removalOf(record, id)).toBe(removal)
  })

  it('archives Utveckling with hours, keeping its hours, and lists it apart', () => {
    const archived = removeProfile(withDev(DEV_HOURS), DEV.id)

    expect(activeProfiles(archived).map((p) => p.id)).toEqual(['p1'])
    expect(archivedProfiles(archived).map((p) => p.id)).toEqual([DEV.id])
    expect(archived.entries.filter((e) => e.profile === DEV.id)).toHaveLength(1)
  })

  it('deletes Utveckling with no hours for good', () => {
    expect(removeProfile(withDev(), DEV.id).profiles.map((p) => p.id)).toEqual(['p1'])
  })

  it('brings an archived profile back with its hours whole', () => {
    const back = restoreProfile(removeProfile(withDev(DEV_HOURS), DEV.id), DEV.id)

    expect(back).toEqual(withDev(DEV_HOURS))
  })

  it('refuses to take away a running profile or the janitor', () => {
    const running = withDev([entry(at('2026-11-18', '08:00'), null, { profile: DEV.id })])

    expect(() => removeProfile(running, DEV.id)).toThrow()
    expect(() => removeProfile(withDev(), 'p1')).toThrow()
  })
})

describe('no two profiles ever share a name, whatever is made, renamed, archived, restored or deleted', () => {
  const NAMES = fc.constantFrom('Städ', 'städ', ' Städ', 'Utveckling', 'utveckling ', 'Vaktis', 'Möte', 'MÖTE')
  const ACTION = fc.oneof(
    fc.record({ kind: fc.constant('add' as const), name: NAMES }),
    fc.record({ kind: fc.constant('rename' as const), at: fc.nat(5), name: NAMES }),
    fc.record({ kind: fc.constant('remove' as const), at: fc.nat(5) }),
    fc.record({ kind: fc.constant('restore' as const), at: fc.nat(5) }),
  )

  it(
    'holds after any run of them',
    () => {
      fc.assert(
        fc.property(fc.array(ACTION, { maxLength: 20 }), (actions) => {
          let record = withDev(DEV_HOURS)
          for (const action of actions) {
            const target = record.profiles[action.kind === 'add' ? 0 : action.at % record.profiles.length]
            if (action.kind === 'add') {
              const made = addProfile(record, action.name, FIRST)
              if ('record' in made) record = made.record
            } else if (action.kind === 'rename') {
              const renamed = renameProfile(record, target.id, action.name)
              if ('profiles' in renamed) record = renamed
            } else if (action.kind === 'remove' && ['archive', 'delete'].includes(removalOf(record, target.id) ?? '')) {
              record = removeProfile(record, target.id)
            } else if (action.kind === 'restore' && target.archived) {
              record = restoreProfile(record, target.id)
            }
          }
          const names = record.profiles.map((p) => p.name.trim().toLowerCase())
          expect(new Set(names).size).toBe(names.length)
          expect(record.profiles.filter((p) => p.expectedMinutes !== undefined)).toHaveLength(1)
          expect(record.entries).toEqual(withDev(DEV_HOURS).entries)
        }),
        { numRuns: RUNS },
      )
    },
    Math.max(5000, RUNS),
  )
})
