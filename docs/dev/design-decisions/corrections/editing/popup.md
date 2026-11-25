# Corrections: editing, the popup

The edit popup and the entry on its line: how it opens and closes, its handles and stops, shortening, colours and the
result in words. Gaps and the break each have their own file beside this one. Each decision follows the template in
`../../README.md`, and is cited by its title.

## Editing an entry on its line (2026-11-14)

**Decision:** an entry is chosen from the list under the flex bar and the ceiling wheel (earlier days from the popup
"Visa alla" opens) and opens in an edit popup of its own, centred, 480 px wide, a little narrower than the list's: from
"Senaste" alone, over the dimmed screen; from "Visa alla" on top of the list, which dims a little further (25% black)
and keeps its place and the chosen row outlined, so closing the edit comes back to it. After a save from there, the
saved entry's row stays outlined, the list scrolled to it only if it is out of view, until another row opens or the list
closes. Resting the pointer on the "Visa alla" card behind, outside the edit, is a peek: after a quarter second (at once
in Stilla) the edit fades to 20% and the extra dimming lifts, so the list reads through; moving back onto the edit, or
onto the scrim around the card, brings it back. The scrim is no peek, so the way out of the window never fades the edit.
A dragged handle keeps the pointer on the line, so a drag never peeks. A click outside the edit cancels it, as "Avbryt"
and Esc do and as any popup closes, nothing saved: from the list it comes back to the list, so while peeking one click
returns to the list and the next opens the row wanted. Esc cancels the edit before the next one closes the list. In the
popup the entry shows as a line centred on the entry, with a round handle at its start and its end, the same knob the
colour picker drags, in the neon of the profile in colour, and a little time either side; docked to a neighbour, the
shared point has one handle. The view holds still while a handle is dragged and refits after ("The line's view holds
still while a handle is dragged"), and a handle is set roughly by dragging and exactly by the minute ("A clicked handle
steps by the minute"); the only hard stops are another entry, of any profile, shown as blocked time when in view, and
now. A neighbour of the same profile is docked to and can be joined ("Two entries join by docking"). Moving one handle
outward adds time at that end, and inward takes it away. Moving both outward adds at both ends; moving both the same way
moves the entry, its length unchanged. Moving both inward shortens the entry by default, removing both ends; a click on
the middle, where the pointer shows it can be clicked, makes it a gap instead ("A gap divides an entry"). Colour shows
the change, and the line's colour is always what is being edited: the entry in its own colour, green for time added, red
for time taken away; a shortening shows red ends, and green never appears there. No handle can be dragged into another
entry or past now. Midnight is no stop: the line edits the stored stretch, so an entry across midnight opens whole,
whichever day it was chosen from, and either handle crosses midnight freely; the counting still splits it there ("Time
counts on the day it was worked"). A running entry is edited at its start and profile only ("A running entry is edited
at its start"). The line also shows the entry's profile, which can be changed there to move the whole entry, times
unchanged, to another profile ("Every edit carries a reason"); an entry across midnight changes profile as one, both
days' parts together. The picker always names the profile in colour, and offers every profile but archived ones, the
entry's own included; with no gap, it moves the whole entry, its break with it, in one step, and a profile it cannot fit
in is refused, the tag showing why, red until the next change; one that would touch a running entry of that profile is
greyed ("A running entry is edited at its start"). A profile that makes the entry touch a neighbour of it takes the
neighbour in ("Two entries join by docking"). Under the day, the result reads in words: its times, then its break as the
list's "paus" tag ("An edited entry's break"), with no length, so no figure there can disagree with the list's counted
time ("07:58–12:10 paus 20min"). The colours are a preview: nothing changes until the owner confirms, and a cancel
leaves the entry as it was.

**Why:** the owner adds breaks during the day; one found after stop, a late start, an early end or the wrong profile are
all fixed in the same place, seeing the whole entry and the time around it. A handle that cannot reach a clash needs no
error message. Centring on the entry keeps the view small when the nearest neighbour is days away. One popup for both
ways in keeps the edit the same everywhere: a fix from "Senaste" needs no detour through the list, and from the list the
popup gives the line room of its own while the list keeps the owner's place for the next fix. The peek shows the list
without leaving the edit, as resting on the ceiling wheel's band shows its hidden lap. With no wall at midnight, an
entry stopped the morning after is shortened back to the evening before in one drag, the way "A running entry from an
earlier day asks" sends the owner to correct it.

**Rejected:** a save from "Visa alla" closing with nothing outlined: the eye had to find where the change went. The
whole area outside the edit as the peek, the scrim around "Visa alla" included: the way out of the window crosses it,
and faded the edit. Editing start and end with the clock alone: it shows one time, not the entry and its neighbours. A
line showing the whole day: most of it is empty, and the entry is small in it. The edit inside the "Visa alla" popup,
above the list: it had to be reached through the list from "Senaste" too, and shared the list's room. The edit placed
beside the chosen row instead of centred: it would flip above or below by where the row sits, the window's height and
the scroll, many cases for little gain. A click on the list behind switching the edit to that entry, even with nothing
changed: closing and clicking the row is two short clicks, and keeps the app's language clear. A click outside doing
nothing, to keep a stray click from losing a drag: the edit would be the one popup a click outside does not close, and
an unsaved edit is quick to redo. Midnight as a wall, each day's part edited from its own day: an entry stopped the
morning after could not be pulled back across midnight from either day, and the counting splits at midnight without the
editor's help. Handles as thin bars: a circle reads as a knob to drag, and every drag knob in the app is the same one.

**Revisit if:** fixing an entry takes more clicks than the owner's Excel did.

**Cases:**

- Entry Tuesday 22:00 to Wednesday 01:00, opened on Tuesday or on Wednesday: the line shows the whole entry, and both
  handles move.
- Entry Tuesday 21:30 to Wednesday 07:00, stopped the morning after, right handle dragged back to Tuesday 23:10:
  21:30–23:10 on Tuesday.

- Cancel after dragging: the entry is unchanged.
- 07:58–12:10 with a 20 min break: "07:58–12:10 paus 20min".
