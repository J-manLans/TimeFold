# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here. Each
entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question leaves;
its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

## Phase 2: Breaks and flex days

### Where a flex day is marked (2026-11-14)

A flex day, for one day or a range, takes the expected hours off the balance with one action ("A day owes its expected
hours only when work started on it"). Where that action lives is open: in the menu, from the "Visa alla" popup on a
chosen day, or beside "Lägg till paus". Not drawn in the prototype.

**See:** A day owes its expected hours only when work started on it; The main screen has a controls side and a
dashboard.

## Phase 3: Corrections

### Joining two entries (2026-11-14)

Removing a gap between two entries, such as after a stop and start by mistake. Options: dragging one entry's handle to
meet the other on the line, which then join; or a "join" action on two neighbouring entries of the same profile.

**See:** Editing an entry on its line.

### Deleting an entry, and writing a forgotten one (2026-11-14)

How an entry is removed, and how a whole forgotten entry is written by hand. A new entry could be drawn on a line in
free time, with the same stops at other entries and midnight.

**See:** Editing an entry on its line.

### Exact minutes on the line (2026-11-14)

Whether the handles snap (such as to 5 minutes), and whether a time can also be typed or set with the clock picker for
precision. The clock picker, from the owner's first draft, is an analogue 24-hour dial: the hours on an inner and an
outer ring, the minutes picked in a second step, with no AM/PM and no digital fields. It was meant for editing; the line
may replace it there, or work beside it.

**See:** Editing an entry on its line.

## Phase 4: Profiles

### Whose the opening ceiling hours are (2026-11-15)

The ceiling wheel lights the pieces worked by the profile on screen and fades the rest ("The ceiling wheel"). The
ceiling hours typed in at a fresh start ("A first install starts fresh or imports") come without a profile. Options:
faded for every profile, as nobody's; or the onboarding asks which profile they belong to.

**See:** The ceiling wheel; A first install starts fresh or imports.

## Phase 6: Reports

### Where the report is made from (2026-11-16)

The report has its own choices (the month, maybe a preview), so it needs a place in the app. The owner's lean: its own
tab in the menu, beside the two Phase 4 builds. Not drawn in the prototype.

**See:** The report is a PDF; A report covers one month; The menu has two tabs, with every value locked behind "Ändra".

## Debugging (any phase)

### A permanent log (2026-11-16)

A bug that shows once, on a real day, leaves no trail unless the app writes one as it runs. Options: a small permanent
log of key events (opening the record, each save, each error) in the app's data folder, kept short like the daily
copies; or no permanent log, only temporary logging added during a hunt (`procedures/debugging.md`). Lean, the agent's:
the small permanent log, since a time tracker's worst bugs, such as a lost entry, are the rare ones.

**See:** Rust touches the disk; TypeScript knows the record; The record is one JSON file.
