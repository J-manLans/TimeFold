/**
 * The profiles as the owner keeps them: made, renamed, archived, brought back and deleted ("Profiles label the hours";
 * "A profile with hours is archived, one without is deleted"). Pure: each change returns a new record.
 */

import { baseColour, largestGapHue, stripOfHue } from '$lib/modules/shared/colours'
import type { Profile, TimeRecord } from '$lib/modules/shared/record'

// ======================================
//                 API
// ======================================

/** Why a name cannot be used: nothing in it, or another profile's, active or archived */
export type NameRefusal = 'empty' | 'taken' | 'archived'

/**
 * What a profile's last button does: archive it, delete it, refuse while it runs, or bring it back; none for the
 * profile with the balance
 */
export type Removal = 'archive' | 'delete' | 'running' | 'restore' | null

/** The profiles in use, in the order kept. Used by the profile popup and the Profiler list */
export function activeProfiles(record: TimeRecord): Profile[] {
  return record.profiles.filter((p) => !p.archived)
}

/** The archived profiles, in the order kept. Used by "Arkiverade" */
export function archivedProfiles(record: TimeRecord): Profile[] {
  return record.profiles.filter((p) => p.archived)
}

/**
 * Why a name cannot be a profile's, or null when it can: names are compared without case or the spaces around them,
 * among every profile, archived ones too. Used by "Ny profil" and a rename: "utveckling " is taken by "Utveckling".
 * @param self - the profile being renamed, whose own name is free to it
 */
export function nameRefusal(record: TimeRecord, name: string, self?: string): NameRefusal | null {
  const form = name.trim().toLowerCase()
  if (form === '') return 'empty'
  const owner = record.profiles.find((p) => p.id !== self && p.name.trim().toLowerCase() === form)
  if (owner === undefined) return null
  return owner.archived ? 'archived' : 'taken'
}

/**
 * A new profile with the name, trimmed, its hue at the middle of the largest gap between the hues in use and their
 * opposites, and no pay or expected hours yet. Used by "Ny profil": "Städ" beside Vaktmästare and Utveckling is p3.
 * @param random - picks between equal gaps, 0 to under 1
 */
export function addProfile(
  record: TimeRecord,
  name: string,
  random: () => number = Math.random,
): { record: TimeRecord; id: string } | { refusal: NameRefusal } {
  const refusal = nameRefusal(record, name)
  if (refusal !== null) return { refusal }
  const id = nextProfileId(record.profiles)
  const hue = largestGapHue(
    record.profiles.map((p) => p.hue),
    random,
  )
  const profile: Profile = {
    id,
    name: name.trim(),
    hue,
    base: baseColour(hue),
    strip: Math.round(stripOfHue(hue)) % 360,
  }
  return { record: { ...record, profiles: [...record.profiles, profile] }, id }
}

/** The profile under a new name, trimmed, unless it is refused. Used by the name's "Ändra" in a profile's row */
export function renameProfile(record: TimeRecord, id: string, name: string): TimeRecord | { refusal: NameRefusal } {
  const refusal = nameRefusal(record, name, id)
  if (refusal !== null) return { refusal }
  return { ...record, profiles: record.profiles.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)) }
}

/**
 * What a profile's last button does now: the janitor has none; an archived profile comes back; a running one is
 * refused; one with any entry is archived, and one with none deleted. Used for the button's word, which follows the
 * profile as it is: "Ta bort" turns to "Arkivera" with its first entry.
 */
export function removalOf(record: TimeRecord, id: string): Removal {
  const profile = record.profiles.find((p) => p.id === id)
  if (profile === undefined || profile.expectedMinutes !== undefined) return null
  if (profile.archived) return 'restore'
  const own = record.entries.filter((e) => e.profile === id)
  if (own.some((e) => e.stop === null)) return 'running'
  return own.length > 0 ? 'archive' : 'delete'
}

/**
 * The profile archived, keeping its hours, or deleted for good when it has none. Used on the second click of
 * "Arkivera" or "Ta bort".
 * @throws for the profile with the balance, a running profile, or one already archived
 */
export function removeProfile(record: TimeRecord, id: string): TimeRecord {
  const removal = removalOf(record, id)
  if (removal === 'delete') return { ...record, profiles: record.profiles.filter((p) => p.id !== id) }
  if (removal === 'archive') {
    return { ...record, profiles: record.profiles.map((p) => (p.id === id ? { ...p, archived: true as const } : p)) }
  }
  throw new Error(`Profile ${id} cannot be taken away (${removal})`)
}

/** An archived profile back in use, its history whole. Used by "Återställ" in "Arkiverade" */
export function restoreProfile(record: TimeRecord, id: string): TimeRecord {
  return {
    ...record,
    profiles: record.profiles.map((p) => {
      if (p.id !== id) return p
      const active = { ...p }
      delete active.archived
      return active
    }),
  }
}

/**
 * The profile the app opens on ("The app opens on the running profile, or the last one on screen"): the one whose
 * entry runs; when nothing runs, the one kept as on screen at close, while it is in use; else the first in use. Used
 * when the app starts.
 * @param kept - the profile on screen when the app last closed, from the machine's settings
 */
export function openingProfile(record: TimeRecord, kept?: string): string {
  const running = record.entries.find((e) => e.stop === null)
  if (running) return running.profile
  const active = activeProfiles(record)
  return active.find((p) => p.id === kept)?.id ?? active[0]?.id ?? record.profiles[0].id
}

// ======================================
//               Helpers
// ======================================

/** The next free profile id after the highest `pN`. Used by `addProfile`: p1 and p2 give p3 */
function nextProfileId(profiles: Profile[]): string {
  const highest = Math.max(0, ...profiles.map((p) => Number(/^p(\d+)$/.exec(p.id)?.[1] ?? 0)))
  return `p${highest + 1}`
}
