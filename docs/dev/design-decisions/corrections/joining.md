# Corrections: joining

How two entries of the same profile become one on the line. Each decision follows the template in `../README.md`, and is
cited by its title.

## Two entries join by docking (2026-11-19)

**Built by:** Corrections.

**Decision:** two entries of the same profile join on the line ("Editing an entry on its line"): a handle dragged to the
neighbour's near end docks there, and the gap between them fills in green as time added. Let go there, the two are one
entry from then on in the edit: the handle moves to the neighbour's far end, the neighbour's own time shows as the
entry's, only the stretch dragged across stays green, and the view refits to the whole joined entry ("The line's view
holds still while a handle is dragged"). Dragged back over the neighbour, the handle trims it, its time taken away in
red stripes as on any entry; dragged past the neighbour's end, the join undoes itself and the neighbour is whole again,
a wall as before. The other handle passing over all of the neighbour lets it go whole too, and the entry walks on past
it: an entry docks, stretches past its neighbour, and brings its other handle over, to step across it; the time it
leaves behind shows red, and only what a handle is dragged into joins: a neighbour is taken in on release only if the
handle touching it was moving toward it, so a handle walking away and stopping on an edge takes nothing in, and an entry
walks back and forth past the same neighbour as often as wanted. An entry moved clear of where it started meets its
original as a neighbour of its own profile: the handle facing it stops at its near edge and docks there, and let go, the
entry takes its original time back, as any join takes a neighbour in. The meeting point is where the neighbour's colour
meets the green; with no gap between them, a thin line in the bar marks it. On confirm the two are saved as one entry,
with a reason as for any edit ("Every edit carries a reason"). A neighbour of another profile stays a stop, and nothing
joins. Either entry may be running; the joined entry then runs on. Their added breaks on the same day add up into the
joined entry's one break for that day ("Time away is a gap or an added break"). The joined entry is one entry for the
counting: it owes its expected hours on the day it starts ("A day owes its expected hours only when work started on
it").

**Why:** joining fixes a stop that was not a break: the owner stops for a break, work comes up, and the entry is started
again later; the gap was work. Dragging across the gap is the move the hand makes anyway, and the stop at the neighbour
is already there, so joining needs no action of its own. Once let go, the edit shows the entry it will save, with a
handle at its real end.

**Rejected:** a "join" action on two neighbouring entries picked in a list: one more control for what the line already
does, and the gap's time would not show as it is added. The handle left at the meeting point, or a notch there to split
the join again: something on the line to remember and explain, where dragging back past the neighbour does it. Undoing a
join only by "Avbryt": dragging back looked like an undo but deleted the neighbour's time. The joined neighbour all
green with the gap: the preview would say the total grows by the neighbour's length, when only the gap's minutes start
counting. A neighbour once walked past never joining again: an entry could not walk back. The original as empty air once
left: a handle could stop anywhere on it, and an entry moved away had no way back but "Avbryt".

**Revisit if:** joining is wanted between entries of different profiles.

**Cases:**

- 08:00–10:00 and 10:25–12:00, same profile, the first's end docked on the second: 08:00–12:00, one entry.
- The same with the second running: one entry from 08:00, still running.
- The first's end docked on the second and let go: the handle moves to 12:00, 10:00–10:25 stays green, and the view fits
  08:00–12:00.
- A new 10 min entry at 09:00–09:10 docked onto 09:10–10:00, stretched to 10:30, its start dragged past 10:00: the
  neighbour is whole again, and the new entry is 10:00–10:30.
- 08:00–10:00 walked right to 13:00–14:00, its start dragged back left: it stops and docks at 10:00; let go, the entry
  is 08:00–14:00, 10:00–13:00 green.
- That handle dragged back to 11:00: 11:00–12:00 in red stripes; on to 10:20, past the neighbour's start: the join
  undoes itself, 10:25–12:00 is whole again, and the handle is at 10:20 with 10:00–10:20 green.
- Paus 15min on the first and paus 20min on the second, the same day, joined: one entry with paus 35min.
- 08:00–10:00 and an entry of another profile from 10:25: the handle stops at 10:25, nothing joins.
