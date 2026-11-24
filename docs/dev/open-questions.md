# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here. Each
entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question leaves;
its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

## Phase 4: Profiles

### A click outside a locked value in the menu (2026-11-22)

A length field keeps what is typed on a click away, and only Esc cancels ("Entering a length of time"). The menu's
values behind "Ändra" still abort on a click outside, so that future counts do not move by a stray click ("The menu has
tabs, with every value locked behind "Ändra""). The owner wants the menu aligned with the rest of the app; open is how,
since a value kept by a stray click there has no undo.

**See:** Entering a length of time; The menu has tabs, with every value locked behind "Ändra".

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
rules. Open: where the checkbox sits (the menu, or by the number), and what the formula is. Known: a month's salary is
paid on its 15th, so December's is paid on 15 December; hourly pay for the other work may come a month after the hours,
which the estimate may need to say. In Finland the tax card (verokortti) gives a withholding percentage, and an extra
one above a yearly income limit: a candidate for the formula.

**See:** A pay estimate per profile.

## Phase 5: Handover

### How the question before an import reads (2026-11-23)

The import asks before it replaces the record, showing when the file was made and when this machine's data last changed
("Handover between machines"), with "Ersätt" and "Avbryt". A draft of the text: "Importen ersätter allt på den här
datorn.", then "Filen skapades: mån 23 nov, 18:42" and "Den här datorn ändrades senast: mån 23 nov, 17:10". Not
"rapport", which is the month's PDF. Open: whether the dates are coloured, such as the base colour for a date that is
fine and the neon, or a warning colour, for the newer one. The record holds neither date yet: the export writes its own
time into the file, since a file's time on disk changes when it is mailed or downloaded, and the record needs a time of
its last change. **See:** "Handover between machines", "The record is one JSON file".

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
