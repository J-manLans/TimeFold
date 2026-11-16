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
not move. The colours are a preview: nothing changes until the owner confirms, and a cancel leaves the entry as it was.

**Why:** the owner adds breaks during the day; one found after stop, a late start or an early end are all fixed in the
same place, seeing the whole entry and the time around it. A handle that cannot reach a clash needs no error message.
Centring on the entry keeps the view small when the nearest neighbour is days away; stopping at midnight matches how
time is counted ("Time counts on the day it was worked").

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
- Running entry: the right handle is now and does not move.
- Cancel after dragging: the entry is unchanged.

## Entries remember how they were made (2026-11-14)

**Built by:** Corrections, for written and edited entries.

**Decision:** every entry keeps one mark of how it was made: clicked, written by hand, or edited after it was recorded.
The mark is stored from the first entry. Showing it in the report is not decided; see "Corrected entries in the report",
in `codebase-ideas.md`.

**Why:** honesty in reporting: the boss can trust that a time set by hand is known to be one. Stored from the start, the
mark is right for every entry; added later, it would be missing on all entries before it.

**Rejected:** no mark: the record could not tell a click from a guess. Keeping every edit's old times: more than honesty
needs, for a report the boss reads at a glance.

**Revisit if:** the boss asks to see what an edit changed.

**Cases:**

- Start and stop clicked: the entry is marked clicked.
- An entry's start dragged on its line and confirmed: it is marked edited.
- A forgotten entry written afterwards: it is marked written by hand.
