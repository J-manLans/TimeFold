# Corrections: the line

How the entry line shows time and how exactly a handle is set: its view and its steps. Each decision follows the
template in `../README.md`, and is cited by its title.

## The line's view holds still while a handle is dragged (2026-11-25)

**Decision:** the entry line shows what is being edited, the entry as it was and as it is becoming, centred and filling
65% of the line. While a handle is dragged the view does not change, and the handle follows the pointer at the line's
scale, past the view's ends too and out of sight past the popup's edges, snapping and stopping at the walls as anywhere
on the line; the times above the line read where it is. The entries and the hairline run on past the view's ends at the
same scale out to the popup's edges, which cut them: nothing on the line makes the popup scroll sideways, though it may
still grow in height. Each time a handle is let go, or a minute is stepped, the view eases, at the interface's speed (at
once in Stilla), to that fit again, growing or shrinking, so the line always looks the same. A neighbour taken in is
part of the entry and fitted with it; one only docked, while a handle is held, runs off the edge as any other entry
does, and the joined result is spelled out under the day. While the entry still overlaps where it started, the view
holds the original too, so a shortened entry shows where it began; once it has left its original altogether, or never
had one, the view fits the entry alone. The scale under the line shows at most eight labels, in the smallest unit and
step that fits: minutes every 5, 10, 15 or 30 ("10:05"); hours every 1, 2, 3, 6 or 12 ("08", midnight as its day,
"tor"); days every 1 or 2 ("tor 20"); weeks, on Mondays ("v. 47"); months every 1, 3 or 6 ("nov", January as its year,
"2027"); years every 1, 2, 5 or 10, and wider steps beyond.

**Why:** a view that changes under a dragged handle changes the time the pointer reads, which moves the handle and so
the view again: it ran away growing or shrinking, and every patch on it added a feel to learn. Held still, the line
never moves under the hand, and the refit comes when the hand is off it. Refitting every time, to one share, makes the
line look the same after every move; a third of the line left free gives each drag room. A scale that changes unit keeps
its labels apart however wide the view, with no special stop for the first or last entry. Under the pointer past the
view's ends, a short entry grows in one drag, and the times say where the handle is while it is out of sight. Drawn out
to the popup's edges, an entry cut by the view reads as running on.

**Rejected:** zooming during the drag, in any form: fixed widths like the flex bar's scales with a gap between growing
and shrinking, the far side held still, or the handle kept under the pointer while the view zoomed; each fought the
hand. Panning at the edge with the scale fixed: it keeps the hand on a moving line. Refitting only when needed, near an
edge or once the entry had shrunk: the line sometimes moved and sometimes not, and a fitted entry looked small. A scale
of hours only: over days its labels ran together. A view never narrower than an hour: a short entry was a sliver, and
the minutes on the scale make it needless. A handle stopped at the view's edges, reaching one 5-minute mark past where
it was grabbed: growing a short entry took a let go per step. One stopped at the popup's edges: past a short entry's
view the popup leaves about half a minute, so the handle could not move at all. Entries cut at the view's ends, with
rounded or straight corners: drawn on to the popup's edges, the line reads more naturally.

**Cases:**

- A 10 min entry opened: a view of about 15 min, labelled every 5 min.

- A view of 9 h: labels every 2 hours; of 5 days: one per day, "lör 21"; of 20 days: weeks, "v. 48".

- A handle dragged past either end of the view: the popup never grows a sideways scrollbar.

- A handle held and dragged out of the app's window: it follows the pointer, on Linux and Windows.

## A clicked handle steps by the minute (2026-11-22)

**Decision:** a dragged handle snaps to 5 minutes of the clock, and to the entry's own start and end as it was where
those are nearer, so it can always go back exactly: an end at 19:47 dragged from 19:45 lands on 19:45, 19:47, then
19:50. Every dragged knob in the app, these handles and the colour picker's circle, is one size, 22 px, with no border
or ring, only a soft shadow, and filled with a neon: the picker's the neon of where it sits, the handles the neon of the
profile in colour, the new profile's in a filled gap. A handle clicked without moving grows into a pill about twice as
wide, with a soft bounce: it overshoots a little and settles, its height swelling by a fifth and settling with it, over
one and a half times the interface's speed (at once in Stilla); its bold − at its left end and + at its right fade in
once it has mostly grown, black, or white where black on the neon would fall below 4.5:1 contrast (WCAG: luminance from
linear RGB, then (lighter + 0.05) / (darker + 0.05)), which leaves white at about 4.6:1 or better, so the signs always
read; and a strip in its middle is left to drag it by. each moving the handle one minute that way, its time label above
following; the arrow keys do the same while it is open, and a held − or + repeats, faster the longer it is held.
Dragging the pill, a click anywhere else, or Esc shrinks it back to a circle; that Esc does not close the edit. One pill
is open at a time: clicking the other handle opens its own while the first shrinks back with the same bounce, and
clicking an open pill again changes nothing. When the handles are closer than a time label's width, the labels above
lean apart, the start's ending at its handle and the end's starting at its, so they never overlap; they move there at
once, with no easing. A step meets the same walls as a drag: another entry, now, and the break the parts must hold,
which turns the tag red. While shortening, a dragged handle keeps 5 minutes from the other, unless a wall is nearer, as
after steps have left an entry shorter; it never passes a wall to keep them. A gap's two edges keep no distance: the
other edge is a point the dragged one snaps to, even off the 5-minute marks, and meeting it closes the gap ("A gap
divides an entry"). A time set by the minute has its seconds at :00.

**Why:** in the Excel file the owner writes times to the nearest 5 minutes, so the drag places a time roughly and the
pill exactly, with nothing on the line until it is asked for. − and + point the way the handle moves on a line that runs
left to right, and growing from the handle itself leaves the label above free and puts nothing new beside it.

**Rejected:** a snap to the marks alone: an entry ending 19:47 could not be dragged back to its own end. − and + always
shown beside each handle: clutter. A ring or border around the knobs: a soft shadow is enough. Handles in the text
colour, or only the pill in neon: the two knobs are one thing and wear the same kind of fill. The labels easing apart:
the snap read as more coherent. Fading the label of the handle not being dragged: at rest both return and overlap again.
"+1" above the handle and "−1" below it: above is the time label, and up and down mean nothing on a timeline. Typing a
time, or the clock picker beside the line: a second way to set the same thing, away from the entry and its neighbours.

**Cases:**

- The "+" held down: one step, a pause, then steps coming faster.
- A pill open, the other handle clicked: the first shrinks back, the second opens, both bouncing.
- An open pill clicked again: nothing happens.
- A profile whose neon is `#3d5afe`: black on it is 4.1:1, so its pill's signs are white, at 5.1:1; on `#00e4fd` they
  are black, at 13.5:1.
- Handles 10 min apart: "10:00" ends at the start handle, "10:10" starts at the end handle.
- Shortened to 09:50–10:00, the end dragged left: it stops at 09:55. A gap 09:50–10:00, its right edge dragged left: it
  meets 09:50 and the gap closes.
- A pill open, Esc: the pill shrinks; Esc again: the edit closes.
