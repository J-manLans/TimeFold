# Recording: time away

How time away from work is recorded: gaps, added breaks, and typing a length. Each decision follows the template in
`../README.md`, and is cited by its title.

## Time away is a gap or an added break (2026-11-14)

**Built by:** Breaks and flex days, for the added break.

**Decision:** time away is recorded in one of two ways, and both count on the day it happens ("Time counts on the day it
was worked"). A planned break is a stop and a later start: the gap between them is not work, and falls on whichever day
it falls on. Time away that happens during a running entry, unplanned (such as own errands slipped into a work errand),
is an **added break**: a length of time taken off an entry, added when back, with a quiet "add break" control. An added
break holds its length and the day it was added, not when it happened. It comes off its entry's time on that day first,
and any rest off the entry's time on the day before, since midnight only cuts the counting, not the stretch. It goes to
the running entry of the profile on screen. The control is always shown, so the app always shows what it can do; it is
active only while that entry runs, and greyed out otherwise. A break found after the entry has stopped is an edit on the
entry's line ("Editing an entry on its line"). It cannot be longer than its whole entry. The five most recent entries,
whatever their day, are listed under the flex bar and the ceiling wheel, with their added breaks as small tags among
them, and "Visa alla" under the list opens the history. A tag is a label: clicking it does what clicking its row does. A
break added by mistake is taken back with the undo while it is the latest click ("The last click can be undone for a few
seconds"); after that, a break is changed or removed on its entry's line.

**Why:** the owner's errands are often unplanned, and the owner notes breaks during the day when back, as in the Excel
file today, so the day added places a break in the stretch it belongs to. An "add break" that stays active after stop
would make the owner wonder whether work is still running. A hasty mistake must be fixed where it is seen, not dug out
of an editor.

**Rejected:** a tag opening the length field on its row, to change or remove the break: the row is too thin for the
field's reading, the tag would fight the row's own click, and every tag is on a stopped entry, whose changes are
corrections with a reason. A slider for the break's length: a break holds no place in its entry to drag. Start-break and
end-break clicks: a stop and a start do the same with no new control, and an unplanned break cannot be clicked as it
happens. Recording when an added break happened: the day is enough. Splitting a running entry into two stored entries at
midnight: the running entry would restart each day, and the question for a running entry from an earlier day would never
be asked. Adding a break to a stopped entry from this control: it blurs whether work is running, and the entry's line
does it better.

**Revisit if:** the report needs breaks shown by time or kind.

**Cases:**

- Entry 08:00–12:00 with a 45 min added break: 3 h 15 min.
- Nothing running on the profile on screen: "add break" is shown, greyed out.
- A running, B on screen: "add break" is greyed out.
- A 5 h break on an entry that has run 2 h: refused.
- Entry Tuesday 22:00 to Wednesday 01:00, 30 min break added at 00:30 while it runs: Tuesday 2 h, Wednesday 30 min.
- Entry running since Tuesday 22:00, 45 min break added at Wednesday 00:20: Wednesday 0, Tuesday 1 h 35.
- Stop Tuesday 23:30, start Wednesday 00:15: the gap counts on neither day, with no special rule; Tuesday ends at 23:30,
  Wednesday starts at 00:15.
- A break changed from 45 to 35 min: the entry's worked time grows by 10 min.

## Entering a length of time (2026-11-14)

**Built by:** Breaks and flex days.

**Decision:** a length of time, such as an added break, is typed into one field: a plain number is minutes ("45"), and
hours and minutes are written "1:20". Only digits and `:` are taken, and only in that shape: up to three digits of
minutes alone, or two of hours and two of minutes, the minutes at most 59; a sign, a letter or a keystroke that breaks
the shape does not appear. The empty field shows "00:00". While typing, how it reads the input shows just under the
field ("1h 20min"), so the field itself stays where it is. Every length the app writes in words is written this way, the
unit against its number: "5min", "23h 20min", "paus 20min", "+20h". Enter confirms; Esc, or clicking away, cancels. The
field has no buttons. The clock picker is for times of day only.

**Why:** one short field is the least fuss, and "1:20" is how the owner writes a length in Excel. Showing the reading
catches a hasty mistake before it is saved.

**Rejected:** separate hour and minute fields: more to fill in. "Lägg till" and "Avbryt" buttons beside the field: Enter
and Esc do the same with less on screen. The clock picker: it picks a time of day, not a length.

**Revisit if:** typed lengths are often misread.

**Cases:**

- "45": 45 min.
- "1:20": 80 min, shown as "1h 20min".
- "5", "05" and "0:05": 5 min, shown as "5min".
- "-5" or "1h": the sign and the letter do not appear. "1:205": the third minute digit does not appear. "1:7": the 7
  does not appear.
