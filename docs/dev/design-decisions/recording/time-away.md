# Recording: time away

How time away from work is recorded: gaps, added breaks, and typing a length. Each decision follows the template in
`../README.md`, and is cited by its title.

## Time away is a gap or an added break (2026-11-14)

**Decision:** time away is recorded in one of two ways, and both count on the day it happens ("Time counts on the day it
was worked"). A planned break is a stop and a later start: the gap between them is not work, and falls on whichever day
it falls on. Time away that happens during a running entry, unplanned (such as own errands slipped into a work errand),
is an **added break**: a length of time taken off an entry, added when back, with a quiet "add break" control. An added
break holds its length and the day it was added, not when it happened. It comes off its entry's time on that day first,
and any rest off the entry's time on the day before, since midnight only cuts the counting, not the stretch. It goes to
the running entry of the profile on screen. Its field holds that entry's whole break: it opens on what is there so far
("20", "1:20"), selected so typing replaces it, or empty with none, and Enter sets the new total. A higher number adds
the difference, dated the day it is added, to that day's break: an entry holds at most one break per day; a lower one
takes time back, off the latest break first, and 0 takes it all; the same number changes nothing. The control is always
shown, so the app always shows what it can do; it is active only while that entry runs, and greyed out otherwise. A
break found after the entry has stopped is set in the entry's edit popup, through the "paus" tag after its times, dated
the day the entry stops ("Editing an entry on its line"). The total cannot be longer than its whole entry so far: the
field then reads "för lång paus" and stays open. Stopping the entry with the field open is a click away: what is typed
is kept, then the entry stops. The five most recent entries, whatever their day, are listed under the flex bar and the
ceiling wheel, with their added breaks as small tags among them, and "Visa alla" under the list opens the history. A tag
is a label: clicking it does what clicking its row does. A break added by mistake is taken back with the undo while it
is the latest click ("The last click can be undone for a few seconds"); after that, a break is changed or removed on its
entry's line.

**Why:** the owner's errands are often unplanned, and the owner notes breaks during the day when back, as in the Excel
file today, so the day added places a break in the stretch it belongs to. An "add break" that stays active after stop
would make the owner wonder whether work is still running. A hasty mistake must be fixed where it is seen, not dug out
of an editor.

**Rejected:** each press adding a break of its own, the field empty every time: the owner had to add up in their head,
and a slip noticed after the undo's seconds had no way back while the entry ran. Each raise of the total stored as a
break of its own: two breaks on one day count as their sum, so the split said nothing and left a correction a list to
walk. A tag opening the length field on its row, to change or remove the break: the row is too thin for the field's
reading, the tag would fight the row's own click, and every tag is on a stopped entry, whose changes are corrections
with a reason. A slider for the break's length: a break holds no place in its entry to drag. Start-break and end-break
clicks: a stop and a start do the same with no new control, and an unplanned break cannot be clicked as it happens.
Recording when an added break happened: the day is enough. Splitting a running entry into two stored entries at
midnight: the running entry would restart each day, and the question for a running entry from an earlier day would never
be asked. Adding a break to a stopped entry from this control: it blurs whether work is running, and the entry's line
does it better.

**Revisit if:** the report needs breaks shown by time or kind.

**Cases:**

- Entry 08:00–12:00 with a 45 min added break: 3 h 15 min.
- Nothing running on the profile on screen: "add break" is shown, greyed out.
- A running, B on screen: "add break" is greyed out.
- A 5 h break on an entry that has run 2 h: refused; the field reads "för lång paus".
- The field open with "30" typed, "Stoppa jobb" pressed: the break becomes 30 min, the field closes and the job stops.
- The field open with "30" typed, a click elsewhere: the break becomes 30 min; Esc instead: it stays as it was.
- Entry Tuesday 22:00 to Wednesday 01:00, 30 min break added at 00:30 while it runs: Tuesday 2 h, Wednesday 30 min.
- Entry running since Tuesday 22:00, 45 min break added at Wednesday 00:20: Wednesday 0, Tuesday 1 h 35.
- Stop Tuesday 23:30, start Wednesday 00:15: the gap counts on neither day, with no special rule; Tuesday ends at 23:30,
  Wednesday starts at 00:15.
- A break changed from 45 to 35 min: the entry's worked time grows by 10 min.
- 20 min of break so far, "Lägg till paus": the field opens on "20", selected; 30 typed and Enter: the break is 30 min,
  the 10 added dated today.
- 20 min so far, 10 typed: the break is 10 min. 0 typed: no break.
- 20 min added Monday, 25 more Monday: one break of 45 min dated Monday. 15 more Tuesday: a second break, 15 min dated
  Tuesday.
- Running since Tuesday 22:00, 30 min added Tuesday and 15 min Wednesday, 30 typed on Wednesday: Wednesday's 15 comes
  off, Tuesday's 30 stays.

## Entering a length of time (2026-11-14)

**Decision:** a length of time, such as an added break, is typed into one field: a plain number is minutes ("45"), and
hours and minutes are written "1:20". Only digits and `:` are taken, and only in that shape: up to three digits of
minutes alone, or two of hours and two of minutes, the minutes at most 59; a sign, a letter or a keystroke that breaks
the shape does not appear. The empty field shows "00:00". While typing, how it reads the input shows just under the
field ("1h 20min"), so the field itself stays where it is; the break's field in an edit shows none, since it sits inside
its "paus" tag, which reads it once kept. Every length the app writes in words is written this way, the unit against its
number: "5min", "23h 20min", "paus 20min", "+20h". Enter, or a click away, keeps it; Esc alone cancels. A length that
cannot be kept, such as a break longer than its entry, is refused: the field stays open with its warning until it is
fixed or Esc drops it. The field has no buttons. The clock picker is for times of day only.

**Why:** one short field is the least fuss, and "1:20" is how the owner writes a length in Excel. Showing the reading
catches a hasty mistake before it is saved. A click away keeping, as leaving a cell in Excel does, means nothing typed
is lost by accident, and a click straight on a confirm such as "Spara" keeps what was just written; a stray click is
caught by the undo, or by an edit's own confirm.

**Rejected:** separate hour and minute fields: more to fill in. "Lägg till" and "Avbryt" buttons beside the field: Enter
and Esc do the same with less on screen. The clock picker: it picks a time of day, not a length. A click away
cancelling: a click straight on "Spara" would first drop what was typed, and a break typed in an edit would be saved as
it was, with nothing said. A length too long capped at the most it can be: a typo would become a real break, with the
entry counting nothing, unseen.

**Revisit if:** typed lengths are often misread.

**Cases:**

- "45": 45 min.
- "1:20": 80 min, shown as "1h 20min".
- "5", "05" and "0:05": 5 min, shown as "5min".
- "-5" or "1h": the sign and the letter do not appear. "1:205": the third minute digit does not appear. "1:7": the 7
  does not appear.
