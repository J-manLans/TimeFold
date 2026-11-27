# Profiles: what a profile is

What a profile holds, and how one is archived, deleted and brought back. The ceiling, and pay and settings, have their
own files beside this one. Each decision follows the template in `../README.md`, and is cited by its title.

## Profiles label the hours (2026-11-14)

**Decision:** every entry belongs to one profile (such as janitor work or the development group). Switching is done as
in "One start/stop button and a profile list". A day can mix profiles, and the owner adds profiles as new kinds of work
come up. Profiles are isolated: each counts its own days and hours, and work in one never changes another. A profile
holds: a short name (what is tapped when switching), its own among every profile ("A profile with hours is archived, one
without is deleted"); optional expected hours, and only a profile with them has a balance; a hue and a base colour, with
a neon that follows from the hue ("Each profile carries its colours", in `design-decisions/`); active or archived (an
archived profile leaves the switch list but keeps its hours in the history and reports, "A profile with hours is
archived, one without is deleted"); and an optional monthly salary or rate per hour for the pay estimate ("A pay
estimate per profile"). Reports show hours per profile. Where the work is done is not recorded: the owner works from
wherever suits, and a place matters to the app only if it is paid differently, when it is a profile of its own.

**Why:** the owner's work is paid differently depending on the task and where it is done. Keeping profiles apart means a
Saturday of development group work cannot touch the janitor balance, with no special rule for it.

**Rejected:** the app calculating pay as payroll does: salary rules belong to payroll, and would make the app wrong
whenever they change; the pay estimate is a rough figure for the owner only. A yes/no "counts toward the balance"
setting per profile, with one shared balance: it let work in one profile change another's balance. A "reported to" field
on each profile: the owner does not need it. A place mark on entries, such as "from home", beside the profile: where the
work is done has no bearing on the counts.

**Revisit if:** the owner needs the app's figures to match payroll.

## A profile with hours is archived, one without is deleted (2026-11-26)

**Decision:** the janitor profile is never archived or deleted. Any other profile's row ends with one button, which
follows the profile as it is now: **"Arkivera"** while it has any hours (an entry, hours in the ceiling, or an entry
running), **"Ta bort"** in the removal red while it has none, so the word turns to "Arkivera" with its first entry. Each
asks once, as an entry's delete does: the word gets its "?" and a border, the removal red for "Ta bort", the plain text
colour for "Arkivera", since an archive can be undone; the focus or a click going elsewhere disarms it. An archived
profile leaves the switch list and the Profiler list but keeps its hours, colours, pay and history. The edit popup's
profile picker never offers it: an entry of an archived profile still opens and is edited as any entry, its times, its
break, its reason, or moved to a profile in use, the picker naming its own profile greyed as the chosen one, but no
entry is moved onto an archived profile. A deleted one is gone for good. A profile that runs is neither: its "Arkivera"
is refused with "Stoppa jobbet först" in the removal red under the button, until it is stopped. A profile removed while
on screen hands the screen to the first active profile. Archived profiles sit in **"Arkiverade"** at the bottom of
Profiler, under "Ny profil": a heading with their count, folded shut until clicked, opening and folding as a profile row
does, absent while nothing is archived; each row in it is faded, opens like any profile row, and ends with
**"Återställ"**, which brings the profile back at once, asking nothing, with its history whole and a stretch with no
entries where it was archived. A name belongs to one profile, active or archived, compared without case or the spaces
around it: in "Ny profil" a taken name is refused, the field kept open with a note centred under it in the note size and
the removal red, as every refused value in the app, "Namnet finns redan" or "Namnet finns bland arkiverade", gone at the
next key; a rename to a taken name is refused as any refused value in the menu is. A name's first letter turns into a
capital as it is typed, in "Ny profil" and in a rename, the caret left where it was.

**Why:** a profile's hours are its history: deleting one with hours would change past balances or ceilings, the pay
estimate and reports already sent, or leave entries with no name or colour. A profile with no hours has nothing to keep,
and only clutters the archive. One button whose word follows the profile spares a choice between two. "Återställ" keeps
a profile one thing, its old hours and new ones counted together; a name used twice would show two profiles with one
name in the history and reports.

**Rejected:** a pay category on each profile, a free label for the report to group by: it only repeated how the profile
is paid, took any text, and the report already lists hours per profile with their pay kind. Deleting a profile with
hours but keeping its entries: the entries still need its name, colour and pay category, so it is an archive by another
name. Bringing a profile back by making it again under the same name: two profiles with one name, their hours counted
apart and in different colours. Suggesting archived names as "Ny profil" is typed, to bring one back from there: the
folded list already brings it back, and the refused name points to it. Archived profiles in the Profiler list, marked
"arkiverad": they stay in sight long after they matter. An archived profile's entries frozen until it is brought back:
fixing an old entry's forgotten stop would need "Återställ", the edit and "Arkivera" again.

**Revisit if:** archived profiles pile up enough that the folded list is hard to read.

**Cases:**

- Utveckling with hours: its row shows "Arkivera"; clicked, "Arkivera?"; clicked again, it leaves the list and
  "Arkiverade (1)" appears under "Ny profil".
- Utveckling running: "Arkivera" clicked shows "Stoppa jobbet först" under it, and nothing is archived; stopped,
  "Arkivera" asks as usual.
- A profile just made, no hours: "Ta bort" in red; clicked twice, it is gone, and nothing appears under "Arkiverade".
- "Ta bort" clicked once, then a click elsewhere: back to "Ta bort", nothing removed.
- A new profile with no hours, then an entry made in it: its row shows "Arkivera".
- An archived Utveckling: "utveckling " typed in "Ny profil", Enter: refused, "Namnet finns bland arkiverade" under the
  field; a key typed: the note goes.
- "Återställ" on Utveckling: back in the list and the switch list, its hours as before; "Arkiverade" goes with its last
  row.
- "utveckling" typed: the field shows "Utveckling".
