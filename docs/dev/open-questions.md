# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here. Each
entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question leaves;
its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

## Phase 3: Corrections

### Joining two entries (2026-11-14)

Removing a gap between two entries, such as after a stop and start by mistake. Options: dragging one entry's handle to
meet the other on the line, which then join; or a "join" action on two neighbouring entries of the same profile.

**See:** Editing an entry on its line.

### Deleting an entry, and writing a forgotten one (2026-11-14)

How an entry is removed, and how a whole forgotten entry is written by hand. Known: a delete asks "Ta bort?" and needs
no reason ("Every edit carries a reason"). A new entry could be drawn on a line in free time, with the same stops at
other entries and midnight.

**See:** Editing an entry on its line.

### Exact minutes on the line (2026-11-14)

Whether the handles snap (such as to 5 minutes), and whether a time can also be typed or set with the clock picker for
precision. The clock picker, from the owner's first draft, is an analogue 24-hour dial: the hours on an inner and an
outer ring, the minutes picked in a second step, with no AM/PM and no digital fields. It was meant for editing; the line
may replace it there, or work beside it. The owner's idea, to try on the prototype: − and + at the chosen handle, one
minute per press, its time shown between them; the arrow keys could do the same, and holding a button repeat.

**See:** Editing an entry on its line.

### The line's zoom (2026-11-18)

With no wall at midnight, a handle can be dragged towards a neighbour days away, and a view that follows it exactly
would pump in and out as the handle moves back and forth. The owner's idea, to try on the prototype: the flex bar's
logic, the view growing when the handle nears its edge and shrinking only once it is well back.

**See:** Editing an entry on its line; The flex bar.

## Phase 4: Profiles

### Whose the opening ceiling hours are (2026-11-15)

The ceiling wheel lights the pieces worked by the profile on screen and fades the rest ("The ceiling wheel"). The hours
of the current month's ceiling already used before the other work's profiles come to the app have to be asked somewhere,
and the fresh start no longer asks them ("A first install starts fresh or imports"). The owner's idea, to think over:
each profile added from the menu asks how much of the month's ceiling it has already used, and those hours are its own,
lit for it on the wheel.

**See:** The ceiling wheel; A first install starts fresh or imports.

### The pay estimate before or after tax (2026-11-16)

The pay estimate shows the month's pay before tax ("A pay estimate per profile"). The owner wants a "Före skatt"
checkbox, checked by default; unchecked, the estimate would show pay after tax, from a simple formula rather than tax
rules. Open: where the checkbox sits (the menu, or by the number), and what the formula is.

**See:** A pay estimate per profile.

## Phase 6: Reports

### Where the report is made from (2026-11-16)

The report has its own choices (the month, maybe a preview), so it needs a place in the app. The owner's lean: its own
tab in the menu, beside the Phase 4 tabs. Not drawn in the prototype.

**See:** The report is a PDF; A report covers one month; The menu has tabs, with every value locked behind "Ändra".

## Debugging (any phase)

### A permanent log (2026-11-16)

A bug that shows once, on a real day, leaves no trail unless the app writes one as it runs. Options: a small permanent
log of key events (opening the record, each save, each error) in the app's data folder, kept short like the daily
copies; or no permanent log, only temporary logging added during a hunt (`procedures/debugging.md`). Lean, the agent's:
the small permanent log, since a time tracker's worst bugs, such as a lost entry, are the rare ones.

**See:** Rust touches the disk; TypeScript knows the record; The record is one JSON file.
