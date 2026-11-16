# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here. Each
entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question leaves;
its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

## Phase 1: Clocking

### The question for a running entry from an earlier day: where, how, and after midnight (2026-11-17)

"A running entry from an earlier day asks" settles what happens ("Fortfarande igång" runs on; "Jag slutade …" sets the
end), but not three things about the screen, raised as it was to be drawn:

1. Where it sits: the decision says a popup centred on the controls side, but the menu's locked panel has since become
   the place for screens that start the app ("A first install starts fresh or imports"; "A record that cannot be read
   offers the newest copy"), keeping the dashboard in full view.
2. How the end is given: the decision's clock picker, an analogue 24-hour dial never drawn and itself in doubt ("Exact
   minutes on the line"), or the onboarding's lone caret, a typed time such as `23:10` with its reading under it. The
   agent's lean: typed, as already built, exact, and enough for a screen seen a few times a year.
3. A time after midnight: an entry started yesterday at 21:30 and `01:30` typed is today's 01:30, but the rule is not
   written; and an end past now cannot be.

**See:** A running entry from an earlier day asks; Entering a length of time.

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

The ceiling wheel lights the pieces worked by the profile on screen and fades the rest ("The ceiling wheel"). The hours
of the current month's ceiling already used when the owner switches from Excel have to be asked somewhere, and the fresh
start no longer asks them ("A first install starts fresh or imports"). The owner's idea, to think over: each profile
added from the menu asks how much of the month's ceiling it has already used, and those hours are its own, lit for it on
the wheel.

**See:** The ceiling wheel; A first install starts fresh or imports.

### The pay estimate before or after tax (2026-11-16)

The pay estimate shows the month's pay before tax ("A pay estimate per profile"). The owner wants a "Före skatt"
checkbox, checked by default; unchecked, the estimate would show pay after tax, from a simple formula rather than tax
rules. Open: where the checkbox sits (the menu, or by the number), and what the formula is.

**See:** A pay estimate per profile.

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
