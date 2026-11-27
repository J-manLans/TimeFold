# Open questions

What is not decided, grouped under the phase that needs the answer, so a phase's **Settle first** can point here. Each
entry: what is known, the options, the date raised, and **See:** the decisions it touches. An answered question leaves;
its answer goes to `design-decisions/`. A question half answered stays with what is left of it.

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

## Later, phase not chosen

### A second profile with a balance (2026-11-26)

Janitor is the only profile with expected hours, and so the only balance ("The other profiles share a ceiling"). The
owner's record shows Utveckling steadily near 60% of the ceiling, so it could have expected hours of its own and flex as
janitor does, rather than be counted against the ceiling. It would undo "janitor is the only balance": the ceiling would
be what is left after both, the report would carry a second balance, and the screen a second bar, or one bar following
the profile on screen as the wheel does. Not in Phase 4, which is built on one balance. Open: whether it is wanted, and
in which phase.

**See:** The other profiles share a ceiling; Profiles label the hours; The flex bar; A report covers one month.

### Overtime pay in the estimate (2026-11-26)

The estimate counts a salary once a month and the other profiles' hours times their rates, with no extra for overtime
("A pay estimate per profile"). The owner wants the estimate to follow the real rules, per day and per week as the
collective agreement and the law count them, not a monthly simplification; not in Phase 4, since nothing built before it
gets in its way. Open: which phase, and what payroll answers below; "A pay estimate per profile" changes with it.

What the owner has said: janitor's flex hours are his to balance and never overtime; the other profiles' work is for the
same employer, ordered by it, and counts toward the same full time; janitor always counts as its expected hours (6 h a
weekday), whatever was worked, flex days included, and the other profiles' hours count on top. Hours beyond janitor's
but within full time are paid at each profile's rate; past full time, or past the daily or weekly limits of the
collective agreement and the law, as overtime under them.

The collective agreement, the private education sector's for administrative and support staff, 7.4.2026–31.3.2028
(sivista.fi, `YOA-HTP-TES-2026-2028.pdf`): regular time for non-office work is at most 38 h 15 min a week and on average
9 h a day (2 §). Lisätyö, between 38 h 15 min and the law's 40 h a week, is paid at +50% for full-timers and at the
plain hourly rate for part-timers (8 § 1). Daily overtime, past the law's 8 h a day or a longer day in the roster: the
first 2 h at +50%, then +100% (8 § 2). Weekly overtime, past 40 h a week and not daily overtime: the first 8 h at +50%,
then +100% (8 § 3). A monthly salary's hourly rate is the salary ÷ 163 (13 §). Lisätyö and overtime may be taken as time
off or into a time bank, at the same percentages (8 § 5, 14 §). Flex time is not in the agreement; under the Working
Hours Act, lisätyö and overtime are work done on the employer's initiative (the agent's reading, not checked against the
act).

The counting it gives, from the owner's rule: each day, 6 h plus the other profiles' hours; past 8 h, those are daily
overtime. Each week, 30 h plus the other profiles' hours not already daily overtime: up to 38 h 15 min at their rates,
38 h 15 min to 40 h lisätyö, past 40 h weekly overtime. Every premium is on the rate of the profile that worked the
hours, so janitor's salary never enters it. Overtime is counted per day and week, while the ceiling is counted per
month.

To check with payroll: whether janitor counting as 6 h a day whatever was worked is accepted (the law counts hours
worked); whether lisätyö is paid at +50% or the plain rate, since janitor alone is part-time and the total can reach
full time; and whether there is a roster with longer days, or the law's 8 h applies.

**See:** A pay estimate per profile; The other profiles share a ceiling.

## Debugging (any phase)

### A permanent log (2026-11-16)

A bug that shows once, on a real day, leaves no trail unless the app writes one as it runs. Options: a small permanent
log of key events (opening the record, each save, each error) in the app's data folder, kept short like the daily
copies; or no permanent log, only temporary logging added during a hunt (`procedures/debugging.md`). Lean, the agent's:
the small permanent log, since a time tracker's worst bugs, such as a lost entry, are the rare ones.

**See:** Rust touches the disk; TypeScript knows the record; The record is one JSON file.
