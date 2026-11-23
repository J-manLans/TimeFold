# Corrections: editing

How an entry is put right on its line: the edit popup, its handles, gaps and break. Each decision follows the template
in `../README.md`, and is cited by its title.

## Editing an entry on its line (2026-11-14)

**Built by:** Corrections.

**Decision:** an entry is chosen from the list under the flex bar and the ceiling wheel (earlier days from the popup
"Visa alla" opens) and opens in an edit popup of its own, centred, 480 px wide, a little narrower than the list's: from
"Senaste" alone, over the dimmed screen; from "Visa alla" on top of the list, which dims a little further (25% black)
and keeps its place and the chosen row outlined, so closing the edit comes back to it. Resting the pointer on the list
behind, outside the edit, is a peek: after a quarter second (at once in Stilla) the edit fades to 20% and the extra
dimming lifts, so the list reads through; moving back onto the edit brings it back. A dragged handle keeps the pointer
on the line, so a drag never peeks. A click outside the edit cancels it, as "Avbryt" and Esc do and as any popup closes,
nothing saved: from the list it comes back to the list, so while peeking one click returns to the list and the next
opens the row wanted. Esc cancels the edit before the next one closes the list. In the popup the entry shows as a line
centred on the entry, with a round handle at its start and its end, the same knob the colour picker drags, in the neon
of the profile in colour, and a little time either side; docked to a neighbour, the shared point has one handle. The
view holds still while a handle is dragged and refits after ("The line's view holds still while a handle is dragged"),
and a handle is set roughly by dragging and exactly by the minute ("A clicked handle steps by the minute"); the only
hard stops are another entry, of any profile, shown as blocked time when in view, and now. A neighbour of the same
profile is docked to and can be joined ("Two entries join by docking"). Moving one handle outward adds time at that end,
and inward takes it away. Moving both outward adds at both ends; moving both the same way moves the entry, its length
unchanged. Moving both inward shortens the entry by default, removing both ends; a click on the middle, where the
pointer shows it can be clicked, makes it a gap instead, removing the middle and splitting the entry in two, its time
nobody's, as between a stop and a later start; a second click shortens again. A gap lasts only while both handles are
inward or another profile fills it; once neither holds, moving both inward shortens again, so an old gap never comes
back unasked. With a gap, the profile picker fills it: another profile picked makes the middle a new entry of that
profile between the two parts, and the entry's own profile picked empties it again; with no gap, the picker moves the
whole entry. Each control undoes only its own work: a filled middle is a new entry, not a gap, so it shows no pointer
and a click on it does nothing; the picker empties it first. Dragged to an edge of the entry, the new entry takes that
end and the part on that side goes; its handles go on past the edges as any handle does, to the next entry or now, the
time beyond the old edge green as added. Dragged over both edges, the whole entry is the other profile's, unless the
entry's break holds a part back; the picker with no gap moves the whole entry, its break with it, in one step. A switch
between a gap and a shortening that the break cannot fit in is refused, and so is a profile picked that it cannot fit
in, as when the switch lets go of a neighbour it touched; the tag shows why, red until the next change. Colour shows the
change, and the line's colour is always what is being edited: the entry in its own colour, green for time added, red for
time taken away; a shortening shows red ends, a gap a red middle, and green never appears there. A gap filled by another
profile wears that profile's colour, and the two parts turn grey, as any neighbour on the line. No handle can be dragged
into another entry or past now. Midnight is no stop: the line edits the stored stretch, so an entry across midnight
opens whole, whichever day it was chosen from, and either handle crosses midnight freely; the counting still splits it
there ("Time counts on the day it was worked"). A running entry is edited at its start and profile only ("A running
entry is edited at its start"). The line also shows the entry's profile, which can be changed there to move the whole
entry, times unchanged, to another profile ("Every edit carries a reason"); an entry across midnight changes profile as
one, both days' parts together. The picker always names the profile in colour, and offers every profile but archived
ones, the entry's own included. Under the day, the result reads in words: its times, then its break as the list's "paus"
tag, with no length, so no figure there can disagree with the list's counted time ("07:58–12:10 paus 20min"). Divided,
it shows each part's times and tag, set apart by a centred dot, in white while the parts are the entry's own; with the
gap filled by another profile the text follows the line: the parts grey, and the new entry's time, with no name, in that
profile's base colour ("08:00–10:00 paus 20min · 10:00–10:40 · 10:40–12:00"); the centred dot appears only between
entries. The tag is the break's control: clicked, it opens a length field on the whole break, as the field under "Lägg
till paus" does; Enter or a click away keeps it, and Esc leaves it as it was; a length longer than the time kept is
refused, its text red and the field left open, until it is fixed or Esc drops it; with no break, a quiet "+ paus" offers
one. A break set there is the entry's one break, and comes off as any added break does: the entry's last day first, the
rest the day before ("Time away is a gap or an added break"). The break is a wall too: a handle stops where the time
kept could no longer hold it, and while a handle sits at that limit the tag is red, text and border. An entry divided in
two carries its break whole on the larger part if it fits there; if not, the break fills the larger part and the rest
goes to the other; each part shows its own tag. With the gap filled by another profile, the parts' tags show grey and
cannot be clicked, since the parts are no longer what is in colour, and the new entry has no break until it is saved and
opened again. Joined, the tag shows the breaks' sum. The colours are a preview: nothing changes until the owner
confirms, and a cancel leaves the entry as it was.

**Why:** the owner adds breaks during the day; one found after stop, a late start, an early end or the wrong profile are
all fixed in the same place, seeing the whole entry and the time around it. A handle that cannot reach a clash needs no
error message. Centring on the entry keeps the view small when the nearest neighbour is days away. One popup for both
ways in keeps the edit the same everywhere: a fix from "Senaste" needs no detour through the list, and from the list the
popup gives the line room of its own while the list keeps the owner's place for the next fix. The peek shows the list
without leaving the edit, as resting on the ceiling wheel's band shows its hidden lap. With no wall at midnight, an
entry stopped the morning after is shortened back to the evening before in one drag, the way "A running entry from an
earlier day asks" sends the owner to correct it.

**Rejected:** a separate "add break" for stopped entries on the main screen: see "Time away is a gap or an added break".
Editing start and end with the clock alone: it shows one time, not the entry and its neighbours. A break found
afterwards only as a gap cut on the line: a break needs only its length, so it is set the same way whether the entry
runs or not. The editor showing the stretch with no word of its break: its length then disagreed with the list's, with
nothing saying why. The break shrunk to fit when a handle shortens the entry: it changed what was not touched; the
handle stops instead. A gap by default: a break found afterwards now has the tag, so a gap is rarer than a shortening. A
row of choices under the line (shorten, gap, another profile), with no default and the confirm waiting on one: a row of
controls and a click for an edit the line already previews. A hint in words on the middle ("klicka: hål"): cryptic to a
newcomer; the pointer is enough. The head's picker greyed while a gap holds another profile: with the colour rule it
names what is in colour, so it never means two things at once. Writing a forgotten entry over an existing one, cutting
its way in: the line's wall at other entries would have one exception, and a gap filled by another profile does the same
from inside the entry. A brief flash of the tag at the limit: easy to miss mid-drag. The length beside the times, with
the break after a minus ("4:12 − paus 20min"): it disagreed with the list's counted time, needed the minus to explain
why, and vanished once the entry was divided. A line showing the whole day: most of it is empty, and the entry is small
in it. The edit inside the "Visa alla" popup, above the list: it had to be reached through the list from "Senaste" too,
and shared the list's room. The edit placed beside the chosen row instead of centred: it would flip above or below by
where the row sits, the window's height and the scroll, many cases for little gain. A click on the list behind switching
the edit to that entry, even with nothing changed: closing and clicking the row is two short clicks, and keeps the app's
language clear. A click outside doing nothing, to keep a stray click from losing a drag: the edit would be the one popup
a click outside does not close, and an unsaved edit is quick to redo. Midnight as a wall, each day's part edited from
its own day: an entry stopped the morning after could not be pulled back across midnight from either day, and the
counting splits at midnight without the editor's help. Handles as thin bars: a circle reads as a knob to drag, and every
drag knob in the app is the same one.

**Revisit if:** fixing an entry takes more clicks than the owner's Excel did.

**Cases:**

- That gap filled, a 20 min break on the entry: "paus 20min" on 08:00–10:00, grey and not clickable; the new entry has
  none.

- 22:00–23:30, right handle dragged to 00:30: 22:00–00:30, one entry, counted 2 h on the first day and 30 min on the
  next.
- Entry Tuesday 22:00 to Wednesday 01:00, opened on Tuesday or on Wednesday: the line shows the whole entry, and both
  handles move.
- Entry Tuesday 21:30 to Wednesday 07:00, stopped the morning after, right handle dragged back to Tuesday 23:10:
  21:30–23:10 on Tuesday.
- Entry Tuesday 22:00 to Wednesday 01:00, moved to another profile: the whole entry moves, Tuesday's 22:00–24:00 and
  Wednesday's 00:00–01:00.

- Cancel after dragging: the entry is unchanged.
- 07:58–12:10 with a 20 min break: "07:58–12:10 paus 20min".

- 10:00–11:00, "90" typed in the break's field and Enter: refused, the text red, the field still open.

- Tuesday 22:00 to Wednesday 00:45, its break raised in the edit from 3 min to 1 h: Wednesday 0, Tuesday 1:45.
