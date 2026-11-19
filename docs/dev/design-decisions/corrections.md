# Corrections

How the record is put right afterwards, and how an entry remembers it. Each decision follows the template in
`README.md`, and is cited by its title.

## Editing an entry on its line (2026-11-14)

**Built by:** Corrections.

**Decision:** an entry is chosen from the list under the flex bar and the ceiling wheel (earlier days from the popup
"Visa alla" opens) and opens as a line centred on the entry, with a handle at its start and its end and a little time
either side. The view zooms out as a handle is dragged, so the whole entry, as it is being changed, always fits with
some padding at both sides. The zoom grows the view only on the side being dragged: the other end stays where it is on
screen, and the line does not re-centre; the only hard stops are another entry, of any profile, shown as blocked time
when in view, and now. A neighbour of the same profile is docked to and can be joined ("Two entries join by docking").
Moving one handle outward adds time at that end, and inward takes it away. Moving both outward adds at both ends; moving
both the same way moves the entry, its length unchanged. Moving both inward does one of two things, and a click on the
line switches between them: by default it cuts a gap, removing the middle and splitting the entry in two, the gap being
a break; or it shortens the entry, removing both ends. Colour shows the change: green for time added, red for time taken
away; a gap shows a red middle, a shortening red ends, and green never appears there. No handle can be dragged into
another entry or past now. Midnight is no stop: the line edits the stored stretch, so an entry across midnight opens
whole, whichever day it was chosen from, and either handle crosses midnight freely; the counting still splits it there
("Time counts on the day it was worked"). A running entry's end is now and does not move. The line also shows the
entry's profile, which can be changed there to move the whole entry, times unchanged, to another profile ("Every edit
carries a reason"); an entry across midnight changes profile as one, both days' parts together. The colours are a
preview: nothing changes until the owner confirms, and a cancel leaves the entry as it was.

**Why:** the owner adds breaks during the day; one found after stop, a late start, an early end or the wrong profile are
all fixed in the same place, seeing the whole entry and the time around it. A handle that cannot reach a clash needs no
error message. Centring on the entry keeps the view small when the nearest neighbour is days away. With no wall at
midnight, an entry stopped the morning after is shortened back to the evening before in one drag, the way "A running
entry from an earlier day asks" sends the owner to correct it.

**Rejected:** a separate "add break" for stopped entries: see "Time away is a gap or an added break". Editing start and
end with the clock alone: it shows one time, not the entry and its neighbours. A break typed as a length on a stopped
entry: a from–to on the line places it where it happened. A line showing the whole day: most of it is empty, and the
entry is small in it. Midnight as a wall, each day's part edited from its own day: an entry stopped the morning after
could not be pulled back across midnight from either day, and the counting splits at midnight without the editor's help.

**Revisit if:** dragging proves too imprecise; see "Exact minutes on the line", in `open-questions.md`.

**Cases:**

- 08:00–12:00, left handle to 08:20: 08:20–12:00.
- 08:00–12:00, right handle dragged toward 16:00 with nothing else that day: the view zooms out as it goes, the whole
  entry always in view; 08:00–16:00.
- 08:00–12:00, right handle to 12:30, next entry starting 13:00: 08:00–12:30; the handle stops at 13:00.
- 08:00–12:00, both handles inward to 10:00 and 10:40, gap (default): 08:00–10:00 and 10:40–12:00.
- The same, switched to shorten: 10:00–10:40.
- 08:00–12:00, both handles moved 30 min later, nothing else that day: 08:30–12:30.
- Previous entry ends 07:30: the left handle stops at 07:30.
- 22:00–23:30, right handle dragged to 00:30: 22:00–00:30, one entry, counted 2 h on the first day and 30 min on the
  next.
- Entry Tuesday 22:00 to Wednesday 01:00, opened on Tuesday or on Wednesday: the line shows the whole entry, and both
  handles move.
- Entry Tuesday 21:30 to Wednesday 07:00, stopped the morning after, right handle dragged back to Tuesday 23:10:
  21:30–23:10 on Tuesday.
- Entry Tuesday 22:00 to Wednesday 01:00, moved to another profile: the whole entry moves, Tuesday's 22:00–24:00 and
  Wednesday's 00:00–01:00.
- Running entry: the right handle is now and does not move.
- Cancel after dragging: the entry is unchanged.

## Two entries join by docking (2026-11-19)

**Built by:** Corrections.

**Decision:** two entries of the same profile join on the line ("Editing an entry on its line"): a handle dragged to the
neighbour's near end docks there, the gap between them fills in green as time added, and on confirm the two become one
entry, with a reason as for any edit ("Every edit carries a reason"). A neighbour of another profile stays a stop, and
nothing joins. Either entry may be running; the joined entry then runs on. Their added breaks on the same day add up
into the joined entry's one break for that day ("Time away is a gap or an added break"). The joined entry is one entry
for the counting: it owes its expected hours on the day it starts ("A day owes its expected hours only when work started
on it").

**Why:** joining fixes a stop that was not a break: the owner stops for a break, work comes up, and the entry is started
again later; the gap was work. Dragging across the gap is the move the hand makes anyway, and the stop at the neighbour
is already there, so joining needs no action of its own.

**Rejected:** a "join" action on two neighbouring entries picked in a list: one more control for what the line already
does, and the gap's time would not show as it is added.

**Revisit if:** joining is wanted between entries of different profiles.

**Cases:**

- 08:00–10:00 and 10:25–12:00, same profile, the first's end docked on the second: 08:00–12:00, one entry.
- The same with the second running: one entry from 08:00, still running.
- Paus 15min on the first and paus 20min on the second, the same day, joined: one entry with paus 35min.
- 08:00–10:00 and an entry of another profile from 10:25: the handle stops at 10:25, nothing joins.

## Entries remember how they were made (2026-11-14)

**Built by:** Corrections, for written and edited entries.

**Decision:** every entry keeps one mark of how it was made: clicked, written by hand, or edited after it was recorded.
The mark is stored from the first entry, and an edited or hand-written entry also keeps its reason ("Every edit carries
a reason"). Showing the mark itself in the report is not decided; see "Corrected entries in the report", in
`codebase-ideas.md`.

**Why:** honesty in reporting: the boss can trust that a time set by hand is known to be one. Stored from the start, the
mark is right for every entry; added later, it would be missing on all entries before it.

**Rejected:** no mark: the record could not tell a click from a guess. Keeping every edit's old times: more than honesty
needs, for a report the boss reads at a glance.

**Revisit if:** the boss asks to see what an edit changed.

**Cases:**

- Start and stop clicked: the entry is marked clicked.
- An entry's start dragged on its line and confirmed: it is marked edited.
- A forgotten entry written afterwards: it is marked written by hand.

## Every edit carries a reason (2026-11-17)

**Built by:** Corrections, for the reason on the edit; Profiles, for the "Orsaker" tab.

**Decision:** an edit that changes an entry's time or its profile, on its line or by writing a forgotten entry by hand,
needs a reason before it is saved. Under the entry line sits one closed field, "Välj orsak"; clicked, it opens the list
of reasons, and the confirm stays greyed out until one is chosen. The list starts with "Glömde stämpla in", "Glömde
stämpla ut", "Fel profil" and "Ärende", and ends with "Annan orsak", always last, which opens a free-text field that
must not be left empty. The other reasons are ordered by how often they have been chosen. The entry stores the reason's
text, not a link to the list, and keeps only its latest one, as it keeps one mark ("Entries remember how they were
made"). Undo needs no reason: it puts back what was. Deleting an entry needs none either, only "Ta bort?" to confirm.
The reasons live in their own tab in the menu, "Orsaker" ("The menu has tabs, with every value locked behind "Ändra""),
where the owner adds, renames and removes them; renaming or removing one changes no entry. The tab also lists the "Annan
orsak" texts written at least three times, most common first with their counts, matched after lowercasing and dropping
punctuation and extra spaces, so a reason that keeps coming up can be added to the list. "Visa alla" shows each edited
entry's reason; the report shows it only on a day it lists ("The report lists the days the balance moved").

**Why:** honesty in reporting: a time set by hand comes with why, so the owner and the boss can trust it. A short list
keeps the reason one click and keeps notes readable; a required free text after "Annan orsak" stops it becoming an empty
way past the field. The closed field keeps the edit uncluttered. Stored text keeps old entries as they were given, as
settings that change from a date leave past days alone. Counting the free texts turns "this keeps coming up" into
something the owner can see.

**Rejected:** a free-text note alone: notes decay into "fix" and a full stop. Keeping every edit's reason: more than
honesty needs, as with old times. A reason for undo: it changes nothing that was true. A reason for deleting: a deleted
entry can only lower the hours, at most like a day never clocked, which needs no reason either, and nothing is left to
carry it. The list always open on the line: clutter. Fuzzy matching of the free texts, for typos and other wordings:
plain counting is enough for one person's notes. Remembering the last reason for the next edit: not asked for; see
"Revisit if".

**Revisit if:** picking the same reason for several edits in a row becomes tedious, or near-identical free texts keep
slipping past the count.

**Cases:**

- An entry's end dragged from 12:00 to 12:30: the confirm stays greyed out until a reason is chosen.
- "Annan orsak" chosen, the text left empty: the confirm stays greyed out.
- The reason "Glömde stämpla ut" renamed in "Orsaker" to "Glömt stoppa": entries edited before keep "Glömde stämpla ut".
- "Möte med rektor.", "möte med rektor" and "Möte med rektor" written: "Orsaker" lists "möte med rektor (3)".
- An edit undone: no reason is asked for.
- An entry deleted: "Ta bort?", and no reason.
- An entry moved from janitor work to the development group: the confirm waits for a reason, such as "Fel profil".
