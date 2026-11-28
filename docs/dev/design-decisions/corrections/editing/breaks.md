# Corrections: editing, the break

How an entry's break is set in its edit, and how it is shared between the parts of a divided entry. The popup and gaps
each have their own file beside this one. Each decision follows the template in `../../README.md`, and is cited by its
title.

## An edited entry's break (2026-11-26)

**Decision:** the break's control in the edit is its "paus" tag after the times under the day ("Editing an entry on its
line"): clicked, it opens a length field in its place, as the field under "Lägg till paus" does, wearing the tag's own
border and as wide as what it holds ("00:00" while empty), so it reads as the tag being typed in; Enter keeps it, and
Esc or a click away drops it, leaving it as it was. While the field is open the edit's "Spara" is greyed, and it stays
greyed through the press that drops the field, lighting only once that press is let go, so a press on it never saves a
break not kept and what shows is always what is saved; a length longer than the time its part keeps is refused, its text
red and the field left open, until it is fixed or Esc drops it; a part with no break shows "Lägg till paus" where its
tag would be, or "+ paus" if the longer words do not fit, drawn as the "paus" tag, in its size, text colour and border.
Every tag that can be clicked lights its border to the text colour under the pointer, a red one and one that cannot be
clicked aside; the menu's "Skatt och avgifter" is drawn as this tag too, so a tag reads the same in the edit and the
menu. A break set there comes off as any added break does: the entry's last day first, the rest the day before ("Time
away is a gap or an added break"). The break is a wall too: a handle stops where the time kept could no longer hold the
break, and while a handle sits at that limit the tag that holds it is red, text and border. An entry divided in two ("A
gap divides an entry"), at the click that makes the gap, carries its break whole on the larger part if it fits there; if
not, the break fills the larger part and the rest goes to the other. Each part owns its own break, as each is saved as
an entry of its own: its tag shows and sets that part's break alone, never the sum, and a part with none offers its own
"Lägg till paus". While neither tag has been set, the split is the app's: a drag leaves the break where it is while it
fits, and only what no longer fits spills to the other part, following the handle through its snaps and steps, so a part
may hold nothing but break and read 0:00; the wall is then the two parts together. A length kept in either tag, by
Enter, sets both parts' breaks where they stand, even a length unchanged; Esc sets nothing. From then on neither spills,
and the wall holds per part. With the gap filled by another profile, the parts' tags show grey and cannot be clicked,
since the parts are no longer what is in colour, and the new entry has no break until it is saved and opened again;
breaks not yet set still spill as its edges are dragged. When the gap is left, the break is the parts' sum and no longer
set, so a new gap splits it afresh. Joined with a neighbour, the tag shows the breaks' sum.

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
