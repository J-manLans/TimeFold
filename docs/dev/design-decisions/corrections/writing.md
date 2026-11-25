# Corrections: writing and deleting

How a whole forgotten entry is written by hand, and how an entry is removed. Each decision follows the template in
`../README.md`, and is cited by its title.

## A forgotten entry is written in the gap where it belongs (2026-11-25)

**Built by:** the docking patch, under **Next** in the roadmap, for a placed entry taking its neighbour in.

**Decision:** a forgotten entry is written from "Visa alla", in the gap between two entries. Each gap sits just above
its row, under the month's line where the row opens a month. At rest a gap is as thin as the rows' own spacing, with a
hover strip a little taller over the rows' edges. Resting on it for the peek's delay ("Editing an entry on its line"),
it opens evenly around the pointer, the rows above shifting up and the rows below down by half each, while a centred "+"
in the quiet text colour fades in and a thin line grows out of it to both sides; the shift is of the rows' look only, so
nothing farther off moves. A gap has a "+" only if it has room for the smallest entry, 5 minutes, the line's snap; a
smaller one, such as between entries from start and stop clicked in quick succession, is spaced as rows that touch, with
nothing to click. One "+" always shows, on the first gap with that room: over the newest finished row, its gap up to
now, or further down when there is none there, as just after a stop, or below a running entry after a switch of profile.
That gap stays open and takes no part in the shifting; hovered, its line grows at once and its "+" turns from grey to
the text colour. In Stilla nothing slides and the "+" and line just appear. Rows that touch keep the same space, with
nothing to click. A click opens the edit popup on that gap's stretch of time: the always-shown gap over the newest row
runs from it to the moment it is clicked, any other from the older entry's end to the newer one's start; the entries
either side show hatched, as neighbours, and there is no "Ta bort". The first click in free time drops a 30-minute entry
centred on the click, snapped to 5 minutes, sliding away from a wall it meets so it keeps its length, and filling the
free time exactly when that is shorter; the view fits it, with a neighbour it takes in ("The line's view holds still
while a handle is dragged"); further clicks on the empty line do nothing. Touching a neighbour of its profile, it takes
it in as any entry does ("Two entries join by docking"): its own stretch green as time added, its handle at the
neighbour's far end; before a running entry of its profile it stops short of touching ("A running entry is edited at its
start"). A gap filled between two entries of its profile so joins all three, with no rule of its own. From then on it is
edited as any entry: its handles, the pill, its break, its profile, which starts on the active profile, and a reason
("Every edit carries a reason"). It is moved by dragging its middle, or walked past a neighbour ("Two entries join by
docking"); anything else, "Avbryt" and start over. A new entry has no original: the view fits it and what it has taken
in, at the usual share, wherever it is walked, and alone nothing of it shows as added or taken away. Saved, it is marked
written by hand ("Entries remember how they were made").

**Why:** a forgotten entry belongs between two known ones, so the gap clicked says when, with no way to travel the line
to another day. The one always visible "+" keeps the rule that the app shows what it can do, and its line growing on
hover teaches the hidden ones between the rows. Waiting the peek's delay there keeps the lines from flickering as the
pointer crosses the list. A thin gap that opens only for a rested pointer makes adding an entry a deliberate act, never
an accident, and opening evenly keeps the gap under the pointer. Most forgotten entries are longer than a few minutes,
so thirty needs less dragging; sliding off a wall keeps its length, and a short gap is almost always the time forgotten.
Taken in at once, the line shows what the save will be: no handle sits where the entry no longer ends.

**Rejected:** a "+" only where a full 30-minute entry fits: a shorter forgotten entry of another profile, such as 20
minutes of development between two janitor entries, could not be written in its gap. The top "+" kept over the newest
row right after a stop: with less than 5 minutes up to now its line takes no entry, and stretching the newest entry is
done by editing it. "+ Lägg till" in words at the top: one style for every gap reads as one thing. A fixed, wider gap
between every row: the list spread out, and a gap was too easy to hit. A gap widening downward only: it grew away from
the pointer. The always-shown gap shifting the rows too: with nothing to open, it only made work. A "Lägg till" button
opening the line on today: another day would need a way to travel the line. Every "+" shown on hover only: nothing would
say entries can be added. The delay on the top "+": it is already in view, and resting on it is meant. A "+" on any gap
wider than nothing: a gap of a few seconds opened a line with no room for any entry. A second click in free time moving
the new entry there: a second way to move it, where dragging and walking already do. Ten minutes to start: most
forgotten entries are longer, and it was judged while a short entry's handles could not grow it. Cut short by a wall
instead of sliding: it shrank on one side only. A placed entry docked but not taken in, its handles on its own edges: it
was a short drag to move off, but the handle said the entry ended where it touched while the colours said it was joined.
A rule of its own for a gap filled between two entries of its profile: docking already joins them, as docking one onto
the other would.

**Cases:**

- Newest entry Thursday 11:40–13:05, now 15:20: the "+" at the top opens the line on 13:05–15:20.
- Janitor work running since 14:00 after 11:40–13:05: no "+" above it; the always-shown "+" sits between the two and
  opens on 13:05–14:00.
- The gap between 08:00–11:40 and 13:05–16:00, hovered: after a quarter second a line and "+" show; clicked, the line
  opens on 11:40–13:05.

- Start and stop clicked a few times in a row: entries of a few seconds, each reading 0:00, gaps of seconds between them
  with no "+"; the always-shown "+" is the first gap below them with 5 minutes' room.
- A new entry walked from 09:00 past a neighbour to 14:00–14:30: the view fits only 14:00–14:30.
- Saved with "Glömd post": the row shows "e", and "Visa alla" "tillagd: Glömd post".

## An entry is deleted from its edit (2026-11-22)

**Decision:** an entry is deleted with "Ta bort" in its edit popup. It asks once, "Ta bort?", in removal red, and the
second click deletes it ("The look: a fresh display face, mono text and soft buttons"); a click or the focus going
elsewhere turns it back. A delete needs no reason ("Every edit carries a reason").

**Why:** the edit popup is where an entry is looked at whole, so it is where it goes; the one extra click guards it, as
"Rensa" guards a prune.

**Rejected:** deleting from the row in the list: a stray click would remove an entry unseen.

**Cases:**

- "Ta bort" clicked once: "Ta bort?" in red; a click on the line: back to "Ta bort"; clicked twice: the entry is gone
  and the balance follows.
