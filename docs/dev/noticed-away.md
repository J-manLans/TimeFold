# Noticed away from the computer

What the owner notices while away from the computer, to be dealt with when back at it: bugs seen in the app and changes
to try in the prototype. Each item says what was seen, the rule it breaks or the change agreed, and what is to be done.
An item leaves once it is done, its decisions in their area's file in `design-decisions/` and its steps in the roadmap.
Nothing decided lives only here.

## A dragged handle leaves the line, and the edit popup scrolls

**Seen:** in the edit popup, a handle dragged past the view's edge stops there, but with the pointer held further out it
creeps on, one 5-minute step per pointer move, out of the line and the popup. Dragged to the right, the popup grows a
horizontal scrollbar; to the left it does not.

**Cause, read in the code, not run:** `dragTo` in `src/lib/modules/edit/line.ts` lets a handle reach the next mark past
it even just outside the view (`markPast(state.end, 1)`, `markPast(state.start, -1)`), counted from where the handle is
now, so each move moves the limit one step further. The popup's card has `overflow: auto` (`EditPopup.svelte`), and
browsers scroll to content past the right edge but never past the left, hence the one-sided scrollbar.

**Agreed:**

1. Nothing drawn on the line makes the popup scroll sideways, whichever way. It may still scroll in height.
2. As built today, a handle reaches at most the next 5-minute mark past the view's edge, counted from where it was when
   grabbed; further takes a let go and another drag. This is the fix if the prototype keeps "Ett steg" below.

**To try in the prototype, as two controls in its toolbar:**

1. **The line's ends:** entries cut at the view's ends with rounded corners (as today) / with straight edges / drawn on
   past the line's ends, at the same scale, out to the popup's edges. It applies to every entry partly in view, the one
   edited and its neighbours alike. Drawn to the popup's edges, the line needs a wrapper that clips sideways but not in
   height (`overflow-x: clip`), so no scrollbar comes back.
2. **A drag past the view's edge:** one step (as today) / under the pointer: the handle follows the pointer at the
   line's scale past the view's end, snapping to the 5-minute marks and the entry's own original edges, stopping at the
   same walls as inside the view (another entry, now, the break), and at the popup's edge at the furthest; the view
   refits on let go. Under the pointer only shows the handle with the ends drawn out to the popup's edges; cut at the
   view, the handle goes out of sight as it passes the end.

**Then:** the owner tunes the two controls; what is chosen goes to "The line's view holds still while a handle is
dragged", in `design-decisions/`, and its fix to the roadmap, then built in debug mode.
