# Corrections: joining

How two entries of the same profile become one on the line. Each decision follows the template in `../README.md`, and is
cited by its title.

## Two entries join by docking (2026-11-19)

**Built by:** Corrections.

**Decision:** two entries of the same profile join on the line ("Editing an entry on its line"): a handle dragged to the
neighbour's near end docks there, and the gap between them fills in green as time added, the neighbour outlined 1 px
just outside it in the colour of the stretch reaching it, green, as a gap's edges about to meet are in the entry's own
("A gap divides an entry"). Let go there, the two are one entry from then on in the edit: the handle moves to the
neighbour's far end, the neighbour's own time shows as the entry's, only the stretch dragged across stays green, and the
view refits to the whole joined entry ("The line's view holds still while a handle is dragged"). Dragged back over the
neighbour, the handle trims it, its time taken away in red stripes as on any entry; dragged to the neighbour's far end
or past it, the join undoes itself and the neighbour is whole again, a wall as before, so a neighbour is never trimmed
away to nothing. The other handle passing over all of the neighbour lets it go whole too, and the entry walks on past
it: an entry docks, stretches past its neighbour, and brings its other handle over, to step across it; the time it
leaves behind shows red. Entries of the same profile that touch are one: a handle let go, or stepped by the minute ("A
clicked handle steps by the minute"), on the edge of such a neighbour takes it in, whichever way it was moving, and an
edit saved with two such entries touching saves them as one; so an entry walks back and forth past the same neighbour as
often as wanted, and one let go on its edge is taken in again. Each side keeps its joined neighbours in order, the
nearest first: dragged back, a handle lets them go outermost first, each a wall again that can be docked onto; the other
handle walking over lets them go nearest first. Every joined neighbour shows as part of the entry, and every meeting
point where two pieces touch with no gap has its thin line. An entry moved clear of where it started meets its original
as a neighbour of its own profile: the handle facing it stops at its near edge and docks there, and let go, the entry
takes its original time back, as any join takes a neighbour in. The meeting point is where the neighbour's colour meets
the green; with no gap between them, a thin line in the bar marks it. On confirm the two are saved as one entry, with a
reason as for any edit ("Every edit carries a reason"). A neighbour of another profile stays a stop, and nothing joins.
Either entry may be running; the joined entry then runs on, its end now with no handle, as a running entry's ("A running
entry is edited at its start"). Their added breaks add up into the joined entry's one break ("Time away is a gap or an
added break"). The joined entry is one entry for the counting: it owes its expected hours on the day it starts ("A day
owes its expected hours only when work started on it").

**Why:** joining fixes a stop that was not a break: the owner stops for a break, work comes up, and the entry is started
again later; the gap was work. Dragging across the gap is the move the hand makes anyway, and the stop at the neighbour
is already there, so joining needs no action of its own. Once let go, the edit shows the entry it will save, with a
handle at its real end. Touching meaning one, on the line and in the record, leaves no state where two entries show
docked but save apart, and no rule about which way a handle moved.

**Rejected:** a "join" action on two neighbouring entries picked in a list: one more control for what the line already
does, and the gap's time would not show as it is added. The handle left at the meeting point, or a notch there to split
the join again: something on the line to remember and explain, where dragging back past the neighbour does it. Undoing a
join only by "Avbryt": dragging back looked like an undo but deleted the neighbour's time. The joined neighbour all
green with the gap: the preview would say the total grows by the neighbour's length, when only the gap's minutes start
counting. A neighbour once walked past never joining again: an entry could not walk back. The original as empty air once
left: a handle could stop anywhere on it, and an entry moved away had no way back but "Avbryt". Only a handle moving
toward a neighbour taking it in, counted by whole steps: one stopping on an edge while walking away showed the two
docked yet kept its place, and a handle dragged back to a joined neighbour's far end trimmed it to nothing and deleted
it on save. A new entry pushed 5 minutes from a neighbour it was placed against: a forgotten entry often starts where
another ended. Merging a stop and a start clicked within the same minute: they are seconds apart, not touching, and the
undo puts a slip right.

**Revisit if:** joining is wanted between entries of different profiles.

**Cases:**

Walking:

- A new entry walked right past 10:00–11:00 and then past 12:00–13:00: each is let go whole in turn, nearest first.
- Walked past 10:00–11:00 and, in the same drag, back to its end and let go: taken in again.
- 08:00–10:00 walked right to 13:00–14:00, its start dragged back left: it stops and docks at 10:00; let go, the entry
  is 08:00–14:00, 10:00–13:00 green.

Profiles, breaks and colours through a chain:

- A new entry swallowing two janitor entries, 08:00–09:00 and 09:30–10:30, switched to "Utveckling", docked onto a
  development entry 11:00–12:00 and saved: one development entry 08:00–12:00; janitor work loses 2 h, development gains
  4 h, the gaps counted as development work.
- The same, before saving, a handle dragged back past 08:00–09:00: it is whole again as janitor work, a wall to the
  development entry.
- Joined entries with breaks of 20 and 15 min, divided by a gap: the 35 min shared out as for any divided entry.
- Through a chain: the joined pieces in the entry's colour, the stretches dragged across green, a trimmed piece red, a
  thin line where two pieces touch.
