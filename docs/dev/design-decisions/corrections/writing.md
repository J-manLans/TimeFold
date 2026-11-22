# Corrections: writing and deleting

How a whole forgotten entry is written by hand, and how an entry is removed. Each decision follows the template in
`../README.md`, and is cited by its title.

## A forgotten entry is written in the gap where it belongs (2026-11-22)

**Built by:** Corrections.

**Decision:** a forgotten entry is written from "Visa alla", in the gap between two entries. Each gap sits just above
its row, under the month's line where the row opens a month. At rest a gap is as thin as the rows' own spacing, with a
hover strip a little taller over the rows' edges. Resting on it for the peek's delay ("Editing an entry on its line"),
it opens evenly around the pointer, the rows above shifting up and the rows below down by half each, while a centred "+"
in the quiet text colour fades in and a thin line grows out of it to both sides; the shift is of the rows' look only, so
nothing farther off moves. One "+" always shows: over the newest finished row, its gap up to now, or with an entry
running, the first gap below it with room, since a switch of profile leaves none right under it. That gap stays open and
takes no part in the shifting; hovered, its line grows at once and its "+" turns from grey to the text colour. In Stilla
nothing slides and the "+" and line just appear. Rows that touch keep the same space, with nothing to click. A click
opens the edit popup on that gap's stretch of time: the always-shown gap over the newest row runs from it to the moment
it is clicked, so it shows even just after a stop, any other from the older entry's end to the newer one's start; the
entries either side show hatched, as neighbours, and there is no "Ta bort". The first click in free time drops a
10-minute entry centred on the click, cut short by any wall, and the view fits it ("The line's view holds still while a
handle is dragged"); further clicks on the empty line do nothing. From then on it is edited as any entry: its handles,
the pill, its break, its profile, which starts on the active profile, and a reason ("Every edit carries a reason"). It
is moved by dragging its middle, or walked past a neighbour ("Two entries join by docking"); anything else, "Avbryt" and
start over. A new entry has no original: the view fits it alone, at the usual share, wherever it is walked, and nothing
of it shows as added or taken away. Saved, it is marked written by hand ("Entries remember how they were made").

**Why:** a forgotten entry belongs between two known ones, so the gap clicked says when, with no way to travel the line
to another day. The one always visible "+" keeps the rule that the app shows what it can do, and its line growing on
hover teaches the hidden ones between the rows. Waiting the peek's delay there keeps the lines from flickering as the
pointer crosses the list. A thin gap that opens only for a rested pointer makes adding an entry a deliberate act, never
an accident, and opening evenly keeps the gap under the pointer. Ten minutes fills the line once fitted, as any entry
does, and is dragged out to its length.

**Rejected:** "+ Lägg till" in words at the top: one style for every gap reads as one thing. A fixed, wider gap between
every row: the list spread out, and a gap was too easy to hit. A gap widening downward only: it grew away from the
pointer. The always-shown gap shifting the rows too: with nothing to open, it only made work. A "Lägg till" button
opening the line on today: another day would need a way to travel the line. Every "+" shown on hover only: nothing would
say entries can be added. The delay on the top "+": it is already in view, and resting on it is meant. A second click in
free time moving the new entry there: a second way to move it, where dragging and walking already do. Thirty minutes to
start: on a fitted line, ten is as easy to grab.

**Cases:**

- Newest entry Thursday 11:40–13:05, now 15:20: the "+" at the top opens the line on 13:05–15:20.
- Janitor work running since 14:00 after 11:40–13:05: no "+" above it; the always-shown "+" sits between the two and
  opens on 13:05–14:00.
- The gap between 08:00–11:40 and 13:05–16:00, hovered: after a quarter second a line and "+" show; clicked, the line
  opens on 11:40–13:05.
- In that gap, a click at 12:30: 12:25–12:35, the view fitting it; at 11:42: 11:40–11:50, cut at the wall.
- A click inside an existing entry: nothing is placed.
- A new entry walked from 09:00 past a neighbour to 14:00–14:10: the view fits only 14:00–14:10.
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
