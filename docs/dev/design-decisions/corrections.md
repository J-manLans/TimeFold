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
when in view, and midnight. Moving one handle outward adds time at that end, and inward takes it away. Moving both
outward adds at both ends; moving both the same way moves the entry, its length unchanged. Moving both inward does one
of two things, and a click on the line switches between them: by default it cuts a gap, removing the middle and
splitting the entry in two, the gap being a break; or it shortens the entry, removing both ends. Colour shows the
change: green for time added, red for time taken away; a gap shows a red middle, a shortening red ends, and green never
appears there. No handle can be dragged into another entry, past now, or across midnight: midnight is a wall like a
neighbour. An entry across midnight opens on the day chosen, showing its part of that day, and its other end is edited
from the other day; an edit that would cross midnight is two edits, one per day. A running entry's end is now and does
not move. The line also shows the entry's profile, which can be changed there to move the whole entry, times unchanged,
to another profile ("Every edit carries a reason"); an entry across midnight changes profile as one, both days' parts
together, whichever day it was opened from. The colours are a preview: nothing changes until the owner confirms, and a
cancel leaves the entry as it was.

**Why:** the owner adds breaks during the day; one found after stop, a late start, an early end or the wrong profile are
all fixed in the same place, seeing the whole entry and the time around it. A handle that cannot reach a clash needs no
error message. Centring on the entry keeps the view small when the nearest neighbour is days away; stopping at midnight
matches how time is counted ("Time counts on the day it was worked").

**Rejected:** a separate "add break" for stopped entries: see "Time away is a gap or an added break". Editing start and
end with the clock alone: it shows one time, not the entry and its neighbours. A break typed as a length on a stopped
entry: a from–to on the line places it where it happened. A line showing the whole day: most of it is empty, and the
entry is small in it.

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
- 22:00–23:30, right handle dragged toward 00:30: it stops at midnight; the half hour after is a new entry on the next
  day.
- Entry Tuesday 22:00 to Wednesday 01:00, opened on Tuesday: the line shows its part up to midnight, and only the start
  handle moves.
- Entry Tuesday 22:00 to Wednesday 01:00, opened on Wednesday and moved to another profile: both parts move, Tuesday's
  22:00–24:00 and Wednesday's 00:00–01:00.
- Running entry: the right handle is now and does not move.
- Cancel after dragging: the entry is unchanged.

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
