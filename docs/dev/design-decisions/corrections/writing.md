# Corrections: writing and deleting

How a whole forgotten entry is written by hand, and how an entry is removed. Each decision follows the template in
`../README.md`, and is cited by its title.

## A forgotten entry is written in the gap where it belongs (2026-11-22)

**Built by:** Corrections.

**Decision:** a forgotten entry is written from "Visa alla", in the gap between two entries. Over the newest row, a
quiet "+ Lägg till" always shows; resting on it, a line grows from it at once. Between any two rows the same thin line
shows, with a "+", once the pointer has rested there for the peek's delay ("Editing an entry on its line"). A click
opens the edit popup on that gap's stretch of time: the newest row's gap runs from it to now, any other from the older
entry's end to the newer one's start; the entries either side show hatched, as neighbours, and there is no "Ta bort".
The first click in free time drops a 10-minute entry centred on the click, cut short by any wall, and the view fits it
("The line's view holds still while a handle is dragged"); further clicks on the empty line do nothing. From then on it
is edited as any entry: its handles, the pill, its break, its profile, which starts on the active profile, and a reason
("Every edit carries a reason"). It is moved by dragging its middle, or walked past a neighbour ("Two entries join by
docking"); anything else, "Avbryt" and start over. Saved, it is marked written by hand ("Entries remember how they were
made").

**Why:** a forgotten entry belongs between two known ones, so the gap clicked says when, with no way to travel the line
to another day. The one always visible "+" keeps the rule that the app shows what it can do, and its line growing on
hover teaches the hidden ones between the rows. Waiting the peek's delay there keeps the lines from flickering as the
pointer crosses the list. Ten minutes fills the line once fitted, as any entry does, and is dragged out to its length.

**Rejected:** a "Lägg till" button opening the line on today: another day would need a way to travel the line. Every "+"
shown on hover only: nothing would say entries can be added. The delay on the top "+": it is already in view, and
resting on it is meant. A second click in free time moving the new entry there: a second way to move it, where dragging
and walking already do. Thirty minutes to start: on a fitted line, ten is as easy to grab.

**Cases:**

- Newest entry Thursday 11:40–13:05, now 15:20: "+ Lägg till" opens the line on 13:05–15:20.
- The gap between 08:00–11:40 and 13:05–16:00, hovered: after a quarter second a line and "+" show; clicked, the line
  opens on 11:40–13:05.
- In that gap, a click at 12:30: 12:25–12:35, the view fitting it; at 11:42: 11:40–11:50, cut at the wall.
- A click inside an existing entry: nothing is placed.
- Saved with "Glömd post": the row shows "e", and "Visa alla" "tillagd: Glömd post".

## An entry is deleted from its edit (2026-11-22)

**Built by:** Corrections.

**Decision:** an entry is deleted with "Ta bort" in its edit popup. It asks once, "Ta bort?", in removal red, and the
second click deletes it ("The look: a fresh display face, mono text and soft buttons"); a click or the focus going
elsewhere turns it back. A delete needs no reason ("Every edit carries a reason").

**Why:** the edit popup is where an entry is looked at whole, so it is where it goes; the one extra click guards it, as
"Rensa" guards a prune.

**Rejected:** deleting from the row in the list: a stray click would remove an entry unseen.

**Cases:**

- "Ta bort" clicked once: "Ta bort?" in red; a click on the line: back to "Ta bort"; clicked twice: the entry is gone
  and the balance follows.
