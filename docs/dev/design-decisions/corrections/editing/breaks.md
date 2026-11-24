# Corrections: editing, the break

How an entry's break is set in its edit, and how it is shared between the parts of a divided entry. The popup and gaps
each have their own file beside this one. Each decision follows the template in `../../README.md`, and is cited by its
title.

## An edited entry's break (2026-11-24)

**Built by:** Corrections.

**Decision:** the break's control in the edit is its "paus" tag after the times under the day ("Editing an entry on its
line"): clicked, it opens a length field in its place, as the field under "Lägg till paus" does; Enter or a click away
keeps it, and Esc leaves it as it was; a length longer than the time its part keeps is refused, its text red and the
field left open, until it is fixed or Esc drops it; a part with no break shows a quiet "Lägg till paus" where its tag
would be, or "+ paus" if the longer words do not fit. A break set there comes off as any added break does: the entry's
last day first, the rest the day before ("Time away is a gap or an added break"). The break is a wall too: a handle
stops where the time kept could no longer hold the break, and while a handle sits at that limit the tag that holds it is
red, text and border. An entry divided in two ("A gap divides an entry"), at the click that makes the gap, carries its
break whole on the larger part if it fits there; if not, the break fills the larger part and the rest goes to the other.
Each part owns its own break, as each is saved as an entry of its own: its tag shows and sets that part's break alone,
never the sum, and a part with none offers its own "Lägg till paus". While neither tag has been set, the split is the
app's: a drag leaves the break where it is while it fits, and only what no longer fits spills to the other part,
following the handle through its snaps and steps, so a part may hold nothing but break and read 0:00; the wall is then
the two parts together. A length kept in either tag, by Enter or a click away, sets both parts' breaks where they stand,
even a length unchanged; Esc sets nothing. From then on neither spills, and the wall holds per part. With the gap filled
by another profile, the parts' tags show grey and cannot be clicked, since the parts are no longer what is in colour,
and the new entry has no break until it is saved and opened again; breaks not yet set still spill as its edges are
dragged. When the gap is left, the break is the parts' sum and no longer set, so a new gap splits it afresh. Joined with
a neighbour, the tag shows the breaks' sum.

**Why:** a break found after stop is set where the entry is fixed, seeing the whole entry. Each part owning its break
matches what a save makes, an entry per part with its own break, and the number clicked is the number in the field. The
app moves only numbers it chose, never one the owner typed: its split follows the drag, and a length set stays. A break
left where it fits, with only the overflow spilling, never jumps between the parts mid-drag. A 0:00 part is what its
times say, and never reaches the report.

**Rejected:** a separate "add break" for stopped entries on the main screen: see "Time away is a gap or an added break".
A part's tag opening a field on the whole break: "paus 15min" clicked showed the sum, a number that was in neither the
tag nor the saved entries. Dropping "Lägg till paus" on the controls side, now that the editor sets a running entry's
break: an edit takes a reason and marks the entry "e", and a break taken during the day is recording, not a correction;
the button is the one way to add a break without that mark. The larger part taking the whole break again on every drag:
the break jumped between the parts as they passed each other, and flickered while they were equal. A share in proportion
to the parts' lengths: it jumped from one part to both the moment the break stopped fitting. A least worked time on each
part, so none reads 0:00: a made-up number, and a break shown where none was taken. A set break still spilling: a typed
length would no longer be the last word. A length typed in one part's tag taking the difference from the other, to keep
the sum: it changed a number not touched. A break found afterwards only as a gap cut on the line: a break needs only its
length, so it is set the same way whether the entry runs or not. The editor showing the stretch with no word of its
break: its length then disagreed with the list's, with nothing saying why. The break shrunk to fit when a handle
shortens the entry: it changed what was not touched; the handle stops instead. A brief flash of the tag at the limit:
easy to miss mid-drag. The length beside the times, with the break after a minus ("4:12 − paus 20min"): it disagreed
with the list's counted time, needed the minus to explain why, and vanished once the entry was divided.

**Cases:**

- 10:00–11:00, "90" typed in the break's field and Enter: refused, the text red, the field still open.
- 08:00–12:00 with no break, divided into 08:00–10:00 and 10:30–12:00: each part shows its own "Lägg till paus".
- 08:00–12:00 with a 1 h 15 min break, divided into 08:00–10:00 and 10:30–11:30: the 2 h part carries it whole, "paus 1h
  15min"; the other has "Lägg till paus".
- Parts 08:00–10:00 with 1 h and 10:30–11:00 with 15 min, the 15 min tag clicked: the field holds 15, not 1:15; "20"
  typed and Enter: that part 20 min, the other still 1 h.
- Parts 08:00–10:00 and 10:30–11:00, "45" typed in the second part's field and Enter: refused, longer than its 30 min.
- 08:00–12:00 with a 1 h break, the gap made at 09:50–10:00: 10:00–12:00 carries it whole; no tag set, the gap's right
  edge dragged to 11:30: 11:30–12:00 holds 30 min, 08:00–09:50 the other 30, each step of the snap moving 5 min.
- 08:00–10:00 with a 1 h break, the gap made at 08:40–08:45, its right edge dragged to 09:20 with no tag set:
  09:20–10:00 holds 40 min and reads 0:00, 08:00–08:40 holds 20.
- The gap 09:50–10:00 on 08:00–12:00 with a 1 h break, the right part's tag kept at "1h" unchanged: the right edge
  dragged right stops at 11:00, that tag red; nothing spills.
- A tag opened, then Esc: nothing set, and the next drag still spills.
- The gap 09:50–10:00 on 08:00–12:00 with a 20 min break, filled by another profile: "paus 20min" on 10:00–12:00, grey
  and not clickable; the new entry has none.
- That gap filled, no tag set, a 1 h break, its right edge dragged to 11:30: 30 min spills to 08:00–09:50, both tags
  grey.
- The gap 09:50–10:00, both tags set, its edges let go together: "paus 1h" on the whole entry, nothing set; a new gap at
  10:00–10:10: 08:00–10:00 is the larger part and carries it whole.

- Tuesday 22:00 to Wednesday 00:45, its break raised in the edit from 3 min to 1 h: Wednesday 0, Tuesday 1:45.
